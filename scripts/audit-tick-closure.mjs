#!/usr/bin/env node
/**
 * Works out which modules a given entry point actually needs.
 *
 * Adding modules one at a time and rerunning until the runtime stops
 * complaining does converge, but it takes as many rounds as there are
 * modules. This walks the call graph instead and answers in one pass.
 *
 * The rule that matters: a hook is all-or-nothing. Dispatch enters at the
 * newest implementation and walks back through $chprocess, so every
 * implementation on a chain is needed, not just the one that was called.
 *
 * Usage: node scripts/audit-tick-closure.mjs [entry] [../legacy-dts]
 *   entry defaults to sys\routine
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compilePhpModuleFile } from "../src/legacy/module-compiler.ts";
import { LEGACY_HOOK_CHAINS } from "../src/generated/legacy-hook-manifest.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const entry = (process.argv[2] ?? "sys\\routine").toLowerCase();
const sourceRoot = resolve(process.argv[3] ?? join(repoRoot, "../legacy-dts"));

function walk(directory) {
  const found = [];
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) found.push(...walk(path));
    else if (name.endsWith(".php")) found.push(path);
  }
  return found;
}

/** Every compiled function, keyed `module\name`. */
const functions = new Map();
for (const file of walk(join(sourceRoot, "include/modules"))) {
  let compiled;
  try {
    compiled = compilePhpModuleFile(readFileSync(file, "utf8"));
  } catch {
    continue;
  }
  for (const fn of compiled) {
    functions.set(`${fn.namespace.toLowerCase()}\\${fn.name.toLowerCase()}`, fn);
  }
}

/** Every call this function's body makes, as written. */
function callsIn(node, found = new Set()) {
  if (node === null || typeof node !== "object") return found;
  if (Array.isArray(node)) {
    for (const item of node) callsIn(item, found);
    return found;
  }
  if (node.kind === "call" && typeof node.callee === "string") found.add(node.callee);
  for (const value of Object.values(node)) callsIn(value, found);
  return found;
}

const chainOf = name => LEGACY_HOOK_CHAINS[name.toLowerCase()] ?? null;

/**
 * Resolves a name the way the runtime does: written namespace if it has
 * one, otherwise the calling module, otherwise global.
 */
function resolve_(written, namespace) {
  const bare = written.replace(/^\\+/, "").toLowerCase();
  if (bare.includes("\\")) return bare;
  if (functions.has(`${namespace}\\${bare}`)) return `${namespace}\\${bare}`;
  return bare;
}

const needed = new Set();
const unresolved = new Set();
const seen = new Set();
const queue = [entry];

while (queue.length > 0) {
  const current = queue.pop();
  if (seen.has(current)) continue;
  seen.add(current);

  const [module, bare] = [current.slice(0, current.indexOf("\\")), current.slice(current.indexOf("\\") + 1)];
  // A hook is all-or-nothing: every implementation on the chain is needed.
  const chain = chainOf(bare);
  const implementations = chain
    ? chain.map(e => `${e.module.toLowerCase()}\\${bare}`)
    : [current];

  for (const implementation of implementations) {
    const fn = functions.get(implementation);
    if (!fn) continue;
    needed.add(implementation.slice(0, implementation.indexOf("\\")));
    if (seen.has(implementation) && implementation !== current) continue;
    seen.add(implementation);

    for (const call of callsIn(fn.program)) {
      const target = resolve_(call, fn.namespace.toLowerCase());
      if (functions.has(target) || chainOf(target.replace(/^.*\\/, ""))) queue.push(target);
      else if (!target.includes("\\")) unresolved.add(target);
    }
  }
  if (!chain && !functions.has(current)) unresolved.add(current);
}

const sorted = [...needed].sort();
console.log(`entry: ${entry}\n`);
console.log(`modules needed: ${sorted.length}`);
console.log(sorted.join(", "));
console.log(`\nglobals the host must provide: ${unresolved.size}`);
console.log([...unresolved].sort().join(", "));
