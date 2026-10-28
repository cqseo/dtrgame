/**
 * Geographic baseline extracted from the authorized legacy server:
 * include/modules/core/map/config/map.config.php
 * include/modules/base/mapattr/config/mapattr.config.php
 *
 * Retains source location numbers, map coordinates and search/encounter modifiers.
 * No third-party artwork or media is copied. This is a reference rules dataset.
 */
export interface LegacyArea {
  id: string;
  legacyId: number;
  name: string;
  grid: string;
  itemFind: number;
  encounter: number;
  initiative: number;
  shop?: boolean;
  dangerous?: boolean;
  medical?: boolean;
}
export const LEGACY_AREAS = [
  { id: "zone_0", legacyId: 0, name: "无月之影", grid: "B-2", itemFind: -15, encounter: 20, initiative: -5, shop: true, dangerous: true },
  { id: "zone_1", legacyId: 1, name: "端点", grid: "A-6", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_2", legacyId: 2, name: "RF高校", grid: "H-3", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_3", legacyId: 3, name: "雪之镇", grid: "B-6", itemFind: 15, encounter: 0, initiative: 0 },
  { id: "zone_4", legacyId: 4, name: "索拉利斯", grid: "F-10", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_5", legacyId: 5, name: "指挥中心", grid: "D-6", itemFind: -10, encounter: 0, initiative: -5 },
  { id: "zone_6", legacyId: 6, name: "梦幻馆", grid: "H-6", itemFind: -10, encounter: 0, initiative: -5 },
  { id: "zone_7", legacyId: 7, name: "清水池", grid: "F-3", itemFind: 10, encounter: 0, initiative: 0 },
  { id: "zone_8", legacyId: 8, name: "白穗神社", grid: "E-10", itemFind: 5, encounter: 0, initiative: 0 },
  { id: "zone_9", legacyId: 9, name: "墓地", grid: "J-4", itemFind: 0, encounter: 5, initiative: 0 },
  { id: "zone_10", legacyId: 10, name: "麦斯克林", grid: "I-8", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_11", legacyId: 11, name: "对天使用作战本部", grid: "D-8", itemFind: 5, encounter: 0, initiative: 0 },
  { id: "zone_12", legacyId: 12, name: "夏之镇", grid: "F-9", itemFind: 15, encounter: 0, initiative: 0 },
  { id: "zone_13", legacyId: 13, name: "三体星", grid: "H-4", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_14", legacyId: 14, name: "光坂高校", grid: "H-8", itemFind: 5, encounter: 0, initiative: 0, shop: true },
  { id: "zone_15", legacyId: 15, name: "守矢神社", grid: "G-1", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_16", legacyId: 16, name: "常磐森林", grid: "I-2", itemFind: -5, encounter: 0, initiative: 0 },
  { id: "zone_17", legacyId: 17, name: "常磐台中学", grid: "A-5", itemFind: -10, encounter: 0, initiative: -5 },
  { id: "zone_18", legacyId: 18, name: "秋之镇", grid: "G-4", itemFind: 15, encounter: 0, initiative: 0 },
  { id: "zone_19", legacyId: 19, name: "精灵中心", grid: "D-4", itemFind: 0, encounter: 0, initiative: 0, medical: true },
  { id: "zone_20", legacyId: 20, name: "春之镇", grid: "I-7", itemFind: 15, encounter: 0, initiative: 0 },
  { id: "zone_21", legacyId: 21, name: "圣Gradius学园", grid: "F-7", itemFind: 10, encounter: 0, initiative: 0 },
  { id: "zone_22", legacyId: 22, name: "初始之树", grid: "J-6", itemFind: 5, encounter: 0, initiative: 0 },
  { id: "zone_23", legacyId: 23, name: "幻想世界", grid: "A-8", itemFind: 5, encounter: 0, initiative: 0 },
  { id: "zone_24", legacyId: 24, name: "永恒的世界", grid: "C-9", itemFind: 5, encounter: 0, initiative: 0 },
  { id: "zone_25", legacyId: 25, name: "妖精驿站", grid: "D-2", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_26", legacyId: 26, name: "冰封墓场", grid: "A-1", itemFind: -10, encounter: 0, initiative: 0 },
  { id: "zone_27", legacyId: 27, name: "花菱商厦", grid: "F-8", itemFind: 5, encounter: 0, initiative: 0, shop: true },
  { id: "zone_28", legacyId: 28, name: "FARGO前基地", grid: "E-1", itemFind: -5, encounter: 0, initiative: 0 },
  { id: "zone_29", legacyId: 29, name: "风祭森林", grid: "F-5", itemFind: 5, encounter: 0, initiative: 0 },
  { id: "zone_30", legacyId: 30, name: "天使队移动格纳库", grid: "F-6", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_31", legacyId: 31, name: "和田町研究所", grid: "J-1", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_32", legacyId: 32, name: "ＳＣＰ研究设施", grid: "J-2", itemFind: -10, encounter: 10, initiative: -10, dangerous: true },
  { id: "zone_33", legacyId: 33, name: "雏菊之丘", grid: "F-4", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_34", legacyId: 34, name: "英灵殿", grid: "J-10", itemFind: -15, encounter: 20, initiative: -10, dangerous: true }
] as const satisfies readonly LegacyArea[];

export type LegacyAreaId = (typeof LEGACY_AREAS)[number]["id"];

/** Compatibility mapping for Durable Object snapshots created by the 6-area prototype. */
export const PROTOTYPE_AREA_ALIASES: Readonly<Record<string, LegacyAreaId>> = {
  zero_station: "zone_1",
  old_platform: "zone_2",
  signal_corridor: "zone_3",
  shinjuku_ruins: "zone_4",
  memory_market: "zone_14",
  terminal_roof: "zone_27"
};

export function isLegacyAreaId(id: string): id is LegacyAreaId {
  return LEGACY_AREAS.some((area) => area.id === id);
}

export function normalizeSavedArea(id: string): LegacyAreaId {
  return isLegacyAreaId(id) ? id : (PROTOTYPE_AREA_ALIASES[id] ?? "zone_1");
}

export const LEGACY_MAP_RULES = {
  startForbidden: ["zone_0"] as LegacyAreaId[],
  forbiddenPerWave: 4,
  intervalMinutes: 30,
  moveSp: 15,
  searchSp: 15,
  inventorySlots: 6
} as const;
