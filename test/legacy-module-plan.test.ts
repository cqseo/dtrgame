import { describe, expect, it } from "vitest";
import { getLegacyModule } from "../src/generated/legacy-registry";
import { createLegacyModulePlan } from "../src/legacy/module-plan";

describe("legacy module dependency plan", () => {
  it("captures module code/template metadata from original headers", () => {
    expect(getLegacyModule("tactic")).toMatchObject({
      dependencies: ["sys", "player", "logger"],
      optionalDependencies: ["metman", "battle", "weapon", "trap", "enemy", "pose"],
      codeFiles: ["main.php", "config/tactic.config.php"],
      templates: ["enemy_tactic", "tactic_profile", "tactic_profile_cmd"]
    });
  });

  it("expands mandatory dependencies in exact loader order", () => {
    const plan = createLegacyModulePlan(["attack"]);
    expect(plan.ordered.at(-1)).toBe("attack");
    expect(plan.ordered).toEqual(expect.arrayContaining(["input", "sys", "map", "player", "battle", "attack"]));
    expect(plan.disabled).toEqual([]);
    expect(plan.conflicts).toEqual([]);
  });
});
