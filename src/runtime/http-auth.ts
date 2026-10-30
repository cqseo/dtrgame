import {
  legacyAuthenticateForm,
  legacyCookieHeaders,
  type LegacyLoginFailure
} from "../original-login";
import {
  loadTemplateTree,
  originalErrorMessage,
  originalPageHeaders,
  renderOriginalError
} from "../original-pages";
import { SupabaseLegacyAccounts } from "./supabase";

export interface LegacyAuthAssets {
  fetch(request: Request): Promise<Response>;
}

const COOKIE_PREFIX = "bra_";

async function errorSources(assets: LegacyAuthAssets, origin: string): Promise<Map<string, string>> {
  return loadTemplateTree("error", async path => {
    const response = await assets.fetch(new Request(new URL(path, origin)));
    return response.status === 200 ? response.text() : undefined;
  });
}

function redirect(location: string, cookies: readonly string[] = []): Response {
  const headers = originalPageHeaders();
  headers.set("location", location);
  for (const cookie of cookies) headers.append("set-cookie", cookie);
  return new Response("", { status: 302, headers });
}

function expiredCookie(name: string, secure: boolean): string {
  return `${COOKIE_PREFIX}${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secure ? "; Secure" : ""}${name === "pass" ? "; HttpOnly" : ""}`;
}

/** Exact login.php control flow, backed by the isolated legacy Supabase schema. */
export async function handleLegacyLogin(
  request: Request,
  accounts: SupabaseLegacyAccounts,
  assets: LegacyAuthAssets,
  nowMs = Date.now()
): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (url.pathname !== "/login.php") return undefined;
  const secure = url.protocol === "https:";

  if (url.searchParams.get("mode") === "quit") {
    return redirect("index.php", [expiredCookie("user", secure), expiredCookie("pass", secure)]);
  }
  if (request.method !== "POST") return undefined;

  const body = new URLSearchParams(await request.text());
  for (const [key, value] of url.searchParams) if (!body.has(key)) body.set(key, value);
  const result = await legacyAuthenticateForm(body, accounts);
  if (!result.ok) {
    const sources = await errorSources(assets, url.origin);
    return new Response(
      renderOriginalError(originalErrorMessage(result.error as LegacyLoginFailure), "login", sources),
      { status: 200, headers: originalPageHeaders() }
    );
  }

  const now = Math.floor(nowMs / 1000);
  await accounts.recordLastLogin(result.username, now);
  await accounts.setCurrentRoom(result.username, 0);
  const cookies = legacyCookieHeaders(result.username, result.cookiePassword, COOKIE_PREFIX, secure, nowMs);
  return redirect("index.php", [...cookies, `${COOKIE_PREFIX}roomid=0; Path=/${secure ? "; Secure" : ""}`]);
}
