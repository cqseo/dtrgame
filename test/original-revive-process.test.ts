import {describe,it,expect} from "vitest";
import gold from "./fixtures/original-revive-php.json";
import {originalReviveProcess} from "../src/original-revive-process";
describe("ACFUN original PHP player.revive_process source parity",()=>{
 it.each(gold.map(x=>[x] as const))(
  "mirrors ordered priority, veto, revive state and NPC counter source formula",
  async x=>{
   const target:{pid:number;type:number;state:number;hp:number;o_state?:number;npc_revived?:number}={
    pid:5,type:x.type,state:x.state,hp:0};
   const counters={deathnum:11,alivenum:18};
   const sequence=new Map(Object.entries(x.sequence).map(([k,v])=>[Number(k),v]));
   const phases:string[]=[];
   const result=await originalReviveProcess({pid:1},target,counters,{
    setSequence:()=>sequence,
    veto:()=>x.veto,
    check:(_a,_p,key)=>key===x.checkKey,
    pre:()=>{phases.push("pre");},
    post:()=>{phases.push("post");},
    saveGameInfo:()=>{phases.push("save");}
   });
   expect(result.checkedKeys).toEqual(x.checked);
   expect(result.triggeredKey).toBe(x.triggered);
   expect(result.revived).toBe(x.triggered!==null);
   expect(result.target).toEqual(x.target);
   expect(counters).toEqual(x.counters);
   if(x.triggered!==null)expect(phases).toEqual(["pre","save","post"]);
   else expect(phases).toEqual([]);
  }
 );
 it("original veto runs only for nonempty sequence and suppresses all checks",async()=>{
  const phases:string[]=[];
  const target={pid:5,type:0,state:27,hp:0};
  const c={deathnum:1,alivenum:2};
  await originalReviveProcess({},target,c,{
   setSequence:()=>new Map(),
   veto:()=>{phases.push("veto");return true;},
   check:()=>{phases.push("check");return true;},
   saveGameInfo:()=>{phases.push("save");}
  });
  expect(phases).toEqual([]);
 });
 it("skill specific override can handle a revival, but cannot invent a default",async()=>{
  const order:string[]=[];
  const target={pid:6,type:0,state:27,hp:0},c={deathnum:1,alivenum:0};
  const r=await originalReviveProcess({},target,c,{
   setSequence:()=>new Map([[50,70],[100,200]]),
   veto:()=>false,
   check:(_a,_p,k)=>k===200,
   pre:()=>{order.push("pre");},
   revive:(_a,p,k,n)=>{order.push("skill:"+k);p.hp=50;p.state=0;n.deathnum=0;n.alivenum=1;},
   post:()=>{order.push("post");},
   saveGameInfo:()=>{throw new Error("No base save for explicit skill override");}
  });
  expect(r.checkedKeys).toEqual([70,200]);
  expect(r.triggeredKey).toBe(200);
  expect(order).toEqual(["pre","skill:200","post"]);
  expect(target.hp).toBe(50);
 });
 it("rejects non-integer source keys that could break priority parity",async()=>{
  await expect(originalReviveProcess({}, {pid:6,type:0,hp:0,state:27},
    {deathnum:1,alivenum:0},{
      setSequence:()=>new Map([[1.5,70]]),
      veto:()=>false,
      check:()=>true,
      saveGameInfo:()=>{}
  })).rejects.toThrow(RangeError);
 });
});
