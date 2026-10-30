#!/usr/bin/env node
/**
 * Runs the module parser over every module file and reports what breaks.
 *
 * The gap list comes from the source rather than from assumption: point the
 * parser at all 1,661 files, group the failures, and fix them in order of
 * how many files each one blocks.
 *
 * Usage: node scripts/probe-module-parser.mjs [../legacy-dts]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { collectDeclaredFunctions } from "../src/legacy/php/parser.ts";

const root = resolve(process.argv[2] ?? "../legacy-dts");
const modulesRoot = join(root, "include/modules");

function walk(directory) {
  const found = [];
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) found.push(...walk(path));
    else if (entry.endsWith(".php")) found.push(path);
  }
  return found;
}

const files = walk(modulesRoot).sort();
const failures = new Map();
let parsed = 0;
let functions = 0;

for (const file of files) {
  const source = readFileSync(file, "utf8");
  try {
    functions += collectDeclaredFunctions(source).length;
    parsed += 1;
  } catch (error) {
    // Group by message shape so one missing construct does not look like
    // hundreds of separate problems, and show the source at the first few
    // so the construct itself is visible.
    const raw = String(error.message);
    const offset = Number(/at (\d+)$/.exec(raw)?.[1] ?? -1);
    const message = raw.replace(/ at \d+$/, "");
    if (!failures.has(message)) failures.set(message, { count: 0, sites: [] });
    const entry = failures.get(message);
    entry.count += 1;
    if (entry.sites.length < 4 && offset >= 0) {
      const start = source.lastIndexOf("\n", Math.max(0, offset - 70)) + 1;
      const snippet = source.slice(start, offset + 30).replace(/\s+/g, " ").trim();
      const line = source.slice(0, offset).split("\n").length;
      entry.sites.push(`${relative(root, file)}:${line}  ${snippet}`);
    }
  }
}

console.log(`parsed ${parsed}/${files.length} module files, found ${functions} function declarations`);
if (failures.size === 0) {
  console.log("no failures");
} else {
  console.log(`\n${failures.size} distinct failures, worst first:`);
  for (const [message, entry] of [...failures].sort((a, b) => b[1].count - a[1].count)) {
    console.log(`\n  ${entry.count}x  ${message}`);
    for (const site of entry.sites) console.log(`        ${site}`);
  }
}
