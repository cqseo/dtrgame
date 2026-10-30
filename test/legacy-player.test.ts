import { describe, expect, it } from "vitest";
import { ENABLED_LEGACY_MODULES, LEGACY_MODULES, LEGACY_PLAYER_FIELDS } from "../src/generated/legacy-registry";
import { createLegacyEntrant } from "../src/legacy/player";
import type { LegacyRandom } from "../src/legacy/random";

const sequenceRandom = (values: number[]): LegacyRandom => {
  let index = 0;
  return { int: () => values[index++]! };
};

describe("captured ACFUN DTS baseline", () => {
  it("preserves the complete module order and enabled set", () => {
    expect(LEGACY_MODULES).toHaveLength(744);
    expect(ENABLED_LEGACY_MODULES).toHaveLength(735);
    expect(LEGACY_MODULES[0]?.name).toBe("input");
  });

  it("preserves every legacy player database field", () => {
    expect(LEGACY_PLAYER_FIELDS.length).toBeGreaterThan(120);
    expect(LEGACY_PLAYER_FIELDS.map(({ name }) => name)).toEqual(expect.arrayContaining(["hp", "mhp", "wep", "itm6", "nskillpara"]));
  });

  it("constructs the exact pre-card standard entrant", () => {
    const player = createLegacyEntrant({ name: "测试者", gender: "f", icon: 1, serialNumber: 7, now: 123, random: sequenceRandom([9, 0, 0, 130]), areaWave: 2, spawnArea: 7 });
    expect(player).toMatchObject({
      name: "测试者", gd: "f", icon: 1, sNo: 7,
      hp: 400, mhp: 400, sp: 400, msp: 400,
      att: 104, def: 96, lvl: 0, exp: 160, money: 20, pls: 7,
      pose: 3, tactic: 2,
      arb: "女生校服", arbk: "DB", arbe: 5, arbs: "15",
      itm1: "面包", itmk1: "HH", itme1: 100, itms1: "30",
      itm2: "矿泉水", itmk2: "HS", itme2: 100, itms2: "30",
      wep: "巨大萝卜根", wepk: "WP", wepe: 75, weps: "10", wepsk: "",
      itm3: "增幅设备", itmk3: "X", itme3: 1, itms3: "1",
      itm4: "糖衣炮弹-紫", itmk4: "WC", itme4: 100, itms4: "66", itmsk4: "f"
    });
  });

  it("preserves the duplicate rows used as starting-item probability weights", async () => {
    const { LEGACY_STARTING_ITEMS, LEGACY_STARTING_WEAPONS } = await import("../src/generated/legacy-starting-items");
    expect(LEGACY_STARTING_WEAPONS).toHaveLength(48);
    expect(LEGACY_STARTING_ITEMS).toHaveLength(131);
    expect(LEGACY_STARTING_WEAPONS.slice(0, 2).map(({ itm }) => itm)).toEqual(["巨大萝卜根", "巨大萝卜根"]);
    expect(LEGACY_STARTING_ITEMS.slice(0, 3).map(({ itm }) => itm)).toEqual(["增幅设备", "增幅设备", "增幅设备"]);
  });
});
