import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import { compilePhpModuleFunction } from "../src/legacy/module-compiler";
import { executeCompiledModuleFunctionWithState } from "../src/legacy/compiled-module-runtime";
import { createTemplateContext, executeCompiledFunctionBody } from "../src/legacy/template/render";

const SOURCE = "../legacy-dts/include/modules/base/cooldown/main.php";

function execute(bodySource, variables) {
  return executeCompiledFunctionBody(`<?php ${bodySource}`, createTemplateContext({
    variables,
    globals: variables,
    constants: new Map([["__MAGIC__", false]]),
    functions: new Map([
      ["eval", args => args[0] ?? null],
      ["import_module", () => null]
    ]),
    loadTemplate: () => undefined
  })).value;
}

describe.skipIf(!hasOracle || !existsSync(SOURCE))("compiled module functions against original PHP", () => {
  it("matches cooldown getters, reference parameters and untouched globals", () => {
    const source = readFileSync(SOURCE, "utf8");
    const cases = [
      ["get_move_coldtime", [7], "movecoldtime", 651],
      ["get_search_coldtime", [], "searchcoldtime", 652],
      ["get_itemuse_coldtime", ["面包"], "itemusecoldtime", 253]
    ];
    const calls = cases.map(([name, args, variable, value]) => ({
      fn: `\\cooldown\\${name}`,
      args,
      globals: { [`___LOCAL_COOLDOWN__VARS__${variable}`]: value },
      read: [`___LOCAL_COOLDOWN__VARS__${variable}`]
    }));
    const expected = callOriginal(calls, { bootstrap: "full" });
    cases.forEach(([name, args, variable, value], index) => {
      const compiled = compilePhpModuleFunction(source, "cooldown", name);
      const variables = new Map([[variable, value]]);
      compiled.parameters.forEach((parameter, parameterIndex) => {
        variables.set(parameter.name, args[parameterIndex] ?? null);
      });
      expect(execute(compiled.bodySource, variables), String(name)).toBe(expected[index].value);
      expect(expected[index].globals[`___LOCAL_COOLDOWN__VARS__${variable}`]).toBe(value);
    });
  });

  it("matches set_coldtime defaults and global writes", () => {
    const source = readFileSync(SOURCE, "utf8");
    const compiled = compilePhpModuleFunction(source, "cooldown", "set_coldtime");
    const cases = [
      { args: [650], cmdcdtime: 200, coldtimeon: 1 },
      { args: [100], cmdcdtime: 200, coldtimeon: 1 },
      { args: [650, 1], cmdcdtime: 200, coldtimeon: 0 }
    ];
    const expected = callOriginal(cases.map(testCase => ({
      fn: "\\cooldown\\set_coldtime",
      args: testCase.args,
      globals: {
        ___LOCAL_COOLDOWN__VARS__cmdcdtime: testCase.cmdcdtime,
        ___LOCAL_COOLDOWN__VARS__coldtimeon: testCase.coldtimeon
      },
      read: ["___LOCAL_COOLDOWN__VARS__cmdcdtime", "___LOCAL_COOLDOWN__VARS__coldtimeon"]
    })), { bootstrap: "full" });

    cases.forEach((testCase, index) => {
      const actual = executeCompiledModuleFunctionWithState(
        compiled,
        testCase.args,
        new Map([
          ["cmdcdtime", testCase.cmdcdtime],
          ["coldtimeon", testCase.coldtimeon]
        ])
      );
      expect(actual.value).toBe(expected[index].value);
      expect(actual.variables.get("cmdcdtime")).toBe(
        expected[index].globals.___LOCAL_COOLDOWN__VARS__cmdcdtime
      );
      expect(actual.variables.get("coldtimeon")).toBe(
        expected[index].globals.___LOCAL_COOLDOWN__VARS__coldtimeon
      );
    });
  });
});
