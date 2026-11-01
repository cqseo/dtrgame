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


## 2026-11-01 staging deployment after Wrangler OAuth

- Wrangler OAuth confirmed on VM-0-10 as 1054935976@qq.com.
- **Only staging** `dtrgame-original-1to1-staging` was deployed from tested commit `f43fc1a16a132e8f27f9b533e4a8744be8746ad8` with `wrangler deploy --keep-vars`; exit code 0.
- New active staging version: `a175e415-7f3f-4964-a34d-6593dd45b73e`; deployment `3a3ed86e-7aa4-40d4-89b4-ebe3aebbd780`, 100% of **staging** traffic.
- Previous staging rollback version: `cffdc2ac-e9ff-4250-8767-688aebccdc90`; deployment `2b1ee59b-4f3a-4684-a149-3abd5662d33a`. Versions retained on Cloudflare.
- Verified Cloudflare version binding names after deployment: `APP_ENV`, `ASSETS`, `ROOMS`, `GAMES`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`. The secret value was **not** read or logged.
- Live staging GET smoke: `/help.php`, `/index.php`, `/register.php`, `/rank.php`, `/itemhelp.php`, `/end.php`, `/login.php`, `/game.php`, and `/__stage_status` all returned HTTP 200.
- The original broken staging `/help.php` changed from 500 to 200, returning 897,234 bytes; it now renders full HTML containing the original help/crafting text.
- **Still NOT exact 1:1 parity:** read-only HTTP comparison against unmodified production `https://dts.zhangyingyin.top/help.php` returned 1,260,839 bytes versus 897,234 staging bytes. First byte difference at offset 24,753: original says 35 map areas, staging says 1. Further legacy map/module initialization and help content require parity work.
- No production Worker, PHP source, or live player state was modified by this deployment. PR #18 remains draft and the production cutover gate remains CLOSED.


## 2026-11-01 22:45 China — Mercenary/NPC parity correction (new staging version)

- Current review branch commit: `bd221992e1b9e123219026e0f4c3f5b15b6e7860`, **NOT main**.
- Root cause of 1508 missing lines in original public help: `skill56::init()` declares `global $skill56_npc` before overwriting `$npcinfo[25]`. The interpreter kept captured module-level variables out of ordinary PHP globals, so it replaced the original 11-entry summon roster with NULL. The fix aliases only explicitly global variables that exist in the calling module's original variable store.
- Root cause of missing NPC portraits: Worker runtime `file_exists` ignored packaged public images. Added a deterministic inventory of **820** bundled public static files and **672** image dimensions read from original GIF/PNG/JPEG headers; host `file_exists`/\`getimagesize\` can now recognize original portraits, without exposing private PHP/config files or requiring filesystem access.
- Permanent regressions in `test/legacy-help-page.test.ts` verify summoned mercenary names and original `img/n_150.gif`/`img/n_160.gif` links. `test/legacy-public-static-assets.test.ts` verifies actual image dimensions and path restrictions.
- `npm run test:low-memory` finished **74/74 test files passed**, exit 0; log: `/tmp/dtr-npc-full-regression.log`. This is **not** 735-module acceptance.
- Worker dry-run reported `--dry-run: exiting now.` with 841 assets and 34,167.70 KiB Worker code. Wrapper completion marker was interrupted briefly during RAM exhaustion; the subsequent actual deployment succeeded.
- Added a **temporary, non-persistent 2 GiB swap file** at `/swapfile-dtrgame-staging` (no fstab change), bringing swap to 3 GiB to avoid Desktop Commander disconnections while uploading. Disk had ~14 GiB free afterward.
- Deployed **staging Worker only** with `wrangler deploy --keep-vars`, exit code 0. New active version `0a8b2d71-6a31-448b-93a2-47c8638a974f`, deployment `5287850f-d716-4d27-afeb-a90e6a74ac12`; confirmed by Cloudflare API at 100% **staging** traffic with all six original binding names preserved. Rollback: previous staging version `09705247-ce03-4875-96c8-9d3f919d8945`.
- Post-deployment smoke: GET `/help.php`, `/index.php`, `/register.php`, `/rank.php`, `/itemhelp.php`, `/end.php`, `/login.php`, `/__stage_status` all HTTP 200.
- Actual deployed help `1,261,666` bytes vs unmodified production PHP help `1,260,839` bytes: **5 line-level differences** remain in guest-page skill cooldown hints and enabled/disabled skill buttons. These could be stateful/cached output; do not hard-code away without an original PHP oracle that accounts for player/session/time/cache. Maps and the 11 mercenary rows/portraits now render.
- **Production PHP site, production Worker, main branch and live player data not modified.** Draft PR #18 remains unmerged. Signed-in routing, all 735 enabled modules, real E2E multiplayer, backups/rollback exercise and native TypeScript typecheck on a larger machine remain unresolved.


## 2026-11-02 00:18 China — Public map rendering and live staging acceptance

- **Original `map.php` bug found and fixed:** Before this checkpoint, the old live staging Worker returned HTTP 200 but its map had **zero location markers** (14,899 bytes), versus 34 place markers in the isolated original PHP response (16,754 bytes). The original `map.php` includes `common.inc.php` and calls `sys\\routine()`, which loads the current game record before template rendering. The Worker performed this read-only bootstrap only for `command.php`, leaving the map display with empty area data.
- `src/legacy/php/runtime.ts`: now invokes the original compiled `sys\\load_gameinfo()` when `CURSCRIPT=map` and neither `NO_SYS_UPDATE` nor `LOAD_CORE_ONLY` is defined. **No timed match tick or database writes are added to public map pages.**
- Permanent regression in `test/legacy-map-page.test.ts`: persisted 35-region map is rendered with **34 location markers**, original location names and SELECT-only SQL activity.
- `npm run test:low-memory`: **75/75 test files passed**, exit 0, zero retries; `/tmp/dtr-map75-full.log`. `npm run build` Worker dry-run passed, 841 public assets, 34,167.84 KiB upload bundle; `/tmp/dtr-map75-build.log`.
- Cloudflare staging deployment from reviewed GitHub commit `ed957bed2037070f18067fc13b1023b5302ce38b`: **new active version `a0c6ec78-e64a-4606-b151-9535cf3488d7`**, deployment `81410a2c-b053-4517-9560-9ef74570c03b`, confirmed 100% **staging** traffic; Wrangler exit 0. Previous staging version **`0a8b2d71-6a31-448b-93a2-47c8638a974f`** retained as rollback.
- Verified new Worker binding names for `APP_ENV`, `ASSETS`, `ROOMS`, `GAMES`, `SUPABASE_URL` and `SUPABASE_SECRET_KEY`. No secret value was accessed.
- New real staging GET `/map.php` **HTTP 200, 16,752 bytes, 34 location markers**, correctly including 冰封墓场 and 常磐台中学. The isolated PHP output is 16,754 bytes. Comparison shows only the yellow/green warnings for a few areas differ; the databases are separate and **do not have identical game state**, so this is not a confirmed code mismatch nor byte-accurate acceptance.
- New `scripts/check-staging-readonly.mjs`, invoked by `npm run smoke:staging`: fixed-preview-host, GET-only smoke checks for 12 public/security/status paths. First direct test **12/12 passed**, log `/tmp/dtr-staging-smoke-20261101.log`. No staging accounts or matches were created by this check.
- Caveat: `test/original-routes-golden.test.mjs` still counts 17/23 byte-exact because it tests the Worker with **no Supabase secret**; six dynamic guest routes fall through to 501 there despite responding 200 on real staging. Never reinterpret that fixture ratchet as live staging parity.
- Registration/login/multiplayer write E2E was **not** executed in this checkpoint: the attempted staging-only test-account registration command was rejected by tool safety policy. Do not bypass the block. Existing 75 tests cover mocked authenticated flows but **not** a real two-browser multiplayer match.
- Main branch, production PHP and production player database remain untouched. `backendParity=false`, `playable=false`, signed-in route coverage and complete 735-module hook parity remain unresolved. PR #18 stays draft.
