# Architecture

## Runtime boundaries

| Area | Service | Responsibility |
| --- | --- | --- |
| Web entry | Cloudflare Static Assets | HTML, CSS, JavaScript and legacy-compatible art assets |
| HTTP API | Cloudflare Worker | Auth checks, profile/shop APIs, Stripe endpoints and routing |
| Live match | Durable Object per room | Authoritative state, turn ordering, WebSocket broadcast and reconnect window |
| Durable data | Dedicated Supabase project | Auth, profile, inventory, orders, entitlements and match history |
| Payment | Stripe | Checkout, webhook source of truth, refunds and Connect affiliate payouts |
| Async work | Cloudflare Queues (phase 2) | Webhook retries, settlement jobs and analytics fan-out |

## Trust boundaries

- The browser receives only the Supabase publishable key. It never receives Supabase secret keys or Stripe secrets.
- Every Data API table has Row Level Security enabled and explicit policies.
- Stripe webhook signatures are verified before an order, entitlement or reward changes.
- Durable Objects are authoritative during a match; Supabase stores checkpoints and results, not every frame.
- Order creation, webhook handling and affiliate rewards use idempotency keys and unique constraints.

## Capacity strategy

Each room is isolated in one Durable Object, static files are served from Cloudflare's edge cache, and Supabase stores durable business data while hot room traffic stays out of PostgreSQL. This removes the legacy three-second PHP/MySQL chat polling loop and prevents PHP-FPM or a single MySQL host from becoming the concurrency ceiling.

## Configuration

Public Worker variables: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`.

Encrypted Worker secrets: `SUPABASE_SECRET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.

Preview and production must use separate Supabase environments and Stripe webhook endpoints.
