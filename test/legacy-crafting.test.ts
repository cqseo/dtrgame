import { describe, expect, it } from "vitest";
import { LEGACY_RECIPES } from "../src/generated/legacy-recipes";
import { craftLegacyRecipe, findLegacyRecipeMatches, normalizeLegacyRecipeName, reduceLegacyCraftMaterial } from "../src/legacy/crafting";
import type { LegacyItem } from "../src/legacy/item";

const item = (itm: string, itmk = "X", itme = 1, itms: number | string = 1, itmsk = ""): LegacyItem => ({ itm, itmk, itme, itms, itmsk });

describe("legacy recipe data parity", () => {
  it("captures all 465 active Baota recipes with complete result columns", () => {
    expect(LEGACY_RECIPES).toHaveLength(465);
    expect(LEGACY_RECIPES[0]?.result).toEqual({ itm: "松茸御饭", itmk: "HS", itme: 120, itms: 20, itmsk: "" });
    expect(LEGACY_RECIPES[9]?.result.itmsk).toContain("^rtype1");
    expect(LEGACY_RECIPES.at(-1)?.id).toBe("recipe_465");
  });

  it("requires an exact multiset and preserves duplicate outcomes in source order", () => {
    const duplicate = findLegacyRecipeMatches([item("红色方块"), item("Y方块")]);
    expect(duplicate.map((recipe) => recipe.result.itm)).toEqual(["金色方块", "黑色方块"]);
    expect(findLegacyRecipeMatches([item("红色方块"), item("Y方块"), item("水")])).toEqual([]);
    expect(findLegacyRecipeMatches([item("毒针"), item("毒针")])[0]?.result.itm).toBe("D.毒针");
  });

  it("normalizes the exact ignored prefixes and special legacy names", () => {
    expect(normalizeLegacyRecipeName(" 锋利的电气毒性棍棒-改 ")).toBe("棍棒");
    expect(normalizeLegacyRecipeName("小黄的精灵球[+12]")).toBe("小黄的精灵球");
    expect(normalizeLegacyRecipeName("钉棍棒")).toBe("棍棒");
  });
});

describe("legacy crafting behavior parity", () => {
  it("decrements eligible finite stacks and consumes other or infinite materials", () => {
    const stack = item("面包", "HH", 100, 3);
    const weapon = item("刀", "WK", 20, 9);
    const infinite = item("卡", "C", 1, "∞");
    expect(reduceLegacyCraftMaterial(stack)).toBe("");
    expect(stack.itms).toBe(2);
    expect(reduceLegacyCraftMaterial(weapon)).toContain("刀");
    expect(weapon.itm).toBe("");
    expect(reduceLegacyCraftMaterial(infinite)).toContain("卡");
    expect(infinite.itms).toBe(0);
  });

  it("creates the selected duplicate result and applies original club bonuses", () => {
    const cubeMaterials = [item("红色方块"), item("Y方块")];
    expect(craftLegacyRecipe(cubeMaterials, 1).result?.itm).toBe("黑色方块");
    const food = craftLegacyRecipe([item("杂炊"), item("松茸")], 0, 16);
    expect(food.result).toMatchObject({ itm: "松茸御饭", itms: 40 });
    const detector = craftLegacyRecipe([item("生命探测器"), item("增幅设备")], 0, 7);
    expect(detector.result).toMatchObject({ itm: "广域生命探测器", itme: 5 });
  });
});
