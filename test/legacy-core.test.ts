import { describe, expect, it } from "vitest";
import { calculateLevelGain, calculateUpgradeExperience, grantLegacyExperience } from "../src/legacy/level";
import type { LegacyRandom } from "../src/legacy/random";
import { LEGACY_FORBIDDEN_ZONE_RULES, LEGACY_MAP_CONFIG, LEGACY_MAP_LOCATIONS } from "../src/legacy/map";
import {
  LEGACY_POSES,
  LEGACY_TACTICS,
  canChangeLegacyPose,
  canChangeLegacyTactic,
  legacyActiveOddsBonus,
  legacyAttackMultipliers,
  legacyCanCounter,
  legacyDefenseMultipliers,
  legacyEdibleRecovery,
  legacyMeetCharacterBonus,
  legacyRestRecovery,
  legacyTrapDamage,
  legacyTrapEscapeRate,
  legacyWoundRecoveryTime
} from "../src/legacy/stance";

function sequenceRandom(values: number[]): LegacyRandom {
  let index = 0;
  return { int: () => values[index++] ?? (() => { throw new Error("RNG sequence exhausted"); })() };
}

describe("legacy lvlctl parity", () => {
  it("uses the original level thresholds", () => {
    expect([0, 1, 2, 10].map(calculateUpgradeExperience)).toEqual([9, 27, 45, 189]);
    expect(calculateLevelGain(27, 9)).toBe(2);
  });

  it("ports the original multi-level mutation and random call order", () => {
    const player = { lvl: 0, exp: 0, hp: 200, mhp: 400, sp: 100, msp: 400, att: 100, def: 100, skillpoint: 0 };
    const result = grantLegacyExperience(player, 27, sequenceRandom([9, 4, 2, 3, 11, 6, 4, 5]));
    expect(result.delta).toEqual({ levels: 2, hp: 20, sp: 10, attack: 6, defense: 8, staminaRecovered: 80, skillPoints: 2 });
    expect(player).toEqual({ lvl: 2, exp: 27, hp: 220, mhp: 420, sp: 190, msp: 410, att: 106, def: 108, skillpoint: 2, upexp: 45 });
    expect(result.logHtml).toBe('<span class="yellow b">你升了2级！生命上限+20，体力上限+10，攻击+6，防御+8，体力恢复了80，获得了2点技能点！</span><br>');
  });

  it("does not overfill stamina and clamps level 250", () => {
    const player = { lvl: 249, exp: 4480, hp: 400, mhp: 400, sp: 400, msp: 400, att: 100, def: 100, skillpoint: 0 };
    const result = grantLegacyExperience(player, 1000, sequenceRandom([10, 5, 3, 4]));
    expect(result.delta.staminaRecovered).toBe(0);
    expect(player.lvl).toBe(250);
    expect(player.exp).toBe(calculateUpgradeExperience(250));
  });
});

describe("legacy pose and tactic parity", () => {
  it("preserves every original name and selectable flag", () => {
    expect(LEGACY_POSES.map(({ name }) => name)).toEqual(["通常", "作战姿态", "强袭姿态", "探物姿态", "偷袭姿态", "治疗姿态"]);
    expect(LEGACY_POSES.map(({ playerUsable }) => Number(playerUsable))).toEqual([0, 1, 0, 1, 1, 1]);
    expect(LEGACY_TACTICS.map(({ name }) => name)).toEqual(["通常", "重视攻击（已废弃）", "重视防御", "重视反击", "重视躲避"]);
    expect(LEGACY_TACTICS.map(({ playerUsable }) => Number(playerUsable))).toEqual([0, 0, 1, 1, 1]);
    expect(canChangeLegacyPose(3)).toBe(true);
    expect(canChangeLegacyPose(2)).toBe(false);
    expect(canChangeLegacyTactic(4)).toBe(true);
  });

  it("preserves combat, encounter, recovery, trap and counter modifiers", () => {
    expect(legacyMeetCharacterBonus(3, 4)).toBe(-40);
    expect(legacyActiveOddsBonus(4, 2)).toBe(-15);
    expect(legacyAttackMultipliers(1, 2)).toEqual([0.75, 1.4]);
    expect(legacyDefenseMultipliers(3, 2)).toEqual([1.5, 1.1]);
    expect(legacyCanCounter(5, 3)).toBe(false);
    expect(legacyCanCounter(1, 4)).toBe(false);
    expect(legacyRestRecovery(5, 10)).toBe(30);
    expect(legacyWoundRecoveryTime(5, 90)).toBe(60);
    expect(legacyEdibleRecovery(5, 101)).toBe(121);
    expect(legacyTrapEscapeRate(4, 30)).toBe(50);
    expect(legacyTrapDamage(2, 101, sequenceRandom([74]))).toBe(76);
    expect(legacyTrapDamage(2, 101, sequenceRandom([75]))).toBe(101);
  });
});

describe("legacy map parity", () => {
  it("preserves all 35 original locations, coordinates and HTML descriptions", () => {
    expect(LEGACY_MAP_LOCATIONS).toHaveLength(35);
    expect(LEGACY_MAP_LOCATIONS[0]).toMatchObject({ id: 0, name: "无月之影", coordinate: "B-2", dangerous: true, forbiddenOnStart: true });
    expect(LEGACY_MAP_LOCATIONS[11]).toMatchObject({ name: "对天使用作战本部", shortName: "对天使", coordinate: "D-8" });
    expect(LEGACY_MAP_LOCATIONS[32]).toMatchObject({ name: "ＳＣＰ研究设施", shortName: "ＳＣＰ", coordinate: "J-2", dangerous: true });
    expect(LEGACY_MAP_LOCATIONS[34]?.descriptionHtml).toBe("看不见尽头的走廊……<BR>");
    expect(LEGACY_MAP_CONFIG.display[101]).toBe("作战会议室");
    expect(LEGACY_MAP_CONFIG.display[233]).toBe("雪藏柜");
  });

  it("uses the original time-based forbidden-zone schedule", () => {
    expect(LEGACY_FORBIDDEN_ZONE_RULES).toEqual({
      intervalMinutes: 30,
      areasPerInterval: 4,
      warningSeconds: 60,
      activationWaveLimit: 2,
      automaticEscape: false,
      forbiddenOnStart: [0],
      dangerousAreas: [0, 32, 34]
    });
  });
});
