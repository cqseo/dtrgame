# dtrgame

Cloudflare Workers + Durable Objects + Supabase rewrite of the legacy browser game. The migration preserves the existing visual style and gameplay while replacing the PHP/MySQL single-server runtime.

## Local verification

```bash
npm ci
npm run verify
```

Start a local Worker with `npm run dev`.

Initial endpoints:

- `GET /api/health`
- `GET /api/catalog`
- `GET /api/rooms/:roomId/socket` with a WebSocket upgrade

See [Architecture](docs/ARCHITECTURE.md) and [Migration plan](docs/MIGRATION_PLAN.md).

## Secrets

Copy `.env.example` to `.dev.vars` for local development. Store production secrets with Cloudflare secret bindings or an encrypted deployment secret store. Never commit `.dev.vars`, Supabase secret keys or Stripe keys.
