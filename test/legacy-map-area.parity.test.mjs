import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import {
  checkCanEnter,
  checkInForbiddenArea,
  checkPls,
  getAllPlsno,
  getArealistNextadd,
  getAreaInterval,
  getAreaWavenum,
  getCurrentArea,
  getCurrentNotArea,
  getPlsnum,
  getSafePlslist,
  isPlsnoAvailable,
  moduleVariables
} from "../src/legacy/map-area";
import { PhpArray } from "../src/legacy/template/values";

/**
 * Holds the area and zone helpers to the original.
 *
 * These decide which zones have become forbidden as the map shrinks and
 * where a player may still move, so a difference here changes where the
 * game lets people go. The original reads its inputs through
 * get_var_in_module(), which resolves to ___LOCAL_<MODULE>__VARS__<name>,
 * so both sides are given the same values by seeding those globals.
 *
 * Run through `npm run test:php-parity`.
 */

/** Scenarios chosen to move every branch, not only the configured defaults. */
const SCENARIOS = [
  {
    label: "defaults",
    vars: {
      "sys.arealist": [0, 1, 2, 3, 4, 5, 6, 7],
      "sys.areanum": 0,
      "sys.gametype": 0,
      "sys.groomtype": 0,
      "sys.hack": 0,
      "map.areaadd": 4,
      "map.area_on_start": [0],
      "map.areainterval": { 0: 30 },
      "map.dangerous_zone": [0, 32, 34],
      "map.plsinfo": { 0: "a", 1: "b", 2: "c" }
    }
  },
  {
    label: "map has shrunk twice",
    vars: {
      "sys.arealist": [5, 2, 9, 1, 7, 3, 0, 8],
      "sys.areanum": 5,
      "sys.gametype": 1,
      "sys.groomtype": 0,
      "sys.hack": 0,
      "map.areaadd": 3,
      "map.area_on_start": [0, 1],
      "map.areainterval": { 0: 30, 1: 15 },
      "map.dangerous_zone": [3, 0],
      "map.plsinfo": { 2: "x", 5: "y" }
    }
  },
  {
    label: "timed duel room, hack on",
    vars: {
      "sys.arealist": [1, 2, 3],
      "sys.areanum": 2,
      "sys.gametype": 2,
      "sys.groomtype": 14,
      "sys.hack": 1,
      "map.areaadd": 2,
      "map.area_on_start": [],
      "map.areainterval": { 0: 30, 2: 7 },
      "map.dangerous_zone": [],
      "map.plsinfo": {}
    }
  },
  {
    label: "everything already forbidden",
    vars: {
      "sys.arealist": [4, 5],
      "sys.areanum": 9,
      "sys.gametype": 9,
      "sys.groomtype": 1,
      "sys.hack": 0,
      "map.areaadd": 1,
      "map.area_on_start": [0, 1, 2],
      "map.areainterval": { 0: 30 },
      "map.dangerous_zone": [4, 5],
      "map.plsinfo": { 4: "p" }
    }
  },
  {
    label: "cached zone list short-circuits the sort",
    vars: {
      "sys.arealist": [9, 3, 6],
      "sys.areanum": 1,
      "sys.gametype": 0,
      "sys.groomtype": 0,
      "sys.hack": 0,
      "map.all_plsno_cache": [3, 6, 9],
      "map.areaadd": 2,
      "map.area_on_start": [0],
      "map.areainterval": { 0: 30 },
      "map.dangerous_zone": [6],
      "map.plsinfo": { 3: "m" }
    }
  }
];

/** Module variables live in globals named ___LOCAL_<MODULE>__VARS__<name>. */
function seedGlobals(vars) {
  const globals = {};
  for (const [key, value] of Object.entries(vars)) {
    const [module, name] = key.split(".");
    globals[`___LOCAL_${module.toUpperCase()}__VARS__${name}`] = value;
  }
  return globals;
}

/** PHP arrays arrive as JSON arrays when keys are sequential, else objects. */
function plain(value) {
  if (!(value instanceof PhpArray)) return value;
  const keys = value.keys();
  if (keys.every((key, index) => key === index)) return value.values().map(plain);
  return Object.fromEntries(value.pairs().map(([key, item]) => [String(key), plain(item)]));
}

const PROBE_ZONES = [0, 1, 2, 3, 5, 9, 32, 99, "2", "x"];

describe.skipIf(!hasOracle)("map area helpers against the original", () => {
  for (const scenario of SCENARIOS) {
    it(`matches every area helper with ${scenario.label}`, () => {
      const vars = moduleVariables(scenario.vars);
      const globals = seedGlobals(scenario.vars);

      const calls = [
        { fn: "\\map\\get_plsnum", args: [0], globals },
        { fn: "\\map\\get_plsnum", args: [1], globals },
        { fn: "\\map\\get_all_plsno", args: [0], globals },
        { fn: "\\map\\get_all_plsno", args: [1], globals },
        { fn: "\\map\\get_area_wavenum", args: [], globals },
        { fn: "\\map\\get_current_area", args: [0], globals },
        { fn: "\\map\\get_current_area", args: [1], globals },
        { fn: "\\map\\get_current_not_area", args: [0], globals },
        { fn: "\\map\\get_current_not_area", args: [1], globals },
        { fn: "\\map\\get_area_interval", args: [], globals },
        { fn: "\\map\\get_safe_plslist", args: [true], globals },
        { fn: "\\map\\get_safe_plslist", args: [false], globals },
        { fn: "\\map\\get_arealist_nextadd", args: [1], globals },
        { fn: "\\map\\get_arealist_nextadd", args: [2], globals },
        ...PROBE_ZONES.map(zone => ({ fn: "\\map\\is_plsno_available", args: [zone], globals })),
        ...PROBE_ZONES.map(zone => ({ fn: "\\map\\check_pls", args: [zone], globals })),
        ...PROBE_ZONES.map(zone => ({ fn: "\\map\\check_in_forbidden_area", args: [zone, 0], globals })),
        ...PROBE_ZONES.map(zone => ({ fn: "\\map\\check_can_enter", args: [zone], globals }))
      ];

      const expected = callOriginal(calls, { bootstrap: "core" });
      const actual = [
        getPlsnum(vars, 0),
        getPlsnum(vars, 1),
        getAllPlsno(vars, 0),
        getAllPlsno(vars, 1),
        getAreaWavenum(vars),
        getCurrentArea(vars, 0),
        getCurrentArea(vars, 1),
        getCurrentNotArea(vars, 0),
        getCurrentNotArea(vars, 1),
        getAreaInterval(vars),
        getSafePlslist(vars, true),
        getSafePlslist(vars, false),
        getArealistNextadd(vars, 1),
        getArealistNextadd(vars, 2),
        ...PROBE_ZONES.map(zone => isPlsnoAvailable(vars, zone)),
        ...PROBE_ZONES.map(zone => checkPls(vars, zone)),
        ...PROBE_ZONES.map(zone => checkInForbiddenArea(vars, zone, 0)),
        ...PROBE_ZONES.map(zone => checkCanEnter(vars, zone))
      ];

      const differences = [];
      calls.forEach((call, index) => {
        const reference = expected[index];
        const label = `${call.fn}(${JSON.stringify(call.args)})`;
        if (!reference?.ok) {
          differences.push(`${label}: original failed: ${reference?.error ?? "no result"}`);
          return;
        }
        const mine = JSON.stringify(plain(actual[index]));
        const theirs = JSON.stringify(reference.value);
        if (mine !== theirs) differences.push(`${label}: port ${mine} != original ${theirs}`);
      });

      expect(differences).toEqual([]);
    });
  }
});
