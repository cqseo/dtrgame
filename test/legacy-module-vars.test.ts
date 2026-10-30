import { describe, expect, it } from "vitest";
import {
  LEGACY_MODULE_VARS,
  LEGACY_MODULE_VARS_SUMMARY,
  legacyModuleVar
} from "../src/generated/legacy-module-vars";
import { PhpArray } from "../src/legacy/template/values";

/**
 * Guards the generated module-variable table without needing the PHP host.
 *
 * legacy-module-vars.parity.test.mjs proves the values match the original,
 * but it only runs in the parity suite. This is the part that runs on every
 * `npm test`: it checks the table is still whole, so a regeneration that
 * silently dropped modules, or a bad merge, fails here rather than at
 * runtime as a missing game value.
 *
 * Raise the baselines only when the original actually grows.
 */
const BASELINE_MODULES = 366;
const BASELINE_VARIABLES = 1621;

describe("generated module variables", () => {
  it("does not regress below the recorded size of the original's table", () => {
    expect(LEGACY_MODULE_VARS_SUMMARY.modules).toBeGreaterThanOrEqual(BASELINE_MODULES);
    expect(LEGACY_MODULE_VARS_SUMMARY.variables).toBeGreaterThanOrEqual(BASELINE_VARIABLES);
    expect(Object.keys(LEGACY_MODULE_VARS)).toHaveLength(LEGACY_MODULE_VARS_SUMMARY.modules);
    const counted = Object.values(LEGACY_MODULE_VARS).reduce(
      (total, vars) => total + Object.keys(vars).length,
      0
    );
    expect(counted).toBe(LEGACY_MODULE_VARS_SUMMARY.variables);
  });

  it("keeps the values the running kernel reads", () => {
    // The cooldown hooks read these on every move, search and item use, so a
    // missing one would silently become a zero cooldown.
    expect(legacyModuleVar("cooldown", "movecoldtime")).toBe(650);
    expect(legacyModuleVar("cooldown", "searchcoldtime")).toBe(650);
    expect(legacyModuleVar("cooldown", "itemusecoldtime")).toBe(250);
  });

  it("reads an absent name as PHP does rather than throwing", () => {
    expect(legacyModuleVar("cooldown", "no_such_variable")).toBeNull();
    expect(legacyModuleVar("no_such_module", "anything")).toBeNull();
  });

  it("rebuilds PHP arrays as ordered maps, not plain objects", () => {
    // The original's arrays are ordered and keep their key types; a plain
    // object would reorder numeric keys and break count() and foreach.
    const hotkeys = legacyModuleVar("itemmain", "item_hotkey_id_list");
    expect(hotkeys).toBeInstanceOf(PhpArray);
    expect((hotkeys as PhpArray).keys()).toEqual([4, 5, 6, 1, 2, 3]);
    expect((hotkeys as PhpArray).get(4)).toBe("qq");
  });

  it("holds the player schema every field access goes through", () => {
    const structure = legacyModuleVar("player", "db_player_structure");
    expect(structure).toBeInstanceOf(PhpArray);
    expect((structure as PhpArray).keys().length).toBeGreaterThan(100);
  });
});
