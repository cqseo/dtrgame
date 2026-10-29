// Run only on the authorized source host, using restricted QA credentials.
// Writes target empty QA room 12 and every transaction deliberately rolls back.
import fs from 'node:fs';import assert from 'node:assert/strict';import{createRequire}from'node:module';
import{SupabaseOriginalWorldStorage as World}from'../src/original-world-storage.ts';
import{OriginalPhpArray as A}from'../src/original-php-array.ts';
const args=Object.fromEntries(process.argv.slice(2).reduce((a,v,i,s)=>i%2?a:[...a,[v,s[i+1]]],[]));
const {Client}=createRequire(args['--pg-package'])('pg');
const raw=fs.readFileSync(args['--env-file'],'utf8').trim(),match=/^DTS_SUPABASE_PG_URL=(['"])([^\r\n]+)\1$/.exec(raw);if(!match)throw Error('CONFIG_FORMAT');
const url=new URL(match[2]);if(!((url.hostname==='db.qtjcjmpapjsgrrgtfica.supabase.co')||(url.hostname.endsWith('.pooler.supabase.com')&&url.username==='postgres.qtjcjmpapjsgrrgtfica')))throw Error('PROJECT_MISMATCH');
url.username='dts_runtime_qa_20261029'+(url.hostname.endsWith('.pooler.supabase.com')?'.qtjcjmpapjsgrrgtfica':'');url.password=fs.readFileSync(args['--qa-password'],'utf8').trim();url.search='';
const config={connectionString:url.href,ssl:{ca:fs.readFileSync(args['--ca-file'],'utf8'),rejectUnauthorized:true},connectionTimeoutMillis:10000};
const clients=[new Client(config),new Client(config)],rollback=Symbol('ROLLBACK_ONLY'),checks=[];
try{
 for(const c of clients){await c.connect();c.singleSession=true;assert(c.connection.stream.encrypted&&c.connection.stream.authorized);}
 const [db,other]=clients;
 assert.equal((await db.query('SELECT current_user AS u')).rows[0].u,'dts_runtime_qa_20261029');
 assert.equal((await db.query('SELECT count(*)::int AS n FROM acfun_runtime_qa_20261029.runtime_room_flags WHERE roomid=12 AND is_open')).rows[0].n,0);
 for(const table of ['players','mapitem','maptrap','shopitem'])assert.equal((await db.query('SELECT count(*)::int AS n FROM acfun_runtime_qa_20261029.s12_'+table)).rows[0].n,0);
 const counters=(await db.query('SELECT table_kind,next_id FROM acfun_runtime_qa_20261029.runtime_room_sequences WHERE roomid=12 ORDER BY table_kind')).rows;
 let escaped;
 try{await World.transaction(db,12,async store=>{
  escaped=store;await store.resetPlayers();await store.reset('mapitem');await store.reset('maptrap');await store.resetShop();
  await store.insertNpc(new A([['type',14],['name','QA_Owner'],['hp',100],['mhp',100],['nskill','ab'],['nskillpara','']]));
  assert.equal(await store.npcOwner('qa_owner'),1);
  const items=Array.from({length:415},(_,i)=>({itm:'QA_ITEM_'+i,itmk:'HH',itme:'100',itms:i%2?'∞':'3',itmsk:'中文,^data,',pls:1}));
  await store.insertItems(items);await store.insertTraps([{itm:'QA_TRAP',itmk:'TN',itme:50,itms:1,itmsk:'1',pls:2}]);
  await store.insertShop([{kind:1,num:2,price:30,area:0,item:'QA_SHOP',itmk:'HS',itme:10,itms:1,itmsk:''}]);
  const itemRows=(await db.query('SELECT iid,itms,itmsk FROM acfun_runtime_qa_20261029.s12_mapitem ORDER BY iid')).rows;assert.equal(itemRows.length,415);assert.equal(itemRows[414].iid,415);assert.equal(itemRows[1].itms,'∞');assert.equal(itemRows[0].itmsk,'中文,^data,');
  assert.equal((await other.query('SELECT count(*)::int AS n FROM acfun_runtime_qa_20261029.s12_players')).rows[0].n,0);
  checks.push('NPC/map/trap/shop writes and 415-row batching visible only inside transaction');throw rollback;
 });}catch(e){if(e!==rollback)throw e;}
 await assert.rejects(()=>escaped.insertItems([{itm:'BAD',itmk:'Z',itme:1,itms:1,itmsk:'',pls:0}]),/ended/);
 assert.deepEqual((await db.query('SELECT table_kind,next_id FROM acfun_runtime_qa_20261029.runtime_room_sequences WHERE roomid=12 ORDER BY table_kind')).rows,counters);
 checks.push('rolled-back explicit IDs and stale storage capability rejection');
 // Constraint failure after NPC save must unwind both rows and identity counters.
 await assert.rejects(()=>World.transaction(db,12,async store=>{
  await store.insertNpc(new A([['type',1],['name','QA_BEFORE_FAIL'],['hp',5]]));
  await store.insertItems([{itm:'QA_BAD_RANGE',itmk:'Z',itme:1,itms:1,itmsk:'',pls:999999}]);
 }),e=>e.code==='22003');
 assert.equal((await db.query('SELECT count(*)::int AS n FROM acfun_runtime_qa_20261029.s12_players')).rows[0].n,0);
 assert.deepEqual((await db.query('SELECT table_kind,next_id FROM acfun_runtime_qa_20261029.runtime_room_sequences WHERE roomid=12 ORDER BY table_kind')).rows,counters);
 checks.push('actual PostgreSQL range failure rolls back prior NPC and all counters');
 let release;const gate=new Promise(r=>release=r);let entered;const ready=new Promise(r=>entered=r);let secondRan=false;
 const first=World.transaction(db,12,async()=>{entered();await gate;throw rollback;}).catch(e=>{if(e!==rollback)throw e;});await ready;
 const second=World.transaction(other,12,async()=>{secondRan=true;throw rollback;}).catch(e=>{if(e!==rollback)throw e;});
 await new Promise(r=>setTimeout(r,200));assert.equal(secondRan,false);release();await Promise.all([first,second]);assert(secondRan);
 checks.push('separate PG sessions serialize on the game initialization lock');
 for(const table of ['players','mapitem','maptrap','shopitem'])assert.equal((await db.query('SELECT count(*)::int AS n FROM acfun_runtime_qa_20261029.s12_'+table)).rows[0].n,0);
 console.log(JSON.stringify({pass:true,checks,gamePlayable:false,scope:'real isolated PostgreSQL storage, synthetic rows, rollback only'}));
}finally{await Promise.all(clients.map(c=>c.end().catch(()=>{})));}
