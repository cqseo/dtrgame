/**
 * Port of the avatar-filename helpers in core/player and the small event
 * hooks in base/event.
 *
 * The filename pair decides which images a player's avatar resolves to, so
 * getting the extension handling wrong points the page at files that do not
 * exist. The event hooks are the unmodified base behaviour that modules
 * wrap; each is the sole implementation of its name.
 *
 * Held to the original by test/legacy-player-icon.parity.test.mjs.
 */
import { PHP_BUILTINS } from "./template/builtins";
import { PhpArray, toBool, toStringValue, type PhpValue } from "./template/values";
import { toPhpValue, type ModuleVariables } from "./map-area";

const isNumeric = (value: PhpValue): boolean => Boolean(PHP_BUILTINS.is_numeric?.([value]));

/** PHP's pathinfo(..., PATHINFO_EXTENSION): after the last dot, else "". */
function pathExtension(path: string): string {
  const base = path.slice(path.lastIndexOf("/") + 1);
  const dot = base.lastIndexOf(".");
  return dot === -1 ? "" : base.slice(dot + 1);
}

/**
 * The normal and highlighted image names for an avatar.
 *
 * A numeric icon is a numbered gif for the gender, where "n" stands in for
 * an NPC. A named icon keeps its own filename and gains an "_a" variant
 * before the extension.
 *
 * substr($icon, 0, -strlen($ext) - 1) is the original's way of dropping the
 * extension, and when a named icon has no extension at all that length is
 * -1, so it drops the last character instead. Reproduced rather than
 * corrected.
 */
export function iconParserNameFormat(type: PhpValue, gender: PhpValue, icon: PhpValue): PhpArray {
  if (isNumeric(icon)) {
    const genderCode = toBool(type) ? "n" : toStringValue(gender);
    return PhpArray.from([`${genderCode}_${toStringValue(icon)}.gif`, `${genderCode}_${toStringValue(icon)}a.gif`]);
  }
  const name = toStringValue(icon);
  const extension = pathExtension(name);
  const stem = name.slice(0, name.length - extension.length - 1);
  return PhpArray.from([name, `${stem}_a.${extension}`]);
}

/**
 * The lowest and highest selectable avatar number for a gender. Anything
 * other than "f" or "m" is treated as "f".
 */
export function getIconNumLimit(vars: ModuleVariables, gender: PhpValue = "f"): PhpArray {
  const code = toStringValue(gender) === "m" ? "m" : "f";
  const ranges = toPhpValue(vars.get("player", "pc_icon_range"));
  const range = ranges instanceof PhpArray ? ranges.get(code) : null;
  const pair = range instanceof PhpArray ? range : new PhpArray();
  return PhpArray.from([pair.get(0), pair.get(1)]);
}

/** `return !$evret;` — an event that returned nothing lets the turn continue. */
export function canContinuePostEventProc(eventResult: PhpValue): boolean {
  return !toBool(eventResult);
}

/** Base behaviour: the win rate passes through untouched. */
export function eventWinrateProcess(winrate: PhpValue): PhpValue {
  return winrate;
}

/** Base behaviour: the escape rate passes through untouched. */
export function eventEscrateProcess(escrate: PhpValue): PhpValue {
  return escrate;
}
