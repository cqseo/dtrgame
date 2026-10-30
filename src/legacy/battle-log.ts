/**
 * Port of the battle-log text helpers in base/battle and base/attack.
 *
 * Both produce text a player reads during combat, written from that
 * player's own point of view: the same event says "you" to one side and
 * names the other. Getting the perspective backwards would swap attacker
 * and defender in every line of a fight.
 *
 * Held to the original by test/legacy-battle-log.parity.test.mjs.
 */
import { PhpArray, toBool, toNumber, toStringValue, type PhpValue } from "./template/values";
import { toPhpValue } from "./map-area";

const asArray = (value: unknown): PhpArray => {
  const converted = toPhpValue(value);
  return converted instanceof PhpArray ? converted : new PhpArray();
};

/**
 * Fills the two name placeholders in a stored battle log line.
 *
 * `active` is the viewing player's side: the attacker reads "你" for
 * themselves and the defender's name for the other, and the defender reads
 * the reverse. The original substitutes the defender's placeholder first;
 * the order only matters if a name itself contained a placeholder.
 */
export function battlelogParser(
  attacker: unknown,
  defender: unknown,
  active: PhpValue,
  line: PhpValue
): string {
  const attackerName = toNumber(active) ? "你" : toStringValue(asArray(attacker).get("name"));
  const defenderName = toNumber(active) ? toStringValue(asArray(defender).get("name")) : "你";
  return toStringValue(line)
    .split("<:pd_name:>")
    .join(defenderName)
    .split("<:pa_name:>")
    .join(attackerName);
}

/**
 * The line a killer's parting words add to the log, or nothing.
 *
 * Only produced when the defender is down and words were set. Two details
 * matter. The original writes this with an unbraced nested if, so the else
 * belongs to the `$active` test rather than to the outer condition: a
 * living defender yields no line at all, not the other side's wording. And
 * the guard is empty(), so parting words of literally "0" count as unset
 * and print nothing — PHP's falsy "0" again.
 */
export function showPlayerKillwords(
  attacker: unknown,
  defender: unknown,
  active: PhpValue,
  killMessage: PhpValue
): string {
  const defenderRow = asArray(defender);
  if (toNumber(defenderRow.get("hp")) > 0) return "";
  if (!toBool(killMessage)) return "";
  const words = toStringValue(killMessage);

  if (toNumber(active)) {
    const name = toStringValue(defenderRow.get("name"));
    return `<br><span class='b'>你对${name}说道：</span><span class='yellow b'>“${words}”</span><br>`;
  }
  const name = toStringValue(asArray(attacker).get("name"));
  return `<br><span class='b'>${name}对你说道：</span><span class='yellow b'>“${words}”</span><br>`;
}
