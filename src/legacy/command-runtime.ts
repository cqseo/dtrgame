import { toNumber } from "./template/values";
import { LEGACY_MAP_CONFIG } from "./map";
import { LEGACY_COMPILED_COOLDOWN } from "../generated/legacy-compiled-cooldown";
import {
  executeCompiledModuleFunction, executeCompiledModuleFunctionWithState, compiledFunction } from "./compiled-module-runtime";
import { runLegacyCraftAction, legacySlotsFromMixMask, type LegacyCraftActionResult } from "./crafting-action";
import { checkLegacyMove, checkLegacySearch } from "./explore";
import { calculateLegacyMeetCharacterRate } from "./explore";
import { LegacyCompatibilityKernel, LegacyExecutionSession } from "./hooks";
import { phpInt } from "./php-semantics";
import type { LegacyPlayerRecord } from "./player";
import { readLegacyPlayerInventory, writeLegacyPendingItem, writeLegacyPlayerInventory } from "./player-inventory";
import {
  LEGACY_BASE_ITEM_FIND_ODDS, LEGACY_INFINITE_DURABILITY,
  checkLegacyAttribute, clearLegacyItem, emptyLegacyItem, getLegacyMergeType, getLegacyPackBlank, isLegacyItemEmpty,
  mergeLegacyItems, moveLegacyInventoryItem, reduceLegacyItem, useLegacyEdible,
  type LegacyItem, type LegacyMapItem
} from "./item";
import { cryptoLegacyRandom, type LegacyRandom } from "./random";
import { applyLegacyRest, LEGACY_HOSPITAL_AREAS, LEGACY_REST_NAMES } from "./rest";
import { canChangeLegacyPose, canChangeLegacyTactic, getLegacyPose, getLegacyTactic } from "./stance";
import { calculateLegacyActiveOdds, canDiscoverLegacyCorpse, legacyCorpseHasLoot } from "./social";
import { createLegacyTeam, joinLegacyTeam, quitLegacyTeam } from "./social";
import { getLegacyWeather } from "./weather";
import { bandageLegacyWound, LEGACY_WOUND_PLACES } from "./wound";

export type LegacySearchMode = "search" | "move" | "search2";

export interface LegacyCommandDiscoveryResult { found: boolean; logHtml?: string; }
export interface LegacyEncounter {
  username: string;
  pid: number;
  name: string;
  kind: "enemy" | "corpse";
  active: boolean;
}

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
  mapItems: LegacyMapItem[];
  opponents: Record<string, LegacyPlayerRecord>;
  weatherId: number;
  roll: (min: number, max: number) => number;
  profile?: { motto?: string; killmsg?: string; lastword?: string };
  discover?: (mode: LegacySearchMode, state: LegacyPlayerCommandState) => LegacyCommandDiscoveryResult;
  craftResult?: LegacyCraftActionResult;
  encounter?: LegacyEncounter;
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
  mapItems?: LegacyMapItem[];
  opponents?: Record<string, LegacyPlayerRecord>;
  weatherId?: number;
  random?: LegacyRandom;
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

function addPendingItemToPack(state: LegacyPlayerCommandState, preferred = 0): boolean {
  const pending = readPlayerItem(state.player, 0);
  if (isLegacyItemEmpty(pending)) {
    state.log += "你没有捡取物品。<br>";
    state.mode = "command";
    return false;
  }
  const inventory = readLegacyPlayerInventory(state.player);
  const blank = preferred > 0 && preferred <= 6 && isLegacyItemEmpty(inventory[preferred - 1]!)
    ? preferred
    : getLegacyPackBlank(inventory);
  if (blank <= 0) {
    state.cmd = "itemdrop0";
    return false;
  }
  state.log += `将<span class="yellow b">${pending.itm}</span>放入包裹。<br>`;
  inventory[blank - 1] = pending;
  writeLegacyPlayerInventory(state.player, inventory);
  writeLegacyPendingItem(state.player, emptyLegacyItem());
  state.mode = "command";
  return true;
}

function getPendingItem(state: LegacyPlayerCommandState): void {
  const pending = readPlayerItem(state.player, 0);
  if (isLegacyItemEmpty(pending)) {
    state.log += "你没有捡取物品。<br>";
    state.mode = "command";
    return;
  }
  if (pending.itms !== LEGACY_INFINITE_DURABILITY && getLegacyMergeType(pending.itmk) === 1) {
    const weapon = {
      itm: textField(state.player, "wep"), itmk: textField(state.player, "wepk"),
      itme: numberField(state.player, "wepe"), itms: state.player.weps, itmsk: textField(state.player, "wepsk")
    };
    if (weapon.itm === pending.itm && weapon.itmk === pending.itmk && weapon.itme === pending.itme && weapon.itmsk === pending.itmsk) {
      state.player.weps = Number(weapon.itms) + Number(pending.itms);
      state.log += `与装备着的武器<span class="yellow b">${weapon.itm}</span>合并了。`;
      writeLegacyPendingItem(state.player, emptyLegacyItem());
      state.mode = "command";
      return;
    }
    const inventory = readLegacyPlayerInventory(state.player);
    const same = inventory.find((item) => !isLegacyItemEmpty(item)
      && item.itm === pending.itm && item.itmk === pending.itmk
      && item.itme === pending.itme && item.itmsk === pending.itmsk);
    if (same) {
      same.itms = Number(same.itms) + Number(pending.itms);
      state.log += `与包裹里的<span class="yellow b">${pending.itm}</span>合并了。`;
      writeLegacyPlayerInventory(state.player, inventory);
      writeLegacyPendingItem(state.player, emptyLegacyItem());
      state.mode = "command";
      return;
    }
  }
  if (pending.itms !== LEGACY_INFINITE_DURABILITY && getLegacyMergeType(pending.itmk) === 2) {
    const inventory = readLegacyPlayerInventory(state.player);
    const sameSlots = inventory.flatMap((item, index) => !isLegacyItemEmpty(item)
      && item.itm === pending.itm && item.itme === pending.itme
      && item.itmk.slice(1, 2) === pending.itmk.slice(1, 2)
      && getLegacyMergeType(item.itmk) === 2 ? [index + 1] : []);
    if (sameSlots.length) {
      state.cmd = `itemmerge0:${sameSlots.join(",")}`;
      return;
    }
  }
  addPendingItemToPack(state);
}

function equipmentItem(player: LegacyPlayerRecord, slot: "wep" | "arb" | "arh" | "ara" | "arf" | "art"): LegacyItem {
  return {
    itm: textField(player, slot), itmk: textField(player, `${slot}k` as keyof LegacyPlayerRecord),
    itme: numberField(player, `${slot}e` as keyof LegacyPlayerRecord), itms: player[`${slot}s` as keyof LegacyPlayerRecord],
    itmsk: textField(player, `${slot}sk` as keyof LegacyPlayerRecord)
  };
}

function writeEquipmentItem(player: LegacyPlayerRecord, slot: "wep" | "arb" | "arh" | "ara" | "arf" | "art", item: LegacyItem): void {
  player[slot] = item.itm;
  player[`${slot}k` as keyof LegacyPlayerRecord] = item.itmk;
  player[`${slot}e` as keyof LegacyPlayerRecord] = item.itme;
  player[`${slot}s` as keyof LegacyPlayerRecord] = item.itms;
  player[`${slot}sk` as keyof LegacyPlayerRecord] = item.itmsk;
}

function equipFromItem(state: LegacyPlayerCommandState, item: LegacyItem, slot: "wep" | "arb" | "arh" | "ara" | "arf" | "art", emptyKind = ""): void {
  const current = equipmentItem(state.player, slot);
  const slotEmpty = (emptyKind !== "" && current.itmk.startsWith(emptyKind)) || isLegacyItemEmpty(current);
  if (slotEmpty) {
    const name = item.itm;
    writeEquipmentItem(state.player, slot, item);
    clearLegacyItem(item);
    state.log += `装备了<span class="yellow b">${name}</span>。<br>`;
    return;
  }
  const old = { ...current };
  writeEquipmentItem(state.player, slot, item);
  Object.assign(item, old);
  state.log += `卸下了<span class="red b">${old.itm}</span>，装备了<span class="yellow b">${textField(state.player, slot)}</span>。<br>`;
}

function dropPlayerItem(state: LegacyPlayerCommandState, position: string): boolean {
  let item: LegacyItem;
  if (/^itm[0-6]$/.test(position)) item = readPlayerItem(state.player, phpInt(position.slice(3)));
  else if (["wep", "arb", "arh", "ara", "arf", "art"].includes(position)) {
    item = equipmentItem(state.player, position as "wep" | "arb" | "arh" | "ara" | "arf" | "art");
  } else {
    state.log += "该物品不存在！<br>";
    return false;
  }
  if (isLegacyItemEmpty(item) || item.itmk === "WN" || item.itmk === "DN") {
    state.log += "该物品不存在！<br>";
    state.mode = "command";
    return false;
  }
  const iid = state.mapItems.reduce((maximum, row) => Math.max(maximum, row.iid), 0) + 1;
  state.mapItems.push({ iid, pls: numberField(state.player, "pls"), ...item });
  state.log += `你丢弃了<span class="red b">${item.itm}</span>。<br>`;
  if (position.startsWith("itm")) writePlayerItem(state.player, phpInt(position.slice(3)), emptyLegacyItem());
  else if (position === "wep") writeEquipmentItem(state.player, "wep", {
    itm: "拳头", itmk: "WN", itme: 0, itms: LEGACY_INFINITE_DURABILITY, itmsk: ""
  });
  else if (position === "arb") writeEquipmentItem(state.player, "arb", {
    itm: "内衣", itmk: "DN", itme: 0, itms: LEGACY_INFINITE_DURABILITY, itmsk: ""
  });
  else writeEquipmentItem(state.player, position as "arh" | "ara" | "arf" | "art", emptyLegacyItem());
  state.mode = "command";
  return true;
}

function unequipPlayerItem(state: LegacyPlayerCommandState, position: string): boolean {
  if (!["wep", "arb", "arh", "ara", "arf", "art"].includes(position)) {
    state.log += "该物品不存在！<br>";
    return false;
  }
  const slot = position as "wep" | "arb" | "arh" | "ara" | "arf" | "art";
  const item = equipmentItem(state.player, slot);
  if (isLegacyItemEmpty(item) || item.itmk === "WN" || item.itmk === "DN") {
    state.log += "该物品不存在！<br>";
    state.mode = "command";
    return false;
  }
  state.log += `你卸下了装备<span class="yellow b">${item.itm}</span>。<br>`;
  writeLegacyPendingItem(state.player, item);
  if (slot === "wep") writeEquipmentItem(state.player, slot, {
    itm: "拳头", itmk: "WN", itme: 0, itms: LEGACY_INFINITE_DURABILITY, itmsk: ""
  });
  else if (slot === "arb") writeEquipmentItem(state.player, slot, {
    itm: "内衣", itmk: "DN", itme: 0, itms: LEGACY_INFINITE_DURABILITY, itmsk: ""
  });
  else writeEquipmentItem(state.player, slot, emptyLegacyItem());
  getPendingItem(state);
  return true;
}

function corpseHasLoot(player: LegacyPlayerRecord): boolean {
  return legacyCorpseHasLoot({
    money: numberField(player, "money"), weapon: equipmentItem(player, "wep"), body: equipmentItem(player, "arb"),
    head: equipmentItem(player, "arh"), arms: equipmentItem(player, "ara"), feet: equipmentItem(player, "arf"),
    accessory: equipmentItem(player, "art"), inventory: readLegacyPlayerInventory(player),
    cleared: numberField(player, "corpse_clear_flag") === 1
  });
}

function shuffledOpponents(state: LegacyPlayerCommandState): [string, LegacyPlayerRecord][] {
  const area = numberField(state.player, "pls");
  const pid = numberField(state.player, "pid");
  const result = Object.entries(state.opponents).filter(([, opponent]) =>
    numberField(opponent, "pls") === area && numberField(opponent, "pid") !== pid
    && (numberField(opponent, "hp") > 0 || corpseHasLoot(opponent)));
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = state.roll(0, index);
    [result[index], result[swap]] = [result[swap]!, result[index]!];
  }
  return result;
}

function discoverOpponent(state: LegacyPlayerCommandState): boolean {
  const candidates = shuffledOpponents(state);
  if (!candidates.length) {
    state.log += '<span class="yellow b">周围一个人都没有。</span><br>';
    state.mode = "command";
    return false;
  }
  let hidden = false;
  for (const [username, opponent] of candidates) {
    const alive = numberField(opponent, "hp") > 0;
    if (alive) {
      const findOdds = 70 + getLegacyPose(numberField(state.player, "pose")).findCharacterOdds
        + getLegacyTactic(numberField(state.player, "tactic")).meetCharacterOdds
        + getLegacyWeather(state.weatherId).meetCharacterOdds;
      const hideOdds = getLegacyPose(numberField(opponent, "pose")).hideOdds
        + getLegacyTactic(numberField(opponent, "tactic")).hideOdds;
      if (state.roll(0, 99) >= findOdds - hideOdds) { hidden = true; continue; }
      const activeOdds = calculateLegacyActiveOdds({
        defenderIsNpc: numberField(opponent, "type") > 0,
        attackerPose: numberField(state.player, "pose"), defenderPose: numberField(opponent, "pose"),
        attackerTactic: numberField(state.player, "tactic"), weatherId: state.weatherId
      });
      const active = state.roll(0, 99) < activeOdds;
      state.encounter = { username, pid: numberField(opponent, "pid"), name: textField(opponent, "name"), kind: "enemy", active };
      state.action = `enemy${state.encounter.pid}`;
      if (active) {
        state.cmd = "battlecmd";
        state.log += `你发现了敌人<span class="red b">${state.encounter.name}</span>！<br>对方好像完全没有注意到你！<br>`;
      }
      return true;
    }
    if (canDiscoverLegacyCorpse(numberField(opponent, "endtime"), state.now, { int: state.roll })) {
      state.encounter = {
        username, pid: numberField(opponent, "pid"), name: textField(opponent, "name"), kind: "corpse", active: true
      };
      state.action = `corpse${state.encounter.pid}`;
      state.cmd = "corpse";
      state.log += `你发现了<span class="red b">${state.encounter.name}</span>的尸体！<br>想要从尸体上拾取什么？<br>`;
      return true;
    }
  }
  state.log += hidden ? "似乎有人隐藏着……<br>" : '<span class="yellow b">周围一个人都没有，但你觉得应该有人的……</span><br>';
  state.mode = "command";
  return false;
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

  // The original returns $movecoldtime and $searchcoldtime from the cooldown
  // module's config rather than a literal, which is what lets skill417,
  // skill451, skill601 and skill738 change them and what lets an operator
  // retune them. Reading the generated table keeps both routes open and keeps
  // the value itself sourced from the original.
  kernel.register("get_move_coldtime", "cooldown", (_context, destination) =>
    toNumber(executeCompiledModuleFunction(compiledFunction(LEGACY_COMPILED_COOLDOWN, "get_move_coldtime"), [destination]))
  );
  kernel.register("get_search_coldtime", "cooldown", () =>
    toNumber(executeCompiledModuleFunction(compiledFunction(LEGACY_COMPILED_COOLDOWN, "get_search_coldtime")))
  );
  kernel.register("set_coldtime", "cooldown", ({ session }, cooldown, forced) => {
    const executed = executeCompiledModuleFunctionWithState(
      compiledFunction(LEGACY_COMPILED_COOLDOWN, "set_coldtime"),
      forced === undefined ? [cooldown] : [cooldown, forced],
      new Map([["cmdcdtime", session.state.commandCooldown]])
    );
    session.state.commandCooldown = toNumber(executed.variables.get("cmdcdtime") ?? 0);
    return toNumber(executed.value);
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
  kernel.register("get_itemuse_coldtime", "cooldown", (_context, item) =>
    toNumber(executeCompiledModuleFunction(compiledFunction(LEGACY_COMPILED_COOLDOWN, "get_itemuse_coldtime"), [item]))
  );
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
  kernel.register("itemuse", "weapon", ({ next, session }, rawItem) => {
    const item = rawItem as LegacyItem;
    if (!item.itmk.startsWith("W")) return next(item);
    equipFromItem(session.state, item, "wep", "WN");
  });
  kernel.register("itemuse", "armor", ({ next, session }, rawItem) => {
    const item = rawItem as LegacyItem;
    if (!item.itmk.startsWith("D")) return next(item);
    if (item.itmk.startsWith("DB")) equipFromItem(session.state, item, "arb", "DN");
    else if (item.itmk.startsWith("DH")) equipFromItem(session.state, item, "arh");
    else if (item.itmk.startsWith("DA")) equipFromItem(session.state, item, "ara");
    else if (item.itmk.startsWith("DF")) equipFromItem(session.state, item, "arf");
    else return next(item);
  });
  kernel.register("itemuse", "armor_art", ({ next, session }, rawItem) => {
    const item = rawItem as LegacyItem;
    if (!item.itmk.startsWith("A")) return next(item);
    equipFromItem(session.state, item, "art");
  });
  kernel.register("itemuse", "item_uc", ({ next, session }, rawItem) => {
    const item = rawItem as LegacyItem;
    if (!item.itmk.startsWith("C")) return next(item);
    const state = session.state;
    const condition = item.itmk.slice(1, 2);
    const names: Record<string, string> = {
      p: '<span class="purple b">中毒</span>', u: '<span class="red b">烧伤</span>',
      i: '<span class="cyan b">冻结</span>', e: '<span class="yellow b">身体麻痹</span>',
      w: '<span class="grey b">混乱</span>'
    };
    if (condition === "a") {
      state.log += `服用了<span class="red b">${item.itm}</span>。<br>`;
      let healed = false;
      for (const current of [...textField(state.player, "inf")]) {
        if (!LEGACY_WOUND_PLACES.includes(current)) {
          state.player.inf = textField(state.player, "inf").split(current).join("");
          state.log += `${names[current] ?? current}状态解除了。<br>`;
          healed = true;
        }
      }
      if (!healed) state.log += "但是什么也没发生。<br>";
    } else if (textField(state.player, "inf").includes(condition)) {
      state.player.inf = textField(state.player, "inf").split(condition).join("");
      state.log += `服用了<span class="red b">${item.itm}</span>，${names[condition] ?? condition}状态解除了。<br>`;
    } else {
      state.log += `服用了<span class="red b">${item.itm}</span>，但是什么效果也没有。<br>`;
    }
    state.log += reduceLegacyItem(item);
  });
  kernel.register("itemuse", "ammunition", ({ next, session }, rawItem) => {
    const item = rawItem as LegacyItem;
    if (!item.itmk.startsWith("GB")) return next(item);
    const state = session.state;
    const weaponKind = textField(state.player, "wepk");
    const attributes = textField(state.player, "wepsk");
    if (!weaponKind.startsWith("WG") && !weaponKind.startsWith("WJ")) {
      state.log += '<span class="red b">你没有装备枪械，不能使用子弹。</span><br>';
      state.mode = "command";
      return;
    }
    if (checkLegacyAttribute("o", attributes)) {
      state.log += `<span class="red b">${textField(state.player, "wep")}的弹匣是焊死的，不能装填弹药。</span><br>`;
      state.mode = "command";
      return;
    }
    let bulletKind = "GBss";
    let capacity = 6;
    if (weaponKind.startsWith("WJ")) { bulletKind = "GBh"; capacity = 4; }
    else if (["e", "w", "i", "u"].some((mark) => checkLegacyAttribute(mark, attributes))) { bulletKind = "GBee"; capacity = 10; }
    else if (checkLegacyAttribute("r", attributes)) { bulletKind = "GBss"; capacity = 24; }
    if (capacity <= 10 && checkLegacyAttribute("r", attributes)) capacity = bulletKind === "GBh" ? 6 : 12;
    if (item.itmk !== bulletKind) {
      state.log += `<span class='red b'>弹药类型不匹配，需要</span><span class='yellow b'>${bulletKind}</span>。<br>`;
      state.mode = "command";
      return;
    }
    if (state.player.weps === LEGACY_INFINITE_DURABILITY) state.player.weps = 0;
    const amount = Math.min(Math.max(capacity - numberField(state.player, "weps"), 0), Number(item.itms));
    if (amount <= 0) {
      state.log += `<span class="red b">${textField(state.player, "wep")}的弹匣是满的，不能装弹。</span>`;
      return;
    }
    item.itms = Number(item.itms) - amount;
    state.player.weps = numberField(state.player, "weps") + amount;
    state.log += `为<span class="red b">${textField(state.player, "wep")}</span>装填了<span class="red b">${item.itm}</span>，<span class="red b">${textField(state.player, "wep")}</span>残弹数增加了<span class="yellow b">${amount}</span>。<br>`;
    if (Number(item.itms) <= 0) {
      state.log += `<span class="red b">${item.itm}</span>用光了。<br>`;
      clearLegacyItem(item);
    }
  });
  kernel.register("calculate_itemfind_obbs", "itemmain", () => LEGACY_BASE_ITEM_FIND_ODDS);
  kernel.register("calculate_itemfind_obbs", "weather", ({ next, session }) =>
    Number(next()) + getLegacyWeather(session.state.weatherId).itemFindOdds);
  kernel.register("calculate_itemfind_obbs", "pose", ({ next, session }) =>
    Number(next()) + getLegacyPose(numberField(session.state.player, "pose")).itemFindOdds);
  kernel.register("calculate_itemfind_obbs_multiplier", "itemmain", () => 1);
  kernel.register("check_discover_item_found", "itemmain", ({ call, session }, buff = 0) => {
    const odds = Number(buff) + Number(call("calculate_itemfind_obbs")) * Number(call("calculate_itemfind_obbs_multiplier"));
    return session.state.roll(0, 99) < odds;
  });
  kernel.register("discover_item_filter", "itemmain", () => true);
  kernel.register("discover_item", "itemmain", ({ call, session }) => {
    const state = session.state;
    const area = numberField(state.player, "pls");
    const pool = state.mapItems.filter((item) => item.pls === area && call<boolean>("discover_item_filter", item));
    if (!pool.length) {
      state.log += '<span class="yellow b">周围找不到任何物品。</span><br>';
      state.mode = "command";
      return false;
    }
    const found = pool[state.roll(0, pool.length - 1)]!;
    const index = state.mapItems.findIndex((item) => item.iid === found.iid);
    if (index >= 0) state.mapItems.splice(index, 1);
    writeLegacyPendingItem(state.player, found);
    if (!isLegacyItemEmpty(found)) {
      state.cmd = "itemfind";
      state.log += `<br>发现了物品 <span class='yellow b'>${found.itm}</span>，<br>`;
      return true;
    }
    state.log += "但是什么都没有发现。<br>";
    state.mode = "command";
    return false;
  });
  kernel.register("discover", "itemmain", ({ call, next, session }, mode) => {
    // A caller-supplied discovery adapter represents the remaining complete
    // legacy discovery chain (events/traps/players/items) in parity fixtures.
    if (session.state.discover) return next(mode);
    if (call<boolean>("check_discover_item_found")) return call("discover_item");
    return next(mode);
  });

  kernel.register("calculate_meetman_rate", "metman", ({ session }, mode) => {
    const state = session.state;
    const area = numberField(state.player, "pls");
    const pid = numberField(state.player, "pid");
    const count = Object.values(state.opponents).filter((opponent) =>
      numberField(opponent, "pls") === area && numberField(opponent, "pid") !== pid
      && (numberField(opponent, "hp") > 0 || numberField(opponent, "corpse_clear_flag") !== 1)).length;
    const base = calculateLegacyMeetCharacterRate(String(mode) as LegacySearchMode, count);
    const pose = getLegacyPose(numberField(state.player, "pose"));
    const tactic = getLegacyTactic(numberField(state.player, "tactic"));
    return base + pose.findCharacterOdds - pose.itemFindOdds + tactic.meetCharacterOdds;
  });
  kernel.register("discover_player", "metman", ({ session }) => discoverOpponent(session.state));
  kernel.register("discover", "metman", ({ call, next, session }, mode) => {
    const state = session.state;
    if (state.discover) return next(mode);
    const rate = Math.max(20, Number(call("calculate_meetman_rate", mode)));
    if (state.roll(0, 99) < rate) {
      const found = call<boolean>("discover_player");
      if (found || numberField(state.player, "pose") !== 3 || numberField(state.player, "hp") <= 0) return found;
    }
    return next(mode);
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
    if (state.mode === "itemmain" && state.command === "itemget") {
      getPendingItem(state);
      return;
    }
    if (state.mode === "itemmain" && state.command === "itemadd") {
      addPendingItemToPack(state, phpInt(state.input.to ?? "0"));
      return;
    }
    if (state.mode === "itemmain" && state.command.startsWith("drop")) {
      dropPlayerItem(state, state.command.slice(4));
      return;
    }
    if (state.mode === "itemmain" && state.command.startsWith("off")) {
      unequipPlayerItem(state, state.command.slice(3));
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

  kernel.register("act", "team", ({ next, session }) => {
    const state = session.state;
    if (state.mode === "command" && state.command === "team") {
      if (state.input.teamcmd === "teamquit") {
        const result = quitLegacyTeam(state.player as unknown as Parameters<typeof quitLegacyTeam>[0]);
        state.log += result.logHtml;
        state.mode = "command";
      } else {
        state.cmd = "team";
      }
      return;
    }
    if (state.mode === "team" && (state.command === "teammake" || state.command === "teamjoin")) {
      const teamID = state.input.nteamID ?? "";
      const password = state.input.nteamPass ?? "";
      const members = Object.values(state.opponents) as unknown as Parameters<typeof joinLegacyTeam>[3];
      const result = state.command === "teammake"
        ? createLegacyTeam(
          state.player as unknown as Parameters<typeof createLegacyTeam>[0], teamID, password,
          members.map((member) => member.teamID).filter(Boolean), "--"
        )
        : joinLegacyTeam(state.player as unknown as Parameters<typeof joinLegacyTeam>[0], teamID, password, members, "--");
      state.log += result.logHtml;
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
  const random = input.random ?? cryptoLegacyRandom;
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
    action: textField(input.player, "action"),
    playerDead: false,
    commandCooldown: 0,
    remainingCooldown: 0,
    availableAreas: input.availableAreas ?? LEGACY_MAP_CONFIG.names.map((_name, index) => index),
    forbiddenAreas: input.forbiddenAreas ?? [],
    areaNames: input.areaNames ?? [...LEGACY_MAP_CONFIG.names],
    mapItems: structuredClone(input.mapItems ?? []),
    opponents: structuredClone(input.opponents ?? {}),
    weatherId: input.weatherId ?? 0,
    roll: (min, max) => random.int(min, max),
    ...(input.profile ? { profile: input.profile } : {}),
    ...(input.discover ? { discover: input.discover } : {})
  };
  const session = new LegacyExecutionSession(state, { random });
  session.transaction(() => {
    LEGACY_BASE_COMMAND_KERNEL.call(session, "pre_act");
    if (state.gamestate >= 20 && numberField(state.player, "hp") > 0 && numberField(state.player, "state") <= 3) {
      LEGACY_BASE_COMMAND_KERNEL.call(session, "act");
    }
    LEGACY_BASE_COMMAND_KERNEL.call(session, "post_act");
  });
  state.player.action = state.action;
  Object.assign(input.player, state.player);
  state.player = input.player;
  if (input.mapItems) input.mapItems.splice(0, input.mapItems.length, ...state.mapItems);
  return state;
}
