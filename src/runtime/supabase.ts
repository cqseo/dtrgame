import type { LegacyAccountRow, LegacyUserStore } from "../original-login";
import { legacyDecode, legacyEncode } from "../original-protocol";
import type { LegacyRoomRecord, LegacyWaitingRoom } from "../legacy/room";

export interface SupabaseRuntimeConfig {
  url: string;
  secretKey: string;
  fetch?: typeof fetch;
}

export interface SupabaseGameRow {
  groomid: number;
  groomtype: number;
  groomstatus: number;
  gametype: number;
  gamestate: number;
  roomvars: string;
}

export interface SupabaseIndexGameRow extends SupabaseGameRow {
  gamenum: number;
  starttime: number;
  validnum: number;
  alivenum: number;
  deathnum: number;
  hdamage: number;
  hplayer: string;
  winmode: number;
  winner: string;
  areanum: number;
}

export interface SupabaseLegacyIndexState {
  globalState: SupabaseIndexGameRow;
  rooms: SupabaseIndexGameRow[];
  siteText: Record<string, string>;
}

export interface LegacyStartProfile {
  username: string;
  password: string;
  groupid: number;
  gender: string;
  icon: string;
  ip: string;
  card: number;
  motto: string;
  killmsg: string;
  lastword: string;
}

export interface LegacyMatchStartRecord {
  matchId: number;
  gamenum: number;
  gamestate: number;
  profiles: LegacyStartProfile[];
}

export interface LegacyUserMatch {
  roomId: number;
  matchId: number;
  gamenum: number;
  gamestate: number;
  gametype: number;
  groomtype: number;
  groomstatus: number;
  starttime: number;
  validnum: number;
  alivenum: number;
  deathnum: number;
  areanum: number;
  weather: number;
}

function validateIdentifier(value: string): string {
  if (!/^[a-z_][a-z0-9_]*$/.test(value)) throw new TypeError(`Unsafe Supabase identifier: ${value}`);
  return value;
}

function normalizeUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "https:") throw new TypeError("Supabase runtime URL must use HTTPS.");
  return url.origin;
}

/** Server-only PostgREST client. Never construct this with a browser publishable key. */
export class SupabaseLegacyRest {
  readonly #url: string;
  readonly #key: string;
  readonly #fetch: typeof fetch;

  constructor(config: SupabaseRuntimeConfig) {
    if (!config.secretKey || /^(?:sb_publishable_|anon)/.test(config.secretKey)) {
      throw new TypeError("A server-side Supabase secret key is required.");
    }
    this.#url = normalizeUrl(config.url);
    this.#key = config.secretKey;
    // fetch has to be called with globalThis as its receiver. Stored on
    // an instance and called as this.#fetch(...), the receiver is the
    // instance, and workerd rejects that with "Illegal invocation".
    // Node's fetch does not check the receiver, so no unit test can catch
    // this -- only a request against a deployed Worker does.
    this.#fetch = config.fetch ?? fetch.bind(globalThis);
  }

  async rpc<T>(name: string, args: Readonly<Record<string, unknown>>): Promise<T> {
    const url = new URL(`/rest/v1/rpc/${validateIdentifier(name)}`, this.#url);
    const response = await this.#fetch(url, {
      method: "POST",
      headers: this.#headers(),
      body: JSON.stringify(args)
    });
    if (!response.ok) throw new Error(`Supabase legacy RPC failed (${response.status}).`);
    if (response.status === 204) return undefined as T;
    return response.json<T>();
  }

  #headers(): Headers {
    const headers = new Headers({
      apikey: this.#key,
      "accept-profile": "public",
      "content-profile": "public",
      accept: "application/json",
      "content-type": "application/json"
    });
    return headers;
  }
}

export class SupabaseLegacyAccounts implements LegacyUserStore {
  constructor(readonly rest: SupabaseLegacyRest) {}

  findByUsername(username: string): Promise<LegacyAccountRow | null> {
    if (!username || [...username].length > 15) return Promise.resolve(null);
    return this.rest.rpc<LegacyAccountRow[]>("dtr_legacy_user", { p_username: username }).then((rows) => rows[0] ?? null);
  }

  recordLastLogin(username: string, timestamp: number): Promise<void> {
    return this.rest.rpc<void>("dtr_legacy_record_login", { p_username: username, p_timestamp: timestamp });
  }

  setCurrentRoom(username: string, roomId: number): Promise<void> {
    return this.rest.rpc<void>("dtr_legacy_set_room", { p_username: username, p_room_id: roomId });
  }
}

export function createSupabaseRuntime(url: string | undefined, secretKey: string | undefined): SupabaseLegacyRest | null {
  if (!url || !secretKey) return null;
  return new SupabaseLegacyRest({ url, secretKey });
}

export class SupabaseLegacyRooms {
  constructor(readonly rest: SupabaseLegacyRest) {}

  find(roomId: number): Promise<SupabaseGameRow | null> {
    if (!Number.isSafeInteger(roomId) || roomId < 1) return Promise.resolve(null);
    return this.rest.rpc<SupabaseGameRow[]>("dtr_legacy_room", { p_room_id: roomId }).then((rows) => rows[0] ?? null);
  }

  async loadRecord(roomId: number, now: number): Promise<LegacyRoomRecord | null> {
    const row = await this.find(roomId);
    if (!row || !row.roomvars) return null;
    const room = await legacyDecode<LegacyWaitingRoom>(row.roomvars);
    return {
      roomId: row.groomid,
      groomstatus: row.groomstatus as 0 | 10 | 40,
      groomtype: row.groomtype,
      gametype: row.gametype,
      gamestate: row.gamestate,
      ownerHeartbeat: now,
      room
    };
  }

  async saveRecord(record: LegacyRoomRecord): Promise<void> {
    await this.rest.rpc<void>("dtr_legacy_save_room", {
      p_room_id: record.roomId,
      p_groomtype: record.groomtype,
      p_groomstatus: record.groomstatus,
      p_gametype: record.gametype,
      p_gamestate: record.gamestate,
      p_roomvars: await legacyEncode(record.room)
    });
  }
}

export class SupabaseLegacyIndex {
  constructor(readonly rest: SupabaseLegacyRest) {}

  async load(): Promise<SupabaseLegacyIndexState> {
    const rows = await this.rest.rpc<Array<{
      global_state: SupabaseIndexGameRow;
      rooms: SupabaseIndexGameRow[];
      site_text: Record<string, string>;
    }>>("dtr_legacy_index_state", {});
    const row = rows[0];
    if (!row) throw new Error("Legacy index state is unavailable.");
    return {
      globalState: row.global_state,
      rooms: Array.isArray(row.rooms) ? row.rooms : [],
      siteText: row.site_text ?? {}
    };
  }
}

export class SupabaseLegacyMatchStart {
  constructor(readonly rest: SupabaseLegacyRest) {}

  async start(roomId: number, usernames: readonly string[], gamestate: number, now: number): Promise<LegacyMatchStartRecord> {
    const rows = await this.rest.rpc<Array<{
      match_id: number;
      gamenum: number;
      gamestate: number;
      profiles: LegacyStartProfile[];
    }>>("dtr_legacy_start_match", {
      p_room_id: roomId,
      p_usernames: usernames,
      p_gamestate: gamestate,
      p_started_at: now
    });
    const row = rows[0];
    const matchId = Number(row?.match_id);
    if (!row || !Number.isSafeInteger(matchId) || matchId < 1 || !Array.isArray(row.profiles)) {
      throw new Error("游戏初始化数据不完整。");
    }
    return { matchId, gamenum: Number(row.gamenum), gamestate: Number(row.gamestate), profiles: row.profiles };
  }
}

export class SupabaseLegacyMatches {
  constructor(readonly rest: SupabaseLegacyRest) {}

  async forUser(username: string): Promise<LegacyUserMatch | null> {
    const rows = await this.rest.rpc<Array<{
      room_id: number; match_id: number; gamenum: number; gamestate: number; gametype: number;
      groomtype: number; groomstatus: number; starttime: number; validnum: number;
      alivenum: number; deathnum: number; areanum: number; weather: number;
    }>>("dtr_legacy_user_match", { p_username: username });
    const row = rows[0];
    if (!row) return null;
    return {
      roomId: Number(row.room_id), matchId: Number(row.match_id), gamenum: Number(row.gamenum),
      gamestate: Number(row.gamestate), gametype: Number(row.gametype), groomtype: Number(row.groomtype),
      groomstatus: Number(row.groomstatus), starttime: Number(row.starttime), validnum: Number(row.validnum),
      alivenum: Number(row.alivenum), deathnum: Number(row.deathnum), areanum: Number(row.areanum),
      weather: Number(row.weather)
    };
  }
}
export class SupabaseLegacyLobby {
  constructor(readonly rest: SupabaseLegacyRest) {}

  async createRoom(username: string, record: LegacyRoomRecord): Promise<number> {
    const rows = await this.rest.rpc<Array<{ room_id: number }>>("dtr_legacy_create_room", {
      p_username: username,
      p_room_type: record.groomtype,
      p_game_type: record.gametype,
      p_roomvars: await legacyEncode(record.room)
    });
    const roomId = Number(rows[0]?.room_id);
    if (!Number.isSafeInteger(roomId) || roomId < 1) throw new Error("房间数目已经达到上限，请加入一个已存在的房间");
    return roomId;
  }

  async joinRoom(username: string, roomId: number): Promise<SupabaseGameRow | null> {
    if (!Number.isSafeInteger(roomId) || roomId < 1) return null;
    const rows = await this.rest.rpc<SupabaseGameRow[]>("dtr_legacy_join_room", {
      p_username: username,
      p_room_id: roomId
    });
    return rows[0] ?? null;
  }
}

export interface SupabaseMatchSnapshot<TState extends object> {
  version: number;
  state: TState;
}

export class SupabaseMatchSnapshots<TState extends object> {
  constructor(readonly rest: SupabaseLegacyRest) {}

  async load(matchId: number): Promise<SupabaseMatchSnapshot<TState> | null> {
    if (!Number.isSafeInteger(matchId) || matchId < 1) return null;
    const rows = await this.rest.rpc<SupabaseMatchSnapshot<TState>[]>("dtr_match_load", { p_match_id: matchId });
    return rows[0] ?? null;
  }

  save(matchId: number, version: number, state: TState): Promise<boolean> {
    if (!Number.isSafeInteger(matchId) || matchId < 1 || !Number.isSafeInteger(version) || version < 0) {
      throw new RangeError("Invalid match snapshot identity.");
    }
    return this.rest.rpc<boolean>("dtr_match_save", { p_match_id: matchId, p_version: version, p_state: state });
  }
}
