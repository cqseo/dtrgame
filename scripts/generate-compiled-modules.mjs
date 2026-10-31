#!/usr/bin/env node
/**
 * Generates src/generated/legacy-compiled-<module>.ts from the original.
 *
 * The previous file of this name was hand-written TypeScript that spelled
 * out the AST node by node under a "generated, do not hand edit" banner. A
 * hand transcription of the original's logic is exactly what the contract
 * forbids, and nothing would have caught it drifting. This parses the real
 * module file instead.
 *
 * The output is checked in so the build and the Worker never need the PHP
 * source tree, and `--check` proves it still matches.
 *
 * Usage:
 *   node scripts/generate-compiled-modules.mjs [--check] [../legacy-dts]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compilePhpModuleFile } from "../src/legacy/module-compiler.ts";
import { ENTRY_POINTS, closureFrom, readModuleTree } from "./lib/module-closure.mjs";
import { LEGACY_MODULES } from "../src/generated/legacy-registry.ts";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const check = process.argv.includes("--check");
const sourceRoot = resolve(
  process.argv.find(argument => !argument.startsWith("-") && argument.includes("legacy-dts")) ??
    process.env.DTS_LEGACY_ROOT ??
    join(repoRoot, "../legacy-dts")
);

/**
 * What to compile: the closure of a list of entry points.
 *
 * Entry points rather than a list of modules. Listing modules is how
 * map_display went missing the moment the list was replaced by the tick's
 * closure, because map.php does not run inside a tick. Naming what has to
 * work and deriving the rest cannot drift that way.
 *
 * DTS_MODULES overrides it with an explicit comma-separated list, for
 * trying one module without regenerating hundreds.
 */
/**
 * Include files whose global functions the port needs.
 *
 * These are not modules: they declare functions in the global namespace
 * that module code calls. Compiling them means the original's own code
 * runs rather than a hand-written approximation.
 *
 * template.func.php is deliberately absent. It holds parse_template, which
 * is already ported by hand in src/legacy/template/compile.ts and held to
 * the original byte for byte on all 845 templates, and it is the one file
 * here that uses an anonymous closure, which the parser does not support.
 */
const GLOBAL_FILES = [
  "include/user.func.php",
  "include/roommng/room.func.php"
];

const tree = readModuleTree(sourceRoot);

/**
 * Every module, not a closure over the entry points.
 *
 * The closure existed because a Worker script had a hard compressed size
 * limit and the whole original looked too big for it. Cloudflare removed
 * that limit on 2026-09-04: the cap is now 64 MiB uncompressed on every
 * plan, free included, and all 6,081 functions come to 11.3 MB of AST.
 * There is no longer anything to buy by shipping less than all of it.
 *
 * Shipping all of it also removes a whole class of bug rather than
 * trading one for another. Dispatch enters a hook chain at its newest
 * implementation and walks back; with a partial set, any chain reaching
 * an uncompiled module raises LegacyFunctionNotCompiled, and whether a
 * given player action hits one depends on the room state that produced
 * it. A closure is therefore only ever as correct as its entry list, and
 * the entry list cannot be proven complete. Compiling the lot makes the
 * question moot.
 *
 * DTS_MODULES still narrows the set, which keeps the edit-run loop short
 * when working on one module.
 */
/**
 * The files the loader actually enables.
 *
 * "Every module" means every module the original loads, which is not the
 * same as every file under include/modules. The tree also holds
 * scaffolding for module authors to copy -- two such files both declare
 * namespace `skill编号` -- and nothing stops a disabled module from
 * colliding with a live one, because PHP never loads the two together.
 * The registry is the loader's own list, so it is the authority.
 */
const enabledFiles = new Set(
  LEGACY_MODULES.filter(module => module.enabled).flatMap(module =>
    module.codeFiles.map(file => `include/modules/${module.path}${file}`)
  )
);

function enabledNamespaces() {
  const namespaces = [];
  for (const [namespace, files] of tree.declaringFiles) {
    if (files.some(file => enabledFiles.has(file.relative))) namespaces.push(namespace);
  }
  return namespaces.sort();
}

const MODULES = process.env.DTS_MODULES
  ? process.env.DTS_MODULES === "closure"
    ? closureFrom(ENTRY_POINTS, tree).modules
    : process.env.DTS_MODULES.split(",").map(name => name.trim()).filter(Boolean)
  : enabledNamespaces();

/** Renders a value as a TypeScript literal, preserving undefined-vs-null. */
/**
 * Renders a value as a TypeScript literal.
 *
 * Deliberately not pretty-printed. These files are generated, never read
 * as prose and never hand-edited, and the indentation is most of their
 * size: it roughly doubles both the checked-in bytes and what the Worker
 * has to carry. A value of undefined is dropped rather than emitted,
 * because `undefined` and an absent key are not the same to the runtime.
 */
function render(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return `[${value.map(render).join(",")}]`;
  if (typeof value === "object") {
    const entries = Object.entries(value).filter(([, item]) => item !== undefined);
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${render(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

const declaringFiles = tree.declaringFiles;

function generate(module) {
  // A module is often more than one file: sys alone declares its 40
  // functions across gamectl.php, global.php, init.php and news.php, and
  // the loader includes them all under the one namespace.
  const declared = declaringFiles.get(module) ?? [];
  const sources = declared.map(entry => entry.relative);
  const functions = declared.flatMap(entry => entry.functions);
  if (functions.length === 0) {
    throw new Error(
      `No module declares the namespace ${module}. Check the name against ` +
        "scripts/audit-tick-closure.mjs."
    );
  }

  const seen = new Set();
  for (const fn of functions) {
    if (seen.has(fn.name)) {
      throw new Error(
        `${module}\\${fn.name} is declared twice across ${sources.join(", ")}; ` +
          "the file list is wrong, because PHP would not allow that."
      );
    }
    seen.add(fn.name);
  }

  const constant = `LEGACY_COMPILED_${module.toUpperCase()}`;
  const lines = [
    `// GENERATED by scripts/generate-compiled-modules.mjs from`,
    ...sources.map(path => `//   ${path}`),
    "// Do not edit by hand: this is the original's own code, parsed, and a hand",
    "// edit here is a behaviour change the contract forbids. Regenerate with",
    "// `npm run generate:compiled-modules`.",
    "//",
    `// ${functions.length} functions.`,
    "",
    'import type { CompiledPhpFunction } from "../legacy/module-compiler";',
    "",
    `export const ${constant}: Record<string, CompiledPhpFunction> = {`
  ];

  for (const fn of functions) {
    lines.push(`  ${JSON.stringify(fn.name)}: ${render(fn)},`);
  }
  lines.push("};", "");
  return { path: resolve(repoRoot, `src/generated/legacy-compiled-${module}.ts`), text: lines.join("\n") };
}

/**
 * The barrel the runtime loads.
 *
 * Generated as well, because the list runs to hundreds of modules and
 * hand-maintaining that many imports is how one quietly goes missing.
 */
function barrel(modules) {
  const constant = name => `LEGACY_COMPILED_${name.toUpperCase()}`;
  return [
    "// GENERATED by scripts/generate-compiled-modules.mjs. Do not edit by hand.",
    "//",
    `// The ${modules.length} modules compiled from the original's own source.`,
    "",
    ...modules.map(name => `import { ${constant(name)} } from "./legacy-compiled-${name}";`),
    'import type { CompiledPhpFunction } from "../legacy/module-compiler";',
    "",
    "export const COMPILED_MODULE_TABLES: readonly Readonly<Record<string, CompiledPhpFunction>>[] = [",
    ...modules.map(name => `  ${constant(name)},`),
    "];",
    "",
    "export const COMPILED_MODULE_NAMES: readonly string[] = [",
    ...modules.map(name => `  ${JSON.stringify(name)},`),
    "];",
    ""
  ].join("\n");
}

let failed = false;
const written = [];
for (const entry of MODULES) {
  const { path, text } = generate(entry);
  written.push(entry);
  if (check) {
    if (readFileSync(path, "utf8") !== text) {
      console.error(`${path} does not match the original; run npm run generate:compiled-modules`);
      failed = true;
    }
  } else {
    writeFileSync(path, text);
  }
}

/** The global-namespace functions, keyed by their bare name. */
function generateGlobals() {
  const functions = [];
  for (const relative of GLOBAL_FILES) {
    const compiled = compilePhpModuleFile(readFileSync(join(sourceRoot, relative), "utf8"));
    for (const fn of compiled) if (fn.namespace === "") functions.push(fn);
  }
  const lines = [
    "// GENERATED by scripts/generate-compiled-modules.mjs from",
    ...GLOBAL_FILES.map(path => `//   ${path}`),
    "// Do not edit by hand.",
    "//",
    `// ${functions.length} global functions.`,
    "",
    'import type { CompiledPhpFunction } from "../legacy/module-compiler";',
    "",
    "export const LEGACY_COMPILED_GLOBALS: Record<string, CompiledPhpFunction> = {"
  ];
  for (const fn of functions) lines.push(`  ${JSON.stringify(fn.name)}: ${render(fn)},`);
  lines.push("};", "");
  return { path: resolve(repoRoot, "src/generated/legacy-compiled-globals.ts"), text: lines.join("\n") };
}

const globals = generateGlobals();
if (check) {
  if (readFileSync(globals.path, "utf8") !== globals.text) {
    console.error(`${globals.path} is stale; run npm run generate:compiled-modules`);
    failed = true;
  }
} else {
  writeFileSync(globals.path, globals.text);
}

const barrelPath = resolve(repoRoot, "src/generated/legacy-compiled-index.ts");
const barrelText = barrel([...written].sort());
if (check) {
  if (readFileSync(barrelPath, "utf8") !== barrelText) {
    console.error(`${barrelPath} is stale; run npm run generate:compiled-modules`);
    failed = true;
  }
} else {
  writeFileSync(barrelPath, barrelText);
  console.log(`wrote ${written.length} modules and the barrel`);
}

if (check && !failed) console.log("compiled modules match the original");
if (failed) process.exit(1);
