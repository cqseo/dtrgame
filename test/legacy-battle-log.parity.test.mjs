import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import { battlelogParser, showPlayerKillwords } from "../src/legacy/battle-log";

/**
 * Holds the battle-log text helpers to the original.
 *
 * Both write from the viewing player's point of view, so a mistake swaps
 * attacker and defender in every line of a fight. show_player_killwords
 * uses an unbraced nested if, which means a living defender produces no
 * line at all rather than the other side's wording; the cases cover that.
 *
 * Run through `npm run test:php-parity`.
 */
const BOOTSTRAP = { bootstrap: "full" };

const ATTACKER = { name: "攻击者", hp: 80 };
const DEFENDERS = [
  { name: "防御者", hp: 0 },
  { name: "防御者", hp: 10 },
  { name: "", hp: 0 },
  { name: "<:pa_name:>", hp: 0 }
];

const LINES = [
  "<:pa_name:>攻击了<:pd_name:>！",
  "<:pd_name:>躲开了<:pa_name:>的攻击",
  "没有占位符的一行",
  "",
  "<:pa_name:><:pa_name:><:pd_name:>",
  "<:pd_name:>"
];

describe.skipIf(!hasOracle)("battle log helpers against the original", () => {
  it("matches battlelog_parser from both sides", () => {
    const cases = [];
    for (const defender of DEFENDERS) {
      for (const active of [1, 0]) {
        for (const line of LINES) cases.push([ATTACKER, defender, active, line]);
      }
    }
    const expected = callOriginal(
      cases.map(args => ({ fn: "\\battle\\battlelog_parser", args })),
      BOOTSTRAP
    );
    const differences = [];
    cases.forEach((args, index) => {
      const reference = expected[index];
      const label = `battlelog_parser(active=${args[2]}, ${JSON.stringify(args[3])}, defender=${JSON.stringify(args[1].name)})`;
      if (!reference?.ok) {
        differences.push(`${label}: original failed: ${reference?.error}`);
        return;
      }
      const mine = battlelogParser(args[0], args[1], args[2], args[3]);
      if (mine !== reference.value) {
        differences.push(`${label}: port ${JSON.stringify(mine)} != original ${JSON.stringify(reference.value)}`);
      }
    });
    expect(differences).toEqual([]);
  });

  it("matches what show_player_killwords appends to the log", () => {
    const messages = ["再见", "", "带<标签>的话", "0"];
    const cases = [];
    for (const defender of DEFENDERS) {
      for (const active of [1, 0]) {
        for (const message of messages) cases.push([ATTACKER, defender, active, message]);
      }
    }
    // The original writes into the logger's buffer rather than returning.
    const expected = callOriginal(
      cases.map(args => ({
        fn: "\\attack\\show_player_killwords",
        args,
        globals: { ___LOCAL_LOGGER__VARS__log: "" },
        read: ["___LOCAL_LOGGER__VARS__log"]
      })),
      BOOTSTRAP
    );
    const differences = [];
    cases.forEach((args, index) => {
      const reference = expected[index];
      const label =
        `show_player_killwords(active=${args[2]}, hp=${args[1].hp}, ${JSON.stringify(args[3])})`;
      if (!reference?.ok) {
        differences.push(`${label}: original failed: ${reference?.error}`);
        return;
      }
      const mine = showPlayerKillwords(args[0], args[1], args[2], args[3]);
      const theirs = reference.globals.___LOCAL_LOGGER__VARS__log ?? "";
      if (mine !== theirs) {
        differences.push(`${label}: port ${JSON.stringify(mine)} != original ${JSON.stringify(theirs)}`);
      }
    });
    expect(differences).toEqual([]);
  });
});
