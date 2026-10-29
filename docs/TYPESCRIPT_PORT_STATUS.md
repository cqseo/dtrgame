# ACFUN DTS TypeScript port status

This ledger is generated against the captured Baota baseline. It prevents a partially playable rewrite from being reported as a 1:1 port.

- Modules listed by the legacy loader: **744**
- Enabled modules: **735**
- Fully parity-accepted modules: **0**
- Partially ported modules: **34**
- Pending modules: **710**
- Player database fields captured: **124**
- Automated TypeScript parity tests in this milestone: **130** (plus **7** environment-gated assertions)

Partially ported modules: `player`, `map`, `lvlctl`, `itemmain`, `pose`, `tactic`, `edible`, `explore`, `weather`, `rest`, `wound`, `cooldown`, `metman`, `weapon`, `wep_n`, `wep_p`, `wep_k`, `wep_g`, `wep_c`, `wep_d`, `wep_f`, `wep_b`, `wep_j`, `armor`, `attack`, `battle`, `team`, `enemy`, `corpse`, `itemmix`, `itemmix_sync`, `itemmix_overlay`, `attrbase`, `ex_residue`.

Compatibility-kernel milestone: the original loader order, mandatory dependency graph, newest-first hook dispatch, `$chprocess` parent calls (including repeated calls and changed arguments), PHP reference parameters, request globals, deterministic RNG checkpoints, state rollback and execution tracing are implemented. The captured graph contains **3,211 hook names / 5,235 implementations / 505 overloaded chains**. This infrastructure does not count any unported hook body as complete.

Runtime milestone: one active match is serialized by a Cloudflare Durable Object. Its base `command.php` transaction now covers movement, search, cooldowns, rest, pose/tactic changes, wounds, inventory use/move/merge, edible effects and item crafting. Versioned full-match snapshots are persisted through service-role-only Supabase RPCs; the private table has RLS enabled and no client grants. This is still staging and does not yet make the full game playable.

“Partial” means only the named, tested mechanics have been translated. A module can become “complete” only after every code/config/template hook has a parity fixture against `/www/wwwroot/dts-game-test`.

Run `npm run generate:migration` beside the captured legacy source to regenerate the full 744-row JSON ledger at `docs/legacy-module-migration.json`.
