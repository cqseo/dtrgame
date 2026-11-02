import {afterAll,beforeAll,beforeEach,describe,expect,it} from 'vitest';
import {PGlite} from '@electric-sql/pglite';
// @ts-expect-error test-only Node builtin
import {readFileSync} from 'node:fs';
import {LEGACY_SQLITE_SHADOW_SCHEMA} from '../src/generated/legacy-sqlite-shadow-schema';
const db=new PGlite();
type Row=Record<string,unknown>;
interface Snapshot {revision:number;signature:string;tables:Record<string,Row[]>;files:Record<string,unknown>;directories:string[];counters:Record<string,number>}
const id='00000000-0000-4000-8000-000000000001',digest='a'.repeat(64);
const response={status:200,body:'original encoded response',headers:[['content-type','text/plain; charset=utf-8']]};
async function load(){return (await db.query<{value:Snapshot}>('select public.dtr_original_load() as value')).rows[0]!.value;}
async function commit(snapshot:Snapshot,changes:unknown[],overrides:Row={}){
  const p={id,digest,revision:snapshot.revision,signature:snapshot.signature,changes,files:snapshot.files,directories:snapshot.directories,counters:snapshot.counters,response,...overrides};
  return (await db.query<{value:{ok:boolean;conflict?:boolean;revision:number;response?:typeof response;replayed?:boolean}}>(
    'select public.dtr_original_commit($1::uuid,$2,$3,$4,$5,$6,$7,$8,$9) as value',
    [p.id,p.digest,p.revision,p.signature,p.changes,p.files,p.directories,p.counters,p.response])).rows[0]!.value;
}
function account(snapshot:Snapshot,gold:number){const row:Row={...snapshot.tables.acbra2_users![0]!,gold};return {operation:'upsert',table:'acbra2_users',key:{uid:row.uid},row};}
describe('complete original request transactions in disposable PostgreSQL',()=>{
  beforeAll(async()=>{
    await db.exec('create role anon;create role authenticated;create role service_role;');
    await db.exec(readFileSync('src/generated/legacy-schema.sql','utf8'));
    await db.exec(readFileSync('supabase/migrations/20261102171000_original_full_request_transactions.sql','utf8'));
    await db.exec(readFileSync('supabase/migrations/20261102183000_original_room_slots.sql','utf8'));
    expect((await db.query('select enabled from dtr_runtime.original_control')).rows).toEqual([{enabled:false}]);
    await expect(load()).rejects.toThrow('disabled');
  },30_000);
  afterAll(async()=>{await db.close();});
  beforeEach(async()=>{
    await db.exec('truncate '+Object.keys(LEGACY_SQLITE_SHADOW_SCHEMA).map(n=>'public."'+n+'"').join(',')+' restart identity cascade;truncate dtr_runtime.original_match_endings,dtr_runtime.original_request_receipts;');
    await db.exec(`update dtr_runtime.original_control set enabled=true,revision=0,files='{}',directories='[]',counters='{}';
      insert into public.acbra2_users(username,gold) values('Alpha',10),('Beta',20);
      insert into public.acbra2_game(groomid,gamenum,starttime,gamestate) values(0,7,100,30);`);
  });
  it('loads every original table consistently, including all 124 player fields',async()=>{
    const snapshot=await load();
    expect(Object.keys(snapshot.tables)).toHaveLength(100);
    expect(snapshot.tables.acbra2_users).toHaveLength(2);
    expect(snapshot.counters.acbra2_users).toBe(2);
    expect(snapshot.signature).toMatch(/^[a-f0-9]{32}$/);
  });
  it('atomically commits canonical rows, original state files, exact counters and response receipt',async()=>{
    const snapshot=await load();
    const result=await commit(snapshot,[account(snapshot,130)],{files:{'gamedata/replays/7.dat':{content:'archive',mtime:200}},directories:['gamedata/replays']});
    expect(result).toEqual({ok:true,revision:1,response,replayed:false});
    const next=await load();
    expect(next.tables.acbra2_users![0]!.gold).toBe(130);
    expect(next.files).toEqual({'gamedata/replays/7.dat':{content:'archive',mtime:200}});
    expect(next.directories).toEqual(['gamedata/replays']);
  });
  it('replays an uncertain successful commit without another award',async()=>{
    const snapshot=await load();await commit(snapshot,[account(snapshot,130)]);
    expect(await commit(snapshot,[account(snapshot,130)])).toEqual({ok:true,revision:1,response,replayed:true});
    expect((await load()).tables.acbra2_users![0]!.gold).toBe(130);
    await expect(commit(snapshot,[],{digest:'b'.repeat(64)})).rejects.toThrow('identity mismatch');
  });
  it('rejects a competing stale request and never overwrites its account update',async()=>{
    const snapshot=await load();await commit(snapshot,[account(snapshot,130)]);
    expect(await commit(snapshot,[account(snapshot,999)],{id:'00000000-0000-4000-8000-000000000002'})).toMatchObject({ok:false,conflict:true,revision:1});
    expect((await load()).tables.acbra2_users![0]!.gold).toBe(130);
  });
  it('detects changes made outside the new revision path through its full input signature',async()=>{
    const snapshot=await load();await db.exec("update public.acbra2_users set motto='changed elsewhere' where username='Beta'");
    expect(await commit(snapshot,[account(snapshot,999)])).toMatchObject({ok:false,conflict:true});
    expect((await load()).tables.acbra2_users![0]!.gold).toBe(10);
  });
  it('rolls back prior account changes, files and receipt when a later mutation fails',async()=>{
    const snapshot=await load();
    await expect(commit(snapshot,[account(snapshot,130),{operation:'upsert',table:'acbra2_users',key:{uid:2},row:{uid:2,gold:999}}])).rejects.toThrow('captured schema');
    const next=await load();expect(next).toEqual(snapshot);
    expect((await db.query('select * from dtr_runtime.original_request_receipts')).rows).toEqual([]);
  });
  it('fences a delayed RPC when recovery found no receipt',async()=>{
    const snapshot=await load();
    const recovery=(await db.query<{value:unknown}>('select public.dtr_original_reconcile($1,$2,$3) as value',[id,digest,0])).rows[0]!.value;
    expect(recovery).toEqual({ok:false,conflict:true,revision:1});
    expect(await commit(snapshot,[account(snapshot,130)])).toMatchObject({ok:false,conflict:true});
    expect((await load()).tables.acbra2_users![0]!.gold).toBe(10);
  });
  it('keeps exact identity state across a table reset and restores it on rollback',async()=>{
    await db.exec("insert into public.acbra2_chat(msg) values('old')");
    const snapshot=await load(),counters={...snapshot.counters,acbra2_chat:0};
    await commit(snapshot,[{operation:'delete',table:'acbra2_chat',key:{cid:1}}],{counters});
    expect((await load()).counters.acbra2_chat).toBe(0);
    const next=await load();await expect(commit(next,[account(next,130)],{id:'00000000-0000-4000-8000-000000000003',counters:{...next.counters,acbra2_users:1}})).rejects.toThrow('behind rows');
    expect((await load()).tables.acbra2_users![0]!.gold).toBe(10);
  });
  it.each(['../private','gamedata/tmp/../../config.php','config.php'])('rejects writes outside original mutable game files: %s',async path=>{
    const snapshot=await load();await expect(commit(snapshot,[account(snapshot,130)],{files:{[path]:{content:'x',mtime:200}}})).rejects.toThrow('state file');
    expect(await load()).toEqual(snapshot);
  });
  it('restricts all entry points and receipt tables to the service boundary',async()=>{
    expect((await db.query("select has_function_privilege('anon','public.dtr_original_load()','execute') as allowed")).rows).toEqual([{allowed:false}]);
    expect((await db.query("select has_table_privilege('authenticated','dtr_runtime.original_request_receipts','select') as allowed")).rows).toEqual([{allowed:false}]);
    expect((await db.query("select has_function_privilege('service_role','public.dtr_original_load()','execute') as allowed")).rows).toEqual([{allowed:true}]);
  });
});
