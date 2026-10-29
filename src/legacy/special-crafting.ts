import { LEGACY_SYNC_RECIPES, LEGACY_OVERLAY_RECIPES, type LegacySyncRecipe, type LegacyOverlayRecipe } from "../generated/legacy-special-recipes";
import { checkLegacyAttribute, isLegacyItemEmpty, type LegacyItem } from "./item";
import { findLegacyRecipeMatches, normalizeLegacyRecipeName } from "./crafting";

/** The PHP algorithm concatenates every digit in the kind, including leading zeroes. */
export function getLegacyItemStars(kind: string): number {
  return Number(kind.replace(/[^0-9]/g, "")) || 0;
}

/** itemmix_sync_check, including insertion-ordered star groups and both ^002 branches. */
export function findLegacySyncMatches(items: readonly LegacyItem[]): LegacySyncRecipe[] {
  let total = 0, alternate = 0, streamStar = 0;
  const tuners: number[] = [];
  for (const [index, item] of items.entries()) {
    const star = isLegacyItemEmpty(item) ? 0 : getLegacyItemStars(item.itmk);
    if (!star) return [];
    total += star;
    if (checkLegacyAttribute("s", item.itmsk)) tuners.push(index);
    if (checkLegacyAttribute("^002", item.itmsk)) streamStar = star;
  }
  if (!total || !tuners.length) return [];
  if (streamStar) alternate = streamStar + items.length - 1;
  const names = items.map(item => normalizeLegacyRecipeName(item.itm));
  const groups = new Map<number, LegacySyncRecipe[]>();
  for (const recipe of LEGACY_SYNC_RECIPES) {
    let tunerCount = 1;
    let valid = true;
    for (const requirement of recipe.requirements) {
      if (requirement.startsWith("t")) {
        tunerCount = Number.parseInt(requirement.slice(1), 10) || 0;
        if (tuners.length !== tunerCount) { valid = false; break; }
      } else if (requirement === "st") {
        if (!checkLegacyAttribute("^001", items[tuners[0]!]!.itmsk)) { valid = false; break; }
      } else if (requirement.startsWith("sm")) {
        const minimumNonTuners = Number.parseInt(requirement.slice(2), 10) || 0;
        if (items.length <= minimumNonTuners || items.some((item, index) => !tuners.includes(index) && !checkLegacyAttribute("^001", item.itmsk))) { valid = false; break; }
      } else if (!names.includes(requirement)) { valid = false; break; }
    }
    if (tuners.length !== tunerCount) valid = false;
    if ((recipe.star === total || recipe.star === alternate) && valid) {
      if (recipe.star === alternate) [total, alternate] = [alternate, total];
      const group = groups.get(total) ?? [];
      group.push(recipe);
      groups.set(total, group);
    }
  }
  return [...groups.values()].flat();
}

export function isLegacyOverlayMaterial(item: LegacyItem): boolean {
  return !!checkLegacyAttribute("J", item.itmsk) || !item.itm.includes("-仮");
}

/** itemmix_overlay_check uses equal star count and exact number of materials. */
export function findLegacyOverlayMatches(items: readonly LegacyItem[]): LegacyOverlayRecipe[] {
  if (items.length < 2) return [];
  let star = 0;
  for (const item of items) {
    const itemStar = isLegacyItemEmpty(item) || !isLegacyOverlayMaterial(item) ? 0 : getLegacyItemStars(item.itmk);
    if (!itemStar || (star && itemStar !== star)) return [];
    star = itemStar;
  }
  return LEGACY_OVERLAY_RECIPES.filter(recipe => recipe.star === star && recipe.materialCount === items.length);
}

export interface LegacyCraftOption {
  id: string;
  type: "normal" | "sync" | "overlay";
  group: string;
  result: LegacyItem;
}

/** Enabled loader order is normal -> sync -> overlay after each chprocess() returns. */
export function getLegacyCraftOptions(items: readonly LegacyItem[]): LegacyCraftOption[] {
  return [
    ...findLegacyRecipeMatches(items).map(recipe => ({ id: recipe.id, type: "normal" as const, group: recipe.group, result: { ...recipe.result } })),
    ...findLegacySyncMatches(items).map(recipe => ({ id: recipe.id, type: "sync" as const, group: "", result: { ...recipe.result } })),
    ...findLegacyOverlayMatches(items).map(recipe => ({ id: recipe.id, type: "overlay" as const, group: "", result: { ...recipe.result } }))
  ];
}
