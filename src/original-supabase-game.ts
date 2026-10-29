/**
 * Read-only Supabase/Postgres adapter for original ACFUN DTS game and the
 * eight source player-state tables (one standard + seven real subrooms).
 * It intentionally never invents s7 and never rewrites roomvars/gamevars.
 *
 * Stage only: gameplay command/daemon state machine and original 124-field
 * player behavior have NOT yet passed PHP parity acceptance.
 */
import type { PgLegacyClient } from "./original-supabase-db";

const ROOM_PLAYERS = {
  0: "players",
  1: "s1_players",
  2: "s2_players",
  3: "s3_players",
  4: "s4_players",
  5: "s5_players",
  6: "s6_players",
  8: "s8_players",
} as const;
export type SourceRoomId = keyof typeof ROOM_PLAYERS;

export interface OriginalGameRow {
  groomid: number; groomstatus: number; groomtype: number;
  gamenum: number; gamestate: number;
  roomvars: string; gamevars: string;
}
export interface OriginalPlayerState {
  pid: number;
  name: string;
  type: number;
  [originalField: string]: unknown;  // all 124 columns are returned, byte strings untouched
}
export class SupabaseOriginalGameReadStore {
  constructor(private readonly db: PgLegacyClient, environment: "qa-only") {
    if (environment !== "qa-only") {
      throw new Error("Original room and player state parity has not been accepted");
    }
  }

  async findGame(roomId: number): Promise<OriginalGameRow | null> {
    if (!Number.isInteger(roomId) || roomId < 0 || roomId > 255) return null;
    const result = await this.db.query<OriginalGameRow & Record<string, unknown>>(
      "SELECT groomid,groomstatus,groomtype,gamenum,gamestate,roomvars,gamevars " +
      "FROM acfun_legacy.game WHERE groomid=$1 LIMIT 1", [roomId]
    );
    return result.rows[0] ?? null;
  }

  async findPlayer(roomId: number, playerId: number): Promise<OriginalPlayerState | null> {
    if (!Number.isInteger(playerId) || playerId <= 0 || playerId > 16777215) return null;
    if (!Number.isInteger(roomId) || !(roomId in ROOM_PLAYERS)) return null;
    const name=ROOM_PLAYERS[roomId as SourceRoomId]; // static trusted whitelist only
    const result = await this.db.query<OriginalPlayerState>(
      'SELECT * FROM acfun_legacy."' + name + '" WHERE pid=$1 LIMIT 1',
      [playerId]
    );
    return result.rows[0] ?? null;
  }
}
