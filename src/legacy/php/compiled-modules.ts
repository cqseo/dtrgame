/**
 * The modules compiled so far, assembled into a runtime.
 *
 * The list itself lives in scripts/generate-compiled-modules.mjs and the
 * barrel beside this file is generated from it, because it runs to
 * hundreds of names and hand-maintaining that many imports is how one
 * quietly goes missing.
 *
 * Adding a module here cannot make anything that already works wrong. The
 * hook chains come from the manifest and always describe all 735 enabled
 * modules, so dispatch already goes where the original would; a module
 * that is absent raises LegacyFunctionNotCompiled rather than running an
 * older implementation, and adding it only replaces that refusal with the
 * original's own code.
 */
import { COMPILED_MODULE_NAMES, COMPILED_MODULE_TABLES } from "../../generated/legacy-compiled-index";
import { LEGACY_COMPILED_GLOBALS } from "../../generated/legacy-compiled-globals";
import { LEGACY_TEMPLATE_LANGUAGE } from "../../generated/legacy-template-language";
import { createHostConstants, createHostFunctions } from "./host-environment";
import { LegacyModuleRuntime, type ModuleRuntimeOptions } from "./runtime";

/**
 * Builds a runtime with every compiled module loaded.
 *
 * One per request: module variables are mutable and a function may write
 * to them, so sharing a runtime between requests would leak one player's
 * state into another's.
 */
export function createLegacyModuleRuntime(
  options: ModuleRuntimeOptions & { curscript?: string | null } = {}
): LegacyModuleRuntime {
  // The host environment first, so a caller can still override any of it.
  const withHost: ModuleRuntimeOptions = {
    ...options,
    constants: new Map([
      ...createHostConstants(options.curscript === undefined ? "index" : options.curscript),
      ...(options.constants ?? [])
    ]),
    functions: new Map([...createHostFunctions(), ...(options.functions ?? [])]),
    // {lang x} is resolved when a template compiles, so the pack has to
    // be here or every translated string renders as its placeholder.
    compileOptions: options.compileOptions ?? { language: LEGACY_TEMPLATE_LANGUAGE }
  };
  const runtime = new LegacyModuleRuntime(undefined, withHost);
  for (const table of COMPILED_MODULE_TABLES) runtime.registerModule(Object.values(table));
  // The global-namespace functions the original's include files declare,
  // such as fetch_udata_by_username. Compiled rather than hand-written, so
  // what runs is the original's own code.
  runtime.registerModule(Object.values(LEGACY_COMPILED_GLOBALS));
  return runtime;
}

export { COMPILED_MODULE_NAMES };
