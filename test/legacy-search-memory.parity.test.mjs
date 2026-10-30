import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import {
  checkKeepCorpseInSearchmemory,
  checkKeepEnemyInSearchmemory,
  getMemoryName,
  getSearchmemoryColdtime
} from "../src/legacy/search-memory";
import { moduleVariables } from "../src/legacy/map-area";

/**
 * Holds the search-memory helpers to the original.
 *
 * These decide what a player still remembers seeing between turns, which
 * differs by game type and, for corpses, by a per-room option. The cases
 * cover a room that enables corpses while its game type does not, since
 * that is how the PvE rooms do it.
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

const MEMORIES = [
  { itm: "小刀" },
  { Pname: "某人" },
  { itm: "小刀", Pname: "某人" },
  { itm: "" },
  { Pname: "" },
  { itm: null, Pname: "某人" },
  {}
];

describe.skipIf(!hasOracle)("search memory helpers against the original", () => {
  it("matches get_memory_name on items, players and empty entries", () => {
    const expected = callOriginal(
      MEMORIES.map(memory => ({ fn: "\\searchmemory\\get_memory_name", args: [memory] })),
      BOOTSTRAP
    );
    MEMORIES.forEach((memory, index) => {
      expect(getMemoryName(memory), JSON.stringify(memory)).toBe(expected[index].value);
    });
  });

  it("matches the cold time and the keep rules across rooms and game types", () => {
    const scenarios = [];
    for (const gametype of [0, 1, 3, 9]) {
      for (const keepCorpseOption of [0, 1]) {
        scenarios.push({
          "sys.gametype": gametype,
          "sys.roomvars": { current_game_option: { keep_corpse_in_searchmemory: keepCorpseOption } },
          "searchmemory.searchmemorycoldtime": 300,
          "searchmemory.gametype_keep_enemy_in_searchmemory": [1, 3],
          "searchmemory.gametype_keep_corpse_in_searchmemory": [3]
        });
      }
    }
    // A room with no options at all, which is the common case.
    scenarios.push({
      "sys.gametype": 1,
      "sys.roomvars": [],
      "searchmemory.searchmemorycoldtime": 120,
      "searchmemory.gametype_keep_enemy_in_searchmemory": [1, 3],
      "searchmemory.gametype_keep_corpse_in_searchmemory": [3]
    });

    const differences = [];
    for (const vars of scenarios) {
      const globals = seedGlobals(vars);
      const port = moduleVariables(vars);
      const [coldtime, keepEnemy, keepCorpse] = callOriginal(
        [
          { fn: "\\searchmemory\\get_searchmemory_coldtime", args: [], globals },
          { fn: "\\searchmemory\\check_keep_enemy_in_searchmemory", args: [], globals },
          { fn: "\\searchmemory\\check_keep_corpse_in_searchmemory", args: [], globals }
        ],
        BOOTSTRAP
      );
      const label = `gametype=${vars["sys.gametype"]} roomvars=${JSON.stringify(vars["sys.roomvars"])}`;
      if (getSearchmemoryColdtime(port) !== coldtime.value) {
        differences.push(`${label}: coldtime ${getSearchmemoryColdtime(port)} != ${coldtime.value}`);
      }
      if (checkKeepEnemyInSearchmemory(port) !== keepEnemy.value) {
        differences.push(`${label}: keepEnemy ${checkKeepEnemyInSearchmemory(port)} != ${keepEnemy.value}`);
      }
      if (checkKeepCorpseInSearchmemory(port) !== keepCorpse.value) {
        differences.push(`${label}: keepCorpse ${checkKeepCorpseInSearchmemory(port)} != ${keepCorpse.value}`);
      }
    }
    expect(differences).toEqual([]);
  });
});
