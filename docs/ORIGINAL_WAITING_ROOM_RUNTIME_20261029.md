# Native waiting-room runtime — 2026-10-29

This checkpoint does not make the game playable. Final ready/start still returns 501 and rolls back because game initialization and module effects are incomplete.

Implemented native TypeScript index/lobby, create and enter for waiting rooms, seat management, chat, room options, mode changes, takeover, leave, first-ready state and roomupdate long polling. Room open flags and owner heartbeats are private PostgreSQL records replacing the original filesystem markers. A transaction-scoped advisory lock serializes allocation, lobby sweeps and room mutations; no transaction is held while waiting for long polling. Existing copied historical rooms have no active QA flags and are not misrepresented as running QA matches.

Thirteen original templates (including the installed type-14 roomteam addition) are translated ahead of time to TypeScript. The compiler rejects unsupported syntax. There is no PHP runtime or origin proxy in the Worker. Original source files are read only; oracle caches and test ports are confined to the existing workbench. Site announcement text, when present, is stored only in the private QA schema, not GitHub. The installed system message file was absent and the admin message was empty.

Verification:

- 780 original PHP command-page cases, with database/file/broadcast effects captured at explicit test boundaries.
- 91 original PHP HTML byte comparisons for waiting room, seat variants, popups and guest/authenticated lobby contexts. The oracle imports the original time global; numeric-option warnings remain source behavior.
- Full repository: 44 files, 5,866 tests passed; type check and isolated Worker dry-run passed.
- Live Worker test using two dedicated QA accounts: login, real Supabase room create/join, seat mutation, polling wakeup, concurrent chat persistence, first readiness, final readiness rejection with unchanged stored timestamp/chat/ready HTML. Countdown comparison permits only measured wall-clock passage. Test players then leave and the timed test room closes.
- QA role remains unable to access acfun_legacy; anonymous roles cannot read runtime room flags.

Only `dtrgame-original-runtime-qa-20261029` was redeployed. Production Workers, domains, PHP, and source MySQL are unchanged. The independent runtime URL remains:

https://dtrgame-original-runtime-qa-20261029.dearpassengerscrew-new.workers.dev/

Still required: real start/prepare/reset, NPC and map generation, player admission and inherited skill effects, complete action chain and all modes, death/revival/settlement, two-player gameplay and browser visual/interaction acceptance. The waiting-room test is not a gameplay acceptance test. Browser control was unavailable at the earlier checkpoint and has not been counted as completed.
