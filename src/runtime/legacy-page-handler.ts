/**
 * Serves the original's pages by running the original's page scripts.
 *
 * Every route that used to answer 501 is one of these: index.php,
 * register.php, help.php and the rest are the original's own top-level
 * scripts, compiled to ASTs at build time and executed here. Nothing
 * about a page is reimplemented, so what it prints is what its own code
 * prints.
 *
 * Four of them are one line -- `echo render_page('command_help')` --
 * which the runtime answers by running command.php in process. See
 * runtime.ts for why that replaces the original's HTTP call to itself.
 */
import { LEGACY_PAGE_SCRIPTS } from "../generated/legacy-page-scripts";
import { LEGACY_TEMPLATES } from "../generated/legacy-templates";
import { createLegacyModuleRuntime } from "../legacy/php/compiled-modules";
import type { LegacyDatabase } from "../legacy/php/database";
import type { LegacyPageRequest } from "../legacy/php/runtime";
import { LegacyHttpResponse } from "./legacy-http-response";

/** Reads the request's cookies as the original's $_COOKIE. */
function cookiesOf(request: Request): (readonly [string, string])[] {
  const header = request.headers.get("cookie") ?? "";
  const pairs: (readonly [string, string])[] = [];
  for (const part of header.split(";")) {
    const at = part.indexOf("=");
    if (at === -1) continue;
    const name = part.slice(0, at).trim();
    if (name === "") continue;
    const value = part.slice(at + 1).trim().replace(/\+/g, " ");
    try { pairs.push([name, decodeURIComponent(value)]); }
    catch { pairs.push([name, value]); }
  }
  return pairs;
}

const entriesOf = (params: URLSearchParams): (readonly [string, string])[] =>
  [...params.entries()].map(([key, value]) => [key, value] as const);

export interface LegacyPageDependencies {
  readonly database: LegacyDatabase;
  /**
   * Reads a template by the name the original's template() returns.
   * Defaults to the compiled-in set, which is every captured template.
   */
  readonly loadTemplate?: ((name: string) => string | undefined) | undefined;
  readonly tablePrefix: string;
  readonly roomId?: string;
  readonly response?: LegacyHttpResponse;
}

/** Tables touched by the original bootstrap and each gameplay page. */
export function legacyPageTables(pathname: string): readonly import("./supabase-legacy-database").LegacyDatabaseTable[] {
  const bootstrap = ["game", "users", "messages"] as const;
  if (pathname === "/valid.php") return [...bootstrap, "players"];
  if (pathname === "/game.php" || pathname === "/command.php") {
    return [...bootstrap, "chat", "log", "mapitem", "maptrap", "newsinfo", "players", "shopitem"];
  }
  return bootstrap;
}

/** Whether a path is one of the original's compiled page scripts. */
export function hasLegacyPage(pathname: string): boolean {
  return LEGACY_PAGE_SCRIPTS[pathname] !== undefined;
}

/**
 * Runs the page for this request and returns what it printed.
 *
 * Returns undefined when the path is not one of the original's pages,
 * so the caller can fall through to the asset bundle rather than
 * inventing a response.
 */
export async function runLegacyPage(
  pathname: string,
  request: Request,
  dependencies: LegacyPageDependencies
): Promise<string | undefined> {
  const program = LEGACY_PAGE_SCRIPTS[pathname];
  if (!program) return undefined;

  const url = new URL(request.url);
  let post: (readonly [string, string])[] = [];
  if (request.method === "POST") {
    const body = await request.clone().text();
    post = entriesOf(new URLSearchParams(body));
  }

  // One runtime per request: module variables are mutable, so sharing
  // one between requests would leak a player's state into another's.
  const runtime = createLegacyModuleRuntime({
    functions: dependencies.response?.functions() ?? new Map(),
    database: dependencies.database,
    loadTemplate: dependencies.loadTemplate ??
      ((name: string) => LEGACY_TEMPLATES[name] ?? LEGACY_TEMPLATES[name.replace(/^.*\/(?=templates\/)/, "./")]),
    // The page defines CURSCRIPT itself, and a constant cannot be
    // redefined, so it must not be preset here.
    curscript: null
  });
  const numericRoomId = Number.parseInt(dependencies.roomId ?? "0", 10);
  const roomId = Number.isSafeInteger(numericRoomId) && numericRoomId >= 0 && numericRoomId <= 12
    ? numericRoomId
    : 0;
  const roomPrefix = roomId > 0 ? `s${roomId}` : "";
  runtime.store.set("sys", "gtablepre", dependencies.tablePrefix);
  runtime.store.set("sys", "tablepre", roomId > 0 ? `${dependencies.tablePrefix}${roomPrefix}_` : dependencies.tablePrefix);
  runtime.store.set("sys", "ctablepre", roomId > 0 ? `${dependencies.tablePrefix}${roomPrefix}_` : dependencies.tablePrefix);
  runtime.store.set("sys", "wtablepre", roomId > 0 ? `${dependencies.tablePrefix}s` : dependencies.tablePrefix);
  runtime.store.set("sys", "room_id", String(roomId));
  runtime.store.set("sys", "room_prefix", roomPrefix);
  runtime.store.set("sys", "now", String(Math.floor(Date.now() / 1000)));

  const pageRequest: LegacyPageRequest = {
    method: request.method,
    uri: url.pathname + url.search,
    post,
    get: entriesOf(url.searchParams),
    cookies: cookiesOf(request),
    remoteAddress: request.headers.get("cf-connecting-ip") ?? "",
    userAgent: request.headers.get("user-agent") ?? "",
    serverPort: url.port || (url.protocol === "https:" ? "443" : "80")
  };

  return runtime.runPageScript(program, pageRequest).output;
}

/** Preserves redirects, status and multiple cookies, as well as the body. */
export async function runLegacyPageResponse(
  pathname: string, request: Request, dependencies: LegacyPageDependencies
): Promise<Response | undefined> {
  const response = new LegacyHttpResponse();
  const body = await runLegacyPage(pathname, request, { ...dependencies, response });
  if (body === undefined) return undefined;
  return new Response(request.method === "HEAD" || [204, 205, 304].includes(response.status) ? null : body, {
    status: response.status, headers: response.headers
  });
}
