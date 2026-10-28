# DTS → MUGEN LOOP: module-by-module parity backlog

**Reference:** authorized legacy production source at `/www/wwwroot/dts-game-test` and accepted stabilization baseline `bafb7f5` (2026-10-27).  
**Target:** `cqseo/dtrgame` on Cloudflare Workers / Durable Objects.  
**Definition of complete:** implementation plus deterministic legacy comparison fixtures, tested WebSocket reconnect and UI coverage. A merely similar-looking feature does **not** count.

## Observed legacy configuration (not guesses)

- 35 numbered places (0–34) and grid coordinates: `include/modules/core/map/config/map.config.php`.
- Initial permanently forbidden region 0; four new forbidden places every 30 minutes in the default mode; a 60-second announcement window. Some modes override the schedule.
- Movement to **any available different area** at a baseline cost of 15 SP (not a six-node adjacency graph): `include/modules/base/explore/main.php`.
- Searching costs 15 SP at baseline. Discovery checks events, traps, encounters (players/teammates/NPCs/corpses), then items.
- Each region has distinct item find, encounter and initiative modifiers: `include/modules/base/mapattr/config/mapattr.config.php`.
- Six-slot inventory and additional equipment categories and combat systems are spread across modules; inspect the actual chains before substituting simplified rules.

## Current port status, as of PR #17

| Subsystem | Baseline currently in branch | Still missing before parity acceptance |
| --- | --- | --- |
| Map | All 35 IDs, names, coordinates, region search/encounter/initiative parameters, 15-SP free travel, persisted 6-area prototype alias migration | Original area descriptions, location-specific scripted encounters/shops, map-specific combat, mode overrides |
| Forbidden zones | Initial permanent forbidden area, four-area warning/closure per wave | **30-minute real-time scheduling**, 60-second notices, offline catch-up, server-authoritative deadline, gameover parity, per-mode settings |
| Inventory | Six-slot capacity checked for pickup, shop buying, unloading and corpse looting | Legacy special containers, exchange/combination constraints, multi-slot use semantics |
| Equipment | Simplified weapon and armor | Six weapon proficiency families, four armor parts, ornaments/accessories, ammunition, durability/weapon attributes |
| Combat | Basic seeded NPC/PVP, stance, damage and corpse drops | Legacy calculation order, hit/crit/evasion, proficiency, injuries, weather, skill modifiers, defensive equipment, damage logs |
| Exploration | Search/pickup/enemy/money loop; regional baseline discovery weights | Event/trap/encounter/item precedence, regional item tables, player detection and corpse discovery |
| Items | Eight demo catalog items | Full types, item combinations and recipes, special effects, traps, detector/radar/battery, ammunition, shop inventories |
| Player states | HP/SP, poison, recovery, leveling | All wound/abnormal effects, death mechanics, self-revival or special item rules, posture effects |
| Teams | None | Team forming/invitations, team combat/visibility, win conditions |
| Skills/cards | None | Symbol/signature, skills, card collection/lottery, card effects and achievements |
| Modes | Tutorial, one simplified standard match, infinite prototype | Legacy standard / random card / SOLO / trial / team / logging challenge / dissociation / glory / rush / roguelike / station and their room templates |
| Rooms/replays | Durable Object identity, command sequence and bounded history | Matching legacy room lifecycle, spectating, long-run replay exports, full results/history |
| UI | Original MUGEN visual theme, partial combat/game dashboard | Legacy-style dual-column narrative information hierarchy, action grouping, comparable desktop/mobile flows |
| Identity | Supabase auth and test guest sessions | Account/user history migration, consistent progression, security/data migration verification |

## Acceptance order

1. **P0 — Foundation and live safety:** resolve CI, test in isolated preview, confirm guest account persistence and old serialized world migration, verify no unwanted main-branch production deploy.
2. **P1 — Real-time world:** Durable Object alarms, four forbidden zones every 30 minutes, warning messages, zone-death behavior and reconnect catch-up.
3. **P1 — Resource/equipment:** six-slot inventory fully validated, four-part armor/accessories, weapon families and ammunition; exact item taxonomy and numerical fixtures.
4. **P1 — Combat and discovery:** seeded old-vs-new test sessions for movement, exploration, traps, weather, injuries, attacks, fleeing and corpse looting.
5. **P2 — Mode-specific modules:** port all legacy active game modes using their own settings, start/gameover and eligibility requirements.
6. **P2 — UI and full session QA:** screenshot comparison, room formation, mid-game disconnect/reconnect, 390px mobile and results/restart.
7. **P3 — Commercial/legal:** separate item assets and third-party IP, legal provenance audit, purchase and affiliate integration as independent products.

## Non-negotiable test gates

- Verify full map ID uniqueness (35/35), coordinates and numeric parameters against source.
- Original 15-SP movement and search, free map selection, rejection of closed areas, no turn consumed on invalid actions.
- Six full backpack slots, pickup/unload/equip/sell/loot exchanges, persistent state after reconnect.
- Four zones per wave with 60-second warning and 30-minute real-time window; more-than-one-region kill and all-zone endcases.
- Combat and discovery fixtures compare legacy vs TypeScript with recorded seeds and logged output; clearly mark intentional renames or licensed artwork substitutions.
- Production rollback and migration notes required before a release; do not overwrite legacy site or reset live players.

**Important:** PR #17 is a first verifiable geography/inventory slice, not a full migration. The existing eight-item sample catalog and four tactic buttons cannot be described as parity with the legacy game.
