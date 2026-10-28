# PvE trial preview — ruleset `pve-preview-1`

This is a playable vertical slice following the authenticated tutorial, **not yet full parity with the legacy server**. Do not reuse its damage formulas, map layout or points as verified legacy rules without fixture comparison.

## Player flow

1. Log in, choose **无限试炼 → 进入试炼**. The Worker verifies Supabase Auth; the Durable Object derives the player UUID from the access token.
2. Enter the starting tile (0,1), search once (-15 SP) to find **线圈刃**. The player begins with one **急救包**.
3. Equip the blade; it changes damage from 12 to 24 (preview only).
4. Move cardinally to an adjacent tile (-15 SP), uncovering fog. Tile (2,2) is a blocked test zone.
5. Enter central tile (1,1) to engage the 48-HP guardian. Attacking costs 10 SP; a surviving enemy counters for 8 HP.
6. Defeat the guardian to finish the run. Score = 100 + surviving HP + floor(remaining SP / 2). Better personal scores replace previous personal best.
7. The shared room shows the top ten **best** scores, and the user may restart after victory/defeat.

Search, medkit, rest and attacks are server-authoritative. A search can only occur once per tile; medkits are consumed; rest can only occur once per run. Inputs for positions, inventory, damage, outcome and score are **not** accepted from the client.

## Trust and persistence

- Per-player state is written to `GameRoom` Durable Object storage under `arenaPlayers[playerId]`.
- Room-local best scores are written under `arenaBest[playerId]`. This is **not a global Supabase leaderboard** or an account currency reward.
- Personal tutorial and arena states are unicasted to the matching authenticated WebSocket. Anonymous snapshots do not include user UUIDs.
- Client command IDs are de-duplicated within the existing bounded 256-command room window. The implementation must be tested with reconnect and duplicate-command scenarios before public release.
- Test gameplay is free; Stripe purchase, referral payouts and currency mutations are intentionally not enabled.

## QA / release gate

Run `npm ci && npm run verify` on Node 24; then test in a real browser on desktop and 390/320px mobile widths, including reload and reconnect. Use two distinct accounts to ensure one user never receives the other's private inventory and ranking stores *best*, not summed score. Compare against the legacy combat/zone/inventory fixtures before marking parity accepted.

### Still pending

- Import the two-commit legacy test-server overlay, deterministic rule/seed fixtures, and copyrighted asset audit.
- Replace preview damage/loot/zone and victory condition with approved legacy-equivalent combat and map rules.
- Add full-room multiplayer, matches and per-match scores to Supabase with trusted service credentials; do not elevate the current room-only board.
- Configure custom SMTP, recovery and production signup policy.
- Stripe test-mode checkout/webhooks/idempotency/refunds and affiliate ledger/payout checks only after external account configuration; keep production purchase paths disabled.
- Load test, reconnect storms, browser production QA, staged migration and rollback drill.
