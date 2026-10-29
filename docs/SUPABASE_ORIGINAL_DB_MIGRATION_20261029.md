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
