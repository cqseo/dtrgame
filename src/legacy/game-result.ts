/**
 * Port of the win and settlement helpers in the original's core/sys module.
 *
 * These decide who counts as a winner and how much gold a match pays out,
 * so they run at the point where a game's result becomes permanent on a
 * player's record. The payouts are the original's own numbers and are not
 * rounded, scaled or tidied.
 *
 * Held to the original by test/legacy-game-result.parity.test.mjs.
 */
import { PHP_BUILTINS } from "./template/builtins";
import { PhpArray, looseEquals, toInt, toStringValue, type PhpValue } from "./template/values";
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

/**
 * Whether a name is among the winners.
 *
 * A single winner is compared with `==`, which is PHP's loose comparison,
 * not an identical check; several winners arrive comma-separated and go
 * through in_array(), which is also loose by default.
 */
export function isWinner(name: PhpValue, winner: PhpValue): boolean {
  const field = toStringValue(winner);
  if (!field.includes(",")) return looseEquals(name, winner);
  return Boolean(PHP_BUILTINS.in_array?.([name, PHP_BUILTINS.explode?.([",", field]) ?? null]));
}

/** The user columns a finished match writes back. */
export function getGameoverUdataUpdateFields(): PhpArray {
  return PhpArray.from([
    "username",
    "validgames",
    "wingames",
    "lastwin",
    "credits",
    "gold",
    "u_achievements"
  ]);
}

/** `return $data['money'];` */
export function gameoverCheckMoneyGot(data: unknown): PhpValue {
  return asArray(data).get("money");
}

/**
 * Gold awarded when a match ends.
 *
 * Modes listed in sys.qiegao_ignore_mode pay nothing at all. A winner is
 * paid by how they won — 120 for surviving, 233 for the lifted ban, 514 for
 * dissociation, 100 for anything else — and everyone else gets the 10-gold
 * participation award.
 *
 * Both the `winner` and `winmode` arguments are dead in the original and
 * are dead here. The body opens with eval(import_module('sys')), which
 * expands to `global $winner; global $winmode;` among others, and in PHP
 * that rebinds the name — parameter included — to the module's variable.
 *
 * Checked against the running game: passing winner="alice" while sys.winner
 * is empty pays the 10-gold participation award, and passing winmode=999
 * pays whatever sys.winmode says, 120 at 2 and 514 at 7. Both parameters
 * are kept so call sites translate one to one, and the match's real result
 * is read from the module, as the original does.
 */
export function gameoverGetGoldUp(
  vars: ModuleVariables,
  data: unknown,
  _shadowedWinner: PhpValue = "",
  _shadowedWinmode: PhpValue = 0
): number {
  const ignored = vars.get("sys", "qiegao_ignore_mode");
  if (PHP_BUILTINS.in_array?.([vars.get("sys", "gametype"), ignored])) return 0;

  if (!isWinner(asArray(data).get("name"), vars.get("sys", "winner"))) return 10;

  switch (toInt(vars.get("sys", "winmode"))) {
    case 2:
      return 120;
    case 3:
      return 233;
    case 7:
      return 514;
    default:
      return 100;
  }
}
