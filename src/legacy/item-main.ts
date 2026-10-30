/**
 * Port of the item helpers in the original's base/itemmain module.
 *
 * These classify items, decide what can be equipped or dropped, and find
 * free pack slots — the checks the inventory commands run before anything
 * changes. Each follows PHP's own rules: `!$itms` is PHP truthiness, so the
 * string "0" counts as absent; strpos()===0 is a byte prefix test; and the
 * two validity checks append to the logger's buffer as well as returning,
 * which the callers rely on.
 *
 * Held to the original by test/legacy-item-main.parity.test.mjs.
 */
import { PHP_BUILTINS } from "./template/builtins";
import { PhpArray, toBool, toStringValue, type PhpValue } from "./template/values";
import { toPhpValue, type ModuleVariables } from "./map-area";

/**
 * Accepts a plain object or array as well as a PhpArray, because callers
 * pass rows straight from JSON. Left unconverted, a row reads as an empty
 * array and every field comes back null — and PHP's `null == ""` is true,
 * so a missing name silently matched an empty winner field.
 */
function asArray(value: unknown): PhpArray {
  const converted = toPhpValue(value);
  return converted instanceof PhpArray ? converted : new PhpArray();
}

/** The original's message when an item slot holds nothing usable. */
export const ITEM_MISSING_LOG = "该物品不存在！<br>";

/**
 * Merge class of an item kind: 1 for stackables, 2 for health and power
 * items, 0 otherwise. The second pattern excludes three-letter W kinds,
 * which are weapons rather than stackable materials.
 */
export function checkMergable(itemKind: PhpValue): number {
  const kind = toStringValue(itemKind);
  if (/^(WC|WD|WF|Y|B|C|EI|TN|G|M|V|ygo|fy|p|EA)/.test(kind) && !/^W[A-Z][A-Z]/.test(kind)) return 1;
  if (/^(H|P)/.test(kind)) return 2;
  return 0;
}

/**
 * replace_in_itmsk is deliberately absent.
 *
 * The base implementation is a plain str_replace, but attrbase overrides it
 * to handle compound attributes, and the override is what the running game
 * dispatches to: against the original, replace_in_itmsk('^','#','s^001')
 * answers "s#", not the "s#001" the base body would produce. Porting the
 * base body alone would have looked correct in isolation and been wrong in
 * the game, so it waits for attrbase.
 */

export function replaceCrlf(value: PhpValue): string {
  return toStringValue(PHP_BUILTINS.str_replace?.(["<!--CRLF-->", "<BR />", value]) ?? "");
}

/**
 * parse_itmk_desc and parse_itmuse_desc are deliberately absent, for the
 * same reason as replace_in_itmsk.
 *
 * Their base bodies are `return '';`, which reads as trivial and is not:
 * an empty base body is how this codebase marks an override point, and the
 * weapon modules fill them in. Against the running game
 * parse_itmk_desc('WC','s') answers "攻击方式为投掷，依赖投熟", not the empty
 * string the base body returns. A stub body is a signal, not a cheap port.
 */

/** `if(!empty($itemspkinfo[$str])) return $itemspkinfo[$str]; return '';` */
export function getItmskWordsSingle(vars: ModuleVariables, key: PhpValue): PhpValue {
  const table = asArray(vars.get("itemmain", "itemspkinfo"));
  const value = table.get(key);
  return toBool(value) ? value : "";
}

/** `if(!empty($itemspkdesc[$str])) return $itemspkdesc[$str]; return '';` */
export function getItmskDescSingle(vars: ModuleVariables, key: PhpValue): PhpValue {
  const table = asArray(vars.get("itemmain", "itemspkdesc"));
  const value = table.get(key);
  return toBool(value) ? value : "";
}

/** True when the kind starts with any configured equipable prefix. */
export function isEquipable(vars: ModuleVariables, itemKind: PhpValue): boolean {
  const kind = toStringValue(itemKind);
  for (const prefix of asArray(vars.get("itemmain", "itemkind_equipable")).values()) {
    if (kind.startsWith(toStringValue(prefix))) return true;
  }
  return false;
}

/** `if(!empty($item_allow_find_and_use)) return true; else return false;` */
export function getItemAllowFindAndUse(vars: ModuleVariables): boolean {
  return toBool(vars.get("itemmain", "item_allow_find_and_use"));
}

/** A validity check's answer together with what it appended to the log. */
export interface ItemCheckResult {
  readonly ok: boolean;
  /** Appended to the logger's buffer; empty when the check passed. */
  readonly log: string;
}

/**
 * `if(!$itms||!$itmk||$itmk=='WN'||$itmk=='DN')` — PHP truthiness, so a
 * count of "0" or an empty kind both mean the slot holds nothing. WN and DN
 * are the placeholder kinds for an empty weapon and armour slot.
 */
function itemSlotIsEmpty(itms: PhpValue, itmk: PhpValue): boolean {
  if (!toBool(itms) || !toBool(itmk)) return true;
  const kind = toStringValue(itmk);
  return kind === "WN" || kind === "DN";
}

export function itemdropValidCheck(itms: PhpValue, itmk: PhpValue): ItemCheckResult {
  if (itemSlotIsEmpty(itms, itmk)) return { ok: false, log: ITEM_MISSING_LOG };
  return { ok: true, log: "" };
}

export function itemoffValidCheck(itms: PhpValue, itmk: PhpValue): ItemCheckResult {
  if (itemSlotIsEmpty(itms, itmk)) return { ok: false, log: ITEM_MISSING_LOG };
  return { ok: true, log: "" };
}

/**
 * First free pack slot, or 0 when the pack is full.
 *
 * The original reads ${'itms'.$i} for i in 1..6, a variable variable over
 * the player module's six slot counts.
 */
export function getPackBlank(vars: ModuleVariables): number {
  for (let slot = 1; slot <= 6; slot++) {
    if (!toBool(vars.get("player", `itms${slot}`))) return slot;
  }
  return 0;
}
