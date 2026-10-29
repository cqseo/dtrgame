import {describe,it,expect} from "vitest";
import gold from "./fixtures/original-trap-damage-php.json";
import {
 originalBaseTrapResolve,type OriginalTrapVictim,type OriginalBaseTrapContext
} from "../src/original-trap-damage";
const context=(self:boolean):OriginalBaseTrapContext=>({
 trap:{tid:7,pls:3,itm:"测试陷阱",itmk:"TO",itme:100,itms:"1",itmsk:""},
 owner:self?{pid:42,name:"QA玩家",type:0}:null,
 ownerIsSelf:self,now:123456
});
function player(row:{hp:number;level:number}):OriginalTrapVictim {
 return {pid:42,name:"QA玩家",hp:row.hp,state:2,lvl:row.level,
  mode:"search",log:"",itm0:"测试陷阱",itmk0:"TO",itme0:100,itms0:"1",itmsk0:""};
}
describe("source PHP trap_get_damage / escape / reuse golden math",()=>{
 it.each(gold.map(x=>[x] as const))(
  "matches installed PHP baseline level=$level self=$self strength=$strength dice=$first/$second",
  async x=>{
   const state=player(x);
   const ctx=context(x.self);ctx.trap.itme=x.strength;
   const draws=[x.first,x.second];
   const intervals:{min:number;max:number}[]=[];
   let killed=false;
   const result=await originalBaseTrapResolve(state,ctx,{
    randIntInclusive(min,max){
     intervals.push({min,max});
     const n=draws.shift();
     if(n===undefined)throw new Error("Extra PHP random call");
     return n;
    },
    getTrapDamageMultipliers:()=>x.factors,
    onLethalDamage:s=>{killed=true;return s;}
   });
   expect(result.hit).toBe(x.hit);
   expect(result.outcome).toBe(x.outcome);
   expect(result.damage).toBe(x.damage);
   expect(result.state.hp).toBe(x.afterHp);
   expect(result.lethallyDamaged).toBe(x.lethal);
   expect(killed).toBe(x.lethal);
   expect(result.state.state).toBe(x.lethal?27:2);
   expect(result.rolls).toHaveLength(2);
   expect(intervals[0]).toEqual({min:0,max:99});
   expect(intervals[1]).toEqual({min:0,max:x.hit?Math.trunc(x.strength/2):99});
   expect(draws).toHaveLength(0);
   if(x.hit) {
    expect(result.state.itm0).toBe("");
    expect(result.state.itme0).toBe(0);
    expect(result.state.itms0).toBe(0);
    expect(result.state.log).toContain("你受到了");
   }else if(x.outcome==="miss_reuse") {
    expect(result.state.mode).toBe("itemfind");
    expect(result.state.itmk0).toBe("TN");
    expect(result.state.itmsk0).toBe("");
   }else {
    expect(result.state.mode).toBe("command");
    expect(result.state.itm0).toBe("");
   }
  }
 );
 it("refuses to invent original death/revive/killstats without a real source hook",async()=>{
  const ctx=context(false);const draws=[99,50];
  await expect(originalBaseTrapResolve(player({hp:1,level:0}),ctx,{
   randIntInclusive:()=>draws.shift()!
  })).rejects.toThrow("ORIGINAL_PLAYER_KILL_REVIVE_NOT_IMPLEMENTED");
 });
 it("source order damage multipliers then up/down/change then news then death hook",async()=>{
  const steps:string[]=[],draws=[99,5],ctx=context(false);
  ctx.owner={pid:7,name:"QA施放者",type:0};
  ctx.trap.itme=10;
  const result=await originalBaseTrapResolve(player({hp:30,level:0}),ctx,{
   randIntInclusive:()=>draws.shift()!,
   getTrapDamageMultipliers:()=>{steps.push("multipliers");return [1.5]},
   finalDamageUp:(_s,_t,n)=>{steps.push("up");return n+3;},
   finalDamageDown:(_s,_t,n)=>{steps.push("down");return n-1;},
   finalDamageChange:(_s,_t,n)=>{steps.push("change");return n+2;},
   postTrapHit:s=>{steps.push("posthit");return s;},
   emitNews:e=>{steps.push("news:"+e.kind);},
   sendOwnerLog:()=>{steps.push("ownerlog");}
  });
  expect(result.damage).toBe(19);
  expect(result.state.hp).toBe(11);
  expect(steps).toEqual(["multipliers","up","down","change","posthit","news:trap","ownerlog"]);
 });
 it("source miss produces owner trapmiss news and correct Chinese reuse log",async()=>{
  const ctx=context(false);ctx.owner={pid:7,name:"QA施放者",type:0};
  const steps:string[]=[],draws=[0,0];
  const result=await originalBaseTrapResolve(player({hp:100,level:0}),ctx,{
   randIntInclusive:()=>draws.shift()!,
   emitNews:e=>{steps.push(e.kind);},
   sendOwnerLog:(_msg,owner)=>{steps.push(owner.name);}
  });
  expect(result.outcome).toBe("miss_reuse");
  expect(steps).toEqual(["trapmiss","QA施放者"]);
  expect(result.state.log).toContain("陷阱看上去还可以重复使用");
 });
});
