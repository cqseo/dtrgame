# ACFUN DTS original PHP → Supabase private snapshot and MySQL username parity — 2026-10-29

## Original site safety boundary

Source game remains at https://dts.zhangyingyin.top/ and must not be switched during this work.
Source PHP and source MySQL have **not** been modified. This work is **staging only**; not a playable 1:1 TypeScript cutover.

## Source data archive — actually completed

- Private server: VM-0-10-opencloudos.
- Snapshot root: /opt/dts-sandbox/backups/mysql-original-20261029 (0700).
- Run 1: 20261029-021530-79131.
- Run 2: 20261029-022833-80134.
- Each run uses **read-only** MySQL SELECT and streams 66 gzip JSONL table snapshots.
- Each run has **41,612 rows** total. Every gzip JSONL was locally decompressed, independently hashed and its row count checked: **66/66 SHA-256 and row counts pass**.
- **66/66 table file hashes identical** across the two runs. This shows no detected data changes between reads; it does **NOT** guarantee a globally consistent snapshot because 58 source tables use MyISAM and eight chat tables use MEMORY.
- Each private account file and manifest is mode 0600; no account records, passwords, hashes or private game-state records were committed to GitHub or pasted in chat.
- Private source includes all 53 original account records, but the Supabase table currently holds **36/53**. No transfer of remaining 17 has occurred this turn.

## Supabase destination — actual status

- Existing connected dtrgame project: qtjcjmpapjsgrrgtfica, private schema acfun_legacy.
- Previously created 66 original game tables, 1,609 original columns, 112 indexes and three staging/audit tables; 69/69 had RLS enabled, 0 browser-visible tables.
- Added audit marker **mysql-readonly-20261029-021530 / source_archive_verified**. This marker is source-file metadata only; it does not indicate uploaded game rows.
- Confirmed actual PostgreSQL JSONB recordset INSERT against synthetic game room in a rolled-back transaction. No synthetic room persisted.
- Import code **scripts/import-original-snapshot.mjs** supports read-only source integrity verification and an explicitly gated private PostgreSQL server-side write mode. Offline verification ran successfully against all 66 tables and 41,612 source rows.
- To transfer data safely, a **server-side credential stored privately on the authorized server** is needed (DTS_SUPABASE_PG_URL). This is not available in the current environment. Do not put credentials in GitHub, a browser page, chat, command-line arguments, or public Workers bindings. The importer checks the exact Supabase project target; import is not run until the private connection is configured.

## Source-derived original MySQL username equality

- Original account username uses **MySQL utf8_general_ci**, not PostgreSQL or generic Unicode ICU equivalence.
- Generated all 63,488 representable BMP codepoint WEIGHT_STRING values from the installed source MySQL (not from real player names).
- 1,108 nonidentity weights were emitted into **src/generated/legacy-mysql-weights.ts**. Other BMP codepoints equal their own weights.
- **src/original-mysql-collation.ts** constructs the original MySQL 2-byte-per-codepoint key, treats MySQL PAD SPACE trailing U+0020 correctly and refuses non-BMP characters unsupported by legacy utf8mb3 storage.
- Tested original MySQL Unicode synthetic pairs: case, accents, Turkish I, German ß, kana, CJK and combining diacritics; no approximation using PostgreSQL ICU.
- Read **53 source user names only on the private server** and computed source-derived weight keys locally: 53 valid, 53 distinct, 0 collisions; no usernames were emitted to the tool result.
- **src/original-supabase-db.ts** now queries a private username_weight_index by original weight keys. Atomic registration CTE prevents a new account from being committed without its weight index row. No web-facing registration endpoint has been switched to this adapter.
- The planned private PostgreSQL weight/index DDL is in **sql/acfun_legacy_mysql_username_weights_20261029.sql**, containing only Unicode mapping numbers. **That SQL has not been applied**; an attempt to apply the change via the current connector was blocked. Existing Supabase users table and data remain untouched by this step. Do not mark weight-index-backed login ready.
- Verified locally by isolated TypeScript compilation and **87/87 Vitest unit tests**.

## Remaining release blockers

1. Safely connect the original Baota server directly to the authorized Supabase private PostgreSQL DB, apply the planned private username index schema and import the missing 17 account records (along with 66-table staged data). Do not circumvent connector security controls.
2. Verify **53/53 full row fingerprints** in Supabase, including preserved UID and original password hashes. Existing migrated 36 had previously passed full 39-field hashes.
3. Verify the MySQL username equality behavior via real PostgreSQL SQL function and index against the original MySQL reference; test multibyte and concurrent registration under actual DB transactions.
4. The original MyISAM/MEMORY global snapshot is **non-atomic**. Before any live use, establish consistent freeze/last delta capture and ensure chat MEMORY lifecycle semantics are preserved.
5. Complete the original PHP room command, daemon, items, skills, combat, all enabled modes/modules, original UI/assets and end-to-end multiplayer 1:1 acceptance.
6. Preserve production PHP routing and all original player data until approved cutover and rollback plan.

Status: **staging snapshots and compatibility code progressed; no production cutover**.
