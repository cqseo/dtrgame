import { describe, expect, it } from "vitest";
import { createLegacyPlayerRecord } from "../src/generated/legacy-registry";
import { LEGACY_BASE_COMMAND_KERNEL, runLegacyPlayerCommand } from "../src/legacy/command-runtime";
import type { LegacyPlayerRecord } from "../src/legacy/player";
import { SequenceLegacyRandom } from "../src/legacy/random";
import type { LegacyMapItem } from "../src/legacy/item";

function player(): LegacyPlayerRecord {
  const value = createLegacyPlayerRecord();
  Object.assign(value, {
    name: "测试者", hp: 300, mhp: 400, sp: 300, msp: 400,
    pls: 0, pose: 3, tactic: 2, state: 0, endtime: 100,
    inf: "", club: 0
  });
  return value;
}

describe("original command.php base action transaction", () => {
  it("registers the original module implementations on the compatibility kernel", () => {
    expect(LEGACY_BASE_COMMAND_KERNEL.implementations("act")).toEqual([
      "player", "explore", "itemmain", "itemmix", "team", "wound", "rest", "pose", "tactic"
    ]);
    expect(LEGACY_BASE_COMMAND_KERNEL.implementations("move")).toEqual(["explore", "cooldown"]);
    expect(LEGACY_BASE_COMMAND_KERNEL.implementations("chginf")).toEqual(["wound"]);
    expect(LEGACY_BASE_COMMAND_KERNEL.implementations("discover")).toEqual(["explore", "itemmain", "metman"]);
    expect(LEGACY_BASE_COMMAND_KERNEL.implementations("calculate_itemfind_obbs")).toEqual(["itemmain", "pose", "weather"]);
    expect(LEGACY_BASE_COMMAND_KERNEL.implementations("itemuse")).toEqual(expect.arrayContaining([
      "itemmain", "edible", "weapon", "armor", "armor_art", "item_uc", "ammunition"
    ]));
  });

  it("wraps move/search with the original 650ms cooldown hook", () => {
    const data = player();
    runLegacyPlayerCommand({
      player: data, command: "move", input: { moveto: "1" }, now: 100, requestStartMs: 100_000,
      availableAreas: [0, 1], areaNames: ["无月之影", "端点"]
    });
    expect([data.cdsec, data.cdmsec]).toEqual([100, 650]);
    const blocked = runLegacyPlayerCommand({
      player: data, command: "search", now: 100, requestStartMs: 100_200,
      availableAreas: [0, 1], areaNames: ["无月之影", "端点"]
    });
    expect(data.sp).toBe(285);
    expect(blocked.remainingCooldown).toBe(450);
    expect(blocked.log).toContain("冷却时间尚未结束");
  });

  it("runs the exact move and search stamina/log transitions", () => {
    const data = player();
    const moved = runLegacyPlayerCommand({
      player: data, command: "move", input: { moveto: "1" }, now: 101,
      availableAreas: [0, 1], areaNames: ["无月之影", "端点"],
      discover: (mode) => ({ found: false, logHtml: `发现流程:${mode}<br>` })
    });
    expect(data.pls).toBe(1);
    expect(data.sp).toBe(285);
    expect(moved.log).toBe("你消耗<span class=\"yellow b\">15</span>点体力，移动到了端点。<br>端点<br>发现流程:move<br>");

    const searched = runLegacyPlayerCommand({
      player: data, command: "search", now: 102, random: new SequenceLegacyRandom([99, 99]),
      availableAreas: [0, 1], areaNames: ["无月之影", "端点"]
    });
    expect(data.sp).toBe(270);
    expect(searched.log).toContain("你搜索着周围的一切");
    expect(searched.log).toContain("但是什么都没有发现");
  });

  it("rejects forbidden movement without mutating stamina or area", () => {
    const data = player();
    const result = runLegacyPlayerCommand({
      player: data, command: "move", input: { moveto: "1" }, now: 101,
      availableAreas: [0, 1], forbiddenAreas: [1], areaNames: ["无月之影", "端点"]
    });
    expect(data.pls).toBe(0);
    expect(data.sp).toBe(300);
    expect(result.log).toBe("端点是禁区，还是离远点吧！<br>");
  });

  it("preserves pose, tactic and wound command short-circuit order", () => {
    const data = player();
    const posed = runLegacyPlayerCommand({ player: data, mode: "special", command: "pose5", now: 101 });
    expect(data.pose).toBe(5);
    expect(posed.mode).toBe("command");
    expect(posed.log).toContain("治疗姿态");

    const tactic = runLegacyPlayerCommand({ player: data, mode: "special", command: "tac4", now: 102 });
    expect(data.tactic).toBe(4);
    expect(tactic.log).toContain("重视躲避");

    data.inf = "b";
    data.sp = 100;
    const healed = runLegacyPlayerCommand({ player: data, mode: "special", command: "infb", now: 103 });
    expect(data.inf).toBe("");
    expect(data.sp).toBe(50);
    expect(healed.log).toContain("胸");
  });

  it("starts and resolves the original rest modes", () => {
    const data = player();
    data.sp = 200;
    let result = runLegacyPlayerCommand({ player: data, command: "rest1", now: 100 });
    expect(result.mode).toBe("rest");
    expect(data.state).toBe(1);
    expect(result.log).toBe("你开始了睡眠…");

    result = runLegacyPlayerCommand({ player: data, mode: "rest", command: "rest", now: 130 });
    expect(data.sp).toBe(240);
    expect(data.endtime).toBe(130);
    expect(result.log).toContain("恢复了<span class=\"yellow b\">40</span>点");
  });

  it("passes original itemmix selection through the same act chain", () => {
    const data = player();
    Object.assign(data, {
      itm1: "红色方块", itmk1: "X", itme1: 1, itms1: 1, itmsk1: "",
      itm2: "Y方块", itmk2: "X", itme2: 1, itms2: 1, itmsk2: ""
    });
    const result = runLegacyPlayerCommand({
      player: data, mode: "itemmain", command: "itemmix", input: { mixmask: "3", itemselect: "1" }, now: 100
    });
    expect(result.craftResult?.status).toBe("crafted");
    expect(data.itm1).toBe("");
    expect(data.itm2).toBe("");
    expect(data.itm0).toBe("黑色方块");
  });

  it("uses, merges and moves backpack items through itemmain hooks", () => {
    const data = player();
    Object.assign(data, { itm1: "面包", itmk1: "HH", itme1: 100, itms1: 3, itmsk1: "" });
    const used = runLegacyPlayerCommand({ player: data, command: "itm1", now: 100, requestStartMs: 100_000 });
    expect(data.hp).toBe(400);
    expect(data.itms1).toBe(2);
    expect([data.cdsec, data.cdmsec]).toEqual([100, 250]);
    expect(used.log).toContain("你使用了<span class=\"lime b\">面包</span>");

    Object.assign(data, {
      itm1: "针", itmk1: "WC", itme1: 10, itms1: 2, itmsk1: "",
      itm2: "针", itmk2: "WC", itme2: 10, itms2: 3, itmsk2: ""
    });
    const merged = runLegacyPlayerCommand({
      player: data, mode: "itemmain", command: "itemmerge", input: { merge1: "1", merge2: "2" }, now: 101
    });
    expect(data.itm1).toBe("");
    expect(data.itms2).toBe(5);
    expect(merged.log).toContain("你合并了");

    Object.assign(data, { itm3: "石头", itmk3: "X", itme3: 1, itms3: 1, itmsk3: "", itm4: "", itms4: 0 });
    runLegacyPlayerCommand({
      player: data, mode: "itemmain", command: "itemmove", input: { from: "3", to: "4" }, now: 102
    });
    expect(data.itm3).toBe("");
    expect(data.itm4).toBe("石头");
  });

  it("equips and swaps original weapon and armor items from the same backpack slot", () => {
    const data = player();
    Object.assign(data, {
      wep: "拳头", wepk: "WN", wepe: 0, weps: "∞", wepsk: "",
      itm1: "调色刀", itmk1: "WK", itme1: 45, itms1: 9, itmsk1: ""
    });
    let result = runLegacyPlayerCommand({ player: data, command: "itm1", now: 100, requestStartMs: 100_000 });
    expect(result.log).toContain("装备了<span class=\"yellow b\">调色刀</span>");
    expect(data).toMatchObject({ wep: "调色刀", wepk: "WK", wepe: 45, weps: 9, itm1: "", itms1: 0 });

    Object.assign(data, { itm1: "木棒", itmk1: "WP", itme1: 12, itms1: 5, itmsk1: "" });
    result = runLegacyPlayerCommand({ player: data, command: "itm1", now: 101, requestStartMs: 101_000 });
    expect(result.log).toContain("卸下了<span class=\"red b\">调色刀</span>");
    expect(data).toMatchObject({ wep: "木棒", wepk: "WP", itm1: "调色刀", itmk1: "WK", itms1: 9 });

    Object.assign(data, {
      arb: "内衣", arbk: "DN", arbe: 0, arbs: "∞", arbsk: "",
      itm2: "男生校服", itmk2: "DB", itme2: 5, itms2: 15, itmsk2: ""
    });
    result = runLegacyPlayerCommand({ player: data, command: "itm2", now: 102, requestStartMs: 102_000 });
    expect(result.log).toContain("装备了<span class=\"yellow b\">男生校服</span>");
    expect(data).toMatchObject({ arb: "男生校服", arbk: "DB", arbe: 5, arbs: 15, itm2: "", itms2: 0 });
  });

  it("drops backpack, pending and equipped items into the persisted mapitem pool", () => {
    const data = player();
    Object.assign(data, {
      pls: 2,
      itm1: "石头", itmk1: "X", itme1: 1, itms1: 1, itmsk1: "",
      itm0: "面包", itmk0: "HH", itme0: 100, itms0: 2, itmsk0: "",
      wep: "调色刀", wepk: "WK", wepe: 45, weps: 9, wepsk: ""
    });
    const mapItems: LegacyMapItem[] = [];
    runLegacyPlayerCommand({ player: data, mode: "itemmain", command: "dropitm0", now: 100, mapItems });
    expect(data.itm0).toBe("");
    expect(mapItems[0]).toMatchObject({ iid: 1, pls: 2, itm: "面包" });

    runLegacyPlayerCommand({ player: data, mode: "itemmain", command: "dropitm1", now: 101, mapItems });
    expect(data.itm1).toBe("");
    expect(mapItems[1]).toMatchObject({ iid: 2, pls: 2, itm: "石头" });

    const result = runLegacyPlayerCommand({ player: data, mode: "itemmain", command: "dropwep", now: 102, mapItems });
    expect(result.log).toContain("你丢弃了<span class=\"red b\">调色刀</span>");
    expect(data).toMatchObject({ wep: "拳头", wepk: "WN", weps: "∞" });
    expect(mapItems[2]).toMatchObject({ iid: 3, pls: 2, itm: "调色刀" });
  });

  it("unequips equipment through pending slot and the original itemget path", () => {
    const data = player();
    Object.assign(data, {
      wep: "调色刀", wepk: "WK", wepe: 45, weps: 9, wepsk: "",
      itm1: "", itmk1: "", itme1: 0, itms1: 0, itmsk1: ""
    });
    const result = runLegacyPlayerCommand({ player: data, mode: "itemmain", command: "offwep", now: 100 });
    expect(result.log).toContain("你卸下了装备<span class=\"yellow b\">调色刀</span>");
    expect(result.log).toContain("放入包裹");
    expect(data).toMatchObject({ wep: "拳头", wepk: "WN", weps: "∞", itm1: "调色刀", itmk1: "WK", itms1: 9 });
  });

  it("uses abnormal-status medicine without healing normal limb wounds", () => {
    const data = player();
    Object.assign(data, {
      inf: "bpu", itm1: "全复药剂", itmk1: "Ca", itme1: 0, itms1: 2, itmsk1: ""
    });
    const result = runLegacyPlayerCommand({ player: data, command: "itm1", now: 100, requestStartMs: 100_000 });
    expect(data.inf).toBe("b");
    expect(data.itms1).toBe(1);
    expect(result.log).toContain("中毒");
    expect(result.log).toContain("烧伤");
  });

  it("loads matching ammunition and preserves leftovers in the backpack slot", () => {
    const data = player();
    Object.assign(data, {
      wep: "手枪", wepk: "WG", wepe: 20, weps: 2, wepsk: "",
      itm1: "实体弹药", itmk1: "GBss", itme1: 0, itms1: 10, itmsk1: ""
    });
    const result = runLegacyPlayerCommand({ player: data, command: "itm1", now: 100, requestStartMs: 100_000 });
    expect(data.weps).toBe(6);
    expect(data.itms1).toBe(6);
    expect(result.log).toContain("残弹数增加了<span class=\"yellow b\">4</span>");
  });

  it("blocks unrelated commands while the original pending-item slot is occupied", () => {
    const data = player();
    Object.assign(data, { itm0: "待处理物品", itmk0: "X", itme0: 1, itms0: 1, itmsk0: "" });
    const result = runLegacyPlayerCommand({ player: data, command: "search", now: 100 });
    expect(data.sp).toBe(300);
    expect(result.command).toBe("menu");
    expect(result.log).toContain("召唤幻肢");
  });

  it("keeps the caller's player record untouched when a nested hook throws", () => {
    const data = player();
    const before = structuredClone(data);
    expect(() => runLegacyPlayerCommand({
      player: data, command: "move", input: { moveto: "1" }, now: 101,
      availableAreas: [0, 1], areaNames: ["无月之影", "端点"],
      discover: () => { throw new Error("discover failed"); }
    })).toThrow("discover failed");
    expect(data).toEqual(before);
  });

  it("discovers one original mapitem row and removes it into pending slot zero", () => {
    const data = player();
    const mapItems: LegacyMapItem[] = [
      { iid: 10, pls: 0, itm: "针", itmk: "WC", itme: 10, itms: 2, itmsk: "" },
      { iid: 11, pls: 0, itm: "面包", itmk: "HH", itme: 100, itms: 1, itmsk: "" }
    ];
    const result = runLegacyPlayerCommand({
      player: data, command: "search", now: 100, mapItems,
      random: new SequenceLegacyRandom([99, 0, 1])
    });
    expect(result.cmd).toBe("itemfind");
    expect(result.log).toContain("发现了物品 <span class='yellow b'>面包</span>");
    expect(data.itm0).toBe("面包");
    expect(mapItems.map(({ iid }) => iid)).toEqual([10]);
  });

  it("picks a pending item into a blank slot and auto-merges stackable finds", () => {
    const data = player();
    Object.assign(data, { itm0: "针", itmk0: "WC", itme0: 10, itms0: 2, itmsk0: "" });
    let result = runLegacyPlayerCommand({ player: data, mode: "itemmain", command: "itemget", now: 100 });
    expect(result.log).toContain("放入包裹");
    expect(data.itm1).toBe("针");
    expect(data.itm0).toBe("");

    Object.assign(data, { itm0: "针", itmk0: "WC", itme0: 10, itms0: 3, itmsk0: "" });
    result = runLegacyPlayerCommand({ player: data, mode: "itemmain", command: "itemget", now: 101 });
    expect(result.log).toContain("与包裹里的");
    expect(data.itms1).toBe(5);
    expect(data.itm0).toBe("");
  });

  it("keeps a pending find when the backpack is full", () => {
    const data = player();
    for (let slot = 1; slot <= 6; slot += 1) Object.assign(data, {
      [`itm${slot}`]: `物品${slot}`, [`itmk${slot}`]: "X", [`itme${slot}`]: 1, [`itms${slot}`]: 1, [`itmsk${slot}`]: ""
    });
    Object.assign(data, { itm0: "新物品", itmk0: "X", itme0: 1, itms0: 1, itmsk0: "" });
    const result = runLegacyPlayerCommand({ player: data, mode: "itemmain", command: "itemget", now: 100 });
    expect(result.cmd).toBe("itemdrop0");
    expect(data.itm0).toBe("新物品");
  });

  it("rolls back map items and deterministic RNG when discovery fails mid-transaction", () => {
    const data = player();
    const before = structuredClone(data);
    const mapItems: LegacyMapItem[] = [{ iid: 10, pls: 0, itm: "针", itmk: "WC", itme: 10, itms: 2, itmsk: "" }];
    const random = new SequenceLegacyRandom([0]);
    expect(() => runLegacyPlayerCommand({ player: data, command: "search", now: 100, mapItems, random })).toThrow("sequence exhausted");
    expect(data).toEqual(before);
    expect(mapItems).toHaveLength(1);
    expect(random.consumed).toBe(0);
  });

  it("discovers a visible player and enters the original active enemy action", () => {
    const data = player();
    Object.assign(data, { pid: 1, pose: 1, tactic: 2 });
    const enemy = player();
    Object.assign(enemy, { pid: 2, name: "敌人", pls: 0, pose: 0, tactic: 0, type: 0 });
    const result = runLegacyPlayerCommand({
      player: data, command: "search", now: 100, opponents: { "敌人": enemy }, weatherId: 2,
      random: new SequenceLegacyRandom([0, 0, 0])
    });
    expect(result.encounter).toEqual({ username: "敌人", pid: 2, name: "敌人", kind: "enemy", active: true });
    expect(result.action).toBe("enemy2");
    expect(data.action).toBe("enemy2");
    expect(result.cmd).toBe("battlecmd");
    expect(result.log).toContain("你发现了敌人<span class=\"red b\">敌人</span>");
  });

  it("continues to item discovery in search pose after a player stays hidden", () => {
    const data = player();
    Object.assign(data, { pid: 1, pose: 3, tactic: 2 });
    const enemy = player();
    Object.assign(enemy, { pid: 2, name: "隐者", pls: 0, pose: 4, tactic: 4, type: 0 });
    const mapItems: LegacyMapItem[] = [{ iid: 10, pls: 0, itm: "针", itmk: "WC", itme: 10, itms: 2, itmsk: "" }];
    const result = runLegacyPlayerCommand({
      player: data, command: "search", now: 100, opponents: { "隐者": enemy }, mapItems, weatherId: 2,
      random: new SequenceLegacyRandom([0, 99, 0, 0])
    });
    expect(result.encounter).toBeUndefined();
    expect(result.log).toContain("似乎有人隐藏着");
    expect(result.cmd).toBe("itemfind");
    expect(data.itm0).toBe("针");
  });

  it("applies corpse loot filtering and short protection before opening corpse actions", () => {
    const data = player();
    Object.assign(data, { pid: 1, pose: 1, tactic: 2 });
    const corpse = player();
    Object.assign(corpse, {
      pid: 2, name: "死者", pls: 0, hp: 0, endtime: 90, money: 1,
      corpse_clear_flag: 0, type: 0
    });
    const result = runLegacyPlayerCommand({
      player: data, command: "search", now: 100, opponents: { "死者": corpse }, weatherId: 2,
      random: new SequenceLegacyRandom([0, 0])
    });
    expect(result.encounter).toEqual({ username: "死者", pid: 2, name: "死者", kind: "corpse", active: true });
    expect(result.action).toBe("corpse2");
    expect(data.action).toBe("corpse2");
    expect(result.cmd).toBe("corpse");
  });

  it("creates, joins and quits teams with the original stamina and credential rules", () => {
    const creator = player();
    creator.sp = 300;
    let result = runLegacyPlayerCommand({
      player: creator, mode: "team", command: "teammake",
      input: { nteamID: "轮回者", nteamPass: "secret" }, now: 100
    });
    expect(result.log).toContain("你创建了队伍<span class=\"yellow b\">轮回者</span>");
    expect(creator).toMatchObject({ teamID: "轮回者", teamPass: "secret", sp: 100 });

    const member = player();
    member.name = "队员";
    member.sp = 300;
    result = runLegacyPlayerCommand({
      player: member, mode: "team", command: "teamjoin",
      input: { nteamID: "轮回者", nteamPass: "secret" }, opponents: { "测试者": creator }, now: 101
    });
    expect(result.log).toContain("你加入了队伍<span class=\"yellow b\">轮回者</span>");
    expect(member).toMatchObject({ teamID: "轮回者", teamPass: "secret", sp: 200 });

    result = runLegacyPlayerCommand({
      player: member, command: "team", input: { teamcmd: "teamquit" }, now: 102
    });
    expect(result.log).toContain("你退出了队伍");
    expect(member).toMatchObject({ teamID: "", teamPass: "" });
  });
});
