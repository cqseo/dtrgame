import { LEGACY_INFINITE_DURABILITY, type LegacyDurability, type LegacyItem } from "./item";
import type { LegacyRandom } from "./random";
import { getLegacyPose, getLegacyTactic, legacyCanCounter, legacyCounterRateBonus } from "./stance";
import { getLegacyWeather } from "./weather";

export type LegacyWeaponKind = "N" | "P" | "K" | "G" | "C" | "D" | "F" | "B" | "J";
export type LegacyMastery = "wp" | "wk" | "wg" | "wc" | "wd" | "wf";

export interface LegacyWeaponDefinition {
  kind: LegacyWeaponKind;
  mastery: LegacyMastery;
  verb: string;
  counterOdds: number;
  range: number;
  hitRate: number;
  maxHitRate: number;
  hitRatePerMastery: number;
  damageFluctuation: number;
  damagePerMastery: number;
  impairmentRate: number;
  deathState: number;
}

export const LEGACY_WEAPONS: Readonly<Record<LegacyWeaponKind, LegacyWeaponDefinition>> = {
  N: { kind: "N", mastery: "wp", verb: "殴打", counterOdds: 60, range: 3, hitRate: 80, maxHitRate: 90, hitRatePerMastery: 0.025, damageFluctuation: 15, damagePerMastery: 0.6, impairmentRate: -1, deathState: 20 },
  P: { kind: "P", mastery: "wp", verb: "殴打", counterOdds: 65, range: 3, hitRate: 80, maxHitRate: 90, hitRatePerMastery: 0.025, damageFluctuation: 15, damagePerMastery: 0.6, impairmentRate: 12, deathState: 21 },
  K: { kind: "K", mastery: "wk", verb: "斩刺", counterOdds: 65, range: 3, hitRate: 75, maxHitRate: 85, hitRatePerMastery: 0.025, damageFluctuation: 40, damagePerMastery: 0.65, impairmentRate: 35, deathState: 22 },
  G: { kind: "G", mastery: "wg", verb: "射击", counterOdds: 50, range: 7, hitRate: 70, maxHitRate: 95, hitRatePerMastery: 0.05, damageFluctuation: 20, damagePerMastery: 0.6, impairmentRate: 10_000, deathState: 23 },
  C: { kind: "C", mastery: "wc", verb: "投掷", counterOdds: 35, range: 5, hitRate: 70, maxHitRate: 96, hitRatePerMastery: 0.25, damageFluctuation: 5, damagePerMastery: 0.35, impairmentRate: 10_000, deathState: 24 },
  D: { kind: "D", mastery: "wd", verb: "伏击", counterOdds: 0, range: 0, hitRate: 60, maxHitRate: 70, hitRatePerMastery: 0.02, damageFluctuation: 25, damagePerMastery: 0.75, impairmentRate: 10_000, deathState: 25 },
  F: { kind: "F", mastery: "wf", verb: "灵击", counterOdds: 35, range: 1, hitRate: 85, maxHitRate: 96, hitRatePerMastery: 0.1, damageFluctuation: 10, damagePerMastery: 0.3, impairmentRate: 10_000, deathState: 29 },
  B: { kind: "B", mastery: "wc", verb: "投射", counterOdds: 30, range: 5, hitRate: 65, maxHitRate: 90, hitRatePerMastery: 0.15, damageFluctuation: 10, damagePerMastery: 0.5, impairmentRate: 10_000, deathState: 43 },
  J: { kind: "J", mastery: "wg", verb: "狙击", counterOdds: 20, range: 8, hitRate: 10, maxHitRate: 98, hitRatePerMastery: 0.2, damageFluctuation: 10, damagePerMastery: 0.7, impairmentRate: 10_000, deathState: 23 }
};

export interface LegacyCombatant {
  name: string;
  hp: number;
  mhp: number;
  sp: number;
  att: number;
  def: number;
  pose: number;
  tactic: number;
  wep: string;
  wepk: string;
  wepe: number;
  weps: LegacyDurability;
  wepsk: string;
  wp: number;
  wk: number;
  wg: number;
  wc: number;
  wd: number;
  wf: number;
  arbe: number;
  arhe: number;
  arae: number;
  arfe: number;
}

export function getLegacyAttackMethod(player: Pick<LegacyCombatant, "wepk" | "weps">): LegacyWeaponKind {
  if (!player.wepk.startsWith("W")) return "P";
  const original = player.wepk.slice(1, 2) as LegacyWeaponKind;
  if (player.weps === LEGACY_INFINITE_DURABILITY) {
    if (original === "G" || original === "J") return "P";
    if (original === "B") return "K";
  }
  return LEGACY_WEAPONS[original] ? original : "P";
}

export function calculateLegacyHitRate(player: LegacyCombatant, kind = getLegacyAttackMethod(player)): number {
  const definition = LEGACY_WEAPONS[kind];
  return Math.min(definition.hitRate + Math.round(player[definition.mastery] * definition.hitRatePerMastery), definition.maxHitRate);
}

export function calculateLegacyAttackPower(attacker: LegacyCombatant, weatherId: number, kind = getLegacyAttackMethod(attacker)): number {
  let internal = attacker.att;
  if (kind === "G" && internal > 270) internal = 270 + Math.round((internal - 270) / 3 * 10) / 10;
  if (kind === "J" && internal > 340) internal = 340 + (internal - 340) / 3;
  let external = attacker.wepe * 2;
  const original = attacker.wepk.slice(1, 2);
  if (kind === "N") external += Math.round(attacker.wp * 2 / 3);
  if (kind === "P" && (original === "G" || original === "J")) external *= 0.1;
  if (kind === "K" && original === "B") external *= 0.25;
  const multipliers = [getLegacyTactic(attacker.tactic).attackModifier, getLegacyPose(attacker.pose).attackModifier, getLegacyWeather(weatherId).attackModifier];
  return multipliers.reduce((value, modifier) => value * (1 + modifier / 100), internal + external);
}

export function calculateLegacyDefensePower(defender: LegacyCombatant, weatherId: number): number {
  const external = defender.arbe + defender.arhe + defender.arae + defender.arfe;
  const multipliers = [getLegacyTactic(defender.tactic).defenseModifier, getLegacyPose(defender.pose).defenseModifier, getLegacyWeather(weatherId).defenseModifier];
  return multipliers.reduce((value, modifier) => value * (1 + modifier / 100), defender.def + external);
}

export interface LegacyDamageResult {
  damage: number;
  primaryDamage: number;
  fixedDamage: number;
  fluctuationPercent: number;
  spiritMultiplier: number;
  staminaSpent: number;
}

/** Base weapon damage plus enabled pose/tactic/weather, F and J hooks. */
export function calculateLegacyPhysicalDamage(attacker: LegacyCombatant, defender: LegacyCombatant, weatherId: number, random: LegacyRandom, kind = getLegacyAttackMethod(attacker)): LegacyDamageResult {
  const definition = LEGACY_WEAPONS[kind];
  const attack = calculateLegacyAttackPower(attacker, weatherId, kind);
  const defense = Math.max(calculateLegacyDefensePower(defender, weatherId), 1);
  const mastery = attacker[definition.mastery];
  const fluctuationPercent = random.int(-Math.min(definition.damageFluctuation, 99), Math.min(definition.damageFluctuation, 99));
  let primaryDamage = Math.round((attack / defense) * mastery * definition.damagePerMastery * ((100 + fluctuationPercent) / 100) * random.int(4, 10) / 10);
  primaryDamage = Math.max(primaryDamage, 1);
  let fixedDamage = 0;
  if (kind === "F") fixedDamage = attacker.wepe;
  if (kind === "J") fixedDamage = Math.min(Math.round(defender.mhp / 3), 20_000) + Math.round(attacker.wepe * 2 / 3);
  let spiritMultiplier = 1;
  let staminaSpent = 0;
  if (kind === "F") {
    const fullCost = Math.max(Math.round(0.2 * attacker.wepe), 1);
    staminaSpent = Math.min(attacker.sp - 1, fullCost);
    spiritMultiplier = Math.round((0.5 + staminaSpent / fullCost * 0.5) * 100) / 100;
    attacker.sp -= staminaSpent;
  }
  const heavyWeaponPenalty = defender.wepk.includes("J") ? 1.5 : 1;
  const damage = Math.round((primaryDamage + fixedDamage) * spiritMultiplier * heavyWeaponPenalty);
  return { damage, primaryDamage, fixedDamage, fluctuationPercent, spiritMultiplier, staminaSpent };
}

export function getLegacyWeaponRange(player: LegacyCombatant, kind = getLegacyAttackMethod(player)): number {
  let range = LEGACY_WEAPONS[kind].range;
  if (kind === "B") range += Math.min(Math.floor(player.wc / 200), 3);
  return range;
}

export function canLegacyWeaponCounter(counter: LegacyCombatant, attacker: LegacyCombatant, random: LegacyRandom): boolean {
  const counterKind = getLegacyAttackMethod(counter);
  const attackerKind = getLegacyAttackMethod(attacker);
  const counterRange = getLegacyWeaponRange(counter, counterKind);
  const attackerRange = getLegacyWeaponRange(attacker, attackerKind);
  if (counterRange < attackerRange || counterRange === 0 || attackerRange === 0) return false;
  if (!legacyCanCounter(counter.pose, counter.tactic)) return false;
  return random.int(0, 99) < LEGACY_WEAPONS[counterKind].counterOdds + legacyCounterRateBonus(counter.tactic);
}

export function shouldImpairLegacyWeapon(kind: LegacyWeaponKind, hit: boolean, random: LegacyRandom): boolean {
  const rate = LEGACY_WEAPONS[kind].impairmentRate;
  if (!hit && rate < 1000) return false;
  return random.int(0, 99) < rate;
}

export type LegacyArmorSlot = "arb" | "arh" | "ara" | "arf";
export interface LegacyArmor extends LegacyItem { slot: LegacyArmorSlot; }

/** Direct port of armor\armor_hurt() for one equipped piece. */
export function hurtLegacyArmor(armor: LegacyArmor, amount: number): { absorbed: number; broken: boolean } {
  if (armor.itme <= 0 || !armor.itms) return { absorbed: 0, broken: false };
  if (armor.itms === LEGACY_INFINITE_DURABILITY) {
    const absorbed = Math.min(armor.itme, amount);
    armor.itme -= absorbed;
    return { absorbed, broken: armor.itme <= 0 };
  }
  const absorbed = Math.min(Number(armor.itms), amount);
  armor.itms = Number(armor.itms) - absorbed;
  return { absorbed, broken: Number(armor.itms) <= 0 };
}
