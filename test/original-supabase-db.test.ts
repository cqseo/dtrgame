import { describe,it,expect } from "vitest";
import { SupabaseOriginalUsers, type PgLegacyClient, type PgParameter } from "../src/original-supabase-db";
import type { LegacyRegistrationAccount } from "../src/original-register";

function fakeDatabase() {
  const records=new Map<string,Record<string,string|number>>();
  const executed: {sql:string;params:readonly PgParameter[]}[]=[];
  const client:PgLegacyClient={
    async query<T extends Record<string,unknown>>(sql:string,params:readonly PgParameter[]) {
      executed.push({sql,params});
      const username=String(sql.startsWith("UPDATE")?params[1]:params[0]);
      if(sql.startsWith("INSERT")) {
        if (records.has(username))return {rows:[] as T[],rowCount:0};
        const names=sql.slice(sql.indexOf("(")+1,sql.indexOf(") VALUES")).split(",");
        const row=Object.fromEntries(names.map((name,i)=>[name.trim(),params[i]])) as Record<string,string|number>;
        row.uid=53;row.roomid=0;row.lastvisit=0;
        records.set(username,row);
        return {rows:[{uid:53} as T],rowCount:1};
      }
      if(sql.startsWith("UPDATE")) {
        const row=records.get(username);
        if (row) row.lastvisit=Number(params[0]);
        return {rows:row?[{uid:row.uid} as T]:[],rowCount:row?1:0};
      }
      const row=records.get(username);
      return {rows:row?[row as T]:[],rowCount:row?1:0};
    }
  };
  return {client,records,executed};
}
function record():LegacyRegistrationAccount {
 return {username:"QaMirrorUser",password:"a".repeat(32),alt_pswd:1,groupid:1,ip:"127.0.0.1",credits:0,gold:100,
  gender:"m",icon:"0",motto:"QA",killmsg:"QA",lastword:"QA",card_data:"encoded-original-fixture"};
}
describe("Supabase original 39-column users adapter — QA only",()=>{
 it("keeps the exact original username, 100 starting gold and account MD5 hash, no overwrites",async()=>{
  const {client,records,executed}=fakeDatabase();
  const adapter=new SupabaseOriginalUsers(client,"qa-only");
  expect(await adapter.exists("QaMirrorUser")).toBe(false);
  expect(await adapter.insert(record())).toBe(true);
  expect(await adapter.exists("QaMirrorUser")).toBe(true);
  expect(await adapter.insert({...record(),gold:999})).toBe(false);
  const row=records.get("QaMirrorUser")!;
  expect(row.password).toBe("a".repeat(32));
  expect(row.gold).toBe(100);
  expect(row.gender).toBe("m");
  expect(row.u_settings).toBe("");
  expect(row.cardenergy).toBe("");
  expect(row.card_data).toBe("encoded-original-fixture");
  expect(executed.filter(x=>x.sql.startsWith("INSERT"))[0]?.sql).toContain("ON CONFLICT (username) DO NOTHING");
  expect(executed.every(x=>!x.sql.includes("QaMirrorUser"))).toBe(true);
  expect(await adapter.findByUsername("QaMirrorUser")).toMatchObject({
   username:"QaMirrorUser",password:"a".repeat(32),groupid:1,roomid:0
  });
  await adapter.recordLastLogin("QaMirrorUser",1793242800);
  expect(row.lastvisit).toBe(1793242800);
 });
 it("does not disguise ICU/MySQL collation mismatch as production-ready",()=>{
   expect(() => new SupabaseOriginalUsers(fakeDatabase().client,"production" as "qa-only"))
     .toThrow(/collation parity/);
 });
 it("rejects invalid original login timestamp before changing any row", async()=>{
   const {client,executed}=fakeDatabase();
   const adapter=new SupabaseOriginalUsers(client,"qa-only");
   await expect(adapter.recordLastLogin("QaMirrorUser",-100)).rejects.toThrow(RangeError);
   expect(executed).toHaveLength(0);
 });
});
