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

The authenticated `tutorial` room includes the first playable legacy-parity
slice: movement and exploration each cost 15 SP, discoveries are picked up
separately, consumables can apply a harmful status, and the matching purifier
removes it. Tutorial progress is stored per authenticated player in the room's
Durable Object.

The authenticated **infinite** room now includes a deterministic solo PvE preview:
search for a weapon, equip, reveal the 3×3 fog map, fight a guardian, heal/rest,
and view the room-local best-score board. The preview combat values are original
test values pending legacy parity verification. Personal state is kept per
authenticated player and is not broadcast to other room members. Access is free;
no checkout, referral payouts or premium unlocks are active.

See [PvE preview rules and outstanding release gates](docs/PVE_PREVIEW.md),
[Architecture](docs/ARCHITECTURE.md), and [Migration plan](docs/MIGRATION_PLAN.md).

## Secrets

Copy `.env.example` to `.dev.vars` for local development. Store production secrets with Cloudflare secret bindings or an encrypted deployment secret store. Never commit `.dev.vars`, Supabase secret keys or Stripe keys.
