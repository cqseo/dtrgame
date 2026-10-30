# ACFUN DTS TypeScript port status

This ledger is generated against the captured Baota baseline. It prevents a partially playable rewrite from being reported as a 1:1 port.

- Modules listed by the legacy loader: **744**
- Enabled modules: **735**
- Fully parity-accepted modules: **0**
- Partially ported modules: **37**
- Pending modules: **707**
- Player database fields captured: **124**
- Automated TypeScript parity tests in this milestone: **151** (plus **7** environment-gated assertions)

Partially ported modules: `player`, `map`, `lvlctl`, `itemmain`, `pose`, `tactic`, `edible`, `explore`, `weather`, `rest`, `wound`, `cooldown`, `metman`, `weapon`, `wep_n`, `wep_p`, `wep_k`, `wep_g`, `wep_c`, `wep_d`, `wep_f`, `wep_b`, `wep_j`, `armor`, `armor_art`, `item_uc`, `ammunition`, `attack`, `battle`, `team`, `enemy`, `corpse`, `itemmix`, `itemmix_sync`, `itemmix_overlay`, `attrbase`, `ex_residue`.

Compatibility-kernel milestone: the original loader order, mandatory dependency graph, newest-first hook dispatch, `$chprocess` parent calls (including repeated calls and changed arguments), PHP reference parameters, request globals, deterministic RNG checkpoints, state rollback and execution tracing are implemented. The captured graph contains **3,211 hook names / 5,235 implementations / 505 overloaded chains**. This infrastructure does not count any unported hook body as complete.

Runtime milestone: one active match is serialized by a Cloudflare Durable Object. Its base `command.php` transaction now covers movement, search, cooldowns, rest, pose/tactic changes, wounds, team create/join/quit, weather/pose-modified map-item discovery and removal, pending-item pickup/merge/full-pack behavior, inventory use/move/merge, edible effects, weapon/armor/accessory equip-swap-unequip, condition medicine, ammunition loading, item drops back into the persistent map pool, and item crafting. Search/move now traverses the original player/corpse encounter order, including encounter, visibility, initiative and corpse-protection rolls. Corpse money/destruction/item transfer validates the stored corpse action and commits looter plus corpse atomically. A serialized two-player assault transaction covers base hit/damage, weapon use and breakage, mastery/experience, death state, kill counters, range and counterattacks, then commits both players in one match version; failed initiative immediately runs the defender's attack in that same transaction. Versioned full-match snapshots are persisted through service-role-only Supabase RPCs; initialization writes version zero, later versions are monotonic, and an empty Durable Object can restore the latest validated snapshot. The private table has RLS enabled and no client grants. This is still staging and does not yet make the full game playable.

“Partial” means only the named, tested mechanics have been translated. A module can become “complete” only after every code/config/template hook has a parity fixture against `/www/wwwroot/dts-game-test`.

Run `npm run generate:migration` beside the captured legacy source to regenerate the full 744-row JSON ledger at `docs/legacy-module-migration.json`.
