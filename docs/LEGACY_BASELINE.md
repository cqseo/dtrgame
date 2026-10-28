# Legacy baseline and parity map

## Source baselines

| Baseline | Commit | Purpose |
| --- | --- | --- |
| Upstream repository | `winddramon/dts@9e39545` | Stable source inventory and rule reference |
| Current test server | `bafb7f5` | Acceptance baseline containing the 2026 stability/mobile/UX fixes |

The current server is two local commits ahead of upstream. Its overlay changes 44 files with 991 additions and 224 deletions. That overlay must be captured before rule or screenshot parity is signed off.

## What the legacy game is

The upstream project describes itself as a PHP, text-first, real-time multiplayer battle-royale web game with roguelike features. The player loop is resource growth, threat avoidance and tactical combat. It also includes achievements, card collection, synthesis chains, skill trees and multiple PvP/PvE modes.

## Repository inventory

| Type | Approximate count | Migration implication |
| --- | ---: | --- |
| PHP | 1,755 | Rules are distributed across a compiled module engine; do not port by endpoint alone |
| HTML templates | 849 | Build a screen/state inventory before replacing templates |
| PNG | 389 | Check provenance and commercial rights before copying |
| GIF | 255 | Preserve animation timing only when the asset is licensed |
| JavaScript | 12 | Client behaviour is concentrated and can be mapped to typed modules |
| CSS | 11 | Use as visual measurement input, not as unquestioned production code |

Large rule/config surfaces include cards, item synthesis, NPC data, map items, achievements, combat, player state and instance-specific modules.

## Transport and endpoint replacement

| Legacy surface | Observed behaviour | New boundary |
| --- | --- | --- |
| `index.php` | login, lobby and room entry | static app shell + Supabase Auth + Worker routes |
| `game.php` | game screen composition | browser renderer driven by typed state snapshots |
| `command.php` | central action dispatcher | authenticated Worker command API routed to the room Durable Object |
| `roomupdate.php` | recursive long polling | room Durable Object WebSocket |
| `chat.php` | client polling, default 3,000 ms | WebSocket room/chat events with server sequence IDs |
| `roomcmd.php` | room lifecycle commands | Worker room API + Durable Object authoritative state |
| daemon/socket runtime | persistent game processing | Durable Objects, alarms, Queues and scheduled Workers |
| replay files/history | rapidly growing local storage | compact event log/checkpoints in R2, searchable metadata in Supabase |

The legacy JavaScript explicitly labels `roomupdate.php` as long polling. Chat separately schedules `chat.php` every 3 seconds by default, so it is the first polling load to remove.

## Mode inventory

The ruleset lists these visible modes: standard, custom card, random card, SOLO, trial, team, logging challenge, dissociation, tutorial, glory, rush, roguelike and station/camping. Disabled or historical modes also remain in configuration.

The first parity milestone will cover:

1. tutorial mode, because it is the safest deterministic onboarding fixture;
2. standard mode, because it is the reference ruleset;
3. trial/roguelike mode, because it aligns with the planned infinite-loop commercial wrapper;
4. the remaining modes after shared combat, inventory, map and game-flow modules stabilize.

## Server overlay that must not be lost

The current test-server commits modify mobile styling, login/recovery, command submission, room lifecycle, tutorial handling, attack/explore/radar behaviour, weather/wound/map templates, death/end screens and validation. These are part of the acceptance baseline even though they are not present in upstream `master`.

## Porting boundaries

The TypeScript engine should separate:

- deterministic rules: combat, items, status, skills, map transitions and win conditions;
- authoritative room state: players, sequence number, timers and reconnect window;
- presentation: DOM rendering, input bindings, sound and animation;
- persistence: profiles, inventories, match summaries, replays and commerce;
- commercial systems: products, orders, entitlements, affiliate attribution and payouts.

Randomness must use an explicit stored seed. Every accepted command receives a monotonically increasing sequence number. This makes legacy/new outcome comparisons and replay debugging possible.

## Parity evidence

Each migrated screen or rule needs all applicable evidence:

- legacy desktop and mobile screenshots;
- input fixture and seeded initial state;
- legacy output/state checksum;
- new-engine output/state checksum;
- reconnect and duplicate-command test;
- reviewed visual diff;
- rollback note.

## Commercial asset gate

No root license file was found in the upstream checkout. The repository contains many ACG images and a CC BY-SA icon, but the presence of an icon is not proof that every asset has the same license. Before commercial release, every image, font, sound, character name and quoted text must be classified as owned, licensed, replaceable or prohibited. Until that audit is complete, the new repository should preserve measurements and references without bulk-publishing questionable legacy assets.
