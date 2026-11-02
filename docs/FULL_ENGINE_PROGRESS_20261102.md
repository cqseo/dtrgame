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
