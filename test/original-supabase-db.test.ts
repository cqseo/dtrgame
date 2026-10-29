import { describe,it,expect } from "vitest";
import { SupabaseOriginalUsers, type PgLegacyClient, type PgParameter } from "../src/original-supabase-db";
import { originalMysqlUsernameKey } from "../src/original-mysql-collation";
import type { LegacyRegistrationAccount } from "../src/original-register";

function fakeDatabase() {
 const records=new Map<string,Record<string,string|number>>();
 const keys=new Map<string,string>();
 const executed:{sql:string;params:readonly PgParameter[]}[]=[];
 const client:PgLegacyClient={
  async query<T extends Record<string,unknown>>(sql:string,params:readonly PgParameter[]) {
   executed.push({sql,params});
   if(sql.startsWith("WITH created")) {
    const username=String(params[0]),weight=String(params.at(-1));
    if(records.has(username)||keys.has(weight))return {rows:[] as T[],rowCount:0};
    const match=/INSERT INTO acfun_legacy\.users \((.*?)\) VALUES/s.exec(sql);
    if(!match)throw new Error("Missing parameterized PostgreSQL column list");
    const fields=match[1]!.split(",");
    const row=Object.fromEntries(fields.map((x,i)=>[x.trim(),params[i]])) as Record<string,string|number>;
    row.uid=53;row.roomid=0;row.lastvisit=0;
    records.set(username,row);keys.set(weight,username);
    return {rows:[{uid:53} as unknown as T],rowCount:1};
   }
   const weight=String(sql.startsWith("UPDATE")?params[1]:params[0]);
   const username=keys.get(weight),row=username?records.get(username):undefined;
   if(sql.startsWith("UPDATE")) {
    if(row)row.lastvisit=Number(params[0]);
    return {rows:row?[{uid:row.uid} as unknown as T]:[],rowCount:row?1:0};
   }
   return {rows:row?[row as unknown as T]:[],rowCount:row?1:0};
  }
 };
 return {client,records,keys,executed};
}
function record(username="QaMirrorUser"):LegacyRegistrationAccount {
 return {username,password:"a".repeat(32),alt_pswd:1,groupid:1,ip:"127.0.0.1",credits:0,gold:100,
 gender:"m",icon:"0",motto:"QA",killmsg:"QA",lastword:"QA",card_data:"encoded-original-fixture"};
}
describe("Supabase original username weighted index adapter — QA only",()=>{
 it("preserves exact account fields and prevents overwriting historical accounts",async()=>{
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
  expect(executed.some(x=>x.sql.includes("INSERT INTO acfun_legacy.username_weight_index"))).toBe(true);
  expect(executed.every(x=>!x.sql.includes("QaMirrorUser"))).toBe(true);
  expect(await adapter.findByUsername("QaMirrorUser")).toMatchObject({
    username:"QaMirrorUser",password:"a".repeat(32),groupid:1,roomid:0
  });
  await adapter.recordLastLogin("QaMirrorUser",1793242800);
  expect(row.lastvisit).toBe(1793242800);
 });
 it("matches original MySQL case/accent equivalence, without overwriting",async()=>{
  const {client,records,keys}=fakeDatabase();
  const adapter=new SupabaseOriginalUsers(client,"qa-only");
  expect(await adapter.insert(record())).toBe(true);
  expect(await adapter.exists("qámirroruser")).toBe(true);
  expect((await adapter.findByUsername("QáMirrorUser"))?.username).toBe("QaMirrorUser");
  expect(await adapter.insert(record("QáMirrorUser"))).toBe(false);
  expect(records.size).toBe(1);
  expect(keys.has(originalMysqlUsernameKey("qámirroruser")!)).toBe(true);
 });
 it("treats only original weighted-name uniqueness collisions as taken, never hides other DB failures", async()=>{
  const duplicate:PgLegacyClient={
    async query(){throw Object.assign(new Error("unique"),{
      code:"23505",constraint:"username_weight_index_legacy_weight_key_key"
    });}
  };
  expect(await new SupabaseOriginalUsers(duplicate,"qa-only").insert(record("QáMirrorUser")))
    .toBe(false);
  const otherUniqueViolation:PgLegacyClient={
    async query(){throw Object.assign(new Error("another constraint"),{
      code:"23505",constraint:"username_weight_index_pkey"
    });}
  };
  await expect(new SupabaseOriginalUsers(otherUniqueViolation,"qa-only").insert(record()))
    .rejects.toThrow("another constraint");
 });
 it("does not disguise unfinished migration as production-ready",()=>{
  expect(()=>new SupabaseOriginalUsers(fakeDatabase().client,"production" as "qa-only"))
   .toThrow(/collation parity/);
 });
 it("rejects invalid legacy timestamps and non-BMP usernames",async()=>{
  const {client,executed}=fakeDatabase();
  const adapter=new SupabaseOriginalUsers(client,"qa-only");
  await expect(adapter.recordLastLogin("QaMirrorUser",-100)).rejects.toThrow(RangeError);
  await expect(adapter.insert(record("😀"))).rejects.toThrow(RangeError);
  expect(executed).toHaveLength(0);
 });
});
