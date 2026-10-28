import { describe, expect, it } from "vitest";
import {
  LEGACY_WEAPONS,
  calculateLegacyAttackPower,
  calculateLegacyDefensePower,
  calculateLegacyHitRate,
  calculateLegacyPhysicalDamage,
  canLegacyWeaponCounter,
  getLegacyAttackMethod,
  getLegacyWeaponRange,
  hurtLegacyArmor,
  shouldImpairLegacyWeapon,
  type LegacyCombatant
} from "../src/legacy/combat";
import { LEGACY_INFINITE_DURABILITY } from "../src/legacy/item";
import type { LegacyRandom } from "../src/legacy/random";

const sequenceRandom = (values: number[]): LegacyRandom => { let index = 0; return { int: () => values[index++]! }; };
const fighter = (overrides: Partial<LegacyCombatant> = {}): LegacyCombatant => ({
  name: "测试者", hp: 400, mhp: 400, sp: 400, att: 100, def: 100, pose: 0, tactic: 0,
  wep: "拳头", wepk: "WN", wepe: 0, weps: LEGACY_INFINITE_DURABILITY, wepsk: "",
  wp: 100, wk: 100, wg: 100, wc: 100, wd: 100, wf: 100,
  arbe: 0, arhe: 0, arae: 0, arfe: 0,
  ...overrides
});

describe("legacy weapon table parity", () => {
  it("preserves every base attack method row", () => {
    expect(Object.keys(LEGACY_WEAPONS)).toEqual(["N", "P", "K", "G", "C", "D", "F", "B", "J"]);
    expect(LEGACY_WEAPONS.K).toMatchObject({ mastery: "wk", counterOdds: 65, range: 3, hitRate: 75, maxHitRate: 85, hitRatePerMastery: 0.025, damageFluctuation: 40, damagePerMastery: 0.65, impairmentRate: 35, deathState: 22 });
    expect(LEGACY_WEAPONS.J).toMatchObject({ mastery: "wg", range: 8, hitRate: 10, maxHitRate: 98, hitRatePerMastery: 0.2, damagePerMastery: 0.7 });
  });

  it("uses original empty-ammo fallback attack methods", () => {
    expect(getLegacyAttackMethod(fighter({ wepk: "WG", weps: LEGACY_INFINITE_DURABILITY }))).toBe("P");
    expect(getLegacyAttackMethod(fighter({ wepk: "WB", weps: LEGACY_INFINITE_DURABILITY }))).toBe("K");
    expect(getLegacyAttackMethod(fighter({ wepk: "WJ", weps: LEGACY_INFINITE_DURABILITY }))).toBe("P");
    expect(getLegacyAttackMethod(fighter({ wepk: "WG", weps: 2 }))).toBe("G");
  });

  it("calculates capped hit rate, attack and equipped armor defense", () => {
    expect(calculateLegacyHitRate(fighter({ wepk: "WK", wk: 1000 }))).toBe(85);
    expect(calculateLegacyAttackPower(fighter({ wepk: "WP", wepe: 50, att: 100, pose: 1, tactic: 2 }), 1)).toBeCloseTo(231);
    expect(calculateLegacyDefensePower(fighter({ def: 100, arbe: 5, arhe: 10, arae: 15, arfe: 20, pose: 3, tactic: 2 }), 2)).toBeCloseTo(247.5);
  });
});

describe("legacy base combat parity", () => {
  it("uses original fluctuation and 4..10 random damage rolls", () => {
    const attacker = fighter({ wep: "调色刀", wepk: "WK", wepe: 45, wk: 100 });
    const defender = fighter({ def: 100 });
    const result = calculateLegacyPhysicalDamage(attacker, defender, 2, sequenceRandom([0, 10]));
    expect(result).toEqual({ damage: 124, primaryDamage: 124, fixedDamage: 0, fluctuationPercent: 0, spiritMultiplier: 1, staminaSpent: 0 });
  });

  it("applies spirit fixed damage/cost and heavy-gun defender penalty", () => {
    const attacker = fighter({ wep: "灵能力自然起火", wepk: "WF", wepe: 125, wf: 100, sp: 10 });
    const defender = fighter({ wepk: "WJ", weps: 2 });
    const result = calculateLegacyPhysicalDamage(attacker, defender, 2, sequenceRandom([0, 10]));
    expect(result.fixedDamage).toBe(125);
    expect(result.staminaSpent).toBe(9);
    expect(result.spiritMultiplier).toBe(0.68);
    expect(result.damage).toBe(Math.round((result.primaryDamage + 125) * 0.68 * 1.5));
    expect(attacker.sp).toBe(1);
  });

  it("enforces range, zero-range, pose/tactic and counter dice", () => {
    const bow = fighter({ wepk: "WB", weps: 2, wc: 600 });
    const gun = fighter({ wepk: "WG", weps: 2 });
    expect(getLegacyWeaponRange(bow)).toBe(8);
    expect(canLegacyWeaponCounter(bow, gun, sequenceRandom([29]))).toBe(true);
    expect(canLegacyWeaponCounter(fighter({ wepk: "WD", weps: 1 }), gun, sequenceRandom([]))).toBe(false);
    expect(canLegacyWeaponCounter(bow, gun, sequenceRandom([30]))).toBe(false);
    expect(canLegacyWeaponCounter(fighter({ wepk: "WK", tactic: 4 }), fighter({ wepk: "WK" }), sequenceRandom([]))).toBe(false);
  });

  it("uses consumable and durable weapon impairment rules", () => {
    expect(shouldImpairLegacyWeapon("G", false, sequenceRandom([99]))).toBe(true);
    expect(shouldImpairLegacyWeapon("K", false, sequenceRandom([]))).toBe(false);
    expect(shouldImpairLegacyWeapon("K", true, sequenceRandom([34]))).toBe(true);
    expect(shouldImpairLegacyWeapon("K", true, sequenceRandom([35]))).toBe(false);
  });

  it("damages finite durability or infinite-armor effect values", () => {
    const finite = { itm: "校服", itmk: "DB", itme: 5, itms: 15, itmsk: "", slot: "arb" as const };
    expect(hurtLegacyArmor(finite, 3)).toEqual({ absorbed: 3, broken: false });
    expect(finite.itms).toBe(12);
    const infinite = { itm: "屏障", itmk: "DB", itme: 2, itms: LEGACY_INFINITE_DURABILITY, itmsk: "", slot: "arb" as const };
    expect(hurtLegacyArmor(infinite, 9)).toEqual({ absorbed: 2, broken: true });
    expect(infinite.itme).toBe(0);
  });
});
