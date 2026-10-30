import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import { compilePhpModuleFile } from "../src/legacy/module-compiler";
import { LegacyModuleRuntime } from "../src/legacy/php/runtime";
import { ModuleVariableStore } from "../src/legacy/php/module-store";
import { PhpArray } from "../src/legacy/template/values";

/**
 * Holds the module runtime to the original.
 *
 * This covers the three things that make a module function more than a
 * function, all of which change which code runs or what it sees:
 *
 *   - the __MAGIC__ prologue, which may hand a call to whichever module
 *     registered last,
 *   - eval(import_module(...)), which aliases module variables by
 *     reference so a write reaches the module,
 *   - $chprocess(...), which calls the implementation this one replaced.
 *
 * Run through `npm run test:php-parity`.
 */
const LEGACY = "../legacy-dts";
const BOOTSTRAP = { bootstrap: "full" };

const moduleFile = path => `${LEGACY}/${path}`;

function runtimeWith(modules) {
  const runtime = new LegacyModuleRuntime(ModuleVariableStore.fromOriginal());
  for (const path of modules) {
    runtime.registerModule(compilePhpModuleFile(readFileSync(moduleFile(path), "utf8")));
  }
  return runtime;
}

const COOLDOWN = "include/modules/base/cooldown/main.php";

const plain = value => {
  if (!(value instanceof PhpArray)) return value;
  const keys = value.keys();
  const isList = keys.every((key, index) => key === index);
  if (isList) return keys.map(key => plain(value.get(key)));
  const object = {};
  for (const key of keys) object[String(key)] = plain(value.get(key));
  return object;
};

describe.skipIf(!hasOracle || !existsSync(moduleFile(COOLDOWN)))(
  "the module runtime against the original",
  () => {
    it("builds the same hook chains the original builds", () => {
      const runtime = runtimeWith([]);
      // get_move_coldtime is overridden by four skills, so its chain is a
      // real one rather than a single entry, and the order decides which
      // implementation a bare call enters.
      const chain = runtime.chains.chain("get_move_coldtime");
      expect(chain.length).toBeGreaterThan(1);
      expect(chain[0]).toBe("cooldown\\get_move_coldtime");
      // The newest is what a bare call enters.
      expect(runtime.chains.newest("get_move_coldtime")).toBe(chain[chain.length - 1]);
      // And each one's $chprocess is the one before it.
      for (let index = 1; index < chain.length; index += 1) {
        expect(runtime.chains.parentOf(chain[index])).toBe(chain[index - 1]);
      }
    });

    it("refuses to run an implementation the original would pick but this port lacks", () => {
      const runtime = runtimeWith([COOLDOWN]);
      // cooldown is compiled, but the skills that override it are not, so
      // the original would enter one of those. Quietly running cooldown's
      // version instead would be different game logic.
      expect(() => runtime.call("cooldown\\get_move_coldtime", [0])).toThrowError(
        /not compiled yet/
      );
    });

    it("matches set_coldtime, including its writes back to module variables", () => {
      const cases = [
        { args: [650], cmdcdtime: 200, coldtimeon: 1 },
        { args: [100], cmdcdtime: 200, coldtimeon: 1 },
        { args: [650, 1], cmdcdtime: 200, coldtimeon: 0 },
        { args: [0], cmdcdtime: 0, coldtimeon: 1 }
      ];
      const expected = callOriginal(
        cases.map(testCase => ({
          fn: "\\cooldown\\set_coldtime",
          args: testCase.args,
          globals: {
            ___LOCAL_COOLDOWN__VARS__cmdcdtime: testCase.cmdcdtime,
            ___LOCAL_COOLDOWN__VARS__coldtimeon: testCase.coldtimeon
          },
          read: ["___LOCAL_COOLDOWN__VARS__cmdcdtime"]
        })),
        BOOTSTRAP
      );

      const differences = [];
      cases.forEach((testCase, index) => {
        const runtime = runtimeWith([COOLDOWN]);
        runtime.store.set("cooldown", "cmdcdtime", testCase.cmdcdtime);
        runtime.store.set("cooldown", "coldtimeon", testCase.coldtimeon);

        // set_coldtime is not overridden by anything, so a bare call runs it.
        const value = runtime.call("cooldown\\set_coldtime", testCase.args);
        const label = JSON.stringify(testCase);
        if (value !== expected[index].value) {
          differences.push(`${label}: returned ${value} != ${expected[index].value}`);
        }
        // The write must have reached the module variable, because
        // import_module aliases rather than copies.
        const written = runtime.store.get("cooldown", "cmdcdtime");
        const theirs = expected[index].globals.___LOCAL_COOLDOWN__VARS__cmdcdtime;
        if (written !== theirs) {
          differences.push(`${label}: cmdcdtime ${written} != ${theirs}`);
        }
      });
      expect(differences).toEqual([]);
    });

    it("matches a getter that reads its configuration through import_module", () => {
      // get_search_coldtime has overrides too, so it is called at the base
      // implementation the way its own child would, which is what
      // $chprocess does.
      const expected = callOriginal(
        [{
          fn: "\\cooldown\\get_search_coldtime",
          args: [],
          globals: { ___LOCAL_COOLDOWN__VARS__searchcoldtime: 652 }
        }],
        BOOTSTRAP
      );
      const runtime = runtimeWith([COOLDOWN]);
      runtime.store.set("cooldown", "searchcoldtime", 652);
      const child = runtime.chains.overriddenBy("cooldown\\get_search_coldtime");
      const value = runtime.call("cooldown\\get_search_coldtime", [], child);
      expect(plain(value)).toBe(expected[0].value);
    });
  }
);
