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
  loadTemplateTree,
  originalPageHeaders,
  renderOriginalError,
  renderOriginalPage,
  selectOriginalPage
} from "./original-pages";
import { applyOriginalRouting } from "./original-routing";
import { handleLegacyLogin } from "./runtime/http-auth";
import { handleLegacyRoomCommand, handleLegacyRoomUpdate } from "./runtime/http-room";
import { LegacyLobbyService } from "./runtime/lobby-service";
import { LegacyRoomService } from "./runtime/room-service";
import {
  createSupabaseRuntime, SupabaseLegacyAccounts, SupabaseLegacyLobby, SupabaseLegacyRooms
} from "./runtime/supabase";
import { legacyCommandResponse } from "./runtime/command";
export { applyOriginalRouting } from "./original-routing";
export { LegacyRoomDurableObject } from "./runtime/room-durable-object";
export { LegacyGameDurableObject } from "./runtime/game-durable-object";
export const ORIGINAL_GUEST_SNAPSHOTS = new Set([
  "/index.php", "/game.php", "/map.php", "/help.php", "/register.php",
  "/login.php", "/alive.php", "/rank.php", "/news.php", "/winner.php",
  "/user.php", "/cardbook.php", "/roomcmd.php"
]);
export const ORIGINAL_STAGING_STATUS = {
  source: "ACFUN 大逃杀 installed Baota source",
  presentation: "original asset byte parity",
  backendParity: false,
  playable: false,
  legacyModuleScope: 735,
  originProxy: false,
  readonly: false,
  accountSession: "wired",
  roomLifecycle: "partial"
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
        env.ASSETS
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

    if (url.pathname.toLowerCase().endsWith(".php") && !ORIGINAL_GUEST_SNAPSHOTS.has(url.pathname)) {
      return text("原版服务端页面尚未完成 1:1 移植。", 501);
    }
    const assetResponse = await env.ASSETS.fetch(new Request(url, request));
    if (!ORIGINAL_GUEST_SNAPSHOTS.has(url.pathname)) return assetResponse;
    const headers = new Headers(assetResponse.headers);
    headers.set("content-type", "text/html;charset=utf-8");
    headers.set("cache-control", "no-store");
    headers.set("x-dts-stage", "original-guest-html-snapshot");
    return new Response(assetResponse.body, { status: assetResponse.status, headers });
  }
};
