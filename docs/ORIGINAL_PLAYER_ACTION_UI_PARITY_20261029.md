# Original ACFUN 大逃杀 1:1 TypeScript migration — core player action/command and original UI baseline (2026-10-29)

## Nonnegotiable acceptance contract

The deliverable is **the original ACFUN DTS game 1:1**, with unchanged original interfaces, art, typography/text, accounts, rooms, all gameplay, combat, skills, items, numerical rules, and the entire game loop. Only the PHP backend implementation is replaced by TypeScript on Cloudflare. No simulated NPC shortcuts, MUGEN replacement, fake UI, abbreviated rule engine, or partial "playable" claim. The production PHP website at `https://dts.zhangyingyin.top/` stays unchanged until fully verified and approved.

## What this milestone ACTUALLY changed

### Core player action and persistent state

Sources inspected read-only:
- `include/modules/core/player/main.php` `pre_act()`, `act()`, `post_act()`, `player_format_with_db_structure()`, `player_diff_from_poll()`, `player_save()`, `fetch_playerdata()`.
- `include/pages/command_act.php`: ordered command phases, initial auth/player checks, game state action guard, response encoding and subsequent player save.
- `command.php`: original socket daemon→action entry, client-server dispatch and lock release.
- `include/modules/base/explore/main.php`: original move/search hooks, actual 15-SP baseline, parent discovery and movement conditions inspected but **NOT** declared integrated.
- `include/modules/base/skillbase/main.php`: later override of player_save, **NOT yet integrated**.

Added isolated, testable pure TypeScript:
- `src/original-player-action.ts`: exact base `pre_act` death marker behavior; `menu`/`special` action; account-owned motto, killmsg and lastword on `post_act`; original `gamestate>=20 && hp>0 && state<=3` action condition; original no-login/room-entry/ended-game decision precedence.
- Original base `player_save` update planner: source `db_player_structure` allowlist, PHP strict-type comparisons with original pool, suppress unchanged fields, never update PID, death marker forced when HP<=0, forbid resetting `player_dead_flag`, preserve changed player pool and guard human writes by both PID and original user name. No staging player records were modified by this pure planner.
- Parameterized staging Supabase SQL builder whitelists only **real** source room player tables (standard and s1–s6,s8); the original MySQL `players.name` uses utf8_general_ci, so human-player name guard uses source-derived weight keys, rather than incorrect PG case-sensitive `name=$n`.
- `src/original-command-pipeline.ts`: injection-bound execution of **12 actual phases** from `command_act.php`: `init_playerdata → pre_act → [conditional act] → post_act → prepare_response_content → parse_interface_profile → parse_interface_gameinfo → gencode → echo → update_sdata → before_last_player_save_event → player_save`. The current TS execution awaits the save hook and does not claim real gameplay/module-chain implementation.

### Source-parity tests and Cloudflare QA

- Original PHP synthetic fixtures: `test/fixtures/original-player-action-php.json`: 15 pre_act, 35 act, 288 command guard, 12 save scenarios = **350 new source-based vectors**; generated without reading any real account records.
- `test/fixtures/original-command-pipeline-php.json`: actual **12 phase order** extracted read-only from installed original `command_act.php`, with the correct final response emission after the main `gencode` call.
- `test/original-player-action.test.ts` and `test/original-command-pipeline.test.ts` include SQL whitelists, original utf8_general_ci player names, death one-way flag, response-before-save phases and awaited async save.
- **719/719 local Vitest cases across 10 test files; `tsc --noEmit` passes.**
- Isolated nonproduction Cloudflare QA Worker `dtrgame-original-verification-qa-20261029` deployed and directly checked from Baota:
  - `/__selftest`: 200, pass.
  - `/__register_selftest`: 200, pass.
  - `/__gameplay_selftest`: 200, pass, 12 synthetic tactic/cooldown checks.
  - `/__player_pipeline_selftest`: 200, pass, 9 synthetic player phase/save checks and 12 source-ordered stages.
  - `/game.php`: 404 intentionally; **no public fake game route**. This QA Worker has no real player DB bindings.

### Original UI/assets immutable preparation

Source inventory: `/opt/dts-sandbox/backups/legacy-ui-reference-20261028/`.

- A 1,565-file, 35,559,421-byte original UI archive was checked **file by file with SHA-256**, zero missing or differing content; original archive SHA-256 `52abb75a53fa27fb5ab2bfabc08f612b691917ed7dbc48ea1fdc266227f094dc`.
- **All 1,565 live PHP source UI files still match** the baseline manifest on 2026-10-29 (zero missing, zero changes).
- Original assets include **856 .htm**, **389 .png**, **255 .gif**, plus original CSS, JS, JPG and other resources.
- `scripts/verify-original-ui-archive.py` verifies the original immutable archive.
- `scripts/stage-original-ui-assets.py` checks every archive entry and copies original bytes without changing names/content into the **private isolated** `/opt/dts-port-workbench-20261029/original-ui-staging`. Actual staged: 1,565 files / 35,559,421 bytes, zero missing. It refuses writes inside `/www/wwwroot`; no production PHP files altered.
- These templates and assets are **not deployed** to Cloudflare public assets yet; serving original PHP-generated HTML byte-identically requires original template renderer/data binding work and source-based browser parity.

## Strict remaining gates

1. **Player action chain integration:** Both pure base `player` and `command` phases must be connected to all enabled source module `$chprocess` overrides, original input/profile construction, original lock semantics, state mutations, original response (gzip/base64 JSON), and saved results. A callback phase trace is NOT the full engine.
2. **Real movement/search/item mechanics:** Port actual `explore` + `map` + `metman` + `trap` + `itemmain` source chain; enforce original SP rules, cooldown, encounters, forbidden zone, and all overrides.
3. **Original PHP full parity:** 744 original modules listed, 735 enabled; **0 fully accepted**. Partial port coverage is NOT a playable game.
4. **Cloudflare storage/runtime architecture:** Preserve original 66-table schema/53 source accounts staged in isolated Supabase; implement per-room isolated transactions/locks, daemon/tick scheduling, original real-time room state, first-login/session/cookie compatibility, and safe production rollback.
5. **Complete UI and assets:** Wire and exercise original templates/assets/screens unchanged in Cloudflare staging; verify actual browser output across device sizes and gameplay modes.
6. **Full multiplayer E2E:** Synthetic accounts only until all original mechanics accepted. Verify original login→room→join→move/search→items→encounter/combat→death/revival→endgame/replay with golden PHP numeric comparisons.
7. **Final source reconciliation:** MyISAM/MEMORY means the Supabase data is a verified **non-atomic point-in-time snapshot** and has no ongoing sync. Freeze/last-delta reconciliation needed before final cutover.

**No production cutover, no public fully playable Cloudflare game claim.**
