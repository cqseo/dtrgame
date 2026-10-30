#!/usr/bin/env node
/**
 * Writes docs/module-syntax-census.json: which PHP constructs the original's
 * modules actually use.
 *
 * This is the measurement behind the decision to compile the modules rather
 * than hand-port them. PHP's own tokenizer does the reading (see
 * scripts/php-module-syntax-reference.php), so the census cannot disagree
 * with the language about what is in the files.
 *
 * Usage: node scripts/audit-module-syntax.mjs [--check]
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const outputPath = resolve(repoRoot, "docs/module-syntax-census.json");

const phpBin = process.env.DTS_PHP_BIN ?? resolve(repoRoot, "tools/php-remote");
const referenceScript = resolve(repoRoot, "scripts/php-module-syntax-reference.php");
const sourceRoot = process.env.DTS_ORIGINAL_SOURCE ?? "/opt/dts-sandbox/parity/legacy-dts";

const stdout = execFileSync(phpBin, [referenceScript], {
  input: JSON.stringify({ root: sourceRoot }),
  maxBuffer: 64 * 1024 * 1024,
  encoding: "utf8"
});
const census = JSON.parse(stdout);
const serialized = `${JSON.stringify(census, null, 2)}\n`;

if (process.argv.includes("--check")) {
  if (readFileSync(outputPath, "utf8") !== serialized) {
    console.error("docs/module-syntax-census.json is stale; rerun npm run audit:module-syntax");
    process.exit(1);
  }
  console.log("module syntax census matches the original");
} else {
  writeFileSync(outputPath, serialized);
  const t = census.tokens;
  console.log(`wrote ${outputPath}`);
  console.log(
    `${census.files} files, ${census.functions} function declarations, ` +
      `${census.byRefParams} by-reference parameters, ` +
      `${t.T_CLASS ?? 0} classes, ${t.T_TRY ?? 0} try blocks, ${t.T_FN ?? 0} arrow functions`
  );
}
