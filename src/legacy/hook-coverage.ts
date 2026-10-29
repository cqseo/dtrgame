import { LEGACY_HOOK_CHAINS, LEGACY_HOOK_MANIFEST_SUMMARY } from "../generated/legacy-hook-manifest";
import type { LegacyModuleName } from "../generated/legacy-registry";
import type { LegacyCompatibilityKernel } from "./hooks";

export interface LegacyHookCoverage {
  readonly expected: number;
  readonly implemented: number;
  readonly missing: number;
  readonly unexpected: readonly { functionName: string; module: LegacyModuleName }[];
  readonly missingByModule: Readonly<Record<string, number>>;
}

/** Strict function+module coverage; a placeholder module does not count. */
export function auditLegacyHookCoverage<TState extends object>(kernel: LegacyCompatibilityKernel<TState>): LegacyHookCoverage {
  const expected = new Set<string>();
  const missingByModule: Record<string, number> = {};
  for (const [functionName, chain] of Object.entries(LEGACY_HOOK_CHAINS)) {
    for (const implementation of chain) expected.add(`${functionName}\0${implementation.module}`);
  }
  let implemented = 0;
  const unexpected: { functionName: string; module: LegacyModuleName }[] = [];
  for (const registration of kernel.registrations()) {
    const key = `${registration.functionName}\0${registration.module}`;
    if (expected.delete(key)) implemented += 1;
    else unexpected.push(registration);
  }
  for (const key of expected) {
    const module = key.slice(key.indexOf("\0") + 1);
    missingByModule[module] = (missingByModule[module] ?? 0) + 1;
  }
  return {
    expected: LEGACY_HOOK_MANIFEST_SUMMARY.implementations,
    implemented,
    missing: expected.size,
    unexpected,
    missingByModule
  };
}
