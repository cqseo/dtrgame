import gold from "./fixtures/original-tactic-cooldown-php.json";
import { describe,it,expect } from "vitest";
import {
 ORIGINAL_TACTIC, originalTacticAct, originalCanCounter,
 originalMeetManRate, originalFindManOdds, originalHideOdds,
 originalCounterRateBase, originalAttackMultipliers, originalDefenseMultipliers,
 originalTrapDamage, originalTrapEscapeRate,originalCanAvoidKillArea,originalAvoidKillAreaLog
} from "../src/original-tactic";
import {
 ORIGINAL_COOLDOWN_CONFIG,originalCooldownBegin,originalSetCooldown,
 originalCooldownBeforeAction,originalCooldownPostAct,
 originalCooldownRemaining,originalCooldownResponse
} from "../src/original-cooldown";

describe("ORIGINAL PHP tactic config and gameplay golden cases",()=>{
 it("matches real live original PHP arrays exactly",()=>{
  expect(ORIGINAL_TACTIC.names).toEqual(gold.tacticConfig.names);
  expect(ORIGINAL_TACTIC.playerUsable).toEqual(gold.tacticConfig.usable);
  expect(ORIGINAL_TACTIC.hideOdds).toEqual(gold.tacticConfig.hide);
  expect(ORIGINAL_TACTIC.meetManOdds).toEqual(gold.tacticConfig.meet);
  expect(ORIGINAL_TACTIC.attackModifier).toEqual(gold.tacticConfig.attack);
  expect(ORIGINAL_TACTIC.defendModifier).toEqual(gold.tacticConfig.defense);
 });
 it.each(gold.tactic.map((x): [typeof x]=>[x]))("matches PHP encounter/counter/attack/defense/avoidance tactic=$tactic base=$base",
  (x:any)=>{
   expect(originalMeetManRate(x.base,x.tactic)).toBe(x.findman);
   expect(originalFindManOdds(x.base,x.tactic)).toBe(x.findman);
   expect(originalHideOdds(x.base,x.tactic)).toBe(x.hide);
   expect(originalCounterRateBase(x.base,x.tactic)).toBe(x.counter);
   expect(originalCanCounter(x.tactic,true)).toBe(x.counterAllowed);
   expect(originalAttackMultipliers([1.1,.7],x.tactic)).toEqual(x.attack);
   expect(originalDefenseMultipliers([.9,1.7],x.tactic)).toEqual(x.defense);
   expect(originalTrapEscapeRate(x.base,x.tactic)).toBe(x.trapEscape);
   expect(originalCanAvoidKillArea(39,x.tactic,false)).toBe(x.avoidAt39);
   expect(originalCanAvoidKillArea(40,x.tactic,false)).toBe(x.avoidAt40);
  }
 );
 it.each(gold.trap.map((x): [typeof x]=>[x]))("matches PHP 75% trap reduction tactic=$tactic RNG=$random damage=$damage",
  (x:any)=>expect(originalTrapDamage(x.damage,x.tactic,x.random)).toBe(x.result));
 it.each(gold.changes.map((x): [typeof x]=>[x]))("matches PHP tactical command and exact Chinese log $command",
  (x:any)=>{
   const result=originalTacticAct({mode:"special",command:x.command,tactic:2,log:""});
   expect(result.state).toMatchObject({mode:x.mode,tactic:x.tactic,log:x.log});
   expect(result.handled).toBe(x.command.startsWith("tac"));
  });
 it("rejects changing discontinued tactic 1 but preserves tactics on invalid command",()=>{
  expect(originalTacticAct({mode:"special",command:"tac1",tactic:3,log:""}).state.tactic).toBe(3);
  expect(originalTacticAct({mode:"command",command:"tac4",tactic:3,log:""}).handled).toBe(false);
 });
 it("preserves original post-killarea NPC vs human log and parent battle fallthrough",()=>{
  expect(originalAvoidKillAreaLog(0,"废弃都市")).toBe('<span class="yellow b">为了躲避禁区，你及时移动到了废弃都市</span><br>');
  expect(originalAvoidKillAreaLog(1,"废弃都市")).toBeNull();
  expect(originalCanAvoidKillArea(30,2,true)).toBe(true);
  expect(originalCanCounter(3,false)).toBe(false);
  expect(()=>originalTrapDamage(100,2,100)).toThrow(RangeError);
 });
});
describe("ORIGINAL PHP cooldown config and action/post_act fixtures",()=>{
 it("matches actual original millisecond durations",()=>{
  expect(ORIGINAL_COOLDOWN_CONFIG).toEqual({
   enabled:Boolean(gold.cooldownConfig.on),
   showTimer:Boolean(gold.cooldownConfig.show),
   moveMs:gold.cooldownConfig.move,
   searchMs:gold.cooldownConfig.search,
   itemUseMs:gold.cooldownConfig.itemUse
  });
 });
 it.each(gold.cooldown.map((x): [typeof x]=>[x]))("matches source PHP action=$action on=$enabled now=$now existing=$startEnd",
  (x:any)=>{
   const start=originalCooldownBegin(Math.floor(x.startEnd/1000),x.startEnd%1000,"special","");
   const before=originalCooldownBeforeAction(start,x.action,x.now,x.enabled);
   expect(before.blocked).toBe(x.blocked);
   expect(before.state.cdsec).toBe(x.afterBefore.cdsec);
   expect(before.state.cdmsec).toBe(x.afterBefore.cdmsec);
   expect(before.state.cmdcdtime).toBe(x.afterBefore.cmdcdtime);
   expect(before.state.mode).toBe(x.afterBefore.mode);
   expect(before.state.log).toBe(x.afterBefore.log);
   const after=originalCooldownPostAct(before.state,1500.9,1777.4,x.enabled);
   expect(after.cdsec).toBe(x.afterPost.cdsec);
   expect(after.cdmsec).toBe(x.afterPost.cdmsec);
   expect(after.rmcdtime).toBe(x.afterPost.remaining);
  });
 it("keeps the longer existing command cooldown when multiple modules set it",()=>{
  let s=originalCooldownBegin(0,0);
  s=originalSetCooldown(s,650);
  s=originalSetCooldown(s,250);
  expect(s.cmdcdtime).toBe(650);
  expect(originalSetCooldown(originalCooldownBegin(0,0),750,false).cmdcdtime).toBe(0);
  expect(originalSetCooldown(originalCooldownBegin(0,0),750,false,true).cmdcdtime).toBe(750);
 });
 it("uses initial vs normal game response timer with exact Chinese HTML and tenths",()=>{
  const s=originalCooldownBegin(2,150);
  expect(originalCooldownRemaining(s,1777.4)).toBe(373);
  const standard=originalCooldownResponse(s,1777.4,100,false);
  expect(standard.timer).toBe(373);
  expect(standard.log).toBe('行动冷却时间：<span id="timer" class="yellow b">0.3</span>秒<script type="text/javascript">demiSecTimerStarter(373);</script><br>');
  const initial=originalCooldownResponse(s,1777.4,100,true);
  expect(initial).not.toHaveProperty("timer");
  expect(initial.log).toBe(standard.log);
  expect(originalCooldownResponse(s,1777.4,0).log).toBe("");
  expect(originalCooldownResponse(s,1777.4,100,false,false).timer).toBeUndefined();
 });
});