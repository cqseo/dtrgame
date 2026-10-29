/**
 * Original ACFUN DTS PostgreSQL/Supabase users adapter.
 * Isolated private schema acfun_legacy, NOT Supabase Auth.
 *
 * Deliberately staging-only until source MySQL utf8_general_ci username
 * equality and all 53 historical accounts pass parity checks. Uses
 * parameterized SQL; a privileged Postgres connection must NEVER enter
 * browser JS or GitHub. Does not handle live website routing.
 */
import type { LegacyUserStore, LegacyAccountRow } from "./original-login";
import { originalMysqlUsernameKey } from "./original-mysql-collation";
import type {
  LegacyRegistrationAccount, LegacyRegistrationStore
} from "./original-register";

export type PgParameter = string | number | null;
export interface PgLegacyClient {
  query<T extends Record<string, unknown>>(
    sql: string,
    parameters: readonly PgParameter[]
  ): Promise<{ rows: T[]; rowCount: number | null }>;
}

/**
 * Only QA mode is accepted because PostgreSQL default/ICU collations are
 * demonstrably NOT equal to the original MySQL utf8_general_ci.
 */
export class SupabaseOriginalUsers implements LegacyUserStore, LegacyRegistrationStore {
  constructor(private readonly db: PgLegacyClient, environment: "qa-only") {
    if (environment !== "qa-only") {
      throw new Error("Original MySQL username collation parity is not accepted");
    }
  }

  async findByUsername(username: string): Promise<LegacyAccountRow | null> {
    if (!username || [...username].length > 15) return null;
    const key=originalMysqlUsernameKey(username);
    if(key===null)return null;
    const found = await this.db.query<{
      username: string; password: string; groupid: number; roomid: number;
    }>(
      "SELECT u.username,u.password,u.groupid,u.roomid FROM acfun_legacy.users u " +
      "JOIN acfun_legacy.username_weight_index k ON k.uid=u.uid " +
      "WHERE k.legacy_weight_key=$1 LIMIT 1", [key]
    );
    const row = found.rows[0];
    if (!row) return null;
    return {
      username: row.username,
      password: row.password,
      groupid: Number(row.groupid),
      roomid: Number(row.roomid),
    };
  }

  async exists(username: string): Promise<boolean> {
    const key=originalMysqlUsernameKey(username);
    if(key===null)return false;
    const result = await this.db.query<{ present: number }>(
      "SELECT 1 AS present FROM acfun_legacy.username_weight_index WHERE legacy_weight_key=$1 LIMIT 1",
      [key]
    );
    return result.rows.length > 0;
  }

  async insert(record: LegacyRegistrationAccount): Promise<boolean> {
    // Seven NOT NULL MySQL text fields lack an explicit schema default.
    // PHP register.php sets card_data; the other six receive empty strings
    // explicitly here instead of relying on PostgreSQL implicit behavior.
    // Existing accounts are never updated.
    const key=originalMysqlUsernameKey(record.username);
    if(key===null)throw new RangeError("Original MySQL utf8mb3 cannot store this username");
    const values: PgParameter[] = [
      record.username, record.password, record.alt_pswd, record.groupid,
      record.ip, record.credits, record.gold, record.gender, record.icon,
      record.motto, record.killmsg, record.lastword, record.card_data,
      "", "", "", "", "", "",
    ];
    const result = await this.db.query<{ uid: number }>(
      "WITH created AS (INSERT INTO acfun_legacy.users (" +
      "username,password,alt_pswd,groupid,ip,credits,gold,gender,icon," +
      "motto,killmsg,lastword,card_data,cardenergy,cardlist,elo_history," +
      "u_achievements,n_achievements,u_settings" +
      ") VALUES (" +
      values.map((_, i) => "$" + (i + 1)).join(",") +
      ") ON CONFLICT (username) DO NOTHING RETURNING uid) " +
      "INSERT INTO acfun_legacy.username_weight_index(uid,legacy_weight_key) " +
      "SELECT uid,$20 FROM created RETURNING uid", [...values,key]
    );
    return result.rows.length === 1;
  }

  async recordLastLogin(username: string, timestamp: number): Promise<void> {
    if (!Number.isSafeInteger(timestamp) || timestamp < 0) {
      throw new RangeError("Invalid login timestamp");
    }
    const key=originalMysqlUsernameKey(username);
    if(key===null)throw new RangeError("Invalid original account username");
    await this.db.query<{ uid: number }>(
      "UPDATE acfun_legacy.users SET lastvisit=$1 " +
      "WHERE uid=(SELECT uid FROM acfun_legacy.username_weight_index WHERE legacy_weight_key=$2) RETURNING uid",
      [timestamp, key]
    );
  }
}
