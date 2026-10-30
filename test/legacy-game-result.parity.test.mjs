import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import {
  gameoverCheckMoneyGot,
  gameoverGetGoldUp,
  getGameoverUdataUpdateFields,
  isWinner
} from "../src/legacy/game-result";
import { moduleVariables } from "../src/legacy/map-area";
import { PhpArray } from "../src/legacy/template/values";

/**
 * Holds the win and settlement helpers to the original.
 *
 * These run where a match result becomes permanent on a player's record, so
 * a difference changes who is credited with a win and how much gold they
 * keep. is_winner uses PHP's loose comparison, which the cases exercise
 * with the numeric-string pairs where it and a strict check disagree.
 *
 * Run through `npm run test:php-parity`.
 */
const BOOTSTRAP = { bootstrap: "core" };

function seedGlobals(values) {
  const globals = {};
  for (const [key, value] of Object.entries(values)) {
    const [module, name] = key.split(".");
    globals[`___LOCAL_${module.toUpperCase()}__VARS__${name}`] = value;
  }
  return globals;
}

function plain(value) {
  if (!(value instanceof PhpArray)) return value;
  const keys = value.keys();
  if (keys.every((key, index) => key === index)) return value.values().map(plain);
  return Object.fromEntries(value.pairs().map(([key, item]) => [String(key), plain(item)]));
}

/** Names and winner fields, including the loose-comparison edges. */
const WINNER_CASES = [
  ["alice", "alice"],
  ["alice", "bob"],
  ["alice", "alice,bob"],
  ["bob", "alice,bob"],
  ["carol", "alice,bob"],
  ["alice", ""],
  ["", ""],
  ["", "alice"],
  ["0", "0"],
  [0, "0"],
  ["1", 1],
  ["01", "1"],
  ["1", "01"],
  ["abc", 0],
  [0, "abc"],
  ["alice", "alice,"],
  ["", "alice,"],
  ["2", "1,2,3"],
  [2, "1,2,3"],
  ["02", "1,2,3"]
];

describe.skipIf(!hasOracle)("win and settlement helpers against the original", () => {
  it("matches is_winner, including PHP's loose comparison", () => {
    const expected = callOriginal(
      WINNER_CASES.map(args => ({ fn: "\\sys\\is_winner", args })),
      BOOTSTRAP
    );
    WINNER_CASES.forEach((args, index) => {
      expect(isWinner(args[0], args[1]), `is_winner(${JSON.stringify(args)})`).toBe(expected[index].value);
    });
  });

  it("matches the user columns a finished match writes back", () => {
    const [reference] = callOriginal(
      [{ fn: "\\sys\\get_gameover_udata_update_fields", args: [] }],
      BOOTSTRAP
    );
    expect(plain(getGameoverUdataUpdateFields())).toEqual(reference.value);
  });

  it("matches gameover_check_money_got", () => {
    const rows = [{ money: 100 }, { money: 0 }, { money: "250" }, { money: null }, {}];
    const expected = callOriginal(
      rows.map(data => ({ fn: "\\sys\\gameover_check_money_got", args: [data] })),
      BOOTSTRAP
    );
    rows.forEach((data, index) => {
      expect(gameoverCheckMoneyGot(data), JSON.stringify(data)).toBe(expected[index].value);
    });
  });

  it("matches gameover_get_gold_up across win modes and ignored game types", () => {
    // sys.winner is what the function actually reads; its winner argument is
    // shadowed by import_module('sys'), so it is varied here instead.
    const scenarios = [];
    for (const winner of ["alice", "alice,bob", "", "carol"]) {
      scenarios.push(
        { label: `ordinary, winner=${winner || "none"}`,
          vars: { "sys.gametype": 0, "sys.qiegao_ignore_mode": [], "sys.winner": winner } },
        { label: `ignored mode, winner=${winner || "none"}`,
          vars: { "sys.gametype": 3, "sys.qiegao_ignore_mode": [3, 4], "sys.winner": winner } },
        { label: `mode outside ignore list, winner=${winner || "none"}`,
          vars: { "sys.gametype": 5, "sys.qiegao_ignore_mode": [3, 4], "sys.winner": winner } }
      );
    }
    // sys.winmode is what the function reads; its winmode argument is
    // shadowed by import_module('sys') just as winner is.
    const winmodes = [0, 1, 2, 3, 7, 9, "2", "3"];
    const players = [{ name: "alice" }, { name: "bob" }];

    for (const scenario of scenarios) {
      const globals = seedGlobals(scenario.vars);
      const vars = moduleVariables(scenario.vars);
      const calls = [];
      const inputs = [];
      for (const data of players) {
        for (const winmode of winmodes) {
          // Both arguments are passed and ignored, exactly as the original's
          // own callers do; sys.winmode decides the payout.
          const withMode = { ...globals, ___LOCAL_SYS__VARS__winmode: winmode };
          calls.push({ fn: "\\sys\\gameover_get_gold_up", args: [data, "ignored", 999], globals: withMode });
          inputs.push([data, winmode, withMode]);
        }
      }
      const expected = callOriginal(calls, BOOTSTRAP);
      const differences = [];
      inputs.forEach(([data, winmode], index) => {
        const reference = expected[index];
        if (!reference?.ok) {
          differences.push(`original failed: ${reference?.error}`);
          return;
        }
        const scoped = moduleVariables({ ...scenario.vars, "sys.winmode": winmode });
        const mine = gameoverGetGoldUp(scoped, data, "ignored", 999);
        if (mine !== reference.value) {
          differences.push(
            `${scenario.label} ${data.name}/winmode=${winmode}: port ${mine} != original ${reference.value}`
          );
        }
      });
      expect(differences, scenario.label).toEqual([]);
    }
  });
});
