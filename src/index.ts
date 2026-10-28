import { isValidRoomId, parseClientMessage } from "./protocol";
import { applyTutorialAction, type TutorialState } from "./tutorial";
import { applyGameAction, getGameView, type GameWorldState } from "./game";

const ROOM_STATE_KEY = "room-state-v1";
const MAX_RECENT_COMMANDS = 256;

interface RoomPlayer {
  id: string;
  joinedAt: number;
  lastSeenAt: number;
}

interface StoredRoomState {
  roomId?: string;
  sequence: number;
  players: Record<string, RoomPlayer>;
  recentCommandIds: string[];
  tutorialPlayers?: Record<string, TutorialState>;
  game?: GameWorldState;
  gameHistory?: Array<{ sequence: number; kind: string; playerId: string; text: string; targetId?: string; at: number }>;
}

interface SocketAttachment {
  connectedAt: number;
  playerId?: string;
  authenticatedAt?: number;
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

async function proxyAuth(request: Request, env: Env, mode: "login" | "signup" | "refresh" | "logout"): Promise<Response> {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    return json({ error: "auth_not_configured" }, { status: 503 });
  }
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, { status: 405 });
  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (declaredSize > 16 * 1024) return json({ error: "request_too_large" }, { status: 413 });

  let payload: Record<string, unknown> = {};
  if (mode !== "logout") {
    try {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object") throw new Error("invalid");
      payload = parsed as Record<string, unknown>;
    } catch {
      return json({ error: "invalid_request" }, { status: 400 });
    }
  }

  let endpoint = "/auth/v1/logout";
  let upstreamBody: Record<string, string> | undefined;
  if (mode === "login" || mode === "signup") {
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
    const password = typeof payload.password === "string" ? payload.password : "";
    if (!email || email.length > 254 || password.length < 8 || password.length > 128) {
      return json({ error: "invalid_credentials_format" }, { status: 400 });
    }
    endpoint = mode === "login" ? "/auth/v1/token?grant_type=password" : "/auth/v1/signup";
    upstreamBody = { email, password };
  } else if (mode === "refresh") {
    const refreshToken = typeof payload.refreshToken === "string" ? payload.refreshToken : "";
    if (!refreshToken || refreshToken.length > 4096) return json({ error: "invalid_refresh_token" }, { status: 400 });
    endpoint = "/auth/v1/token?grant_type=refresh_token";
    upstreamBody = { refresh_token: refreshToken };
  }

  const headers = new Headers({ apikey: env.SUPABASE_PUBLISHABLE_KEY });
  if (upstreamBody) headers.set("content-type", "application/json");
  if (mode === "logout") {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) return json({ error: "auth_required" }, { status: 401 });
    headers.set("authorization", authorization);
  }
  const upstream = await fetch(new URL(endpoint, env.SUPABASE_URL), {
    method: "POST",
    headers,
    ...(upstreamBody ? { body: JSON.stringify(upstreamBody) } : {})
  });
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

async function validateAccessToken(env: Env, accessToken: string): Promise<{ id: string } | null> {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) return null;
  const response = await fetch(new URL("/auth/v1/user", env.SUPABASE_URL), {
    headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY, authorization: `Bearer ${accessToken}` }
  });
  if (!response.ok) return null;
  const user: unknown = await response.json();
  if (!user || typeof user !== "object" || typeof (user as Record<string, unknown>).id !== "string") return null;
  return { id: (user as { id: string }).id };
}

function routeRoomSocket(request: Request, env: Env, roomId: string): Response | Promise<Response> {
  if (!isValidRoomId(roomId)) return json({ error: "invalid_room_id" }, { status: 400 });
  if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
    return json({ error: "websocket_upgrade_required" }, { status: 426 });
  }
  const id = env.GAME_ROOMS.idFromName(roomId);
  const headers = new Headers(request.headers);
  headers.set("x-dtr-room-id", roomId);
  return env.GAME_ROOMS.get(id).fetch(new Request(request, { headers }));
}

function routeRoomState(request: Request, env: Env, roomId: string): Response | Promise<Response> {
  if (!isValidRoomId(roomId)) return json({ error: "invalid_room_id" }, { status: 400 });
  const id = env.GAME_ROOMS.idFromName(roomId);
  const headers = new Headers(request.headers);
  headers.set("x-dtr-room-id", roomId);
  headers.set("x-dtr-operation", "state");
  return env.GAME_ROOMS.get(id).fetch(new Request(request, { headers }));
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
    const authMatch = url.pathname.match(/^\/api\/auth\/(login|signup|refresh|logout)$/);
    if (authMatch?.[1]) return proxyAuth(request, env, authMatch[1] as "login" | "signup" | "refresh" | "logout");
    const roomStateMatch = url.pathname.match(/^\/api\/rooms\/([^/]+)\/state$/);
    if (roomStateMatch?.[1] && request.method === "GET") return routeRoomState(request, env, roomStateMatch[1]);
    const match = url.pathname.match(/^\/api\/rooms\/([^/]+)\/socket$/);
    if (match?.[1]) return routeRoomSocket(request, env, match[1]);
    if (url.pathname.startsWith("/api/")) return json({ error: "not_found" }, { status: 404 });
    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;

export class GameRoom implements DurableObject {
  private room: StoredRoomState = { sequence: 0, players: {}, recentCommandIds: [] };
  private readonly ready: Promise<void>;

  constructor(private readonly state: DurableObjectState, private readonly env: Env) {
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

  private sendGameViews(log?: string, error?: string): void {
    if (!this.room.game) return;
    for (const peer of this.state.getWebSockets()) {
      const attachment = peer.deserializeAttachment() as SocketAttachment | null;
      if (peer.readyState === WebSocket.OPEN && attachment?.playerId && this.room.game.players[attachment.playerId]) {
        peer.send(JSON.stringify({ type: "game_state", view: getGameView(this.room.game, attachment.playerId), history: this.room.gameHistory?.slice(-30) ?? [], ...(log ? { log } : {}), ...(error ? { error } : {}) }));
      }
    }
  }

  async fetch(request: Request): Promise<Response> {
    await this.ready;
    const roomId = request.headers.get("x-dtr-room-id");
    if (!this.room.roomId && roomId) {
      this.room.roomId = roomId;
      await this.persist();
    }
    if (request.headers.get("x-dtr-operation") === "state") {
      const gamePlayers = Object.values(this.room.game?.players ?? {});
      return json({
        roomId: this.room.roomId,
        connected: this.state.getWebSockets().length,
        joined: gamePlayers.length,
        alive: gamePlayers.filter(({ alive }) => alive).length,
        phase: this.room.game?.phase ?? "waiting",
        turn: this.room.game?.turn ?? 0,
        cycle: this.room.game?.cycle ?? 1
      });
    }
    if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return json({ error: "websocket_upgrade_required" }, { status: 426 });
    }
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    this.state.acceptWebSocket(server);
    server.serializeAttachment({ connectedAt: Date.now() } satisfies SocketAttachment);
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

    if (message.type === "auth" || message.type === "guest") {
      const authenticatedUser = message.type === "auth" ? await validateAccessToken(this.env, message.accessToken) : null;
      if (message.type === "auth" && !authenticatedUser) {
        socket.send(JSON.stringify({ type: "error", code: "auth_invalid" }));
        return;
      }
      if (message.type === "guest" && this.env.APP_ENV !== "test") {
        socket.send(JSON.stringify({ type: "error", code: "guest_disabled" }));
        return;
      }
      const now = Date.now();
      const playerId = authenticatedUser?.id ?? `guest:${message.type === "guest" ? message.guestId : ""}`;
      const existing = this.room.players[playerId];
      this.room.players[playerId] = {
        id: playerId,
        joinedAt: existing?.joinedAt ?? now,
        lastSeenAt: now
      };
      const attachment = (socket.deserializeAttachment() as SocketAttachment | null) ?? { connectedAt: now };
      socket.serializeAttachment({ ...attachment, playerId, ...(authenticatedUser ? { authenticatedAt: now } : {}) } satisfies SocketAttachment);
      this.room.sequence += 1;
      await this.persist();
      this.broadcast({ type: "room_event", sequence: this.room.sequence, event: { type: "player_joined", player: this.room.players[playerId] } });
      const tutorialState = this.room.tutorialPlayers?.[playerId];
      if (this.room.roomId === "tutorial" && tutorialState) {
        socket.send(JSON.stringify({ type: "tutorial_state", state: tutorialState, log: "训练状态已恢复。" }));
      }
      if (this.room.roomId !== "tutorial" && this.room.game?.players[playerId]) {
        socket.send(JSON.stringify({ type: "game_state", view: getGameView(this.room.game, playerId), history: this.room.gameHistory?.slice(-30) ?? [], log: "对局状态已恢复。" }));
      }
      return;
    }

    const attachment = socket.deserializeAttachment() as SocketAttachment | null;
    const player = attachment?.playerId ? this.room.players[attachment.playerId] : undefined;
    if (!attachment?.playerId || !player) {
      socket.send(JSON.stringify({ type: "error", code: "auth_required" }));
      return;
    }
    if (this.room.recentCommandIds.includes(message.commandId)) {
      socket.send(JSON.stringify({ type: "command_ack", commandId: message.commandId, duplicate: true, sequence: this.room.sequence }));
      return;
    }
    let tutorialResult: ReturnType<typeof applyTutorialAction> | undefined;
    let gameResult: ReturnType<typeof applyGameAction> | undefined;
    if (message.action.startsWith("tutorial_")) {
      if (this.room.roomId !== "tutorial") {
        socket.send(JSON.stringify({ type: "error", code: "tutorial_room_required" }));
        return;
      }
      tutorialResult = applyTutorialAction(this.room.tutorialPlayers?.[attachment.playerId], message.action, message.payload);
      if (!tutorialResult.ok) {
        socket.send(JSON.stringify({ type: "tutorial_state", state: tutorialResult.state, error: tutorialResult.code, log: tutorialResult.log }));
        return;
      }
      this.room.tutorialPlayers ??= {};
      this.room.tutorialPlayers[attachment.playerId] = tutorialResult.state;
    }
    if (message.action.startsWith("game_")) {
      if (this.room.roomId === "tutorial") {
        socket.send(JSON.stringify({ type: "error", code: "game_room_required" }));
        return;
      }
      const gamePayload = message.action === "game_enter"
        ? { mode: this.room.roomId?.startsWith("standard") ? "standard" : "infinite" }
        : message.payload;
      gameResult = applyGameAction(this.room.game, attachment.playerId, message.action, gamePayload);
      if (!gameResult.ok) {
        socket.send(JSON.stringify({ type: "game_state", view: getGameView(gameResult.world, attachment.playerId), error: gameResult.code, log: gameResult.event.text }));
        return;
      }
      this.room.game = gameResult.world;
    }
    this.room.recentCommandIds.push(message.commandId);
    this.room.recentCommandIds = this.room.recentCommandIds.slice(-MAX_RECENT_COMMANDS);
    this.room.sequence += 1;
    player.lastSeenAt = Date.now();
    if (gameResult) {
      this.room.gameHistory ??= [];
      this.room.gameHistory.push({ sequence: this.room.sequence, ...gameResult.event, at: Date.now() });
      this.room.gameHistory = this.room.gameHistory.slice(-100);
    }
    await this.persist();
    if (gameResult) {
      this.broadcast({ type: "game_event", sequence: this.room.sequence, event: gameResult.event });
      this.sendGameViews(gameResult.event.text);
      return;
    }
    this.broadcast({
      type: "room_event",
      sequence: this.room.sequence,
      event: {
        type: "action",
        playerId: attachment.playerId,
        action: message.action,
        payload: message.payload,
        commandId: message.commandId,
        ...(tutorialResult ? { tutorial: tutorialResult.state, log: tutorialResult.log } : {})
      }
    });
  }

  async webSocketClose(socket: WebSocket, code: number, reason: string, wasClean: boolean): Promise<void> {
    socket.close(code, reason || (wasClean ? "closed" : "disconnected"));
  }
}
