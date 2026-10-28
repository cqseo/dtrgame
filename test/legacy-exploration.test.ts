import { describe, expect, it } from "vitest";
import { calculateLegacyMeetCharacterRate, checkLegacyMove, checkLegacySearch } from "../src/legacy/explore";
import { LEGACY_MAP_CONFIG } from "../src/legacy/map";
import { applyLegacyRest } from "../src/legacy/rest";
import type { LegacyRandom } from "../src/legacy/random";
import { LEGACY_WEATHER, LEGACY_INITIAL_WEATHER_IDS, legacyWeatherAttackMultiplier, legacyWeatherDefenseMultiplier, legacyWeatherHitRateBonus } from "../src/legacy/weather";
import { addLegacyCondition, bandageLegacyWound, rollLegacyWeaponWound } from "../src/legacy/wound";

const sequenceRandom = (values: number[]): LegacyRandom => { let index = 0; return { int: () => values[index++]! }; };

describe("legacy exploration parity", () => {
  it("requires strictly more stamina than the 15 point action cost", () => {
    const base = { currentArea: 1, destination: 2 as const, availableAreas: LEGACY_MAP_CONFIG.names.map((_, id) => id), forbiddenAreas: [0], areaNames: LEGACY_MAP_CONFIG.names };
    expect(checkLegacyMove({ ...base, stamina: 15 }).allowed).toBe(false);
    expect(checkLegacyMove({ ...base, stamina: 16 })).toMatchObject({ allowed: true, spCost: 15 });
    expect(checkLegacyMove({ ...base, stamina: 99, destination: 1 }).logHtml).toBe("相同地点，不需要移动。<br>");
    expect(checkLegacySearch({ currentArea: 0, stamina: 100, forbiddenAreas: [0], areaNames: LEGACY_MAP_CONFIG.names }).allowed).toBe(false);
  });

  it("uses the original encounter rates and cap", () => {
    expect(calculateLegacyMeetCharacterRate("search", 0)).toBe(50);
    expect(calculateLegacyMeetCharacterRate("move", 2)).toBe(46);
    expect(calculateLegacyMeetCharacterRate("search", 50)).toBe(50);
    expect(calculateLegacyMeetCharacterRate("search2", 1)).toBe(100);
  });
});

describe("legacy weather parity", () => {
  it("preserves all 20 weather rows and combat modifiers", () => {
    expect(LEGACY_WEATHER).toHaveLength(20);
    expect(LEGACY_INITIAL_WEATHER_IDS).toEqual([0, 2, 3, 4, 7]);
    expect(LEGACY_WEATHER[9]).toMatchObject({ nameHtml: "浓雾", itemFindOdds: -20, activeOdds: -10, attackModifier: 7, defenseModifier: -30, fog: true });
    expect(legacyWeatherAttackMultiplier(10)).toBe(1.2);
    expect(legacyWeatherDefenseMultiplier(1)).toBe(1.3);
    expect(legacyWeatherHitRateBonus(12)).toBe(20);
  });
});

describe("legacy wound and rest parity", () => {
  it("keeps condition order unique and uses weapon-specific wound rolls", () => {
    expect(addLegacyCondition("hbi", "h")).toEqual({ value: "bih", added: false });
    expect(rollLegacyWeaponWound("P", sequenceRandom([3, 0]))).toBeNull();
    expect(rollLegacyWeaponWound("K", sequenceRandom([2, 54]))).toBe("a");
    expect(rollLegacyWeaponWound("K", sequenceRandom([2, 55]))).toBeNull();
  });

  it("requires more than 50 stamina to bandage a normal wound", () => {
    const exhausted = { inf: "h", sp: 50 };
    expect(bandageLegacyWound(exhausted, "h").healed).toBe(false);
    const player = { inf: "hb", sp: 51 };
    expect(bandageLegacyWound(player, "h").healed).toBe(true);
    expect(player).toEqual({ inf: "b", sp: 1 });
  });

  it("ports sleep, healing, chest-wound penalty, treatment pose and strict recovery time", () => {
    const player = { hp: 100, mhp: 400, sp: 100, msp: 400, inf: "bi", pose: 5, state: 3, endtime: 1000 };
    const result = applyLegacyRest(player, 1061);
    expect(result.spRecovered).toBe(243);
    expect(result.hpRecovered).toBe(63);
    expect(result.healedConditions).toEqual(["b", "i"]);
    expect(player.inf).toBe("");
    const strict = { hp: 400, mhp: 400, sp: 400, msp: 400, inf: "h", pose: 5, state: 3, endtime: 1000 };
    expect(applyLegacyRest(strict, 1060).healedConditions).toEqual([]);
  });
});
