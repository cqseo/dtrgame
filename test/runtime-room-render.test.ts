import { describe, expect, it } from "vitest";
// Node types are intentionally not part of the Worker production tsconfig.
// @ts-expect-error test-only Node builtin
import { readFileSync } from "node:fs";
import { createLegacyRoomRecord } from "../src/legacy/room";
import { renderLegacyRoomMain } from "../src/runtime/room-render";

const sourceNames = ["roommain", "roomteam", "roomslot", "roomslot_s"];
const sources = new Map(sourceNames.map(name => [name, readFileSync(`public/templates/default/${name}.htm`, "utf8")]));

describe("original waiting-room template", () => {
  it("renders the founder and the exact room controls", () => {
    const record = createLegacyRoomRecord(3, 0, "房主", 100);
    const html = renderLegacyRoomMain(record, "房主", sources, 100);
    expect(html).toContain("房间3&nbsp;-&nbsp; SOLO模式");
    expect(html).toContain("修改模式");
    expect(html).toContain("房主");
    expect(html).toContain("空位置");
  });

  it("renders a visitor as not seated without changing room state", () => {
    const record = createLegacyRoomRecord(3, 0, "房主", 100);
    const html = renderLegacyRoomMain(record, "访客", sources, 100);
    expect(html).toContain("请点击一个空位置以进入。");
    expect(html).toContain("进入位置");
    expect(record.room.player.some(slot => slot.name === "访客")).toBe(false);
  });
});
