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
- `POST /api/auth/login`, `/signup`, `/refresh`, and `/logout`
- `GET /api/rooms/:roomId/socket` with a WebSocket upgrade

Room sockets now send a persisted `room_snapshot` on connection. Clients must
authenticate with a Supabase access token before submitting an `action`; the
Durable Object validates the token and derives the player UUID server-side.
Actions include a unique `commandId` and
receive authoritative, monotonically sequenced room events. The room retains a
bounded command-id window so reconnects cannot apply the same command twice.

See [Architecture](docs/ARCHITECTURE.md) and [Migration plan](docs/MIGRATION_PLAN.md).

## Secrets

Copy `.env.example` to `.dev.vars` for local development. Store production secrets with Cloudflare secret bindings or an encrypted deployment secret store. Never commit `.dev.vars`, Supabase secret keys or Stripe keys.
