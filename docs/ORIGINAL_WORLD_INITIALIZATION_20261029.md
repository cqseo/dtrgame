# World initialization integration — not playable

The native 16-layer rs_game chain now preserves parent order, initial map shuffle,
weather, tutorial and mode-specific timing, observer map replacement, rogue
forbidden-area count and random recipe invocation. NPC, map-item, trap and shop
population loops have explicit mandatory effect/storage ports. The chain does
not supply placeholder NPCs or bypass missing effect implementations.

World config selectors use all original NPC definitions and 23 exact raw map,
trap and shop files captured from the read-only source. Ascension NPC changes,
event NPC overrides and all enabled mode selectors are compared to PHP. Item-row
processing preserves composite markers, poison ownership, rush power/price
changes, event shop quantities, rogue-stage visibility and merged shop categories.
Missing attributes remain null as in PHP; they are not silently changed to empty
strings before DB serialization.

## Validation

- 140 unmodified source world-chain cases exercise ten modes, seven reset masks
  and two seeds. Population effects use synthetic configs/captured storage on
  both sides; next random values and effect ordering are checked. This is not
  evidence that every real downstream NPC or item hook is implemented.
- 48 source world-selector cases compare actual NPC lists and exact file rows.
- 144 complete map/shop source groups compare every row under normal, rush,
  rogue and event conditions. The source harness needed a higher CLI memory/time
  allowance to finish the full corpus; it completed without omitting a group.
- Real PostgreSQL test uses the restricted QA role, verified TLS and empty QA
  room 12. It inserts NPCs, 415 map items, traps and shop items, checks visibility
  from a separate session, forces rollback and verifies all data/counters revert.
  A real out-of-range PostgreSQL failure also rolls back the preceding NPC write.
  Two actual PG sessions serialize on the room allocation lock. Every test write
  rolls back; no production data is accessed by the runtime role.

## Storage changes

Only private acfun_runtime_qa_20261029 is modified. Original room-shaped tables
are provisioned through room 12 and receive restricted runtime access with RLS.
Transactional counters replace nontransactional sequence consumption for native
world writes, preserving reset-to-1 and failure rollback. The storage capability
is invalidated at transaction end. Original snapshot schema access and anonymous
QA-table access remain denied. No Worker or production domain is deployed here.

The PHP array implementation now trims deleted trailing buckets, matching
Zend array_rand's effective bucket range. The difference was discovered by NPC
spawn/RNG comparisons; card-selection regression tests also pass after the fix.

## Remaining work

Actual NPC initialization and skills, NPC item interception, slip puzzles,
random recipes, full reset/prepare/admission integration, game requests and
rendering, battle effects and settlement remain incomplete. The deployed QA
waiting-room Worker still refuses final start. This checkpoint must not be
treated as a playable match or an all-mode acceptance result.
