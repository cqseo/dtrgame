/**
 * Original functions that templates call, as the template runtime sees them.
 *
 * Only functions whose behaviour is actually ported belong here. Anything
 * absent raises from the renderer, which is deliberate: a template that
 * silently rendered a missing value as empty would look like a working page
 * while quietly differing from the original.
 */
import { ENABLED_LEGACY_MODULES } from "../generated/legacy-registry";
import type { HostFunction } from "./template/builtins";
import { toStringValue, type PhpValue } from "./template/values";

const ENABLED_MODULE_NAMES: ReadonlySet<string> = new Set(
  ENABLED_LEGACY_MODULES.map(entry => entry.name.toUpperCase())
);

/**
 * Marks code produced by import_module so eval() can tell it apart from a
 * genuine eval of arbitrary PHP, which is not supported.
 */
const IMPORT_MARKER = "\u0000dts-import-module\u0000";

/**
 * Port of modules.func.php's import_module().
 *
 * The original returns a string of `global $x;` declarations for the caller
 * to eval, so that a function body can see a module's variables. Templates
 * render in the global scope, where those declarations are already satisfied,
 * so the returned code has nothing to do — but the original's check that each
 * module exists is kept, because `eval(import_module('typo'))` must fail
 * rather than quietly import nothing.
 */
const importModule: HostFunction = args => {
  for (const argument of args) {
    const name = toStringValue(argument).toUpperCase();
    if (!ENABLED_MODULE_NAMES.has(name)) {
      throw new Error(`undefined module ${toStringValue(argument)}`);
    }
  }
  return IMPORT_MARKER;
};

/**
 * eval() limited to what import_module produces.
 *
 * Workers cannot generate code at runtime, and templates only ever eval the
 * output of import_module. Anything else raises instead of being ignored.
 */
const evalCode: HostFunction = args => {
  const code = toStringValue(args[0] ?? null);
  if (code === IMPORT_MARKER || code === "") return null;
  throw new Error(
    "eval() of arbitrary PHP is not supported in the template runtime; " +
      `received ${JSON.stringify(code.slice(0, 80))}`
  );
};

/** Builds the host-function map a page render starts from. */
export function createOriginalFunctions(
  extra: Readonly<Record<string, HostFunction>> = {}
): Map<string, HostFunction> {
  const functions = new Map<string, HostFunction>();
  functions.set("import_module", importModule);
  functions.set("eval", evalCode);
  for (const [name, implementation] of Object.entries(extra)) {
    functions.set(name, implementation);
  }
  return functions;
}

export type { PhpValue };
