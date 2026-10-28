import { describe, expect, it } from "vitest";
import {
  LEGACY_INFINITE_DURABILITY,
  checkLegacyAttribute,
  emptyLegacyItem,
  getLegacyMergeType,
  getLegacyPackBlank,
  mergeLegacyItems,
  moveLegacyInventoryItem,
  parseLegacyAttributes,
  reduceLegacyItem,
  useLegacyEdible,
  type LegacyItem
} from "../src/legacy/item";

const item = (itm: string, itmk: string, itme: number, itms: number | string, itmsk = ""): LegacyItem => ({ itm, itmk, itme, itms, itmsk });

describe("legacy itemmain parity", () => {
  it("parses original simple, numeric and compound attribute encoding", () => {
    expect(parseLegacyAttributes("PK^dd20|z^st_box1^vol1")).toEqual(["P", "K", "^dd20", "z", "^st_box1", "^vol1"]);
    expect(parseLegacyAttributes("PK|z", true)).toEqual(["P", "K", "|", "z"]);
    expect(checkLegacyAttribute("z", "zzP", true)).toBe(2);
    expect(checkLegacyAttribute("^dd20", "K^dd20")).toBe(true);
    expect(checkLegacyAttribute("x", "K^dd20")).toBe(false);
  });

  it("classifies exactly the original merge groups", () => {
    expect(["WC", "WD", "Y", "B", "EI", "TN", "MA", "VP", "ygo"].map(getLegacyMergeType)).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1]);
    expect(["HH", "HS", "HB", "PH2"].map(getLegacyMergeType)).toEqual([2, 2, 2, 2]);
    expect(["WP", "WPK", "DB", "X"].map(getLegacyMergeType)).toEqual([0, 0, 0, 0]);
  });

  it("reduces durability and preserves infinite items", () => {
    const finite = item("面包", "HH", 100, "1");
    expect(reduceLegacyItem(finite)).toBe('<span class="red b">面包</span>用光了。<br>');
    expect(finite).toEqual(emptyLegacyItem());
    const infinite = item("拳头", "WN", 0, LEGACY_INFINITE_DURABILITY);
    expect(reduceLegacyItem(infinite)).toBe("");
    expect(infinite.itms).toBe(LEGACY_INFINITE_DURABILITY);
  });

  it("merges normal stacks and retains the stronger poison plus poisoner", () => {
    const material1 = item("增幅设备", "X", 1, 2);
    const material2 = item("增幅设备", "X", 1, 3);
    expect(mergeLegacyItems(material1, material2).merged).toBe(false);

    const ammo1 = item("投掷物", "WC", 10, 2, "z");
    const ammo2 = item("投掷物", "WC", 10, 3, "z");
    expect(mergeLegacyItems(ammo1, ammo2).merged).toBe(true);
    expect(ammo1).toEqual(emptyLegacyItem());
    expect(ammo2.itms).toBe(5);

    const poison1 = item("矿泉水", "PS9", 100, 2, "314");
    const poison2 = item("矿泉水", "HS", 100, 3, "");
    expect(mergeLegacyItems(poison1, poison2).merged).toBe(true);
    expect(poison2).toMatchObject({ itmk: "PS9", itms: 5, itmsk: "314" });
  });

  it("moves and swaps the six original one-based backpack slots", () => {
    const inventory = [item("面包", "HH", 100, 30), item("水", "HS", 100, 30), emptyLegacyItem(), emptyLegacyItem(), emptyLegacyItem(), emptyLegacyItem()];
    expect(getLegacyPackBlank(inventory)).toBe(3);
    expect(moveLegacyInventoryItem(inventory, 1, 3).merged).toBe(true);
    expect(inventory[2]?.itm).toBe("面包");
    expect(moveLegacyInventoryItem(inventory, 2, 3).merged).toBe(true);
    expect(inventory[1]?.itm).toBe("面包");
    expect(inventory[2]?.itm).toBe("水");
  });
});

describe("legacy edible parity", () => {
  it("uses the original treatment pose multiplier and exact caps", () => {
    const player = { hp: 100, mhp: 400, sp: 350, msp: 400, pose: 5 };
    const ration = item("草莓果酱", "HB", 100, 2);
    const result = useLegacyEdible(player, ration);
    expect(result).toMatchObject({ handled: true, consumed: true, hpRecovered: 120, spRecovered: 50 });
    expect(player).toEqual({ hp: 220, mhp: 400, sp: 400, msp: 400, pose: 5 });
    expect(ration.itms).toBe(1);
  });

  it("does not consume recovery items when the matching stats are full", () => {
    const player = { hp: 400, mhp: 400, sp: 400, msp: 400, pose: 3 };
    const bread = item("面包", "HH", 100, 30);
    expect(useLegacyEdible(player, bread)).toEqual({ handled: true, consumed: false, hpRecovered: 0, spRecovered: 0, logHtml: "你的生命不需要恢复。<br>" });
    expect(bread.itms).toBe(30);
  });
});
