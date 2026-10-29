import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

const root = resolve(process.argv[2] ?? "../legacy-dts");
const output = resolve(process.argv[3] ?? "src/generated/legacy-special-recipes.ts");
const tables = {};
const hashes = {};
for (const type of ["sync", "overlay"]) {
  const source = await readFile(resolve(root, `include/modules/base/itemmix/itemmix_${type}/config/${type}.config.php`), "utf8");
  hashes[type] = createHash("sha256").update(source).digest("hex");
  tables[type] = source.split(/\r?\n/).filter(Boolean).map((line, index) => {
    const [itm, itmk, itme, itms, itmsk, star, requirement] = line.split(",");
    if (!itm || !itmk || !/^\d+$/.test(itme) || !/^\d+$/.test(star) || requirement === undefined) throw new Error(`Invalid ${type} row ${index + 1}`);
    return {
      id: `${type}_${String(index + 1).padStart(3, "0")}`,
      result: { itm, itmk, itme: Number(itme), itms: itms === "∞" ? itms : Number(itms), itmsk },
      star: Number(star),
      ...(type === "sync" ? { requirements: requirement ? requirement.split("+") : [] } : { materialCount: Number(requirement) })
    };
  });
}
if (tables.sync.length !== 20 || tables.overlay.length !== 20) throw new Error("Captured baseline must contain 20 sync and 20 overlay recipes");
await writeFile(output, `/** Generated from captured Baota sync/overlay configs. Do not hand edit. */
import type { LegacyItem } from "../legacy/item";
export interface LegacySyncRecipe { id: string; result: LegacyItem; star: number; requirements: readonly string[]; }
export interface LegacyOverlayRecipe { id: string; result: LegacyItem; star: number; materialCount: number; }
export const LEGACY_SPECIAL_RECIPE_SOURCE_SHA256 = ${JSON.stringify(hashes, null, 2)} as const;
export const LEGACY_SYNC_RECIPES: readonly LegacySyncRecipe[] = ${JSON.stringify(tables.sync, null, 2)};
export const LEGACY_OVERLAY_RECIPES: readonly LegacyOverlayRecipe[] = ${JSON.stringify(tables.overlay, null, 2)};
`);
console.log(`Generated ${tables.sync.length} sync and ${tables.overlay.length} overlay recipes.`);
