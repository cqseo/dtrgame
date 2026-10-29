# Original ACFUN DTS Cloudflare entry wiring — 2026-10-29

## Release contract

The only acceptable production replacement is **the full original ACFUN 大逃杀 1:1**, preserving all original assets, HTML/text, old accounts, rooms, mode-specific content, combat, skills, items, gameplay values, player-save behavior, concurrent room state and complete playthroughs. PHP currently remains the sole working game backend. No frontend/UI version may be labeled "playable" until real end-to-end multiplayer play, full parity and explicit approval.

## Actual PHP source analyzed, read-only

- `game.php`: `render_page('command_game')`, original quit branch.
- `include/pages/command_game.php`: `$cuser/$cpass` gate, `players WHERE name='$cuser' AND type=0`, `valid.php` redirect before gamestate check, legacy player `pass` resync, finished-game `end.php` redirect, state 4/5/6 `end.php` redirect, `init_playerdata`, original `pre_act/post_act`, and mode selection: death/rest/itemmain/command.
- `include/roommng/room.func.php`: `room_id2prefix` / `set_current_roomid`; actual source s1..s6 and s8 player tables, no player table for s7.
- `include/global.func.php`: request forwarded through `render_page` to `command.php` and source cookie names.
- Source original login `login.php` retains 15-day user/pass cookies and legacy account password hashes.
- Source `templates/default/game.htm` includes nested PHP/DZ-style template commands and module variables; must NOT be replaced by a guessed static page.

## Work completed

- Added `src/original-game-entry.ts` as a **read-only, QA-only original game entry gate**:
  - Legacy cookie authentication through existing exact MD5-compatible stored-hash verification.
  - Original prefixed room cookie parsing with support only for actual source room-player tables.
  - Parameterized player lookup using **original MySQL utf8_general_ci weight key** instead of PostgreSQL default collation.
  - Correct player-before-gamestate redirect precedence and basic source-derived game mode selection.
  - Detect source-required player.password hash synchronization; refuse to silently skip the write.
  - Return an explicit `needs_original_template_renderer` state instead of fake rendered gameplay or leaking credentials.
- Added `test/original-game-entry.test.ts`, 17 synthetic cases for cookie failures, 0/1..6/8 room IDs, player absence, finished games, states 4/5/6, rest/item/death modes, hash resync, SQL parameterization and inability to expose credentials.
- Updated `src/parity-worker.ts` with `GET /__game_entry_selftest`: 6 synthetic checks of source entry/login/room code, no player data or credentials.
- Isolated workbench: **23 test files / 4,282 Vitest tests pass; TypeScript compilation pass**.
- Published **only** independent `dtrgame-original-verification-qa-20261029` Cloudflare Worker, deployed HTTP 200. `/__game_entry_selftest` responded HTTP 200 / pass true / 6 checks. `/__encounter_battle_selftest` 22/22; `/__combat_phases_selftest` 8/8; `/__register_selftest` pass. `GET /game.php` still returns 404 deliberately. Settings re-read: **0 database bindings**.
- Supabase staging SQL verified without returning private user rows: 9 game table records, 53 historical accounts and 53 username weight index entries, 381 standard player rows, 374 s8 player rows, original players schema 124 fields, 0 tables directly accessible by anon or authenticated. One unused source room 7 has a game record but not an s7 player table.
- Original PHP website `https://dts.zhangyingyin.top/` returned HTTP 200; original read-only source worktree has zero modifications.

## Specific release blockers

1. The *real* Worker `game.php` route still has no production-compatible implementation. Current gate does **not** execute PHP-equivalent `player.init_playerdata` skill hooks, chat/news/profile, original compressed page response, dynamic template files or original page JS/CSS asset service.
2. Browser login, session validation, original rooms and actual handler `command.php` are NOT integrated with the private Supabase database in the Cloudflare runtime; QA deliberately has zero bindings.
3. Full skill inheritance/order, fight/death/revival, original per-room daemon and timed events, all game modes, inventory, original map item effects and battle state are incomplete.
4. Original 1,565 byte-identical assets are archived/staged privately, NOT deployed as the complete UI/renderer on Cloudflare.
5. Real 2+ player end-to-end sessions and source-vs-TypeScript 1:1 numeric/visual regression testing, non-atomic MyISAM/MEMORY source delta reconciliation, migration rollback and failover plan remain.
6. Live accounts and source PHP game must stay untouched until complete parity signoff.

## Launch recommendation

If the project must remain publicly accessible immediately, **keep the existing original PHP game in production**, with its normal Cloudflare DNS/proxy as appropriate. That does not equal PHP→TypeScript migration. Do not switch `dts.zhangyingyin.top` or main production `dtrgame` Worker to the incomplete QA Worker.

Next implementation should wire `command.php` request/response entry and dedicated worker-side Supabase runtime connector, behind isolated test-only origin and nonproduction user data; then original template engine and actual multiplayer room state; then full source module effects and final acceptance. Tests should prioritize real stateful end-to-end behavior, not raw unit-test counts.

**Status: entry gate completed and verified, game not publicly playable.**
