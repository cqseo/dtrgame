import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { compileTemplate } from "../src/legacy/template/compile";

/**
 * Holds the TypeScript template compiler to the output of the original's own
 * include/template.func.php.
 *
 * Comparing compiled text rather than rendered pages isolates the compiler
 * from the expression evaluator: a difference here is a rewrite that was
 * ported wrongly, not a value that evaluated differently.
 *
 * Run through `npm run test:php-parity`; ordinary unit runs skip it.
 */
const php = process.env.DTS_PHP_BIN;
const root = process.env.DTS_TEMPLATE_ROOT ?? "/opt/dts-sandbox/parity/instance";
const localTemplates = process.env.DTS_LOCAL_TEMPLATES ?? "../legacy-dts/templates/default";

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

/**
 * Templates live in two places and template() resolves them differently: a
 * bare name comes from the active pack, anything containing a slash is taken
 * as a path. Both branches are covered, since the module-owned templates are
 * the large majority.
 */
function allTemplates(localRoot, remoteRoot) {
  const found = [];
  const walk = (localDir, remoteDir) => {
    for (const entry of readdirSync(localDir, { withFileTypes: true })) {
      const localPath = join(localDir, entry.name);
      const remotePath = `${remoteDir}/${entry.name}`;
      if (entry.isDirectory()) walk(localPath, remotePath);
      else if (entry.name.endsWith(".htm")) {
        found.push({ local: localPath, reference: remotePath.slice(0, -4) });
      }
    }
  };
  walk(localRoot, remoteRoot);
  return found.sort((a, b) => a.reference.localeCompare(b.reference));
}

describe.skipIf(!php)("template compiler against the original compiler", () => {
  const names = readdirSync(localTemplates)
    .filter(file => file.endsWith(".htm"))
    .map(file => file.slice(0, -4))
    .sort();

  // Resolved lazily: a skipped describe still evaluates its body, so calling
  // the oracle here directly would reach for PHP during an ordinary run.
  let cachedLanguage;
  const languageMap = () => {
    if (!cachedLanguage) cachedLanguage = oracle([{ action: "language" }])[0].language ?? {};
    return cachedLanguage;
  };

  it("reads the same template pack the original does", () => {
    expect(names.length).toBeGreaterThan(0);
    expect(Object.keys(languageMap()).length).toBeGreaterThan(0);
  });

  it("compiles every template in templates/default to the same bytes", () => {
    const batchSize = 60;
    const mismatched = [];
    let compared = 0;

    for (let start = 0; start < names.length; start += batchSize) {
      const batch = names.slice(start, start + batchSize);
      const expected = oracle(batch.map(template => ({ action: "compile", template })));

      batch.forEach((name, index) => {
        const reference = expected[index];
        if (!reference.ok) {
          mismatched.push(`${name}: original compiler failed: ${reference.error}`);
          return;
        }
        const source = readFileSync(join(localTemplates, `${name}.htm`), "utf8");
        const actual = compileTemplate(source, { language: languageMap() });
        compared += 1;
        if (actual !== reference.compiled) mismatched.push(name);
      });
    }

    console.log(`template pack: ${compared - mismatched.length}/${compared} byte-identical`);
    if (mismatched.length > 0) {
      console.log(`  first differing: ${mismatched.slice(0, 20).join(", ")}`);
    }
    expect(mismatched).toEqual([]);
  });

  it("compiles every module-owned template to the same bytes", () => {
    const modulesLocal = process.env.DTS_LOCAL_MODULES ?? "../legacy-dts/include/modules";
    const templates = allTemplates(modulesLocal, `${root}/include/modules`);
    const batchSize = 60;
    const mismatched = [];
    let compared = 0;

    for (let start = 0; start < templates.length; start += batchSize) {
      const batch = templates.slice(start, start + batchSize);
      const expected = oracle(batch.map(entry => ({ action: "compile", template: entry.reference })));

      batch.forEach((entry, index) => {
        const reference = expected[index];
        if (!reference.ok) {
          mismatched.push(`${entry.reference}: ${reference.error}`);
          return;
        }
        const actual = compileTemplate(readFileSync(entry.local, "utf8"), { language: languageMap() });
        compared += 1;
        if (actual !== reference.compiled) mismatched.push(entry.reference);
      });
    }

    console.log(`module templates: ${compared - mismatched.length}/${compared} byte-identical`);
    if (mismatched.length > 0) {
      console.log(`  first differing:\n    ${mismatched.slice(0, 15).join("\n    ")}`);
    }
    expect(mismatched).toEqual([]);
  });
});
