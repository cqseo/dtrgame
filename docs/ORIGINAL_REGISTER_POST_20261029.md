# ACFUN DTS — original register.php migration milestone (2026-10-29)

## Immutable goal

Move only the installed original ACFUN 大逃杀's PHP backend to TypeScript/Cloudflare. Preserve original frontend files, URLs, request names, wire protocol, account values, game formulas, modes, and player records. This milestone is NOT a complete port or playable release.

## Actual installed original PHP inspected

- /www/wwwroot/dts-game-test/register.php: actual validation order, account insert map, initial values, post-success original cookies and AJAX DOM update keys.
- include/global.func.php: gstrfilter input sanitation; gencode gzip+Base64 JSON; original session cookies.
- include/user.func.php: name_check, pass_check, create_cookiepass, create_storedpass and question generation.
- include/modules/core/sys/config/resources.config.php: Chinese registration error/success strings.
- templates/default/register.htm, userbasicdata, usergdicon, userwords: original form and postCmd.
- include/javascript/game.20240318.js: original decompression and showData contract.

## Implemented in branch acfun-original-parity-20261029

- src/original-verification.ts and src/generated/legacy-vq-pool.ts: deterministic challenge algorithm and the original 497 phrases.
- src/original-register.ts: POST validation order, original input filter, error strings, initial gold=100, double-MD5 legacy storage hash, initial card_data, session cookies and AJAX DOM keys.
- src/original-register-db.ts: isolated D1 insert-only adapter using parameterized SQL; raw_record retains registration subset but is not the full historical user schema.
- src/parity-worker.ts: QA-only Cloudflare Worker; no public game routes, no player DB, no production bindings.
- Tests in test/original-register.test.ts and test/original-register-db.test.ts.

## Verified

1. Actual original PHP function fixtures: 23 entropy + 128 question/answer cases matched the TypeScript implementation.
2. Original PHP gstrfilter function: eight source-based test inputs match TypeScript.
3. Isolated workbench on Baota server: TypeScript compilation and 50/50 Vitest cases passed, including synthetic registration to legacy login form and cookie verification.
4. Isolated Cloudflare Worker endpoints:
   - https://dtrgame-original-verification-qa-20261029.dearpassengerscrew-new.workers.dev/__selftest
   - https://dtrgame-original-verification-qa-20261029.dearpassengerscrew-new.workers.dev/__register_selftest
   Both returned HTTP 200 and pass=true, including synthetic registration, original compressed response and duplicate rejection. The QA Worker has zero D1 bindings.
5. Independent Cloudflare D1 test-only database: dtr-original-register-qa-20261029. Parameterized insert produced changes=1, a duplicate insert produced changes=0; SELECT confirmed groupid=1, roomid=0, gold=100 and 15 JSON registration fields. No real player data imported. This direct D1 check is not yet an end-to-end HTTP registration with a D1 binding.

## Still blocking a compliant release

1. Exact original GET /register.php, template engine, header/footer, dynamic templates and 1,565-presentation-file asset parity in a real Worker.
2. Complete original banlist and IP filtering, trusted IP determination and authenticated-cookie validation in routed HTTP handlers.
3. Full 124-field legacy user schema, non-destructive old-account import, sessions, player continuity and rollback.
4. Original logged-in error.php template and all register.php GUI states.
5. Original room lifecycle, command.php, roomcmd.php, roomupdate.php, game daemon, all skills, items, combat, modes, and persistence.
6. Parity fixtures and acceptance for all 735 actual enabled modules. The separate registration entrypoint does not change the currently reported 0 fully accepted modules.
7. Full multiplayer end-to-end acceptance and cutover/revert plan.

**No official release or data migration has been performed.** PHP production dts.zhangyingyin.top and the existing dtrgame Worker remain unchanged. This branch and isolated QA resources are development-only.
