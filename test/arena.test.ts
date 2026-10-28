import { describe, expect, it } from "vitest";
import { applyArenaAction, createArenaState, roomLeaderboard } from "../src/arena";

describe("PvE preview arena — deterministic authoritative rules", () => {
  it("completes the search → equip → reveal → fight → score loop", () => {
    let result = applyArenaAction(undefined, "arena_start", undefined);
    expect(result.state.revealed).toEqual(["0,1"]);
    result = applyArenaAction(result.state, "arena_search", undefined);
    expect(result.state.sp).toBe(105);
    expect(result.state.inventory).toContain("coil_blade");
    result = applyArenaAction(result.state, "arena_equip", { itemId: "coil_blade" });
    expect(result.state.equippedWeapon).toBe("coil_blade");
    result = applyArenaAction(result.state, "arena_move", { x: 1, y: 1 });
    expect(result.state.sp).toBe(90);
    expect(result.state.revealed).toContain("1,1");
    result = applyArenaAction(result.state, "arena_attack", { damage: 10000, score: 10000 });
    expect(result.state.enemy.hp).toBe(24);
    expect(result.state.hp).toBe(92);
    result = applyArenaAction(result.state, "arena_attack", undefined);
    expect(result.state.outcome).toBe("victory");
    expect(result.state.enemy.hp).toBe(0);
    expect(result.state.score).toBe(227);
    expect(applyArenaAction(result.state, "arena_attack", undefined).ok).toBe(false);
    const restart = applyArenaAction(result.state, "arena_restart", undefined);
    expect(restart.state.outcome).toBe("playing");
    expect(restart.state.score).toBe(0);
  });

  it("rejects premature restarts, remote moves, blocked areas, fake equipment and repeats", () => {
    const initial = createArenaState();
    for (const [action, payload] of [
      ["arena_restart", undefined],
      ["arena_move", { x: 2, y: 2 }],
      ["arena_move", { x: 2, y: 1 }],
      ["arena_move", { x: "1", y: 1 }],
      ["arena_equip", { itemId: "coil_blade" }],
      ["arena_heal", undefined],
      ["arena_attack", undefined],
      ["arena_fake", { score: 9999 }]
    ] as const) {
      const result = applyArenaAction(initial, action, payload);
      expect(result.ok).toBe(false);
      expect(result.state).toEqual(initial);
    }
    let state = applyArenaAction(initial, "arena_search", undefined).state;
    const repeated = applyArenaAction(state, "arena_search", undefined);
    expect(repeated.ok).toBe(false);
    expect(repeated.state).toEqual(state);
    state = applyArenaAction(state, "arena_move", { x: 1, y: 1 }).state;
    expect(applyArenaAction(state, "arena_move", { x: 1, y: 0 }).code).toBe("enemy_engaged");
    expect(applyArenaAction(state, "arena_search", undefined).code).toBe("enemy_engaged");
  });

  it("supports one rest, once-only medicine, and no unlimited resource regeneration", () => {
    let state = applyArenaAction(createArenaState(), "arena_search", undefined).state;
    state = applyArenaAction(state, "arena_rest", undefined).state;
    expect(state.sp).toBe(120);
    const repeat = applyArenaAction(state, "arena_rest", undefined);
    expect(repeat.code).toBe("rest_used");
    state = applyArenaAction(state, "arena_move", { x: 1, y: 1 }).state;
    state = applyArenaAction(state, "arena_attack", undefined).state;
    const healed = applyArenaAction(state, "arena_heal", undefined);
    expect(healed.ok).toBe(true);
    expect(healed.state.hp).toBe(92);
    expect(healed.state.inventory).not.toContain("field_kit");
    expect(applyArenaAction(healed.state, "arena_heal", undefined).code).toBe("item_unavailable");
  });

  it("reveals only visited cells and does not mutate previous state on accepted actions", () => {
    const start = createArenaState();
    const next = applyArenaAction(start, "arena_move", { x: 0, y: 0 }).state;
    expect(start.revealed).toEqual(["0,1"]);
    expect(next.revealed).toEqual(["0,1", "0,0"]);
    const original = applyArenaAction(next, "arena_move", { x: 0, y: 1 }).state;
    expect(original.revealed).toEqual(["0,1", "0,0"]);
    expect(original.position).toEqual({ x: 0, y: 1 });
  });

  it("returns bounded ranking with best scores and no complete user identifiers", () => {
    const leaderboard = roomLeaderboard({
      "aaaaaaaa-0000": { score: 180, clearedAt: 3 },
      "bbbbbbbb-0000": { score: 240, clearedAt: 2 },
      "cccccccc-0000": { score: 240, clearedAt: 1 },
      "dddddddd-0000": { score: 0, clearedAt: 1 }
    });
    expect(leaderboard).toEqual([
      { name: "轮回者-cccccc", score: 240 },
      { name: "轮回者-bbbbbb", score: 240 },
      { name: "轮回者-aaaaaa", score: 180 }
    ]);
  });
});
