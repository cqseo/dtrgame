import {describe,it,expect} from "vitest";
import {SupabaseOriginalDiscoveryStore} from "../src/original-supabase-discover";
import type {PgLegacyClient,PgParameter} from "../src/original-supabase-db";
function fake(){
 const sqls:{sql:string;params:readonly PgParameter[]}[]=[];
 const db:PgLegacyClient={async query<T extends Record<string,unknown>>(
  sql:string,parameters:readonly PgParameter[]){
  sqls.push({sql,params:parameters});
  if(sql.startsWith("SELECT tid"))return {rows:[{
    tid:4,pls:3,itm:"陷阱",itmk:"TN",itme:15,itms:"1",itmsk:""
  } as unknown as T],rowCount:1};
  if(sql.startsWith("SELECT iid"))return {rows:[{
    iid:17,pls:3,itm:"道具",itmk:"HH",itme:100,itms:"30",itmsk:""
  } as unknown as T],rowCount:1};
  return {rows:[{
    [sql.includes("tid=$1")?"tid":"iid"]:parameters[0]
  } as unknown as T],rowCount:1};
 }};
 return {db,sqls};
}
describe("private Supabase original room-trap-item SQL adapter",()=>{
 it.each([0,1,2,3,4,5,6,8] as const)(
  "maps original room %i into correct private physical tables",async room=>{
   const x=fake();const store=new SupabaseOriginalDiscoveryStore(x.db,room,"qa-only");
   const prefix=room===0?"":'s'+room+'_';
   expect((await store.listTraps("3"))[0]?.tid).toBe(4);
   expect((await store.loadItems("3"))[0]?.iid).toBe(17);
   expect(await store.deleteTrap(4)).toBe(true);
   expect(await store.deleteItem(17)).toBe(true);
   expect(x.sqls.map(x=>x.sql)).toEqual([
    expect.stringContaining('acfun_legacy."'+prefix+'maptrap"'),
    expect.stringContaining('acfun_legacy."'+prefix+'mapitem"'),
    expect.stringContaining('acfun_legacy."'+prefix+'maptrap"'),
    expect.stringContaining('acfun_legacy."'+prefix+'mapitem"')
   ]);
   expect(x.sqls[0]!.sql).toContain('ORDER BY acfun_legacy.mysql_username_weight_key(itmk) DESC');
   expect(x.sqls[0]!.params).toEqual([3]);
  });
 it("rejects invented s7 and malicious path identifiers",()=>{
  const x=fake();
  expect(()=>new SupabaseOriginalDiscoveryStore(x.db,7 as 8,"qa-only")).toThrow(RangeError);
  expect(()=>new SupabaseOriginalDiscoveryStore(x.db,-1 as 8,"qa-only")).toThrow(RangeError);
  expect(()=>new SupabaseOriginalDiscoveryStore(x.db,0,"production" as "qa-only")).toThrow(/not yet accepted/);
 });
 it("protects query parameters and source integer range",async()=>{
  const x=fake();const s=new SupabaseOriginalDiscoveryStore(x.db,0,"qa-only");
  await expect(s.listTraps("1;DELETE")).rejects.toThrow(RangeError);
  await expect(s.loadItems("999")).rejects.toThrow(RangeError);
  await expect(s.deleteItem(-20)).rejects.toThrow(RangeError);
  await expect(s.deleteTrap(0)).rejects.toThrow(RangeError);
  expect(x.sqls).toHaveLength(0);
 });
});
