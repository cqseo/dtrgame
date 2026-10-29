# ACFUN DTS — original trap/item/event partial effects (2026-10-29)

## Acceptance contract and safety

The final target is the **unaltered original ACFUN 大逃杀** (all screens, characters, original images, accounts, rooms, movement/exploration, combat, skills, traps, item mutations, numerical formulas, chat, game modes and endings) with only PHP backend replaced by Cloudflare TypeScript. A synthetic QA Worker or passing unit tests must **never** be described as playable. Production PHP, MySQL and the main dtrgame Worker remain unchanged.

## Source PHP checked directly, read only

- `include/modules/base/items/trap/main.php` — `discover`, `trapcheck`, `calculate_real_trap_obbs`, `get_traplist`, `trapget`, `trap`.
- `include/modules/base/items/trap/config/trap.config.php` — minimum **1.5%**, outer cap **40%**, +0.25 per original map trap.
- `include/modules/base/itemmain/main.php` — `discover_item`, `discover_item_filter`, `focus_item`, `discover_extra_item`, mapitem SELECT and DELETE, item in hand `itm0/itmk0/itme0/itms0/itmsk0`, original Chinese logs.
- `include/modules/base/event/main.php` — event special trigger if original art is not `Untainted Glory`, location 34, and nonduel.
- Existing `src/original-discovery-chain.ts` outer discovery, original source order `event → trap → metman → itemmain` and source original random calls.

## Added verified isolated TypeScript ports

- `src/original-trap-select.ts` — **outer rand(0,99), inner rand(0,39), random trap selection rand(0,n-1)**, original trap-count percentage. Requires authoritative source-ordered trap list and injected original `resolveTrap()`. Exposes `originalTrapCheckAfterOuter` so the higher-level discover chain does **NOT** repeat the outer roll. Refuses lost concurrent trap deletion.
- `src/original-item-discovery.ts` — original all-items-per-place SELECT, source injected `shuffle` and `filter`, delete selected iid when positive, hand-slot state, PHP durability truthiness, `itemfind()` callback and `discover_extra_item()` callback. Exact base logs for no map items and filtered/no valid item. Refuses lost delete races.
- `src/original-event-base.ts` — original location/art/duel event gate only.
- `src/original-discover-effects.ts` — source base handlers connected to prior event/trap/metman/itemmain chain without double-drawing random values. Throws when real event/combat side-effect implementations are absent.
- `src/original-supabase-discover.ts` — *QA-only* parameterized Supabase maptrap/mapitem read/claim adapter; explicitly whitelists original standard and s1–s6/s8 rooms, forbids invented s7; uses original MySQL username-weight function to sort `itmk` rather than incorrect JavaScript locale sorting. Callers must provide same-session transaction/room lock for mutation safety. Does not expose source account data or implement autonomous combat.

## Grounded tests and actual SQL smoke

- Generated source formula reference fixture `test/fixtures/original-trap-item-event-php.json` from installed PHP configuration: **140 trap random cases, 16 level escape/reuse cases, 36 item durability/filter cases, 18 event special location cases**.
- New Vitest files:
  - `test/original-trap-item-event.test.ts`
  - `test/original-discover-effects.test.ts`
  - `test/original-supabase-discover.test.ts`
- Source counterexample: cooldown and outer trap roll are not consumed twice; interrupted trapping prevents downstream item search; original item focus occurs after a successful claim; remaining shuffled item pool passed to source extras callback.
- Entire source workbench **1,578 / 1,578 tests pass, 15 files, TypeScript check passes**.
- Rolled-back Supabase synthetic transaction on original s8_maptrap and s8_mapitem: inserted 1 of each, original ordered select found 1 of each, delete returned 1 of each, rolled back. Follow-up verified **zero test rows remained** and 53 original users unchanged. This is a SQL smoke test, not a full player-action transaction or combat simulation.

## Real Cloudflare QA runtime

Isolated `dtrgame-original-verification-qa-20261029` Worker:
- `/__selftest`, `/__register_selftest`, `/__gameplay_selftest`, `/__player_pipeline_selftest`, `/__explore_selftest`: HTTP 200 and pass true.
- NEW `/__effects_selftest`: HTTP 200, **6/6 synthetic tests pass**, checks item pickup and original hand slot, trap selection and no duplicated random check, source event special trigger.
- `/game.php` HTTP **404** by design; **gamePlayable:false**. QA Worker still has zero database bindings.
- Production `https://dts.zhangyingyin.top/` returned HTTP 200 and original source worktree had zero changes.

## Important outstanding blockers (not playable)

1. Real trap damage/avoid/reuse, attacker owner lookup, `player_save` / news side effects, corpse/death and skill inheritance.
2. Real `event_main` / `event_core` effect cases and all special/instance overrides.
3. Actual item `itemfind` presentation, source PHP shuffle PRNG compatibility, original extra-item and card/skill overrides.
4. Actual person discovery, metman, battle, damage, all item and skill effects, game/room daemon and **player + map deletion in a single transaction/actor lock**. Tests exercise injected callback interfaces, not completed original combat.
5. Full unchanged templates/assets rendering, login/sessions in Cloudflare and live multiplayer end-to-end acceptance.
6. Final MyISAM/MEMORY source delta reconciliation before any production release.

**Current classification:** partial source-specific mechanics, **0 fully accepted original modules**, no production cutover, no public playable Cloudflare game.
