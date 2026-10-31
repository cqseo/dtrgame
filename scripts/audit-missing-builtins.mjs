#!/usr/bin/env node
/**
 * Which PHP library functions the original calls that the port has not got.
 *
 * Adding them one at a time, as each probe run reports the next, is slow
 * and gives no sense of how much is left. This walks every AST the port
 * will execute -- the page scripts, the global function libraries and
 * all 735 modules -- collects every called name, and subtracts the ones
 * that are compiled in or registered as builtins.
 *
 * What remains is the real list, with a count of how often each is
 * called, so the common ones can be done first.
 *
 * Usage: node scripts/audit-missing-builtins.mjs [--page-scripts-only]
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseModuleFile } from "../src/legacy/php/parser.ts";
import { compilePhpModuleFile } from "../src/legacy/module-compiler.ts";
import { walkModuleFiles } from "./lib/module-closure.mjs";
import { PHP_BUILTINS } from "../src/legacy/template/builtins.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(repoRoot, process.env.DTS_LEGACY_ROOT ?? "../legacy-dts");

/** Names the runtime binds itself, which no builtin table will show. */
const HOST_PROVIDED = new Set([
  "eval", "import_module", "get_var_in_module", "gdecode", "gencode",
  "__MODULE_NULLFUNCTION__", "func_get_args", "func_num_args",
  "define", "defined", "constant", "__dts_common_inc__",
  "check_lock", "create_lock", "release_lock",
  "writeover", "openfile", "gdir", "touch", "unlink", "filemtime", "file_exists",
  "template", "parse_template"
]);

/** Every function name called anywhere in a program. */
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

const declared = new Set();
const called = new Map();

const record = (program, where) => {
  for (const name of callsIn(program)) {
    const bare = name.replace(/^\\+/, "");
    if (!called.has(bare)) called.set(bare, { count: 0, where: new Set() });
    const entry = called.get(bare);
    entry.count += 1;
    if (entry.where.size < 3) entry.where.add(where);
  }
};

// The page scripts.
const pages = readdirSync(sourceRoot).filter(name => name.endsWith(".php")).sort();
for (const name of pages) {
  record(parseModuleFile(readFileSync(join(sourceRoot, name), "utf8")), name);
}

const pagesOnly = process.argv.includes("--page-scripts-only");

// The function libraries and the modules, which the pages reach through.
const libraries = [
  "include/global.func.php", "include/user.func.php", "include/messages.func.php",
  "include/itemplace.func.php", "include/bubblebox.func.php", "include/valid.func.php",
  "include/socket.func.php", "include/modules/modules.func.php",
  "include/roommng/room.func.php", "include/roommng/roommng.func.php"
];
for (const relative of libraries) {
  const compiled = compilePhpModuleFile(readFileSync(join(sourceRoot, relative), "utf8"));
  for (const fn of compiled) {
    declared.add(fn.name.toLowerCase());
    if (!pagesOnly) record(fn.program, relative);
  }
}
if (!pagesOnly) {
  for (const path of walkModuleFiles(sourceRoot)) {
    let compiled;
    try {
      compiled = compilePhpModuleFile(readFileSync(path, "utf8"));
    } catch {
      continue;
    }
    for (const fn of compiled) {
      declared.add(fn.name.toLowerCase());
      declared.add(`${fn.namespace.toLowerCase()}\\${fn.name.toLowerCase()}`);
      record(fn.program, path.slice(sourceRoot.length + 1));
    }
  }
}

const have = new Set([
  ...Object.keys(PHP_BUILTINS).map(name => name.toLowerCase()),
  ...[...HOST_PROVIDED].map(name => name.toLowerCase()),
  ...declared
]);

const missing = [...called.entries()]
  .filter(([name]) => !have.has(name.toLowerCase()))
  // A namespaced call resolves through the module runtime, not a builtin.
  .filter(([name]) => !name.includes("\\"))
  .sort((left, right) => right[1].count - left[1].count);

console.log(
  `${called.size} distinct names called, ${have.size} available, ` +
    `${missing.length} missing${pagesOnly ? " (page scripts only)" : ""}.\n`
);
for (const [name, entry] of missing) {
  console.log(`${String(entry.count).padStart(5)}  ${name.padEnd(28)} ${[...entry.where][0]}`);
}
