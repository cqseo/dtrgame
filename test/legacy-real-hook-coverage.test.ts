import { describe, expect, it } from "vitest";
import { auditLegacyHookCoverage } from "../src/legacy/hook-coverage";
import { LEGACY_BASE_COMMAND_KERNEL } from "../src/legacy/command-runtime";
import { LEGACY_HOOK_MANIFEST_SUMMARY } from "../src/generated/legacy-hook-manifest";

/**
 * Measures the real production kernel against the original's hook inventory.
 *
 * legacy-hook-coverage.test.ts only exercises the auditor with a synthetic
 * kernel, so it never reported how much of the original is actually ported.
 * This ratchet records the true figure and fails if coverage regresses, so
 * progress claims stay anchored to the original rather than to intent.
 *
 * Raise BASELINE only when real hooks are added, never to make a run pass.
 */
const BASELINE_IMPLEMENTED = 56;

describe("real production kernel coverage against the original", () => {
  it("registers only hooks that exist in the original source", () => {
    const result = auditLegacyHookCoverage(LEGACY_BASE_COMMAND_KERNEL);
    // Anything here is a TypeScript invention with no counterpart in the
    // original PHP, which a 1:1 port must not contain.
    expect(result.unexpected).toEqual([]);
  });

  it("does not regress below the recorded original-hook coverage", () => {
    const result = auditLegacyHookCoverage(LEGACY_BASE_COMMAND_KERNEL);
    expect(result.expected).toBe(LEGACY_HOOK_MANIFEST_SUMMARY.implementations);
    expect(result.implemented).toBeGreaterThanOrEqual(BASELINE_IMPLEMENTED);
    expect(result.implemented + result.missing).toBe(result.expected);
  });

  it("reports coverage so status documents cannot overstate progress", () => {
    const result = auditLegacyHookCoverage(LEGACY_BASE_COMMAND_KERNEL);
    const percent = ((result.implemented / result.expected) * 100).toFixed(2);
    console.log(
      `original hook implementations: ${result.implemented}/${result.expected} (${percent}%), missing ${result.missing}`
    );
    expect(result.implemented).toBeLessThan(result.expected);
  });
});
