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

While `APP_ENV=test`, gameplay rooms also accept a session-scoped guest UUID so
gameplay migration is not blocked by email delivery or account setup. Guest
entry is rejected automatically outside the test environment.

## Playable game modes

- Tutorial: deterministic move, search, pickup, harmful-item and recovery lesson.
- Standard battle royale: up to eight players, PvP, tactical stances, corpses,
  one-at-a-time looting, shrinking forbidden zones and last-survivor results.
- Infinite trial: persistent waves of scaling NPC encounters without PvP match
  termination; players can restart a failed loop and continue through cycles.

Both main modes include SP-based movement/search, HP and status effects,
inventory limits, weapons and armor with durability, consumables, NPC combat,
fleeing, experience and levels, LOOP currency, regional shops, buying/selling,
room chat, reconnect recovery and a bounded persistent action history.

See [Architecture](docs/ARCHITECTURE.md) and [Migration plan](docs/MIGRATION_PLAN.md).

## Secrets

Copy `.env.example` to `.dev.vars` for local development. Store production secrets with Cloudflare secret bindings or an encrypted deployment secret store. Never commit `.dev.vars`, Supabase secret keys or Stripe keys.
