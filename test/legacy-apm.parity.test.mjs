import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import { calcApm, calcWinnerApm, checkSkillInfo } from "../src/legacy/apm";
import { moduleVariables } from "../src/legacy/map-area";
import { PhpArray } from "../src/legacy/template/values";

/**
 * Holds the actions-per-minute figures and the skill-tag check to the
 * original.
 *
 * The two APM functions guard against dividing by zero differently — the
 * live one floors elapsed minutes at one, the winner's one does not — so
 * the cases include a match shorter than a minute and one of zero length to
 * pin both.
 *
 * Run through `npm run test:php-parity`.
 */
const BOOTSTRAP = { bootstrap: "full" };

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

const NOW = 1793000000;

/** Players spanning alive, dead, long and very short matches. */
const PLAYERS = [
  { hp: 100, endtime: NOW - 10, validtime: NOW - 600, v_actionnum: 30, a_actionnum: 12 },
  { hp: 0, endtime: NOW - 300, validtime: NOW - 900, v_actionnum: 7, a_actionnum: 3 },
  { hp: 100, endtime: NOW, validtime: NOW - 20, v_actionnum: 5, a_actionnum: 1 },
  { hp: 100, endtime: NOW, validtime: NOW, v_actionnum: 0, a_actionnum: 0 },
  { hp: 50, endtime: NOW - 3600, validtime: NOW - 7200, v_actionnum: 123, a_actionnum: 45 },
  { hp: 0, endtime: NOW + 60, validtime: NOW, v_actionnum: 9, a_actionnum: 9 }
];

describe.skipIf(!hasOracle)("actions per minute against the original", () => {
  it("matches calc_apm while running and after a match", () => {
    const differences = [];
    for (const gamestate of [0, 10, 20, 30]) {
      const vars = { "sys.gamestate": gamestate, "sys.now": NOW };
      const globals = seedGlobals(vars);
      const port = moduleVariables(vars);
      const cases = [];
      for (const player of PLAYERS) {
        for (const useEndtime of [0, 1]) cases.push([player, useEndtime]);
      }
      const expected = callOriginal(
        cases.map(args => ({ fn: "\\apm\\calc_apm", args, globals })),
        BOOTSTRAP
      );
      cases.forEach(([player, useEndtime], index) => {
        const reference = expected[index];
        const label = `gamestate=${gamestate} ${JSON.stringify(player)} useEndtime=${useEndtime}`;
        if (!reference?.ok) {
          differences.push(`${label}: original failed: ${reference?.error}`);
          return;
        }
        const mine = JSON.stringify(plain(calcApm(port, player, useEndtime)));
        const theirs = JSON.stringify(reference.value);
        if (mine !== theirs) differences.push(`${label}: port ${mine} != original ${theirs}`);
      });
    }
    expect(differences).toEqual([]);
  });

  it("matches calc_winner_apm, including rows with neither counter", () => {
    const rows = [
      { v_actionnum: 30, a_actionnum: 12 },
      { v_actionnum: 30 },
      { a_actionnum: 12 },
      { actionnum: 42 },
      { actionnum: 42, a_actionnum: 7 },
      {},
      { v_actionnum: 0, a_actionnum: 0 }
    ];
    const times = [600, 60, 30, 1];
    const cases = [];
    for (const row of rows) {
      for (const time of times) cases.push([row, time]);
    }
    const expected = callOriginal(
      cases.map(args => ({ fn: "\\apm\\calc_winner_apm", args })),
      BOOTSTRAP
    );
    const differences = [];
    cases.forEach(([row, time], index) => {
      const reference = expected[index];
      const label = `calc_winner_apm(${JSON.stringify(row)}, ${time})`;
      if (!reference?.ok) {
        differences.push(`${label}: original failed: ${reference?.error}`);
        return;
      }
      const mine = JSON.stringify(plain(calcWinnerApm(row, time)));
      const theirs = JSON.stringify(reference.value);
      if (mine !== theirs) differences.push(`${label}: port ${mine} != original ${theirs}`);
    });
    expect(differences).toEqual([]);
  });

  it("matches check_skill_info against the real skill tag constants", () => {
    // The tags live in MOD_SKILL<n>_INFO; both sides read the same ones.
    const skills = [20, 21, 23, 597, 1005, 9999];
    const tags = ["club", "club;", "card", "debuff", "", "lub", "clubx"];
    const cases = [];
    for (const skill of skills) {
      for (const tag of tags) cases.push([skill, tag]);
    }
    const expected = callOriginal(
      cases.map(args => ({ fn: "\\skillbase\\check_skill_info", args })),
      BOOTSTRAP
    );

    // Resolve the same constants the original sees, so the port is given
    // the real tag strings rather than a guess at them.
    const constantNames = skills.map(skill => `MOD_SKILL${skill}_INFO`);
    const resolved = callOriginal(
      constantNames.map(name => ({ fn: "constant", args: [name] })),
      BOOTSTRAP
    );
    const constants = new Map();
    constantNames.forEach((name, index) => {
      if (resolved[index]?.ok && typeof resolved[index].value === "string") {
        constants.set(name, resolved[index].value);
      }
    });

    const differences = [];
    cases.forEach(([skill, tag], index) => {
      const reference = expected[index];
      const label = `check_skill_info(${skill}, ${JSON.stringify(tag)})`;
      if (!reference?.ok) {
        differences.push(`${label}: original failed: ${reference?.error}`);
        return;
      }
      const mine = checkSkillInfo(skill, tag, constants);
      if (mine !== reference.value) {
        differences.push(`${label}: port ${mine} != original ${reference.value}`);
      }
    });
    expect(differences).toEqual([]);
  });
});
