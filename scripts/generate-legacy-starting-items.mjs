import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(process.argv[2] ?? "../legacy-dts");
const output = resolve(process.argv[3] ?? "src/generated/legacy-starting-items.ts");

async function readItemPool(relativePath) {
  const text = await readFile(resolve(root, relativePath), "utf8");
  return text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("<?") && line.includes(",")).map((line, sourceIndex) => {
    const [itm = "", itmk = "", itme = "0", itms = "0", itmsk = ""] = line.split(",");
    return { itm, itmk, itme: Number(itme), itms: Number(itms), itmsk, sourceIndex };
  });
}

const weapons = await readItemPool("include/modules/base/itemmain/config/stwep.config.php");
const items = await readItemPool("include/modules/base/itemmain/config/stitem.config.php");
const source = `/* Generated from the captured Baota ACFUN DTS baseline. Duplicate rows are intentional weights. Do not hand-edit. */
import type { LegacyItem } from "../legacy/item";

export const LEGACY_STARTING_WEAPONS = ${JSON.stringify(weapons, null, 2)} as const satisfies readonly (LegacyItem & { sourceIndex: number })[];

export const LEGACY_STARTING_ITEMS = ${JSON.stringify(items, null, 2)} as const satisfies readonly (LegacyItem & { sourceIndex: number })[];
`;

await mkdir(resolve(output, ".."), { recursive: true });
await writeFile(output, source);
console.log(`Generated ${weapons.length} weighted starting weapons and ${items.length} weighted starting items.`);
