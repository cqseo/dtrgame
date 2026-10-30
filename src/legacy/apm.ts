/**
 * Port of the actions-per-minute figures in base/apm and the skill-tag check
 * in base/skillbase.
 *
 * The APM numbers appear on the results screen, and both guard against
 * dividing by zero in their own way: the live figure floors the elapsed
 * minutes at one, while the winner's figure does not, so a match shorter
 * than a minute inflates it. That difference is the original's and is kept.
 *
 * Held to the original by test/legacy-apm.parity.test.mjs.
 */
import { PHP_BUILTINS } from "./template/builtins";
import { PhpArray, toNumber, toStringValue, type PhpValue } from "./template/values";
import { toPhpValue, type ModuleVariables } from "./map-area";

const asArray = (value: unknown): PhpArray => {
  const converted = toPhpValue(value);
  return converted instanceof PhpArray ? converted : new PhpArray();
};

/** PHP's round(), which takes halves away from zero. */
const round = (value: number): number => toNumber(PHP_BUILTINS.round?.([value]) ?? 0);

/** A value counts as set when the key exists and is not null, as isset() does. */
const isSet = (row: PhpArray, key: string): boolean => row.has(key) && row.get(key) !== null;

/**
 * Whether a skill carries a tag.
 *
 * The tag list lives in the MOD_SKILL<n>_INFO constant as semicolon-
 * separated entries. The needle is normalised by stripping every semicolon
 * and appending one, so "club" and "club;" both match but "lub" does not.
 */
export function checkSkillInfo(
  skillNumber: PhpValue,
  tag: PhpValue,
  constants: ReadonlyMap<string, string>
): boolean {
  const needle = `${toStringValue(tag).split(";").join("")};`;
  const info = constants.get(`MOD_SKILL${toStringValue(skillNumber)}_INFO`);
  return info !== undefined && info.includes(needle);
}

/**
 * Live actions per minute for a player.
 *
 * While a match is running and the player is alive the elapsed time runs to
 * now; otherwise it stops at their end time. Minutes are floored at one, so
 * an early death cannot divide by zero.
 */
export function calcApm(
  vars: ModuleVariables,
  player: unknown,
  useEndtime: PhpValue = 0
): PhpArray {
  const row = asArray(player);
  const gamestate = toNumber(vars.get("sys", "gamestate"));
  const now = toNumber(vars.get("sys", "now"));

  const live = !PHP_BUILTINS.boolval?.([useEndtime]) && toNumber(row.get("hp")) > 0 && gamestate >= 20;
  const judgeTime = live ? now : toNumber(row.get("endtime"));

  let minutes = (judgeTime - toNumber(row.get("validtime"))) / 60;
  if (minutes < 1) minutes = 1;

  return PhpArray.from([
    round((toNumber(row.get("v_actionnum")) / minutes) * 10) / 10,
    round((toNumber(row.get("a_actionnum")) / minutes) * 10) / 10
  ]);
}

/**
 * The winner's actions per minute on the results screen.
 *
 * A row with neither counter reports "-" for both. An older row that only
 * carries the combined `actionnum` has it read as the viewing figure. Unlike
 * calc_apm this does not floor the elapsed minutes, so a very short match
 * produces a correspondingly large number.
 */
export function calcWinnerApm(player: unknown, judgeTime: PhpValue): PhpArray {
  const row = asArray(player);

  if (!isSet(row, "v_actionnum") && !isSet(row, "actionnum")) {
    return PhpArray.from(["-", "-"]);
  }
  if (!isSet(row, "v_actionnum") && isSet(row, "actionnum")) {
    row.set("v_actionnum", row.get("actionnum"));
  }

  const minutes = toNumber(judgeTime) / 60;
  const hasAttackCount = isSet(row, "a_actionnum");

  return PhpArray.from([
    hasAttackCount ? round((toNumber(row.get("v_actionnum")) / minutes) * 10) / 10 : "-",
    hasAttackCount ? round((toNumber(row.get("a_actionnum")) / minutes) * 10) / 10 : "-"
  ]);
}
