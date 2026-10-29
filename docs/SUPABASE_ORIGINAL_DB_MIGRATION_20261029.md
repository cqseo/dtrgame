# Supabase original ACFUN DTS database mirror — 2026-10-29

Scope: Original **PHP → TypeScript** and original game UI/behavior unchanged. No official cutover.

## Destination
- Connected Supabase project: `dtrgame` (`qtjcjmpapjsgrrgtfica`).
- New private schema: `acfun_legacy`, separate from existing `public` tables.
- `acfun_legacy.users`: **39 columns**, matching the installed production MySQL users table metadata. All other original game tables must be accounted for separately.
- `acfun_legacy.source_tables`, `snapshot_runs`, `snapshot_rows`: metadata, audit and generic original-table snapshot staging.
- RLS enabled on all four private schema tables; schema USAGE revoked from `anon` and `authenticated` (verified false), as well as `service_role` for this staging schema; no public browser access.
- Security advisor identifies 4 informational "RLS enabled no policy" findings for intentionally private tables. No policies are desired until a properly authorized backend is ready.

## Exact read-only source inventory
- MySQL source had **66 tables** during inspection (including `users`, `game`, `players`, `s1`... room-specific tables, maps/items/traps and histories).
- Original MySQL users table: **53 accounts**, UIDs 1 through 53, 39 fields.
- The `information_schema.TABLES.TABLE_ROWS` table figures are estimates, not exact record counts.
- The original username unique index uses `utf8_general_ci`. PostgreSQL default comparisons are NOT automatically equivalent and must be tested before permitting registrations or changing accounts.
- Prior 124-field player/game-state inventory is separate from the 39-field users table.

## Actual Supabase staging state
- Supabase has **36 copied user rows** (unique UID=36, unique username=36; UIDs 1–36).
- Remaining **17** original accounts (UIDs 37–53) have **not** been imported. Migration is partial and blocked from cutover.
- Verified that 36 copied stored password hashes each have length 32, and key required fields are present. **This is not a full per-field parity audit**.
- Updated staging user identity sequence to the current maximum UID, 36.
- `snapshot_runs` entry `schema-inventory-20261029` is marked `partial_account_copy`.
- `source_tables` and `snapshot_rows` are currently empty; no other original game tables have been imported.
- The export containing original players' sensitive data is kept only on the authorized Baota server under the isolated directory `/opt/dts-port-workbench-20261029/`, file `users-export-private.json` (0600); it is NOT uploaded to GitHub.

## Required for a safe next migration step
1. Use an authorized service-side, encrypted transfer path for remaining 17 account rows; do not paste hash-bearing user rows into chat or source control. Transfer was partly interrupted by data-protection gating; do not evade safeguards.
2. Reconcile ALL 53 rows field by field with the original MySQL source, detect duplicate/username collation conflicts, preserve original UID, and verify accounts can sign in with existing cookies under TypeScript.
3. Implement and verify a read-only consistent snapshot of all 66 tables. For frequently updated room/game/player data, establish a consistent snapshot or controlled maintenance window to prevent mixed-timestamp state.
4. Add incremental change capture, final delta reconciliation, authenticated multiplayer E2E testing, backups and rollback before any cutover.
5. Keep `dts.zhangyingyin.top` PHP original and existing `dtrgame` Cloudflare Worker unchanged until full parity acceptance.

**Do not represent this as complete migration.**


## 2026-10-29 continued development: COMPLETE STRUCTURE MIRROR, NOT DATA CUTOVER

- Generated 65 additional tables based only on live MySQL `information_schema` column/index metadata, and applied them in 11 staged SQL transactions.
- **Verified each of the 66 original tables and all 1,609 fields per table against the Supabase information_schema, with zero missing or mismatched table field counts.**
- Original MySQL has **112 index definitions**; corresponding private staging tables now have 112 index definitions.
- The Supabase private schema contains 69 tables total: 66 game tables and 3 staging/audit tables. **69/69 have RLS enabled; 0 tables grant anonymous or authenticated browser SELECT**.
- Persistent original MySQL engines: 58 MyISAM; transient original chat tables: 8 MEMORY (standard and s1–s6, s8). PostgreSQL cannot reproduce MyISAM/MEMORY semantics just by copying schema.
- `acfun_legacy.source_tables` now lists all 66 source table names, 1,609 columns and their original engine classifications.
- The current schema-only reproducibility artifact is `sql/acfun_legacy_original_66_tables_schema_20261029.sql`, with manifest `docs/ACFUN_LEGACY_SCHEMA_TABLE_MANIFEST_20261029.json`. It contains only DDL, **no player records or passwords**.
- On both original MySQL and Supabase, calculated a **single SHA-256 aggregate** across all **36 currently copied users and all 39 original user fields**, in identical order and byte-length canonicalization. Both aggregate digests matched exactly; no individual user row or password hash was emitted into the chat or GitHub. Remaining 17 accounts are still not imported.
- A real Supabase test transaction inserted a synthetic user with the original 100-gold/group-1 starting fields, confirmed their values, then **rolled it back**. No synthetic account was left in the 36-row staging user table.
- A second rolled-back test inserted a synthetic room and preserved roomvars/gamevars strings as-is.
- Original MySQL `utf8_general_ci` versus candidate PostgreSQL nondeterministic ICU collation was tested using 13 **synthetic string pairs**: 7 comparisons behaved differently. The ICU test collation was removed after the test. **Username lookup and uniqueness are not approved for live cutover.** The existing PG unique index must not be assumed equivalent.
- Added `src/original-supabase-db.ts` for parameterized full-schema account registration/lookup and `src/original-supabase-game.ts` for read-only game and original room/player table mappings. Both explicitly reject production-mode use pending exact parity acceptance. The Baota isolated workbench has **56/56 unit tests passing**.
- This uses Supabase project `qtjcjmpapjsgrrgtfica`, `acfun_legacy` only, and did not alter public existing product tables, live Cloudflare game Workers, or the original PHP production website.

### Remaining hard gates

1. Transfer remaining 17 private account rows through an approved encrypted server-side mechanism; earlier direct cross-tool transfer was blocked and will **not be bypassed**. Continue to keep the full source user snapshot only in the protected private Baota workbench, never GitHub.
2. Verify 53/53 accounts plus all field contents, preserve UID/password hashes and original login/session behavior; implement MySQL username collation parity before accepting registration and login.
3. Transfer actual rows from all 66 original game tables using a consistent snapshot and incremental synchronization, particularly dynamic room state and player inventory.
4. Match original PHP game command, room state, daemon/tick, combat, item/skill calculations, and full original interface; perform multi-user parity acceptance and rollback planning.
5. Do **not** point production PHP, the main `dtrgame` Worker, or user-facing traffic at the staging DB until accepted.

