import type { LegacyAccountRow, LegacyUserStore } from "../original-login";
import { legacyDecode, legacyEncode } from "../original-protocol";
import type { LegacyRoomRecord, LegacyWaitingRoom } from "../legacy/room";

export interface SupabaseRuntimeConfig {
  url: string;
  secretKey: string;
  schema: string;
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
  readonly #schema: string;
  readonly #fetch: typeof fetch;

  constructor(config: SupabaseRuntimeConfig) {
    if (!config.secretKey || /^(?:sb_publishable_|anon)/.test(config.secretKey)) {
      throw new TypeError("A server-side Supabase secret key is required.");
    }
    this.#url = normalizeUrl(config.url);
    this.#key = config.secretKey;
    this.#schema = validateIdentifier(config.schema);
    this.#fetch = config.fetch ?? fetch;
  }

  async selectOne<T>(table: string, columns: string, filters: Readonly<Record<string, string | number>>): Promise<T | null> {
    const url = new URL(`/rest/v1/${validateIdentifier(table)}`, this.#url);
    url.searchParams.set("select", columns);
    url.searchParams.set("limit", "1");
    for (const [key, value] of Object.entries(filters)) url.searchParams.set(validateIdentifier(key), `eq.${String(value)}`);
    const response = await this.#fetch(url, { headers: this.#headers("GET") });
    if (!response.ok) throw new Error(`Supabase legacy read failed (${response.status}).`);
    const rows = await response.json<T[]>();
    return rows[0] ?? null;
  }

  async update(table: string, filters: Readonly<Record<string, string | number>>, values: Readonly<Record<string, unknown>>): Promise<void> {
    const url = new URL(`/rest/v1/${validateIdentifier(table)}`, this.#url);
    for (const [key, value] of Object.entries(filters)) url.searchParams.set(validateIdentifier(key), `eq.${String(value)}`);
    const response = await this.#fetch(url, {
      method: "PATCH",
      headers: this.#headers("PATCH"),
      body: JSON.stringify(values)
    });
    if (!response.ok) throw new Error(`Supabase legacy update failed (${response.status}).`);
  }

  #headers(method: "GET" | "PATCH"): Headers {
    const headers = new Headers({
      apikey: this.#key,
      "accept-profile": this.#schema,
      accept: "application/json"
    });
    if (method === "PATCH") {
      headers.set("content-profile", this.#schema);
      headers.set("content-type", "application/json");
      headers.set("prefer", "return=minimal");
    }
    return headers;
  }
}

export class SupabaseLegacyAccounts implements LegacyUserStore {
  constructor(readonly rest: SupabaseLegacyRest) {}

  findByUsername(username: string): Promise<LegacyAccountRow | null> {
    if (!username || [...username].length > 15) return Promise.resolve(null);
    return this.rest.selectOne<LegacyAccountRow>("users", "username,password,groupid,roomid", { username });
  }

  recordLastLogin(username: string, timestamp: number): Promise<void> {
    return this.rest.update("users", { username }, { lastvisit: timestamp });
  }

  setCurrentRoom(username: string, roomId: number): Promise<void> {
    return this.rest.update("users", { username }, { roomid: roomId });
  }
}

export class SupabaseLegacyRooms {
  constructor(readonly rest: SupabaseLegacyRest) {}

  find(roomId: number): Promise<SupabaseGameRow | null> {
    if (!Number.isSafeInteger(roomId) || roomId < 1) return Promise.resolve(null);
    return this.rest.selectOne<SupabaseGameRow>(
      "game", "groomid,groomtype,groomstatus,gametype,gamestate,roomvars", { groomid: roomId }
    );
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
    await this.rest.update("game", { groomid: record.roomId }, {
      groomtype: record.groomtype,
      groomstatus: record.groomstatus,
      gametype: record.gametype,
      gamestate: record.gamestate,
      roomvars: await legacyEncode(record.room)
    });
  }
}
