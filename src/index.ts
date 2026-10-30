/**
 * Original ACFUN 大逃杀 — 1:1 backend migration entry.
 * No "MUGEN LOOP" UI, simplified game world, or synthetic gameplay.
 * Original Baota asset files are hosted separately through Cloudflare Assets.
 *
 * THIS VERSION IS STAGING ONLY. Account login and the waiting-room transaction
 * boundary are wired; unported command/module paths remain explicit 501s.
 */
export interface OriginalEnv {
  ASSETS: Fetcher;
  APP_ENV?: string;
  ROOMS: DurableObjectNamespace;
  GAMES: DurableObjectNamespace;
  SUPABASE_URL?: string;
  SUPABASE_SECRET_KEY?: string;
}
import {
  entryTemplate,
  isSignedOutRequest,
  loadTemplateTree,
  originalErrorMessage,
  originalPageHeaders,
  renderOriginalError,
  renderOriginalPage,
  selectOriginalPage
} from "./original-pages";
import { applyOriginalRouting } from "./original-routing";
import { handleLegacyLogin } from "./runtime/http-auth";
import { handleLegacyIndex } from "./runtime/http-index";
import { handleLegacyGameCommand, handleLegacyGamePage } from "./runtime/http-game";
import { handleLegacyRoomCommand, handleLegacyRoomUpdate } from "./runtime/http-room";
import { LegacyLobbyService } from "./runtime/lobby-service";
import { LegacyRoomService } from "./runtime/room-service";
import { LegacyMatchStarter } from "./runtime/match-starter";
import { LegacyGameService } from "./runtime/game-service";
import {
  createSupabaseRuntime, SupabaseLegacyAccounts, SupabaseLegacyIndex, SupabaseLegacyLobby,
  SupabaseLegacyMatches, SupabaseLegacyMatchStart, SupabaseLegacyRooms
} from "./runtime/supabase";
import { legacyCommandResponse } from "./runtime/command";
export { applyOriginalRouting } from "./original-routing";
export { LegacyRoomDurableObject } from "./runtime/room-durable-object";
export { LegacyGameDurableObject } from "./runtime/game-durable-object";
export const ORIGINAL_STAGING_STATUS = {
  source: "ACFUN 大逃杀 installed Baota source",
  presentation: "original asset byte parity",
  backendParity: false,
  playable: false,
  legacyModuleScope: 735,
  originProxy: false,
  readonly: false,
  accountSession: "wired",
  roomLifecycle: "partial",
  matchLifecycle: "partial",
  gameCommandTransport: "partial",
  routeParity: "16/23 signed-out fixtures"
};
const text = (body: string, status: number): Response => new Response(body, {
  status, headers: { "content-type": "text/plain;charset=utf-8", "cache-control": "no-store" }
});
export default {
  async fetch(request: Request, env: OriginalEnv): Promise<Response> {
    const url = new URL(request.url);

    // The original's edge refuses or retires some paths before PHP ever runs.
    // Reproduced first so the browser sees the same status and body it does
    // today, independently of how much of the application is ported.
    const routed = applyOriginalRouting(url.pathname, request.method);
    if (routed) return routed;

    if (url.pathname === "/__stage_status") {
      return new Response(JSON.stringify(ORIGINAL_STAGING_STATUS), {
        headers: { "content-type": "application/json;charset=utf-8", "cache-control": "no-store" }
      });
    }
    const signedOutGameRequest = isSignedOutRequest(request) && (
      (url.pathname === "/command.php" && request.method === "POST") ||
      (url.pathname === "/game.php" && ["GET", "HEAD", "POST"].includes(request.method))
    );
    if (signedOutGameRequest) {
      const sources = await loadTemplateTree("error", async path => {
        const response = await env.ASSETS.fetch(new Request(new URL(path, url.origin)));
        return response.status === 200 ? response.text() : undefined;
      });
      const body = renderOriginalError(originalErrorMessage("no_login"), "game", sources);
      return new Response(request.method === "HEAD" ? null : body, {
        status: 200, headers: originalPageHeaders()
      });
    }
    if ((url.pathname === "/game.php" || url.pathname === "/command.php") &&
        (request.method === "GET" || request.method === "HEAD" || request.method === "POST")) {
      const rest = createSupabaseRuntime(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);
      if (rest) {
        const service = new LegacyGameService(
          env.GAMES, new SupabaseLegacyAccounts(rest), new SupabaseLegacyMatches(rest)
        );
        const response = url.pathname === "/game.php"
          ? await handleLegacyGamePage(request, service, env.ASSETS)
          : await handleLegacyGameCommand(request, service);
        if (response) return response;
      }
    }
    const postedLogin = request.method === "POST"
      ? new URLSearchParams(await request.clone().text())
      : undefined;
    const hasPostedLogin = postedLogin?.has("username") === true || postedLogin?.has("password") === true;
    if (url.pathname === "/login.php" && (hasPostedLogin || url.searchParams.get("mode") === "quit")) {
      const rest = createSupabaseRuntime(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);
      if (!rest) return text("登录服务尚未配置。", 503);
      const response = await handleLegacyLogin(request, new SupabaseLegacyAccounts(rest), env.ASSETS);
      if (response) return response;
    }
    if (url.pathname === "/roomcmd.php" && request.method === "GET" && url.search === "") {
      const sources = await loadTemplateTree("error", async path => {
        const response = await env.ASSETS.fetch(new Request(new URL(path, url.origin)));
        return response.status === 200 ? response.text() : undefined;
      });
      return new Response(renderOriginalError("你不在房间内，请先进入房间", "game", sources), {
        status: 200, headers: originalPageHeaders()
      });
    }
    if (url.pathname === "/roomupdate.php" && !(request.headers.get("cookie") ?? "").includes("bra_user=")) {
      return legacyCommandResponse({ url: "error.php", errormsg: null });
    }
    const hasPostedRoomCommand = request.method === "POST" &&
      new URLSearchParams(await request.clone().text()).has("command");
    if (url.pathname === "/roomcmd.php" && (hasPostedRoomCommand || url.searchParams.has("command"))) {
      const rest = createSupabaseRuntime(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);
      if (!rest) return text("房间服务尚未配置。", 503);
      const accounts = new SupabaseLegacyAccounts(rest);
      const rooms = new SupabaseLegacyRooms(rest);
      const response = await handleLegacyRoomCommand(
        request,
        new LegacyLobbyService(env.ROOMS, accounts, new SupabaseLegacyLobby(rest), rooms),
        new LegacyRoomService(env.ROOMS, accounts, rooms),
        env.ASSETS,
        Math.floor(Date.now() / 1000),
        new LegacyMatchStarter(env.GAMES, env.ROOMS, new SupabaseLegacyMatchStart(rest))
      );
      if (response) return response;
    }
    if (url.pathname === "/roomupdate.php") {
      const rest = createSupabaseRuntime(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);
      if (!rest) return text("房间服务尚未配置。", 503);
      const accounts = new SupabaseLegacyAccounts(rest);
      const rooms = new SupabaseLegacyRooms(rest);
      const response = await handleLegacyRoomUpdate(
        request, new LegacyRoomService(env.ROOMS, accounts, rooms), env.ASSETS
      );
      if (response) return response;
    }
    if ((url.pathname === "/" || url.pathname === "/index.php") &&
        (request.method === "GET" || request.method === "HEAD")) {
      const rest = createSupabaseRuntime(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);
      if (rest) {
        const response = await handleLegacyIndex(
          request,
          new SupabaseLegacyAccounts(rest),
          new SupabaseLegacyIndex(rest),
          env.ASSETS
        );
        if (response) return response;
      }
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return text("原版游戏后端指令尚未完成 1:1 移植；本环境不会写入玩家数据。", 501);
    }
    if (url.pathname === "/") url.pathname = "/index.php";

    // Pages whose output already matches the original byte for byte.
    const page = selectOriginalPage(url.pathname, url, request);
    if (page) {
      const entry = entryTemplate(page);
      const sources = entry
        ? await loadTemplateTree(entry, async path => {
            const response = await env.ASSETS.fetch(new Request(new URL(path, url.origin)));
            return response.status === 200 ? await response.text() : undefined;
          })
        : new Map<string, string>();
      return new Response(renderOriginalPage(page, sources), {
        status: 200,
        headers: originalPageHeaders()
      });
    }

    // Every unported .php answers 501. It used to fall through to the asset
    // bundle for a list of "guest snapshot" paths, which held pre-rendered
    // HTML; the bundle carries no .php, so those answered 404 — telling a
    // browser the original's own URLs do not exist, when the original always
    // answers them. The contract also rejects a static-snapshot release
    // outright, so there is nothing to fall back to.
    if (url.pathname.toLowerCase().endsWith(".php")) {
      return text("原版服务端页面尚未完成 1:1 移植。", 501);
    }
    return env.ASSETS.fetch(new Request(url, request));
  }
};
