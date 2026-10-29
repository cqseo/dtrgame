import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(process.argv[2] ?? "../legacy-dts");
const output = resolve(process.argv[3] ?? "src/generated/legacy-registry.ts");
const moduleLines = (await readFile(resolve(root, "gamedata/modules.list.php"), "utf8"))
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const basicModules = moduleLines.map((line, order) => {
  const [name, path, enabled] = line.split(",").map((value) => value.trim());
  return { name, path, enabled: enabled === "1", order };
});

const readHeaderValue = (source, name) => source.match(new RegExp(`\\$___MODULE_${name}\\s*=\\s*(['"])(.*?)\\1\\s*;`, "s"))?.[2] ?? "";
const splitWords = (value) => value.trim() ? value.trim().split(/\s+/) : [];
const modules = await Promise.all(basicModules.map(async (module) => {
  const header = await readFile(resolve(root, "include/modules", module.path, "module.inc.php"), "utf8");
  return {
    ...module,
    dependencies: splitWords(readHeaderValue(header, "dependency")),
    optionalDependencies: splitWords(readHeaderValue(header, "dependency_optional")),
    conflicts: splitWords(readHeaderValue(header, "conflict")),
    codeFiles: splitWords(readHeaderValue(header, "codelist")),
    templates: splitWords(readHeaderValue(header, "templatelist"))
  };
}));

const playerSql = await readFile(resolve(root, "gamedata/sql/players.sql"), "utf8");
const fields = [...playerSql.matchAll(/^\s*`([^`]+)`\s+([^,]+),?\s*$/gm)].map((match, order) => {
  const [, name, declaration] = match;
  const sqlType = declaration.match(/^([^\s]+)/)?.[1] ?? "text";
  const defaultMatch = declaration.match(/DEFAULT\s+'([^']*)'/i);
  const numeric = /int/i.test(sqlType);
  return {
    name,
    sqlType,
    runtimeType: numeric ? "number" : "string",
    defaultValue: defaultMatch ? (numeric ? Number(defaultMatch[1]) : defaultMatch[1]) : (numeric ? 0 : ""),
    order
  };
});

const source = `/* Generated from the captured Baota ACFUN DTS baseline. Do not hand-edit. */
export const LEGACY_MODULES = ${JSON.stringify(modules, null, 2)} as const;

export const LEGACY_PLAYER_FIELDS = ${JSON.stringify(fields, null, 2)} as const;

export type LegacyModuleName = typeof LEGACY_MODULES[number]["name"];
export type LegacyPlayerFieldName = typeof LEGACY_PLAYER_FIELDS[number]["name"];

export const ENABLED_LEGACY_MODULES = LEGACY_MODULES.filter((entry) => entry.enabled);

export function getLegacyModule(name: LegacyModuleName) {
  return LEGACY_MODULES.find((entry) => entry.name === name)!;
}

export function createLegacyPlayerRecord(): Record<LegacyPlayerFieldName, string | number> {
  return Object.fromEntries(LEGACY_PLAYER_FIELDS.map((field) => [field.name, field.defaultValue])) as Record<LegacyPlayerFieldName, string | number>;
}
`;

await mkdir(resolve(output, ".."), { recursive: true });
await writeFile(output, source);
console.log(`Generated ${modules.length} modules (${modules.filter(({ enabled }) => enabled).length} enabled) and ${fields.length} player fields.`);
