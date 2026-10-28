import { isValidRoomId, parseClientMessage } from "./protocol";

const ROOM_STATE_KEY = "room-state-v1";
const MAX_RECENT_COMMANDS = 256;

interface RoomPlayer {
  id: string;
  joinedAt: number;
  lastSeenAt: number;
}

interface StoredRoomState {
  sequence: number;
  players: Record<string, RoomPlayer>;
  recentCommandIds: string[];
}

interface SocketAttachment {
  connectedAt: number;
  playerId?: string;
}

export interface Env {
  ASSETS: Fetcher;
  GAME_ROOMS: DurableObjectNamespace;
  APP_ENV: string;
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_SECRET_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function routeRoomSocket(request: Request, env: Env, roomId: string): Response | Promise<Response> {
  if (!isValidRoomId(roomId)) return json({ error: "invalid_room_id" }, { status: 400 });
  if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
    return json({ error: "websocket_upgrade_required" }, { status: 426 });
  }
  const id = env.GAME_ROOMS.idFromName(roomId);
  return env.GAME_ROOMS.get(id).fetch(request);
}

async function getPublicCatalog(env: Env): Promise<Response> {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    return json({ error: "supabase_not_configured" }, { status: 503 });
  }

  const endpoint = new URL("/rest/v1/game_items", env.SUPABASE_URL);
  endpoint.searchParams.set("select", "id,sku,name,item_type,config");
  endpoint.searchParams.set("active", "eq.true");
  endpoint.searchParams.set("order", "sku.asc");

  const response = await fetch(endpoint, {
    headers: {
      apikey: env.SUPABASE_PUBLISHABLE_KEY
    }
  });

  if (!response.ok) {
    return json({ error: "catalog_unavailable" }, { status: 502 });
  }

  return json({ items: await response.json() }, {
    headers: { "cache-control": "public, max-age=60, s-maxage=300" }
  });
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") {
      return json({
        ok: true,
        service: "dtrgame",
        environment: env.APP_ENV,
        dependencies: {
          supabase: Boolean(env.SUPABASE_URL && env.SUPABASE_PUBLISHABLE_KEY),
          stripe: Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET)
        }
      });
    }
    if (url.pathname === "/api/catalog" && request.method === "GET") {
      return getPublicCatalog(env);
    }
    const match = url.pathname.match(/^\/api\/rooms\/([^/]+)\/socket$/);
    if (match?.[1]) return routeRoomSocket(request, env, match[1]);
    if (url.pathname.startsWith("/api/")) return json({ error: "not_found" }, { status: 404 });
    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;

export class GameRoom implements DurableObject {
  private room: StoredRoomState = { sequence: 0, players: {}, recentCommandIds: [] };
  private readonly ready: Promise<void>;

  constructor(private readonly state: DurableObjectState) {
    this.ready = this.state.blockConcurrencyWhile(async () => {
      this.room = (await this.state.storage.get<StoredRoomState>(ROOM_STATE_KEY)) ?? this.room;
    });
  }

  private snapshot(): { type: "room_snapshot"; sequence: number; players: RoomPlayer[] } {
    return {
      type: "room_snapshot",
      sequence: this.room.sequence,
      players: Object.values(this.room.players)
    };
  }

  private broadcast(message: unknown): void {
    const encoded = JSON.stringify(message);
    for (const peer of this.state.getWebSockets()) {
      if (peer.readyState === WebSocket.OPEN) peer.send(encoded);
    }
  }

  private async persist(): Promise<void> {
    await this.state.storage.put(ROOM_STATE_KEY, this.room);
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return json({ error: "websocket_upgrade_required" }, { status: 426 });
    }
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    this.state.acceptWebSocket(server);
    server.serializeAttachment({ connectedAt: Date.now() } satisfies SocketAttachment);
    await this.ready;
    server.send(JSON.stringify(this.snapshot()));
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(socket: WebSocket, raw: string | ArrayBuffer): Promise<void> {
    await this.ready;
    if (typeof raw !== "string") {
      socket.close(1003, "Text messages only");
      return;
    }
    const message = parseClientMessage(raw);
    if (!message) {
      socket.send(JSON.stringify({ type: "error", code: "invalid_message" }));
      return;
    }
    if (message.type === "ping") {
      socket.send(JSON.stringify({ type: "pong", at: message.at, sequence: this.room.sequence }));
      return;
    }

    if (message.type === "join") {
      const now = Date.now();
      const existing = this.room.players[message.playerId];
      this.room.players[message.playerId] = {
        id: message.playerId,
        joinedAt: existing?.joinedAt ?? now,
        lastSeenAt: now
      };
      const attachment = (socket.deserializeAttachment() as SocketAttachment | null) ?? { connectedAt: now };
      socket.serializeAttachment({ ...attachment, playerId: message.playerId } satisfies SocketAttachment);
      this.room.sequence += 1;
      await this.persist();
      this.broadcast({ type: "room_event", sequence: this.room.sequence, event: { type: "player_joined", player: this.room.players[message.playerId] } });
      return;
    }

    const attachment = socket.deserializeAttachment() as SocketAttachment | null;
    const player = attachment?.playerId ? this.room.players[attachment.playerId] : undefined;
    if (!attachment?.playerId || !player) {
      socket.send(JSON.stringify({ type: "error", code: "join_required" }));
      return;
    }
    if (this.room.recentCommandIds.includes(message.commandId)) {
      socket.send(JSON.stringify({ type: "command_ack", commandId: message.commandId, duplicate: true, sequence: this.room.sequence }));
      return;
    }
    this.room.recentCommandIds.push(message.commandId);
    this.room.recentCommandIds = this.room.recentCommandIds.slice(-MAX_RECENT_COMMANDS);
    this.room.sequence += 1;
    player.lastSeenAt = Date.now();
    await this.persist();
    this.broadcast({
      type: "room_event",
      sequence: this.room.sequence,
      event: { type: "action", playerId: attachment.playerId, action: message.action, payload: message.payload, commandId: message.commandId }
    });
  }

  async webSocketClose(socket: WebSocket, code: number, reason: string, wasClean: boolean): Promise<void> {
    socket.close(code, reason || (wasClean ? "closed" : "disconnected"));
  }
}
