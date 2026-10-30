import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import {
  checkMergable,
  getItemAllowFindAndUse,
  getItmskDescSingle,
  getItmskWordsSingle,
  getPackBlank,
  isEquipable,
  itemdropValidCheck,
  itemoffValidCheck,
  replaceCrlf
} from "../src/legacy/item-main";
import { moduleVariables } from "../src/legacy/map-area";

/**
 * Holds the item helpers to the original.
 *
 * These gate what can be equipped, dropped or stacked, so a difference lets
 * the game accept an action the original refuses. The cases lean on PHP's
 * truthiness, where "0" and "" are false, because that is what the slot
 * checks actually test.
 *
 * Run through `npm run test:php-parity`.
 */
const BOOTSTRAP = { bootstrap: "full" };

/** The original reads module variables from ___LOCAL_<MODULE>__VARS__<name>. */
function seedGlobals(values) {
  const globals = {};
  for (const [key, value] of Object.entries(values)) {
    const [module, name] = key.split(".");
    globals[`___LOCAL_${module.toUpperCase()}__VARS__${name}`] = value;
  }
  return globals;
}

const ITEM_KINDS = [
  "WC", "WD", "WF", "WCA", "WPB", "Y", "B", "C", "EI", "TN", "G", "M", "V",
  "ygo", "fy", "p", "EA", "H", "P", "HX", "PZ", "W", "D", "A", "WN", "DN",
  "", "0", "wc", "Z", "AB"
];

describe.skipIf(!hasOracle)("item helpers against the original", () => {
  it("matches check_mergable on every item kind", () => {
    const expected = callOriginal(
      ITEM_KINDS.map(kind => ({ fn: "\\itemmain\\check_mergable", args: [kind] })),
      BOOTSTRAP
    );
    ITEM_KINDS.forEach((kind, index) => {
      expect(checkMergable(kind), `check_mergable(${JSON.stringify(kind)})`).toBe(expected[index].value);
    });
  });

  it("matches the string helpers the base module owns", () => {
    const crlf = ["a<!--CRLF-->b", "<!--CRLF-->", "none", "", "x<!--CRLF--><!--CRLF-->y"];
    const expectedCrlf = callOriginal(
      crlf.map(value => ({ fn: "\\itemmain\\replace_crlf", args: [value] })),
      BOOTSTRAP
    );
    crlf.forEach((value, index) => {
      expect(replaceCrlf(value)).toBe(expectedCrlf[index].value);
    });

  });

  it("matches the attribute lookups, including PHP's empty()", () => {
    const vars = {
      "itemmain.itemspkinfo": { s: "同调", J: "", "^001": "炎", "0": "zero" },
      "itemmain.itemspkdesc": { s: "可同调", J: "", "^001": "附带炎属性" }
    };
    const keys = ["s", "J", "^001", "0", "missing", ""];
    const globals = seedGlobals(vars);
    const port = moduleVariables(vars);

    const expectedWords = callOriginal(
      keys.map(key => ({ fn: "\\itemmain\\get_itmsk_words_single", args: [key], globals })),
      BOOTSTRAP
    );
    const expectedDesc = callOriginal(
      keys.map(key => ({ fn: "\\itemmain\\get_itmsk_desc_single", args: [key], globals })),
      BOOTSTRAP
    );
    keys.forEach((key, index) => {
      expect(getItmskWordsSingle(port, key), `words(${JSON.stringify(key)})`).toBe(expectedWords[index].value);
      expect(getItmskDescSingle(port, key), `desc(${JSON.stringify(key)})`).toBe(expectedDesc[index].value);
    });
  });

  it("matches is_equipable across configured prefixes", () => {
    const vars = { "itemmain.itemkind_equipable": ["W", "D", "A"] };
    const globals = seedGlobals(vars);
    const port = moduleVariables(vars);
    const expected = callOriginal(
      ITEM_KINDS.map(kind => ({ fn: "\\itemmain\\is_equipable", args: [kind], globals })),
      BOOTSTRAP
    );
    ITEM_KINDS.forEach((kind, index) => {
      expect(isEquipable(port, kind), `is_equipable(${JSON.stringify(kind)})`).toBe(expected[index].value);
    });
  });

  it("matches get_item_allow_find_and_use on every falsy shape", () => {
    for (const flag of [1, 0, "", "0", "1", [], null, true, false]) {
      const vars = { "itemmain.item_allow_find_and_use": flag };
      const [reference] = callOriginal(
        [{ fn: "\\itemmain\\get_item_allow_find_and_use", args: [], globals: seedGlobals(vars) }],
        BOOTSTRAP
      );
      expect(getItemAllowFindAndUse(moduleVariables(vars)), JSON.stringify(flag)).toBe(reference.value);
    }
  });

  it("matches the slot checks and what they append to the log", () => {
    const slots = [
      [1, "WC"], [0, "WC"], ["0", "WC"], ["", "WC"], [1, ""], [1, "WN"],
      [1, "DN"], ["∞", "WC"], [2, "wn"], [null, null]
    ];
    for (const fn of ["itemdrop_valid_check", "itemoff_valid_check"]) {
      const calls = slots.map(([itms, itmk]) => ({
        fn: `\\itemmain\\${fn}`,
        // The originals take the whole item tuple; only count and kind are read.
        args: fn === "itemdrop_valid_check"
          ? ["name", itmk, 1, itms, "", 1]
          : ["name", itmk, 1, itms, ""],
        globals: { ___LOCAL_LOGGER__VARS__log: "" },
        read: ["___LOCAL_LOGGER__VARS__log"]
      }));
      const expected = callOriginal(calls, BOOTSTRAP);
      slots.forEach(([itms, itmk], index) => {
        const reference = expected[index];
        const port = fn === "itemdrop_valid_check"
          ? itemdropValidCheck(itms, itmk)
          : itemoffValidCheck(itms, itmk);
        const label = `${fn}(itms=${JSON.stringify(itms)}, itmk=${JSON.stringify(itmk)})`;
        expect(port.ok, label).toBe(reference.value);
        expect(port.log, `${label} log`).toBe(reference.globals.___LOCAL_LOGGER__VARS__log ?? "");
      });
    }
  });

  it("matches get_pack_blank on every pack shape", () => {
    const packs = [
      [0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1],
      ["0", 1, 1, 1, 1, 1],
      ["", 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, "∞"],
      ["∞", "∞", "∞", "∞", "∞", 0]
    ];
    for (const pack of packs) {
      const vars = Object.fromEntries(pack.map((count, index) => [`player.itms${index + 1}`, count]));
      const [reference] = callOriginal(
        [{ fn: "\\itemmain\\get_pack_blank", args: [], globals: seedGlobals(vars) }],
        BOOTSTRAP
      );
      expect(getPackBlank(moduleVariables(vars)), JSON.stringify(pack)).toBe(reference.value);
    }
  });
});
