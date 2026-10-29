import {describe,it,expect} from "vitest";
import {originalResolveGameEntry,originalRoomFromCookie,type OriginalEntryPlayer} from "../src/original-game-entry";
import {legacyStoredPassword,legacyCookiePassword} from "../src/original-auth";
import type {PgLegacyClient,PgParameter} from "../src/original-supabase-db";
import type {LegacyUserStore} from "../src/original-login";
const username="QA_PLAYER";
const cookie=legacyCookiePassword("test-only-password");
const hash=legacyStoredPassword(username,cookie);
const header=(room=0)=>"acbra2_user="+username+"; acbra2_pass="+cookie+"; acbra2_roomid="+room;
function setup(overrides:Partial<OriginalEntryPlayer>={},gamestate=20,exists=true){
 const calls:{sql:string;args:readonly PgParameter[]}[]=[];
 const row:OriginalEntryPlayer={
  pid:13,name:username,pass:hash,type:0,hp:100,state:0,
  player_dead_flag:0,itms0:0,...overrides
 };
 const db:PgLegacyClient={async query<T extends Record<string,unknown>>(
  sql:string,args:readonly PgParameter[]
 ){
  calls.push({sql,args});
  if(sql.includes(' WHERE acfun_legacy.mysql_username_weight_key(name)')){
   return {rows:exists?[row as unknown as T]:[],rowCount:exists?1:0};
  }
  if(sql.includes("FROM acfun_legacy.game")){
   return {rows:[{groomid:Number(args[0]),groomstatus:40,groomtype:2,
    gamenum:12,gamestate,roomvars:"",gamevars:""} as unknown as T],rowCount:1};
  }
  throw new Error("Unexpected DB query");
 }};
 const users:LegacyUserStore={findByUsername:async name=>
  name===username?{username,password:hash,groupid:1,roomid:0}:null};
 return {db,users,calls};
}
describe("source-faithful game.php -> command_game.php entry gate",()=>{
 it("rejects missing or incorrect historical cookies before querying database",async()=>{
  const x=setup();
  expect(await originalResolveGameEntry("",{...x,purpose:"qa-only"})).toEqual({kind:"no_login"});
  expect(await originalResolveGameEntry("acbra2_user=QA_PLAYER; acbra2_pass=bad",
   {...x,purpose:"qa-only"})).toEqual({kind:"no_login"});
  expect(x.calls).toHaveLength(0);
 });
 it("honors PHP source player lookup BEFORE finished gamestate",async()=>{
  const x=setup({},0,false);
  const result=await originalResolveGameEntry(header(),{...x,purpose:"qa-only"});
  expect(result).toEqual({kind:"redirect",url:"valid.php",roomId:0});
  expect(x.calls).toHaveLength(1);
  expect(x.calls[0]?.sql).toContain('"players"');
 });
 it("finished game redirects to original end.php after found player",async()=>{
  const x=setup({},0);
  expect(await originalResolveGameEntry(header(),{...x,purpose:"qa-only"}))
   .toEqual({kind:"redirect",url:"end.php",roomId:0});
  expect(x.calls).toHaveLength(2);
 });
 it.each([4,5,6])("state %i redirects to end.php",async state=>{
  const x=setup({state});
  const r=await originalResolveGameEntry(header(),{...x,purpose:"qa-only"});
  expect(r).toEqual({kind:"redirect",url:"end.php",roomId:0});
 });
 it.each([[0,"command"],[1,"rest"],[2,"rest"],[3,"rest"]] as const)(
  "matches source base player mode state=%i",async (state,expected)=>{
   const x=setup({state});
   const r=await originalResolveGameEntry(header(),{...x,purpose:"qa-only"});
   expect(r.kind).toBe("needs_original_template_renderer");
   if(r.kind==="needs_original_template_renderer"){
    expect(r.playerMode).toBe(expected);
    expect(r.gameNumber).toBe(12);
   }
  });
 it("item0 durability drives itemmain only when not resting",async()=>{
  const x=setup({state:0,itms0:"2"});
  const r=await originalResolveGameEntry(header(8),{...x,purpose:"qa-only"});
  expect(r.kind).toBe("needs_original_template_renderer");
  if(r.kind==="needs_original_template_renderer")
   expect(r.playerMode).toBe("itemmain");
  expect(x.calls[0]?.sql).toContain('"s8_players"');
 });
 it("deadflag prioritizes hp=0 death and requires player state persistence",async()=>{
  const x=setup({hp:80,player_dead_flag:1});
  const r=await originalResolveGameEntry(header(3),{...x,purpose:"qa-only"});
  expect(r.kind).toBe("needs_original_template_renderer");
  if(r.kind==="needs_original_template_renderer"){
   expect(r.playerMode).toBe("death");
   expect(r.hpChanged).toBe(true);
   expect(r.deadFlagChanged).toBe(false);
  }
  expect(x.calls[0]?.sql).toContain('"s3_players"');
 });
 it("does not silently skip original game player password synchronization",async()=>{
  const x=setup({pass:"oldhash"});
  expect(await originalResolveGameEntry(header(),{...x,purpose:"qa-only"}))
   .toEqual({kind:"player_password_resync_required",roomId:0,playerId:13});
 });
 it("rejects unsupported invented s7 without querying player table",async()=>{
  const x=setup();
  expect(await originalResolveGameEntry(header(7),{...x,purpose:"qa-only"}))
   .toEqual({kind:"unsupported_room",roomId:-1});
  expect(x.calls).toHaveLength(0);
 });
 it("room id cookie read mirrors standard and original s1..s6,s8",()=>{
  expect(originalRoomFromCookie(header(0))).toBe(0);
  expect(originalRoomFromCookie(header(6))).toBe(6);
  expect(originalRoomFromCookie(header(8))).toBe(8);
  expect(originalRoomFromCookie(header(7))).toBeNull();
  expect(originalRoomFromCookie("acbra2_roomid=7%3BDROP")).toBeNull();
 });
 it("parameterizes original username equality instead of injecting SQL",async()=>{
  const x=setup();
  await originalResolveGameEntry(header(),{...x,purpose:"qa-only"});
  expect(x.calls[0]?.sql).toContain("mysql_username_weight_key(name)=$1");
  expect(x.calls[0]?.args).toHaveLength(1);
  expect(x.calls[0]?.args[0]).toMatch(/^[a-f0-9]+$/i);
 });
 it("never accepts a non-QA environment or exposes stored hashes in response",async()=>{
  const x=setup();
  await expect(originalResolveGameEntry(header(),{...x,purpose:"production" as "qa-only"}))
   .rejects.toThrow(/parity not accepted/);
  const r=await originalResolveGameEntry(header(),{...x,purpose:"qa-only"});
  expect(JSON.stringify(r)).not.toContain(hash);
  expect(JSON.stringify(r)).not.toContain(cookie);
 });
});
