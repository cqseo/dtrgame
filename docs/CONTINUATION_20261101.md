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


## 2026-11-02 08:25 China — Isolated two-player lifecycle and error boundaries

- **Development scope only**: all application changes are on draft PR #18's `work/original-parity-20261101` branch, **not** `main`.
- `src/runtime/room-service.ts`: catches transient DO fetch, failed room snapshot hydration, malformed command content, and failed room commands; propagates a structured `{ ok:false, status:409, error }` instead of allowing an unhandled exception to become HTTP 500. Distinct `no_login` (401) and missing room (404) statuses stay intact.
- `src/runtime/game-service.ts`: catches failed Supabase/match retrieval, failed match restore and command transport, and malformed command bodies. Do not report a failed command as successful.
- `test/runtime-service-failure-boundaries.test.ts`: six new fault-injection assertions verify room read, room restore, invalid form, command write, game read, game restore, and game command error paths (with some combined assertions). All passed.
- `test/runtime-isolated-two-player-lifecycle.test.ts`: one new **isolated** end-to-end test connects actual `LegacyRoomDurableObject`, `LegacyGameDurableObject`, `LegacyMatchStarter`, and cookie-authenticated `LegacyGameService`, using in-memory DO storage and mocked Supabase match/account adapters. Starts a ready two-player waiting room, verifies red/blue players and version-zero snapshot, submits concurrent commands under separate cookies, confirms serialized version 2 and independent player poses/tactics, and rejects an unauthenticated state request. **This is NOT a deployed two-browser login/multiplayer test.**
- Fresh `npm run test:low-memory`: **77/77 test files passed**, zero retries, exit 0; log `/tmp/dtr-77-full-20261102.log`.
- Fresh `npm run build`: **exit 0**, 841 static assets, 34,168.14 KiB Worker code; log `/tmp/dtr-77-worker-build.log`. Native whole-project `tsc --noEmit` remains unverified on the 2 GiB VM.
- Deployed **staging Worker only**, exit 0, from code commit `55a7a2fb85b64e088bcaf8cdf5f9aa52a5f4adda` with `wrangler deploy --keep-vars`. New version `9a8c0828-2c3b-45dc-bad0-dacef76af1bb`, deployment `9f8b9bd0-6df8-4d9a-b815-8e0adf01aaec`, Cloudflare confirmed 100% **staging** traffic. Retained rollback version `a0c6ec78-e64a-4606-b151-9535cf3488d7`.
- Cloudflare API verified all bindings remain: `APP_ENV`, `ASSETS`, `GAMES`, `ROOMS`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`; no secret values read.
- `npm run smoke:staging`: **12/12 live GET-only checks passed**, exit 0, including help, map, index, register, game/room anonymous handling, retired installer and forbidden command GET; log `/tmp/dtr-77-staging-smoke.log`. Status explicitly continues `backendParity:false` and `playable:false`.
- Production PHP, production Worker, live players, and main branch **unchanged**. Real database-backed two-account UI game test, all 735 module/hook parity, race/crash recovery, DB migration, rollback exercise, and type checking on a larger host remain unresolved. Do not merge or cut over.


## 2026-11-02 09:08 China — Corpses now actionable from browser game command panels

- **Original gameplay defect repaired:** Previously the match Durable Object had a private `/corpse` route, but no usable browser `command.php` transport or corpse-action command panel. Players who discovered a corpse couldn't use money, equipment, backpack, destroy or exit actions even though internal unit tests existed.
- `src/runtime/game-render.ts` now renders a context-specific corpse UI when server-held `action` matches `corpse<pid>` or `pacorpse<pid>` and the corpse is dead in the same area. It shows original-style actions for available cash, equipped items, backpack slots 1–6, destroy and menu; it escapes names and embeds commands with `mode=corpse`. Original source: `include/modules/base/corpse/main.php` and `corpse.htm`.
- `src/runtime/game-service.ts` routes authenticated `mode=corpse` commands to the match's `/corpse` handler. It **does not trust user-supplied target names**.
- `src/runtime/game-durable-object.ts` resolves the corpse's pid from the player's saved encounter action, validates target identity, corpse death and same area, refuses dead looters and unknown item positions; `menu` exits without looting. Mutations commit both player and corpse in one version, and replay after the encounter is cleared returns 409. Unsupported original special corpse skills remain unimplemented.
- Added **7 passing tests** in `test/runtime-corpse-gameplay.test.ts`, covering escaped/rendered corpse choices, authenticated money/item/weapon transfer, destroy, menu exit, forged target rejection, unknown commands, dead looters and duplicate pickups.
- Full low-memory regression **78/78 test files passed**, zero retries, exit 0; log `/tmp/dtr-corpse-78-full.log`.
- Worker dry-run build **exit 0**, 841 assets, 34,170.81 KiB Worker code; log `/tmp/dtr-corpse-build.log`.
- Reviewed code head `476327b0ae5bcf361f3b169064f9ade51ec8a915`. Deployed **staging Worker only** with `wrangler deploy --keep-vars`, exit 0, new active version **`afab72d0-9712-4100-932d-718392e5e1a3`**, deployment `09ccae56-257b-4db8-9ea2-1b497919b9e9`, Cloudflare confirmed 100% staging traffic. Rollback version: `9a8c0828-2c3b-45dc-bad0-dacef76af1bb`.
- Verified all prior Cloudflare bindings remain: `APP_ENV`, `ASSETS`, `GAMES`, `ROOMS`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`; no secrets read.
- `npm run smoke:staging`: **12/12 read-only live HTTP probes passed**, exit 0; log `/tmp/dtr-corpse-staging-smoke.log`.
- **Limits:** No real browser-based authenticated looting on staging has been exercised because previous attempt at creating a real staging test account was blocked by tool policy; not bypassed. There is also no full original PHP oracle coverage for all corpse extensions (e.g., skills and special corpse rules). `backendParity=false`, `playable=false`. All 735 original modules are not accepted. No production changes, no merge.


## 2026-11-02 09:20 China — Server-owned battle target and weather

- **Battle manipulation hardening / original encounter behavior:** In the previous browser path, `src/runtime/game-service.ts` forwarded `target` from the player's form and weather from the separate match metadata into `/battle`. The DO verified the target's pid against `player.action`, but still required a client-supplied target name; a different weather value than the persisted live game could influence rules.
- `game-service.ts` now sends only the authenticated `username` and server `now` to the `/battle` handler; `game-render.ts` removes the unused client-side hidden enemy name.
- `game-durable-object.ts` resolves the defender exclusively from the **server-persisted encounter action** `enemy<pid>`, validates the defender is a different player in the same area and both fighters are alive, and accepts an optional legacy internal target only when it matches. The assault always uses the **persisted `state.weatherId`** and active attacker semantics, ignoring spoofed `weatherId` and `active` fields in internal request bodies.
- New tests in `test/runtime-game-service.test.ts` and `test/runtime-game-durable-object.test.ts`: authenticate real cookie transport, prove forged `target` isn't forwarded, prove a third player cannot be attacked, prove no-encounter attack is rejected with no snapshot revision, and prove forged weather / initiative result in **exactly the same persisted match and battle result** as normal attack under deterministic RNG.
- `DTS_TEST_FILE_FILTER='runtime-game-service,runtime-game-durable-object,runtime-http-game' npm run test:low-memory`: **3/3 test files passed**. Full low-memory regression `npm run test:low-memory`: **78/78 test files passed**, zero retries, exit 0, log `/tmp/dtr-battle-78-full.log`.
- Worker `npm run build`: **passed**, 841 assets, 34,171.07 KiB bundle, exit 0; `/tmp/dtr-battle-worker-build.log`.
- **Cloudflare staging only**: deploy from reviewed commit `5252e35619dbf8cab0c47d3214dc6d7c6138b548` with `wrangler deploy --keep-vars`, exit 0. **Active version `43dd74a2-42d6-45e0-88f5-a37e17d83bff`**, deployment `38d3373e-6ba5-46b4-84c7-f15c92d40b1f`, confirmed 100% staging traffic. **Rollback version `afab72d0-9712-4100-932d-718392e5e1a3`.**
- Cloudflare API checked all six binding names `APP_ENV`, `ASSETS`, `GAMES`, `ROOMS`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`; no secret values read.
- Live read-only `npm run smoke:staging` **12/12 passed**, exit 0, log `/tmp/dtr-battle-staging-smoke.log`. Staging `playable=false`, `backendParity=false` is still intentional.
- **Still not production ready:** complete 735-module/hook parity and real database-backed authenticated multi-browser battle not verified. This test enforces current covered battle behavior, not all original PHP combat extensions. Production PHP, player data, production Worker and `main` unchanged; PR #18 stays draft.
