import { describe, expect, it } from "vitest";
import { LEGACY_ROOM_CONFIGURATION } from "../src/generated/legacy-room-types";
import { legacyInputRecord, legacyStringFilter } from "../src/legacy/input";
import {
  applyLegacyRoomCommand,
  createLegacyRoomRecord,
  createLegacyWaitingRoom,
  legacyRoomParticipantLimit,
  updateLegacyRoomState,
  type LegacyRoomRuntimeState
} from "../src/legacy/room";

describe("generated legacy room configuration", () => {
  it("retains every enabled Baota room definition and exact core numbers", () => {
    expect(Object.keys(LEGACY_ROOM_CONFIGURATION.roomTypes)).toEqual([
      "0", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"
    ]);
    expect(LEGACY_ROOM_CONFIGURATION.roomTypes[0]).toMatchObject({ name: "SOLO模式", gtype: 10, pnum: 2 });
    expect(LEGACY_ROOM_CONFIGURATION.roomTypes[4]).toMatchObject({ name: "组队模式", gtype: 14, pnum: 25 });
    expect(LEGACY_ROOM_CONFIGURATION.roomTypes[11]["ready-expire-time"]).toBe(180);
    expect(LEGACY_ROOM_CONFIGURATION.roomTypes[14]["ready-expire-time"]).toBe(90);
  });
});

describe("legacy input compatibility", () => {
  it("matches gstrfilter ordering and variable-name rules", () => {
    expect(legacyStringFilter(`a'b\\c___<x title="&">`)).toBe("abc&lt;x title=&quot;&amp;&quot;&gt;");
    expect(legacyInputRecord(new URLSearchParams([
      ["command", "newchat"], ["para1", `<b>hi</b>'\\___`], ["1bad", "drop"]
    ]))).toEqual({ command: "newchat", para1: "&lt;b&gt;hi&lt;/b&gt;" });
  });
});

describe("legacy waiting-room runtime", () => {
  it("initializes byte-for-byte-shaped room state and dynamic team limit", () => {
    const room = createLegacyWaitingRoom(4, "房主");
    expect(room.timestamp).toBe(1);
    expect(room.chatdata).toHaveLength(10);
    expect(room.chatdata.every(({ cid, data }) => cid === -1 && data === "")).toBe(true);
    expect(room.player).toHaveLength(25);
    expect(room.player[0]).toEqual({ name: "房主", ready: 0, forbidden: 0, leader: 0 });
    expect(room.current_game_option).toEqual({ "group-num": "2", "opening-gamestate": "40", "card-select": "0" });
    expect(legacyRoomParticipantLimit(room)).toBe(10);
  });

  it("runs the original two-player fill and ready transition", () => {
    const state: LegacyRoomRuntimeState = { record: createLegacyRoomRecord(1, 0, "甲", 100) };
    const joined = applyLegacyRoomCommand(state, { command: "pos_enter", actor: "乙", para1: "1", now: 101 });
    expect(joined.record.room.readystat).toBe(1);
    expect(joined.record.room.kicktime).toBe(131);
    expect(joined.record.room.player[1]?.name).toBe("乙");
    expect(joined.record.room.chatdata[9]?.data).toContain("乙进入了一个空位置");

    expect(applyLegacyRoomCommand(state, { command: "ready", actor: "甲", now: 102 }).startRequested).toBe(false);
    const final = applyLegacyRoomCommand(state, { command: "ready", actor: "乙", now: 103 });
    expect(final.startRequested).toBe(true);
    expect(final.record.room.readystat).toBe(2);
    expect(final.record.room.chatdata[9]?.data).toContain("所有人均已准备");
  });

  it("preserves team-leader disable, group option, kick and leave rules", () => {
    const state: LegacyRoomRuntimeState = { record: createLegacyRoomRecord(2, 4, "房主", 10) };
    applyLegacyRoomCommand(state, { command: "pos_enter", actor: "队长乙", para1: "5", now: 11 });
    applyLegacyRoomCommand(state, { command: "pos_disable", actor: "房主", para1: "all", now: 12 });
    expect(state.record.room.player.slice(0, 10).filter((slot) => !slot.name).every((slot) => slot.forbidden === 1)).toBe(true);
    expect(state.record.room.readystat).toBe(1);

    const optionState: LegacyRoomRuntimeState = { record: createLegacyRoomRecord(3, 4, "房主", 20) };
    applyLegacyRoomCommand(optionState, { command: "game-option", actor: "房主", para1: "group-num", para2: "3", now: 21 });
    expect(optionState.record.room.current_game_option["group-num"]).toBe("3");
    expect(legacyRoomParticipantLimit(optionState.record.room)).toBe(15);
    applyLegacyRoomCommand(optionState, { command: "pos_enter", actor: "乙", para1: "5", now: 22 });
    applyLegacyRoomCommand(optionState, { command: "pos_kick", actor: "房主", para1: "5", now: 23 });
    expect(optionState.record.room.player[5]?.name).toBe("");
    const departed = applyLegacyRoomCommand(optionState, { command: "leave", actor: "房主", now: 24 });
    expect(departed.left).toBe(true);
    expect(optionState.record.room.roomfounder).toBe("");
  });

  it("supports the original five-minute owner takeover", () => {
    const state: LegacyRoomRuntimeState = { record: createLegacyRoomRecord(4, 4, "旧房主", 100) };
    applyLegacyRoomCommand(state, { command: "pos_enter", actor: "新房主", para1: "1", now: 101 });
    const result = applyLegacyRoomCommand(state, { command: "takeover", actor: "新房主", now: 401 });
    expect(result.record.room.roomfounder).toBe("新房主");
    expect(result.record.room.player[0]?.name).toBe("新房主");
    expect(result.record.room.player[1]?.name).toBe("");
  });

  it("rolls back the whole command if a legacy invariant throws", () => {
    const state: LegacyRoomRuntimeState = { record: createLegacyRoomRecord(5, 0, "甲", 100) };
    const before = structuredClone(state.record);
    state.record.groomstatus = 40;
    expect(() => applyLegacyRoomCommand(state, { command: "ready", actor: "甲", now: 101 })).toThrow("房间不在等待状态");
    expect(state.record).toEqual({ ...before, groomstatus: 40 });
  });

  it("uses the exact expiry default in direct state updates", () => {
    const room = createLegacyWaitingRoom(0, "甲");
    room.player[1]!.name = "乙";
    expect(updateLegacyRoomState(room, false, 50)).toBe(true);
    expect(room.kicktime).toBe(80);
  });
});
