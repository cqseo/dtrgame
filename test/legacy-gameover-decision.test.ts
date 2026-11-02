import { describe, expect, it } from "vitest";
import { LEGACY_MODULE_VARS } from "../src/generated/legacy-module-vars";
import { createLegacyPlayerRecord } from "../src/generated/legacy-registry";
import { decideLegacyGameover } from "../src/legacy/gameover-decision";
import { PhpArray } from "../src/legacy/template/values";
import type { LegacyPlayerRecord } from "../src/legacy/player";

function player(name: string, hp: number, teamID = "", type = 0): LegacyPlayerRecord {
  const value = createLegacyPlayerRecord();
  Object.assign(value, { name, hp, teamID, type });
  return value;
}
function group(...members: LegacyPlayerRecord[]): Record<string, LegacyPlayerRecord> {
  return Object.fromEntries(members.map(member => [member.name, member]));
}
const mode = 0;
const teamMode = (LEGACY_MODULE_VARS["sys"]!["teamwin_mode"] as PhpArray).values().map(Number)[0]!;

describe("original core/sys gameover automatic winner eligibility", () => {
  it("keeps matches with gamestate below 5 unfinalized", () => {
    expect(decideLegacyGameover({}, mode, 0)).toEqual({ ready: false, reason: "not-started" });
  });
  it("uses mode 4 for no entrants, even if NPCs exist", () => {
    expect(decideLegacyGameover(group(player("怪物", 100, "", 1)), mode, 40))
      .toEqual({ ready: true, winmode: 4, winners: [], validnum: 0, alivenum: 0, winnum: 0 });
  });
  it("uses mode 1 when all human entrants are dead", () => {
    expect(decideLegacyGameover(group(player("甲", 0), player("乙", -4)), mode, 40))
      .toEqual({ ready: true, winmode: 1, winners: [], validnum: 2, alivenum: 0, winnum: 0 });
  });
  it("waits for remaining enemies in non-team games", () => {
    expect(decideLegacyGameover(group(player("甲", 120), player("乙", 15)), mode, 40))
      .toEqual({ ready: false, reason: "multiple-survivors" });
  });
  it("identifies the sole surviving player and excludes NPCs", () => {
    expect(decideLegacyGameover(group(player("甲", 0), player("乙", 50), player("怪物", 10, "", 1)), mode, 40))
      .toEqual({ ready: true, winmode: 2, winners: ["乙"], validnum: 2, alivenum: 1, winnum: 1 });
  });
  it("requires one team among all living players in original team modes", () => {
    expect(decideLegacyGameover(group(player("甲", 120, "红"), player("乙", 150, "蓝")), teamMode, 40))
      .toEqual({ ready: false, reason: "multiple-teams" });
  });
  it("rejects multiple living teamless players just as original PHP does", () => {
    expect(decideLegacyGameover(group(player("甲", 100), player("乙", 100)), teamMode, 40))
      .toEqual({ ready: false, reason: "multiple-teams" });
  });
  it("includes fallen teammates and excludes opposing team members from winner list", () => {
    const roster = group(player("甲", 100, "红"), player("乙", 0, "红"),
      player("丙", 90, "红"), player("丁", 0, "蓝"));
    const before = structuredClone(roster);
    expect(decideLegacyGameover(roster, teamMode, 40))
      .toEqual({ ready: true, winmode: 2, winners: ["甲", "乙", "丙"], validnum: 4, alivenum: 2, winnum: 3 });
    expect(roster).toEqual(before);
  });
  it("awards a single teamless survivor in team mode", () => {
    expect(decideLegacyGameover(group(player("甲", 90), player("乙", 0, "红")), teamMode, 40))
      .toEqual({ ready: true, winmode: 2, winners: ["甲"], validnum: 2, alivenum: 1, winnum: 1 });
  });
});
