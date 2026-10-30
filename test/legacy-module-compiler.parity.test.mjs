import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import { compilePhpModuleFunction } from "../src/legacy/module-compiler";
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
});
