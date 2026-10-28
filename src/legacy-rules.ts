/**
 * Mechanic tables taken from the ACFUN DTS legacy module configs.
 * These are data and deterministic rules, not a claim that the old PHP
 * engine or its 700+ specialized modules have been completely ported.
 * Sources:
 * include/modules/base/weather/config/weather.config.php
 * include/modules/base/weapon/weapon/config/weapon.config.php
 * include/modules/base/armor/config/armor.config.php
 * include/modules/base/team/config/team.config.php
 * include/modules/core/map/config/map.config.php
 */
export const WEATHER = [
  { name: "晴天", find: 10, encounter: 10, initiative: 10, attack: 10, defense: 10 },
  { name: "大晴", find: 20, encounter: 20, initiative: 20, attack: 10, defense: 30 },
  { name: "多云", find: 0, encounter: 0, initiative: 0, attack: 0, defense: 0 },
  { name: "小雨", find: -2, encounter: -2, initiative: -5, attack: -5, defense: 0 },
  { name: "暴雨", find: -3, encounter: -3, initiative: -10, attack: -10, defense: -3 },
  { name: "台风", find: -10, encounter: -10, initiative: -20, attack: -20, defense: -15 },
  { name: "雷雨", find: -7, encounter: -7, initiative: -15, attack: -15, defense: -10 },
  { name: "下雪", find: 5, encounter: 5, initiative: 0, attack: 0, defense: 0 },
  { name: "起雾", find: -10, encounter: -10, initiative: -7, attack: 0, defense: -20 },
  { name: "浓雾", find: -20, encounter: -20, initiative: -10, attack: 7, defense: -30 },
  { name: "瘴气", find: 0, encounter: 0, initiative: -10, attack: 20, defense: -50 },
  { name: "龙卷风", find: -7, encounter: -7, initiative: -5, attack: -7, defense: -5 },
  { name: "暴风雪", find: -5, encounter: -5, initiative: 0, attack: -20, defense: -20 },
  { name: "冰雹", find: -30, encounter: -30, initiative: -5, attack: -5, defense: -3 },
  { name: "离子暴", find: -5, encounter: -5, initiative: -20, attack: -10, defense: -20 },
  { name: "辐射尘", find: -20, encounter: -20, initiative: -5, attack: -10, defense: 5 },
  { name: "臭氧洞", find: 0, encounter: 0, initiative: 0, attack: -10, defense: -30 },
  { name: "极光", find: 20, encounter: 20, initiative: 20, attack: 10, defense: 30 }
] as const;

export type WeatherIndex = number;
export const WEAPON_PROFICIENCIES = {
  wp: "殴", wk: "斩", wg: "射", wc: "投", wd: "爆", wf: "灵"
} as const;
export type WeaponProficiency = keyof typeof WEAPON_PROFICIENCIES;
export const EQUIPMENT_PARTS = {
  body: "身体", head: "头部", arms: "手臂", legs: "腿部"
} as const;
export type EquipmentPart = keyof typeof EQUIPMENT_PARTS;
export const TEAM_RULES = { createSp: 200, joinSp: 100, maxMembers: 5 } as const;
export const FORBIDDEN_RULES = { intervalMs: 30 * 60_000, warnBeforeMs: 60_000, perWave: 4, initial: [0] } as const;
export const TRAP_RULES = { minTriggerPercent: 1.5, maxTriggerPercent: 40 } as const;

/** Match the legacy weather table's additive modifiers and relative combat modifiers. */
export function weatherDiscoveryChance(base: number, regionModifier: number, weatherId: number): number {
  const w = WEATHER[weatherId] ?? WEATHER[2];
  return Math.max(0, Math.min(100, base + regionModifier + w.find));
}
export function weatherEncounterChance(base: number, regionModifier: number, weatherId: number): number {
  const w = WEATHER[weatherId] ?? WEATHER[2];
  return Math.max(0, Math.min(100, base + regionModifier + w.encounter));
}
export function weatherAttack(base: number, weatherId: number): number {
  return Math.max(1, Math.round(base * (100 + (WEATHER[weatherId] ?? WEATHER[2]).attack) / 100));
}
export function weatherDefense(base: number, weatherId: number): number {
  return Math.max(0, Math.round(base * (100 + (WEATHER[weatherId] ?? WEATHER[2]).defense) / 100));
}
export function nextAreaDeadline(previous: number, now: number): number {
  const base = Number.isFinite(previous) && previous > 0 ? previous : now + FORBIDDEN_RULES.intervalMs;
  if (base > now) return base;
  return base + (Math.floor((now - base) / FORBIDDEN_RULES.intervalMs) + 1) * FORBIDDEN_RULES.intervalMs;
}
export function shouldWarnArea(now: number, nextAt: number): boolean {
  return Number.isFinite(nextAt) && nextAt > 0 && now >= nextAt - FORBIDDEN_RULES.warnBeforeMs && now < nextAt;
}
export function teamEligibleToJoin(memberIds: readonly string[], candidate: string): boolean {
  return !memberIds.includes(candidate) && memberIds.length < TEAM_RULES.maxMembers;
}
export function detectWeaponFamily(catalogId: string): WeaponProficiency {
  if (/rifle|gun|pistol|bullet|bow|射/i.test(catalogId)) return "wg";
  if (/blade|sword|knife|斩/i.test(catalogId)) return "wk";
  if (/grenade|bomb|爆/i.test(catalogId)) return "wd";
  if (/spirit|magic|灵/i.test(catalogId)) return "wf";
  if (/throw|投/i.test(catalogId)) return "wc";
  return "wp";
}
