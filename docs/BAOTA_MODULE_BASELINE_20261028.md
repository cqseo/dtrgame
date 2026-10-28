# Installed ACFUN DTS module baseline — Baota (read-only extraction)

Source: `/www/wwwroot/dts-game-test/gamedata/modules.list.php` on `VM-0-10-opencloudos`, accessed 2026-10-28.

This is the **actual site's installed module list**, not the public `sillycross/dts` tree. Module initialization order is preserved exactly. Do not assume inactive modules should be migrated as active systems, and do not conflate the count of installed modules with the count of independent features.

- Total installed entries: **744**
- Enabled entries: **735**
- Disabled entries: **9**
- Separate full manifest: [LEGACY_INSTALLED_MODULES_20261028.csv](./LEGACY_INSTALLED_MODULES_20261028.csv)

## Breakdown by module family

| Actual source prefix | Enabled | Disabled |
|---|---:|---:|
| `extra/card` | 236 | 0 |
| `extra/club` | 221 | 1 |
| `extra/achievement` | 74 | 0 |
| `extra/instance` | 42 | 5 |
| `extra/attr` | 38 | 0 |
| `extra/misc` | 19 | 2 |
| `base/items` | 16 | 0 |
| `extra/item_extra` | 13 | 0 |
| `extra/activities` | 12 | 1 |
| `base/weapon` | 11 | 0 |
| `core/gameflow` | 4 | 0 |
| `base/skills` | 4 | 0 |
| `extra/gmskills` | 4 | 0 |
| `base/itemmix` | 3 | 0 |
| `extra/npc_action` | 2 | 0 |
| `core/input` | 1 | 0 |
| `core/sys` | 1 | 0 |
| `core/map` | 1 | 0 |
| `core/player` | 1 | 0 |
| `base/logger` | 1 | 0 |
| `base/skillbase` | 1 | 0 |
| `base/map_display` | 1 | 0 |
| `base/explore` | 1 | 0 |
| `base/noise` | 1 | 0 |
| `base/lvlctl` | 1 | 0 |
| `base/npc` | 1 | 0 |
| `base/itemmain` | 1 | 0 |
| `base/metman` | 1 | 0 |
| `base/itemshop` | 1 | 0 |
| `base/apm` | 1 | 0 |
| `base/corpse` | 1 | 0 |
| `base/enemy` | 1 | 0 |
| `base/team` | 1 | 0 |
| `base/battle` | 1 | 0 |
| `base/attack` | 1 | 0 |
| `base/npcchat` | 1 | 0 |
| `base/mapattr` | 1 | 0 |
| `base/wound` | 1 | 0 |
| `extra/skill_temp` | 1 | 0 |
| `base/armor` | 1 | 0 |
| `base/rest` | 1 | 0 |
| `base/event` | 1 | 0 |
| `base/armor_art` | 1 | 0 |
| `base/pose` | 1 | 0 |
| `base/tactic` | 1 | 0 |
| `base/weather` | 1 | 0 |
| `base/addnpc` | 1 | 0 |
| `base/opening` | 1 | 0 |
| `base/ending` | 1 | 0 |
| `base/cooldown` | 1 | 0 |
| `extra/searchmemory` | 1 | 0 |

## Disabled modules (do not assume active behavior)

- `bubblebox`: `extra/misc/bubblebox/`
- `skill86`: `extra/club/skills/skill86/`
- `gtype2`: `extra/instance/gtype2/main/`
- `gtype3`: `extra/instance/gtype3/main/`
- `gtype5`: `extra/instance/gtype5/main/`
- `skill1005`: `extra/instance/gtype5/skill1005/`
- `skill1004`: `extra/instance/gtype5/skill1004/`
- `glowbutton`: `extra/misc/glowbutton/`
- `halloween2017`: `extra/activities/halloween2017/main/`

## Migration principle

Build a deterministic old-versus-new fixture for each actual enabled subsystem and its dependent skill/role/cards, then expose it in the new UI. Do not claim full legacy parity from the currently passing 24 local tests or 36 preview Worker assertions. The current direct Cloudflare production deployment is an incremental prototype and must not be overwritten from the unpublished TypeScript branch without verifying bundle equivalence and storage compatibility.
