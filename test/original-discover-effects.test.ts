import {describe,it,expect} from "vitest";
import {originalDiscover} from "../src/original-discovery-chain";
import {originalDiscoverBaseEffects} from "../src/original-discover-effects";
import type {OriginalItemFinding} from "../src/original-item-discovery";
import type {OriginalDiscoverState} from "../src/original-discovery-chain";
type S=OriginalItemFinding & OriginalDiscoverState;
function player():S {
 return {pls:3,mode:"search",log:"",hp:100,pose:0,
 itm0:"",itmk0:"",itme0:0,itms0:0,itmsk0:""};
}
function random(seq:number[],trace:string[]) {
 const remaining=[...seq];
 const rand=(min:number,max:number)=>{
  const next=remaining.shift();
  if(next===undefined)throw Error("Unexpected RNG draw");
  expect(next).toBeGreaterThanOrEqual(min);
  expect(next).toBeLessThanOrEqual(max);
  trace.push("rand("+min+","+max+")="+next);
  return next;
 };
 return {rand,assertConsumed:()=>expect(remaining).toHaveLength(0)};
}
describe("real base chain compositions use single original rand order",()=>{
 it("event bypass then trap outer/inner/selection exactly once; returns at trap",async()=>{
  const trace:string[]=[]; const rng=random([99,0,0,0],trace);
  const hooks=originalDiscoverBaseEffects<S>({
   random99:()=>rng.rand(0,99),
   trap:{
    randIntInclusive:rng.rand,
    listTraps(){trace.push("select traps");return [{tid:17,pls:3,itm:"陷阱",itmk:"TN",itme:100,itms:1,itmsk:""}]},
    deleteTrap(tid){trace.push("delete trap:"+tid);return true;},
    resolveTrap(s,tr){trace.push("resolve trap:"+tr.tid);return {...s,log:s.log+"陷阱触发"}}
   },
   item:{
    loadItems(){throw Error("Item must not run if trap triggers")},
    shuffle(a){return a},deleteItem(){return true},onItemFind(s){return s}
   }
  });
  const res=await originalDiscover(player(),"search",hooks);
  expect(res.stoppedAt).toBe("trap");
  expect(res.invokedStages).toEqual(["event","trap"]);
  expect(trace).toEqual([
   "rand(0,99)=99","rand(0,99)=0",
   "select traps","rand(0,39)=0","select traps","rand(0,0)=0",
   "delete trap:17","resolve trap:17"
  ]);
  expect(res.state.log).toBe("陷阱触发");
  rng.assertConsumed();
 });
 it("no event/trap/person -> item selection and deletion with original hand slot",async()=>{
  const trace:string[]=[];const rng=random([99,99,99,0],trace);
  const hooks=originalDiscoverBaseEffects<S>({
   random99:()=>rng.rand(0,99),
   trap:{
    randIntInclusive:rng.rand,
    listTraps(){trace.push("unexpected_trap_list");return []},
    deleteTrap(){throw Error("unused")},
    resolveTrap(s){return s}
   },
   item:{
    loadItems(place){trace.push("load items:"+place);return [
      {iid:11,pls:3,itm:"面包",itmk:"HH",itme:100,itms:30,itmsk:""},
      {iid:12,pls:3,itm:"矿泉水",itmk:"HS",itme:100,itms:30,itmsk:""}
    ]},
    shuffle(a){return a.reverse()},
    deleteItem(id){trace.push("delete item:"+id);return true;},
    onItemFind(s){trace.push("itemfind");return {...s,mode:"itemfind"};},
    onExtraItems(s,extra){trace.push("extra:"+extra.length);return s;}
   }
  });
  const res=await originalDiscover(player(),"search",hooks);
  expect(res.stoppedAt).toBe("itemmain");
  expect(res.discovered).toBe(true);
  expect(res.state.itm0).toBe("矿泉水");
  expect(res.state.itmk0).toBe("HS");
  expect(res.state.itms0).toBe(30);
  expect(res.state.mode).toBe("itemfind");
  expect(trace).toEqual([
   "rand(0,99)=99","rand(0,99)=99",
   "rand(0,99)=99","rand(0,99)=0",
   "load items:3","delete item:12","itemfind","extra:1"
  ]);
  rng.assertConsumed();
 });
 it("empty room mapitem retains original no-items Chinese and command mode",async()=>{
  const rng=random([99,99,99,0],[]);
  const res=await originalDiscover(player(),"search",originalDiscoverBaseEffects<S>({
   random99:()=>rng.rand(0,99),
   trap:{randIntInclusive:rng.rand,listTraps(){return []},
     deleteTrap(){return true},resolveTrap(s){return s}},
   item:{loadItems(){return []},shuffle(a){return a},
     deleteItem(){return true},onItemFind(s){return s}}
  }));
  expect(res.stoppedAt).toBe("itemmain");
  expect(res.discovered).toBe(false);
  expect(res.state.mode).toBe("command");
  expect(res.state.log).toBe('<span class="yellow b">周围找不到任何物品。</span><br>');
  rng.assertConsumed();
 });
 it("does not fabricate unresolved original trap damage branch",async()=>{
  const rng=random([99,0,0,0],[]);
  const res=originalDiscover(player(),"search",originalDiscoverBaseEffects<S>({
   random99:()=>rng.rand(0,99),
   trap:{randIntInclusive:rng.rand,
     listTraps(){return [{tid:7,pls:3,itm:"陷阱",itmk:"T",itme:100,itms:1,itmsk:""}]},
     deleteTrap(){return true},
     resolveTrap(){throw new Error("TRAP_HIT_DAMAGE_NOT_PORTED")}
   },
   item:{loadItems(){return []},shuffle(a){return a},
     deleteItem(){return true},onItemFind(s){return s}}
  }));
  await expect(res).rejects.toThrow("TRAP_HIT_DAMAGE_NOT_PORTED");
 });
});
