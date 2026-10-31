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
import { createLegacyModuleRuntime } from "../legacy/php/compiled-modules";
import type { LegacyDatabase } from "../legacy/php/database";
import type { LegacyPageRequest } from "../legacy/php/runtime";

/** Reads the request's cookies as the original's $_COOKIE. */
function cookiesOf(request: Request): (readonly [string, string])[] {
  const header = request.headers.get("cookie") ?? "";
  const pairs: (readonly [string, string])[] = [];
  for (const part of header.split(";")) {
    const at = part.indexOf("=");
    if (at === -1) continue;
    const name = part.slice(0, at).trim();
    if (name === "") continue;
    pairs.push([name, decodeURIComponent(part.slice(at + 1).trim())]);
  }
  return pairs;
}

const entriesOf = (params: URLSearchParams): (readonly [string, string])[] =>
  [...params.entries()].map(([key, value]) => [key, value] as const);

export interface LegacyPageDependencies {
  readonly database: LegacyDatabase;
  /** Reads a template by the name the original's template() returns. */
  readonly loadTemplate: (name: string) => string | undefined;
  readonly tablePrefix: string;
  readonly roomId?: string;
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
    database: dependencies.database,
    loadTemplate: dependencies.loadTemplate,
    // The page defines CURSCRIPT itself, and a constant cannot be
    // redefined, so it must not be preset here.
    curscript: null
  });
  runtime.store.set("sys", "gtablepre", dependencies.tablePrefix);
  runtime.store.set("sys", "tablepre", dependencies.tablePrefix);
  runtime.store.set("sys", "room_id", dependencies.roomId ?? "0");
  runtime.store.set("sys", "now", String(Math.floor(Date.now() / 1000)));

  const pageRequest: LegacyPageRequest = {
    method: request.method,
    uri: url.pathname + url.search,
    post,
    get: entriesOf(url.searchParams),
    cookies: cookiesOf(request),
    remoteAddress: request.headers.get("cf-connecting-ip") ?? "",
    userAgent: request.headers.get("user-agent") ?? ""
  };

  return runtime.runPageScript(program, pageRequest).output;
}
