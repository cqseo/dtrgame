import { describe, expect, it } from "vitest";
import { LegacyCompatibilityKernel, LegacyExecutionSession, LegacyHookPipeline, legacyRef } from "../src/legacy/hooks";

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

  it("prevents duplicate hooks but preserves PHP multiple chprocess calls", () => {
    const pipeline = new LegacyHookPipeline<null, number>().register("pose", (_context, next) => next() + next());
    expect(() => pipeline.register("pose", () => 0)).toThrow("already registered");
    expect(pipeline.run(null, () => 1)).toBe(2);
  });
});

describe("legacy compatibility kernel", () => {
  it("loads modules in captured order and supports changed parent arguments", () => {
    const kernel = new LegacyCompatibilityKernel<{ total: number }>().loadModules([
      { name: "tactic", hooks: { calculate: ({ next }, value) => Number(next(Number(value) + 3)) * 2 } },
      { name: "lvlctl", hooks: { calculate: ({ session }, value) => { session.state.total += Number(value); return session.state.total; } } }
    ]);
    const session = new LegacyExecutionSession({ total: 1 });
    expect(kernel.loadedModules()).toEqual(["lvlctl", "tactic"]);
    expect(kernel.implementations("CALCULATE")).toEqual(["lvlctl", "tactic"]);
    expect(kernel.call(session, "calculate", 4)).toBe(16);
    expect(session.state.total).toBe(8);
  });

  it("allows overrides, multiple parent calls, nested hooks and request globals", () => {
    const kernel = new LegacyCompatibilityKernel<{ calls: number }>()
      .register("base", "lvlctl", ({ session }, value) => { session.state.calls += 1; return Number(value); })
      .register("base", "pose", ({ next }, value) => Number(next(value)) + Number(next(Number(value) + 1)))
      .register("nested", "lvlctl", ({ session }, value) => Number(value) + Number(session.globals.bonus ?? 0))
      .register("nested", "tactic", ({ call }, value) => Number(call("base", value)) * 10);
    const session = new LegacyExecutionSession({ calls: 0 }, { globals: { bonus: 9 } });
    expect(kernel.call(session, "base", 2)).toBe(5);
    expect(session.state.calls).toBe(2);
    expect(kernel.call(session, "nested", 3)).toBe(70);
  });

  it("rolls back state, globals, output and checkpointable RNG on command failure", () => {
    class SequenceRandom {
      index = 0;
      snapshot(): unknown { return this.index; }
      restore(value: unknown): void { this.index = Number(value); }
    }
    const random = new SequenceRandom();
    const kernel = new LegacyCompatibilityKernel<{ player: { hp: number }; items: string[] }>()
      .register("explode", "player", ({ session }) => {
        session.state.player.hp = 0;
        session.state.items.push("错误物品");
        session.globals.log = "changed";
        session.append("不应提交");
        random.index += 1;
        throw new Error("legacy failure");
      });
    const state = { player: { hp: 400 }, items: ["面包"] };
    const globals = { log: "original" };
    const session = new LegacyExecutionSession(state, { globals, random, trace: true });
    expect(() => kernel.command(session, "explode")).toThrow("legacy failure");
    expect(state).toEqual({ player: { hp: 400 }, items: ["面包"] });
    expect(globals).toEqual({ log: "original" });
    expect(session.output).toEqual([]);
    expect(random.index).toBe(0);
    expect(session.trace.at(-1)).toMatchObject({ type: "rollback" });
  });

  it("short-circuits a parent exactly like a module without chprocess", () => {
    const kernel = new LegacyCompatibilityKernel<{ baseCalls: number }>()
      .register("blocked", "lvlctl", ({ session }) => { session.state.baseCalls += 1; return "base"; })
      .register("blocked", "tactic", () => "override");
    const session = new LegacyExecutionSession({ baseCalls: 0 });
    expect(kernel.command(session, "blocked")).toBe("override");
    expect(session.state.baseCalls).toBe(0);
  });

  it("preserves PHP by-reference values through the parent chain", () => {
    const kernel = new LegacyCompatibilityKernel<Record<string, never>>()
      .register("damage", "lvlctl", (_context, damage) => { const ref = damage as { value: number }; ref.value += 5; return ref.value; })
      .register("damage", "tactic", ({ next }, damage) => { const result = Number(next(damage)); (damage as { value: number }).value *= 2; return result; });
    const damage = legacyRef(10);
    expect(kernel.call(new LegacyExecutionSession({}), "damage", damage)).toBe(15);
    expect(damage.value).toBe(30);
  });
});
