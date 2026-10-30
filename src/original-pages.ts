/**
 * Server-rendered pages of the original, ported one URL at a time.
 *
 * Each entry renders byte-identically to the captured response in
 * test/fixtures/golden. A page is added only once that holds, so the route
 * ledger in test/original-routes-golden.test.mjs stays an honest count of
 * what works rather than of what has been attempted.
 */
import { LEGACY_CONFIG } from "./generated/legacy-config";
import { LEGACY_TEMPLATE_LANGUAGE } from "./generated/legacy-template-language";
import { createOriginalFunctions } from "./legacy/original-functions";
import { createLegacyModuleRuntime } from "./legacy/php/compiled-modules";
import { ModuleScope } from "./legacy/php/module-store";
import { compileTemplate } from "./legacy/template/compile";
import { createTemplateContext, renderTemplate } from "./legacy/template/render";
import { PhpArray, type PhpValue } from "./legacy/template/values";

/** Where the original keeps the active template pack. */
const TEMPLATE_DIR = "/templates/default";

/**
 * The globals gexit() imports before `include template('error')`.
 *
 * gexit renders inside a function, so the error template sees only these —
 * $gamecredits, for one, is absent, which is why the footer's credit block
 * comes out empty on an error page but filled on an ordinary one.
 */
const GEXIT_GLOBALS = ["charset", "gtitle", "extrahead", "allowcsscache", "errorinfo", "bbsurl", "homepage"];

export type OriginalPage =
  /** The page's whole body is one template render. */
  | { readonly kind: "template"; readonly template: string; readonly curscript: string }
  /** Signed out, the page calls gexit() with this $_ERROR key. */
  | { readonly kind: "error"; readonly errorKey: string; readonly curscript: string }
  /** Signed out, the page exits with a fixed string. */
  | { readonly kind: "literal"; readonly body: string };

export interface OriginalPageEntry {
  readonly page: OriginalPage;
  /**
   * The original only takes this path for a visitor who is not signed in.
   * The signed-in branches verify credentials and read player data, which is
   * not ported, so a request carrying any is left to the unported path
   * rather than answered with a page the original would not have returned.
   */
  readonly signedOutOnly?: boolean;
  /** The original only takes this path for a signed-in visitor. */
  readonly signedInOnly?: boolean;
  /** The original branches on query parameters this port does not handle. */
  readonly noQueryOnly?: boolean;
}

/**
 * Several paths answer differently depending on whether the visitor is
 * signed in, so a path maps to the branches the original takes and the first
 * whose conditions hold is used.
 */
export const ORIGINAL_PAGES: Readonly<Record<string, readonly OriginalPageEntry[]>> = {
  "/donate.php": [{ page: { kind: "template", template: "donate", curscript: "donate" } }],
  // map.php is three lines: define CURSCRIPT, require common.inc.php,
  // include template('map'). It checks nothing about the visitor, so the
  // same bytes go to everyone. Its template reaches into module code, which
  // the compiled module runtime now serves.
  "/map.php": [{ page: { kind: "template", template: "map", curscript: "map" } }],
  "/login.php": [{
    page: { kind: "template", template: "login_page", curscript: "login" },
    signedOutOnly: true
  }],
  "/game.php": [{
    page: { kind: "error", errorKey: "no_login", curscript: "game" },
    signedOutOnly: true,
    noQueryOnly: true
  }],
  // register.php refuses a visitor who already holds credentials, before it
  // builds its form; the signed-out branch is still unported.
  "/register.php": [{
    page: { kind: "error", errorKey: "logged_in", curscript: "register" },
    signedInOnly: true,
    noQueryOnly: true
  }],
  // cardbook.php and kujilist.php reach udata_check(), which gexit()s with
  // $_ERROR['no_login'] before any of their own content renders.
  "/cardbook.php": [{
    page: { kind: "error", errorKey: "no_login", curscript: "cardbook" },
    signedOutOnly: true,
    noQueryOnly: true
  }],
  "/kujilist.php": [{
    page: { kind: "error", errorKey: "no_login", curscript: "kujilist" },
    signedOutOnly: true,
    noQueryOnly: true
  }],
  // chat.php exits before loading anything when there is no signed-in user.
  "/chat.php": [{ page: { kind: "literal", body: "Not in game." }, signedOutOnly: true, noQueryOnly: true }]
};

/** Mirrors the `empty($cuser)` guard these pages share. */
export function isSignedOutRequest(request: Request): boolean {
  const cookies = request.headers.get("cookie") ?? "";
  return !/(?:^|;\s*)[A-Za-z0-9_]*user=[^;]/.test(cookies);
}

export function selectOriginalPage(
  pathname: string,
  url: URL,
  request: Request
): OriginalPage | undefined {
  const entries = ORIGINAL_PAGES[pathname];
  if (!entries) return undefined;
  const signedOut = isSignedOutRequest(request);
  for (const entry of entries) {
    if (entry.signedOutOnly && !signedOut) continue;
    if (entry.signedInOnly && signedOut) continue;
    if (entry.noQueryOnly && url.search !== "") continue;
    return entry.page;
  }
  return undefined;
}

/** Literal `include template('x')` names in compiled output. */
function templateDependencies(compiled: string): string[] {
  const names: string[] = [];
  for (const match of compiled.matchAll(/include template\('([^']+)'\)/g)) {
    const name = match[1];
    if (name !== undefined) names.push(name);
  }
  return names;
}

/**
 * Fetches a template and everything it includes.
 *
 * Rendering is synchronous, as PHP's include is, so the tree is resolved
 * first. A computed `{template $name}` cannot be resolved this way; none of
 * the pages ported so far use one, and an unresolved include raises during
 * rendering rather than rendering as nothing.
 */
export async function loadTemplateTree(
  entry: string,
  fetchSource: (path: string) => Promise<string | undefined>
): Promise<Map<string, string>> {
  const sources = new Map<string, string>();
  const pending = [entry];

  while (pending.length > 0) {
    const name = pending.pop() as string;
    if (sources.has(name)) continue;
    const source = await fetchSource(`${TEMPLATE_DIR}/${name}.htm`);
    if (source === undefined) continue;
    sources.set(name, source);
    const compiled = compileTemplate(source, { language: LEGACY_TEMPLATE_LANGUAGE });
    for (const dependency of templateDependencies(compiled)) {
      if (!sources.has(dependency)) pending.push(dependency);
    }
  }

  return sources;
}

/** The entry template a page needs fetched before it can render. */
export function entryTemplate(page: OriginalPage): string | undefined {
  if (page.kind === "template") return page.template;
  if (page.kind === "error") return "error";
  return undefined;
}

/** The constants include/common.inc.php defines before a page renders. */
function pageConstants(curscript: string): Map<string, PhpValue> {
  return new Map<string, PhpValue>([
    ["IN_GAME", true],
    ["GAMENAME", "bra"],
    ["CURSCRIPT", curscript],
    ["STYLEID", "1"],
    ["TEMPLATEID", "1"],
    ["TPLDIR", TEMPLATE_DIR.slice(1)]
  ]);
}

const configGlobals = (): Map<string, PhpValue> =>
  new Map(Object.entries(LEGACY_CONFIG) as [string, PhpValue][]);

export function originalErrorMessage(key: string): string {
  const errors = (LEGACY_CONFIG as Record<string, unknown>)._ERROR as Record<string, string> | undefined;
  return errors?.[key] ?? "";
}

export function renderOriginalPage(page: OriginalPage, sources: ReadonlyMap<string, string>): string {
  if (page.kind === "literal") return page.body;

  const globals = configGlobals();
  const loadTemplate = (name: string) => sources.get(name);
  const compileOptions = { language: LEGACY_TEMPLATE_LANGUAGE };

  if (page.kind === "template") {
    // A page template may call into module code -- map.htm calls
    // \map_display\get_map_display_config() -- so the renderer is given
    // the module runtime. It dispatches through the original's hook chains
    // and refuses, rather than guessing, when the implementation the
    // original would pick is not compiled yet.
    const runtime = createLegacyModuleRuntime({ constants: pageConstants(page.curscript) });

    // The page scope can take module imports: map_display.htm opens with
    // `eval(import_module('sys','map'))`, which aliases those modules'
    // variables into the template's own scope so it can read $plsinfo.
    const scope = new ModuleScope();
    for (const [name, value] of globals) scope.set(name, value);

    return renderTemplate(page.template, {
      ...createTemplateContext({ loadTemplate }),
      // The runtime's import_module and eval come last: original-functions
      // has placeholders that only check a module name, while these alias
      // the module's variables into this scope, which is what the template
      // is asking for.
      functions: new Map([...createOriginalFunctions(), ...runtime.hostFunctions(scope)]),
      variables: scope,
      globals: scope,
      constants: pageConstants(page.curscript),
      callQualified: (name, args) => runtime.call(name, args),
      hasQualified: name => runtime.has(name),
      referenceParameters: name => runtime.referenceParameters(name),
      compileOptions
    });
  }

  // gexit(): only the globals it imports are in scope, plus its own
  // arguments. $GLOBALS still reaches everything, which error.htm uses.
  const scope = new Map<string, PhpValue>();
  for (const name of GEXIT_GLOBALS) {
    if (globals.has(name)) scope.set(name, globals.get(name) ?? null);
  }
  scope.set("message", originalErrorMessage(page.errorKey));
  scope.set("file", "");
  scope.set("line", 0);

  return renderTemplate("error", {
    ...createTemplateContext({ loadTemplate }),
    functions: createOriginalFunctions(),
    variables: scope,
    globals,
    constants: pageConstants(page.curscript),
    compileOptions
  });
}

/** Render gexit() with a caller supplied message, preserving its function scope. */
export function renderOriginalError(
  message: string,
  curscript: string,
  sources: ReadonlyMap<string, string>
): string {
  const globals = configGlobals();
  const scope = new Map<string, PhpValue>();
  for (const name of GEXIT_GLOBALS) {
    if (globals.has(name)) scope.set(name, globals.get(name) ?? null);
  }
  scope.set("message", message);
  scope.set("file", "");
  scope.set("line", 0);
  return renderTemplate("error", {
    ...createTemplateContext({ loadTemplate: (name) => sources.get(name) }),
    functions: createOriginalFunctions(),
    variables: scope,
    globals,
    constants: pageConstants(curscript),
    compileOptions: { language: LEGACY_TEMPLATE_LANGUAGE }
  });
}

/** The response headers include/common.inc.php sends for every page. */
export function originalPageHeaders(): Headers {
  return new Headers({
    "content-type": "text/html; charset=UTF-8",
    "cache-control": "private, no-store, max-age=0",
    pragma: "no-cache",
    expires: "0"
  });
}

export { PhpArray };
