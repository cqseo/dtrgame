#!/usr/bin/env node
/**
 * Inventories the template directives the original actually uses.
 *
 * The port needs an equivalent of include/template.func.php, the Discuz-derived
 * compiler that turns .htm templates into PHP. A Worker cannot evaluate PHP, so
 * the directives have to be compiled to JavaScript instead — and the only way
 * to size that honestly is to count what the templates really contain rather
 * than to build a general PHP interpreter speculatively.
 *
 * Usage: node scripts/audit-template-directives.mjs [legacyRoot]
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const legacyRoot = resolve(process.argv[2] ?? "../legacy-dts");

function templates(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...templates(full));
    else if (/\.html?$/i.test(entry.name)) out.push(full);
  }
  return out;
}

/** Mirrors parse_template's first rewrite: <!--{x}--> is the same as {x}. */
const unwrap = source => source.replace(/<!--\{(.+?)\}-->/gs, "{$1}");

const DIRECTIVE = /\{(\/?)(template_fixed|template|lang|eval|echo|elseif|else|loop|if)\b\s*([^}]*)\}/gis;

const counts = {};
const expressions = { eval: new Set(), condition: new Set(), loop: new Set() };
const files = templates(legacyRoot);

for (const file of files) {
  for (const [, closing, rawName, argument] of unwrap(readFileSync(file, "utf8")).matchAll(DIRECTIVE)) {
    const name = rawName.toLowerCase();
    const key = `${closing}${name}`;
    counts[key] = (counts[key] ?? 0) + 1;
    if (name === "eval") expressions.eval.add(argument.trim());
    else if (name === "if" || name === "elseif") expressions.condition.add(argument.trim());
    else if (name === "loop") expressions.loop.add(argument.trim());
  }
}

/** Separates what is mechanical to compile from what needs ported game code. */
function classify(expression) {
  if (/^\$\w+(\[[^\]]+\])*\s*=\s*[^=]/.test(expression)) return "assignment";
  if (/\\?\w+\s*\(/.test(expression)) return "calls module code";
  if (/\$\{/.test(expression)) return "variable variable";
  if (/^\$\w+(\[[^\]]+\])*$/.test(expression)) return "plain variable";
  if (/&&|\|\||\band\b|\bor\b/.test(expression)) return "boolean";
  if (/[=!<>]=|[<>]/.test(expression)) return "comparison";
  return "other";
}

const report = {};
for (const [group, set] of Object.entries(expressions)) {
  const byKind = {};
  for (const expression of set) {
    const kind = classify(expression);
    byKind[kind] = (byKind[kind] ?? 0) + 1;
  }
  report[group] = { distinct: set.size, byKind };
}

const moduleCalls = {};
for (const expression of [...expressions.eval, ...expressions.condition]) {
  for (const [, name] of expression.matchAll(/\b([a-zA-Z_]\w*)\s*\(/g)) {
    if (name === "if" || name === "echo" || name === "eval") continue;
    moduleCalls[name] = (moduleCalls[name] ?? 0) + 1;
  }
}

console.log(`templates: ${files.length}`);
console.log("\ndirective occurrences");
for (const [name, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`${String(n).padStart(6)}  ${name}`);
}
for (const [group, data] of Object.entries(report)) {
  console.log(`\n${group}: ${data.distinct} distinct`);
  for (const [kind, n] of Object.entries(data.byKind).sort((a, b) => b[1] - a[1])) {
    console.log(`${String(n).padStart(6)}  ${kind}`);
  }
}
console.log("\nmost-called original functions from templates");
for (const [name, n] of Object.entries(moduleCalls).sort((a, b) => b[1] - a[1]).slice(0, 15)) {
  console.log(`${String(n).padStart(6)}  ${name}`);
}
