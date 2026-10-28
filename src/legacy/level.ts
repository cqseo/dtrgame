import { assertLegacyRandomResult, type LegacyRandom } from "./random";

export const LEGACY_BASE_EXPERIENCE = 9;
export const LEGACY_TINYINT_LEVEL_LIMIT = 250;
export const LEGACY_LARGE_LEVEL_LIMIT = 65_000;

export interface LegacyLevelState {
  lvl: number;
  exp: number;
  hp: number;
  mhp: number;
  sp: number;
  msp: number;
  att: number;
  def: number;
  skillpoint: number;
  upexp?: number;
}

export interface LegacyLevelDelta {
  levels: number;
  hp: number;
  sp: number;
  attack: number;
  defense: number;
  staminaRecovered: number;
  skillPoints: number;
}

export interface LegacyExperienceResult {
  accepted: boolean;
  delta: LegacyLevelDelta;
  logHtml: string;
}

/** Direct port of lvlctl\calc_upexp(). */
export function calculateUpgradeExperience(level: number): number {
  return Math.round((level * 2 + 1) * LEGACY_BASE_EXPERIENCE);
}

/** Direct port of lvlctl\calc_uplv(). */
export function calculateLevelGain(experience: number, currentThreshold: number): number {
  return 1 + Math.floor((experience - currentThreshold) / LEGACY_BASE_EXPERIENCE / 2);
}

export function getLegacyLevelLimit(databaseType = "tinyint(3) unsigned"): number {
  return databaseType.startsWith("tinyint") ? LEGACY_TINYINT_LEVEL_LIMIT : LEGACY_LARGE_LEVEL_LIMIT;
}

const emptyDelta = (): LegacyLevelDelta => ({
  levels: 0,
  hp: 0,
  sp: 0,
  attack: 0,
  defense: 0,
  staminaRecovered: 0,
  skillPoints: 0
});

/**
 * Direct port of lvlctl\checklvlup() and lvlctl\lvlup().
 * The passed player is mutated exactly as the PHP function mutates its array.
 */
export function grantLegacyExperience(
  player: LegacyLevelState,
  gainedExperience: number,
  random: LegacyRandom,
  levelLimit = LEGACY_TINYINT_LEVEL_LIMIT
): LegacyExperienceResult {
  let threshold = calculateUpgradeExperience(player.lvl);
  const delta = emptyDelta();

  if (player.lvl >= levelLimit) {
    player.lvl = levelLimit;
    player.exp = Math.min(player.exp + gainedExperience, threshold);
    return { accepted: false, delta, logHtml: "" };
  }

  player.exp += gainedExperience;
  if (player.exp < threshold) return { accepted: true, delta, logHtml: "" };

  delta.levels = Math.min(calculateLevelGain(player.exp, threshold), levelLimit - player.lvl);
  for (let index = 0; index < delta.levels; index += 1) {
    delta.hp += assertLegacyRandomResult(random.int(9, 11), 9, 11);
    delta.sp += assertLegacyRandomResult(random.int(4, 6), 4, 6);
    delta.attack += assertLegacyRandomResult(random.int(2, 4), 2, 4);
    delta.defense += assertLegacyRandomResult(random.int(3, 5), 3, 5);
    // In PHP, msp is not updated until the complete multi-level loop ends.
    delta.staminaRecovered += Math.round(player.msp * 0.1);
    delta.skillPoints += 1;
    player.lvl += 1;
  }

  threshold = calculateUpgradeExperience(player.lvl);
  if (player.lvl >= levelLimit) {
    player.lvl = levelLimit;
    player.exp = threshold;
  }
  player.upexp = threshold;
  player.hp += delta.hp;
  player.mhp += delta.hp;
  player.sp += delta.sp;
  player.msp += delta.sp;
  player.att += delta.attack;
  player.def += delta.defense;

  if (player.sp >= player.msp) delta.staminaRecovered = 0;
  else if (player.sp + delta.staminaRecovered >= player.msp) delta.staminaRecovered = player.msp - player.sp;
  player.sp += delta.staminaRecovered;
  player.skillpoint += delta.skillPoints;

  const recoveryText = delta.staminaRecovered ? `体力恢复了${delta.staminaRecovered}，` : "";
  const logHtml = `<span class="yellow b">你升了${delta.levels}级！生命上限+${delta.hp}，体力上限+${delta.sp}，攻击+${delta.attack}，防御+${delta.defense}，${recoveryText}获得了${delta.skillPoints}点技能点！</span><br>`;
  return { accepted: true, delta, logHtml };
}
