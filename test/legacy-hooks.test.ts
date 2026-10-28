import { describe, expect, it } from "vitest";
import { LegacyHookPipeline } from "../src/legacy/hooks";

describe("legacy module hook parity", () => {
  it("runs the last-loaded module first and chprocess in reverse load order", () => {
    const trace: string[] = [];
    const pipeline = new LegacyHookPipeline<{ value: number }, number>()
      .register("lvlctl", (context, next) => { trace.push("lvlctl:before"); const value = next(); trace.push("lvlctl:after"); return value + context.value; })
      .register("pose", (_context, next) => { trace.push("pose:before"); const value = next(); trace.push("pose:after"); return value * 2; })
      .register("tactic", (_context, next) => { trace.push("tactic:before"); const value = next(); trace.push("tactic:after"); return value + 3; });
    expect(pipeline.modules()).toEqual(["tactic", "pose", "lvlctl"]);
    expect(pipeline.run({ value: 5 }, () => { trace.push("base"); return 10; })).toBe(33);
    expect(trace).toEqual(["tactic:before", "pose:before", "lvlctl:before", "base", "lvlctl:after", "pose:after", "tactic:after"]);
  });

  it("prevents accidental duplicate module hooks and repeated chprocess calls", () => {
    const pipeline = new LegacyHookPipeline<null, number>().register("pose", (_context, next) => next() + next());
    expect(() => pipeline.register("pose", () => 0)).toThrow("already registered");
    expect(() => pipeline.run(null, () => 1)).toThrow("called chprocess more than once");
  });
});
