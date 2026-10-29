import { describe, expect, it } from "vitest";
import { auditLegacyHookCoverage } from "../src/legacy/hook-coverage";
import { LegacyCompatibilityKernel } from "../src/legacy/hooks";

describe("legacy hook port coverage", () => {
  it("counts only exact original function/module implementations", () => {
    const kernel = new LegacyCompatibilityKernel<Record<string, never>>()
      .register("itemmix_success", "itemmix", () => undefined)
      .register("itemmix_success", "skill20", () => undefined)
      .register("typescript_only", "itemmix", () => undefined);
    const result = auditLegacyHookCoverage(kernel);
    expect(result.expected).toBe(5235);
    expect(result.implemented).toBe(2);
    expect(result.missing).toBe(5233);
    expect(result.unexpected).toEqual([{ functionName: "typescript_only", module: "itemmix" }]);
    expect(result.missingByModule.itemmix).toBeGreaterThan(0);
  });
});
