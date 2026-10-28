import { LEGACY_RECIPES, type LegacyRecipe } from "../generated/legacy-recipes";
import { clearLegacyItem, isLegacyItemEmpty, LEGACY_INFINITE_DURABILITY, type LegacyItem } from "./item";

export const LEGACY_CRAFT_REDUCE_KIND = /^(Y|B|C|X|TN|GB|H|P|V|M|R)/;

/** Direct port of itemmix\itemmix_name_proc(). */
export function normalizeLegacyRecipeName(input: string): string {
  let name = input.trim();
  name = name.replace(/锋利的/gi, "").replace(/电气/gi, "").replace(/毒性/gi, "").replace(/-改/gi, "");
  if (name.includes("小黄的")) name = name.replace(/\[\+[0-9]+?\]/gi, "");
  return name.replace(/钉棍棒/g, "棍棒");
}

function sortedNames(items: readonly LegacyItem[]): string[] {
  return items.map((item) => normalizeLegacyRecipeName(item.itm)).sort();
}

/** Keeps source order and duplicate recipes exactly like PHP itemmix_recipe_check(). */
export function findLegacyRecipeMatches(items: readonly LegacyItem[]): LegacyRecipe[] {
  if (items.length < 2) return [];
  const names = sortedNames(items);
  return LEGACY_RECIPES.filter((recipe) => {
    if (recipe.ingredients.length !== names.length) return false;
    const ingredients = [...recipe.ingredients].sort();
    return ingredients.every((name, index) => name === names[index]);
  });
}

/** Direct port of itemmix\itemmix_reduce(); a stackable material loses one use, others are consumed. */
export function reduceLegacyCraftMaterial(item: LegacyItem): string {
  if (isLegacyItemEmpty(item)) return "";
  if (item.itms !== LEGACY_INFINITE_DURABILITY && LEGACY_CRAFT_REDUCE_KIND.test(item.itmk)) item.itms = Number(item.itms) - 1;
  else item.itms = 0;
  if (Number(item.itms) > 0) return "";
  const name = item.itm;
  clearLegacyItem(item);
  return `<span class="red b">${name}</span>用光了。<br>`;
}

export interface LegacyCraftResult {
  ok: boolean;
  matches: readonly LegacyRecipe[];
  result?: LegacyItem;
  workDelta: number;
  logHtml: string;
}

export function craftLegacyRecipe(materials: LegacyItem[], selectedMatch = 0, club = 0): LegacyCraftResult {
  if (materials.length < 2) return { ok: false, matches: [], workDelta: 0, logHtml: "至少需要2个道具才能进行合成！" };
  if (materials.some(isLegacyItemEmpty)) return { ok: false, matches: [], workDelta: 0, logHtml: "所选择的道具不存在！" };
  const matches = findLegacyRecipeMatches(materials);
  if (!matches.length) {
    const names = materials.map((item) => item.itm).join(" ");
    return { ok: false, matches, workDelta: 0, logHtml: `<span class="yellow b">${names}</span>不能合成！<br>` };
  }
  const recipe = matches[selectedMatch];
  if (!recipe) return { ok: false, matches, workDelta: 0, logHtml: "错误的合成选项。<br>" };
  const sourceNames = materials.map((item) => item.itm).join(" ");
  let depletedLog = "";
  for (const material of materials) depletedLog += reduceLegacyCraftMaterial(material);
  const result = { ...recipe.result };
  if (result.itmk.startsWith("H") && club === 16 && result.itms !== LEGACY_INFINITE_DURABILITY) result.itms = Math.ceil(Number(result.itms) * 2);
  else if ((result.itmk === "EE" || result.itmk === "ER") && club === 7) result.itme *= 5;
  return {
    ok: true,
    matches,
    result,
    workDelta: 1,
    logHtml: `<span class="yellow b">${sourceNames}</span>合成了<span class="yellow b">${result.itm}</span><br>${depletedLog}`
  };
}
