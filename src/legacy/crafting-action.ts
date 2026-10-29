import { applyLegacyCraftResult } from "./crafting";
import { legacyScalarTruthy, type LegacyItem } from "./item";
import { getLegacyCraftOptions, type LegacyCraftOption } from "./special-crafting";

export function legacyMixMask(slots: readonly number[]): number {
  return slots.reduce((mask, slot) => slot >= 1 && slot <= 6 ? mask | (1 << (Math.trunc(slot) - 1)) : mask, 0);
}

export function legacySlotsFromMixMask(mask: number): number[] {
  return [1, 2, 3, 4, 5, 6].filter(slot => !!(mask & (1 << (slot - 1))));
}

export function validateLegacyCraftSlots(inventory: readonly LegacyItem[], slots: readonly number[]): { ok: boolean; logHtml: string } {
  if (new Set(slots).size !== slots.length) return { ok: false, logHtml: "相同道具不能进行合成！<br>" };
  if (slots.length < 2) return { ok: false, logHtml: "至少需要2个道具才能进行合成！" };
  if (slots.some(slot => !Number.isInteger(slot) || slot < 1 || slot > 6 || !legacyScalarTruthy(inventory[slot - 1]?.itm))) return { ok: false, logHtml: "所选择的道具不存在！" };
  return { ok: true, logHtml: "" };
}

export interface LegacyCraftActionResult {
  status: "invalid" | "no-match" | "choose" | "crafted";
  options: LegacyCraftOption[];
  mixMask: number;
  logHtml: string;
  workDelta: number;
  /** Original itm0: the caller must run the original itemget/pickup workflow. */
  result?: LegacyItem;
  drops?: LegacyItem[];
}

/** Validates one-based slots before any mutation; choices leave all materials intact. */
export function runLegacyCraftAction(inventory: LegacyItem[], slots: readonly number[], selection = -1, club = 0, gameType = 0): LegacyCraftActionResult {
  const base = { options: [] as LegacyCraftOption[], mixMask: legacyMixMask(slots), logHtml: "", workDelta: 0 };
  const check = validateLegacyCraftSlots(inventory, slots);
  if (!check.ok) return { ...base, status: "invalid", logHtml: check.logHtml };
  const materials = slots.map(slot => inventory[slot - 1]!);
  const options = getLegacyCraftOptions(materials);
  if (!options.length) return { ...base, options, status: "no-match", logHtml: `<span class="yellow b">${materials.map(item => item.itm).join(" ")}</span>不能合成！<br>` };
  if (options.length > 1 && selection < 0) return { ...base, options, status: "choose" };
  const selected = options.length === 1 ? options[0] : Number.isInteger(selection) ? options[selection] : undefined;
  if (!selected) return { ...base, options, status: "invalid", logHtml: "错误的合成选项。<br>" };
  return { ...base, options, status: "crafted", ...applyLegacyCraftResult(materials, selected.result, club, selected.type, gameType) };
}

/** PHP full_combination order: length first, then ascending slot combinations. */
export function availableLegacyCraftCombinations(inventory: readonly LegacyItem[]): { slots: number[]; options: LegacyCraftOption[] }[] {
  const occupied = [1, 2, 3, 4, 5, 6].filter(slot => legacyScalarTruthy(inventory[slot - 1]?.itms));
  const results: { slots: number[]; options: LegacyCraftOption[] }[] = [];
  const visit = (start: number, count: number, slots: number[]) => {
    if (!count) {
      const options = getLegacyCraftOptions(slots.map(slot => inventory[slot - 1]!));
      if (options.length) results.push({ slots: [...slots], options });
      return;
    }
    for (let index = start; index <= occupied.length - count; index++) visit(index + 1, count - 1, [...slots, occupied[index]!]);
  };
  for (let count = 2; count <= occupied.length; count++) visit(0, count, []);
  return results;
}
