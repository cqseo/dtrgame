import { describe, expect, it } from "vitest";
import { createLegacyPlayerRecord } from "../src/generated/legacy-registry";
import { LEGACY_MODULE_VARS } from "../src/generated/legacy-module-vars";
import { PhpArray } from "../src/legacy/template/values";
import { renderLegacyCommandPanel, renderLegacyDeathPanel } from "../src/runtime/game-render";
import type { StoredLegacyMatch } from "../src/runtime/game-durable-object";

function fixture(state = 20, endtime = 1767225600): StoredLegacyMatch {
  const victim = createLegacyPlayerRecord();
  Object.assign(victim, {
    pid: 1, name: "死者", hp: 0, state,
    bid: 2, endtime, pls: 1
  });
  const killer = createLegacyPlayerRecord();
  Object.assign(killer, { pid: 2, name: "凶手", hp: 100, state: 0, pls: 1 });
  return {
    version: 1,
    state: {
      matchId: 123, gamestate: 40, gametype: 0,
      players: { "死者": victim, "凶手": killer },
      availableAreas: [1], forbiddenAreas: [], areaNames: ["无", "校舍"]
    }
  };
}

describe("original PHP death panel", () => {
  it("renders original captured death status, narrative, killer and Shanghai-localized death time", () => {
    const match = fixture();
    const html = renderLegacyCommandPanel(match, "死者");
    const originalStates = LEGACY_MODULE_VARS["sys"]?.["stateinfo"] as PhpArray;
    const originalDescriptions = LEGACY_MODULE_VARS["sys"]?.["dinfo"] as PhpArray;
    expect(html).toContain(originalStates.get(20));
    expect(html).toContain(originalDescriptions.get(20));
    expect(html).toContain("凶手：凶手");
    expect(html).toContain("死亡时间：2026年01月01日08时00分00秒");
    expect(html).toContain('href="index.php"');
    expect(html).toContain('value="我靠！" disabled');
    expect(html).not.toContain("攻击");
    expect(html).not.toContain("探索");
  });

  it("escapes user-supplied killer display names", () => {
    const match = fixture(22);
    match.state.players["凶手"]!.name = "<img src=x onerror=alert(1)>";
    const html = renderLegacyDeathPanel(match, "死者");
    expect(html).toContain("凶手：&lt;img src=x onerror=alert(1)&gt;");
    expect(html).not.toContain("<img src=x");
  });

  it("does not invent a killer for poison and forbidden-zone deaths", () => {
    for (const state of [11, 12, 17]) {
      const html = renderLegacyDeathPanel(fixture(state), "死者");
      expect(html).not.toContain("凶手：");
      expect(html).toContain("你死了。");
    }
  });

  it("preserves the original fallback description for unknown death states", () => {
    const html = renderLegacyDeathPanel(fixture(999, 0), "死者");
    expect(html).toContain("死亡代号：999");
    expect(html).not.toContain("死亡时间：");
  });

  it("continues to show normal game commands while the player is alive", () => {
    const match = fixture();
    Object.assign(match.state.players["死者"]!, { hp: 100, state: 0 });
    const html = renderLegacyCommandPanel(match, "死者");
    expect(html).toContain("现在想要做什么");
    expect(html).not.toContain("本次生命已结束");
  });
});
