import {
  loadTemplateTree, originalErrorMessage, originalPageHeaders, renderOriginalError
} from "../original-pages";
import { legacyCommandResponse } from "./command";
import { legacyGameUiPayload, renderLegacyGamePage } from "./game-render";
import { LegacyGameService } from "./game-service";
import type { LegacyAuthAssets } from "./http-auth";

async function gameSources(assets: LegacyAuthAssets, origin: string): Promise<Map<string, string>> {
  const fetchSource = async (path: string): Promise<string | undefined> => {
    const response = await assets.fetch(new Request(new URL(path, origin)));
    return response.status === 200 ? response.text() : undefined;
  };
  const sources = await loadTemplateTree("header", fetchSource);
  for (const [name, source] of await loadTemplateTree("footer", fetchSource)) sources.set(name, source);
  return sources;
}

function logout(secure: boolean): Response {
  const headers = originalPageHeaders();
  headers.set("location", "index.php");
  for (const name of ["user", "pass"]) {
    headers.append("set-cookie", `bra_${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secure ? "; Secure" : ""}${name === "pass" ? "; HttpOnly" : ""}`);
  }
  return new Response("", { status: 302, headers });
}

export async function handleLegacyGamePage(
  request: Request,
  service: LegacyGameService,
  assets: LegacyAuthAssets
): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (url.pathname !== "/game.php") return undefined;
  if (request.method === "POST") {
    const input = new URLSearchParams(await request.clone().text());
    if (input.get("mode") === "quit") return logout(url.protocol === "https:");
  } else if (request.method !== "GET" && request.method !== "HEAD") return undefined;
  const state = await service.state(request);
  if (!state.ok) {
    if (state.error === "no_login") {
      const sources = await loadTemplateTree("error", async path => {
        const response = await assets.fetch(new Request(new URL(path, url.origin)));
        return response.status === 200 ? response.text() : undefined;
      });
      const body = renderOriginalError(originalErrorMessage("no_login"), "game", sources);
      return new Response(request.method === "HEAD" ? null : body, {
        status: 200, headers: originalPageHeaders()
      });
    }
    const headers = originalPageHeaders();
    headers.set("location", state.status === 404 ? "valid.php" : "index.php");
    return new Response("", { status: 302, headers });
  }
  const sources = await gameSources(assets, url.origin);
  const html = renderLegacyGamePage(state.snapshot, state.username, state.match, sources);
  return new Response(request.method === "HEAD" ? null : html, { status: 200, headers: originalPageHeaders() });
}

export async function handleLegacyGameCommand(
  request: Request,
  service: LegacyGameService,
  now = Math.floor(Date.now() / 1000)
): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (url.pathname !== "/command.php" || request.method !== "POST") return undefined;
  const result = await service.execute(request, now);
  if (!result.ok) {
    return legacyCommandResponse({
      url: "error.php",
      errormsg: result.error === "no_login" ? "用户未登陆，请从首页登录后再进入游戏" : result.error
    });
  }
  return legacyCommandResponse(legacyGameUiPayload(result.snapshot, result.username, result.output));
}
