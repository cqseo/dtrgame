import {describe,it,expect} from "vitest";
import cases from "./fixtures/original-player-action-php.json";
import {
 originalPlayerPreAct,originalPlayerAct,originalPlayerPostAct,
 originalCommandActDecision,originalPlanPlayerSave,originalPlayerSaveSql,
 type OriginalPlayerActionState,type OriginalPlayerRow
} from "../src/original-player-action";
function state(extra:Partial<OriginalPlayerActionState>={}):OriginalPlayerActionState {
 return {hp:100,state:0,playerDeadFlag:0,mode:"command",command:"",spCmd:"special",
  motto:"old",killmsg:"old",lastword:"old",...extra};
}
describe("Original core PHP player action and persistence golden fixtures",()=>{
 it.each(cases.preAct.map(x=>[x] as const))("matches pre_act dead-flag/$hp priority",x=>{
  const result=originalPlayerPreAct(state({hp:x.hp,playerDeadFlag:x.flag}));
  expect(result.hp).toBe(x.newHp);
  expect(result.playerDeadFlag).toBe(x.newFlag);
 });
 it.each(cases.act.map(x=>[x] as const))("matches base player act / command menu and special input",x=>{
  const result=originalPlayerAct(state({mode:x.mode,command:x.command}));
  expect(result.mode).toBe(x.newMode);
 });
 it.each(cases.decision.map(x=>[x] as const))("matches command_act login/player/gamestate/HP/state ordered checks",x=>{
  const outcome=originalCommandActDecision(x.user,x.pass,x.exists,x.gamestate,x.hp,x.state);
  const actual=outcome.kind==="no_login"?"no_login":outcome.kind==="redirect"?outcome.url:
     outcome.allowPlayerAct?"run_act":"run_no_act";
  expect(actual).toBe(x.expect);
 });
 it.each(cases.saves.map(x=>[x] as const))("matches player_save source SQL diff, death flag and human name requirement",x=>{
  const result=originalPlanPlayerSave(x.row as OriginalPlayerRow,x.columns,x.origin as OriginalPlayerRow|null);
  expect(result.changes).toEqual(Array.isArray(x.changes)?{}:x.changes);
  expect(result.shouldWrite).toBe(x.shouldWrite);
  if(x.row.pid !== undefined) {
   expect(result.requireHumanName).toBe(x.requireHumanName);
   expect(result.nextPool).toEqual(x.nextPool);
  }
  if(result.shouldWrite) {
   const sql=originalPlayerSaveSql("players",result,x.columns);
   expect(sql?.sql).toContain('UPDATE acfun_legacy."players" SET');
   expect(sql?.sql).toContain('"pid"=$');
   if(x.requireHumanName)expect(sql?.sql).toContain(' AND acfun_legacy.mysql_username_weight_key("name")=$');
   else expect(sql?.sql).not.toContain(' AND acfun_legacy.mysql_username_weight_key("name")=$');
  } else expect(originalPlayerSaveSql("players",result,x.columns)).toBeNull();
 });
 it("preserves original account words in post_act even without command execution",()=>{
  const s=originalPlayerPostAct(state({motto:"old",killmsg:"old",lastword:"old"}),{
   motto:"新签名",killmsg:"战败",lastword:"遗言"});
  expect([s.motto,s.killmsg,s.lastword]).toEqual(["新签名","战败","遗言"]);
 });
 it("rejects SQL table injection, unknown columns and invalid player identifiers",()=>{
  const data={pid:3,name:"QA",hp:10,type:0};
  const save=originalPlanPlayerSave(data,["pid","name","hp","type"],null);
  expect(()=>originalPlayerSaveSql("users;DROP",save,["pid","name","hp","type"])).toThrow();
  expect(()=>originalPlayerSaveSql("players",save,["pid","name"])).toThrow();
  const invalid=originalPlanPlayerSave({pid:0,name:"QA",hp:10,type:0},["pid","name","hp","type"],null);
  expect(()=>originalPlayerSaveSql("players",invalid,["pid","name","hp","type"])).toThrow();
 });
 it("retains original MySQL utf8_general_ci name guard for human player SQL updates",()=>{
  const p=originalPlanPlayerSave(
   {pid:71,name:"QaPlayerA",type:0,hp:90,player_dead_flag:1},
   ["pid","name","type","hp","player_dead_flag"],
   {pid:71,name:"QaPlayerA",type:0,hp:100,player_dead_flag:0}
  );
  const q=originalPlayerSaveSql("s8_players",p,["pid","name","type","hp","player_dead_flag"]);
  expect(q?.sql).toContain('acfun_legacy.mysql_username_weight_key("name")');
  expect(q?.args.at(-1)).toBe("005100410050004c00410059004500520041");
  expect(q?.sql).toContain('acfun_legacy."s8_players"');
 });
 it("does not let dead flag be reset to false by a concurrent stale state",()=>{
  const plan=originalPlanPlayerSave(
   {pid:3,type:0,name:"QA",hp:100,player_dead_flag:0},
   ["pid","type","name","hp","player_dead_flag"],
   {pid:3,type:0,name:"QA",hp:100,player_dead_flag:1}
  );
  expect(plan.changes).not.toHaveProperty("player_dead_flag");
 });
});