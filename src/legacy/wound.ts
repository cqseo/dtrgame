import type { LegacyRandom } from "./random";

export const LEGACY_WOUND_PLACES = "bhaf";
export const LEGACY_BANDAGE_SP_COST = 50;
export const LEGACY_WOUND_NAMES = {
  b: '<span class="red b">胸部受伤</span>',
  h: '<span class="red b">头部受伤</span>',
  a: '<span class="red b">腕部受伤</span>',
  f: '<span class="red b">足部受伤</span>'
} as const;
export const LEGACY_WOUND_SKILL_IDS = { b: 1, h: 2, a: 3, f: 4 } as const;
export const LEGACY_WEAPON_WOUND_PLACES = { N: "b", P: "bha", K: "bhaf", G: "bhaf", C: "bh", D: "bhaf", F: "bhaf", J: "bhaf", B: "bhaf" } as const;
export const LEGACY_WEAPON_WOUND_ODDS = { N: 5, P: 15, K: 55, G: 25, C: 10, D: 55, F: 30, J: 75, B: 40 } as const;

export type LegacyNormalWound = keyof typeof LEGACY_WOUND_NAMES;

export function addLegacyCondition(current: string, condition: string): { value: string; added: boolean } {
  return { value: current.split(condition).join("") + condition, added: !current.includes(condition) };
}

export const healLegacyCondition = (current: string, condition: string): string => current.split(condition).join("");

export function rollLegacyWeaponWound(weaponKind: keyof typeof LEGACY_WEAPON_WOUND_PLACES, random: LegacyRandom): LegacyNormalWound | null {
  const place = LEGACY_WOUND_PLACES[random.int(0, LEGACY_WOUND_PLACES.length - 1)] as LegacyNormalWound;
  if (!LEGACY_WEAPON_WOUND_PLACES[weaponKind].includes(place)) return null;
  return random.int(0, 99) < LEGACY_WEAPON_WOUND_ODDS[weaponKind] ? place : null;
}

export function bandageLegacyWound(player: { inf: string; sp: number }, wound: string): { healed: boolean; logHtml: string } {
  if (!LEGACY_WOUND_PLACES.includes(wound)) {
    return player.inf.includes(wound) ? { healed: false, logHtml: "异常状态不能被直接治疗！" } : { healed: false, logHtml: "你不需要包扎这个伤口！" };
  }
  if (!player.inf.includes(wound)) return { healed: false, logHtml: "你不需要包扎这个伤口！" };
  if (player.sp <= LEGACY_BANDAGE_SP_COST) return { healed: false, logHtml: `包扎伤口需要${LEGACY_BANDAGE_SP_COST}点体力，先回复体力吧！` };
  player.inf = healLegacyCondition(player.inf, wound);
  player.sp -= LEGACY_BANDAGE_SP_COST;
  const shortName = { b: "胸", h: "头", a: "腕", f: "足" }[wound as LegacyNormalWound];
  return { healed: true, logHtml: `消耗<span class="yellow b">${LEGACY_BANDAGE_SP_COST}</span>点体力，<span class="red b">${shortName}</span><span class="red b">部</span>的伤口已经包扎好了！` };
}
