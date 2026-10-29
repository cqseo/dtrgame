import type { PgLegacyClient } from './original-supabase-db';
import type { OriginalAccountHttpStore } from './original-account-http';
import type { LegacyAccountRow } from './original-login';
import { originalMysqlUsernameKey } from './original-mysql-collation';

/** Only the independent mutable QA copy is addressable by these fixed queries. */
export class OriginalRuntimeUsers implements OriginalAccountHttpStore {
  constructor(private readonly db: PgLegacyClient) {}
  async findByUsername(username: string): Promise<LegacyAccountRow | null> {
    if (!username || [...username].length > 15) return null;
    const key = originalMysqlUsernameKey(username);
    if (key === null) return null;
    const result = await this.db.query<LegacyAccountRow & Record<string, unknown>>(
      'SELECT u.username,u.password,u.groupid,u.roomid FROM acfun_runtime_qa_20261029.users u ' +
      'JOIN acfun_runtime_qa_20261029.username_weight_index k ON k.uid=u.uid WHERE k.legacy_weight_key=$1 LIMIT 1', [key]);
    const row = result.rows[0];
    return row ? { username: row.username, password: row.password, groupid: Number(row.groupid), roomid: Number(row.roomid) } : null;
  }
  async saveLogin(username: string, timestamp: number, ip: string): Promise<void> {
    const key = originalMysqlUsernameKey(username);
    if (key === null || !Number.isSafeInteger(timestamp) || timestamp < 0) throw new Error('Invalid account update');
    const result = await this.db.query(
      'UPDATE acfun_runtime_qa_20261029.users SET ip=$1,lastvisit=$2 ' +
      'WHERE uid=(SELECT uid FROM acfun_runtime_qa_20261029.username_weight_index WHERE legacy_weight_key=$3) RETURNING uid', [ip, timestamp, key]);
    if (result.rows.length !== 1) throw new Error('Account disappeared during login');
  }
}
