import {describe,it,expect} from "vitest";
import {originalWithRoomTransaction,type OriginalRoomTxClient} from "../src/original-room-transaction";
import type {PgParameter} from "../src/original-supabase-db";
function fake(){
 const calls:{sql:string;params:readonly PgParameter[]}[]=[];
 const client:OriginalRoomTxClient={singleSession:true,
  async query<T extends Record<string,unknown>>(sql:string,params:readonly PgParameter[]){
   calls.push({sql,params});return {rows:[] as T[],rowCount:0};
  }};
 return {calls,client};
}
describe("original game room isolated PG transaction",()=>{
 it("holds a room lock and commits original map + player action together",async()=>{
  const {calls,client}=fake();
  const result=await originalWithRoomTransaction(client,{purpose:"qa-only",roomId:8},async db=>{
   await db.query("DELETE FROM acfun_legacy.s8_maptrap WHERE tid=$1",[7]);
   await db.query("UPDATE acfun_legacy.s8_players SET hp=$1 WHERE pid=$2",[80,3]);
   return "saved";
  });
  expect(result).toBe("saved");
  expect(calls.map(x=>x.sql)).toEqual([
   "BEGIN","SELECT set_config('statement_timeout',$1,true)",
   "SELECT set_config('lock_timeout',$1,true)","SELECT pg_advisory_xact_lock($1,$2)",
   "DELETE FROM acfun_legacy.s8_maptrap WHERE tid=$1",
   "UPDATE acfun_legacy.s8_players SET hp=$1 WHERE pid=$2","COMMIT"]);
  expect(calls[3]!.params).toEqual([20261029,8]);
 });
 it("rolls back original selected item if a later player save fails",async()=>{
  const {calls,client}=fake();
  await expect(originalWithRoomTransaction(client,{purpose:"qa-only",roomId:2},async db=>{
   await db.query("DELETE FROM acfun_legacy.s2_mapitem WHERE iid=$1",[17]);
   throw new Error("PLAYER_SAVE_FAILED");
  })).rejects.toThrow("PLAYER_SAVE_FAILED");
  expect(calls.at(-1)?.sql).toBe("ROLLBACK");
  expect(calls.some(x=>x.sql==="COMMIT")).toBe(false);
 });
 it("does not run writes for unrecognized rooms or shared sessions",async()=>{
  const {calls,client}=fake();
  await expect(originalWithRoomTransaction(client,{purpose:"qa-only",roomId:7},async()=>0))
    .rejects.toThrow(RangeError);
  await expect(originalWithRoomTransaction({...client,singleSession:false as true},
    {purpose:"qa-only",roomId:1},async()=>0)).rejects.toThrow(/single/);
  await expect(originalWithRoomTransaction(client,{purpose:"production" as "qa-only",roomId:1},
    async()=>0)).rejects.toThrow(/production/);
  expect(calls).toHaveLength(0);
 });
});
