import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createTemplateContext, renderTemplate, TemplateError } from "../src/legacy/template/render";

/**
 * Compares rendered output, not just compiled text.
 *
 * The compiler is already held to the original byte for byte; this covers the
 * other half, the evaluation of the PHP it emits — PHP's truthiness, its ==
 * rules, array ordering and the library functions the templates call.
 *
 * Templates that reach into module code cannot render until those hooks are
 * ported, so the suite measures how many render identically and ratchets that
 * number rather than pretending the rest pass.
 */
const php = process.env.DTS_PHP_BIN;
const root = process.env.DTS_TEMPLATE_ROOT ?? "/opt/dts-sandbox/parity/instance";
const packDir = process.env.DTS_LOCAL_TEMPLATES ?? "../legacy-dts/templates/default";

/** Raise only when more templates genuinely render identically. */
const RENDERING_IDENTICALLY = 64;

/**
 * PHP hashes the bytes it produced, so this hashes the same bytes. The
 * renderer returns a decoded string and the templates are UTF-8, so the
 * string is encoded back to UTF-8 before hashing; any other encoding would
 * disagree with PHP on every page containing Chinese text.
 */
const sha256 = text => createHash("sha256").update(Buffer.from(text, "utf8")).digest("hex");

const oracle = cases => {
  try {
    return JSON.parse(
      execFileSync(php, ["scripts/php-template-reference.php"], {
        input: JSON.stringify({ root, cases }),
        encoding: "utf8",
        maxBuffer: 256 * 1024 * 1024,
        timeout: 180000
      })
    );
  } catch (error) {
    throw new Error(`PHP template reference failed: ${error.stdout ?? ""}\n${error.stderr ?? ""}`);
  }
};

/** Mirrors what include/common.inc.php defines before a page renders. */
const baseConstants = () =>
  new Map([
    ["IN_GAME", true],
    ["GAME_ROOT", `${root}/`],
    ["GAMENAME", "bra"],
    ["CURSCRIPT", "index"],
    ["STYLEID", "1"],
    ["TEMPLATEID", "1"],
    ["TPLDIR", "./templates/default"]
  ]);

describe.skipIf(!php)("template rendering against the original", () => {
  let cachedLanguage;
  const languageMap = () => {
    if (!cachedLanguage) cachedLanguage = oracle([{ action: "language" }])[0].language ?? {};
    return cachedLanguage;
  };

  const names = readdirSync(packDir)
    .filter(file => file.endsWith(".htm"))
    .map(file => file.slice(0, -4))
    .sort();

  const loadTemplate = name => {
    const file = join(packDir, `${name}.htm`);
    return existsSync(file) ? readFileSync(file, "utf8") : undefined;
  };

  it("renders identically wherever the original itself renders", () => {
    // Digests rather than bodies. The whole pack rendered is 2.8MB and the
    // link to the PHP host runs at about 14KB/s, so pulling the bytes back
    // cannot finish inside any sensible timeout. Equality is all this needs,
    // and the few that differ are fetched in full below so the failure
    // message still shows the actual difference.
    const expected = oracle(names.map(template => ({ action: "render", template, vars: {}, digest: true })));

    const identical = [];
    const differing = [];
    const blockedOnModules = [];
    const originalFailed = [];

    names.forEach((name, index) => {
      const reference = expected[index];
      if (!reference.ok) {
        originalFailed.push(name);
        return;
      }
      let actual;
      try {
        actual = renderTemplate(name, {
          ...createTemplateContext({ loadTemplate }),
          constants: baseConstants(),
          compileOptions: { language: languageMap() }
        });
      } catch (error) {
        if (error instanceof TemplateError) blockedOnModules.push(`${name}: ${error.message}`);
        else blockedOnModules.push(`${name}: ${error.message}`);
        return;
      }
      if (sha256(actual) === reference.sha256) identical.push(name);
      else differing.push(name);
    });

    // Only now, and only for the ones that disagree, is it worth the bytes.
    if (differing.length > 0) {
      const bodies = oracle(differing.slice(0, 5).map(template => ({ action: "render", template, vars: {} })));
      differing.slice(0, 5).forEach((name, index) => {
        const theirs = bodies[index]?.output ?? "";
        const ours = renderTemplate(name, {
          ...createTemplateContext({ loadTemplate }),
          constants: baseConstants(),
          compileOptions: { language: languageMap() }
        });
        let at = 0;
        while (at < ours.length && at < theirs.length && ours[at] === theirs[at]) at += 1;
        console.log(
          `  ${name} first differs at byte ${at}:\n` +
            `    original: ${JSON.stringify(theirs.slice(at, at + 80))}\n` +
            `    port:     ${JSON.stringify(ours.slice(at, at + 80))}`
        );
      });
    }

    console.log(
      `template rendering: ${identical.length} identical, ${differing.length} differing, ` +
        `${blockedOnModules.length} blocked, ${originalFailed.length} the original cannot render standalone`
    );
    if (differing.length > 0) console.log(`  differing: ${differing.slice(0, 15).join(", ")}`);
    if (blockedOnModules.length > 0) {
      console.log(`  blocked:\n    ${blockedOnModules.slice(0, 10).join("\n    ")}`);
    }

    expect(identical.length).toBeGreaterThanOrEqual(RENDERING_IDENTICALLY);
    // A difference is a real defect; being blocked is unported module code.
    expect(differing).toEqual([]);
  });
});
