# ACFUN DTS TypeScript port status

This ledger is generated against the captured Baota baseline. It prevents a partially playable rewrite from being reported as a 1:1 port.

- Modules listed by the legacy loader: **744**
- Enabled modules: **735**
- Fully parity-accepted modules: **0**
- Partially ported modules: **30**
- Pending modules: **714**
- Player/game-state fields captured in the prior migration inventory: **124** (NOT the accounts table).
- Live installed MySQL account users table (metadata-only inspection, 2026-10-29): **39 columns**, see docs/LEGACY_USERS_METADATA_20261029.json.
- Account usernames use MySQL utf8_general_ci. Actual original BMP weights are ported and checked against all 53 original usernames in private Supabase staging, but production login/session and concurrent-registration E2E parity remain pending.
- Automated TypeScript parity tests in the latest isolated workbench: **359/359**, including 265 PHP-reference tactic/cooldown golden vectors

Partially ported modules: `player`, `map`, `lvlctl`, `cooldown`, `itemmain`, `pose`, `tactic`, `edible`, `explore`, `weather`, `rest`, `wound`, `metman`, `weapon`, `wep_n`, `wep_p`, `wep_k`, `wep_g`, `wep_c`, `wep_d`, `wep_f`, `wep_b`, `wep_j`, `armor`, `attack`, `battle`, `team`, `enemy`, `corpse`, `itemmix`.

“Partial” means only the named, tested mechanics have been translated. A module can become “complete” only after every code/config/template hook has a parity fixture against `/www/wwwroot/dts-game-test`.

Run `npm run generate:migration` beside the captured legacy source to regenerate the full 744-row JSON ledger at `docs/legacy-module-migration.json`.

2026-10-29 tactic/cooldown source-based milestone: see [gameplay parity report](ORIGINAL_GAMEPLAY_TACTIC_COOLDOWN_20261029.md). Cloudflare QA Worker /__gameplay_selftest passed 12 synthetic runtime checks; the real original PHP gameplay endpoint remains unchanged. No modules are fully accepted yet.
