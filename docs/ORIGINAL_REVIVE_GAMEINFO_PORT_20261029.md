# ACFUN original 1:1 migration: revive priority + gameinfo save safety (2026-10-29)

The full final acceptance is unchanged: original ACFUN 大逃杀 UI/images/text/accounts, room controls, battle, item/skill/mode numeric behavior and full multiplayer loops, with ONLY PHP backend replaced by TypeScript and deployed on Cloudflare. **This feature milestone is not playable**, and the original production PHP + Cloudflare main Worker remain untouched.

## Actual source inspected (read-only)

- `include/modules/core/player/main.php` functions `set_revive_sequence`, `revive_process`, `revive_veto`, `revive_check`, `pre_revive_events`, `revive_events`, `post_revive_events`, `revive_post_deathnews`. The original source sorts sequence priorities with `ksort`, then checks mapped revival keys in order; empty sequence and veto short-circuit.
- `include/modules/core/sys/global.php` functions `gameinfo_audit`, `save_gameinfo_prepare_work`, `save_gameinfo`. It serializes `noisevars`, `roomvars`, `gamevars` using `gencode`, comma-joins `arealist`, and by default drops `groomid,groomtype,groomstatus,roomvars` from update payloads to avoid stale-room writes. Room identity still appears in SQL WHERE condition.

## Concrete new isolated TypeScript

1. `src/original-revive-process.ts`: original source priority sort, empty/veto behavior, callback-driven skill registration/check, original base revival HP=1, state=0, deathnum--, human alivenum++ or NPC npc_revived flag, exact pre/revive/post ordering, source original state preserved as `o_state`. Skill-specific overrides are injected; full skill inheritance is NOT done.
2. `src/original-gameinfo-save.ts`: 25 source game fields as allowlist, global count audit, PHP-inspired protected room settings, comma-joined original area list, original compressed wire-data fields, parameterized UPDATE plan. Runs under existing isolated `originalWithRoomTransaction` when calling game state. Does not itself write to database.
3. `test/original-revive-process.test.ts`: 270 synthetic PHP-reference branch formula cases, veto, priority and override ordering.
4. `test/original-gameinfo-save.test.ts`: source room fields nonoverwrite guard, gzip+base64 roundtrip, SQL whitelist, invalid room safety.
5. `test/fixtures/generate-revive-fixtures.php` and `original-revive-php.json`: synthetic branch reference generated with PHP on source host without any game or player data reads.

## Verification

- Isolated local TypeScript compile and **4,205/4,205 tests across 20 files** passed.
- The independent Cloudflare Worker `dtrgame-original-verification-qa-20261029` has **zero database bindings**, and `GET /__revive_gameinfo_selftest` returns **HTTP 200/pass true (8 checks)**. Existing trap/combat and explore QA selftest endpoints remain 200. `/game.php` remains HTTP 404 intentionally: **NOT PLAYABLE**.
- Original PHP game `https://dts.zhangyingyin.top/` remains HTTP 200; original source tree has 0 changes. Private source Supabase staging database holds 66 source tables, 41,612 point-in-time snapshot rows, 53 original accounts; no live cutover.

## Critical blockers before original 1:1 acceptance

- Actual revival effects for skill, club, card, achievement, instance and veto modules, complete `$chprocess` method inheritance/override order, including death news, owner and victim state.
- Complete original battle engine, skill effect combinations, event modes, item/weapon effects, real-time daemon and room tick.
- Original full game front-end rendering, browser routes/commands, session and encrypted original password login.
- Actual Cloudflare + Supabase actor/room state writes and concurrency tests with synthetic accounts (no production account changes).
- Real original multiplayer end-to-end test, source numeric parity checks and final original MyISAM/MEMORY player/account delta reconciling, rollback.
- Never treat isolated pure unit tests or synthetic QA Worker as sufficient release verification.

The previous unnecessary DAILY ACCEPTANCE WATCH automation has been disabled at the user's request. It does not perform development and is not a substitute for direct work.

**Release status: no 1:1 playability or cutover approved.**
