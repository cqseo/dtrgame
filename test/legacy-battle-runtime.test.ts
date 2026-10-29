import { describe, expect, it } from "vitest";
import { createLegacyPlayerRecord } from "../src/generated/legacy-registry";
import { executeLegacyAssault } from "../src/legacy/battle-runtime";
import { LEGACY_INFINITE_DURABILITY } from "../src/legacy/item";
import type { LegacyPlayerRecord } from "../src/legacy/player";
import { SequenceLegacyRandom } from "../src/legacy/random";

function fighter(name: string, overrides: Partial<LegacyPlayerRecord> = {}): LegacyPlayerRecord {
  const value = createLegacyPlayerRecord();
  Object.assign(value, {
    pid: name === "甲" ? 1 : 2, name, type: 0,
    hp: 400, mhp: 400, sp: 400, msp: 400,
    att: 100, def: 100, pose: 0, tactic: 0,
    wep: "拳头", wepk: "WN", wepe: 0, weps: LEGACY_INFINITE_DURABILITY, wepsk: "",
    wp: 100, wk: 100, wg: 100, wc: 100, wd: 100, wf: 100,
    arbe: 0, arhe: 0, arae: 0, arfe: 0,
    lvl: 0, exp: 0, skillpoint: 0, killnum: 0, npckillnum: 0,
    ...overrides
  });
  return value;
}

describe("original base battle assault transaction", () => {
  it("attacks, damages durability, gains mastery/experience and resolves failed counter", () => {
    const attacker = fighter("甲", { wep: "调色刀", wepk: "WK", wepe: 45, weps: 9 });
    const defender = fighter("乙", { wep: "地雷", wepk: "WD", weps: 1 });
    const result = executeLegacyAssault({
      attacker, defender, active: true, weatherId: 2, now: 100,
      random: new SequenceLegacyRandom([0, 0, 10, 0])
    });
    expect(result.strikes).toEqual([{ attacker: "甲", defender: "乙", kind: "K", hit: true, damage: 124, killed: false, counter: false }]);
    expect(defender.hp).toBe(276);
    expect(attacker.weps).toBe(8);
    expect(attacker.wk).toBe(101);
    expect(attacker.exp).toBe(1);
    expect(result.logHtml).toContain("造成了<span class=\"red b\">124</span>点物理伤害");
  });

  it("consumes a gun round even on a miss", () => {
    const attacker = fighter("甲", { wep: "手枪", wepk: "WG", wepe: 20, weps: 2 });
    const defender = fighter("乙", { wep: "地雷", wepk: "WD", weps: 1 });
    const result = executeLegacyAssault({
      attacker, defender, active: true, weatherId: 2, now: 100,
      random: new SequenceLegacyRandom([99, 99])
    });
    expect(result.strikes[0]).toMatchObject({ hit: false, damage: 0 });
    expect(attacker.weps).toBe(1);
    expect(result.logHtml).toContain("你用掉了1个手枪");
  });

  it("applies the weapon death state and original kill counters", () => {
    const attacker = fighter("甲", { wep: "调色刀", wepk: "WK", wepe: 45, weps: 9 });
    const defender = fighter("乙", { hp: 10 });
    const result = executeLegacyAssault({
      attacker, defender, active: true, weatherId: 2, now: 123,
      random: new SequenceLegacyRandom([0, 0, 10, 99])
    });
    expect(result.strikes[0]?.killed).toBe(true);
    expect(defender).toMatchObject({ hp: 0, state: 22, bid: 1, endtime: 123 });
    expect(attacker.killnum).toBe(1);
  });

  it("rolls back both fighters and RNG when the random sequence is incomplete", () => {
    const attacker = fighter("甲", { wep: "调色刀", wepk: "WK", wepe: 45, weps: 9 });
    const defender = fighter("乙");
    const beforeAttacker = structuredClone(attacker);
    const beforeDefender = structuredClone(defender);
    const random = new SequenceLegacyRandom([0]);
    expect(() => executeLegacyAssault({ attacker, defender, active: true, weatherId: 2, now: 100, random })).toThrow("sequence exhausted");
    expect(attacker).toEqual(beforeAttacker);
    expect(defender).toEqual(beforeDefender);
    expect(random.consumed).toBe(0);
  });
});
