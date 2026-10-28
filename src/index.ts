import { isValidRoomId, parseClientMessage } from "./protocol";

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
    const match = url.pathname.match(/^\/api\/rooms\/([^/]+)\/socket$/);
    if (match?.[1]) return routeRoomSocket(request, env, match[1]);
    if (url.pathname.startsWith("/api/")) return json({ error: "not_found" }, { status: 404 });
    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;

export class GameRoom implements DurableObject {
  constructor(private readonly state: DurableObjectState) {}

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return json({ error: "websocket_upgrade_required" }, { status: 426 });
    }
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    this.state.acceptWebSocket(server);
    server.serializeAttachment({ connectedAt: Date.now() });
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(socket: WebSocket, raw: string | ArrayBuffer): Promise<void> {
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
      socket.send(JSON.stringify({ type: "pong", at: message.at }));
      return;
    }
    const event = JSON.stringify({ type: "room_event", event: message });
    for (const peer of this.state.getWebSockets()) {
      if (peer.readyState === WebSocket.OPEN) peer.send(event);
    }
  }

  async webSocketClose(socket: WebSocket, code: number, reason: string, wasClean: boolean): Promise<void> {
    socket.close(code, reason || (wasClean ? "closed" : "disconnected"));
  }
}
