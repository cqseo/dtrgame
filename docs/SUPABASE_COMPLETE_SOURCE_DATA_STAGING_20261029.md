# ACFUN DTS — verified original MySQL → private Supabase staging import (2026-10-29)

**Destination:** Supabase `dtrgame` project `qtjcjmpapjsgrrgtfica`, isolated private schema `acfun_legacy`. This is an **original PHP data snapshot mirror**, not a game cutover or permission to expose the table data.

## Actual completed work

- Secure Baota → Supabase PostgreSQL **Session pooler** connection verified. Node.js `pg@8.16.3` used with TLS enabled and `rejectUnauthorized:true`, actual authorized peer certificate and hostname. The root CA fingerprint was checked against the publicly documented Supabase Root 2021 CA fingerprint (`807025ad50d4ed219d2c9c7d299c004f824eb00cf7f65afef607d07b72e6cafa`).
- Database URI remains on the authorized server in root-only `/root/.config/dts-migration/supabase.env` (0600). **No connection string, password or player record is committed to GitHub.**
- Generated a readonly local source snapshot from installed original MySQL: `20261029-021530-79131`, stored outside webroot. Per-table gzip JSONL, SHA-256, row count and source field metadata verified.
- Applied staging copy into **66/66 original source tables, 41,612/41,612 rows**. Includes standard game and genuine separate s1–s6, s8 room data, players, shop/map items, traps, chat, historical records, and all 53 accounts.
- Pre-existing **36 source-identical** staging accounts were preserved; imported the remaining **17 accounts**. Supabase now has **53/53 original account rows**.
- Independently verified **each of the 66 original tables with a multiset digest of every source field of every row**. Both source snapshot and Supabase computed canonical byte-length/null/value SHA-256 per row; each table's sorted row digests aggregated. **66/66 tables match, 41,612/41,612 records, 0 content mismatches.** Sorted row digests detect missing/duplicate rows without relying on undefined MySQL SELECT order.
- Original 53 users: independent SHA-256 over **all 39 fields in UID order** matched between the original snapshot and Supabase: `f6775ea9ef2a64bf722d0581458c5ef9a26cd657153a62fb1555b508c5ea5539`.
- Source MySQL `utf8_general_ci` 1,108 custom BMP weights staged. Original username weight index contains **53/53 rows**. SHA-256 of UID + original username weight keys matches on source/Supabase: `5d5dc2d9fc798c00263af7db7513e449c20631e2c1b46246b98ced1d791cb4b6`.
- Rolled-back Supabase synthetic account test confirmed legacy case/diacritic lookup plus initial gold. No test player records remain.
- Original schema parity: **66 tables, 1,609 fields, 112 original index definitions**. Private schema has 71 tables total including the three audit and two username-weight tables; **71/71 RLS enabled, zero tables browser-visible to `anon` or `authenticated`**.
- A third, fresh readonly MySQL snapshot `20261029-025504-82786` matched the imported snapshot across **all 66 tables with 0 observed source changes**. This is a bounded observation, not ongoing change-data-capture or a globally atomic snapshot.
- Original PHP site and main Cloudflare Worker never changed. The original source snapshot tree remains clean and the original website responded HTTP 200.
- The isolated TypeScript workbench passed **88/88 Vitest unit tests**, including source-derived question/registration/cookie flows, original username weights, Supabase QA adapters, and safe duplicate-name handling. This is **not** full game-play equivalence.

## Reproducible code (no secrets)

- `scripts/mysql-readonly-snapshot.php`: readonly source SQL export, per table to local private gzip.
- `scripts/legacy-snapshot-core.mjs`: whitelist original source identifiers, staging target and source hash requirements.
- `scripts/import-original-snapshot.mjs`: protected private URI file, trusted Supabase CA, TLS peer verification, per-table insert-only transactions, source count confirmation and identity sequence reconciliation. Import is opt-in staging only, and refuses other Supabase projects.
- `scripts/calculate-source-table-fingerprints.py`: independent per-row source canonical digest.
- `scripts/audit-original-snapshot.cjs`: independent per-table destination content hash comparison (does not print row contents).
- `src/original-mysql-collation.ts` / `src/generated/legacy-mysql-weights.ts`: source-generated original username weighting.
- `src/original-supabase-db.ts` / `src/original-supabase-game.ts`: QA-only account and game-state adapters; production use remains gated.
- `sql/acfun_legacy_original_66_tables_schema_20261029.sql` / `sql/acfun_legacy_mysql_username_weights_20261029.sql`: schema-only reproducibility.

## Outstanding hard gates — DO NOT CUT OVER

1. **Snapshot consistency:** Original game uses 58 MyISAM tables plus 8 MEMORY chat tables. There is no cross-table atomic source snapshot; protect in-flight game and chat state using an agreed maintenance freeze and final delta/hash check before switching.
2. **Ongoing writes:** No CDC or continuous syncing has been configured. The copied game represents a verified point-in-time staging snapshot, not a live mirror.
3. **Full 1:1 engine migration:** Original PHP gameplay module logic, room command dispatcher, timers, combat, skills, items, event modes and legacy HTML/CSS/assets have NOT passed end-to-end parity acceptance. No user traffic is routed to the TS game. Do not substitute bots, abbreviated game loops or simplified gameplay.
4. **Login/session E2E:** Cookies, original password compat, concurrent registration and edge-case Unicode/utf8mb3 need production-like tests with dedicated synthetic staging accounts (never test against real player passwords). The QA adapter is not activated.
5. **Security/rollback:** Existing legacy password hashes are sensitive, and the PostgreSQL admin connection must remain server-only. Prepare least-privilege runtime DB access and backups, verify privilege boundaries, final source freeze and rollback before any deployment.

**Release status: database staging mirror fully imported & content-verified; original TypeScript game still under migration; official PHP production unchanged.**
