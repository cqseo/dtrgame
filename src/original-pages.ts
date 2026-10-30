/**
 * Server-rendered pages of the original, ported one URL at a time.
 *
 * Each entry here renders byte-identically to the captured response in
 * test/fixtures/golden. A page is added only once that holds, so the route
 * ledger in test/original-routes-golden.test.mjs stays an honest count of
 * what actually works rather than of what has been attempted.
 */
import { LEGACY_CONFIG } from "./generated/legacy-config";
import { LEGACY_TEMPLATE_LANGUAGE } from "./generated/legacy-template-language";
import { compileTemplate } from "./legacy/template/compile";
import { createTemplateContext, renderTemplate } from "./legacy/template/render";
import type { PhpValue } from "./legacy/template/values";

/** Where the original keeps the active template pack. */
const TEMPLATE_DIR = "/templates/default";

export interface OriginalPage {
  /** Entry template, as the page's `include template(...)` names it. */
  readonly template: string;
  /** CURSCRIPT, which templates branch on. */
  readonly curscript: string;
  /**
   * True when the original only takes this path for a visitor who is not
   * signed in. login.php renders its form just for that case and otherwise
   * verifies credentials, which is not ported, so a request carrying any is
   * left to the unported branch instead of being answered with the form.
   */
  readonly signedOutOnly?: boolean;
}

/**
 * Pages whose whole body is one template render. The original's thinner
 * pages are exactly this; the ones that funnel through command.php are not
 * here yet.
 */
export const ORIGINAL_PAGES: Readonly<Record<string, OriginalPage>> = {
  "/donate.php": { template: "donate", curscript: "donate" },
  "/login.php": { template: "login_page", curscript: "login", signedOutOnly: true }
};

/** Mirrors login.php's `!isset($username) && empty($cuser)` guard. */
export function isSignedOutRequest(request: Request, url: URL): boolean {
  if (url.searchParams.has("username")) return false;
  const cookies = request.headers.get("cookie") ?? "";
  return !/(?:^|;\s*)[A-Za-z0-9_]*user=[^;]/.test(cookies);
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

/** The constants include/common.inc.php defines before a page renders. */
function pageConstants(page: OriginalPage): Map<string, PhpValue> {
  return new Map<string, PhpValue>([
    ["IN_GAME", true],
    ["GAMENAME", "bra"],
    ["CURSCRIPT", page.curscript],
    ["STYLEID", "1"],
    ["TEMPLATEID", "1"],
    ["TPLDIR", TEMPLATE_DIR.slice(1)]
  ]);
}

export function renderOriginalPage(page: OriginalPage, sources: ReadonlyMap<string, string>): string {
  return renderTemplate(page.template, {
    ...createTemplateContext({ loadTemplate: name => sources.get(name) }),
    variables: new Map(Object.entries(LEGACY_CONFIG) as [string, PhpValue][]),
    constants: pageConstants(page),
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
