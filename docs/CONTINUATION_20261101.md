# Continuation checkpoint — 2026-11-01

This is a **staging-only engineering checkpoint**, not a release or completion claim.

## Source of truth

- Production PHP game: https://dts.zhangyingyin.top/ — leave unchanged.
- GitHub base: `cqseo/dtrgame` at `7ae75d9`.
- Review branch: `work/original-parity-20261101`.
- Remote isolated checkout: `/opt/dts-work/dtrgame` on VM-0-10-opencloudos.
- Frozen **read-only** original source: `/opt/dts-sandbox/parity/legacy-dts`.
- Local symlink for fixtures: `/opt/dts-work/legacy-dts` (points to the frozen source).
- Target preview Worker: `dtrgame-original-1to1-staging`.
- Original 1:1 contract: `docs/ORIGINAL_GAME_1_TO_1_CONTRACT.md`.

## Verified before this checkpoint

1. The original asset hashes matched the captured manifest.
2. Low-memory Vitest regression run: **70/70 existing test files passed**, with three batches recovered through single-file isolation. This predates the new tests below.
3. Original PHP 8.2.35 MD5 oracle: one test passed.
4. Supabase snapshot: initial save/load, monotonic version update, stale-write refusal verified in a rolled-back SQL transaction; test match row absent after rollback.
5. Original HTTP fixture ledger: **17/23 signed-out** paths match exactly; **6** not yet matching.
6. GitHub main and original production Worker were not changed by this work.

## Changes made on the review branch after the 70-file run

- `scripts/run-tests-low-memory.mjs` and `npm run test:low-memory`: per-batch Vitest processes, bounded heaps, single-file retries.
- `src/index.ts`: corrected diagnostic route parity string to `17/23`; no release-readiness flag changed.
- `src/runtime/legacy-page-handler.ts`: PHP 8.2 cookie decoding preserves raw `+`, with regression coverage in `test/legacy-cookies.test.ts`.
- `src/runtime/room-durable-object.ts`: work on a cloned room record, do not publish it into memory until persistence succeeds; persist implicit heartbeat/readiness changes even when the legacy command reports `changed=false`; serialize initialization/hydration.
- `test/runtime-room-durable-object.test.ts`: verifies failed Supabase writes do not mutate the active snapshot, storage failure safety, heartbeat writes and concurrent initialization.

**New code/tests have NOT been run**. They must not be merged or deployed before validation.

## Required next checks

On a healthy VM-0-10 (or a larger isolated development runner):

```bash
cd /opt/dts-work/dtrgame
git status --short
git fetch origin work/original-parity-20261101
git switch work/original-parity-20261101
git pull --ff-only origin work/original-parity-20261101
npm ci
DTS_TEST_FILE_FILTER='legacy-cookies,runtime-room-durable-object' npm run test:low-memory
npm run test:low-memory
DTS_PHP_BIN=/www/server/php/82/bin/php npm run test:php-parity -- md5
```

Do **not** run the native TypeScript 7 `tsc --noEmit` binary at full project scope on the current 2 GiB host: it exhausted RAM and swap and the remote Desktop Commander stopped responding. Run the full `npm run verify` only on a runner with adequate RAM. No GitHub Actions deployment should be added.

## Remaining acceptance gates

- 6 signed-out HTTP routes, plus outstanding signed-in fixtures.
- Full login, lobby, original game UI, original command.php and match conclusion parity.
- Every enabled PHP module/hook parity against the executable original (735 enabled modules, 5,235 hook implementations; no module has received a full acceptance verdict).
- All modes, cards, skills, items, battles, ranks, replays, admin/daemon parity and desktop/mobile screenshots.
- Real multisession E2E, persistence, concurrency, crash recovery, migration, backups and rollback drill.
- Only after all release gates pass may the production entry be considered for replacement.

## Safety

Never modify the production PHP source or player database to make tests pass.
Keep Supabase server secrets outside GitHub and browser bundles.
Do not deploy unverified preview code or change the production Worker.


## Latest tested checkpoint — 2026-11-01 19:30 Asia/Shanghai

Everything listed below is **verified on the detached PR #18 worktree**, not deployed:
- PR HEAD includes the original `help.php` runtime fix and one permanent two-case regression test.
- Unmodified original public help page was **HTTP 500** on the existing staging deployment; Cloudflare Observability showed `Renderer.include` failure. The new local runner renders the original page (~708 KB) from compiled frozen PHP data and original skill module template sources. **The existing staging deployment is still old and the endpoint may continue returning 500 until deliberately redeployed.**
- Regenerated included data source from the read-only original: 23 include/page files. `npx --yes tsx scripts/generate-compiled-modules.mjs --only-includes --check` passed.
- `node scripts/generate-help-module-templates.mjs --check` passed.
- `DTS_TEST_BATCH_SIZE=1 DTS_TEST_HEAP_MB=640 DTS_TEST_RETRY_HEAP_MB=768 npm run test:low-memory`: **73/73 files passed, exit 0**, log `/tmp/dtr-pr18-help-full.log`.
- `npm run build`: **dry-run passed, exit 0**, 841 assets, Worker bundle 32111 KiB, log `/tmp/dtr-pr18-help-build.log`.
- **41** original PHP 8.2 differential assertions passed over map areas, room prefix, search memory, game tick, crafting, module vars, card pack, attack format, item actions, and game result.
- Wrangler CLI on VM-0-10 is **not authenticated**. No staged or production deployment occurred in this checkpoint.
- Native full `tsc --noEmit` remains **unverified**; do not run on the 2 GiB VM because it previously exhausted the machine and disconnected Desktop Commander.
- No original player records or production PHP source changed. Keep PR #18 draft and do not merge main until release gates pass.

### Immediate continuation order

1. Re-establish authorized preview deployment capability for `dtrgame-original-1to1-staging` without affecting production.
2. Deploy reviewed PR code to **staging only** after confirming configuration/secrets; test `/help.php`, `/index.php`, `/register.php`, and actual test-user room and game command lifecycles.
3. Compare actual help HTML and status against frozen PHP golden reference (successful render alone is not 1:1 proof).
4. Test original mode/module/hook coverage comprehensively (735 enabled modules), then authenticated route fixtures.
5. Run native type check on a larger runner, stress tests, data backup and rollback drill. Only then consider main merge or production cutover.
