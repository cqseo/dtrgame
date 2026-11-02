# Atomic settlement cutover gate — NOT ACTIVE

This is a release-blocking contract for the original PHP to TypeScript port.
**No account reward writes or gameover RPC are enabled by this branch.**
The new `GET /settlement-plan` is a private, read-only Durable Object route.

## Confirmed from original PHP

Source: frozen `include/modules/core/sys/gamectl.php`,
`gameover()`, `gameover_set_credits()`, `gameover_get_credit_up()`,
`gameover_get_gold_up()`.

1. First check whether the match qualifies; a game with multiple eligible survivors
   must remain running. Team modes use captured `sys.teamwin_mode`.
2. On game over, original PHP writes game status, player `winner_flag`, one
   history record, account credits/gold/validgames/wingames/lastwin, news,
   achievement events and replay/rating hooks.
3. Modes in captured `sys.qiegao_ignore_mode` have no credit/gold reward.
   Gametype 15 does not count as a valid participation. The original team
   victory code compares a username against the *joined winner string* when
   incrementing `wingames`, so do not silently fix its multiwinner behavior.
4. Credit multipliers include player/NPC kills, levels, greatest weapon
   mastery and cash, each with the original PHP rounding and caps.
5. The TypeScript `projectLegacySettlement()` matches the frozen original
   PHP 8.2.35 `gameover_get_credit_up` and `gameover_get_gold_up` on a
   controlled differential fixture suite (22 comparisons at this checkpoint).
   This does not verify every custom module's override hooks.

## Actual isolated Supabase schema (read-only inspection)

Project: `qtjcjmpapjsgrrgtfica`, not the production PHP data server.
- `dtr_runtime.match_snapshots`: primary key bigint `match_id`, bigint
  version and JSONB state.
- `public.acbra2_users`: primary key `uid` and UNIQUE index on username.
  Columns available for reward delta: credits, gold, validgames, wingames,
  lastwin (other account columns must remain untouched).
- `public.acbra2_history`: UNIQUE index `gid`, no declared primary-key
  constraint; legacy game history expects **gamenum**, not necessarily the
  composite snapshot match ID. Existing `gid` collisions must be resolved
  while holding one global history-allocation lock.
- `public.acbra2_game`: primary key room ID `groomid`; a room can be
  recycled for a new gamenum, so a settlement must validate both identity
  components and current game status before changing it.
- The current `dtr_match_save` RPC rejects old versions but does **not**
  atomically update accounts/history/game or provide a settlement ledger.

## Required single transaction / crash invariants

1. Use a **match_id unique settlement ledger**, stored in a private
   `dtr_runtime` table, as the durable idempotency key. Verify it *before*
   writing anything. A retry of a committed settlement must return the prior
   receipt and never add currency, wins or history rows a second time.
2. Lock the match snapshot and room identity with database row locks. Reject
   stale snapshot version, wrong room/gamenum, malformed reward list, missing
   user accounts, wrong winner set, invalid gamestate or player membership.
   Recompute and validate reward deltas against the persisted snapshot
   rather than trusting arbitrary JSON sent by a browser.
3. In **one PostgreSQL transaction**, insert the unique ledger, lock/allocate
   the original-compatible `gid`, write history, update all accounts,
   game/room outcome and mark the snapshot ended. If any operation fails,
   the entire transaction must roll back.
4. Separate post-game replay/ranking/achievement hooks must be reconciled
   with the original before accepting full 1:1 parity. Never silently omit
   them and call settlement complete.
5. After RPC commit, the match Durable Object must update its memory and
   storage from the *authoritative DB receipt*. If DO persistence fails
   after the SQL commit, the next command must check settlement status and
   refuse any new gameplay; a DO restart must recover the finished snapshot
   instead of replaying an old active snapshot.
6. Simulate simultaneous settlement requests and injected failures after
   ledger reservation, account update, history allocation, SQL commit, and
   DO storage write. Verify exactly one payout, one history result, and
   stable retries/reloads.
7. Expose the settlement RPC only to the server service role. Revoke
   execution from PUBLIC, anon and authenticated; use a fixed empty
   `search_path` in privileged functions and qualify every relation.

## Release state

- PHP 8.2 credit/gold differential: **tested**.
- Pure outcome and reward projections: **implemented**.
- Private DO settlement plan read: **implemented**.
- Atomic account/history transaction, idempotency ledger and SQL rollback:
  **NOT IMPLEMENTED OR DEPLOYED**.
- DO postcommit crash reconciliation, real isolated dual-user E2E,
  replay/rating/achievement hooks and other 735-module parity:
  **NOT ACCEPTED**.
- **No migration and no payout writes were made as part of this checkpoint.**
- Production PHP/game, player data, and GitHub main are unchanged.
