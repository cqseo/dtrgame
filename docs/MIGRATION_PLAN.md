# Legacy parity migration and acceptance plan

The rewrite is accepted only when the legacy game's visible behaviour and rules remain equivalent. Runtime language and infrastructure may change; the player experience may not drift accidentally.

## Phase 0 — Baseline capture

- Export legacy source and static assets into a read-only reference archive.
- Capture desktop/mobile screenshots for login, lobby, room, combat, chat, shop and result states.
- Record representative sessions and deterministic fixtures for random seeds, player counts and reconnects.
- Inventory every PHP route, scheduled job, database table and third-party call.

## Phase 1 — Platform foundation

- Worker health endpoint, static assets, Durable Object room transport, CI and manual deployment workflow.
- Dedicated Supabase project with Auth, RLS, staging data and backup policy.
- Observability, request IDs, structured errors and rate limiting.

## Phase 2 — Data and identity

- Map legacy users to Supabase Auth without copying legacy password hashes into client-visible tables.
- Migrate profiles, inventory, rankings and history with reconciliation totals.
- Add account recovery and auditable migration status per player.

## Phase 3 — Gameplay parity

- Port server-authoritative rules into pure TypeScript modules.
- Run legacy and new fixtures against identical seeds and compare outcomes.
- Replace chat polling with WebSockets; verify reconnect, duplicate and out-of-order handling.
- Reuse licensed original assets and reproduce layouts at agreed viewport baselines.

## Phase 4 — Commerce and distribution

- Stripe Checkout for purchases; signed webhooks are the entitlement source of truth.
- Ledger-based affiliate attribution with pending, approved, reversed and paid states.
- Refunds/disputes reverse rewards; block self-referrals and circular attribution.
- Stripe Connect handles identity verification and payouts where supported.

## Release gates

| Gate | Pass condition |
| --- | --- |
| Build | Type check, unit tests and Worker dry-run pass from a clean install |
| Visual parity | Golden screenshots pass at desktop/mobile baselines with reviewed tolerances |
| Rule parity | Deterministic fixtures match legacy outcomes for all critical actions |
| Security | RLS/advisor review clean; secrets absent from repository/browser bundles |
| Payments | Test purchase, duplicate webhook, refund and failed-payment scenarios pass |
| Load | Target room concurrency and reconnect storm meet latency/error budgets |
| Migration | Row counts, balances and sampled records reconcile with a signed report |
| Rollback | Route rollback and database restore drill completed |

## Current status

- Repository foundation: in progress
- Legacy baseline archive: pending import from the current server
- Dedicated Supabase project: pending cost confirmation
- Stripe account and Connect setup: pending account details
