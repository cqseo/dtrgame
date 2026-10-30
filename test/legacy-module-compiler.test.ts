import { describe, expect, it } from "vitest";
// @ts-expect-error test-only Node builtins
import { existsSync, readFileSync } from "node:fs";
import { compilePhpModuleFunction } from "../src/legacy/module-compiler";
import { LEGACY_COMPILED_COOLDOWN } from "../src/generated/legacy-compiled-cooldown";
import {
  executeCompiledModuleFunction, executeCompiledModuleFunctionWithState
} from "../src/legacy/compiled-module-runtime";
import { executeCompiledFunctionBody, createTemplateContext } from "../src/legacy/template/render";
import type { HostFunction } from "../src/legacy/template/builtins";

const COOLDOWN_SLICE = `<?php
namespace cooldown {
  function get_move_coldtime(&$dest) {
    if (eval(__MAGIC__)) return $___RET_VALUE;
    eval(import_module('cooldown'));
    return $movecoldtime;
  }
  function get_itemuse_coldtime(&$item) {
    if (eval(__MAGIC__)) return $___RET_VALUE;
    eval(import_module('cooldown'));
    return $itemusecoldtime;
  }
}`;
const ORIGINAL_COOLDOWN = "../legacy-dts/include/modules/base/cooldown/main.php";

function execute(bodySource: string, variables: Map<string, number | string>) {
  const functions = new Map<string, HostFunction>([
    ["eval", args => args[0] ?? null],
    ["import_module", () => null]
  ]);
  return executeCompiledFunctionBody(`<?php ${bodySource}`, createTemplateContext({
    variables,
    globals: variables,
    constants: new Map([["__MAGIC__", false]]),
    functions,
    loadTemplate: () => undefined
  }));
}

describe("build-time PHP module compiler", () => {
  it("extracts references, hook dispatch and module imports from a real-shaped function", () => {
    const compiled = compilePhpModuleFunction(COOLDOWN_SLICE, "cooldown", "get_move_coldtime");
    expect(compiled.parameters).toEqual([
      { name: "dest", byReference: true, variadic: false }
    ]);
    expect(compiled.program.map(statement => statement.kind)).toEqual(["if", "expression", "return"]);
    const variables = new Map<string, number | string>([["dest", 3], ["movecoldtime", 650]]);
    expect(execute(compiled.bodySource, variables)).toEqual({ value: 650, output: "" });
    expect(variables).toEqual(new Map([["dest", 3], ["movecoldtime", 650]]));
  });

  it("compiles a second function without sharing hardcoded values", () => {
    const compiled = compilePhpModuleFunction(COOLDOWN_SLICE, "cooldown", "get_itemuse_coldtime");
    const variables = new Map<string, number | string>([["item", "面包"], ["itemusecoldtime", 250]]);
    expect(execute(compiled.bodySource, variables).value).toBe(250);
  });

  it("does not terminate a body at braces inside strings or comments", () => {
    const source = `<?php namespace sample { function braces($x = 1) { // }
      $text = "{"; /* } */ if ($x) { return $text . '}'; } return ''; } }`;
    const compiled = compilePhpModuleFunction(source, "sample", "braces");
    const variables = new Map<string, number | string>([["x", 1]]);
    expect(execute(compiled.bodySource, variables).value).toBe("{}");
  });

  it.skipIf(!existsSync(ORIGINAL_COOLDOWN))("parses the installed cooldown module itself", () => {
    const source = readFileSync(ORIGINAL_COOLDOWN, "utf8");
    const move = compilePhpModuleFunction(source, "cooldown", "get_move_coldtime");
    const search = compilePhpModuleFunction(source, "cooldown", "get_search_coldtime");
    const item = compilePhpModuleFunction(source, "cooldown", "get_itemuse_coldtime");
    const set = compilePhpModuleFunction(source, "cooldown", "set_coldtime");
    expect(move.parameters[0]).toMatchObject({ name: "dest", byReference: true });
    expect(search.parameters).toEqual([]);
    expect(item.parameters[0]).toMatchObject({ name: "item", byReference: true });
    expect(set.parameters[1]).toEqual({
      name: "forced", byReference: false, variadic: false, defaultSource: "0", defaultValue: 0
    });
    expect(execute(move.bodySource, new Map([["dest", 3], ["movecoldtime", 651]])).value).toBe(651);
    expect(execute(search.bodySource, new Map([["searchcoldtime", 652]])).value).toBe(652);
    expect(execute(item.bodySource, new Map<string, number | string>([
      ["item", "水"], ["itemusecoldtime", 253]
    ])).value).toBe(253);
    expect(move.program).toEqual(LEGACY_COMPILED_COOLDOWN.get_move_coldtime.program);
    expect(search.program).toEqual(LEGACY_COMPILED_COOLDOWN.get_search_coldtime.program);
    expect(item.program).toEqual(LEGACY_COMPILED_COOLDOWN.get_itemuse_coldtime.program);
    expect(set.program).toEqual(LEGACY_COMPILED_COOLDOWN.set_coldtime.program);
  });

  it("runs the checked-in AST from original generated module variables", () => {
    expect(executeCompiledModuleFunction(LEGACY_COMPILED_COOLDOWN.get_move_coldtime, [3])).toBe(650);
    expect(executeCompiledModuleFunction(LEGACY_COMPILED_COOLDOWN.get_search_coldtime)).toBe(650);
    expect(executeCompiledModuleFunction(LEGACY_COMPILED_COOLDOWN.get_itemuse_coldtime, ["面包"])).toBe(250);
    const raised = executeCompiledModuleFunctionWithState(
      LEGACY_COMPILED_COOLDOWN.set_coldtime, [650], new Map([["cmdcdtime", 200]])
    );
    expect(raised.value).toBe(650);
    expect(raised.variables.get("cmdcdtime")).toBe(650);
    const unchanged = executeCompiledModuleFunctionWithState(
      LEGACY_COMPILED_COOLDOWN.set_coldtime, [100], new Map([["cmdcdtime", 200]])
    );
    expect(unchanged.value).toBe(200);
    expect(unchanged.variables.get("cmdcdtime")).toBe(200);
  });
});
