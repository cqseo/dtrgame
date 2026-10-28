/**
 * Real Cloudflare D1 adapter for ORIGINAL DTS legacy accounts and rooms.
 * Source columns mirror the customized PHP user's storage representation.
 * No actual Baota customer data is fetched or migrated here.
 */
import type { LegacyUserStore, LegacyAccountRow } from "./original-login";

interface SqlStatement {
  bind(...args: (string | number | null)[]): SqlStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<{ success: boolean; meta?: { changes?: number } }>;
}
export interface OriginalD1 {
  prepare(sql: string): SqlStatement;
}
export class D1LegacyAccounts implements LegacyUserStore {
  constructor(private readonly db: OriginalD1) {}
  async findByUsername(username: string): Promise<LegacyAccountRow | null> {
    if (!username || [...username].length > 15) return null;
    const row = await this.db.prepare(
      "SELECT username,password,groupid,roomid FROM legacy_users WHERE username = ? LIMIT 1"
    ).bind(username).first<LegacyAccountRow>();
    return row;
  }
  async recordLastLogin(username: string, timestamp: number): Promise<void> {
    const result = await this.db.prepare(
      "UPDATE legacy_users SET lastvisit = ? WHERE username = ?"
    ).bind(timestamp, username).run();
    if (!result.success) throw new Error("Could not save original lastvisit");
  }
}
export interface OriginalRoomRow {
  groomid: number;
  groomtype: number;
  groomstatus: number;
  roomvars: string;
  gamevars: string;
  raw_record: string;
}
export class D1LegacyRooms {
  constructor(private readonly db: OriginalD1) {}
  async find(roomId: number): Promise<OriginalRoomRow | null> {
    if (!Number.isInteger(roomId) || roomId < 0 || roomId > 255) return null;
    return this.db.prepare(
      "SELECT groomid,groomtype,groomstatus,roomvars,gamevars,raw_record FROM legacy_rooms WHERE groomid = ? LIMIT 1"
    ).bind(roomId).first<OriginalRoomRow>();
  }
}
/** Refuse to accept user-supplied SQL or arbitrary data exports. */
export const D1_LEGACY_SCHEMA = [
  "legacy_users(username,password,groupid,roomid,raw_record,lastvisit)",
  "legacy_rooms(groomid,groomtype,groomstatus,roomvars,gamevars,raw_record)",
  "legacy_player_state(groomid,username,raw_record)",
  "legacy_import_audit(source,imported_at,row_count,sha256)"
] as const;
