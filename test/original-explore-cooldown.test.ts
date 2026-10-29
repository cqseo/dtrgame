import {describe,it,expect} from "vitest";
import {originalExploreWithCooldown,type OriginalExploreActor} from "../src/original-explore-cooldown";
import {originalCooldownBegin} from "../src/original-cooldown";
import type {OriginalMapState} from "../src/original-explore-map";
function player(sp=40):OriginalExploreActor {
 return {pls:0,sp,mode:"command",command:"move",log:"",hp:100,pose:0};
}
const map:OriginalMapState={
 arealist:[0,1,2],areanum:0,areaadd:1,hack:false,
 plsinfo:{"0":"校门","1":"公园","2":"学园"},
 areainfo:{"0":"校门区域","1":"公园区域","2":"学园区域"}
};
function dice(...sequence:number[]){
 const stream=[...sequence];return ()=>{
  const next=stream.shift();if(next===undefined)throw new Error("Unexpected PHP random call");
  return next;
 };
}
describe("Original cooldown wrapper + original explore base + discovery chain",()=>{
 it("real move: cooldown assigned before SP, destination, discovery and post_act",async()=>{
  const r=await originalExploreWithCooldown({
    player:player(),cooldown:originalCooldownBegin(0,0),map,action:"move",destination:1,
    pageStartMs:1500.9,nowMs:1777.4,
    discovery:{random99:dice(99,99,99,99)}
  });
  expect(r.accepted).toBe(true);
  expect(r.executed).toBe(true);
  expect(r.player.sp).toBe(25);
  expect(r.player.pls).toBe(1);
  expect(r.player.log).toBe('你消耗<span class="yellow b">15</span>点体力，移动到了公园。<br>公园区域<br>但是什么都没有发现。<br>');
  expect(r.discovery).toEqual({stage:"empty",found:false});
  expect(r.cooldown).toMatchObject({cdsec:2,cdmsec:150,rmcdtime:373,cmdcdtime:650});
 });
 it("real search: existing cooldown blocks action before stamina or discovery checks",async()=>{
  const r=await originalExploreWithCooldown({
    player:player(),cooldown:originalCooldownBegin(2,150),map,action:"search",
    nowMs:1777.4,pageStartMs:1500.9,
    discovery:{random99:()=>{throw new Error("Discovery should not run while cooling down")}}
  });
  expect(r.accepted).toBe(false);
  expect(r.executed).toBe(false);
  expect(r.player.sp).toBe(40);
  expect(r.player.log).toBe('<span class="yellow b">冷却时间尚未结束！</span><br>');
  expect(r.cooldown.rmcdtime).toBe(373);
 });
 it("source oddity: even invalid destination incurs scheduled move cooldown",async()=>{
  const r=await originalExploreWithCooldown({
    player:player(),cooldown:originalCooldownBegin(0,0),map,action:"move",destination:99,
    nowMs:1777.4,pageStartMs:1500.9,
    discovery:{random99:()=>{throw new Error("no discovery on invalid destination")}}
  });
  expect(r.accepted).toBe(false);
  expect(r.executed).toBe(true);
  expect(r.player.sp).toBe(40);
  expect(r.player.log).toBe("请选择正确的移动地点。<br>");
  expect(r.cooldown.cdsec).toBe(2);
  expect(r.cooldown.cdmsec).toBe(150);
 });
 it("source stamina boundary: exactly 15 cannot search but 650ms cooldown still applies",async()=>{
  const r=await originalExploreWithCooldown({
    player:player(15),cooldown:originalCooldownBegin(0,0),map,action:"search",
    nowMs:1777.4,pageStartMs:1500.9,
    discovery:{random99:()=>{throw new Error("no discovery without SP")}}
  });
  expect(r.accepted).toBe(false);
  expect(r.player.sp).toBe(15);
  expect(r.player.log).toContain("体力不足，不能探索！");
  expect(r.cooldown.cmdcdtime).toBe(650);
 });
 it("source override changes SP cost without touching legacy discovery priority",async()=>{
  const r=await originalExploreWithCooldown({
    player:player(40),cooldown:originalCooldownBegin(0,0),map,
    action:"search",nowMs:1777.4,pageStartMs:1500.9,
    baseHooks:{calculateSearchSpCost:()=>35},
    discovery:{random99:dice(0),eventMain:s=>({state:{...s,log:s.log+"事件生效"},occurred:true})}
  });
  expect(r.accepted).toBe(true);
  expect(r.player.sp).toBe(5);
  expect(r.player.mode).toBe("command");
  expect(r.discovery).toEqual({stage:"event",found:false});
 });
 it("does not skip missing original event effects when an event occurs",async()=>{
  await expect(originalExploreWithCooldown({
    player:player(),cooldown:originalCooldownBegin(0,0),map,action:"search",
    nowMs:1777.4,pageStartMs:1500.9,
    discovery:{random99:dice(0)}
  })).rejects.toThrow(/event_main/);
 });
});