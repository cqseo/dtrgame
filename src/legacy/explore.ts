export const LEGACY_MOVE_SP_COST = 15;
export const LEGACY_SEARCH_SP_COST = 15;

export interface LegacyExploreCheck {
  allowed: boolean;
  spCost?: number;
  logHtml: string;
}

/** Direct port of explore\allow_move_check() without storage access. */
export function checkLegacyMove(input: {
  currentArea: number;
  destination: number | "main";
  stamina: number;
  availableAreas: readonly number[];
  forbiddenAreas: readonly number[];
  areaNames: readonly string[];
  calculatedCost?: number;
}): LegacyExploreCheck {
  if (input.destination === "main" || !input.availableAreas.includes(input.destination)) return { allowed: false, logHtml: "请选择正确的移动地点。<br>" };
  if (input.currentArea === input.destination) return { allowed: false, logHtml: "相同地点，不需要移动。<br>" };
  if (input.forbiddenAreas.includes(input.destination)) return { allowed: false, logHtml: `${input.areaNames[input.destination]}是禁区，还是离远点吧！<br>` };
  const spCost = Math.max(input.calculatedCost ?? LEGACY_MOVE_SP_COST, 1);
  if (input.stamina <= spCost) return { allowed: false, logHtml: "体力不足，不能移动！<br><span class=\"yellow b\">请选择行动菜单的「睡眠」恢复体力，或使用背包里的体力恢复物品，再尝试移动。</span><br>" };
  return { allowed: true, spCost, logHtml: "" };
}

/** Direct port of explore\allow_search_check() without storage access. */
export function checkLegacySearch(input: { currentArea: number; stamina: number; forbiddenAreas: readonly number[]; areaNames: readonly string[]; calculatedCost?: number }): LegacyExploreCheck {
  if (input.forbiddenAreas.includes(input.currentArea)) return { allowed: false, logHtml: `${input.areaNames[input.currentArea]}是禁区，还是赶快逃跑吧！<br>` };
  const spCost = Math.max(1, input.calculatedCost ?? LEGACY_SEARCH_SP_COST);
  if (input.stamina <= spCost) return { allowed: false, logHtml: "体力不足，不能探索！<br><span class=\"yellow b\">请选择行动菜单的「睡眠」恢复体力，或使用背包里的体力恢复物品，再尝试探索。</span><br>" };
  return { allowed: true, spCost, logHtml: "" };
}

/** Direct port of metman\calculate_meetman_rate_by_mode(). */
export function calculateLegacyMeetCharacterRate(mode: "search" | "move" | "search2", otherPlayerCount: number): number {
  if (otherPlayerCount === 0) return 50;
  if (mode === "search2") return 100;
  const extra = Math.min(otherPlayerCount * 3, 30);
  return (mode === "search" ? 20 : 40) + extra;
}
