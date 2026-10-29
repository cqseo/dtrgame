import {describe,it,expect} from "vitest";
import fixture from "./fixtures/original-explore-map-php.json";
import {
 originalAllowMove,originalAllowSearch,originalMove,originalSearch,
 originalExploreAct,originalMapAvailable,originalMapForbidden,originalMapCanEnter,
 originalMapCurrentForbidden,originalMapCurrentSafe,originalMapWaveNumber,
 originalMapCheckPlace,type OriginalMapState,type OriginalExploreState
} from "../src/original-explore-map";
import {
 originalMeetmanRate,originalTrapRealOdds,originalItemFindOdds,
 ORIGINAL_DISCOVERY_DEFAULTS,originalDiscover,
 type OriginalDiscoverState
} from "../src/original-discovery-chain";
const input=fixture.map;
function map(hack:boolean,areanum:number):OriginalMapState {
 return {...input,arealist:input.arealist,areanum,hack} as unknown as OriginalMapState;
}
function player(pls:number,sp:number,command="search"):OriginalExploreState {
 return {pls,sp,log:"",mode:"command",command};
}
describe("Original PHP map and explore source-golden fixtures",()=>{
 it("reads original installed PHP config defaults",()=>{
  expect(fixture.defaults).toEqual({baseMoveSP:15,baseSearchSP:15,eventOdds:4,
   trapMinOdds:1.5,trapMaxOdds:40,itemOdds:60});
  expect(ORIGINAL_DISCOVERY_DEFAULTS).toMatchObject({
   eventOdds:fixture.defaults.eventOdds,trapMaxOdds:fixture.defaults.trapMaxOdds,
   itemOdds:fixture.defaults.itemOdds,minMeetRate:20});
 });
 it.each(fixture.move.map(x=>[x] as const))("matches PHP move rejection, stamina and HTML",async x=>{
  const s=player(x.pls,x.sp,"move");
  const ret=await originalMove(s,map(x.hack,x.areanum),x.moveto);
  expect(ret.moved).toBe(x.expected.moved);
  expect(String(ret.state.pls)).toBe(x.expected.pls);
  expect(ret.state.sp).toBe(x.expected.sp);
  expect(ret.state.log).toBe(x.expected.log);
 });
 it.each(fixture.search.map(x=>[x] as const))("matches PHP search forbidden zone and stamina",async x=>{
  const ret=await originalSearch(player(x.pls,x.sp),map(x.hack,x.areanum));
  expect(ret.searched).toBe(x.expected.searched);
  expect(ret.state.sp).toBe(x.expected.sp);
  expect(ret.state.log).toBe(x.expected.log);
 });
 it.each(fixture.mapCases.map(x=>[x] as const))("matches original map validity, ban wave, hack",x=>{
  const m=map(x.hack,x.areanum);
  expect(originalMapAvailable(m,x.place)).toBe(x.available);
  expect(originalMapForbidden(m,x.place)).toBe(x.forbidden);
  expect(originalMapCanEnter(m,x.place)).toBe(x.canEnter);
 });
 it.each(fixture.meet.map(x=>[x] as const))("matches PHP metman mode/rate for nearby players",x=>{
  expect(originalMeetmanRate(x.mode,x.nearby)).toBe(x.rate);
  expect(Math.max(20,originalMeetmanRate(x.mode,x.nearby))).toBe(x.floor??Math.max(20,x.rate));
 });
 it.each(fixture.trap.map(x=>[x] as const))("matches PHP trap count * 0.25% + min",x=>{
  expect(originalTrapRealOdds(x.count,fixture.defaults.trapMinOdds)).toBe(x.real);
 });
 it.each(fixture.items.map(x=>[x] as const))("matches PHP item find multiplier and buff",x=>{
  expect(originalItemFindOdds(x.base,x.multiplier,x.buff)).toBe(x.findRate);
 });
 it("preserves the original skill cost override hook rather than hardcoding 15",async()=>{
  const m=map(false,0);
  const s=player(0,36);
  const {state,searched}=await originalSearch(s,m,{calculateSearchSpCost:()=>35});
  expect(searched).toBe(true);
  expect(state.sp).toBe(1);
  const blocked=await originalSearch(player(0,35),m,{calculateSearchSpCost:()=>35});
  expect(blocked.searched).toBe(false);
  expect(blocked.state.sp).toBe(35);
 });
 it("hooks preserve original move destination and post-move discovery order",async()=>{
  const m=map(false,0);
  const events:string[]=[];
  const s=await originalExploreAct(player(0,40,"move"),m,"3",{
    async moveToArea(state,place){events.push("discover:"+place);return {...state,log:state.log+"陷阱已判定"}}
  });
  expect(s.pls).toBe("3");
  expect(s.sp).toBe(25);
  expect(events).toEqual(["discover:3"]);
  expect(s.log).toContain("废墟区域<br>陷阱已判定");
  const noAct=await originalExploreAct({...player(0,40,"move"),mode:"special"},m,"3");
  expect(noAct.pls).toBe(0);
 });
 it("map slices forbidden zones in original arealist order, not sorted map display",()=>{
  const m=map(false,2);
  expect(originalMapCurrentForbidden(m)).toEqual([2,0]);
  expect(originalMapCurrentSafe(m)).toEqual([1,3,4]);
  expect(originalMapCheckPlace(m,99)).toBe(0);
  expect(originalMapWaveNumber(m,0)).toBe(1);
 });
});
const start=():OriginalDiscoverState=>({mode:"search",log:"",hp:100,pose:0});
function rng(...values:number[]){
 const copy=[...values];
 return ()=>{const n=copy.shift();if(n===undefined)throw new Error("Unexpected random draw");return n};
}
describe("Original event->trap->metman->itemmain interception order",()=>{
 it("stops on event and sets mode=command, preserving original trace",async()=>{
  const r=await originalDiscover(start(),"search",{
   random99:rng(0),eventOdds:()=>4,eventMain:s=>({state:{...s,log:"EV"},occurred:true})
  });
  expect(r.stoppedAt).toBe("event");
  expect(r.invokedStages).toEqual(["event"]);
  expect(r.state.mode).toBe("command");
  expect(r.rolls).toEqual([0]);
 });
 it("continues when event_main returns false, then trap interrupts without item",async()=>{
  const r=await originalDiscover(start(),"search",{
   random99:rng(0,0),eventMain:s=>({state:{...s,log:"EventNoHit;"},occurred:false}),
   trapCheck:s=>({state:{...s,log:s.log+"Trap!"},triggered:true})
  });
  expect(r.invokedStages).toEqual(["event","trap"]);
  expect(r.stoppedAt).toBe("trap");
  expect(r.state.log).toBe("EventNoHit;Trap!");
  expect(r.discovered).toBe(false);
 });
 it("uses 20% metman floor and stops after a discovered player",async()=>{
  const r=await originalDiscover(start(),"search",{
   random99:rng(99,99,19),meetRate:()=>0,
   discoverPlayer:s=>({state:{...s,log:"Person"},found:true})
  });
  expect(r.stoppedAt).toBe("metman");
  expect(r.invokedStages).toEqual(["event","trap","metman"]);
  expect(r.rolls).toEqual([99,99,19]);
  expect(r.discovered).toBe(true);
 });
 it("search pose 3 continues to item only when player not found and still alive",async()=>{
  const r=await originalDiscover({...start(),pose:3},"search",{
   random99:rng(99,99,0,0),meetRate:()=>30,
   discoverPlayer:s=>({state:s,found:false}),
   discoverItem:s=>({state:{...s,log:s.log+"Picked item"},found:true})
  });
  expect(r.stoppedAt).toBe("itemmain");
  expect(r.invokedStages).toEqual(["event","trap","metman","itemmain"]);
  expect(r.discovered).toBe(true);
 });
 it("base explorer fallback preserves exact original no-discovery Chinese log",async()=>{
  const r=await originalDiscover(start(),"search",{
   random99:rng(99,99,99,99),meetRate:()=>20
  });
  expect(r.stoppedAt).toBe("empty");
  expect(r.state.log).toBe("但是什么都没有发现。<br>");
  expect(r.invokedStages).toEqual(["event","trap","metman","itemmain","empty"]);
 });
 it("does not fake absent event/trap or encounter implementation when a stage triggers",async()=>{
  await expect(originalDiscover(start(),"search",{random99:rng(0)}))
    .rejects.toThrow(/event_main/);
  await expect(originalDiscover(start(),"search",{random99:rng(99,0)}))
    .rejects.toThrow(/trapcheck/);
  await expect(originalDiscover(start(),"search",{random99:rng(99,99,0),meetRate:()=>20}))
    .rejects.toThrow(/discover_player/);
  await expect(originalDiscover(start(),"search",{random99:rng(99,99,99,0),meetRate:()=>20}))
    .rejects.toThrow(/discover_item/);
 });
 it("rejects out-of-range RNG and trap counts",async()=>{
  await expect(originalDiscover(start(),"search",{random99:()=>100})).rejects.toThrow(RangeError);
  expect(()=>originalTrapRealOdds(-1)).toThrow(RangeError);
  expect(()=>originalMeetmanRate("move",-1)).toThrow(RangeError);
 });
});