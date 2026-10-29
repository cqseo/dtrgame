# Original ACFUN DTS PHP → TypeScript: trap damage, player-kill phases and room transaction (2026-10-29)

**User release contract:** Original UI/assets/text/accounts/rooms, all game modes, items, skills, battle, damage, numerical rules, death/revival and endgame must be exactly preserved. Only PHP backend is replaced by Cloudflare TypeScript. Must be genuinely fully playable and multiplayer-tested. **DO NOT CLAIM FULL PARITY OR SWITCH PRODUCTION BASED ON THESE UNIT TESTS.**

## Actual source read-only audit

Installed original PHP on /www/wwwroot/dts-game-test:
- include/modules/base/items/trap/main.php, especially get_trap_escape_rate, get_trap_damage, trap_deal_damage, trap_hit, trap_miss/reused/broken.
- include/modules/core/player/main.php, especially kill(), set_revive_sequence(), revive_process(), deathnews(), and post-revive news.
- Multiple real trap/killing overrides exist in extra/club, extra/instance, extra/card, extra/achievement, weather and ex_attr. Their effects are not silently assumed to equal the base implementation.

Original base details verified:
- Trap hit/escape: min(90, 8 + level / 3 + (self-placed?50:0)), roll rand(0,99).
- On miss, trap reuse: 5 + level / 3 + (self?50:0), second independent roll rand(0,99); Chinese source text differs between reused and broken traps; reused TO→TN and mode=itemfind.
- On hit, base damage PHP round(rand(0,strength/2)+strength/2), including PHP float endpoint coercion. Apply ordered multipliers, round and minimum damage 1 only when multipliers exist, then ordered up/down/change modifiers, HP deduction, post-hit hooks, news and owner log.
- On lethal damage, original trap_hit sets state 27 and calls original player.kill(), which performs kill stats and revival. Merely subtracting HP is insufficient.
- player.kill() source phase ordering: hp zero/bid, message, human/NPC kill counters, game death/alive totals, endtime, save_gameinfo, set_revive_sequence, revive_process, deathnews (with snapshot HP updated post-revive), revived news.
- Original trap owner/self/sourceless attribution has distinct behavior. Player death and revived outcomes cannot be accepted without full module precedence.

## Implemented in isolated TypeScript

1. `src/original-trap-damage.ts` — source base trap hit/miss branch, original roll and damage calculations, multiplier and modifier callbacks, original logs, owner news, mode/hand state. **Requires onLethalDamage callback** for actual kill/revive handling, fails otherwise; does not fabricate revival.
2. `src/original-player-kill.ts` — original source core kill phase ordering and in-memory counter mutations, source cloning before revival, exact conditions for human-vs-NPC counts and self/sourceless attribution. All external save/revive/news hooks are mandatory. This does NOT implement all `revive_process` ability/skill overrides.
3. `src/original-room-transaction.ts` — QA-only same-session PostgreSQL `BEGIN / pg_advisory_xact_lock(room) / COMMIT / ROLLBACK` transaction primitive. Prevents maptrap/mapitem claims being committed separately from player saves when all callers participate. Requires dedicated PG session, rejects invalid room and production usage. It is not yet integrated into public gameplay.
4. Existing source 66-table Supabase staging copy and 53 original account rows remain unchanged; no switch to production.

## Verifiable source parity

- `test/fixtures/generate-trap-damage-fixtures.php` produced **2,336 synthetic formula reference vectors** from copied original PHP baseline arithmetic (no actual player rows). Fixture is committed compressed as `original-trap-damage-php.json.gz.base64`; tests use node:zlib to decode. The source generator is committed.
- `test/original-trap-damage.test.ts`: compares 2,336 original PHP cases against JS result, RNG endpoint, damage, self/miss/reuse and fatal-hook behavior, source callback sequence.
- `test/original-player-kill.test.ts`: source kill stats and phase ordering, NPC kills, self-placed traps, sourceless victims and reversible revival callback.
- `test/original-room-transaction.test.ts`: same-session lock before writes, successful commit, rollback after a selected item is deleted but save fails, invalid room rejection.
- Full isolated TypeScript workbench: `tsc --noEmit` successful; **3,926/3,926 Vitest cases passed across 18 files**.
- GitHub devDependencies/lock updated with `@types/node` so the compressed source fixture is typechecked in the project.

## Cloudflare Workers QA live test

The independent Worker `dtrgame-original-verification-qa-20261029` was updated and verified:
- NEW `GET /__combat_phases_selftest`: **HTTP 200**, `pass:true`, 8 synthetic checks of trap damage, kill stats, source phases and room advisory transaction.
- Existing `/__effects_selftest`, `/__explore_selftest`, `/__player_pipeline_selftest`, `/__register_selftest` remain HTTP 200 / pass true.
- `GET /game.php`: 404 intentionally. **No playable game route**.
- QA Worker continues with **zero database bindings**, no real player data access. Actual production PHP site HTTP 200 and original source worktree changed file count zero.

## Not yet 1:1 playable — hard blockers

- Trap card, club, achievement, instance and other override branches; full damage calculation inheritance.
- Full original `player.kill()` logic inside each ability chain, genuine revival conditions, deaths/news, simultaneous owner/victim save and room counter writes.
- Original combat weapon hit/defense, NPC discovery/meeting, all modes and skills, actual events, shop/forbidden zone/timers/daemon and full state persistence.
- Cloudflare HTML/CSS/media page fidelity and login/session wiring; actual end-to-end original game command API and rooms; multiplayer and cross-client tests.
- Isolated Supabase snapshot 66 original tables / 41,612 rows / 53 accounts still non-atomic relative to ongoing MyISAM/MEMORY game writes; final reconciliation required.

**Status: meaningful verified BASE source mechanics only; 0 modules entirely 1:1 accepted; no player access or production cutover.**
