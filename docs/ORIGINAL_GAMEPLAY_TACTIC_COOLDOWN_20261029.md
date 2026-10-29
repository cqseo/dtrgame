# Original ACFUN DTS tactic + cooldown source-parity milestone — 2026-10-29

## Exact read-only PHP sources used

- `/www/wwwroot/dts-game-test/include/modules/base/tactic/main.php` (144 lines).
- `/www/wwwroot/dts-game-test/include/modules/base/tactic/config/tactic.config.php`: exact Chinese tactic names/descriptions and numeric factors.
- `/www/wwwroot/dts-game-test/include/modules/base/cooldown/main.php` (197 lines).
- `/www/wwwroot/dts-game-test/include/modules/base/cooldown/config/cooldown.config.php`.
- `/www/wwwroot/dts-game-test/command.php` and `include/pages/command_act.php` inspected to identify how commands enter the daemon, dispatch through `pre_act → act → post_act`, serialize the response, and save the player state.

## TypeScript implementation in isolated parity branch

- `src/original-tactic.ts`: original 5 tactics, player choices 2/3/4, source Chinese logs, attack/defense factor **list prefixing**, counter veto under avoidance tactic, 30-point counter bonus under tactic 3, encounter/hide chance shifts, 75% chance to reduce trap damage, trap escape bonus, avoidance of forbidden zone while `gamestate < 40`, and NPC/human log behavior.
- `src/original-cooldown.ts`: source enabled flag, move/search cooldown 650 ms, item-use 250 ms, max-duration `set_coldtime`, remaining time and command veto, `post_act` anchored to **page start time**, normal vs initial response and original `demiSecTimerStarter` HTML.
- Pure functions use injected clocks/random rolls for deterministic comparison. They do not read or modify live player data.

## PHP-reference fixture generation and actual results

- `test/fixtures/generate-tactic-cooldown-fixtures.php` reads the actual PHP config files and evaluates source formula copies in a synthetic CLI harness.
- `test/fixtures/original-tactic-cooldown-php.json` contains **265** synthetic golden vectors: 15 tactic calculations, 96 deterministic trap rolls, 10 tactic command/log cases, 144 cooldown cases. No original player data.
- `test/original-tactic-cooldown.test.ts` compares exact config numbers, combat multipliers, cooldown millisecond boundaries, original Chinese logs, response HTML, and timeout behavior.
- Together with existing registration, account, and protocol tests, the isolated workbench passes **359/359 Vitest tests across 8 files**, TypeScript `tsc --noEmit` passes.

## Actual Cloudflare Workers QA deployment

Independent nonproduction Worker: `dtrgame-original-verification-qa-20261029`.

- `GET /__selftest` → 200 / `pass:true`, original registration challenges.
- `GET /__register_selftest` → 200 / `pass:true`, synthetic registration.
- `GET /__gameplay_selftest` → 200 / `pass:true`, 12 real Workers runtime checks of tactic/cooldown using synthetic game state.
- `GET /game.php` → 404 as designed; the QA Worker is **not playable**.
- QA Worker has no production database bindings, and original public `dtrgame` Worker is NOT modified.

## Important limits and release gates

Neither tactic nor cooldown is a fully accepted module. Both are source-equivalent **individual mechanics**, but the source `$chprocess` chain, original combat module overrides, skill modifiers, player movement/search/itemuse real side effects, timers/daemon, and transaction boundaries have not been integrated into a complete playable action dispatcher. Source original PHP has 744 modules (735 enabled), and the full UI/assets are separate required work.

**Updated ledger:** `tactic` remains partially ported, `cooldown` becomes a partially ported module. 30 partial modules, 714 pending, 0 fully 1:1 accepted.

Prior Supabase data milestone is independent: all 66 source tables, 41,612 snapshot rows and 53 accounts were imported into isolated `acfun_legacy` and source-vs-Postgres byte-checked. No live incremental sync/cutover.

The live original PHP website and its real MySQL accounts remain authoritative and unchanged. This milestone cannot be used to claim the game is playable.
