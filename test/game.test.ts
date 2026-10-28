import { describe, expect, it } from "vitest";
import { applyGameAction, createGameWorld } from "../src/game";

describe("authoritative game engine", () => {
  it("supports entry, movement and recovery with legacy SP costs", () => {
    let result = applyGameAction(createGameWorld(1), "p1", "game_enter", undefined);
    result = applyGameAction(result.world, "p1", "game_move", { to: "old_platform" });
    expect(result.ok).toBe(true);
    expect(result.world.players.p1?.sp).toBe(105);
    result = applyGameAction(result.world, "p1", "game_rest", undefined);
    expect(result.world.players.p1?.sp).toBe(120);
  });

  it("rejects impossible movement without consuming a turn", () => {
    const entered = applyGameAction(createGameWorld(2), "p1", "game_enter", undefined).world;
    const result = applyGameAction(entered, "p1", "game_move", { to: "terminal_roof" });
    expect(result.ok).toBe(false);
    expect(result.world.turn).toBe(0);
    expect(result.world.players.p1?.sp).toBe(120);
  });

  it("produces a resolvable exploration outcome", () => {
    let result = applyGameAction(createGameWorld(3), "p1", "game_enter", undefined);
    result = applyGameAction(result.world, "p1", "game_search", undefined);
    const player = result.world.players.p1!;
    expect(result.ok).toBe(true);
    expect(Boolean(player.pendingItem || player.enemy || player.money > 300)).toBe(true);
    expect(player.sp).toBe(105);
  });

  it("creates lootable remains after a player elimination", () => {
    let world = applyGameAction(createGameWorld(4, "standard"), "p1", "game_enter", { mode: "standard" }).world;
    world = applyGameAction(world, "p2", "game_enter", undefined).world;
    world = applyGameAction(world, "p3", "game_enter", undefined).world;
    world.players.p2!.hp = 1;
    let result = applyGameAction(world, "p1", "game_attack", { targetId: "p2" });
    expect(result.world.players.p2?.alive).toBe(false);
    expect(result.world.corpses).toHaveLength(1);
    const corpse = result.world.corpses[0]!;
    result = applyGameAction(result.world, "p1", "game_loot", { corpseId: corpse.id });
    expect(result.ok).toBe(true);
    expect(result.world.players.p1!.money).toBeGreaterThan(300);
  });

  it("supports shop purchases, sales and tactical stance changes", () => {
    let result = applyGameAction(createGameWorld(5), "p1", "game_enter", undefined);
    result = applyGameAction(result.world, "p1", "game_move", { to: "signal_corridor" });
    result = applyGameAction(result.world, "p1", "game_move", { to: "memory_market" });
    result = applyGameAction(result.world, "p1", "game_shop_buy", { catalogId: "healing_gel" });
    expect(result.ok).toBe(true);
    const purchased = result.world.players.p1!.inventory.at(-1)!;
    result = applyGameAction(result.world, "p1", "game_shop_sell", { instanceId: purchased.instanceId });
    expect(result.ok).toBe(true);
    result = applyGameAction(result.world, "p1", "game_tactic", { tactic: "scavenge" });
    expect(result.world.players.p1?.tactic).toBe("scavenge");
  });

  it("warns and closes areas as the turn clock advances", () => {
    let result = applyGameAction(createGameWorld(6), "p1", "game_enter", undefined);
    for (let i = 0; i < 8; i += 1) result = applyGameAction(result.world, "p1", "game_rest", undefined);
    expect(result.world.turn).toBe(8);
    expect(result.world.forbidden.length).toBe(1);
  });
});
