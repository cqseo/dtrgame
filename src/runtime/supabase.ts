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
    this.#fetch = config.fetch ?? fetch;
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
