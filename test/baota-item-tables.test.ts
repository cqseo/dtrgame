import { describe, expect, it } from "vitest";
import { BAOTA_ITEM_TABLES, baotaLootForArea, baotaShopByGroup } from "../src/baota-item-tables";

describe("Baota item source tables", () => {
  it("loads complete installed basic loot, shop, starter and trap tables", () => {
    expect(BAOTA_ITEM_TABLES.map).toHaveLength(1305);
    expect(BAOTA_ITEM_TABLES.shop).toHaveLength(226);
    expect(BAOTA_ITEM_TABLES.start).toHaveLength(131);
    expect(BAOTA_ITEM_TABLES.trap).toHaveLength(44);
  });
  it("retains every full raw line including special attributes", () => {
    expect(BAOTA_ITEM_TABLES.map[0].name).toBe("曾经的荣光-煤气");
    expect(BAOTA_ITEM_TABLES.map[1].extra).toContain("comp_itmsk");
    expect(BAOTA_ITEM_TABLES.shop.some(x => x.name === "食堂的盒饭")).toBe(true);
    expect(BAOTA_ITEM_TABLES.trap.some(x => x.name === "【最终机枪防线】")).toBe(true);
  });
  it("separates per-map loot and actual shop product rows", () => {
    expect(baotaLootForArea(0, 0).every(x => x.area === 0 || x.area === 99)).toBe(true);
    expect(baotaShopByGroup("1").every(x => x.kind !== "" && x.classId === "1")).toBe(true);
  });
});
