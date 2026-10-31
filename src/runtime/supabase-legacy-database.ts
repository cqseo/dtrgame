import {
  SnapshotLegacyDatabase,
  legacyRowFromJson,
  type LegacyRowMutation
} from "../legacy/php/database";
import type { SupabaseLegacyRest } from "./supabase";

const GLOBAL_PREFIX = "acbra2_";
const GLOBAL_TABLES = ["game", "users", "messages", "del_messages"] as const;
const ROOM_TABLES = ["chat", "log", "mapitem", "maptrap", "newsinfo", "players", "shopitem"] as const;

export type LegacyDatabaseTable = typeof GLOBAL_TABLES[number] | typeof ROOM_TABLES[number];

interface LegacyDatabaseSnapshotRow {
  revision: number;
  tables: Record<string, Array<Record<string, unknown>>>;
}

const tableName = (roomId: number, logical: LegacyDatabaseTable): string => {
  if ((GLOBAL_TABLES as readonly string[]).includes(logical)) return `${GLOBAL_PREFIX}${logical}`;
  return `${GLOBAL_PREFIX}${roomId > 0 ? `s${roomId}_` : ""}${logical}`;
};

const primaryKey = (logical: LegacyDatabaseTable): string => ({
  game: "groomid",
  users: "uid",
  messages: "mid",
  del_messages: "mid",
  chat: "cid",
  log: "lid",
  mapitem: "iid",
  maptrap: "tid",
  newsinfo: "nid",
  players: "pid",
  shopitem: "sid"
})[logical];

/** Supabase-backed request snapshot used by the synchronous PHP runtime. */
export class SupabaseLegacyDatabase extends SnapshotLegacyDatabase {
  readonly #rest: SupabaseLegacyRest;
  readonly #roomId: number;
  readonly #revision: number;
  readonly #primaryKeys: Record<string, string>;

  private constructor(
    rest: SupabaseLegacyRest,
    roomId: number,
    revision: number,
    tables: Record<string, ReturnType<typeof legacyRowFromJson>[]>,
    primaryKeys: Record<string, string>
  ) {
    super(tables);
    this.#rest = rest;
    this.#roomId = roomId;
    this.#revision = revision;
    this.#primaryKeys = primaryKeys;
  }

  static async load(
    rest: SupabaseLegacyRest,
    roomId: number,
    username: string,
    requested: readonly LegacyDatabaseTable[] = ["game"]
  ): Promise<SupabaseLegacyDatabase> {
    if (!Number.isSafeInteger(roomId) || roomId < 0 || roomId > 12) throw new RangeError("Invalid legacy room id.");
    // An empty name is an anonymous visitor: the pages are served
    // before anyone has an account, and register.php runs to create one.
    if ([...username].length > 15) throw new RangeError("Invalid legacy username.");
    const unique = [...new Set(requested)];
    if (unique.some(name => !([...GLOBAL_TABLES, ...ROOM_TABLES] as string[]).includes(name))) {
      throw new RangeError("Invalid legacy database table request.");
    }
    const rows = await rest.rpc<LegacyDatabaseSnapshotRow[]>("dtr_legacy_database_load", {
      p_room_id: roomId,
      p_username: username,
      p_tables: unique
    });
    const snapshot = rows[0];
    if (!snapshot || !Number.isSafeInteger(Number(snapshot.revision)) || !snapshot.tables) {
      throw new Error("Legacy database snapshot is unavailable.");
    }
    const tables: Record<string, ReturnType<typeof legacyRowFromJson>[]> = {};
    const primaryKeys: Record<string, string> = {};
    for (const logical of unique) {
      const physical = tableName(roomId, logical);
      tables[physical] = (snapshot.tables[logical] ?? []).map(legacyRowFromJson);
      primaryKeys[physical] = primaryKey(logical);
    }
    return new SupabaseLegacyDatabase(rest, roomId, Number(snapshot.revision), tables, primaryKeys);
  }

  get revision(): number {
    return this.#revision;
  }

  async commit(): Promise<number> {
    const changes: LegacyRowMutation[] = this.mutations(this.#primaryKeys);
    if (changes.length === 0) return this.#revision;
    const rows = await this.#rest.rpc<Array<{ revision: number }>>("dtr_legacy_database_commit", {
      p_room_id: this.#roomId,
      p_expected_revision: this.#revision,
      p_changes: changes
    });
    const revision = Number(rows[0]?.revision);
    if (!Number.isSafeInteger(revision) || revision !== this.#revision + 1) {
      throw new Error("Legacy database commit did not advance its room revision.");
    }
    return revision;
  }
}

export { tableName as legacyPhysicalTableName };
