import { describe, expect, it } from "vitest";
import { LEGACY_SYNC_RECIPES, LEGACY_OVERLAY_RECIPES } from "../src/generated/legacy-special-recipes";
import { findLegacySyncMatches, findLegacyOverlayMatches, getLegacyItemStars } from "../src/legacy/special-crafting";
import { availableLegacyCraftCombinations, legacyMixMask, legacySlotsFromMixMask, runLegacyCraftAction } from "../src/legacy/crafting-action";
import { emptyLegacyItem, type LegacyItem } from "../src/legacy/item";
import { craftLegacyRecipe, normalizeLegacyRecipeName } from "../src/legacy/crafting";

const item = (itm: string, itmk = "X", itmsk = "", itms: number | string = 1): LegacyItem => ({ itm, itmk, itme: 1, itms, itmsk });
const names = (matches: {result: LegacyItem}[]) => matches.map(match => match.result.itm);

describe("original sync and overlay materials", () => {
  it("preserves all twenty rows of each source config", () => {
    expect(LEGACY_SYNC_RECIPES).toHaveLength(20);
    expect(LEGACY_OVERLAY_RECIPES).toHaveLength(20);
    expect(getLegacyItemStars("W1C02")).toBe(102);
    expect(getLegacyItemStars("WC")).toBe(0);
  });
  it("requires one tuner by default and rejects zero-star or depleted materials", () => {
    const pair = [item("调整", "WC02", "s"), item("素材", "WC02")];
    expect(names(findLegacySyncMatches(pair))).toEqual(["武器手套 ★4 -仮"]);
    expect(findLegacySyncMatches([pair[0]!, item("另一调整", "WC02", "s")])).toEqual([]);
    expect(findLegacySyncMatches([pair[0]!, item("空", "WC02", "", 0)])).toEqual([]);
    expect(findLegacySyncMatches([pair[0]!, item("无星", "WC")])).toEqual([]);
  });
  it("keeps both star totals for ^002 and respects named materials", () => {
    const matches = names(findLegacySyncMatches([item("动力工具龙 ★7", "WC07", "^002"), item("调整", "WC02", "s")]));
    expect(matches).toContain("生命激流龙 ★8-仮");
    expect(matches).toContain("阿尔法大日 ★9");
    expect(matches.indexOf("生命激流龙 ★8-仮")).toBeLessThan(matches.indexOf("阿尔法大日 ★9"));
    expect(names(findLegacySyncMatches([item("普通七星", "WC07", "^002"), item("调整", "WC02", "s")]))).not.toContain("生命激流龙 ★8-仮");
  });
  it("honors t3, st and minimum synchronized non-tuner requirements", () => {
    const threeTuners = [item("红莲魔龙 ★8", "WC08"), ...Array.from({length: 3}, (_, i) => item(`调整${i}`, i === 0 ? "WC02" : "WC01", "s"))];
    expect(names(findLegacySyncMatches(threeTuners))).toContain("『真红莲超新星龙』 ★12 -仮");
    const synchronized = [item("同步调整", "WC02", "s^001"), item("同调1", "WC05", "^001"), item("同调2", "WC05", "^001")];
    expect(names(findLegacySyncMatches(synchronized))).toContain("『流天类星龙』 ★12(OCG)-仮");
    expect(names(findLegacySyncMatches(synchronized))).not.toContain("『流天类星龙』 ★12 -仮");
    synchronized[1]!.itmsk = "";
    expect(names(findLegacySyncMatches(synchronized))).not.toContain("『流天类星龙』 ★12(OCG)-仮");
  });
  it("requires exact same-star material counts and J permits -仮 names", () => {
    const pair = [item("假卡-仮", "WC04"), item("真卡", "WC04")];
    expect(findLegacyOverlayMatches(pair)).toEqual([]);
    pair[0]!.itmsk = "J";
    const two = names(findLegacyOverlayMatches(pair));
    expect(two).toContain("No39.希望皇 霍普 ☆4");
    expect(two).not.toContain("CNo.39 希望皇 霍普雷 ☆4");
    expect(names(findLegacyOverlayMatches([...pair, item("第三张", "WC04")]))).toContain("CNo.39 希望皇 霍普雷 ☆4");
    expect(findLegacyOverlayMatches([pair[0]!, item("不同星", "WC03")])).toEqual([]);
  });
});

describe("original crafting selection and state mutation", () => {
  it("leaves multi-result materials intact until an option is chosen", () => {
    const pack = [item("红色方块"), item("Y方块")];
    const before = structuredClone(pack);
    expect(runLegacyCraftAction(pack, [1, 2]).status).toBe("choose");
    expect(pack).toEqual(before);
    expect(craftLegacyRecipe(pack).needsSelection).toBe(true);
    expect(pack).toEqual(before);
    const crafted = runLegacyCraftAction(pack, [1, 2], 1);
    expect(crafted.result?.itm).toBe("黑色方块");
    expect(pack).toEqual([emptyLegacyItem(), emptyLegacyItem()]);
    expect(crafted.logHtml).toBe('<span class="red b">红色方块</span>用光了。<br><span class="red b">Y方块</span>用光了。<br><span class="yellow b">红色方块 Y方块</span>合成了<span class="yellow b">黑色方块</span><br>');
  });
  it("rejects a repeated slot, absent item or invalid option without consuming anything", () => {
    const pack = [item("红色方块"), item("Y方块")];
    const before = structuredClone(pack);
    expect(runLegacyCraftAction(pack, [1, 1]).logHtml).toBe("相同道具不能进行合成！<br>");
    expect(runLegacyCraftAction(pack, [1, 3]).status).toBe("invalid");
    expect(runLegacyCraftAction(pack, [1, 2], 99).status).toBe("invalid");
    expect(pack).toEqual(before);
  });
  it("consumes sync materials and uses the original 同调 verb", () => {
    const pack = [item("调整", "WC02", "s"), item("素材", "WC02")];
    const result = runLegacyCraftAction(pack, [1, 2]);
    expect(result.status).toBe("crafted");
    expect(result.result?.itm).toBe("武器手套 ★4 -仮");
    expect(result.logHtml).toContain("同调合成了");
    expect(result.workDelta).toBe(1);
  });
  it("preserves one-based six-slot masks and finds recipes across backpack gaps", () => {
    expect(legacyMixMask([1, 3, 6])).toBe(37);
    expect(legacySlotsFromMixMask(37)).toEqual([1, 3, 6]);
    const pack = [item("红色方块"), emptyLegacyItem(), item("Y方块"), emptyLegacyItem(), item("水"), item("X方块")];
    expect(availableLegacyCraftCombinations(pack).map(result => result.slots)).toEqual([[1, 3], [1, 6], [3, 6]]);
  });
  it("matches PHP trim including null bytes and retaining nonbreaking spaces", () => {
    expect(normalizeLegacyRecipeName("\0\t面包\v\n")).toBe("面包");
    expect(normalizeLegacyRecipeName("\u00a0面包\u00a0")).toBe("\u00a0面包\u00a0");
  });
});
