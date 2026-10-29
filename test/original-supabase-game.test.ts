import { describe,expect,it } from "vitest";
import { SupabaseOriginalGameReadStore } from "../src/original-supabase-game";
import type { PgLegacyClient } from "../src/original-supabase-db";

function probe() {
  const queries:{sql:string;params:readonly (string|number|null)[]}[]=[];
  const client:PgLegacyClient = {
    async query<T extends Record<string,unknown>>(sql:string,params:readonly (string|number|null)[]) {
      queries.push({sql,params});
      if(sql.includes("FROM acfun_legacy.game")) {
        return {rows:[{groomid:8,groomstatus:30,groomtype:2,
          gamenum:12,gamestate:1,roomvars:"ENCODED_ROOMVARS",gamevars:"ENCODED_GAMEVARS"} as unknown as T],rowCount:1};
      }
      return {rows:[{pid:20,name:"SyntheticQA",type:0,
        pass:"not-real-player-data",hp:100,sp:200} as unknown as T],rowCount:1};
    }
  };
  return {client,queries};
}
describe("original room / player-state table mapping on Supabase staging",()=>{
 it("reads the exact game variables without parsing or changing the original encoding",async()=>{
  const {client,queries}=probe();const db=new SupabaseOriginalGameReadStore(client,"qa-only");
  const room=await db.findGame(8);
  expect(room).toMatchObject({groomid:8,groomstatus:30,roomvars:"ENCODED_ROOMVARS",gamevars:"ENCODED_GAMEVARS"});
  expect(queries[0]).toEqual({sql:expect.stringContaining("FROM acfun_legacy.game"),params:[8]});
 });
 it("maps standard and existing subroom IDs without allowing arbitrary SQL table names",async()=>{
  const {client,queries}=probe();const db=new SupabaseOriginalGameReadStore(client,"qa-only");
  await db.findPlayer(0,20);
  await db.findPlayer(8,20);
  expect(queries[0]?.sql).toContain('acfun_legacy."players"');
  expect(queries[1]?.sql).toContain('acfun_legacy."s8_players"');
  expect(queries[1]?.params).toEqual([20]);
  expect((await db.findPlayer(7,20))).toBe(null);
  expect((await db.findPlayer(999,20))).toBe(null);
  expect((await db.findPlayer(8,-10))).toBe(null);
  expect(queries).toHaveLength(2);
 });
 it("refuses production use before PHP command and room parity acceptance",()=>{
  expect(()=>new SupabaseOriginalGameReadStore(probe().client,"production" as "qa-only"))
   .toThrow(/room and player state parity/);
 });
});
