import type { LegacyPlayerRecord } from "../legacy/player";
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
}

interface StoredLegacyMatch { version: number; state: LegacyMatchState; }
interface LegacyGameObjectEnv extends Cloudflare.Env { SUPABASE_URL?: string; SUPABASE_SECRET_KEY?: string; }
interface GameCommandBody {
  username: string;
  mode?: string;
  command: string;
  input?: Record<string, string>;
  now: number;
  requestStartMs?: number;
}

const json = (value: unknown, status = 200): Response => Response.json(value, { status, headers: { "cache-control": "no-store" } });

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
          this.#match = structuredClone(body);
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
          const output = runLegacyPlayerCommand({
            player,
            command: String(body.command ?? ""),
            now: Number(body.now),
            gamestate: working.gamestate,
            gametype: working.gametype,
            availableAreas: working.availableAreas,
            forbiddenAreas: working.forbiddenAreas,
            areaNames: working.areaNames,
            ...(body.mode !== undefined ? { mode: body.mode } : {}),
            ...(body.input !== undefined ? { input: body.input } : {}),
            ...(body.requestStartMs !== undefined ? { requestStartMs: body.requestStartMs } : {})
          });
          const next: StoredLegacyMatch = { version: this.#match.version + 1, state: working };
          if (this.#env.SUPABASE_URL && this.#env.SUPABASE_SECRET_KEY) {
            const rest = new SupabaseLegacyRest({ url: this.#env.SUPABASE_URL, secretKey: this.#env.SUPABASE_SECRET_KEY });
            const saved = await new SupabaseMatchSnapshots<LegacyMatchState>(rest).save(working.matchId, next.version, working);
            if (!saved) throw new Error("Stale match snapshot rejected.");
          }
          this.#match = next;
          await this.ctx.storage.put("match", next);
          return json({ version: next.version, mode: output.mode, log: output.log, cmd: output.cmd, action: output.action, player: output.player, craftResult: output.craftResult });
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

  #exclusive<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.#queue.then(operation, operation);
    this.#queue = result.then(() => undefined, () => undefined);
    return result;
  }
}
