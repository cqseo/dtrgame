import { legacyAuthenticateCookies, legacyReadCookiePair } from "../original-login";
import { loadTemplateTree, originalPageHeaders } from "../original-pages";
import { renderLegacyIndex } from "./index-render";
import type { SupabaseLegacyAccounts, SupabaseLegacyIndex } from "./supabase";

export interface LegacyIndexAssets {
  fetch(request: Request): Promise<Response>;
}

async function loadSources(assets: LegacyIndexAssets, origin: string): Promise<Map<string, string>> {
  const fetchSource = async (path: string): Promise<string | undefined> => {
    const response = await assets.fetch(new Request(new URL(path, origin)));
    return response.status === 200 ? response.text() : undefined;
  };
  const sources = await loadTemplateTree("index", fetchSource);
  for (const entry of ["bubblebox_start", "bubblebox_end"] as const) {
    const extra = await loadTemplateTree(entry, fetchSource);
    for (const [name, source] of extra) sources.set(name, source);
  }
  return sources;
}

/** Original index.php backed by the live compatibility schema. */
export async function handleLegacyIndex(
  request: Request,
  accounts: SupabaseLegacyAccounts,
  index: SupabaseLegacyIndex,
  assets: LegacyIndexAssets,
  nowMs = Date.now()
): Promise<Response | undefined> {
  const url = new URL(request.url);
  if ((url.pathname !== "/" && url.pathname !== "/index.php") ||
      (request.method !== "GET" && request.method !== "HEAD")) return undefined;
  const cookies = request.headers.get("cookie") ?? "";
  const pair = legacyReadCookiePair(cookies, "bra_");
  const account = await legacyAuthenticateCookies(cookies, accounts, "bra_");
  const [state, sources] = await Promise.all([
    index.load(),
    loadSources(assets, url.origin)
  ]);
  const html = await renderLegacyIndex(account, account ? pair.cookiePassword ?? "" : "", state, sources, Math.floor(nowMs / 1000));
  return new Response(request.method === "HEAD" ? null : html, { status: 200, headers: originalPageHeaders() });
}
