#!/usr/bin/env node
/**
 * Sorts the original's hook implementations by how expensive each is to port.
 *
 * 5,179 implementations remain and they are not equally hard. A function
 * whose body only reads its arguments can be ported and proved against the
 * original in minutes; one that queries the database, mutates player state
 * or re-enters the hook chain cannot. Knowing which is which decides the
 * order of work, and nothing in the repository measured it before.
 *
 * Classification is by what the body touches:
 *   pure      — arguments only
 *   config    — also reads module configuration or constants
 *   state     — reads or writes globals the game carries between calls
 *   data      — touches the database, the filesystem, or the network
 *   dispatch  — re-enters the hook chain, so it needs other hooks first
 *
 * Usage: node scripts/audit-hook-complexity.mjs [legacyRoot] [outputJson]
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const legacyRoot = resolve(process.argv[2] ?? "../legacy-dts");
const output = process.argv[3] ? resolve(process.argv[3]) : null;
const modulesRoot = join(legacyRoot, "include/modules");

function phpFiles(dir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...phpFiles(full));
    else if (entry.name.endsWith(".php")) found.push(full);
  }
  return found;
}

/** Extracts each function body by brace matching from its opening brace. */
function functions(source) {
  const found = [];
  const pattern = /function\s+&?\s*([A-Za-z_]\w*)\s*\(/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    let index = source.indexOf("{", pattern.lastIndex);
    if (index === -1) continue;
    let depth = 0;
    let end = index;
    for (; end < source.length; end++) {
      const character = source[end];
      if (character === "{") depth += 1;
      else if (character === "}") {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    found.push({ name: match[1], body: source.slice(index, end + 1) });
  }
  return found;
}

const DATA = /\$db->|mysqli_|file_get_contents|file_put_contents|fopen\s*\(|writeover\s*\(|openfile\s*\(|curl_|unlink\s*\(|file_exists\s*\(/;
const DISPATCH = /\$chprocess|call_user_func/;
const STATE = /\bglobal\s+\$|\$GLOBALS\b/;
const CONFIG = /\bdefined\s*\(|\bconstant\s*\(|\bMOD_[A-Z0-9_]+/;

/**
 * Nearly every original hook opens with the same two lines: the __MAGIC__
 * dispatch probe that lets an overriding module answer first, and an
 * import_module() that pulls a module's globals into scope. Both are what
 * the compatibility kernel already provides, so counting them as complexity
 * classified 93% of all functions as "dispatch" and hid the real shape of
 * the work. They are stripped before a body is judged.
 */
const PROLOGUE = [
  /if\s*\(\s*eval\s*\(\s*__MAGIC__\s*\)\s*\)\s*return\s+\$___RET_VALUE\s*;/g,
  /eval\s*\(\s*import_module\s*\([^)]*\)\s*\)\s*;/g,
  /\$___RET_VALUE/g
];

const stripPrologue = body => PROLOGUE.reduce((text, pattern) => text.replace(pattern, ""), body);

function classify(rawBody) {
  const body = stripPrologue(rawBody);
  if (DATA.test(body)) return "data";
  if (DISPATCH.test(body)) return "dispatch";
  if (STATE.test(body)) return "state";
  if (CONFIG.test(body)) return "config";
  return "pure";
}

const byClass = { pure: [], config: [], state: [], data: [], dispatch: [] };

for (const file of phpFiles(modulesRoot)) {
  const source = readFileSync(file, "utf8");
  const where = relative(legacyRoot, file);
  for (const { name, body } of functions(source)) {
    const effective = stripPrologue(body).split("\n").filter(line => line.trim() !== "").length;
    byClass[classify(body)].push({ name, file: where, lines: effective });
  }
}

const total = Object.values(byClass).reduce((sum, list) => sum + list.length, 0);
console.log(`module functions: ${total}\n`);
for (const [kind, list] of Object.entries(byClass).sort((a, b) => b[1].length - a[1].length)) {
  const small = list.filter(entry => entry.lines <= 12).length;
  console.log(
    `${String(list.length).padStart(5)}  ${kind.padEnd(9)} ${((list.length / total) * 100).toFixed(1)}%` +
      `   (${small} of them 12 lines or fewer)`
  );
}

const batchable = [...byClass.pure, ...byClass.config]
  .filter(entry => entry.lines <= 12)
  .sort((a, b) => a.lines - b.lines);
console.log(`\nportable without game state, 12 lines or fewer: ${batchable.length}`);
console.log("first 15:");
for (const entry of batchable.slice(0, 15)) {
  console.log(`  ${String(entry.lines).padStart(3)}  ${entry.name}  ${entry.file}`);
}

if (output) {
  writeFileSync(output, `${JSON.stringify({ total, byClass, batchable }, null, 2)}\n`);
  console.log(`\nWrote ${output}`);
}
