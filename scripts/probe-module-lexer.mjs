#!/usr/bin/env node
/**
 * Runs the existing tokenizer over every module file and reports what breaks.
 *
 * The tokenizer was written for compiled templates. Rather than guess which
 * parts of full module PHP it is missing, this points it at all 1,661 files
 * and collects the failures, so the gap list comes from the source instead of
 * from assumption.
 *
 * Usage: node scripts/probe-module-lexer.mjs ../legacy-dts
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { tokenize } from "../src/legacy/template/lexer.ts";

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
let ok = 0;
let tokens = 0;

for (const file of files) {
  const source = readFileSync(file, "utf8");
  try {
    tokens += tokenize(source).length;
    ok += 1;
  } catch (error) {
    // Group by message shape so one missing construct does not look like
    // hundreds of separate problems.
    const message = String(error.message).replace(/at \d+$/, "at <offset>");
    if (!failures.has(message)) failures.set(message, []);
    const sites = failures.get(message);
    if (sites.length < 8) sites.push(relative(root, file));
  }
}

console.log(`tokenized ${ok}/${files.length} module files, ${tokens} tokens`);
if (failures.size === 0) {
  console.log("no failures");
} else {
  console.log(`\n${failures.size} distinct failures:`);
  for (const [message, sites] of [...failures].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n  ${message}`);
    for (const site of sites) console.log(`    ${site}`);
  }
}
