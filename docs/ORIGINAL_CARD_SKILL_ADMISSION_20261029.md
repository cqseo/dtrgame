# Card and skill admission checkpoint — not playable

Continues the existing native runtime. No production resources changed, and no new deployment in this checkpoint. The last independently deployed runtime remains the original waiting-room runtime; final readiness still rejects and rolls back incomplete game initialization.

## Source implementations

- All enabled card selection and card-effect overrides, original ordered PHP arrays, exact seeded random card selection, random skills, composite attributes, trial penalties, and special card overrides. PHP arrays use insertion order and retained deleted buckets where random selection depends on layout.
- Native skillbase acquire/lost/query and parameter bookkeeping retain current-player versus other-player behavior and no-cover flags. They still dispatch enabled callbacks and effects, rather than silently skipping them.
- 1,097 source acquire/lost callback bodies and all 14 post-entry event overrides are translated ahead of time into static TypeScript. Source metadata and coverage are recorded; unsupported syntax is a compile error/explicit pending record, never a successful no-op. Generated calls require module globals, random state and actual effect implementations at runtime.
- Shared callback runtime handles explicit references to module globals, ordered array mutations, source date/math helpers and asynchronous calls. Database method calls require a supplied adapter; the current runtime does not yet supply all game SQL effects.

## Evidence and limits

- 407 source card definitions exercised at two random seeds, plus trial boundaries: 823 card-effect comparisons and 66 mode-selection cases. Final next-RNG values are compared, not only inventory results.
- 2,140 direct callback comparisons execute original source bodies with original skillbase parameter functions and synthetic player/module contexts. These do not cover all helper-dependent callbacks or all possible contexts.
- 24 actual skillbase bookkeeping comparisons validate current/other player state, existing/missing skills, no-cover and callback order.
- 14 actual __MAGIC__ post-admission chain comparisons span seven modes with optional effects enabled/disabled. Effect endpoints are explicitly synthetic capture ports on both sides; this proves ordering/state orchestration, not DB/NPC/achievement/task implementations.
- All installed skill-enable and skill-acquire overrides now preserve disable flags, achievement/hidden/feature exceptions, skill513's one-time log and evolved-NPC restriction, and skill461/803 debuff immunity. 520 additional PHP comparisons exercise flag combinations and effect priorities through the actual source dispatcher. The skill-query result is normalized to PHP's boolean semantics rather than returning JavaScript numeric zero.
- Existing regression suite is retained. Test evidence does not establish complete gameplay, session concurrency in a running match, or full effect parity.

## Still needed for the real objective

Connect actual module configuration and globals; implement dependent skill helpers and skill-enabled overrides; initialize world/NPC/map/trap/shop data with source RNG and hook order; persist admitted players and skill side effects transactionally; implement full command/game rendering, all modes, battle and settlement; run real two-player full-game and browser acceptance. No module has been declared fully accepted merely because its callback now compiles.

The next integration must not replace source hooks with generic fallbacks. Generated callbacks deliberately throw when an effect dependency has not been registered.
