import { LEGACY_MAP_CONFIG } from "./map";
import { runLegacyCraftAction, legacySlotsFromMixMask, type LegacyCraftActionResult } from "./crafting-action";
import { checkLegacyMove, checkLegacySearch } from "./explore";
import { LegacyCompatibilityKernel, LegacyExecutionSession } from "./hooks";
import { phpInt } from "./php-semantics";
import type { LegacyPlayerRecord } from "./player";
import { readLegacyPlayerInventory, writeLegacyPendingItem, writeLegacyPlayerInventory } from "./player-inventory";
import { emptyLegacyItem, isLegacyItemEmpty, mergeLegacyItems, moveLegacyInventoryItem, useLegacyEdible, type LegacyItem } from "./item";
import { applyLegacyRest, LEGACY_HOSPITAL_AREAS, LEGACY_REST_NAMES } from "./rest";
import { canChangeLegacyPose, canChangeLegacyTactic, getLegacyPose, getLegacyTactic } from "./stance";
import { bandageLegacyWound } from "./wound";

export type LegacySearchMode = "search" | "move" | "search2";

export interface LegacyCommandDiscoveryResult { found: boolean; logHtml?: string; }

export interface LegacyPlayerCommandState {
  player: LegacyPlayerRecord;
  mode: string;
  command: string;
  input: Record<string, string>;
  now: number;
  requestStartMs: number;
  gamestate: number;
  gametype: number;
  log: string;
  cmd: string;
  action: string;
  playerDead: boolean;
  commandCooldown: number;
  remainingCooldown: number;
  availableAreas: number[];
  forbiddenAreas: number[];
  areaNames: string[];
  profile?: { motto?: string; killmsg?: string; lastword?: string };
  discover?: (mode: LegacySearchMode, state: LegacyPlayerCommandState) => LegacyCommandDiscoveryResult;
  craftResult?: LegacyCraftActionResult;
}

export interface LegacyPlayerCommandInput {
  player: LegacyPlayerRecord;
  mode?: string;
  command: string;
  input?: Record<string, string>;
  now: number;
  requestStartMs?: number;
  gamestate?: number;
  gametype?: number;
  availableAreas?: number[];
  forbiddenAreas?: number[];
  areaNames?: string[];
  profile?: LegacyPlayerCommandState["profile"];
  discover?: LegacyPlayerCommandState["discover"];
}

const numberField = (player: LegacyPlayerRecord, key: keyof LegacyPlayerRecord): number => Number(player[key] ?? 0);
const textField = (player: LegacyPlayerRecord, key: keyof LegacyPlayerRecord): string => String(player[key] ?? "");

function readPlayerItem(player: LegacyPlayerRecord, slot: number): LegacyItem {
  if (slot === 0) return {
    itm: textField(player, "itm0"), itmk: textField(player, "itmk0"),
    itme: numberField(player, "itme0"), itms: player.itms0, itmsk: textField(player, "itmsk0")
  };
  return readLegacyPlayerInventory(player)[slot - 1] ?? emptyLegacyItem();
}

function writePlayerItem(player: LegacyPlayerRecord, slot: number, item: LegacyItem): void {
  if (slot === 0) { writeLegacyPendingItem(player, item); return; }
  const inventory = readLegacyPlayerInventory(player);
  inventory[slot - 1] = item;
  writeLegacyPlayerInventory(player, inventory);
}

function discover(state: LegacyPlayerCommandState, mode: LegacySearchMode): boolean {
  const result = state.discover?.(mode, state);
  if (result?.logHtml) state.log += result.logHtml;
  if (result) return result.found;
  state.log += "但是什么都没有发现。<br>";
  return false;
}

function createKernel(): LegacyCompatibilityKernel<LegacyPlayerCommandState> {
  const kernel = new LegacyCompatibilityKernel<LegacyPlayerCommandState>();

  kernel.register("pre_act", "player", ({ session }) => {
    const state = session.state;
    if (state.playerDead) state.player.hp = 0;
    if (numberField(state.player, "hp") <= 0) state.playerDead = true;
  });

  kernel.register("act", "player", ({ session }) => {
    const state = session.state;
    if (state.command === "menu") state.mode = "command";
    else if (state.mode === "command" && state.command === "special") state.mode = state.input.sp_cmd ?? "";
  });

  kernel.register("post_act", "player", ({ session }) => {
    const profile = session.state.profile;
    if (!profile) return;
    if (profile.motto !== undefined) session.state.player.motto = profile.motto;
    if (profile.killmsg !== undefined) session.state.player.killmsg = profile.killmsg;
    if (profile.lastword !== undefined) session.state.player.lastword = profile.lastword;
  });

  kernel.register("get_max_rage", "player", () => 100);

  kernel.register("pre_act", "itemmain", ({ next, session }) => {
    const state = session.state;
    const pending = readPlayerItem(state.player, 0);
    const allowed = ["itm0", "dropitm0", "itemget", "itemmerge", "enter"].includes(state.command) || state.command.includes("swap");
    if (numberField(state.player, "hp") !== 0 && !isLegacyItemEmpty(pending) && !state.action.includes("corpse") && !allowed) {
      state.log += "你的双手都已经抓满了东西。为了完成所想，你集中意念召唤幻肢……<br>什么都没有发生，除了你的脑壳痛了起来。<br><br>";
      state.mode = "command";
      state.command = "menu";
    }
    return next();
  });

  kernel.register("get_move_coldtime", "cooldown", () => 650);
  kernel.register("get_search_coldtime", "cooldown", () => 650);
  kernel.register("set_coldtime", "cooldown", ({ session }, cooldown) => {
    const value = Number(cooldown);
    if (session.state.commandCooldown < value) session.state.commandCooldown = value;
    return session.state.commandCooldown;
  });
  kernel.register("check_in_coldtime", "cooldown", ({ session }) => {
    const state = session.state;
    const expires = numberField(state.player, "cdsec") * 1000 + numberField(state.player, "cdmsec");
    state.remainingCooldown = state.requestStartMs >= expires ? 0 : expires - state.requestStartMs;
    if (state.remainingCooldown > 0) {
      state.log += '<span class="yellow b">冷却时间尚未结束！</span><br>';
      state.mode = "command";
      return true;
    }
    return false;
  });
  kernel.register("move", "cooldown", ({ call, next }, destination = 99) => {
    if (call<boolean>("check_in_coldtime")) return;
    call("set_coldtime", call("get_move_coldtime", destination));
    return next(destination);
  });
  kernel.register("search", "cooldown", ({ call, next }) => {
    if (call<boolean>("check_in_coldtime")) return;
    call("set_coldtime", call("get_search_coldtime"));
    return next();
  });
  kernel.register("post_act", "cooldown", ({ next, session }) => {
    const state = session.state;
    if (state.commandCooldown !== 0) {
      const expires = state.requestStartMs + state.commandCooldown;
      state.player.cdsec = Math.floor(expires / 1000);
      state.player.cdmsec = expires % 1000;
    }
    const expires = numberField(state.player, "cdsec") * 1000 + numberField(state.player, "cdmsec");
    state.remainingCooldown = state.requestStartMs >= expires ? 0 : expires - state.requestStartMs;
    return next();
  });
  kernel.register("get_itemuse_coldtime", "cooldown", () => 250);
  kernel.register("itemuse_wrapper", "cooldown", ({ call, next }, item) => {
    if (call<boolean>("check_in_coldtime")) return;
    call("set_coldtime", call("get_itemuse_coldtime", item));
    return next(item);
  });

  kernel.register("calculate_move_sp_cost", "explore", () => 15);
  kernel.register("calculate_search_sp_cost", "explore", () => 15);
  kernel.register("discover", "explore", ({ session }, mode) => discover(session.state, String(mode) as LegacySearchMode));
  kernel.register("move_to_area", "explore", ({ call, session }, destination) => {
    const state = session.state;
    state.log += `${state.areaNames[numberField(state.player, "pls")] ?? ""}<br>`;
    return call("discover", "move", destination);
  });
  kernel.register("allow_move_check", "explore", ({ call, session }, destination) => {
    const state = session.state;
    const raw = String(destination);
    const target = raw === "main" ? "main" : phpInt(raw);
    const result = checkLegacyMove({
      currentArea: numberField(state.player, "pls"), destination: target,
      stamina: numberField(state.player, "sp"), availableAreas: state.availableAreas,
      forbiddenAreas: state.forbiddenAreas, areaNames: state.areaNames,
      calculatedCost: Number(call("calculate_move_sp_cost"))
    });
    state.log += result.logHtml;
    return result.allowed ? result.spCost : false;
  });
  kernel.register("move", "explore", ({ call, session }, destination = 99) => {
    const state = session.state;
    const cost = call<number | false>("allow_move_check", destination);
    if (cost === false) return;
    const target = phpInt(String(destination));
    state.player.sp = numberField(state.player, "sp") - cost;
    state.log += `你消耗<span class="yellow b">${cost}</span>点体力，移动到了${state.areaNames[target] ?? ""}。<br>`;
    state.player.pls = target;
    call("move_to_area", target);
  });
  kernel.register("allow_search_check", "explore", ({ call, session }) => {
    const state = session.state;
    const result = checkLegacySearch({
      currentArea: numberField(state.player, "pls"), stamina: numberField(state.player, "sp"),
      forbiddenAreas: state.forbiddenAreas, areaNames: state.areaNames,
      calculatedCost: Number(call("calculate_search_sp_cost"))
    });
    state.log += result.logHtml;
    return result.allowed ? result.spCost : false;
  });
  kernel.register("search_area", "explore", ({ call }) => call("discover", "search"));
  kernel.register("search", "explore", ({ call, session }) => {
    const state = session.state;
    const cost = call<number | false>("allow_search_check");
    if (cost === false) return;
    state.player.sp = numberField(state.player, "sp") - cost;
    state.log += `消耗<span class="yellow b">${cost}</span>点体力，你搜索着周围的一切……<br>`;
    call("search_area");
  });
  kernel.register("act", "explore", ({ call, next, session }) => {
    const state = session.state;
    if (state.mode === "command" && state.command === "move") call("move", state.input.moveto ?? "99");
    else if (state.mode === "command" && state.command === "search") call("search");
    return next();
  });

  kernel.register("itemuse", "itemmain", ({ session }, rawItem) => {
    const item = rawItem as LegacyItem;
    session.state.log += `你使用了道具 <span class="yellow b">${item.itm}</span> 。<br>但是什么也没有发生。<br>`;
  });
  kernel.register("itemuse", "edible", ({ next, session }, rawItem) => {
    const item = rawItem as LegacyItem;
    const state = session.state;
    const view = {
      hp: numberField(state.player, "hp"), mhp: numberField(state.player, "mhp"),
      sp: numberField(state.player, "sp"), msp: numberField(state.player, "msp"), pose: numberField(state.player, "pose")
    };
    const result = useLegacyEdible(view, item);
    if (!result.handled) return next(item);
    state.player.hp = view.hp;
    state.player.sp = view.sp;
    state.log += result.logHtml;
  });
  kernel.register("itemuse_wrapper", "itemmain", ({ call, session }, rawSlot) => {
    const state = session.state;
    const slot = phpInt(String(rawSlot));
    if (slot < 0 || slot > 6) {
      state.log += "此道具不存在，请重新选择。";
      state.mode = "command";
      return;
    }
    const item = readPlayerItem(state.player, slot);
    if (isLegacyItemEmpty(item)) {
      writePlayerItem(state.player, slot, emptyLegacyItem());
      state.log += "此道具不存在，请重新选择。<br>";
      state.mode = "command";
      return;
    }
    call("itemuse", item);
    writePlayerItem(state.player, slot, item);
    state.mode = "command";
  });
  kernel.register("itemmerge", "itemmain", ({ session }, rawFrom, rawTo) => {
    const state = session.state;
    const from = phpInt(String(rawFrom));
    const to = phpInt(String(rawTo));
    if (from === to) {
      state.log += "需要选择两个物品才能进行合并！";
      state.mode = "itemmerge";
      return false;
    }
    const inventory = readLegacyPlayerInventory(state.player);
    const source = inventory[from - 1];
    const target = inventory[to - 1];
    if (!source || !target) {
      state.log += "请选择正确的物品进行合并！";
      state.mode = "command";
      return false;
    }
    const result = mergeLegacyItems(source, target);
    state.log += result.logHtml;
    if (result.merged) state.mode = "command";
    writeLegacyPlayerInventory(state.player, inventory);
    return result.merged;
  });
  kernel.register("itemmove", "itemmain", ({ session }, rawFrom, rawTo) => {
    const state = session.state;
    const inventory = readLegacyPlayerInventory(state.player);
    const result = moveLegacyInventoryItem(inventory, phpInt(String(rawFrom)), phpInt(String(rawTo)));
    state.log += result.logHtml;
    if (result.merged) writeLegacyPlayerInventory(state.player, inventory);
    return result.merged;
  });
  kernel.register("act", "itemmain", ({ call, next, session }) => {
    const state = session.state;
    const itemCommand = state.input.itemcmd;
    if (state.mode === "command" && state.command.startsWith("itm")) {
      call("itemuse_wrapper", state.command.slice(3));
      return;
    }
    if (state.mode === "itemmain" && state.command === "itemmerge") {
      const merged = call<boolean>("itemmerge", state.input.merge1 ?? "", state.input.merge2 ?? "");
      if (!merged) {
        const inventory = readLegacyPlayerInventory(state.player);
        const from = phpInt(state.input.merge1 ?? "");
        const to = phpInt(state.input.merge2 ?? "");
        if (inventory[from - 1]?.itm !== inventory[to - 1]?.itm) {
          state.log += "<br>系统将你的命令自动识别为道具移动。";
          call("itemmove", from, to);
        }
      }
    } else if (state.mode === "itemmain" && state.command === "itemmove") {
      call("itemmove", state.input.from ?? "", state.input.to ?? "");
    } else if (state.mode === "command" && state.command === "itemmain" && ["itemmerge", "itemmove", "itemdrop"].includes(itemCommand ?? "")) {
      state.cmd = itemCommand ?? "";
    }
    return next();
  });

  kernel.register("chginf", "wound", ({ session }, position) => {
    const state = session.state;
    const wound = String(position ?? "");
    if (!wound) { state.mode = "command"; return; }
    const view = { inf: textField(state.player, "inf"), sp: numberField(state.player, "sp") };
    const result = bandageLegacyWound(view, wound);
    state.player.inf = view.inf;
    state.player.sp = view.sp;
    state.log += result.logHtml;
    state.mode = "command";
  });
  kernel.register("act", "wound", ({ call, next, session }) => {
    const state = session.state;
    if (state.mode === "special" && state.command.startsWith("inf")) {
      call("chginf", state.command.slice(3, 4));
      return;
    }
    return next();
  });

  kernel.register("rest", "rest", ({ session }) => {
    const state = session.state;
    const view = {
      hp: numberField(state.player, "hp"), mhp: numberField(state.player, "mhp"),
      sp: numberField(state.player, "sp"), msp: numberField(state.player, "msp"),
      inf: textField(state.player, "inf"), pose: numberField(state.player, "pose"),
      state: numberField(state.player, "state"), endtime: numberField(state.player, "endtime")
    };
    const result = applyLegacyRest(view, state.now);
    Object.assign(state.player, view);
    state.log += result.logHtml;
  });
  kernel.register("act", "rest", ({ call, next, session }) => {
    const state = session.state;
    if (state.mode === "command" && ["rest1", "rest2", "rest3"].includes(state.command)) {
      const restState = phpInt(state.command.slice(4, 5));
      if (restState === 3 && !LEGACY_HOSPITAL_AREAS.includes(numberField(state.player, "pls") as 11 | 19)) {
        state.log += '<span class="yellow b">你所在的位置并非医院，不能静养！</span><br>';
      } else {
        state.player.state = restState;
        state.mode = "rest";
        state.log += `你开始了${LEGACY_REST_NAMES[restState] ?? ""}…`;
      }
      return;
    }
    if (state.mode === "rest") {
      call("rest", state.command);
      if (state.command !== "rest") {
        state.player.state = 0;
        state.player.endtime = state.now;
        state.mode = "command";
      }
      return;
    }
    return next();
  });

  kernel.register("pose_change", "pose", ({ session }, requested) => {
    const state = session.state;
    const pose = phpInt(String(requested));
    if (canChangeLegacyPose(pose)) {
      state.log += `基础姿态变为<span class="yellow b">${getLegacyPose(pose).name}</span>。<br> `;
      state.player.pose = pose;
    } else state.log += "这个姿势太奇怪啦！<br> ";
  });
  kernel.register("act", "pose", ({ call, next, session }) => {
    const state = session.state;
    if (state.mode === "special" && state.command.startsWith("pose")) {
      call("pose_change", state.command.slice(4, 5));
      state.mode = "command";
      return;
    }
    return next();
  });

  kernel.register("tactic_change", "tactic", ({ session }, requested) => {
    const state = session.state;
    const tactic = phpInt(String(requested));
    if (canChangeLegacyTactic(tactic)) {
      state.log += `应战策略变为<span class="yellow b">${getLegacyTactic(tactic).name}</span>。<br> `;
      state.player.tactic = tactic;
    } else state.log += "这是什么奇怪的应战策略啦！<br> ";
  });
  kernel.register("act", "tactic", ({ call, next, session }) => {
    const state = session.state;
    if (state.mode === "special" && state.command.startsWith("tac")) {
      call("tactic_change", state.command.slice(3, 4));
      state.mode = "command";
      return;
    }
    return next();
  });

  kernel.register("act", "itemmix", ({ next, session }) => {
    const state = session.state;
    if (state.mode === "itemmain" && state.command === "itemmix") {
      const rawSelection = state.input.itemselect;
      if (rawSelection === "999") state.mode = "command";
      else {
        const slots = state.input.mixmask !== undefined
          ? legacySlotsFromMixMask(phpInt(state.input.mixmask))
          : [1, 2, 3, 4, 5, 6].filter((slot) => state.input[`mitm${slot}`] !== undefined && state.input[`mitm${slot}`] !== "");
        const inventory = readLegacyPlayerInventory(state.player);
        const selection = rawSelection === undefined ? -1 : phpInt(rawSelection);
        const result = runLegacyCraftAction(inventory, slots, selection, numberField(state.player, "club"), state.gametype);
        state.craftResult = result;
        state.log += result.logHtml;
        if (result.status === "crafted") {
          writeLegacyPlayerInventory(state.player, inventory);
          writeLegacyPendingItem(state.player, result.result);
        }
      }
    }
    return next();
  });

  return kernel;
}

export const LEGACY_BASE_COMMAND_KERNEL = createKernel();

export function runLegacyPlayerCommand(input: LegacyPlayerCommandInput): LegacyPlayerCommandState {
  const state: LegacyPlayerCommandState = {
    player: structuredClone(input.player),
    mode: input.mode ?? "command",
    command: input.command,
    input: input.input ?? {},
    now: input.now,
    requestStartMs: input.requestStartMs ?? input.now * 1000,
    gamestate: input.gamestate ?? 30,
    gametype: input.gametype ?? 0,
    log: "",
    cmd: "",
    action: "",
    playerDead: false,
    commandCooldown: 0,
    remainingCooldown: 0,
    availableAreas: input.availableAreas ?? LEGACY_MAP_CONFIG.names.map((_name, index) => index),
    forbiddenAreas: input.forbiddenAreas ?? [],
    areaNames: input.areaNames ?? [...LEGACY_MAP_CONFIG.names],
    ...(input.profile ? { profile: input.profile } : {}),
    ...(input.discover ? { discover: input.discover } : {})
  };
  const session = new LegacyExecutionSession(state);
  session.transaction(() => {
    LEGACY_BASE_COMMAND_KERNEL.call(session, "pre_act");
    if (state.gamestate >= 20 && numberField(state.player, "hp") > 0 && numberField(state.player, "state") <= 3) {
      LEGACY_BASE_COMMAND_KERNEL.call(session, "act");
    }
    LEGACY_BASE_COMMAND_KERNEL.call(session, "post_act");
  });
  Object.assign(input.player, state.player);
  state.player = input.player;
  return state;
}
