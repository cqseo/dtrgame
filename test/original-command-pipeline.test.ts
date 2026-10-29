import {describe,it,expect} from "vitest";
import php from "./fixtures/original-command-pipeline-php.json";
import {executeOriginalCommandAct,type OriginalCommandHooks} from "../src/original-command-pipeline";
import {
 originalPlayerPreAct,originalPlayerAct,originalPlayerPostAct,
 type OriginalPlayerActionState
} from "../src/original-player-action";
type State=OriginalPlayerActionState & {persisted:boolean};
type Response={innerHTML:Record<string,string>};
function sample(hp=100,dead=0):State {
 return {hp,state:2,playerDeadFlag:dead,mode:"command",command:"special",spCmd:"special",
 motto:"old",killmsg:"old",lastword:"old",persisted:false};
}
function harness() {
 const steps:string[]=[];
 let saved:State|null=null;
 const hooks:OriginalCommandHooks<State,Response>={
 initPlayerData(s){steps.push("initPlayerData");return s},
 preAct(s){steps.push("preAct");return originalPlayerPreAct(s)},
 getActionFields(s){return {hp:s.hp,state:s.state}},
 act(s){steps.push("act");return originalPlayerAct(s)},
 postAct(s){steps.push("postAct");return originalPlayerPostAct(s,{motto:"签名",killmsg:"胜利",lastword:"遗言"})},
 prepareResponse(s){steps.push("prepareResponse");return {innerHTML:{status:s.mode}}},
 parseProfile(s,r){steps.push("parseProfile");return {...r,innerHTML:{...r.innerHTML,motto:s.motto}}},
 parseGameInfo(_s,r){steps.push("parseGameInfo");return {...r,innerHTML:{...r.innerHTML,game:"running"}}},
 encodeResponse(r){steps.push("encodeResponse");return JSON.stringify(r)},
 emitResponse(_encoded){steps.push("emitResponse")},
 updateSdata(s){steps.push("updateSdata");return s},
 beforeLastSave(s){steps.push("beforeLastSave");return s},
 savePlayer(s){steps.push("savePlayer");saved={...s,persisted:true}},
 };
 return {steps,hooks,getSaved:()=>saved};
}
describe("Original command_act.php action phase ordering / no fake game engine",()=>{
 it("mirrors all 12 source-measured phases including response-before-save",async()=>{
  const h=harness();
  const result=await executeOriginalCommandAct(20,sample(),h.hooks);
  expect(h.steps).toEqual(php.orderedSteps);
  expect(result.acted).toBe(true);
  expect(result.state.motto).toBe("签名");
  expect(result.response.innerHTML.game).toBe("running");
  expect(h.getSaved()).toMatchObject({motto:"签名",persisted:true});
  expect(h.steps.indexOf("emitResponse")).toBeLessThan(h.steps.indexOf("savePlayer"));
 });
 it("still runs pre/post/response/save when original player_dead_flag disables act",async()=>{
  const h=harness();
  const result=await executeOriginalCommandAct(20,sample(60,1),h.hooks);
  expect(result.acted).toBe(false);
  expect(result.state.hp).toBe(0);
  expect(result.state.playerDeadFlag).toBe(1);
  expect(h.steps).toEqual(php.orderedSteps.filter(x=>x!=="act"));
  expect(h.getSaved()).toMatchObject({hp:0,playerDeadFlag:1});
 });
 it.each([0,1,19])("prevents act at gamestate=%i while preserving rest of source phases",async gs=>{
  const h=harness();const result=await executeOriginalCommandAct(gs,sample(),h.hooks);
  expect(result.acted).toBe(false);
  expect(h.steps).not.toContain("act");
  expect(h.steps.slice(-3)).toEqual(["updateSdata","beforeLastSave","savePlayer"]);
 });
 it("awaits async user-defined save hooks before resolving response",async()=>{
  const h=harness(),events:string[]=[];
  h.hooks.savePlayer=async()=>{await Promise.resolve();events.push("committed")};
  const result=await executeOriginalCommandAct(20,sample(),h.hooks);
  expect(events).toEqual(["committed"]);
  expect(result.encoded).toContain("game");
 });
});