import {afterAll,beforeAll,beforeEach,describe,expect,it} from 'vitest';
import {PGlite} from '@electric-sql/pglite';
// @ts-expect-error test-only Node builtin
import {readFileSync} from 'node:fs';
import initSqlJs from 'sql.js/dist/sql-wasm-browser.js';
import {SqliteLegacyDatabase} from '../src/legacy/php/sqlite-database';
import {LEGACY_SQLITE_SHADOW_SCHEMA} from '../src/generated/legacy-sqlite-shadow-schema';
import {createLegacyPlayerRecord} from '../src/generated/legacy-registry';
import {legacyCookiePassword,legacyStoredPassword} from '../src/original-auth';
import {legacyDecode} from '../src/original-protocol';
import {executeOriginalCommand,OriginalCommitUncertain,type OriginalRequestStore,type OriginalCommitReply,type OriginalSnapshot,type OriginalPendingRequest} from '../src/runtime/original-request-transaction';
const db=new PGlite();let SQL:Awaited<ReturnType<typeof initSqlJs>>;
const now=1793580000,pass=legacyCookiePassword('synthetic-only'),id='00000000-0000-4000-8000-000000000001',digest='b'.repeat(64);
const baseStore:OriginalRequestStore={
  load:async()=>(await db.query<{value:OriginalSnapshot}>('select public.dtr_original_load() as value')).rows[0]!.value,
  commit:async p=>(await db.query<{value:OriginalCommitReply}>('select public.dtr_original_commit($1,$2,$3,$4,$5,$6,$7,$8,$9) as value',[p.requestId,p.requestDigest,p.expectedRevision,p.signature,p.changes,p.files,p.directories,p.counters,p.response])).rows[0]!.value,
  reconcile:async p=>(await db.query<{value:OriginalCommitReply}>('select public.dtr_original_reconcile($1,$2,$3) as value',[p.requestId,p.requestDigest,p.expectedRevision])).rows[0]!.value
};
let pending:OriginalPendingRequest|undefined;
function run(store=baseStore,post:readonly(readonly[string,string])[]=[['mode','command'],['command','menu']]){
  return executeOriginalCommand({store,requestId:id,requestDigest:digest,roomId:0,now,page:'command_act',
    request:{method:'POST',uri:'/command.php',post,cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass]]},
    createShadow:async(tables,counters)=>new SqliteLegacyDatabase(new SQL.Database(),tables,counters),
    beforeCommit:async p=>{pending=p;},afterResolved:async()=>{pending=undefined;}});
}
describe('original command through complete PostgreSQL commit boundary',()=>{
  beforeAll(async()=>{
    SQL=await initSqlJs({wasmBinary:readFileSync('node_modules/sql.js/dist/sql-wasm-browser.wasm')});
    await db.exec('create role anon;create role authenticated;create role service_role;');
    await db.exec(readFileSync('src/generated/legacy-schema.sql','utf8'));
    await db.exec(readFileSync('supabase/migrations/20261102171000_original_full_request_transactions.sql','utf8'));
  },30_000);
  afterAll(async()=>{await db.close();});
  beforeEach(async()=>{
    pending=undefined;
    await db.exec('truncate '+Object.keys(LEGACY_SQLITE_SHADOW_SCHEMA).map(n=>'public."'+n+'"').join(',')+' restart identity cascade;truncate dtr_runtime.original_match_endings,dtr_runtime.original_request_receipts;');
    await db.exec(`update dtr_runtime.original_control set enabled=true,revision=0,files='{}',directories='[]',counters='{}';`);
    for(const [i,name]of ['Alpha','Beta'].entries()){
      const password=legacyStoredPassword(name,pass);
      await db.query('insert into public.acbra2_users(uid,username,password,groupid) values($1,$2,$3,1)',[i+1,name,password]);
      const player=Object.assign(createLegacyPlayerRecord(),{pid:i+1,name,pass:password,hp:400,mhp:400,sp:400,msp:400,pls:1,pose:3,tactic:2,endtime:now-10,validtime:now-100});
      const columns=Object.keys(player),values=Object.values(player);
      await db.query('insert into public.acbra2_players('+columns.map(c=>'"'+c+'"').join(',')+') values('+columns.map((_,n)=>'$'+(n+1)).join(',')+')',values);
    }
    await db.query('insert into public.acbra2_game(groomid,groomstatus,gamenum,gamestate,gametype,starttime,areatime,arealist,validnum,alivenum) values(0,40,7,30,0,$1,$2,$3,2,2)',[now-100,now,Array.from({length:35},(_,i)=>i).join(',')]);
  });
  it('runs an original tick and stance action, then persists rows, replay and response together',async()=>{
    const response=await run(baseStore,[['mode','special'],['command','pose5']]);
    expect((await legacyDecode<Record<string,unknown>>(response.body)).innerHTML).toBeDefined();
    const snapshot=await baseStore.load();
    expect(snapshot.tables.acbra2_players![0]!.pose).toBe(5);
    // pose.act() returns before the original apm.act() hook is reached.
    expect(snapshot.tables.acbra2_players![0]!.a_actionnum).toBe(0);
    expect(snapshot.files['gamedata/tmp/replay/_/1/replay.php']?.content).toContain('response/0_/');
    expect((await db.query('select count(*)::int as n from dtr_runtime.original_request_receipts')).rows).toEqual([{n:1}]);
    expect(pending).toBeUndefined();
  });
  it('recovers a committed action whose HTTP acknowledgement was lost',async()=>{
    const store:OriginalRequestStore={...baseStore,commit:async p=>{await baseStore.commit(p);throw new Error('synthetic lost acknowledgement');}};
    const response=await run(store);
    expect(response.status).toBe(200);
    expect((await baseStore.load()).tables.acbra2_players![0]!.a_actionnum).toBe(1);
    expect((await db.query('select count(*)::int as n from dtr_runtime.original_request_receipts')).rows).toEqual([{n:1}]);
    expect(pending).toBeUndefined();
  });
  it('recomputes from canonical state after a conflict without overwriting the competing profile',async()=>{
    let first=true;
    const store:OriginalRequestStore={...baseStore,commit:async p=>{
      if(first){first=false;await db.exec("update public.acbra2_users set motto='concurrent original profile' where username='Alpha'");return {ok:false,conflict:true,revision:p.expectedRevision};}
      return baseStore.commit(p);
    }};
    await run(store);
    const snapshot=await baseStore.load();
    expect(snapshot.tables.acbra2_users![0]!.motto).toBe('concurrent original profile');
    expect(snapshot.tables.acbra2_players![0]!.motto).toBe('concurrent original profile');
    expect(snapshot.tables.acbra2_players![0]!.a_actionnum).toBe(1);
  });
  it('retains pending recovery state and releases no response if commit and recovery both fail',async()=>{
    const store:OriginalRequestStore={...baseStore,commit:async()=>{throw new Error('synthetic network failure');},reconcile:async()=>{throw new Error('synthetic recovery outage');}};
    await expect(run(store)).rejects.toBeInstanceOf(OriginalCommitUncertain);
    expect(pending).toEqual({requestId:id,requestDigest:digest,expectedRevision:0});
    expect((await baseStore.load()).tables.acbra2_players![0]!.a_actionnum).toBe(0);
    expect((await db.query('select * from dtr_runtime.original_request_receipts')).rows).toEqual([]);
  });
});
