import { legacyEdibleRecovery } from "./stance";

export const LEGACY_INFINITE_DURABILITY = "∞";
export const LEGACY_NO_ATTRIBUTE = "--";
export const LEGACY_INVENTORY_SIZE = 6;
export const LEGACY_BASE_ITEM_FIND_ODDS = 60;
export const LEGACY_NO_ITEM_DROP_AREAS = [0, 34] as const;

export type LegacyDurability = number | string;

/** Exact five-column item representation used by players, map items and corpses. */
export interface LegacyItem {
  itm: string;
  itmk: string;
  itme: number;
  itms: LegacyDurability;
  itmsk: string;
}

/** Original mapitem row after the room prefix has selected the active table. */
export interface LegacyMapItem extends LegacyItem {
  iid: number;
  pls: number;
}

export interface LegacyEdiblePlayer {
  hp: number;
  mhp: number;
  sp: number;
  msp: number;
  pose: number;
}

export const emptyLegacyItem = (): LegacyItem => ({ itm: "", itmk: "", itme: 0, itms: 0, itmsk: "" });

/** PHP empty() semantics for the scalar values stored in item durability fields. */
export function legacyScalarTruthy(value: LegacyDurability | string | null | undefined): boolean {
  return value !== undefined && value !== null && value !== 0 && value !== "" && value !== "0";
}

export const isLegacyItemEmpty = (item: LegacyItem): boolean => !legacyScalarTruthy(item.itms);

export function clearLegacyItem(item: LegacyItem): void {
  item.itm = "";
  item.itmk = "";
  item.itme = 0;
  item.itms = 0;
  item.itmsk = "";
}

/** Direct port of itemmain\check_mergable(). */
export function getLegacyMergeType(kind: string): 0 | 1 | 2 {
  if (/^(WC|WD|WF|Y|B|C|EI|TN|G|M|V|ygo|fy|p|EA)/.test(kind) && !/^W[A-Z][A-Z]/.test(kind)) return 1;
  if (/^(H|P)/.test(kind)) return 2;
  return 0;
}

/** Direct port of itemmain\get_itmsk_array(). */
export function parseLegacyAttributes(value: string, includeSeparators = false): string[] {
  const result: string[] = [];
  let index = 0;
  while (index < value.length) {
    let attribute = value.slice(index, index + 1);
    index += 1;
    if (!attribute || attribute === "0" || (!includeSeparators && attribute === "|")) continue;
    if (attribute === "^") {
      let beforeFirstDigit = true;
      while (index < value.length) {
        const character = value[index]!;
        if (character >= "0" && character <= "9") beforeFirstDigit = false;
        else if (!beforeFirstDigit) break;
        attribute += character;
        index += 1;
      }
    }
    result.push(attribute);
  }
  return result;
}

/** Direct port of the base itemmain\check_in_itmsk() implementation. */
export function checkLegacyAttribute(mark: string, attributes: string | readonly string[], count = false): boolean | number {
  const parsed = typeof attributes === "string" ? parseLegacyAttributes(attributes) : attributes;
  if (!parsed.includes(mark)) return false;
  if (!count) return true;
  return parsed.filter((attribute) => attribute === mark).length;
}

export function reduceLegacyItem(item: LegacyItem, amount = 1): string {
  if (item.itms === LEGACY_INFINITE_DURABILITY) return "";
  item.itms = Number(item.itms) - amount;
  if (Number(item.itms) > 0) return "";
  const name = item.itm;
  clearLegacyItem(item);
  return `<span class="red b">${name}</span>用光了。<br>`;
}

export interface LegacyItemMergeResult {
  merged: boolean;
  logHtml: string;
}

/** Direct port of itemmain\itemmerge() after slot validation. */
export function mergeLegacyItems(source: LegacyItem, target: LegacyItem): LegacyItemMergeResult {
  if (isLegacyItemEmpty(source) || isLegacyItemEmpty(target)) return { merged: false, logHtml: "请选择正确的物品进行合并！" };
  if (source.itms === LEGACY_INFINITE_DURABILITY || target.itms === LEGACY_INFINITE_DURABILITY) return { merged: false, logHtml: "耐久是无限的物品不能合并！" };
  if (source.itm !== target.itm || source.itme !== target.itme) {
    return { merged: false, logHtml: `<span class="yellow b">${source.itm}</span>与<span class="yellow b">${target.itm}</span>不是同名同效果物品，不能合并！` };
  }

  if (source.itmk === target.itmk && source.itmsk === target.itmsk && getLegacyMergeType(source.itmk) === 1) {
    target.itms = Number(target.itms) + Number(source.itms);
    const targetName = target.itm;
    clearLegacyItem(source);
    return { merged: true, logHtml: `你合并了<span class="yellow b">${targetName}</span>。` };
  }

  if (getLegacyMergeType(source.itmk) === 2 && getLegacyMergeType(target.itmk) === 2 && source.itmk.slice(1, 2) === target.itmk.slice(1, 2)) {
    if (source.itmk.startsWith("P") || target.itmk.startsWith("P")) {
      const poison1 = Number.parseInt(source.itmk.slice(2), 10) || 0;
      const poison2 = Number.parseInt(target.itmk.slice(2), 10) || 0;
      target.itmk = `P${source.itmk.slice(1, 2)}${Math.max(poison1, poison2)}`;
      if (source.itmsk) target.itmsk = source.itmsk;
    }
    target.itms = Number(target.itms) + Number(source.itms);
    const targetName = target.itm;
    clearLegacyItem(source);
    return { merged: true, logHtml: `你合并了 <span class="yellow b">${targetName}</span>。` };
  }

  if (source.itmk !== target.itmk || source.itmsk !== target.itmsk) {
    return { merged: false, logHtml: `<span class="yellow b">${source.itm}</span>与<span class="yellow b">${target.itm}</span>不是同类型同属性物品，不能合并！` };
  }
  return { merged: false, logHtml: `<span class="yellow b">${source.itm}</span>与<span class="yellow b">${target.itm}</span>不是可以堆叠的物品，不能合并！` };
}

export function getLegacyPackBlank(inventory: readonly LegacyItem[]): number {
  for (let index = 0; index < LEGACY_INVENTORY_SIZE; index += 1) if (!legacyScalarTruthy(inventory[index]?.itms)) return index + 1;
  return 0;
}

/** Uses original one-based backpack positions and mutates the inventory in place. */
export function moveLegacyInventoryItem(inventory: LegacyItem[], from: number, to: number): LegacyItemMergeResult {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 1 || to < 1 || from > 6 || to > 6) return { merged: false, logHtml: "错误的包裹位置参数。<br>" };
  if (from === to) return { merged: false, logHtml: "同一物品无法互换。<br>" };
  const source = inventory[from - 1];
  const target = inventory[to - 1];
  if (!source || isLegacyItemEmpty(source)) return { merged: false, logHtml: "错误的道具参数。<br>" };
  const destination = target ?? emptyLegacyItem();
  inventory[to - 1] = source;
  inventory[from - 1] = destination;
  if (isLegacyItemEmpty(destination)) return { merged: true, logHtml: `将<span class="yellow b">${source.itm}</span>移动到了<span class="yellow b">包裹${to}</span>。<br>` };
  return { merged: true, logHtml: `将<span class="yellow b">${source.itm}</span>与<span class="yellow b">${destination.itm}</span>互换了位置。<br>` };
}

export interface LegacyEdibleResult {
  handled: boolean;
  consumed: boolean;
  hpRecovered: number;
  spRecovered: number;
  logHtml: string;
}

/** Direct composition of edible\itemuse_edible() with the enabled pose hook. */
export function useLegacyEdible(player: LegacyEdiblePlayer, item: LegacyItem): LegacyEdibleResult {
  const result: LegacyEdibleResult = { handled: false, consumed: false, hpRecovered: 0, spRecovered: 0, logHtml: "" };
  const isStamina = item.itmk.startsWith("HS");
  const isHealth = item.itmk.startsWith("HH");
  const isBoth = item.itmk.startsWith("HB");
  if (!isStamina && !isHealth && !isBoth) return result;
  result.handled = true;
  if (isStamina && player.sp >= player.msp) { result.logHtml = "你的体力不需要恢复。<br>"; return result; }
  if (isHealth && player.hp >= player.mhp) { result.logHtml = "你的生命不需要恢复。<br>"; return result; }
  if (isBoth && player.hp >= player.mhp && player.sp >= player.msp) { result.logHtml = "你的生命和体力都不需要恢复。<br>"; return result; }

  const effect = legacyEdibleRecovery(player.pose, item.itme);
  result.hpRecovered = isHealth || isBoth ? Math.max(0, Math.min(player.mhp - player.hp, effect)) : 0;
  result.spRecovered = isStamina || isBoth ? Math.max(0, Math.min(player.msp - player.sp, effect)) : 0;
  player.hp += result.hpRecovered;
  player.sp += result.spRecovered;
  const name = item.itm;
  let recoveryText = "";
  if (result.hpRecovered > 0) recoveryText += `<span class="yellow b">${result.hpRecovered}</span>点生命`;
  if (result.spRecovered > 0) recoveryText += `${result.hpRecovered > 0 ? "和" : ""}<span class="yellow b">${result.spRecovered}</span>点体力`;
  result.logHtml = `你使用了<span class="lime b">${name}</span>${recoveryText ? `，恢复了${recoveryText}。<br>` : "。这东西味同嚼蜡，吃了跟没吃一样。<br>"}`;
  result.consumed = true;
  result.logHtml += reduceLegacyItem(item);
  return result;
}
