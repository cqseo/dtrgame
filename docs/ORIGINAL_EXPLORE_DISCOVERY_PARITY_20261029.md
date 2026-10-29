# Original ACFUN DTS 1:1 migration — PHP map/explore/discovery base chain, October 29 2026

## Immutable acceptance standard

A **complete playable original ACFUN 大逃杀** whose original HTML/CSS/images, game descriptions, accounts, rooms, combat, character skills, inventory/items, mode-specific rules, probabilities, stats, timers, and progression remain the same. Replace PHP backend with Cloudflare TypeScript only. No fake NPCs, shortened sessions, reskin or simplified substitute. **No public release until full gameplay and asset parity is accepted.**

## Source used (actual original PHP is read-only)

- `include/modules/core/map/main.php`: `is_plsno_available`, `get_all_plsno`, `get_current_area`, `get_current_not_area`, `check_in_forbidden_area`, `check_can_enter`, area-wave count.
- `include/modules/base/explore/main.php`: movement/search base costs **15 SP**, move target and forbidden-area checks, SP guard `$sp <= $cost` (equal fails), source exact Chinese log and area transition, command mode gating.
- `include/modules/base/cooldown/main.php`: cooldown module wraps original `move`/`search` BEFORE the base exploration check. **Even an invalid destination or insufficient SP schedules the original movement/search cooldown** when previous cooldown permits execution.
- `include/modules/base/event/main.php` and `config/event.config.php`: default event odds **4%**, event check before traps; event triggering can halt discovery and reset mode.
- `include/modules/base/items/trap/main.php` + `config/trap.config.php`: first roll against **40%** cap, further trapcheck roll, minimum **1.5%** trap odds plus **0.25% per trap**, trap interrupts downstream stages when triggered.
- `include/modules/base/metman/main.php`: original base nearby-person rate 50 when none nearby in search/move/search2; otherwise 20+min(pcount×3,30) for search, 40+min(...) for move, 100 search2; final **20% minimum**. Source player discovery may interrupt item search.
- `include/modules/base/pose/main.php`: search pose **3** may continue to items after a failed person discovery, provided HP>0.
- `include/modules/base/itemmain/main.php` + config: default **60% item find check** with buff and multiplier; successful check invokes the real item discovery function.
- Original `explore/main.php` comment explicitly documents the base discovery order: **event → trap → metman → itemmain**; many extra skills/instances override this chain.

## New TypeScript source files

- `src/original-explore-map.ts`: source-based map membership/forbidden waves, hack exception, move/search SP guards, original Chinese messages, status updates and injected original override hooks.
- `src/original-discovery-chain.ts`: ordered event/trap/metman/itemmain interceptors; original default odds, metman encounter floor and trap count formula. It **throws rather than fabricate results** when a real event, trap, player or item handler is missing.
- `src/original-explore-cooldown.ts`: combines original cooldown wrapper with base movement/search and the discovery hook chain, preserving the cooldown-before-SP-check behavior. Rejects missing discovery implementations instead of falsely reporting a completed encounter.

**These are base-port mechanics, not a complete 1:1 action chain.** Event effects, real trap selection and damage, battle encounter, corpse/team behavior, map-item population and item pickup are not yet parity accepted. Other module overrides (weather, poison/burn/freeze/paralysis, cards, skills, instances) still need to be connected in the original source order.

## Source-based testing performed

- `test/fixtures/generate-explore-map-fixtures.php` loads the original PHP configuration files and copies the original base module branch formulas into synthetic CLI-only test scenarios; no actual player records or game writes are used. This is formula parity evidence, **not a full live PHP module invocation**.
- `test/fixtures/original-explore-map-php.json` includes:
  - **432** move cases
  - **72** search cases
  - **56** map availability/hack/forbidden cases
  - **28** encounter probabilities
  - **7** trap-count odds cases
  - **16** item-find odds cases
  - Total: **611 source-formula vectors**
- `test/original-explore-discover.test.ts`: validates these vectors and interruption order, injected overrides, original error text, map wave order, and explicit missing-handler failures.
- `test/original-explore-cooldown.test.ts`: checks real source composition including unsuccessful-action cooldown, SP=15 exact equality rejection, full-chain empty discovery, event interruption and source synthetic mode.
- Entire isolated workbench TypeScript `npm run check` and **1,347/1,347 Vitest tests passed across 12 files**.

## Actual Cloudflare Workers runtime

Independent QA-only Worker:
`https://dtrgame-original-verification-qa-20261029.dearpassengerscrew-new.workers.dev/`

- `/__selftest` 200 pass
- `/__register_selftest` 200 pass
- `/__gameplay_selftest` 200 pass
- `/__player_pipeline_selftest` 200 pass
- NEW `/__explore_selftest` **200 pass, 12 synthetic source-based runtime checks**
- `/game.php` **404 intentionally, not playable**.
- QA Worker has **0 database bindings**. It cannot query or mutate any real game account.
- Actual original PHP game at `https://dts.zhangyingyin.top/` still returns HTTP 200; original PHP source remains unmodified.

## Unchanged data/asset boundaries

- Original Supabase staging data mirror (66 source tables, 41,612 row snapshot, 53 accounts) remains isolated in `acfun_legacy`, no live sync nor cutover.
- All 1,565 original UI files were previously SHA-256 verified and byte-copied into private staging; actual original HTML/CSS/image rendering in Cloudflare still pending.
- **0 source modules fully accepted**: generic base formula tests are not equivalence of complete module inheritance, daemon, battle, events, UI, or live state transitions.

## Next release blockers

1. Port and verify actual `event_main`, `trapcheck/trapget`, `discover_player`, and `discover_item` with original DB-side mutations and all skill overrides; deterministic source PHP cross-verification for real outcome edge cases.
2. Wire original `$chprocess` ordering and cooldown/post-act player save to a staging-only room transaction/lock actor; protect concurrent battle, revive/death marker and endgame state.
3. Original login/session/cookies, actual unchanged templates and image URLs on Cloudflare, full multiplayer end-to-end tests.
4. Reconcile non-atomic MyISAM/MEMORY source and latest player delta before any release.
5. Preserve production PHP website, account data, and main `dtrgame` Worker until complete acceptance.

**Status: base exploration logic validated and deployed only to synthetic QA; no public playable Cloudflare original game.**
