# Runtime account checkpoint — 2026-10-29

This is partial implementation of phase 1. The original game is **not playable**.

## Recovery and baseline

- Continued branch `acfun-original-parity-20261029` from `7d2a252c1ae2dd68f41da17be902410dbca0b296`.
- Read and preserved `/opt/dts-port-workbench-20261029`; its source differs from the branch only in trailing whitespace. JSON fixture differences are formatting or lossless compression. No substantial uncommitted implementation was overwritten.
- Reran the server workbench: 23 files, 4,282 tests passed; type check passed.
- Verified original UI archive: 1,565 files, zero hash/length mismatches.
- Full repository had two additional baseline failures: invalid zero-argument mock types in the D1 tests and a Node-test asset suite discovered by Vitest. Fixed without removing assertions.

## Implemented

- New isolated Worker `dtrgame-original-runtime-qa-20261029`, leaving every prior Worker and production domain unchanged.
- Supabase schema `acfun_runtime_qa_20261029` copies the 66 original tables and two collation support tables. Existing `acfun_legacy` staging rows are unchanged. A dedicated login role has no access to that original schema, and only SELECT plus IP/lastvisit UPDATE privileges on QA account data.
- Hyperdrive has query caching disabled. Each account request creates and closes its own PostgreSQL client; it never uses D1, Supabase Auth, or a PHP proxy.
- Native TypeScript `/login.php`: source request filtering, name/password/IP validation order, salted/legacy MD5 compatibility, MySQL username weights, source HTML errors, IP/lastvisit persistence, 302 redirect, 15-day `acbra2_user`/`acbra2_pass`, HttpOnly password cookie, session `acbra2_roomid=0`.
- Native logout on `/login.php` and POST `/game.php` clears account cookies before database work, retaining the source room-cookie behavior.
- Four account presentation templates are translated ahead of time from the original compiler output into static TypeScript. HTML text, whitespace, language, includes, branches and layout are preserved. Unsupported AST expressions fail compilation. PHP is only a build/test oracle on the isolated server and is not invoked by the deployed Worker.
- Static asset requests use the existing original staging asset Worker service binding.

## Verification

- `npm run check`: pass.
- Full repository: **41 test files, 4,374 tests passed**.
- Eight unmodified-PHP account template cases: TypeScript output byte-identical.
- Wrangler isolated deployment dry run passed; Cloudflare API upload HTTP 200.
- Live HTTP: two dedicated QA accounts logged in concurrently; correct passwords redirected, wrong passwords returned original errors, three cookies matched the contract, POST game logout cleared account cookies. Supabase confirmed login time and IP writes for both test accounts.
- Live guest login HTML SHA256 `f06711a81127a1ed1714260e39e0315d04d0dc25cbad5cfef8e5123e6a0ba4df`, equal to the PHP fixture.
- Original mobile CSS, common JavaScript and error image returned 200. Full UI asset deployment is still pending.
- Original staging account aggregate fingerprint unchanged after the live tests; QA role cannot read/write `acfun_legacy`; anonymous account reads denied.
- Browser visual/interactive inspection was attempted, but the app reports local browser use disabled. HTTP tests are not a substitute for that inspection or complete gameplay acceptance.

## Independent test URL

https://dtrgame-original-runtime-qa-20261029.dearpassengerscrew-new.workers.dev/login.php

This endpoint is a partial QA account checkpoint. Login redirects to `index.php`, whose dynamic room lobby is not implemented yet (501). `/game.php` is also 501 except the original quit branch. The pre-existing verification Worker still returns 404 for `/game.php` and is unchanged.

## Still required

1. Integrate authenticated session checks into game, room and command handlers; implement the dynamic lobby and original room create/join/ready/start chain.
2. Extend template translation to all actual dynamic templates and verify more contexts, including optimized datalib, template 2, game/profile/chat/news and module UI. Current converter covers only four account templates and explicitly rejects unported AST nodes.
3. Port all enabled module inheritance, action ordering, RNG, effects, room ticks, NPCs, items, skills, modes, death/revival and settlement. Existing battle ports remain incomplete effect adapters.
4. Wire game commands to real single-session room transactions and verify simultaneous actions from two players in the same room.
5. Complete browser playthrough, visual/numeric PHP comparisons, all-mode acceptance, and migration/cutover checks.

No historic user password was changed. Two randomly credentialed QA accounts exist only in the mutable QA copy. Test credentials and the runtime database credential are private files outside the repository; none is included in source, fixtures or reports.
