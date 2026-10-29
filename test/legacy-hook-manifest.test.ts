import { describe, expect, it } from "vitest";
import { LEGACY_HOOK_CHAINS, LEGACY_HOOK_MANIFEST_SUMMARY } from "../src/generated/legacy-hook-manifest";

describe("captured PHP hook graph", () => {
  it("indexes every enabled module codelist with exact source metadata", () => {
    expect(LEGACY_HOOK_MANIFEST_SUMMARY).toEqual({
      enabledModules: 735,
      functionNames: 3211,
      implementations: 5235,
      overloadedFunctions: 505,
      missingCodelistSources: 0
    });
  });

  it("captures known cross-module crafting chains and reference parameters", () => {
    expect(LEGACY_HOOK_CHAINS.itemmix_success.map(({ module }) => module)).toContain("skill20");
    expect(LEGACY_HOOK_CHAINS.itemmix_recipe_check.map(({ module }) => module)).toEqual(expect.arrayContaining(["itemmix", "skill708", "ex_residue"]));
    const counter = LEGACY_HOOK_CHAINS.check_can_counter.find(({ module }) => module === "tactic");
    expect(counter?.parameters.slice(0, 2).map(({ byReference }) => byReference)).toEqual([true, true]);
  });
});
