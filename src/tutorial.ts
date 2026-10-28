export const TUTORIAL_MOVE_COST = 15;
export const TUTORIAL_SEARCH_COST = 15;

export interface TutorialItem {
  id: "insulated_bracer" | "unstable_ration" | "purifier";
  name: string;
}

export interface TutorialState {
  step: number;
  hp: number;
  maxHp: number;
  sp: number;
  maxSp: number;
  area: string;
  status: "normal" | "poisoned";
  inventory: TutorialItem[];
  pendingItem: TutorialItem | null;
  objective: string;
  completed: boolean;
}

export interface TutorialTransition {
  ok: boolean;
  state: TutorialState;
  code?: string;
  log: string;
}

const objectives = [
  "移动到相邻区域，熟悉移动的体力消耗。",
  "在当前区域探索一次。",
  "拾取刚刚发现的绝缘腕甲。",
  "再次探索，寻找补给。",
  "拾取异常补给。",
  "使用异常补给，观察道具可能产生的负面效果。",
  "使用净化针剂解除中毒。",
  "基础行动训练完成。"
];

const item = (id: TutorialItem["id"], name: string): TutorialItem => ({ id, name });

export function createTutorialState(): TutorialState {
  return {
    step: 0,
    hp: 100,
    maxHp: 100,
    sp: 120,
    maxSp: 120,
    area: "第零候车室",
    status: "normal",
    inventory: [item("purifier", "净化针剂")],
    pendingItem: null,
    objective: objectives[0]!,
    completed: false
  };
}

function fail(state: TutorialState, code: string, log: string): TutorialTransition {
  return { ok: false, state, code, log };
}

function advance(state: TutorialState, step: number, log: string): TutorialTransition {
  return { ok: true, state: { ...state, step, objective: objectives[step] ?? objectives.at(-1)!, completed: step >= 7 }, log };
}

export function applyTutorialAction(current: TutorialState | undefined, action: string, payload: unknown): TutorialTransition {
  if (action === "tutorial_start") {
    const state = current ?? createTutorialState();
    return { ok: true, state, log: current ? "训练状态已恢复。" : "基础行动训练开始。" };
  }
  const state = current;
  if (!state) return fail(createTutorialState(), "tutorial_not_started", "请先开始教程。 ");

  if (action === "tutorial_move") {
    if (state.step !== 0) return fail(state, "wrong_tutorial_step", state.objective);
    const destination = typeof payload === "object" && payload && typeof (payload as { to?: unknown }).to === "string" ? (payload as { to: string }).to : "";
    const allowed = ["旧站台", "信号廊"];
    if (!allowed.includes(destination) || destination === state.area) return fail(state, "invalid_destination", "请选择可到达的相邻区域。 ");
    if (state.sp <= TUTORIAL_MOVE_COST) return fail(state, "insufficient_sp", "体力不足，无法移动。 ");
    return advance({ ...state, area: destination, sp: state.sp - TUTORIAL_MOVE_COST }, 1, `消耗 ${TUTORIAL_MOVE_COST} 点体力，移动到${destination}。`);
  }

  if (action === "tutorial_search") {
    if (state.step !== 1 && state.step !== 3) return fail(state, "wrong_tutorial_step", state.objective);
    if (state.sp <= TUTORIAL_SEARCH_COST) return fail(state, "insufficient_sp", "体力不足，无法探索。 ");
    const found = state.step === 1 ? item("insulated_bracer", "绝缘腕甲") : item("unstable_ration", "异常补给");
    return advance({ ...state, sp: state.sp - TUTORIAL_SEARCH_COST, pendingItem: found }, state.step + 1, `消耗 ${TUTORIAL_SEARCH_COST} 点体力，发现了${found.name}。`);
  }

  if (action === "tutorial_pickup") {
    if ((state.step !== 2 && state.step !== 4) || !state.pendingItem) return fail(state, "nothing_to_pickup", state.objective);
    const found = state.pendingItem;
    return advance({ ...state, inventory: [...state.inventory, found], pendingItem: null }, state.step + 1, `已拾取${found.name}。`);
  }

  if (action === "tutorial_use_ration") {
    if (state.step !== 5 || !state.inventory.some(({ id }) => id === "unstable_ration")) return fail(state, "item_unavailable", state.objective);
    return advance({ ...state, hp: Math.max(1, state.hp - 20), status: "poisoned", inventory: state.inventory.filter(({ id }) => id !== "unstable_ration") }, 6, "异常补给使生命降低 20，并附加中毒状态。 ");
  }

  if (action === "tutorial_use_purifier") {
    if (state.step !== 6 || !state.inventory.some(({ id }) => id === "purifier")) return fail(state, "item_unavailable", state.objective);
    return advance({ ...state, status: "normal", inventory: state.inventory.filter(({ id }) => id !== "purifier") }, 7, "中毒已解除，基础行动训练完成。 ");
  }

  return fail(state, "unsupported_tutorial_action", "教程不支持这个行动。 ");
}
