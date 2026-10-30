/**
 * The modules compiled so far, assembled into a runtime.
 *
 * A module appears here only once its functions are held to the original by
 * test/legacy-module-runtime.parity.test.mjs, so the list is a record of
 * what matches rather than of what has been attempted.
 *
 * The hook chains come from the manifest and always describe all 735
 * enabled modules, so a call that the original would send to a module
 * missing from this list fails with LegacyFunctionNotCompiled instead of
 * running an older implementation. Adding a module here can therefore only
 * make more of the game work; it cannot change what already matches.
 */
import { LEGACY_COMPILED_COOLDOWN } from "../../generated/legacy-compiled-cooldown";
import { LEGACY_COMPILED_INSTANCE11 } from "../../generated/legacy-compiled-instance11";
import { LEGACY_COMPILED_MAP } from "../../generated/legacy-compiled-map";
import { LEGACY_COMPILED_MAP_DISPLAY } from "../../generated/legacy-compiled-map_display";
import { LEGACY_COMPILED_GAMEFLOW_ANTIAFK } from "../../generated/legacy-compiled-gameflow_antiafk";
import { LEGACY_COMPILED_GAMEFLOW_COMBO } from "../../generated/legacy-compiled-gameflow_combo";
import { LEGACY_COMPILED_GAMEFLOW_BASE } from "../../generated/legacy-compiled-gameflow_base";
import { LEGACY_COMPILED_INSTANCE8 } from "../../generated/legacy-compiled-instance8";
import { LEGACY_COMPILED_NOISE } from "../../generated/legacy-compiled-noise";
import { LEGACY_COMPILED_SYS } from "../../generated/legacy-compiled-sys";
import type { CompiledPhpFunction } from "../module-compiler";
import { createHostConstants, createHostFunctions } from "./host-environment";
import { LegacyModuleRuntime, type ModuleRuntimeOptions } from "./runtime";

const COMPILED_MODULES: readonly Readonly<Record<string, CompiledPhpFunction>>[] = [
  LEGACY_COMPILED_COOLDOWN,
  LEGACY_COMPILED_MAP,
  LEGACY_COMPILED_MAP_DISPLAY,
  LEGACY_COMPILED_INSTANCE11,
  LEGACY_COMPILED_SYS,
  LEGACY_COMPILED_NOISE,
  LEGACY_COMPILED_INSTANCE8,
  LEGACY_COMPILED_GAMEFLOW_BASE,
  LEGACY_COMPILED_GAMEFLOW_ANTIAFK,
  LEGACY_COMPILED_GAMEFLOW_COMBO
];

/**
 * Builds a runtime with every compiled module loaded.
 *
 * One per request: module variables are mutable and a function may write to
 * them, so sharing a runtime between requests would leak one player's state
 * into another's.
 */
export function createLegacyModuleRuntime(options: ModuleRuntimeOptions = {}): LegacyModuleRuntime {
  // The host environment first, so a caller can still override any of it.
  const withHost: ModuleRuntimeOptions = {
    ...options,
    constants: new Map([
      ...createHostConstants("index"),
      ...(options.constants ?? [])
    ]),
    functions: new Map([...createHostFunctions(), ...(options.functions ?? [])])
  };
  const runtime = new LegacyModuleRuntime(undefined, withHost);
  for (const table of COMPILED_MODULES) runtime.registerModule(Object.values(table));
  return runtime;
}

/** The module names compiled so far, for status reporting. */
export const COMPILED_MODULE_NAMES: readonly string[] = [
  "cooldown",
  "map",
  "map_display",
  "instance11",
  "sys",
  "noise",
  "instance8",
  "gameflow_base",
  "gameflow_antiafk",
  "gameflow_combo"
];
