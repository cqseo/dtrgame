import {describe,it,expect} from "vitest";
import gold from "./fixtures/original-trap-item-event-php.json";
import {
 originalTrapCheck,originalTrapRealOdds,originalTrapEscapeRate,originalTrapReuseRate,
 type OriginalTrapRow
} from "../src/original-trap-select";
import {
 originalDiscoverItem,type OriginalMapItem,type OriginalItemFinding
} from "../src/original-item-discovery";
import {originalBaseEventSpecial} from "../src/original-event-base";
const actor=():OriginalItemFinding=>({
 pls:3,mode:"search",log:"",itm0:"",itmk0:"",itme0:0,itms0:0,itmsk0:""
});
const traps=(count:number):OriginalTrapRow[]=>Array.from({length:count},(_,i)=>({
 tid:i+1,pls:3,itm:"TRAP"+i,itmk:"T",itme:100,itms:1,itmsk:""
}));
const items=(count:number,durability:number|string):OriginalMapItem[]=>Array.from({length:count},(_,i)=>({
 iid:i+1,pls:3,itm:"测试物品",itmk:"HH",itme:10,itms:durability,itmsk:""
}));
describe("original PHP trap two-stage random/selection source fixtures",()=>{
 it.each(gold.traps.map(x=>[x] as const))("matches source original outer/inner RNG and trap list count",async x=>{
  const draws=[x.outer,...(x.passedOuter?[x.inner]:[]),...(x.triggered?[0]:[])];
  const calls:string[]=[];
  const result=await originalTrapCheck({pls:3,log:""},{
   randIntInclusive(min,max){calls.push("rand:"+min+".."+max);const n=draws.shift();if(n===undefined)throw Error("unexpected draw");return n;},
   listTraps(){calls.push("query");return traps(x.count);},
   deleteTrap(tid){calls.push("delete:"+tid);return true;},
   resolveTrap(s,chosen){calls.push("trapget:"+chosen.tid);return {...s,log:"trapget!"};}
  });
  expect(result.passedOuter).toBe(x.passedOuter);
  expect(result.passedInner).toBe(x.passedInner);
  expect(result.triggered).toBe(x.triggered);
  expect(result.rollSequence.slice(0,x.rolls).length).toBe(x.rolls);
  expect(originalTrapRealOdds(x.count)).toBe(x.real);
  if(x.triggered){
   expect(result.selectedTid).toBe(1);
   expect(calls.indexOf("delete:1")).toBeLessThan(calls.indexOf("trapget:1"));
   expect(result.state.log).toBe("trapget!");
  }else expect(calls).not.toContain("trapget:1");
 });
 it.each(gold.levels.map(x=>[x] as const))("matches source trap escape/reuse by level and ownership",x=>{
  expect(originalTrapEscapeRate(x.level,x.self)).toBe(x.escape);
  expect(originalTrapReuseRate(x.level,x.self)).toBe(x.reuse);
 });
 it("uses original DB ORDER BY itmk DESC result order; no JS locale sorting",async()=>{
  const sorted=[
   {tid:19,pls:3,itm:"First",itmk:"Tz",itme:20,itms:1,itmsk:""},
   {tid:22,pls:3,itm:"Second",itmk:"Ta",itme:20,itms:1,itmsk:""}
  ];
  const rolls=[0,0,1];let picked=0;
  const outcome=await originalTrapCheck({pls:3},{
   randIntInclusive(){return rolls.shift()!;},
   listTraps(){return sorted;},
   deleteTrap(tid){picked=tid;return true;},
   resolveTrap(s){return s;}
  });
  expect(picked).toBe(22);
  expect(outcome.selectedTid).toBe(22);
 });
 it("does not lie about consumed trap when deletion loses concurrency race",async()=>{
  const rolls=[0,0,0];
  await expect(originalTrapCheck({pls:3},{
   randIntInclusive(){return rolls.shift()!;},
   listTraps(){return traps(1);},
   deleteTrap(){return false;},
   resolveTrap(){throw new Error("must not reach damage");}
  })).rejects.toThrow("concurrently consumed");
 });
 it("rejects invalid random range and trap count",async()=>{
  await expect(originalTrapCheck({pls:3},{
   randIntInclusive(){return 100;},
   listTraps(){return traps(1);},deleteTrap(){return true;},resolveTrap(s){return s;}
  })).rejects.toThrow(RangeError);
  expect(()=>originalTrapRealOdds(-1)).toThrow(RangeError);
 });
});
describe("original PHP item discover_item/focus_item original side effects",()=>{
 it.each(gold.items.map(x=>[x] as const))("matches source empty/filter/itms0 truthiness",async x=>{
  const log:string[]=[];
  const result=await originalDiscoverItem(actor(),{
   loadItems(){log.push("load");return items(x.count,x.durability);},
   filter:()=>!x.filtered,
   shuffle(pool){log.push("shuffle");return pool;},
   deleteItem(id){log.push("delete:"+id);return true;},
   onItemFind(s){log.push("itemfind");return {...s,mode:"itemfind"};},
   onExtraItems(s){log.push("extra");return s;}
  });
  expect(result.found).toBe(x.found);
  expect(result.state.log).toBe(x.log);
  expect(result.state.mode).toBe(x.mode);
  if(x.count===0)expect(log).not.toContain("shuffle");
  if(x.found)expect(log).toContain("itemfind");
  if(x.count>0&&!x.filtered)expect(log).toContain("delete:1");
 });
 it("passes original remaining shuffled mapitem pool to discover_extra_item",async()=>{
  const picked:number[]=[];const leftovers:number[]=[];
  const source=items(3,20);
  const result=await originalDiscoverItem(actor(),{
   loadItems(){return source;},
   shuffle(pool){return [...pool].reverse();},
   deleteItem(id){picked.push(id);return true;},
   onItemFind(s){return s;},
   onExtraItems(s,rest){leftovers.push(...rest.map(x=>x.iid));return s;}
  });
  expect(result.found).toBe(true);
  expect(picked).toEqual([3]);
  expect(leftovers).toEqual([2,1]);
  expect(result.state.itm0).toBe("测试物品");
  expect(result.state.itms0).toBe(20);
 });
 it("requires deletion success before altering player hand or calling original itemfind",async()=>{
  let called=false;
  await expect(originalDiscoverItem(actor(),{
   loadItems(){return items(1,3);},
   shuffle(a){return a;},
   deleteItem(){return false;},
   onItemFind(s){called=true;return s;}
  })).rejects.toThrow("already claimed");
  expect(called).toBe(false);
 });
 it("does not substitute an arbitrary item for source shuffle",async()=>{
  await expect(originalDiscoverItem(actor(),{
   loadItems(){return items(2,5);},
   shuffle(a){return [a[0]!,a[0]!];},
   deleteItem(){return true;},
   onItemFind(s){return s;}
  })).rejects.toThrow(/permutation/);
 });
});
describe("original event special location 34 gate",()=>{
 it.each(gold.eventSpecial.map(x=>[x] as const))("matches untitled glory and duel exclusion",x=>{
  expect(originalBaseEventSpecial(x.art,x.pls,x.duel)).toBe(x.trigger);
 });
 it("supports original PHP numeric-string location comparison",()=>{
  expect(originalBaseEventSpecial("Other","34",false)).toBe(true);
  expect(originalBaseEventSpecial("Untainted Glory",34,false)).toBe(false);
 });
});