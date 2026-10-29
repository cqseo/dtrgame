import { describe, expect, it } from "vitest";
import { D1LegacyRegistrationStore } from "../src/original-register-db";
import type { LegacyRegistrationAccount } from "../src/original-register";
import type { OriginalD1 } from "../src/original-db";

function fixture(): LegacyRegistrationAccount {
  return { username:"QA_Person",password:"f".repeat(32),alt_pswd:1,groupid:1,
    ip:"127.0.0.1",credits:0,gold:100,gender:"male",icon:"0",
    motto:"Sample",killmsg:"Fight",lastword:"Bye",card_data:"fixture"};
}
function fakeD1() {
  const users=new Map<string, Record<string,unknown>>();
  const calls:{sql:string;args:(string|number|null)[]}[]=[];
  const db={
    prepare(sql:string) {
      let args:(string|number|null)[]=[];
      return {
        bind(...values:(string|number|null)[]) { args=values;calls.push({sql,args});return this; },
        async first<T>() { return (users.has(String(args[0])) ? {present:1} : null) as T | null; },
        async run() {
          if (!users.has(String(args[0]))) users.set(String(args[0]),JSON.parse(String(args[4])));
          return {success:true,meta:{changes:users.size===1 && calls.filter(c=>c.sql.startsWith("INSERT")).length===1 ? 1 : 0}};
        }
      };
    }
  };
  return {db:db as OriginalD1,users,calls};
}
describe("isolated D1 registration adapter (no production database)",()=> {
  it("stores account hash and every registration field in raw_record with original defaults",async()=>{
    const {db,users,calls}=fakeD1(),store=new D1LegacyRegistrationStore(db);
    const record=fixture();
    expect(await store.exists("QA_Person")).toBe(false);
    expect(await store.insert(record)).toBe(true);
    expect(await store.exists("QA_Person")).toBe(true);
    expect(users.get("QA_Person")).toMatchObject({...record,roomid:0,lastvisit:0});
    expect(calls.at(-2)?.sql).toContain("ON CONFLICT(username) DO NOTHING");
    const insert=calls.find(c=>c.sql.startsWith("INSERT"));
    expect(insert?.args).toHaveLength(6);
    expect(insert?.args[1]).toBe(record.password);
    expect(insert?.args[4]).not.toContain("password123"); // no plaintext secret
  });
  it("does not overwrite a duplicate player record",async()=>{
    const {db,users}=fakeD1(),store=new D1LegacyRegistrationStore(db);
    expect(await store.insert(fixture())).toBe(true);
    expect(await store.insert({...fixture(),gold:9999})).toBe(false);
    expect(users.get("QA_Person")?.gold).toBe(100);
  });
});
