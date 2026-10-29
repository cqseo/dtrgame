/**
 * Isolated D1 adapter for original register.php semantics.
 * The full original 124-column users schema has NOT been migrated; this adapter
 * only persists the registration subset losslessly in raw_record alongside
 * fields consumed by the existing legacy login compatibility reader.
 *
 * Do not bind this to the official player database or claim full user migration.
 */
import type { LegacyRegistrationAccount, LegacyRegistrationStore } from "./original-register";
import type { OriginalD1 } from "./original-db";

export class D1LegacyRegistrationStore implements LegacyRegistrationStore {
  constructor(private readonly db: OriginalD1) {}

  async exists(username: string): Promise<boolean> {
    const row = await this.db.prepare(
      "SELECT 1 AS present FROM legacy_users WHERE username = ? LIMIT 1"
    ).bind(username).first<{ present: number }>();
    return row !== null;
  }

  async insert(record: LegacyRegistrationAccount): Promise<boolean> {
    // Parameterized, atomic and strictly insert-only. Never overwrite existing
    // player data. The supplied password is already the ORIGINAL stored hash.
    const rawRecord = JSON.stringify({ ...record, roomid: 0, lastvisit: 0 });
    const result = await this.db.prepare(
      "INSERT INTO legacy_users (username,password,groupid,roomid,raw_record,lastvisit) " +
      "VALUES (?,?,?,?,?,?) ON CONFLICT(username) DO NOTHING"
    ).bind(record.username, record.password, record.groupid, 0, rawRecord, 0).run();
    if (!result.success) throw new Error("D1 registration insert failed");
    return result.meta?.changes === 1;
  }
}
