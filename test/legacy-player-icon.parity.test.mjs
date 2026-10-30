import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import {
  canContinuePostEventProc,
  eventEscrateProcess,
  eventWinrateProcess,
  getIconNumLimit,
  iconParserNameFormat
} from "../src/legacy/player-icon";
import { moduleVariables } from "../src/legacy/map-area";
import { PhpArray } from "../src/legacy/template/values";

/**
 * Holds the avatar-filename helpers and the base event hooks to the
 * original.
 *
 * The filename pair decides which images an avatar resolves to, and the
 * original drops the extension with substr($icon, 0, -strlen($ext) - 1),
 * which removes the last character when there is no extension. The cases
 * include names with no dot, a trailing dot, several dots and a path, so
 * that behaviour is pinned rather than assumed.
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

const ICONS = [
  0, 1, 42, "0", "7",
  "custom.png", "custom.gif", "a.b.png", "noextension", "trailing.",
  "dir/inside.png", ".hidden", "", "12abc"
];

describe.skipIf(!hasOracle)("avatar and event helpers against the original", () => {
  it("matches icon_parser_name_format for numbered and named icons", () => {
    const cases = [];
    for (const type of [0, 1]) {
      for (const gender of ["f", "m", "n", ""]) {
        for (const icon of ICONS) cases.push([type, gender, icon]);
      }
    }
    const expected = callOriginal(
      cases.map(args => ({ fn: "\\player\\icon_parser_name_format", args })),
      BOOTSTRAP
    );
    const differences = [];
    cases.forEach((args, index) => {
      const reference = expected[index];
      const label = `icon_parser_name_format(${JSON.stringify(args)})`;
      if (!reference?.ok) {
        differences.push(`${label}: original failed: ${reference?.error}`);
        return;
      }
      const mine = JSON.stringify(plain(iconParserNameFormat(args[0], args[1], args[2])));
      const theirs = JSON.stringify(reference.value);
      if (mine !== theirs) differences.push(`${label}: port ${mine} != original ${theirs}`);
    });
    expect(differences).toEqual([]);
  });

  it("matches get_icon_num_limit, including the fallback gender", () => {
    const vars = { "player.pc_icon_range": { f: [1, 40], m: [41, 80] } };
    const globals = seedGlobals(vars);
    const port = moduleVariables(vars);
    const genders = ["f", "m", "n", "", "F", "x", 0, 1];
    const expected = callOriginal(
      genders.map(gender => ({ fn: "\\player\\get_icon_num_limit", args: [gender], globals })),
      BOOTSTRAP
    );
    genders.forEach((gender, index) => {
      expect(
        plain(getIconNumLimit(port, gender)),
        `get_icon_num_limit(${JSON.stringify(gender)})`
      ).toEqual(expected[index].value);
    });
  });

  it("matches the base event hooks", () => {
    const results = [0, 1, "", "0", "x", null, false, true, []];
    const expectedContinue = callOriginal(
      results.map(value => ({ fn: "\\event\\can_continue_post_event_proc", args: [value] })),
      BOOTSTRAP
    );
    results.forEach((value, index) => {
      expect(canContinuePostEventProc(value), JSON.stringify(value)).toBe(expectedContinue[index].value);
    });

    const rates = [0, 50, 100, "75", -5, 0.5];
    const expectedWin = callOriginal(
      rates.map(value => ({ fn: "\\event\\event_winrate_process", args: [value] })),
      BOOTSTRAP
    );
    const expectedEsc = callOriginal(
      rates.map(value => ({ fn: "\\event\\event_escrate_process", args: [value] })),
      BOOTSTRAP
    );
    rates.forEach((value, index) => {
      expect(eventWinrateProcess(value), `winrate ${value}`).toBe(expectedWin[index].value);
      expect(eventEscrateProcess(value), `escrate ${value}`).toBe(expectedEsc[index].value);
    });
  });
});
