/**
 * First deterministic PvE vertical slice, not yet a claim of full legacy rule parity.
 * All transitions are server-authoritative. The browser sends only commands.
 */
export const ARENA_MOVE_COST = 15;
export const ARENA_SEARCH_COST = 15;
export const ARENA_ATTACK_COST = 10;
export const ARENA_RULESET = "pve-preview-1";

export type ArenaItemId = "coil_blade" | "field_kit";
export type ArenaOutcome = "playing" | "victory" | "defeat";

export interface ArenaState {
  ruleset: typeof ARENA_RULESET;
  hp: number;
  maxHp: number;
  sp: number;
  maxSp: number;
  position: { x: number; y: number };
  revealed: string[];
  searched: string[];
  inventory: ArenaItemId[];
  equippedWeapon: "coil_blade" | null;
  enemy: { hp: number; maxHp: number; defeated: boolean };
  rested: boolean;
  turns: number;
  outcome: ArenaOutcome;
  score: number;
  objective: string;
}

export interface ArenaTransition {
  ok: boolean;
  state: ArenaState;
  code?: string;
  log: string;
}

export function tileKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function createArenaState(): ArenaState {
  return {
    ruleset: ARENA_RULESET,
    hp: 100, maxHp: 100, sp: 120, maxSp: 120,
    position: { x: 0, y: 1 },
    revealed: ["0,1"], searched: [],
    inventory: ["field_kit"],
    equippedWeapon: null,
    enemy: { hp: 48, maxHp: 48, defeated: false },
    rested: false, turns: 0, outcome: "playing", score: 0,
    objective: "探索起始区域获得武器，前往地图中央击败守卫。"
  };
}

function fail(state: ArenaState, code: string, log: string): ArenaTransition {
  return { ok: false, state, code, log };
}

function ok(state: ArenaState, log: string): ArenaTransition {
  return { ok: true, state, log };
}

function enemyEngaged(state: ArenaState): boolean {
  return state.position.x === 1 && state.position.y === 1 && !state.enemy.defeated;
}

function retaliate(state: ArenaState): ArenaState {
  const hp = Math.max(0, state.hp - 8);
  return hp === 0
    ? { ...state, hp, outcome: "defeat", objective: "轮回终止。可重新开始。" }
    : { ...state, hp };
}

export function applyArenaAction(current: ArenaState | undefined, action: string, payload: unknown): ArenaTransition {
  if (action === "arena_start") {
    return ok(current ?? createArenaState(), current ? "试炼状态已恢复。" : "试炼开始。探索、装备并击败中央守卫。");
  }
  if (action === "arena_restart") {
    if (!current || current.outcome === "playing") {
      return fail(current ?? createArenaState(), "run_in_progress", "只有本轮结束后才能重新开始。");
    }
    return ok(createArenaState(), "新一轮试炼开始，历史最好成绩保留在本房间。");
  }
  if (!current) return fail(createArenaState(), "arena_not_started", "请先进入试炼。");
  if (current.outcome !== "playing") return fail(current, "run_finished", "本轮已经结束，请重新开始。");

  if (action === "arena_search") {
    if (current.sp < ARENA_SEARCH_COST) return fail(current, "insufficient_sp", "体力不足，无法探索。");
    if (enemyEngaged(current)) return fail(current, "enemy_engaged", "遭遇敌人时不能探索。");
    const tile = tileKey(current.position.x, current.position.y);
    if (current.searched.includes(tile)) return fail(current, "already_searched", "此处已探索。");
    const loot: ArenaItemId[] = tile === "0,1" ? ["coil_blade"] : [];
    return ok({
      ...current, sp: current.sp - ARENA_SEARCH_COST,
      searched: [...current.searched, tile],
      inventory: [...current.inventory, ...loot],
      turns: current.turns + 1,
      objective: loot.length ? "装备线圈刃，再前往地图中央。" : current.objective
    }, loot.length ? "消耗 15 SP，找到线圈刃并放入背包。" : "消耗 15 SP，此处没有可用物资。");
  }

  if (action === "arena_equip") {
    const itemId = payload && typeof payload === "object" ? (payload as { itemId?: unknown }).itemId : null;
    if (itemId !== "coil_blade" || !current.inventory.includes("coil_blade")) return fail(current, "item_unavailable", "背包中没有可以装备的线圈刃。");
    if (current.equippedWeapon === "coil_blade") return fail(current, "already_equipped", "已经装备线圈刃。");
    return ok({ ...current, equippedWeapon: "coil_blade", turns: current.turns + 1, objective: "向东移动，揭开地图迷雾并迎战守卫。" }, "已装备线圈刃，攻击伤害提升为 24。");
  }

  if (action === "arena_move") {
    const to = payload && typeof payload === "object" ? payload as { x?: unknown; y?: unknown } : {};
    if (!Number.isInteger(to.x) || !Number.isInteger(to.y)) return fail(current, "invalid_destination", "目标坐标必须是整数。");
    const x = to.x as number;
    const y = to.y as number;
    if (x < 0 || x > 2 || y < 0 || y > 2 || Math.abs(x - current.position.x) + Math.abs(y - current.position.y) !== 1) {
      return fail(current, "invalid_destination", "每次只能前往相邻地图格。");
    }
    if (x === 2 && y === 2) return fail(current, "restricted_zone", "该区域受到禁区封锁，无法进入。");
    if (enemyEngaged(current)) return fail(current, "enemy_engaged", "必须先击败守卫才能脱离战斗。");
    if (current.sp < ARENA_MOVE_COST) return fail(current, "insufficient_sp", "体力不足，无法移动。");
    const tile = tileKey(x, y);
    const discovered = current.revealed.includes(tile) ? current.revealed : [...current.revealed, tile];
    const engaged = x === 1 && y === 1;
    return ok({
      ...current, position: { x, y }, sp: current.sp - ARENA_MOVE_COST, revealed: discovered,
      turns: current.turns + 1,
      objective: engaged ? "守卫出现！使用攻击指令，注意生命值。" : "探索未知格子，寻找通向中央的道路。"
    }, engaged ? "移动到地图中央，遭遇守卫（48 HP）。" : `移动到 ${tile}，迷雾已揭开。`);
  }

  if (action === "arena_attack") {
    if (!enemyEngaged(current)) return fail(current, "no_enemy", "当前区域没有可以攻击的守卫。");
    if (current.sp < ARENA_ATTACK_COST) return fail(current, "insufficient_sp", "体力不足，无法攻击。");
    const damage = current.equippedWeapon === "coil_blade" ? 24 : 12;
    const hp = Math.max(0, current.enemy.hp - damage);
    const defeated = hp === 0;
    const base: ArenaState = {
      ...current, sp: current.sp - ARENA_ATTACK_COST, turns: current.turns + 1,
      enemy: { ...current.enemy, hp, defeated }
    };
    if (defeated) {
      const score = 100 + base.hp + Math.floor(base.sp / 2);
      return ok({
        ...base, outcome: "victory", score,
        objective: "已击败守卫！成绩记入本房间排行榜，可开启新轮回。"
      }, `造成 ${damage} 伤害，守卫被击败。本轮得分 ${score}。`);
    }
    const next = retaliate(base);
    return ok(next, next.outcome === "defeat"
      ? `造成 ${damage} 伤害，但守卫反击造成 8 伤害；轮回失败。`
      : `造成 ${damage} 伤害；守卫反击造成 8 伤害。`);
  }

  if (action === "arena_heal") {
    if (!current.inventory.includes("field_kit")) return fail(current, "item_unavailable", "没有急救包。");
    if (current.hp >= current.maxHp) return fail(current, "full_hp", "生命值已满，无需使用。");
    const healed = Math.min(current.maxHp, current.hp + 25);
    let next: ArenaState = {
      ...current, hp: healed, inventory: current.inventory.filter(id => id !== "field_kit"),
      turns: current.turns + 1
    };
    if (enemyEngaged(next)) next = retaliate(next);
    return ok(next, `急救包恢复 ${healed - current.hp} HP。${enemyEngaged(current) ? "守卫反击造成 8 伤害。" : ""}`);
  }

  if (action === "arena_rest") {
    if (current.rested) return fail(current, "rest_used", "本轮的休整机会已使用。");
    if (current.sp >= current.maxSp) return fail(current, "full_sp", "体力已满，无需休整。");
    let next: ArenaState = {
      ...current, sp: Math.min(current.maxSp, current.sp + 20),
      rested: true, turns: current.turns + 1
    };
    if (enemyEngaged(next)) next = retaliate(next);
    return ok(next, `休整恢复 ${next.sp - current.sp} SP。${enemyEngaged(current) ? "守卫反击造成 8 伤害。" : ""}`);
  }

  return fail(current, "unsupported_arena_action", "未知试炼行动。");
}

export interface ArenaBestScore {
  score: number;
  clearedAt: number;
}

export function roomLeaderboard(best: Record<string, ArenaBestScore>): { name: string; score: number }[] {
  return Object.entries(best)
    .filter(([_, entry]) => Number.isSafeInteger(entry.score) && entry.score > 0)
    .sort(([idA, a], [idB, b]) => b.score - a.score || a.clearedAt - b.clearedAt || idA.localeCompare(idB))
    .slice(0, 10)
    .map(([id, entry]) => ({ name: `轮回者-${id.slice(0, 6)}`, score: entry.score }));
}
