import { describe, expect, it } from "vitest";
import { createLegacyPlayerRecord } from "../src/generated/legacy-registry";
import { LEGACY_BASE_COMMAND_KERNEL, runLegacyPlayerCommand } from "../src/legacy/command-runtime";
import type { LegacyPlayerRecord } from "../src/legacy/player";

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
      "player", "explore", "itemmain", "itemmix", "wound", "rest", "pose", "tactic"
    ]);
    expect(LEGACY_BASE_COMMAND_KERNEL.implementations("move")).toEqual(["explore", "cooldown"]);
    expect(LEGACY_BASE_COMMAND_KERNEL.implementations("chginf")).toEqual(["wound"]);
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
      player: data, command: "search", now: 102,
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
});
