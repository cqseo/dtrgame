# Original room state checkpoint — 2026-10-29

The account runtime checkpoint `562adbf18dc05f2aa471b268e7633baeb2a87493` is now pushed to the authorized `acfun-original-parity-20261029` branch. GitHub CLI authenticated as the repository owner completed the push; the connector had continued to reject writes. No production branch changed.

## Source discrepancy found

The immutable snapshot's `include/roommng/roommng.config.php` does not load the installed site's additive `quickmatch.config.php`. A read-only comparison against the production file identified precisely that extra require; no production file was changed. The snapshot also lacks the additive file itself. The live site's additive configuration was read only to establish the actual original baseline.

- Snapshot room config SHA256: `21e8c7dcb271d1919e4b2081a80e1d98f1688713f02e65fa5a38382fa7942659`.
- Installed room config SHA256: `9323c653b0e0ab37b5966d7543415ab04a44bdd99b26370d55823e102f51431e`.
- Both room function files SHA256: `564a6a24753bc8adfeb2b7aa3b8b85e629999de229ef8862ce026f59929e1098`.
- Additive quickmatch config SHA256: `74f67093651adccd10560497fb821d493f44158b0b963c9888d83ede488a43fc`.

The generated TypeScript includes all 12 configured room types, including type 14 with its original 90-second ready timeout and original opening/card options. Configuration extraction does not establish that these modes are implemented.

## Implemented and verified

`original-room-state.ts` ports waiting-room initialization, variable precedence and variable team size, readiness eligibility by occupancy/team count, ready timeout state, automatic kicks, ten-message history and message/timestamp progression, participant counts, seat lookup, ownership transfer state changes and game-option validation.

`export-original-room-fixtures.php` invokes the original functions with synthetic room/player data. It does not load common.inc.php, query MySQL, write the PHP source/cache, or call production HTTP endpoints. The module-import shim returns an empty statement only for unused globals in these pure helper functions. The actual source function bodies are unmodified.

The fixture contains 620 PHP results across every configured type, full/partial/forbidden/one-team rooms, variable team sizes, readiness states and running/waiting flags, option values, chat rollover, kicks, and allowed/rejected ownership transfer. PHP's wall clock is bracketed before/after each readiness call; comparison allows only that measured interval for the deadline. The fixture is losslessly gzip/base64 encoded and contains synthetic names only.

The source emits a warning for a numeric game option lacking an `options` array; its resulting default is null. This behavior is retained rather than inventing a default.

- TypeScript check: pass.
- Full suite: **42 files / 4,995 tests passed**.
- New room suite: **620 PHP differential cases + 1 generated configuration equality check**.

## Not yet connected or accepted

These helpers are not yet wired to live room HTTP mutations. No new gameplay route or deployment is claimed in this checkpoint. The independent QA URL remains:

https://dtrgame-original-runtime-qa-20261029.dearpassengerscrew-new.workers.dev/login.php

Remaining: authenticated lobby, create/join/seat/ready HTTP transactions, owner heartbeat and room polling, original room templates, real game initialization and player admission, all enabled effects/modules, two players acting concurrently in one room, final settlement and visual acceptance. The original final ready action invokes system game initialization and enter_battlefield; merely setting groomstatus=40 would be incorrect and is not implemented as a substitute.

Next: connect room create/join/seat mutations to isolated PostgreSQL transactions, then render original roommain and room polling responses. Implement the complete initialization chain before enabling the final ready/start transition.
