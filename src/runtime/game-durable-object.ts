import type { LegacyPlayerRecord } from "../legacy/player";
import type { LegacyMapItem } from "../legacy/item";
import { LEGACY_INFINITE_DURABILITY, emptyLegacyItem, isLegacyItemEmpty, type LegacyItem } from "../legacy/item";
import { executeLegacyAssault } from "../legacy/battle-runtime";
import { cryptoLegacyRandom } from "../legacy/random";
import { readLegacyPlayerInventory, writeLegacyPendingItem } from "../legacy/player-inventory";
import { runLegacyPlayerCommand } from "../legacy/command-runtime";
import { SupabaseLegacyRest, SupabaseMatchSnapshots } from "./supabase";

export interface LegacyMatchState {
  matchId: number;
  gamestate: number;
  gametype: number;
  players: Record<string, LegacyPlayerRecord>;
  availableAreas: number[];
  forbiddenAreas: number[];
  areaNames: string[];
  mapItems?: LegacyMapItem[];
  weatherId?: number;
}

export interface StoredLegacyMatch { version: number; state: LegacyMatchState; }
interface LegacyGameObjectEnv extends Cloudflare.Env { SUPABASE_URL?: string; SUPABASE_SECRET_KEY?: string; }
interface GameCommandBody {
  username: string;
  mode?: string;
  command: string;
  input?: Record<string, string>;
  now: number;
  requestStartMs?: number;
}
interface GameBattleBody {
  username: string;
  target: string;
  active?: boolean;
  weatherId?: number;
  now: number;
}
interface GameRestoreBody { matchId: number; }
interface GameCorpseBody { username: string; target: string; item: string; now: number; }

const json = (value: unknown, status = 200): Response => Response.json(value, { status, headers: { "cache-control": "no-store" } });
const numberField = (player: LegacyPlayerRecord, key: keyof LegacyPlayerRecord): number => Number(player[key] ?? 0);
const textField = (player: LegacyPlayerRecord, key: keyof LegacyPlayerRecord): string => String(player[key] ?? "");

function takeCorpseItem(corpse: LegacyPlayerRecord, position: string): LegacyItem | null {
  if (position === "wep") {
    const item = { itm: textField(corpse, "wep"), itmk: textField(corpse, "wepk"), itme: numberField(corpse, "wepe"), itms: corpse.weps, itmsk: textField(corpse, "wepsk") };
    if (isLegacyItemEmpty(item) || item.itmk === "WN") return null;
    Object.assign(corpse, { wep: "拳头", wepk: "WN", wepe: 0, weps: LEGACY_INFINITE_DURABILITY, wepsk: "" });
    return item;
  }
  if (/^ar[bhaft]$/.test(position)) {
    const slot = position as "arb" | "arh" | "ara" | "arf" | "art";
    const item = {
      itm: textField(corpse, slot), itmk: textField(corpse, `${slot}k` as keyof LegacyPlayerRecord),
      itme: numberField(corpse, `${slot}e` as keyof LegacyPlayerRecord), itms: corpse[`${slot}s` as keyof LegacyPlayerRecord],
      itmsk: textField(corpse, `${slot}sk` as keyof LegacyPlayerRecord)
    };
    if (isLegacyItemEmpty(item) || item.itmk === "DN") return null;
    corpse[slot] = "";
    corpse[`${slot}k` as keyof LegacyPlayerRecord] = "";
    corpse[`${slot}e` as keyof LegacyPlayerRecord] = 0;
    corpse[`${slot}s` as keyof LegacyPlayerRecord] = 0;
    corpse[`${slot}sk` as keyof LegacyPlayerRecord] = "";
    return item;
  }
  if (/^itm[1-6]$/.test(position)) {
    const slot = Number(position.slice(3));
    const inventory = readLegacyPlayerInventory(corpse);
    const item = inventory[slot - 1];
    if (!item || isLegacyItemEmpty(item)) return null;
    inventory[slot - 1] = emptyLegacyItem();
    const prefix = `itm${slot}` as keyof LegacyPlayerRecord;
    corpse[prefix] = "";
    corpse[`itmk${slot}` as keyof LegacyPlayerRecord] = "";
    corpse[`itme${slot}` as keyof LegacyPlayerRecord] = 0;
    corpse[`itms${slot}` as keyof LegacyPlayerRecord] = 0;
    corpse[`itmsk${slot}` as keyof LegacyPlayerRecord] = "";
    return item;
  }
  return null;
}

/** Serialized command.php state for one active game/match. */
export class LegacyGameDurableObject {
  #match: StoredLegacyMatch | undefined;
  #queue: Promise<void> = Promise.resolve();
  readonly ctx: DurableObjectState;
  readonly #env: LegacyGameObjectEnv;

  constructor(ctx: DurableObjectState, env: LegacyGameObjectEnv) {
    this.ctx = ctx;
    this.#env = env;
    ctx.blockConcurrencyWhile(async () => { this.#match = await ctx.storage.get<StoredLegacyMatch>("match"); });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/state") {
        return this.#match ? json(this.#match) : json({ error: "游戏数据记录不存在。" }, 404);
      }
      if (request.method === "POST" && url.pathname === "/hydrate") {
        return this.#exclusive(async () => {
          if (this.#match) return json(this.#match);
          const body = await request.json<StoredLegacyMatch>();
          if (!this.#valid(body)) return json({ error: "Invalid match snapshot." }, 400);
          await this.#commit(structuredClone(body));
          return json(this.#match, 201);
        });
      }
      if (request.method === "POST" && url.pathname === "/restore") {
        return this.#exclusive(async () => {
          if (this.#match) return json(this.#match);
          if (!this.#env.SUPABASE_URL || !this.#env.SUPABASE_SECRET_KEY) {
            return json({ error: "Supabase match persistence is not configured." }, 503);
          }
          const body = await request.json<GameRestoreBody>();
          const matchId = Number(body.matchId);
          if (!Number.isSafeInteger(matchId) || matchId < 1) return json({ error: "Invalid match identity." }, 400);
          const rest = new SupabaseLegacyRest({ url: this.#env.SUPABASE_URL, secretKey: this.#env.SUPABASE_SECRET_KEY });
          const snapshot = await new SupabaseMatchSnapshots<LegacyMatchState>(rest).load(matchId);
          if (!snapshot) return json({ error: "游戏数据记录不存在。" }, 404);
          const restored: StoredLegacyMatch = { version: Number(snapshot.version), state: snapshot.state };
          if (!this.#valid(restored) || restored.state.matchId !== matchId) return json({ error: "Invalid match snapshot." }, 409);
          this.#match = structuredClone(restored);
          await this.ctx.storage.put("match", this.#match);
          return json(this.#match, 201);
        });
      }
      if (request.method === "POST" && url.pathname === "/command") {
        const body = await request.json<GameCommandBody>();
        return this.#exclusive(async () => {
          if (!this.#match) return json({ error: "游戏数据记录不存在。" }, 404);
          const username = String(body.username ?? "");
          const current = this.#match.state.players[username];
          if (!current) return json({ error: "玩家数据记录不存在。" }, 404);
          const working = structuredClone(this.#match.state);
          const player = working.players[username]!;
          working.mapItems ??= [];
          const output = runLegacyPlayerCommand({
            player,
            command: String(body.command ?? ""),
            now: Number(body.now),
            gamestate: working.gamestate,
            gametype: working.gametype,
            availableAreas: working.availableAreas,
            forbiddenAreas: working.forbiddenAreas,
            areaNames: working.areaNames,
            mapItems: working.mapItems,
            opponents: Object.fromEntries(Object.entries(working.players).filter(([candidate]) => candidate !== username)),
            weatherId: working.weatherId ?? 0,
            ...(body.mode !== undefined ? { mode: body.mode } : {}),
            ...(body.input !== undefined ? { input: body.input } : {}),
            ...(body.requestStartMs !== undefined ? { requestStartMs: body.requestStartMs } : {})
          });
          let battleResult;
          if (output.encounter?.kind === "enemy" && !output.encounter.active) {
            const defender = working.players[output.encounter.username];
            if (defender) {
              battleResult = executeLegacyAssault({
                attacker: defender, defender: player, active: false,
                weatherId: working.weatherId ?? 0, now: Number(body.now), random: cryptoLegacyRandom
              });
              output.log += battleResult.logHtml;
              if (Number(defender.hp) <= 0 && Number(player.hp) > 0) player.action = `corpse${Number(defender.pid)}`;
              if (Number(player.hp) <= 0 && Number(defender.hp) > 0) defender.action = `corpse${Number(player.pid)}`;
            }
          }
          const next: StoredLegacyMatch = { version: this.#match.version + 1, state: working };
          await this.#commit(next);
          return json({ version: next.version, mode: output.mode, log: output.log, cmd: output.cmd, action: output.action, player: output.player, craftResult: output.craftResult, encounter: output.encounter, battleResult });
        });
      }
      if (request.method === "POST" && url.pathname === "/battle") {
        const body = await request.json<GameBattleBody>();
        return this.#exclusive(async () => {
          if (!this.#match) return json({ error: "游戏数据记录不存在。" }, 404);
          const username = String(body.username ?? "");
          const target = String(body.target ?? "");
          if (!username || username === target) return json({ error: "战斗目标不正确。" }, 400);
          const working = structuredClone(this.#match.state);
          const attacker = working.players[username];
          const defender = working.players[target];
          if (!attacker || !defender) return json({ error: "玩家数据记录不存在。" }, 404);
          if (String(attacker.action) !== `enemy${Number(defender.pid)}`) return json({ error: "你没有遇到这个敌人，或已经离开战场。" }, 409);
          if (Number(attacker.pls) !== Number(defender.pls)) return json({ error: "对方已经离开当前区域。" }, 409);
          if (Number(attacker.hp) <= 0 || Number(defender.hp) <= 0) return json({ error: "死亡玩家不能参与战斗。" }, 409);
          const result = executeLegacyAssault({
            attacker, defender, active: body.active ?? true,
            weatherId: Number(body.weatherId ?? 0), now: Number(body.now), random: cryptoLegacyRandom
          });
          if (Number(defender.hp) <= 0 && Number(attacker.hp) > 0) attacker.action = `corpse${Number(defender.pid)}`;
          const next: StoredLegacyMatch = { version: this.#match.version + 1, state: working };
          await this.#commit(next);
          return json({ version: next.version, result, attacker, defender });
        });
      }
      if (request.method === "POST" && url.pathname === "/corpse") {
        const body = await request.json<GameCorpseBody>();
        return this.#exclusive(async () => {
          if (!this.#match) return json({ error: "游戏数据记录不存在。" }, 404);
          const username = String(body.username ?? "");
          const target = String(body.target ?? "");
          const itemPosition = String(body.item ?? "");
          const working = structuredClone(this.#match.state);
          const player = working.players[username];
          const corpse = working.players[target];
          if (!player || !corpse) return json({ error: "玩家数据记录不存在。" }, 404);
          if (String(player.action) !== `corpse${Number(corpse.pid)}` && String(player.action) !== `pacorpse${Number(corpse.pid)}`) {
            return json({ error: "你没有遇到这具尸体，或已经离开现场。" }, 409);
          }
          if (Number(corpse.hp) > 0) return json({ error: "对方尚未死亡。" }, 409);
          if (Number(player.pls) !== Number(corpse.pls)) return json({ error: "对方跟你不在同一个地图。" }, 409);
          let log = "";
          if (itemPosition === "money") {
            const amount = numberField(corpse, "money");
            player.money = numberField(player, "money") + amount;
            corpse.money = 0;
            log = `获得了金钱 <span class="yellow b">${amount}</span>。<br>`;
          } else if (itemPosition === "destroy") {
            for (const slot of ["wep", "arb", "arh", "ara", "arf", "art"] as const) corpse[`${slot}s` as keyof LegacyPlayerRecord] = 0;
            for (let slot = 0; slot <= 6; slot += 1) corpse[`itms${slot}` as keyof LegacyPlayerRecord] = 0;
            corpse.money = 0;
            corpse.state = 16;
            corpse.corpse_clear_flag = 1;
            log = "尸体成功销毁！";
          } else {
            const item = takeCorpseItem(corpse, itemPosition);
            if (!item) return json({ error: "该物品不存在！" }, 409);
            writeLegacyPendingItem(player, item);
            working.mapItems ??= [];
            const pickup = runLegacyPlayerCommand({
              player, mode: "itemmain", command: "itemget", now: Number(body.now),
              mapItems: working.mapItems,
              opponents: Object.fromEntries(Object.entries(working.players).filter(([candidate]) => candidate !== username)),
              weatherId: working.weatherId ?? 0
            });
            log = pickup.log;
          }
          player.action = "";
          const next: StoredLegacyMatch = { version: this.#match.version + 1, state: working };
          await this.#commit(next);
          return json({ version: next.version, log, player, corpse });
        });
      }
      return json({ error: "Not found." }, 404);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Legacy game command failed." }, 409);
    }
  }

  #valid(value: StoredLegacyMatch): boolean {
    return Number.isSafeInteger(value?.version) && value.version >= 0
      && Number.isSafeInteger(value?.state?.matchId) && value.state.matchId > 0
      && typeof value.state.players === "object" && value.state.players !== null;
  }

  async #commit(next: StoredLegacyMatch): Promise<void> {
    if (this.#env.SUPABASE_URL && this.#env.SUPABASE_SECRET_KEY) {
      const rest = new SupabaseLegacyRest({ url: this.#env.SUPABASE_URL, secretKey: this.#env.SUPABASE_SECRET_KEY });
      const saved = await new SupabaseMatchSnapshots<LegacyMatchState>(rest).save(next.state.matchId, next.version, next.state);
      if (!saved) throw new Error("Stale match snapshot rejected.");
    }
    this.#match = next;
    await this.ctx.storage.put("match", next);
  }

  #exclusive<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.#queue.then(operation, operation);
    this.#queue = result.then(() => undefined, () => undefined);
    return result;
  }
}
