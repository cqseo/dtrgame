import { LEGACY_MODULE_VARS } from "../generated/legacy-module-vars";
import type { CompiledPhpFunction } from "./module-compiler";
import type { HostFunction } from "./template/builtins";
import { createTemplateContext, executeCompiledFunctionProgram } from "./template/render";
import { PhpArray, type PhpValue } from "./template/values";

function clone(value: PhpValue): PhpValue {
  return value instanceof PhpArray ? value.clone() : value;
}

function argument(value: unknown): PhpValue {
  return value === null || value === undefined ||
    typeof value === "string" || typeof value === "number" || typeof value === "boolean"
    ? value ?? null
    : null;
}

/** Runs a checked-in module AST with its generated original configuration. */
export function executeCompiledModuleFunction(
  compiled: CompiledPhpFunction,
  args: readonly unknown[] = []
): PhpValue {
  return executeCompiledModuleFunctionWithState(compiled, args).value;
}

export function executeCompiledModuleFunctionWithState(
  compiled: CompiledPhpFunction,
  args: readonly unknown[] = [],
  overrides: ReadonlyMap<string, PhpValue> = new Map()
): { value: PhpValue; variables: Map<string, PhpValue> } {
  const variables = new Map<string, PhpValue>();
  const moduleVariables = LEGACY_MODULE_VARS[compiled.namespace as keyof typeof LEGACY_MODULE_VARS] as
    Readonly<Record<string, PhpValue>> | undefined;
  if (moduleVariables) {
    for (const [name, value] of Object.entries(moduleVariables)) variables.set(name, clone(value));
  }
  for (const [name, value] of overrides) variables.set(name, clone(value));
  compiled.parameters.forEach((parameter, index) => {
    const supplied = index < args.length;
    variables.set(parameter.name, supplied ? argument(args[index]) : (parameter.defaultValue ?? null));
  });
  const functions = new Map<string, HostFunction>([
    ["eval", values => values[0] ?? null],
    // import_module() declares module variables in PHP's function scope. The
    // generated variable table was seeded above, so the runtime operation is
    // deliberately empty rather than a guessed value.
    ["import_module", () => null]
  ]);
  const result = executeCompiledFunctionProgram(compiled.program, createTemplateContext({
    variables,
    globals: variables,
    constants: new Map([["__MAGIC__", false]]),
    functions,
    loadTemplate: () => undefined
  }));
  return { value: result.value, variables };
}
