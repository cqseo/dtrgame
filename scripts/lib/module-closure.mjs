/**
 * Which modules an entry point needs, transitively.
 *
 * Shared by the generator and by scripts/audit-tick-closure.mjs, because
 * the two must agree: if the generator compiled a different set than the
 * audit reported, the audit would be describing something that is not
 * what ships.
 *
 * The rule that makes the answer large: a hook is all-or-nothing.
 * Dispatch enters at the newest implementation and walks back through
 * $chprocess, so every implementation on a chain is needed, and each of
 * those drags in whatever it calls.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { compilePhpModuleFile } from "../../src/legacy/module-compiler.ts";
import { LEGACY_HOOK_CHAINS } from "../../src/generated/legacy-hook-manifest.ts";

/** Every module file under the original's include/modules. */
export function walkModuleFiles(sourceRoot) {
  const found = [];
  const walk = directory => {
    for (const name of readdirSync(directory)) {
      const path = join(directory, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (name.endsWith(".php")) found.push(path);
    }
  };
  walk(join(sourceRoot, "include/modules"));
  return found.sort();
}

/**
 * Parses the tree once, giving both lookups the callers need: every
 * function by qualified name, and every namespace's declaring files.
 *
 * The namespace does not follow from the directory — instance11_observe/
 * declares `instance11`, and sys spreads one namespace over five files —
 * so both come from parsing.
 */
export function readModuleTree(sourceRoot) {
  const functions = new Map();
  const declaringFiles = new Map();

  for (const path of walkModuleFiles(sourceRoot)) {
    let compiled;
    try {
      compiled = compilePhpModuleFile(readFileSync(path, "utf8"));
    } catch {
      continue;
    }
    const byNamespace = new Map();
    for (const fn of compiled) {
      functions.set(`${fn.namespace.toLowerCase()}\\${fn.name.toLowerCase()}`, fn);
      if (!byNamespace.has(fn.namespace)) byNamespace.set(fn.namespace, []);
      byNamespace.get(fn.namespace).push(fn);
    }
    for (const [namespace, declared] of byNamespace) {
      if (!declaringFiles.has(namespace)) declaringFiles.set(namespace, []);
      declaringFiles.get(namespace).push({
        relative: path.slice(sourceRoot.length + 1),
        functions: declared
      });
    }
  }
  for (const entries of declaringFiles.values()) {
    entries.sort((left, right) => left.relative.localeCompare(right.relative));
  }
  return { functions, declaringFiles };
}

const chainOf = name => LEGACY_HOOK_CHAINS[name.toLowerCase()] ?? null;

/** Every call a function body makes, as written in the source. */
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

/**
 * Walks from one or more entry points and reports what is reachable.
 *
 * Returns the modules needed and the global functions the host has to
 * supply, which are the two lists the port is working through.
 */
export function closureFrom(entries, { functions }) {
  const modules = new Set();
  const globals = new Set();
  const seen = new Set();
  const queue = entries.map(entry => entry.toLowerCase());

  const resolveName = (written, namespace) => {
    const bare = written.replace(/^\\+/, "").toLowerCase();
    if (bare.includes("\\")) return bare;
    return functions.has(`${namespace}\\${bare}`) ? `${namespace}\\${bare}` : bare;
  };

  while (queue.length > 0) {
    const current = queue.pop();
    if (seen.has(current)) continue;
    seen.add(current);

    const cut = current.indexOf("\\");
    const bare = cut === -1 ? current : current.slice(cut + 1);
    const chain = chainOf(bare);
    const implementations = chain
      ? chain.map(entry => `${entry.module.toLowerCase()}\\${bare}`)
      : [current];

    let any = false;
    for (const implementation of implementations) {
      const fn = functions.get(implementation);
      if (!fn) continue;
      any = true;
      modules.add(implementation.slice(0, implementation.indexOf("\\")));
      if (seen.has(implementation) && implementation !== current) continue;
      seen.add(implementation);
      for (const call of callsIn(fn.program)) {
        const target = resolveName(call, fn.namespace.toLowerCase());
        if (functions.has(target) || chainOf(target.replace(/^.*\\/, ""))) queue.push(target);
        else if (!target.includes("\\")) globals.add(target);
      }
    }
    if (!any && !current.includes("\\")) globals.add(current);
  }

  return { modules: [...modules].sort(), globals: [...globals].sort() };
}

/**
 * What the port needs compiled.
 *
 * Entry points rather than modules: listing modules is how map_display
 * went missing when the list was replaced by the tick's closure, because
 * map.php is not part of the tick.
 */
export const ENTRY_POINTS = [
  // One game tick.
  "sys\\routine",
  // map.php, which renders outside the tick.
  "map_display\\get_map_display_config",
  // The cooldown hooks the command kernel reads directly.
  "cooldown\\get_move_coldtime",
  "cooldown\\get_search_coldtime",
  "cooldown\\get_itemuse_coldtime",
  "cooldown\\set_coldtime"
];
