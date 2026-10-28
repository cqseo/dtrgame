import { describe, expect, it } from "vitest";
import { emptyLegacyItem, type LegacyItem } from "../src/legacy/item";
import type { LegacyRandom } from "../src/legacy/random";
import { calculateLegacyActiveOdds, canDiscoverLegacyCorpse, createLegacyTeam, giveLegacyItem, joinLegacyTeam, legacyCorpseHasLoot, quitLegacyTeam, type LegacyTeamPlayer } from "../src/legacy/social";

const random = (value: number): LegacyRandom => ({ int: () => value });
const member = (overrides: Partial<LegacyTeamPlayer> = {}): LegacyTeamPlayer => ({ name: "玩家", sp: 400, teamID: "", teamPass: "", ...overrides });
const item = (itm: string, itmk: string, itme: number, itms: number | string): LegacyItem => ({ itm, itmk, itme, itms, itmsk: "" });

describe("legacy team parity", () => {
  it("uses strict stamina thresholds and PHP byte length limits", () => {
    expect(createLegacyTeam(member({ sp: 200 }), "队伍", "密码", [], "无").ok).toBe(false);
    expect(createLegacyTeam(member(), "七个汉字队伍名啊", "密码", [], "无").logHtml).toBe("队伍名称过长，请重新输入。<br>");
    const player = member({ sp: 201 });
    expect(createLegacyTeam(player, "AC", "pw", [], "无").ok).toBe(true);
    expect(player).toMatchObject({ sp: 1, teamID: "AC", teamPass: "pw" });
  });

  it("checks existence, five-member cap, password, join cost and quit", () => {
    const existing = Array.from({ length: 4 }, (_, index) => member({ name: String(index), teamID: "AC", teamPass: "pw" }));
    const player = member({ sp: 101 });
    expect(joinLegacyTeam(player, "AC", "bad", existing, "无").ok).toBe(false);
    expect(joinLegacyTeam(player, "AC", "pw", existing, "无").ok).toBe(true);
    expect(player.sp).toBe(1);
    expect(quitLegacyTeam(player).ok).toBe(true);
    expect(player.teamID).toBe("");
    expect(joinLegacyTeam(member(), "AC", "pw", [...existing, member({ teamID: "AC", teamPass: "pw" })], "无").logHtml).toContain("人数已满");
  });

  it("gives an item to the first blank receiver slot", () => {
    const sender = [item("面包", "HH", 100, 30), ...Array.from({ length: 5 }, emptyLegacyItem)];
    const receiver = [item("水", "HS", 100, 30), ...Array.from({ length: 5 }, emptyLegacyItem)];
    expect(giveLegacyItem(sender, receiver, 1).ok).toBe(true);
    expect(receiver[1]?.itm).toBe("面包");
    expect(sender[0]).toEqual(emptyLegacyItem());
  });
});

describe("legacy initiative and corpse parity", () => {
  it("combines base, pose and weather initiative then clamps 10..99", () => {
    expect(calculateLegacyActiveOdds({ defenderIsNpc: true, attackerPose: 4, defenderPose: 2, attackerTactic: 3, weatherId: 1 })).toBe(60);
    expect(calculateLegacyActiveOdds({ defenderIsNpc: false, attackerPose: 5, defenderPose: 5, attackerTactic: 4, weatherId: 9 })).toBe(40);
    expect(calculateLegacyActiveOdds({ defenderIsNpc: false, attackerPose: 5, defenderPose: 5, attackerTactic: 4, weatherId: 9, multiplier: 0 })).toBe(10);
    expect(calculateLegacyActiveOdds({ defenderIsNpc: true, attackerPose: 4, defenderPose: 2, attackerTactic: 3, weatherId: 1, multiplier: 100 })).toBe(99);
  });

  it("enforces five-second corpse protection before the 50 percent roll", () => {
    expect(canDiscoverLegacyCorpse(98, 100, random(0))).toBe(false);
    expect(canDiscoverLegacyCorpse(95, 100, random(49))).toBe(true);
    expect(canDiscoverLegacyCorpse(95, 100, random(50))).toBe(false);
  });

  it("matches empty-corpse filtering", () => {
    const empty = emptyLegacyItem();
    const corpse = { money: 0, weapon: item("拳头", "WN", 0, "∞"), body: item("内衣", "DN", 0, "∞"), head: empty, arms: empty, feet: empty, accessory: empty, inventory: Array.from({ length: 6 }, emptyLegacyItem), cleared: false };
    expect(legacyCorpseHasLoot(corpse)).toBe(false);
    expect(legacyCorpseHasLoot({ ...corpse, money: 1 })).toBe(true);
    expect(legacyCorpseHasLoot({ ...corpse, cleared: true, money: 1 })).toBe(false);
  });
});
