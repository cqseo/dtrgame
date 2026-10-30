/** Generated from include/modules/base/cooldown/main.php. Do not hand edit. */
import type { CompiledPhpFunction } from "../legacy/module-compiler";

const hookGuard = () => ({
  kind: "if" as const,
  branches: [{
    condition: { kind: "call" as const, callee: "eval", args: [{ kind: "constant" as const, name: "__MAGIC__" }] },
    body: [{ kind: "return" as const, value: { kind: "variable" as const, name: "___RET_VALUE" } }]
  }],
  otherwise: []
});

const importCooldown = () => ({
  kind: "expression" as const,
  expression: {
    kind: "call" as const,
    callee: "eval",
    args: [{
      kind: "call" as const,
      callee: "import_module",
      args: [{ kind: "literal" as const, value: "cooldown" }]
    }]
  }
});

function getter(name: string, parameter: string | null, variable: string): CompiledPhpFunction {
  const bodySource = `
		if (eval(__MAGIC__)) return $___RET_VALUE;
		eval(import_module('cooldown'));
		return $${variable};
	`;
  return {
    namespace: "cooldown",
    name,
    parameters: parameter ? [{ name: parameter, byReference: true, variadic: false }] : [],
    bodySource,
    program: [
      hookGuard(),
      importCooldown(),
      { kind: "return", value: { kind: "variable", name: variable } }
    ]
  };
}

export const LEGACY_COMPILED_COOLDOWN = {
  get_move_coldtime: getter("get_move_coldtime", "dest", "movecoldtime"),
  get_search_coldtime: getter("get_search_coldtime", null, "searchcoldtime"),
  get_itemuse_coldtime: getter("get_itemuse_coldtime", "item", "itemusecoldtime"),
  set_coldtime: {
    namespace: "cooldown",
    name: "set_coldtime",
    parameters: [
      { name: "cd", byReference: false, variadic: false },
      { name: "forced", byReference: false, variadic: false, defaultSource: "0", defaultValue: 0 }
    ],
    bodySource: `
		if (eval(__MAGIC__)) return $___RET_VALUE;
		eval(import_module('sys','cooldown'));
		if($coldtimeon || $forced) {
			if($cmdcdtime < $cd) $cmdcdtime = $cd;
		}
		return $cmdcdtime;
	`,
    program: [
      hookGuard(),
      {
        kind: "expression",
        expression: {
          kind: "call", callee: "eval", args: [{
            kind: "call", callee: "import_module",
            args: [{ kind: "literal", value: "sys" }, { kind: "literal", value: "cooldown" }]
          }]
        }
      },
      {
        kind: "if",
        branches: [{
          condition: {
            kind: "binary", operator: "||",
            left: { kind: "variable", name: "coldtimeon" },
            right: { kind: "variable", name: "forced" }
          },
          body: [{
            kind: "if",
            branches: [{
              condition: {
                kind: "binary", operator: "<",
                left: { kind: "variable", name: "cmdcdtime" },
                right: { kind: "variable", name: "cd" }
              },
              body: [{
                kind: "expression",
                expression: {
                  kind: "assign", operator: "=",
                  target: { kind: "variable", name: "cmdcdtime" },
                  value: { kind: "variable", name: "cd" }
                }
              }]
            }],
            otherwise: []
          }]
        }],
        otherwise: []
      },
      { kind: "return", value: { kind: "variable", name: "cmdcdtime" } }
    ]
  }
} as const;
