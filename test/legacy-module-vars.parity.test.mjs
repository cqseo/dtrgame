import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import { LEGACY_MODULE_VARS, legacyModuleVar } from "../src/generated/legacy-module-vars";
import { PhpArray } from "../src/legacy/template/values";

/**
 * Holds the generated module-variable table to the original.
 *
 * The table is the game's numbers — item stats, drop tables, cooldowns,
 * skill costs — and the contract forbids changing any of them. It is
 * generated, so the risk is not a typo but a stale or hand-edited file, and
 * nothing else in the suite would notice either.
 *
 * `npm run generate:module-vars -- --check` proves the whole file still
 * matches. This test is the cheaper guard that runs in the parity suite: it
 * reads a spread of variables back out of the original and compares them to
 * what the table holds, so a file that drifted fails here too.
 *
 * Run through `npm run test:php-parity`.
 */
const BOOTSTRAP = { bootstrap: "full" };

/**
 * Variables chosen because something depends on them being exact: the
 * cooldowns the kernel now reads, the player schema every field access goes
 * through, map and item tables, and a few deep nested ones where the encoder
 * could plausibly have flattened structure.
 */
const PROBES = [
  ["cooldown", "movecoldtime"],
  ["cooldown", "searchcoldtime"],
  ["cooldown", "itemusecoldtime"],
  ["cooldown", "coldtimeon"],
  ["player", "db_player_structure"],
  ["player", "db_player_structure_types"],
  ["itemmain", "item_hotkey_id_list"],
  ["itemmain", "item_obbs"],
  ["map", "plsinfo"],
  ["map", "areainfo"],
  ["map", "areainterval"],
  ["sys", "gtitle"],
  ["sys", "gameversion"],
  ["achievement_base", "achtype"],
  ["achievement_base", "ach_allow_mode"],
  ["cardbase", "packlist"],
  ["cardbase", "packstart"],
  ["skill505", "skill505_keyitm"],
  ["skill558", "skill558_keyword"],
  ["skill588", "sk588_wthkey_list"],
  ["searchmemory", "searchmemorycoldtime"]
];

/** Turns a PhpArray back into the plain JSON the oracle reports. */
function toPlain(value) {
  if (!(value instanceof PhpArray)) return value;
  const keys = value.keys();
  const isList = keys.every((key, index) => key === index);
  if (isList) return keys.map(key => toPlain(value.get(key)));
  const object = {};
  for (const key of keys) object[String(key)] = toPlain(value.get(key));
  return object;
}

describe.skipIf(!hasOracle)("generated module variables against the original", () => {
  it("matches the original for every probed variable", () => {
    const present = PROBES.filter(([module, name]) => LEGACY_MODULE_VARS[module]?.[name] !== undefined);
    // A probe that is missing from the table is itself the failure: the
    // generator dropped something, or the module was renamed.
    expect(PROBES.map(p => p.join(".")).filter(name => {
      const [module, variable] = name.split(".");
      return LEGACY_MODULE_VARS[module]?.[variable] === undefined;
    })).toEqual([]);

    const expected = callOriginal(
      // get_var_in_module takes the variable name first, then the module.
      present.map(([module, name]) => ({
        fn: "get_var_in_module",
        args: [name, module]
      })),
      BOOTSTRAP
    );

    const differences = [];
    present.forEach(([module, name], index) => {
      const ours = toPlain(legacyModuleVar(module, name));
      const theirs = expected[index].value;
      if (JSON.stringify(ours) !== JSON.stringify(theirs)) {
        differences.push(`${module}.${name}`);
      }
    });
    expect(differences).toEqual([]);
  });
});
