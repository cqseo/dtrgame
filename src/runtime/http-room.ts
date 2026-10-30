import { loadTemplateTree, originalPageHeaders, renderOriginalError } from "../original-pages";
import { LegacyLobbyService } from "./lobby-service";
import { LegacyRoomService } from "./room-service";
import { legacyCommandResponse } from "./command";
import type { LegacyAuthAssets } from "./http-auth";
import { legacyRoomUiPayload, renderLegacyRoomMain } from "./room-render";
import type { LegacyMatchStarter } from "./match-starter";

async function roomError(message: string, assets: LegacyAuthAssets, origin: string): Promise<Response> {
  const sources = await loadTemplateTree("error", async path => {
    const response = await assets.fetch(new Request(new URL(path, origin)));
    return response.status === 200 ? response.text() : undefined;
  });
  return new Response(renderOriginalError(message, "roomcmd", sources), {
    status: 200, headers: originalPageHeaders()
  });
}

function roomRedirect(roomId: number, secure: boolean, location = "index.php"): Response {
  const headers = originalPageHeaders();
  headers.set("location", location);
  headers.append("set-cookie", `bra_roomid=${roomId}; Path=/${secure ? "; Secure" : ""}`);
  return new Response("", { status: 302, headers });
}

function commandRequest(request: Request, url: URL): Request {
  if (request.method !== "GET") return request;
  const form = new URLSearchParams(url.searchParams);
  return new Request(request.url, {
    method: "POST",
    headers: {
      cookie: request.headers.get("cookie") ?? "",
      "content-type": "application/x-www-form-urlencoded"
    },
    body: form.toString()
  });
}

async function roomTemplateSources(assets: LegacyAuthAssets, origin: string): Promise<Map<string, string>> {
  return loadTemplateTree("roommain", async path => {
    const response = await assets.fetch(new Request(new URL(path, origin)));
    return response.status === 200 ? response.text() : undefined;
  });
}

/** Public roomcmd.php adapter. Lobby redirects are exact; AJAX commands stay encoded. */
export async function handleLegacyRoomCommand(
  request: Request,
  lobby: LegacyLobbyService,
  rooms: LegacyRoomService,
  assets: LegacyAuthAssets,
  now = Math.floor(Date.now() / 1000),
  starter?: LegacyMatchStarter
): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (url.pathname !== "/roomcmd.php") return undefined;
  const params = request.method === "GET" ? url.searchParams : new URLSearchParams(await request.clone().text());
  const command = params.get("command") ?? "";
  const secure = url.protocol === "https:";

  if (command === "newroom" || command === "enterroom") {
    const numeric = Number.parseInt(params.get("para1") ?? "0", 10);
    const result = command === "newroom"
      ? await lobby.create(request, numeric, now)
      : await lobby.join(request, numeric, now);
    if (!result.ok) return roomError(result.error === "no_login" ? "您尚未登录，不能进行游戏" : result.error, assets, url.origin);
    return roomRedirect(result.roomId, secure);
  }

  const result = await rooms.execute(commandRequest(request, url), now);
  if (!result.ok) return roomError(result.error === "no_login" ? "您尚未登录，不能进行游戏" : result.error, assets, url.origin);
  if (result.result.left) return roomRedirect(0, secure);
  if (result.result.startRequested) {
    if (!starter) return roomError("游戏初始化服务尚未配置。", assets, url.origin);
    try {
      await starter.start(result.result.record, now);
      return legacyCommandResponse({ url: "game.php" });
    } catch (error) {
      return roomError(error instanceof Error ? error.message : "游戏初始化失败。", assets, url.origin);
    }
  }
  const sources = await roomTemplateSources(assets, url.origin);
  const html = renderLegacyRoomMain(result.result.record, result.username, sources, now);
  return legacyCommandResponse(legacyRoomUiPayload(result.result.record, result.username, html));
}

export async function handleLegacyRoomUpdate(
  request: Request,
  rooms: LegacyRoomService,
  assets: LegacyAuthAssets,
  now = Math.floor(Date.now() / 1000)
): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (url.pathname !== "/roomupdate.php") return undefined;
  const state = await rooms.state(request, now);
  if (!state.ok) {
    if (state.error === "no_login") return legacyCommandResponse({ url: "error.php", errormsg: null });
    return legacyCommandResponse({ url: "index.php" });
  }
  if (state.record.groomstatus >= 40) return legacyCommandResponse({ url: "game.php" });
  const sources = await roomTemplateSources(assets, url.origin);
  const html = renderLegacyRoomMain(state.record, state.username, sources, now);
  return legacyCommandResponse(legacyRoomUiPayload(state.record, state.username, html));
}
