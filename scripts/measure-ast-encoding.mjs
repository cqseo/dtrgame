#!/usr/bin/env node
/**
 * Measures what the original's compiled ASTs would cost in a Worker.
 *
 * Compiled modules ship as checked-in ASTs so the Worker never generates
 * code at run time, and a Worker script has a hard size limit. One player
 * action dispatches through about 118 modules, so the cost of an AST
 * decides whether the game tick can ship at all.
 *
 * This parses the original's module tree directly rather than extrapolating
 * from the handful of modules generated so far, because they vary by more
 * than an order of magnitude: map_display is 12KB of AST and sys is 555KB.
 *
 * Usage: node scripts/measure-ast-encoding.mjs [../legacy-dts]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import { compilePhpModuleFile } from "../src/legacy/module-compiler.ts";
import { LEGACY_HOOK_CHAINS } from "../src/generated/legacy-hook-manifest.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(process.argv[2] ?? join(repoRoot, "../legacy-dts"));
const modulesRoot = join(sourceRoot, "include/modules");

function walk(directory) {
  const found = [];
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) found.push(...walk(path));
    else if (entry.endsWith(".php")) found.push(path);
  }
  return found;
}

/** Every compiled function of the original, grouped by the module it belongs to. */
const byModule = new Map();
let unparsed = 0;
for (const file of walk(modulesRoot)) {
  let functions;
  try {
    functions = compilePhpModuleFile(readFileSync(file, "utf8"));
  } catch {
    unparsed += 1;
    continue;
  }
  for (const fn of functions) {
    const existing = byModule.get(fn.namespace) ?? {};
    existing[fn.name] = fn;
    byModule.set(fn.namespace, existing);
  }
}

const gzip = text => gzipSync(Buffer.from(text), { level: 9 }).length;
const brotli = text =>
  brotliCompressSync(Buffer.from(text), {
    params: { [constants.BROTLI_PARAM_QUALITY]: 11 }
  }).length;

/**
 * The modules one player action dispatches through.
 *
 * Taken from the hook manifest rather than guessed: a hook is
 * all-or-nothing, because dispatch enters at the newest implementation and
 * walks back through $chprocess, so every module on a chain is needed.
 */
const TICK_HOOKS = [
  "routine", "load_gameinfo", "save_gameinfo", "process_lock", "process_unlock",
  "updategame", "pre_act", "act", "post_act"
];
const tickModules = new Set();
for (const hook of TICK_HOOKS) {
  for (const entry of LEGACY_HOOK_CHAINS[hook] ?? []) tickModules.add(entry.module);
}

function report(label, modules) {
  const present = modules.filter(name => byModule.has(name));
  const json = JSON.stringify(
    Object.fromEntries(present.map(name => [name, byModule.get(name)]))
  );
  const functions = present.reduce(
    (total, name) => total + Object.keys(byModule.get(name)).length,
    0
  );
  console.log(
    label.padEnd(34) +
      String(present.length).padStart(5) +
      String(functions).padStart(8) +
      `${(json.length / 1024 / 1024).toFixed(2)} MB`.padStart(11) +
      `${(gzip(json) / 1024).toFixed(0)} KB`.padStart(10) +
      `${(brotli(json) / 1024).toFixed(0)} KB`.padStart(10)
  );
}

console.log(
  `Parsed ${byModule.size} modules from ${sourceRoot}` +
    (unparsed ? `, ${unparsed} files unparsed` : "") +
    "\n"
);
console.log(
  "set".padEnd(34) +
    "mods".padStart(5) +
    "funcs".padStart(8) +
    "raw JSON".padStart(11) +
    "gzip".padStart(10) +
    "brotli".padStart(10)
);

report("the game tick (one action)", [...tickModules]);
report("everything enabled", [...byModule.keys()]);

console.log(
  "\nThis is compact JSON. The generated files are pretty-printed, which " +
    "roughly doubles\nthe gzipped size for no change in what is represented."
);
