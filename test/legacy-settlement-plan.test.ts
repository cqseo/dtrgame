import { describe, expect, it } from "vitest";
import { createLegacyPlayerRecord } from "../src/generated/legacy-registry";
import { projectLegacySettlement } from "../src/legacy/settlement-plan";
import type { LegacyPlayerRecord } from "../src/legacy/player";

function player(name: string, hp: number, teamID = "", extra: Record<string, unknown> = {}): LegacyPlayerRecord {
  const p = createLegacyPlayerRecord();
  Object.assign(p, {
    name, hp, teamID, type: 0,
    killnum: 0, npckillnum: 0, lvl: 0, money: 0,
    wp: 0, wk: 0, wg: 0, wc: 0, wd: 0, wf: 0,
    ...extra
  });
  return p;
}
const roster = (...players: LegacyPlayerRecord[]) =>
  Object.fromEntries(players.map(p => [p.name, p]));

describe("read-only original gameover_set_credits settlement plan", () => {
  it("declines to settle an unfinished match", () => {
    const players = roster(player("甲", 100), player("乙", 110));
    expect(projectLegacySettlement(players, 0, 40, 100)).toBeNull();
    expect(projectLegacySettlement(roster(player("甲", 100)), 0, 0, 100)).toBeNull();
  });
  it("projects the exact win, participation and progression components", () => {
    const players = roster(
      player("甲", 100, "", { killnum: 2, npckillnum: 3, lvl: 5, wk: 60, money: 1500 }),
      player("乙", 0, "", { killnum: 1, lvl: 2, money: 800 })
    );
    const unchanged = structuredClone(players);
    expect(projectLegacySettlement(players, 0, 40, 1760000000)).toEqual({
      decision: { ready: true, winmode: 2, winners: ["甲"], validnum: 2, alivenum: 1, winnum: 1 },
      winner: "甲", rewards: [
        { username: "甲", credits: 200 + 20 + 6 + 3 + 2 + 3, gold: 120, validgames: 1, wingames: 1, lastwin: 1760000000 },
        { username: "乙", credits: 10 + 10 + 1 + 2, gold: 10, validgames: 1, wingames: 0, lastwin: null }
      ]
    });
    expect(players).toEqual(unchanged);
  });
  it("includes fallen teammates in rewards but preserves original multiwinner wingames behavior", () => {
    const players = roster(
      player("甲", 110, "红"), player("乙", 0, "红"), player("丙", 0, "蓝")
    );
    const plan = projectLegacySettlement(players, 20, 40, 101);
    expect(plan?.winner).toBe("甲,乙");
    expect(plan?.rewards).toMatchObject([
      { username: "甲", gold: 120, wingames: 0 },
      { username: "乙", gold: 120, wingames: 0 },
      { username: "丙", gold: 10, wingames: 0 }
    ]);
  });
  it("skips gold and credit payouts for ignored modes, without inventing absent modes", () => {
    const players = roster(player("甲", 100), player("乙", 0));
    const plan = projectLegacySettlement(players, 1, 40, 123);
    expect(plan?.rewards).toMatchObject([
      { username: "甲", credits: 0, gold: 0, validgames: 1, wingames: 1 },
      { username: "乙", credits: 0, gold: 0, validgames: 1, wingames: 0 }
    ]);
  });
  it("does not award validgames in original forestry gametype 15", () => {
    const plan = projectLegacySettlement(roster(player("甲", 100)), 15, 40, 123);
    expect(plan?.rewards).toMatchObject([
      { username: "甲", credits: 0, gold: 0, validgames: 0, wingames: 0 }
    ]);
  });
  it("awards nobody for zero entrants or no living players", () => {
    expect(projectLegacySettlement({}, 0, 40, 10)?.rewards).toEqual([]);
    const plan = projectLegacySettlement(roster(player("甲", 0), player("乙", 0)), 0, 40, 10);
    expect(plan?.decision).toMatchObject({ ready: true, winmode: 1, winners: [] });
    expect(plan?.rewards.map(x => x.gold)).toEqual([10, 10]);
    expect(plan?.rewards.every(x => x.wingames === 0)).toBe(true);
  });
  it("excludes NPC rows even when the NPC survives", () => {
    const npc = player("怪物", 300, "", { type: 1 });
    const plan = projectLegacySettlement(roster(player("甲", 120), npc), 0, 40, 10);
    expect(plan?.rewards.map(x => x.username)).toEqual(["甲"]);
  });
  it("requires a valid timestamp once the match is eligible", () => {
    expect(() => projectLegacySettlement(roster(player("甲", 10)), 0, 40, NaN)).toThrow(RangeError);
  });
});
