# Original engine continuation — 2026-11-02

This is an implementation checkpoint, **not release acceptance**. The user
requires the original ACFUN game 1:1, with no changed UI, assets, text, accounts,
rooms, skills, items, modes or numerical rules. Finish all five outstanding
areas before calling the migration complete. Production PHP, real player data,
GitHub main and the currently deployed staging Worker have not been changed.

## Implemented in this branch

- `original-game-engine.ts` initializes all 735 enabled original modules from
  captured pre-init configuration, then runs the original command page ASTs.
  Original daemon input filtering and replay recording are generated from
  original source, rather than reconstructed game logic.
- The request SQL working copy uses SQLite Wasm for actual predicates, sorting,
  projection, joins and arithmetic. All 65 original state tables and 124 player
  fields are represented. The PHP socket listener table is transport only.
- Fixed namespace fallback, defining-file magic constants, module globals,
  function array arguments, explicit references, foreach aliases surviving
  break, extract, array union assignment, shared output buffers, byte strings,
  string offsets, compression, named regex callbacks and UTC time functions.
- Original virtual files preserve binary bytes, directories and generated
  caches. This includes match-dependent caches; treating all caches as
  disposable would change gameplay. Original reset scripts clear the fixed
  captured schema and reset identity counters; arbitrary CREATE scripts fail.
- `original-request-transaction.ts` executes original commands against a
  disposable SQL/filesystem copy. It releases a response only after a complete
  canonical PostgreSQL transaction. Lost acknowledgement recovery uses a
  durable request identity and version fence.
- New migration `20261102171000_original_full_request_transactions.sql` installs
  disabled. It commits canonical rows, files, directories, exact identity
  counters, match-ending uniqueness and the original response receipt together.
  All entry points are service-role only. It has **not** been installed in the
  connected Supabase project yet.
- `OriginalGameActor` serializes one original room and persists uncertain
  requests before commit. Its Worker switch defaults off. The new binding and
  migration are prepared locally; public routing is not switched to this actor.

## Verification completed

- 13 synthetic language cases compared to the actual original PHP 8.2.35:
  references, array copy/union, extract, binary offsets/base64/gzip, UTC dates,
  nested output buffers, invalid string isset, regex callbacks, HTML quote flags.
- Original full-engine tests cover original errors, menu, stance/movement,
  lethal battle, complete ending hooks, rewards/history/news, replay archive
  creation and unpacking (including a 3,056-byte BMP and response frames),
  revival skills 545/475 at their exact boundaries, rated-mode 10,000 ELO
  simulations, reset, all rs_game hooks, NPC/drop/shop generation and two
  synthetic accounts entering the next game through command_valid.
- Complete PostgreSQL transaction tests cover consistency, duplicate receipt,
  competing writes, preimage changes, rollback, recovery fences and identities.
- Request integration covers an original tick/action, committed replay and
  response, lost acknowledgement, conflict recomputation and failed recovery.
- Core targeted rerun after workspace maintenance: **40 tests passed**.
- Previous full serial run: **90/90 test files passed**, including one retry
  after the PHP oracle fixture was updated during that run. Optional external
  PHP oracle suites are not counted as having run when skipped.
- Actual PostgreSQL **17.11**, two separate sessions, isolated Docker container
  `dtr-settlement-qa-20261102`, disposable DB
  `dtr_original_full_qa_20261102`: **7 drills passed**. These include simultaneous
  duplicate and competing commits, both commit/recovery lock orders, terminating
  a backend before COMMIT, and a pg_dump/pg_restore exact snapshot comparison.
  The test database gate was disabled afterwards; no real player data used.
  Reproduce with `tools/verify-original-transactions-postgres.py` on a fresh QA DB.
- TypeScript check passed. Worker dry build with the new actor/Wasm binding
  passed: approximately **4.16 MiB compressed**. No deployment performed.
- `vitest.config.mjs` mirrors Wrangler's precompiled Wasm import contract.
  Existing frontend tests pass after inlining sql.js for Vite transformation.

## Outstanding work — do not hide these behind a playable flag

1. Wire public original wrappers, command transport, room long polling and
   account operations to the complete engine and transaction boundary. The
   existing public gameplay path still uses the earlier handwritten kernel.
2. Preserve original wrapper redirects/errors and daemon cookie propagation.
   Finish direct command branches (area timing, room routine), background
   scheduling and the installed room-type-14 timed-game extension.
3. Exercise remaining resurrection/special-win/team/achievement and all-mode
   scenarios; compile-time inclusion alone does not prove runtime compatibility.
   Static callable audit still reports unresolved names, including transport/
   maintenance-only functions, and must distinguish them from real game gaps.
4. Execute the actual Worker Wasm engine, then full two-browser desktop/mobile
   flows against disposable storage and compare original HTML/visual fixtures.
   The local Wrangler startup currently fails on the execution host with
   `uv_interface_addresses` permission error, before a server listens.
   `tools/original-worker-probe.ts` is a loopback-only synthetic workerd probe;
   use the isolated remote test environment if this host cannot start workerd.
5. Validate cutover/rollback, including old-writer fencing and identity handling.
   Never enable both the old allocators and the new transactional counters.
   Install the new migration and deploy staging only after the relevant checks.

The later continuation sections below supersede the wiring, workerd-startup
and writer-fence items above; broad acceptance gates remain open.

## Source/capture facts

- Frozen authoritative source: `/opt/dts-sandbox/parity/legacy-dts`, read-only.
- Local original source is sanitized and omits private server config files.
- True pre-init capture: 361 modules, 1,309 variables, 14 credential-shaped
  values withheld; SHA-256
  `c61b9488bccbd01d3f360d71bf050c56e828fbd3e574307e57356313474280d8`.
- Captured by instrumenting a **private copy** immediately before each original
  init, allowing upstream init calls to run normally. Setting DRY_RUN before
  common.inc.php is invalid because modules.func.php resets that flag.
  `scripts/prepare-preinit-capture.py` records the reproducible preparation.
- Generated runtime metadata has 5,970 function source paths and 127 readonly
  data files. Raw drop/shop/event files must be scanned beyond codeFiles.
- Deployment remains Cloudflare connector only, no GitHub Actions. Draft PR
  #18 and branch `work/original-parity-20261101` remain the continuation target.

## Later continuation: original wrappers and waiting-room transport

- Actual remote **Cloudflare workerd** probe passed with all 735 modules:
  pose 5 persisted, replay frame recorded, original game HTML rendered (38,768
  bytes, original ACFUN title and game command form). This used synthetic local
  state, not Supabase or a completed browser match. sql.js's browser adapter
  required optional `self.location` access; its exact upstream SHA is checked by
  `generate-sqljs-worker.mjs`. Original SQLite Wasm bytes are unchanged.
- Under the still-disabled `DTS_ORIGINAL_ENGINE` switch, original public PHP
  wrappers now supply daemon inputs and render committed responses. Their own
  redirect/error/cookie logic executes, including logout, GET room arguments
  and `valid_ip`. Daemon cookie changes are reissued through original code.
- Room configuration and the installed quickmatch runtime are compiled from
  source. Original include magic paths are scoped to the included file.
- The original socket-listener schema is request-local transport state and is
  excluded from canonical game diffs. Original SHOW TABLES checks inspect real
  installed working-copy tables. No dummy game state or broadcast result is
  returned.
- Original `roomupdate.php` authentication, checks and HTML rendering execute
  on both sides of a DO wait. The socket-only middle is replaced. The request
  commits and releases its room queue before waiting; notifications occur
  after canonical commit. Generation checks prevent lost wakeups, and timeout
  is the original 30 seconds. Disconnects remove their timers/subscriptions.
- New complete-engine scenario passed: original SOLO creation, second account
  joins/seats/chats, lobby HTML/state poll, both ready, original initialization
  and entry into the same running match. Closing/wake behavior still needs
  broader coverage and actual deployed multi-browser verification.
- New original gameplay scenarios passed: skill 58 revives once with unchanged
  HP/defense gains and dies on the next lethal battle; team-mode 14 includes a
  dead teammate in the victory list/flags; end3/end5/end7 execute their original
  history/news/reward/replay chains. These do not prove every special ending.
- Targeted engine/request/SQL/wrapper/subscription tests: 28 passed before
  additional scenarios. Actor queue/poll/HTTP tests: 12 passed. New special
  scenarios: 5 passed. Fresh complete serial regression: **93/93 files passed,
  zero retries, zero failures** (external PHP suites remain optional/skipped).
  TypeScript check passed and Worker dry build passed: 39,089.49 KiB source,
  4,265.68 KiB gzip, 841 static assets. No deployment performed.
- **Remaining gates are still open:** account/index routes and other public
  operations must move to this same transaction path; dynamic original room
  schema creation beyond captured installed rooms, direct daemon branches,
  background scheduling, skill 427/other special cases, achievements/all modes,
  actual two-browser full matches, complete PHP differential/visual checks,
  old-writer/identity cutover, connected database installation and deployment.
  The original public kernel remains active; no production or player data was
  changed. This checkpoint must not be presented as 1:1 completion.

## Later continuation: account pages, original room slots and writer cutover

- All 31 compiled public PHP entry points now route through original wrappers
  or original page scripts under the disabled engine switch. Nineteen standalone
  pages have anonymous and cookie-authenticated GET execution checks. This is
  route/runtime coverage, not full acceptance of every page action or visual.
- Original login/quit, registration challenge and insertion, initial 100 gold
  and card 0, profile/password/settings edits, recovery-code generation/reset,
  one original 99-gold card draw/insufficient-funds refusal, inbox attachment
  claim-once, deletion/archive and original 100-gold recovery all passed.
- All account/page writes now share canonical request transactions; redirects
  and cookies are released only after commit. Login receipt/persistence tested
  together in PostgreSQL-compatible integration. Core-only pages use original
  core.list.php initializers and hook chains rather than all extension hooks.
- Original index/map/chat execute in the same engine. Index's asynchronous
  room-routine self-requests are queued after commit. Original direct area-timing
  and room-routine command branches are source-generated and tested.
- Original mysqli ordered multi-row insertion and VALUES(column) duplicate
  updates now execute, enabling deleted-message archives/recovery. Three
  GAME_ROOT-derived captured card paths are rebased to the Worker virtual root;
  the raw authoritative capture and all gameplay values are unchanged.
- Added synchronous SHA-1/SHA-256, native secure random bytes and hash comparison
  for original account recovery. Compared independent native digest outputs
  across binary data and block/padding boundaries through 1,000,000 bytes.
- Verified the original direct error.php returns HTTP 500 with exactly 1,018
  partial HTML bytes (SHA-256
  `97a3ecf5525121cd757b5ec2cfa49a617405d42ea997b9846b67c70cf678686b`).
  Preserve this actual PHP behavior; do not invent CURSCRIPT to mask it. Other
  interpreter errors still fail visibly in tests rather than becoming success.
- The captured installation had state tables for rooms 1–6 and 8. Original room
  configuration allows 10 regular slots plus 2 perpetual types. New generated
  provisioning copies the exact original room-1 schema into missing room slots,
  producing **100 canonical state tables**. Original creation of room 7 passed.
  `20261102183000_original_room_slots.sql` refuses installation while enabled.
- `20261102190000_original_writer_cutover.sql` installs in legacy mode. Statement
  triggers fence all old writers (including older SECURITY DEFINER RPCs) while
  paused or original mode is active. Only complete commits open a scoped write
  flag, restored before returning. Cutover requires a separately committed pause.
  Rollback restores PostgreSQL allocators to original transactional high-water
  counters; later legacy ids are recollected before re-entering original mode.
- Fresh regression **96/96 files passed, zero retries/failures**; TypeScript and
  dry build passed (39,136.20 KiB source / 4,269.02 KiB gzip, 841 static assets).
  Afterwards a weekday/12-hour date-format defect affecting captcha seeds was
  found and corrected against the actual PHP 8.2.35 oracle. There are now **14
  real-PHP language cases**; affected engine/page/oracle rerun **60 tests passed**.
- Real PostgreSQL 17.11: **11 drills passed** on fresh disposable DB
  `dtr_original_slots_cutover_qa_20261102`, including all prior concurrency,
  crash and backup drills, old-writer fencing, rollback allocator restoration
  and re-entry. Final state is disabled/paused. No real player data used.
- No connected Supabase migrations, staging/production deployment or live
  account changes have been performed. Still required: background alarms,
  remaining all-mode/skill/card/item/achievement interactions (including skill
  427), full real-browser multiplayer matches and visual/source differential
  checks, generated replay/resource delivery and a rehearsed staging cutover.

## Later continuation: native Worker match, transport and MySQL coercions

- Core-only hook chains and initialization now follow the original core list
  insertion order. Function-created prefixed module globals alias page globals
  too; this fixes room cookie delivery when COOKIE_VAR_LIST was absent from the
  clean pre-init capture.
- Internal Durable Object fetch preserves original redirects with
  `redirect: manual`. Native workerd previously followed a successful login's
  `index.php` redirect inside the private actor and returned its transport 404.
- Original non-strict MySQL sparse batch CASE updates coerce NULL to the
  column's implicit default, and empty strings in integer fields become zero
  at each working-copy write. Both behaviors were checked through PHP 8.2.35
  against disposable MySQL temporary tables using the original connection
  configuration. No existing table or player row was changed. Broader numeric
  ranges, decimal conversion and collation still require differential checks.
- All twelve configured room-type entry paths now have source-engine checks,
  including the real future opening time that keeps room type 12 unavailable.
  These are entry checks, not complete playthroughs of all modes. Original
  skill 427 was exercised through two lethal battles, full-health revivals and
  skill 424 stack reductions from 3 to 1 to 0.
- Added `tools/verify-original-fullstack.mjs` and a local-only Worker entry.
  The runner uses native Miniflare/workerd, the production actor, SQLite Wasm,
  actual canonical SQL transaction functions and a disposable PGlite protocol
  endpoint. Synthetic accounts only; no replaced game logic, stat inflation or
  database edits after initial seeding. Run from the repository root:

  ```sh
  ./node_modules/.bin/esbuild tools/verify-original-fullstack.mjs --bundle --platform=node --packages=external --format=esm --outfile=tools/.original-fullstack-runner.mjs
  node tools/.original-fullstack-runner.mjs --finish-match
  ```

  Remove the temporary bundled runner afterwards; it is not source.
- Two independent account logins, room creation/join/seating, full original
  lobby HTML, long-poll wake by the other account's chat, both ready, complete
  world/NPC initialization and concurrent player commands passed in native
  workerd. A whole match then ended naturally with original NPC encounters and
  player attack commands, history, both end pages, victory/participation counts,
  duplicate-end-page idempotency, room recycling and the same accounts entering
  a new match with an advanced game number. The second complete run had zero
  RPC errors; the runner now rejects hidden deterministic SQL failures.
- The last human death was caused by an original NPC. This is not evidence of
  a player-vs-player lethal result, every reward category or visual/browser
  acceptance. It uses PostgreSQL-compatible PGlite; the prior eleven native
  PostgreSQL drills are separate evidence.
- The original server became available again. Read-only source inspection
  confirmed that daemon idle wakeups only manage daemon lifetime; they do not
  imply a new thirty-second gameplay tick. The installed nginx configuration
  really blocks `/gamedata/replays/` along with other non-CSS gamedata paths;
  replay/resource delivery needs an explicit compatibility decision and tests.
- No connected Supabase migration, deployment, production PHP change or live
  player-data modification has been performed in this continuation. Real
  browser/visual acceptance, complete all-mode/item/card/achievement coverage,
  remaining source/runtime compatibility and staging cutover are still open.
