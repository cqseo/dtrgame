import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import { createLegacyPlayerRecord } from "../src/generated/legacy-registry";
import { LEGACY_MODULE_VARS } from "../src/generated/legacy-module-vars";
import { projectLegacySettlement } from "../src/legacy/settlement-plan";
import { PhpArray } from "../src/legacy/template/values";

const ignored = (LEGACY_MODULE_VARS["sys"].qiegao_ignore_mode).values().map(Number);
function player(name, hp, extra = {}) {
  const p = createLegacyPlayerRecord();
  Object.assign(p, {
    name, hp, type: 0, teamID: "",
    money: 0, killnum: 0, npckillnum: 0, lvl: 0,
    wp: 0, wk: 0, wg: 0, wc: 0, wd: 0, wf: 0,
    ...extra
  });
  return p;
}

describe.skipIf(!hasOracle)("settlement rewards against original PHP 8.2 sys/gamectl.php", () => {
  it("agrees with PHP gameover_get_credit_up and gameover_get_gold_up across modes and progression", () => {
    const scenarios = [
      { gametype: 0, entrants: [
        player("甲", 100, { killnum: 2, npckillnum: 3, lvl: 5, money: 1500, wk: 60 }),
        player("乙", 0, { killnum: 1, lvl: 2, money: 800 })
      ] },
      { gametype: 1, entrants: [player("甲", 120), player("乙", 0)] },
      { gametype: 15, entrants: [player("甲", 100)] },
      { gametype: 20, entrants: [
        player("甲", 150, { teamID: "红", money: 250000, lvl: 29, wk: 9999 }),
        player("乙", 0, { teamID: "红", npckillnum: 9 }),
        player("丙", 0, { teamID: "蓝", money: 1000 })
      ] },
      { gametype: 0, entrants: [player("甲", 0), player("乙", 0)] },
      { gametype: 0, entrants: [player("甲", 101, { money: 1200000, wp: 60000 })] }
    ];
    const calls = [];
    const actual = [];
    for (const scenario of scenarios) {
      const all = Object.fromEntries(scenario.entrants.map(p => [p.name, p]));
      const plan = projectLegacySettlement(all, scenario.gametype, 40, 12345);
      expect(plan).not.toBeNull();
      for (const p of scenario.entrants) {
        const reward = plan.rewards.find(r => r.username === p.name);
        const globals = {
          ___LOCAL_SYS__VARS__gametype: scenario.gametype,
          ___LOCAL_SYS__VARS__winmode: plan.decision.winmode,
          ___LOCAL_SYS__VARS__winner: plan.winner,
          ___LOCAL_SYS__VARS__qiegao_ignore_mode: ignored
        };
        // In original PHP, function parameters winner/winmode are shadowed
        // by import_module('sys'); the module globals decide the amounts.
        calls.push({ fn: "\\sys\\gameover_get_credit_up", args: [p, "wrong", 9], globals });
        actual.push({ field: "credits", value: reward.credits, scenario: scenario.gametype, player: p.name });
        calls.push({ fn: "\\sys\\gameover_get_gold_up", args: [p, "wrong", 9], globals });
        actual.push({ field: "gold", value: reward.gold, scenario: scenario.gametype, player: p.name });
      }
    }
    const expected = callOriginal(calls, { bootstrap: "core" });
    const differences = actual.flatMap((a, i) => expected[i]?.ok && expected[i].value === a.value
      ? [] : [`${a.scenario}/${a.player}/${a.field}: port=${a.value} php=${JSON.stringify(expected[i])}`]);
    expect(differences).toEqual([]);
  }, 120000);
});
