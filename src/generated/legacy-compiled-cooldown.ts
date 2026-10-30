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
  get_itemuse_coldtime: getter("get_itemuse_coldtime", "item", "itemusecoldtime")
} as const;
