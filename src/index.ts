/**
 * Original ACFUN 大逃杀 — 1:1 backend migration entry.
 * No "MUGEN LOOP" UI, simplified game world, or synthetic gameplay.
 * Original Baota asset files are hosted separately through Cloudflare Assets.
 *
 * THIS VERSION IS STAGING ONLY. When real backend behavior for all 735 enabled
 * modules has parity tests, the /command.php, account, room, and mode handlers
 * can replace the explicit 501 responses below.
 */
export interface OriginalEnv {
  ASSETS: Fetcher;
  APP_ENV?: string;
  ROOMS: DurableObjectNamespace;
  GAMES: DurableObjectNamespace;
  SUPABASE_URL?: string;
  SUPABASE_SECRET_KEY?: string;
}
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
  readonly: true
};
const text = (body: string, status: number): Response => new Response(body, {
  status, headers: { "content-type": "text/plain;charset=utf-8", "cache-control": "no-store" }
});
export default {
  async fetch(request: Request, env: OriginalEnv): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/__stage_status") {
      return new Response(JSON.stringify(ORIGINAL_STAGING_STATUS), {
        headers: { "content-type": "application/json;charset=utf-8", "cache-control": "no-store" }
      });
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return text("原版游戏后端指令尚未完成 1:1 移植；本环境不会写入玩家数据。", 501);
    }
    if (url.pathname === "/") url.pathname = "/index.php";
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
