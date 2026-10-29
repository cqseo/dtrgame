import {describe,it,expect} from "vitest";
import {
 originalPlayerKillBase,type OriginalKillPlayer,type OriginalKillHooks
} from "../src/original-player-kill";
function player(pid:number,type:number):OriginalKillPlayer {
 return {pid,type,name:"QA"+pid,hp:20,state:27,bid:0,killnum:0,
  npckillnum:0,endtime:0,attackwith:"测试陷阱"};
}
function hooks(events:string[]):OriginalKillHooks {
 return {
  getKillMessage(){events.push("message");return "遗言"},
  saveGameInfo(c){events.push("save:"+c.deathnum+":"+c.alivenum)},
  setReviveSequence(){events.push("set_revive_sequence")},
  processRevive(){events.push("revive_process")},
  deathNews(a,v){events.push("deathnews:"+a.pid+":"+v.hp+":"+v.state)},
  revivePostDeathNews(){events.push("revive_post_deathnews")}
 };
}
describe("original player/main.php kill(): required source phases",()=>{
 it("preserves killnum, deathnum, alivenum and source callback order",async()=>{
  const events:string[]=[];
  const result=await originalPlayerKillBase(player(7,0),player(9,0),
   {deathnum:5,alivenum:24},123456,hooks(events));
  expect(result.attacker.killnum).toBe(1);
  expect(result.attacker.npckillnum).toBe(0);
  expect(result.victim.hp).toBe(0);
  expect(result.victim.bid).toBe(7);
  expect(result.victim.endtime).toBe(123456);
  expect(result.counters).toEqual({deathnum:6,alivenum:23});
  expect(result.message).toBe("遗言");
  expect(events).toEqual(["message","save:6:23","set_revive_sequence",
   "revive_process","deathnews:7:0:27"]);
 });
 it("NPC death increments npckillnum and deathnum without altering human alivenum",async()=>{
  const events:string[]=[];
  const result=await originalPlayerKillBase(player(7,0),player(9,1),
   {deathnum:1,alivenum:20},100,hooks(events));
  expect(result.attacker.npckillnum).toBe(1);
  expect(result.counters).toEqual({deathnum:2,alivenum:20});
 });
 it("self-owned trap has no kill message and does not increase human killnum",async()=>{
  const events:string[]=[];
  const result=await originalPlayerKillBase(player(7,0),player(7,0),
   {deathnum:4,alivenum:13},300,hooks(events));
  expect(result.attacker.pid).toBe(result.victim.pid);
  expect(result.attacker).toBe(result.victim);
  expect(result.attacker.killnum).toBe(0);
  expect(events).not.toContain("message");
  expect(result.counters).toEqual({deathnum:5,alivenum:12});
 });
 it("source-less trap keeps bid unchanged, still shows deathnews and proper counters",async()=>{
  const events:string[]=[];
  const v=player(9,0);v.sourceless=1;v.bid=91;
  const result=await originalPlayerKillBase(v,v,
   {deathnum:0,alivenum:10},100,hooks(events));
  expect(result.victim.bid).toBe(91);
  expect(result.victim.sourceless).toBe(1);
  expect(events).not.toContain("message");
 });
 it("revival mutations happen before deathnews, announcement is posted after deathnews",async()=>{
  const events:string[]=[];
  const hook=hooks(events);
  hook.processRevive=(_a,v,c)=>{
   events.push("revive_process");v.hp=1;v.state=0;
   v.rivival_news=["revival", "QA玩家"];
   c.deathnum--;c.alivenum++;
  };
  const result=await originalPlayerKillBase(player(7,0),player(9,0),
   {deathnum:2,alivenum:7},800,hook);
  expect(result.victim.hp).toBe(1);
  expect(result.victim.state).toBe(0);
  expect(result.counters).toEqual({deathnum:2,alivenum:7});
  expect(events).toEqual(["message","save:3:6","set_revive_sequence",
   "revive_process","deathnews:7:1:27","revive_post_deathnews"]);
 });
 it("does not swallow missing critical runtime source hooks",async()=>{
  const hook=hooks([]);
  hook.processRevive=()=>{throw Error("ORIGINAL_REVIVE_CHAIN_MISSING")};
  await expect(originalPlayerKillBase(player(7,0),player(9,0),
   {deathnum:0,alivenum:10},100,hook)).rejects.toThrow("ORIGINAL_REVIVE_CHAIN_MISSING");
 });
});
