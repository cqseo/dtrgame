import { readFile, mkdir, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(process.argv[2] ?? "../legacy-dts");
const output = resolve(process.argv[3] ?? "docs/legacy-module-migration.json");
const moduleLines = (await readFile(resolve(root, "gamedata/modules.list.php"), "utf8")).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
const partialModules = new Set(["player", "map", "lvlctl", "itemmain", "pose", "tactic", "edible", "explore", "weather", "rest", "wound", "metman"]);

const readAssignment = (source, name) => {
  const match = source.match(new RegExp(`\\$___MODULE_${name}\\s*=\\s*(['\"])(.*?)\\1\\s*;`));
  return match?.[2]?.trim().split(/\s+/).filter(Boolean) ?? [];
};

const rows = [];
for (const [order, line] of moduleLines.entries()) {
  const [name, path, enabledRaw] = line.split(",").map((part) => part.trim());
  const moduleInc = resolve(root, "include/modules", path, "module.inc.php");
  let source = "";
  try { await stat(moduleInc); source = await readFile(moduleInc, "utf8"); } catch {}
  rows.push({
    name,
    path,
    order,
    enabled: enabledRaw === "1",
    capturedFromBaota: true,
    migrationStatus: partialModules.has(name) ? "partial" : "pending",
    dependencies: readAssignment(source, "dependency"),
    optionalDependencies: readAssignment(source, "dependency_optional"),
    conflicts: readAssignment(source, "conflict"),
    codeFiles: readAssignment(source, "codelist"),
    templates: readAssignment(source, "templatelist")
  });
}

const document = {
  generatedFrom: "gamedata/modules.list.php and include/modules/**/module.inc.php",
  total: rows.length,
  enabled: rows.filter(({ enabled }) => enabled).length,
  statuses: {
    complete: rows.filter(({ migrationStatus }) => migrationStatus === "complete").length,
    partial: rows.filter(({ migrationStatus }) => migrationStatus === "partial").length,
    pending: rows.filter(({ migrationStatus }) => migrationStatus === "pending").length
  },
  completionRule: "A module may be marked complete only after its code/config/template hooks have parity fixtures against the Baota baseline.",
  modules: rows
};
await mkdir(resolve(output, ".."), { recursive: true });
await writeFile(output, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Generated migration ledger for ${document.total} modules: ${document.statuses.partial} partial, ${document.statuses.pending} pending, ${document.statuses.complete} complete.`);
