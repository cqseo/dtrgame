import {describe,it,expect} from "vitest";
import {
 originalGameinfoAudit,originalPrepareGameinfo,originalGameinfoSaveSql,
 ORIGINAL_GAMEINFO_FIELDS
} from "../src/original-gameinfo-save";
import {legacyDecode} from "../src/original-protocol";
describe("core/sys/global.php original save_gameinfo source fields",()=>{
 const input=()=>({
  groomid:8,groomtype:2,groomstatus:1,
  gamenum:100,gamestate:40,deathnum:-1,alivenum:-4,
  afktime:0,hdamage:0,hplayer:"",arealist:[0,1,4,7],
  roomvars:{foo:8},noisevars:[{foo:10}],gamevars:{weather:"rain"}
 });
 it("source room fields excluded by default to prevent stale concurrent state",async()=>{
  const game=await originalGameinfoSaveSql(input(),8,123456);
  expect(game.sql).toContain('UPDATE acfun_legacy."game"');
  expect(game.sql).toContain(' WHERE groomid=$');
  for(const k of ["groomid","groomtype","groomstatus","roomvars"]){
   expect(game.serialized).not.toHaveProperty(k);
   expect(game.sql).not.toContain('"'+k+'"=');
  }
  expect(game.serialized.arealist).toBe("0,1,4,7");
  expect(game.serialized.deathnum).toBe(0);
  expect(game.serialized.alivenum).toBe(0);
  expect(game.serialized.afktime).toBe(123456);
  expect(await legacyDecode(game.serialized.noisevars as string)).toEqual([{foo:10}]);
  expect(await legacyDecode(game.serialized.gamevars as string)).toEqual({weather:"rain"});
 });
 it("source optional ignore_room false permits room state fields and compressed roomvars",async()=>{
  const out=await originalGameinfoSaveSql(input(),8,100,false);
  expect(out.serialized.groomid).toBe(8);
  expect(out.serialized.groomtype).toBe(2);
  expect(out.serialized.groomstatus).toBe(1);
  expect(await legacyDecode(out.serialized.roomvars as string)).toEqual({foo:8});
  expect(out.args.at(-1)).toBe(8);
 });
 it("does not save original room without game ID/state",async()=>{
  await expect(originalPrepareGameinfo({gamenum:1})).rejects.toThrow();
  await expect(originalGameinfoSaveSql(input(),7,100)).rejects.toThrow(RangeError);
 });
 it("rejects unknown gameinfo fields instead of allowing SQL injection",async()=>{
  await expect(originalPrepareGameinfo({
   gamenum:10,gamestate:20,"gamevars;DROP TABLE users":1
  })).rejects.toThrow(RangeError);
 });
 it("audits exactly original source negative counts and defaults",()=>{
  const source=originalGameinfoAudit({alivenum:-1,deathnum:-5,afktime:0,
   hdamage:0,hplayer:""},123);
  expect(source).toMatchObject({
   alivenum:0,deathnum:0,afktime:123,hdamage:0,hplayer:""
  });
 });
 it("keeps precisely the 25 original MySQL game field names",()=>{
  expect(ORIGINAL_GAMEINFO_FIELDS).toHaveLength(25);
  expect(new Set(ORIGINAL_GAMEINFO_FIELDS).size).toBe(25);
 });
});
