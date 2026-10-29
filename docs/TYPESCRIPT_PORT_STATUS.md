# ACFUN DTS TypeScript port status

This ledger is generated against the captured Baota baseline. It prevents a partially playable rewrite from being reported as a 1:1 port.

- Modules listed by the legacy loader: **744**
- Enabled modules: **735**
- Fully parity-accepted modules: **0**
- Partially ported modules: **29**
- Pending modules: **715**
- Player/game-state fields captured in the prior migration inventory: **124** (NOT the accounts table).
- Live installed MySQL account users table (metadata-only inspection, 2026-10-29): **39 columns**, see docs/LEGACY_USERS_METADATA_20261029.json.
- Account username uniqueness uses MySQL utf8_general_ci, which cannot be assumed equivalent to D1/SQLite NOCASE. Full collation parity is pending.
- Automated TypeScript parity tests in this milestone: **62**

Partially ported modules: `player`, `map`, `lvlctl`, `itemmain`, `pose`, `tactic`, `edible`, `explore`, `weather`, `rest`, `wound`, `metman`, `weapon`, `wep_n`, `wep_p`, `wep_k`, `wep_g`, `wep_c`, `wep_d`, `wep_f`, `wep_b`, `wep_j`, `armor`, `attack`, `battle`, `team`, `enemy`, `corpse`, `itemmix`.

“Partial” means only the named, tested mechanics have been translated. A module can become “complete” only after every code/config/template hook has a parity fixture against `/www/wwwroot/dts-game-test`.

Run `npm run generate:migration` beside the captured legacy source to regenerate the full 744-row JSON ledger at `docs/legacy-module-migration.json`.
