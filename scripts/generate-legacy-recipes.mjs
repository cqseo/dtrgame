import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "../legacy-dts");
const output = resolve(process.argv[3] ?? "src/generated/legacy-recipes.ts");
const sourcePath = resolve(root, "include/modules/base/itemmix/itemmix/config/itemmix.config.php");
const source = await readFile(sourcePath, "utf8");

function stripLineComments(value) {
  let result = "";
  let quote = "";
  let escaped = false;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    const next = value[index + 1];
    if (quote) {
      result += character;
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === "'" || character === '"') { quote = character; result += character; continue; }
    if (character === "/" && next === "/") {
      while (index < value.length && value[index] !== "\n") index += 1;
      result += "\n";
      continue;
    }
    result += character;
  }
  return result;
}

function balancedSlice(value, start) {
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = start; index < value.length; index += 1) {
    const character = value[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === "'" || character === '"') { quote = character; continue; }
    if (character === "(") depth += 1;
    else if (character === ")" && --depth === 0) return value.slice(start, index + 1);
  }
  throw new Error(`Unbalanced PHP array at byte ${start}`);
}

function splitPhpValues(value) {
  const parts = [];
  let current = "";
  let quote = "";
  let escaped = false;
  let depth = 0;
  for (const character of value) {
    if (quote) {
      current += character;
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === "'" || character === '"') { quote = character; current += character; continue; }
    if (character === "(") depth += 1;
    else if (character === ")") depth -= 1;
    if (character === "," && depth === 0) { if (current.trim()) parts.push(current.trim()); current = ""; }
    else current += character;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function parsePhpScalar(raw) {
  const value = raw.trim();
  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    const quote = value[0];
    return value.slice(1, -1).replace(new RegExp(`\\\\${quote}`, "g"), quote).replace(/\\\\/g, "\\");
  }
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (value === "NULL" || value === "null") return null;
  throw new Error(`Unsupported PHP recipe scalar: ${value}`);
}

function readNamedArray(block, name) {
  const marker = new RegExp(`['\"]${name}['\"]\\s*=>\\s*array\\s*\\(`).exec(block);
  if (!marker) throw new Error(`Missing ${name} array in ${block.slice(0, 120)}`);
  const start = marker.index + marker[0].lastIndexOf("(");
  const phpArray = balancedSlice(block, start);
  return splitPhpValues(phpArray.slice(1, -1)).map(parsePhpScalar);
}

const cleaned = stripLineComments(source);
const marker = /array\s*\(\s*['"]class['"]\s*=>/g;
const recipes = [];
let match;
while ((match = marker.exec(cleaned))) {
  const block = balancedSlice(cleaned, cleaned.indexOf("(", match.index));
  const groupMatch = /['"]class['"]\s*=>\s*(['"])(.*?)\1/s.exec(block);
  if (!groupMatch) throw new Error(`Missing class in recipe ${recipes.length + 1}`);
  const ingredients = readNamedArray(block, "stuff");
  const result = readNamedArray(block, "result");
  if (ingredients.some((value) => typeof value !== "string")) throw new Error(`Non-string ingredient in recipe ${recipes.length + 1}`);
  if (result.length < 4 || typeof result[0] !== "string" || typeof result[1] !== "string" || typeof result[2] !== "number") {
    throw new Error(`Malformed result in recipe ${recipes.length + 1}: ${JSON.stringify(result)}`);
  }
  const tipsMatch = /['"]tips['"]\s*=>\s*(['"])((?:\\.|(?!\1).)*)\1/s.exec(block);
  recipes.push({
    id: `recipe_${String(recipes.length + 1).padStart(3, "0")}`,
    group: groupMatch[2],
    ingredients,
    result: {
      itm: result[0],
      itmk: result[1],
      itme: result[2],
      itms: result[3],
      itmsk: result[4] == null ? "" : String(result[4])
    },
    tips: tipsMatch ? parsePhpScalar(`${tipsMatch[1]}${tipsMatch[2]}${tipsMatch[1]}`) : ""
  });
  marker.lastIndex = match.index + block.length;
}

if (recipes.length !== 465) throw new Error(`Expected 465 active Baota recipes, parsed ${recipes.length}`);

const generated = `/** Generated from the captured Baota itemmix.config.php. Do not hand edit. */
import type { LegacyItem } from "../legacy/item";

export interface LegacyRecipe {
  id: string;
  group: string;
  ingredients: readonly string[];
  result: LegacyItem;
  tips: string;
}

export const LEGACY_RECIPES: readonly LegacyRecipe[] = ${JSON.stringify(recipes, null, 2)};
`;

await mkdir(dirname(output), { recursive: true });
await writeFile(output, generated);
console.log(`Generated ${recipes.length} exact legacy recipes at ${output}`);
