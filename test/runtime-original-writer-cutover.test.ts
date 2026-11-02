import {afterAll,beforeAll,beforeEach,expect,it} from 'vitest';
import {PGlite} from '@electric-sql/pglite';
// @ts-expect-error test-only Node builtin
import {readFileSync} from 'node:fs';
const db=new PGlite(),id='00000000-0000-4000-8000-000000000001',digest='c'.repeat(64);
const response={status:200,headers:[],body:'original committed response'};
type Snapshot={revision:number;signature:string;tables:Record<string,Array<Record<string,unknown>>>;files:unknown;directories:unknown;counters:Record<string,number>};
const mode=async(name:string)=>(await db.query<{value:unknown}>('select public.dtr_original_set_mode($1) as value',[name])).rows[0]!.value;
const load=async()=>(await db.query<{value:Snapshot}>('select public.dtr_original_load() as value')).rows[0]!.value;
async function commit(snapshot:Snapshot,changes:unknown[],counters=snapshot.counters){
  return (await db.query<{value:{ok:boolean;conflict?:boolean}}>('select public.dtr_original_commit($1,$2,$3,$4,$5,$6,$7,$8,$9) as value',
    [id,digest,snapshot.revision,snapshot.signature,changes,snapshot.files,snapshot.directories,counters,response])).rows[0]!.value;
}
beforeAll(async()=>{
  await db.exec('create role anon;create role authenticated;create role service_role;');
  await db.exec(readFileSync('src/generated/legacy-schema.sql','utf8'));
  for(const name of ['20261102171000_original_full_request_transactions.sql','20261102183000_original_room_slots.sql','20261102190000_original_writer_cutover.sql'])await db.exec(readFileSync('supabase/migrations/'+name,'utf8'));
},30_000);
afterAll(async()=>db.close());
beforeEach(async()=>{
  // Disposable fixture owner only. Real cutovers use the guarded mode RPC.
  await db.exec("update dtr_runtime.original_control set enabled=false,writer_mode='legacy',revision=0,counters='{}',files='{}',directories='[]';truncate public.acbra2_users restart identity;truncate dtr_runtime.original_match_endings,dtr_runtime.original_request_receipts;insert into public.acbra2_users(username,gold)values('Alpha',10);");
});
it('installs without changing the active writer and requires a separate pause before either switch',async()=>{
  expect((await db.query('select enabled,writer_mode from dtr_runtime.original_control')).rows).toEqual([{enabled:false,writer_mode:'legacy'}]);
  await expect(mode('original')).rejects.toThrow('pause');
  expect((await db.query("insert into public.acbra2_users(username)values('Beta')returning uid")).rows).toEqual([{uid:2}]);
  expect((await db.query("select count(*)::int as n from pg_trigger where tgname='dtr_original_writer_guard'")).rows).toEqual([{n:100}]);
});
it('blocks all old insert, update, delete and truncate operations while paused',async()=>{
  await mode('paused');
  for(const sql of ["insert into public.acbra2_users(username)values('Beta')","update public.acbra2_users set gold=99","delete from public.acbra2_users","truncate public.acbra2_users"]){
    await expect(db.exec(sql)).rejects.toThrow('complete transaction boundary');
  }
  expect((await db.query('select gold from public.acbra2_users')).rows).toEqual([{gold:10}]);
});
it('allows complete canonical commits and restores the old-writer fence before returning',async()=>{
  await mode('paused');await mode('original');
  const snapshot=await load(),row={...snapshot.tables.acbra2_users![0],gold:130};
  expect((await commit(snapshot,[{operation:'upsert',table:'acbra2_users',key:{uid:1},row}])).ok).toBe(true);
  await expect(db.exec('update public.acbra2_users set gold=999')).rejects.toThrow('complete transaction boundary');
  expect((await db.query('select gold from public.acbra2_users')).rows).toEqual([{gold:130}]);
});
it('fences older security-definer RPCs as well as direct writes',async()=>{
  await db.exec("create or replace function public.dtr_qa_old_writer()returns void language sql security definer set search_path='' as $$update public.acbra2_users set gold=999$$;");
  await mode('paused');await mode('original');
  await expect(db.exec('select public.dtr_qa_old_writer()')).rejects.toThrow('complete transaction boundary');
});
it('restores the exact original allocator high-water mark on rollback and recollects later legacy identities',async()=>{
  await mode('paused');await mode('original');
  const snapshot=await load(),row={...snapshot.tables.acbra2_users![0],uid:5,username:'Beta'};
  await commit(snapshot,[{operation:'upsert',table:'acbra2_users',key:{uid:5},row}],{...snapshot.counters,acbra2_users:9});
  await expect(mode('legacy')).rejects.toThrow('pause');
  await mode('paused');await mode('legacy');
  expect((await db.query("insert into public.acbra2_users(username)values('Gamma')returning uid")).rows).toEqual([{uid:10}]);
  await mode('paused');await mode('original');expect((await load()).counters.acbra2_users).toBe(10);
});
it('does not grant cutover control to anonymous or authenticated requests',async()=>{
  expect((await db.query("select has_function_privilege('anon','public.dtr_original_set_mode(text)','execute') as allowed")).rows).toEqual([{allowed:false}]);
  expect((await db.query("select has_function_privilege('authenticated','public.dtr_original_set_mode(text)','execute') as allowed")).rows).toEqual([{allowed:false}]);
});
