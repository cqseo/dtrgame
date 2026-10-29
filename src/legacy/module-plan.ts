import { LEGACY_MODULES, type LegacyModuleName } from "../generated/legacy-registry";

const modules = new Map<LegacyModuleName, typeof LEGACY_MODULES[number]>(LEGACY_MODULES.map((module) => [module.name, module]));

export interface LegacyModulePlan {
  readonly ordered: readonly LegacyModuleName[];
  readonly disabled: readonly LegacyModuleName[];
  readonly conflicts: readonly { module: LegacyModuleName; conflict: LegacyModuleName }[];
}

/** Resolve mandatory PHP module dependencies in the captured loader order. */
export function createLegacyModulePlan(targets: readonly LegacyModuleName[]): LegacyModulePlan {
  const included = new Set<LegacyModuleName>();
  const visiting = new Set<LegacyModuleName>();
  const disabled = new Set<LegacyModuleName>();
  const visit = (name: LegacyModuleName): void => {
    if (included.has(name)) return;
    if (visiting.has(name)) throw new Error(`Circular legacy module dependency at ${name}.`);
    const module = modules.get(name);
    if (!module) throw new Error(`Unknown legacy module: ${name}`);
    if (!module.enabled) disabled.add(name);
    visiting.add(name);
    for (const dependency of module.dependencies) visit(dependency as LegacyModuleName);
    visiting.delete(name);
    included.add(name);
  };
  for (const target of targets) visit(target);
  const ordered = [...included].sort((left, right) => modules.get(left)!.order - modules.get(right)!.order);
  const conflicts: { module: LegacyModuleName; conflict: LegacyModuleName }[] = [];
  for (const name of ordered) {
    for (const conflict of modules.get(name)!.conflicts) {
      const conflictName = conflict as LegacyModuleName;
      if (included.has(conflictName)) conflicts.push({ module: name, conflict: conflictName });
    }
  }
  return { ordered, disabled: [...disabled], conflicts };
}
