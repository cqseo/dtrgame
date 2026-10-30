import { LEGACY_CONFIG } from "../generated/legacy-config";
import { LEGACY_ROOM_CONFIGURATION } from "../generated/legacy-room-types";
import { getLegacyRoomType, legacyRoomParticipantLimit, type LegacyRoomRecord } from "../legacy/room";
import { createLegacyEntrant, type LegacyPlayerRecord } from "../legacy/player";
import { cryptoLegacyRandom } from "../legacy/random";
import { legacyMd5 } from "../original-auth";
import type { LegacyMatchState } from "./game-durable-object";
import { SupabaseLegacyMatchStart } from "./supabase";

export const LEGACY_AREA_NAMES = [
  "无月之影", "端点", "RF高校", "雪之镇", "索拉利斯", "指挥中心", "梦幻馆",
  "清水池", "白穗神社", "墓地", "麦斯克林", "对天使用作战本部", "夏之镇",
  "三体星", "光坂高校", "守矢神社", "常磐森林", "常磐台中学", "秋之镇",
  "精灵中心", "春之镇", "圣Gradius学园", "初始之树", "幻想世界", "永恒的世界",
  "妖精驿站", "冰封墓场", "花菱商厦", "FARGO前基地", "风祭森林",
  "天使队移动格纳库", "和田町研究所", "ＳＣＰ研究设施", "雏菊之丘", "英灵殿"
] as const;

interface RoomTypeTeamConfig {
  readonly "leader-position": readonly number[];
  readonly teamID?: Readonly<Record<string, string>> | readonly string[];
}

function openingGamestate(record: LegacyRoomRecord): number {
  const raw = record.room.current_game_option["opening-gamestate"];
  const configured = raw === null || raw === undefined || raw === "" ? 0 : Number(raw);
  if ([0, 1, 2, 3, 4].includes(record.room.roomtype) && (!configured || configured === 40)) return 40;
  if (configured) return configured;
  if (record.room.roomtype === 11 && Number(record.room.current_game_option.lvl ?? 0) >= 20) return 40;
  return 30;
}

function teamFor(record: LegacyRoomRecord, position: number): string {
  const config = (LEGACY_ROOM_CONFIGURATION.roomTypes as unknown as Record<string, RoomTypeTeamConfig>)[String(record.room.roomtype)];
  const leader = config?.["leader-position"][position] ?? position;
  const teams = config?.teamID;
  if (!teams) return "";
  return String(Array.isArray(teams) ? teams[leader] ?? "" : (teams as Readonly<Record<string, string>>)[String(leader)] ?? "");
}

function permissionEquipment(player: LegacyPlayerRecord, username: string, groupid: number): void {
  if (username === String(LEGACY_CONFIG.gamefounder) || groupid >= 5) {
    Object.assign(player, { arf: "权限狗的ID卡", arfk: "Z", arfe: 1, arfs: 1, arfsk: "" });
  } else if (username === "霜火协奏曲") {
    Object.assign(player, { art: "击败思念的纹章", artk: "A", arte: 1, arts: 1, artsk: "zZ" });
  } else if (username === "时期") {
    Object.assign(player, { art: "击败鬼畜级思念的纹章", artk: "A", arte: 1, arts: 1, artsk: "zZ" });
  } else if (username === "枪毙的某神" || username === "精灵们的手指舞") {
    Object.assign(player, { art: "TDG地雷的证明", artk: "A", arte: 1, arts: 1, artsk: "zZ" });
  }
}

export interface LegacyMatchStartResult {
  matchId: number;
  gamestate: number;
  record: LegacyRoomRecord;
}

/** Turns a fully-ready waiting room into the first persisted match snapshot. */
export class LegacyMatchStarter {
  constructor(
    readonly games: DurableObjectNamespace,
    readonly rooms: DurableObjectNamespace,
    readonly store: SupabaseLegacyMatchStart
  ) {}

  async start(record: LegacyRoomRecord, now: number): Promise<LegacyMatchStartResult> {
    if (record.room.readystat !== 2) throw new Error("房间玩家尚未全部准备。");
    const limit = legacyRoomParticipantLimit(record.room);
    const seats = record.room.player.slice(0, limit)
      .map((slot, position) => ({ slot, position }))
      .filter(({ slot }) => !slot.forbidden && slot.name !== "");
    if (seats.length === 0) throw new Error("房间内没有可以进入战场的玩家。");
    const gamestate = openingGamestate(record);
    const started = await this.store.start(record.roomId, seats.map(({ slot }) => slot.name), gamestate, now);
    const profiles = new Map(started.profiles.map(profile => [profile.username, profile]));
    const safeAreas = LEGACY_AREA_NAMES.map((_, index) => index).filter(index => ![0, 32, 34].includes(index));
    const players: Record<string, LegacyPlayerRecord> = {};

    for (let serial = 0; serial < seats.length; serial++) {
      const { slot, position } = seats[serial]!;
      const profile = profiles.get(slot.name);
      if (!profile) throw new Error(`玩家资料不存在：${slot.name}`);
      const spawnArea = safeAreas[cryptoLegacyRandom.int(0, safeAreas.length - 1)]!;
      const gender = profile.gender === "f" ? "f" : "m";
      const player = createLegacyEntrant({
        name: profile.username,
        storedPass: legacyMd5(profile.username + profile.password),
        gender,
        icon: profile.icon || 0,
        serialNumber: serial + 1,
        now,
        random: cryptoLegacyRandom,
        areaWave: 0,
        spawnArea
      });
      player.pid = serial + 1;
      player.ip = profile.ip;
      player.card = profile.card;
      player.motto = profile.motto;
      player.killmsg = profile.killmsg;
      player.lastword = profile.lastword;
      player.teamID = teamFor(record, position);
      permissionEquipment(player, profile.username, Number(profile.groupid));
      players[profile.username] = player;
    }

    const state: LegacyMatchState = {
      matchId: started.matchId,
      gamestate: started.gamestate,
      gametype: record.gametype,
      players,
      availableAreas: LEGACY_AREA_NAMES.map((_, index) => index).filter(index => index !== 0),
      forbiddenAreas: [0],
      areaNames: [...LEGACY_AREA_NAMES],
      mapItems: [],
      weatherId: 0
    };
    const game = this.games.get(this.games.idFromName(String(started.matchId)));
    const hydrated = await game.fetch("https://game.internal/hydrate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ version: 0, state })
    });
    if (!hydrated.ok) throw new Error(`游戏状态初始化失败（${hydrated.status}）。`);

    const room = this.rooms.get(this.rooms.idFromName(String(record.roomId)));
    const activated = await room.fetch("https://room.internal/activate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ gamestate: started.gamestate, now })
    });
    if (!activated.ok) throw new Error(`房间状态切换失败（${activated.status}）。`);
    return { matchId: started.matchId, gamestate: started.gamestate, record: await activated.json<LegacyRoomRecord>() };
  }
}

export function legacyOpeningGamestate(record: LegacyRoomRecord): number {
  return openingGamestate(record);
}
