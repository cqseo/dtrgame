import { describe, expect, it } from "vitest";
import { applyGameAction, createGameWorld, getGameView, GAME_AREAS, tickAreaClock, nextAreaAlarmAt } from "../src/game";
import { LEGACY_AREAS, LEGACY_MAP_RULES } from "../src/legacy-map";

describe("authoritative game engine", () => {
  it("supports entry, movement and recovery with legacy SP costs", () => {
    let result = applyGameAction(createGameWorld(1), "p1", "game_enter", undefined);
    result = applyGameAction(result.world, "p1", "game_move", { to: "old_platform" });
    expect(result.ok).toBe(true);
    expect(result.world.players.p1?.sp).toBe(285);
    result = applyGameAction(result.world, "p1", "game_rest", undefined);
    expect(result.world.players.p1?.sp).toBe(300);
  });

  it("labels standard and infinite entry correctly", () => {
    const standard = applyGameAction(createGameWorld(8, "standard"), "p1", "game_enter", { mode: "standard" });
    const infinite = applyGameAction(createGameWorld(9), "p1", "game_enter", undefined);
    expect(standard.event.text).toContain("标准大逃杀");
    expect(infinite.event.text).toContain("无限试炼");
  });

  it("rejects impossible movement without consuming a turn", () => {
    const entered = applyGameAction(createGameWorld(2), "p1", "game_enter", undefined).world;
    const result = applyGameAction(entered, "p1", "game_move", { to: "unknown_region" });
    expect(result.ok).toBe(false);
    expect(result.world.turn).toBe(0);
    expect(result.world.players.p1?.sp).toBe(300);
  });

  it("produces a resolvable exploration outcome", () => {
    let result = applyGameAction(createGameWorld(3), "p1", "game_enter", undefined);
    result = applyGameAction(result.world, "p1", "game_search", undefined);
    const player = result.world.players.p1!;
    expect(result.ok).toBe(true);
    expect(Boolean(player.pendingItem || player.enemy || player.money > 300)).toBe(true);
    expect(player.sp).toBe(285);
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

  it("does not prematurely shrink regions after a burst of player actions", () => {
    let result = applyGameAction(createGameWorld(6), "p1", "game_enter", undefined);
    for (let i = 0; i < 8; i += 1) result = applyGameAction(result.world, "p1", "game_rest", undefined);
    expect(result.world.turn).toBe(8);
    expect(result.world.forbidden).toEqual(["zone_0"]);
    expect(result.world.warningAreas).toHaveLength(0);
  });

  it("loads 35 legacy locations in their original numeric order with calibrated modifiers", () => {
    expect(GAME_AREAS).toHaveLength(35);
    expect(LEGACY_AREAS.map(({ legacyId }) => legacyId)).toEqual(Array.from({ length: 35 }, (_, i) => i));
    expect(LEGACY_AREAS[0]).toMatchObject({ id: "zone_0", grid: "B-2", dangerous: true });
    expect(LEGACY_AREAS[32]).toMatchObject({ grid: "J-2", encounter: 10, itemFind: -10 });
    expect(LEGACY_AREAS[34]).toMatchObject({ grid: "J-10", encounter: 20, itemFind: -15 });
    expect(LEGACY_MAP_RULES.forbiddenPerWave).toBe(4);
    expect(LEGACY_MAP_RULES.inventorySlots).toBe(6);
  });

  it("permits direct travel to any available region, without a fictitious adjacency graph", () => {
    const entered = applyGameAction(createGameWorld(101), "p1", "game_enter", undefined).world;
    const result = applyGameAction(entered, "p1", "game_move", { to: "zone_34" });
    expect(result.ok).toBe(true);
    expect(result.world.players.p1!.area).toBe("zone_34");
    expect(result.world.players.p1!.sp).toBe(285);
    const forbidden = applyGameAction(result.world, "p1", "game_move", { to: "zone_0" });
    expect(forbidden.ok).toBe(false);
    expect(forbidden.code).toBe("forbidden_destination");
  });

  it("warns 60 seconds before each 30-minute four-region closure", () => {
    const world = applyGameAction(createGameWorld(108), "p1", "game_enter", undefined).world;
    const due = world.areaDueAt;
    expect(nextAreaAlarmAt(world, due - 90_000)).toBe(due - 60_000);
    expect(tickAreaClock(world, due - 60_001)).toBe("");
    const warning = tickAreaClock(world, due - 60_000);
    expect(warning).toContain("60 秒禁区预警");
    expect(world.warningAreas).toHaveLength(4);
    expect(world.forbidden).toEqual(["zone_0"]);
    expect(nextAreaAlarmAt(world, due - 30_000)).toBe(due);
    const closing = tickAreaClock(world, due);
    expect(closing).toContain("新增禁区");
    expect(world.forbidden).toHaveLength(5);
    expect(world.warningAreas).toHaveLength(0);
    expect(world.areaDueAt).toBe(due + 30 * 60_000);
  });

  it("restores prototype region IDs from persisted room snapshots without losing inventory", () => {
    const old = applyGameAction(createGameWorld(103), "p1", "game_enter", undefined).world;
    old.players.p1!.area = "memory_market" as never;
    old.players.p1!.money = 987;
    const view = getGameView(old, "p1");
    expect(view.player!.area).toBe("zone_14");
    expect(view.player!.money).toBe(987);
    expect(old.players.p1!.area).toBe("memory_market");
    const resumed = applyGameAction(old, "p1", "game_shop_buy", { catalogId: "healing_gel" });
    expect(resumed.ok).toBe(true);
    expect(resumed.world.players.p1!.area).toBe("zone_14");
    expect(resumed.world.players.p1!.inventory).toHaveLength(3);
  });

  it("enforces the original six backpack slots for found items", () => {
    let world = applyGameAction(createGameWorld(104), "p1", "game_enter", undefined).world;
    const p = world.players.p1!;
    p.inventory = Array.from({ length: 6 }, (_, i) => ({ ...p.inventory[0]!, instanceId: `fill_${i}` }));
    p.pendingItem = { ...p.inventory[0]!, instanceId: "new_find" };
    const result = applyGameAction(world, "p1", "game_pickup", undefined);
    expect(result.ok).toBe(false);
    expect(result.code).toBe("inventory_full");
    expect(result.world.players.p1!.pendingItem?.instanceId).toBe("new_find");
  });

  it("publishes a stable survival ranking without exposing private inventory", () => {
    let world = applyGameAction(createGameWorld(7, "standard"), "p1", "game_enter", { mode: "standard" }).world;
    world = applyGameAction(world, "p2", "game_enter", undefined).world;
    world.players.p2!.alive = false;
    world.players.p1!.kills = 2;
    const view = getGameView(world, "p1");
    expect(view.ranking.map(({ id }) => id)).toEqual(["p1", "p2"]);
    expect(view.ranking[0]).not.toHaveProperty("inventory");
  });
});

describe("extended legacy mechanics", () => {
  it("applies 20 actual Baota weather effects with stable defaults", async () => {
    const { WEATHER, weatherAttack, weatherDefense, weatherDiscoveryChance } = await import("../src/legacy-rules");
    expect(WEATHER).toHaveLength(20);
    expect(WEATHER[18]).toMatchObject({ name: "冷气", find: 20 });
    expect(WEATHER[19]).toMatchObject({ name: "暖气", find: 20 });
    expect(WEATHER[10]).toMatchObject({ name: "瘴气", attack: 20, defense: -50 });
    expect(weatherAttack(100, 10)).toBe(120);
    expect(weatherDefense(100, 10)).toBe(50);
    expect(weatherDiscoveryChance(60, 15, 9)).toBe(55);
  });
  it("creates original-cost teams, enforces 5-player cap and prevents friendly fire", () => {
    let world = createGameWorld(202, "standard");
    for (let i = 1; i <= 6; i++) world = applyGameAction(world, "p" + i, "game_enter", undefined).world;
    const leader = applyGameAction(world, "p1", "game_team_create", undefined);
    expect(leader.ok).toBe(true);
    expect(leader.world.players.p1!.sp).toBe(100);
    world = leader.world;
    const teamId = world.players.p1!.teamId!;
    for (let i = 2; i <= 5; i++) {
      const r = applyGameAction(world, "p" + i, "game_team_join", { teamId });
      expect(r.ok).toBe(true);
      world = r.world;
    }
    expect(world.teams[teamId]).toHaveLength(5);
    const overflow = applyGameAction(world, "p6", "game_team_join", { teamId });
    expect(overflow.ok).toBe(false);
    expect(overflow.code).toBe("team_full");
    expect(applyGameAction(world, "p1", "game_attack", { targetId: "p2" }).code).toBe("friendly_fire");
  });
  it("supports four equipment parts and all six weapon proficiencies", () => {
    let world = applyGameAction(createGameWorld(310), "p1", "game_enter", undefined).world;
    world = applyGameAction(world, "p1", "game_move", { to: "zone_14" }).world;
    const buy = applyGameAction(world, "p1", "game_shop_buy", { catalogId: "helmet" });
    expect(buy.ok).toBe(true);
    const id = buy.world.players.p1!.inventory.at(-1)!.instanceId;
    const equip = applyGameAction(buy.world, "p1", "game_equip", { instanceId: id });
    expect(equip.ok).toBe(true);
    expect(equip.world.players.p1!.armorParts.head?.catalogId).toBe("helmet");
    const unequip = applyGameAction(equip.world, "p1", "game_unequip", { slot: "head" });
    expect(unequip.ok).toBe(true);
    expect(unequip.world.players.p1!.armorParts.head).toBeUndefined();
    const p = unequip.world.players.p1!;
    expect(Object.keys(p.proficiencies).sort()).toEqual(["wc", "wd", "wf", "wg", "wk", "wp"].sort());
  });
  it("crafts the two source-grounded recipes by consuming ingredients", () => {
    let world = applyGameAction(createGameWorld(311), "p1", "game_enter", undefined).world;
    world = applyGameAction(world, "p1", "game_move", { to: "zone_14" }).world;
    world = applyGameAction(world, "p1", "game_shop_buy", { catalogId: "rice_stew" }).world;
    world = applyGameAction(world, "p1", "game_shop_buy", { catalogId: "matsutake" }).world;
    const before = world.players.p1!.inventory.length;
    const r = applyGameAction(world, "p1", "game_craft", { result: "matsutake_rice" });
    expect(r.ok).toBe(true);
    expect(r.world.players.p1!.inventory.length).toBe(before - 1);
    expect(r.world.players.p1!.inventory.some((item) => item.catalogId === "matsutake_rice")).toBe(true);
  });
  it("places traps in the world and persists them independently of inventory", () => {
    let world = applyGameAction(createGameWorld(312), "p1", "game_enter", undefined).world;
    world = applyGameAction(world, "p1", "game_move", { to: "zone_14" }).world;
    world = applyGameAction(world, "p1", "game_shop_buy", { catalogId: "tripwire" }).world;
    const instanceId = world.players.p1!.inventory.at(-1)!.instanceId;
    const r = applyGameAction(world, "p1", "game_trap_place", { instanceId });
    expect(r.ok).toBe(true);
    expect(r.world.traps).toHaveLength(1);
    expect(r.world.traps[0]!.owner).toBe("p1");
    expect(r.world.players.p1!.inventory.find((i) => i.instanceId === instanceId)).toBeUndefined();
  });
});


describe("Baota installed itemmix dataset", () => {
  it("imports all 465 live-server recipes rather than 373 upstream variants", async () => {
    const { LEGACY_CRAFT_RULES, findLegacyCraftMatches } = await import("../src/legacy-recipes");
    expect(LEGACY_CRAFT_RULES).toHaveLength(465);
    expect(LEGACY_CRAFT_RULES[0]).toMatchObject({ name: "松茸御饭", rawResult: "'松茸御饭','HS',120,20," });
    expect(LEGACY_CRAFT_RULES[464]).toMatchObject({ name: "白色方块" });
    expect(findLegacyCraftMatches(["杂炊","松茸"]).some((r) => r.name === "松茸御饭")).toBe(true);
  });
});
