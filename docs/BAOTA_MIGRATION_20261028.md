# Baota canonical-source migration status — 2026-10-28

## Connection verified
- Remote Desktop Commander device `VM-0-10-opencloudos` reconnected and usable.
- The actual old game at `/www/wwwroot/dts-game-test` was read-only during this phase.
- An existing backup was located at `/opt/dts-sandbox/backups/final-optimization-20261027-221550`.
- Live previous repair baseline in old source clone: `bafb7f5`.

## Actual installed module manifest
- `gamedata/modules.list.php`: **744 installed entries, 735 enabled, 9 disabled**.
- Main groups (enabled): `extra/card` 236; `extra/club` 221; `extra/achievement` 74; `extra/instance` 42; `extra/attr` 38.
- Disabled: `bubblebox`, `skill86`, `gtype2`, `gtype3`, `gtype5`, `skill1005`, `skill1004`, `glowbutton`, `halloween2017`.
- Full, ordered and flag-preserving source manifest: `docs/LEGACY_INSTALLED_MODULES_20261028.csv`.

## Previously missed Baota customization
The previous imported upstream tables were **not identical** to the user's actual installed version.

| Rule | Prior upstream-based copy | Actual Baota copy | Status |
| --- | ---: | ---: | --- |
| Weather set | 18 | **20** (adds 冷气, 暖气) | Corrected in `src/legacy-rules.ts` and B3 production Worker |
| Item-mix recipes | 373 | **465** | Complete *data records* imported into `src/legacy-recipes.ts`; effects, recipe gating and many materials remain unimplemented |
| 松茸御饭 uses | 10 | **20** | Corrected in game catalog and B3 |
| 咖喱面包 uses | 2 | **8** | Corrected in game catalog and B3 |
| Map item rows | Not catalogued | **1,305** | Imported as raw-preserving structured data |
| Shop config rows | Not catalogued | **226** including category records | Imported as raw-preserving structured data |
| Starting item rows | Not catalogued | **131** | Imported as raw-preserving structured data |
| Trap config rows | Not catalogued | **44** | Imported as raw-preserving structured data |

Source files:
- `include/modules/base/weather/config/weather.config.php`
- `include/modules/base/itemmix/itemmix/config/itemmix.config.php`
- `include/modules/base/itemmain/config/mapitem.config.php`
- `include/modules/base/itemmain/config/stitem.config.php`
- `include/modules/base/itemshop/config/shopitem.config.php`
- `include/modules/base/items/trap/config/trapitem.config.php`

## Verification — no GitHub Actions
- In isolated Baota `/tmp/dtrgame-parity-qa-20261028`, dependency install via npm succeeded.
- `npm run verify` passed with **28/28 Vitest tests**, TypeScript `tsc --noEmit`, and Wrangler deploy **dry-run** build. No GitHub Actions.
- Cloudflare isolated preview B3: **37/37** scoped runtime checks after weather and recipe charge fixes.
- New Cloudflare production Worker version: `d4c6b85f-b59f-49d5-ada5-12cdbafb2141`, 100% traffic; verified actual code includes 20 weather definitions and updated item charges. Production health/room/JS HTTP endpoints all returned 200.
- Production Worker archived exactly as `dist/worker-live-20261028-b3-baota.js`; original Supabase and Durable Object bindings retained; no test-only endpoint shipped.

## Work remaining for all original systems
This is **not 100% old-game parity**. A complete port requires original action semantics, shop restocking, map item spawn timings, 465 combination results (including conditional hidden recipes and attributes), 236 card modules, 221 club modules, 74 achievement modules, 42 active instance modules, combat/condition math, specialized skills and UI.

The active module manifest determines scope. It does not by itself prove 735 independent systems. Each module must have a source-path mapping, TypeScript implementation, gameplay fixture, integration test and expected user-facing behavior.

## Data safety
- Do not alter or deploy into the old Baota game directory.
- Do not replace the production Worker with an unverified branch compilation merely because the TypeScript checks pass; the current deployed B3 bundle was constructed and validated using the direct CF API connector, and the source-vs-bundle reconcile task remains.
- Keep old Durable Object data and existing account bindings; stage changes and check real WebSocket gameplay after each deployment.
