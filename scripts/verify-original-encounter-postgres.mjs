/** Bundle with esbuild --platform=node --format=esm --packages=external.
 * Credentials remain on the source host. Synthetic writes ALWAYS roll back.
 * node pg is resolved from --pg-package, never bundled into a public worker. */
import fs from 'node:fs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {originalWithRoomTransaction} from '../src/original-room-transaction.ts';
import {SupabaseOriginalEncounterStore,decodeOriginalEncounterRow} from '../src/original-supabase-encounter.ts';
import {originalDiscoverPlayer} from '../src/original-player-discovery.ts';
import {originalEnemyAct} from '../src/original-enemy-command.ts';
import {OriginalBattleFlow} from '../src/original-battle-flow.ts';
const args=Object.fromEntries(process.argv.slice(2).reduce((a,v,i,list)=>i%2?a:[...a,[v,list[i+1]]],[]));
async function main(){
  const {Client}=createRequire(args['--pg-package'])('pg');
  const raw=fs.readFileSync(args['--env-file'],'utf8').trim();
  const match=/^DTS_SUPABASE_PG_URL=(['"])([^\r\n]+)\1$/.exec(raw);
  if(!match)throw new Error('CONFIG_FORMAT');
  const url=new URL(match[2]);
  if(!(url.hostname==='db.qtjcjmpapjsgrrgtfica.supabase.co'||
    url.hostname.endsWith('.pooler.supabase.com')&&url.username==='postgres.qtjcjmpapjsgrrgtfica')||url.pathname!=='/postgres')throw new Error('PROJECT_MISMATCH');
  // pg URI ssl parameters can replace the explicit TLS config; refuse them.
  if([...url.searchParams.keys()].some(k=>k.startsWith('ssl')))throw new Error('URI_TLS_OVERRIDE');
  const config={connectionString:url.href,ssl:{ca:fs.readFileSync(args['--ca-file'],'utf8'),rejectUnauthorized:true},connectionTimeoutMillis:10000};
  const clients=[new Client(config),new Client(config),new Client(config)];
  const checks=[];
  try{
    for(const c of clients){await c.connect();assert(c.connection.stream.encrypted&&c.connection.stream.authorized);c.singleSession=true;}
    checks.push('verified TLS on three independent sessions');
    const [holder,blocked,other]=clients;
    await holder.query('BEGIN');
    await holder.query('SELECT pg_advisory_xact_lock($1,$2)',[20261029,8]);
    let callbackRan=false,timeoutCode='';
    try{await originalWithRoomTransaction(blocked,{purpose:'qa-only',roomId:8,lockTimeoutMs:150},async()=>{callbackRan=true;});}
    catch(e){timeoutCode=e.code;}
    assert.equal(callbackRan,false);assert.equal(timeoutCode,'55P03');
    checks.push('contended room times out before running gameplay');
    await originalWithRoomTransaction(other,{purpose:'qa-only',roomId:6,lockTimeoutMs:150},async()=>{});
    checks.push('different room remains available');
    await holder.query('ROLLBACK');
    await originalWithRoomTransaction(blocked,{purpose:'qa-only',roomId:8,lockTimeoutMs:150},async()=>{});
    checks.push('timed-out connection is usable after rollback');
    const markerIds=[1600001,1600002];
    assert.equal((await holder.query('SELECT pid FROM acfun_legacy.s8_players WHERE pid=ANY($1::integer[])',[markerIds])).rows.length,0);
    const rollback=Symbol('rollback-only');
    let initialHp,found=false,rendered=false;
    try{await originalWithRoomTransaction(holder,{purpose:'qa-only',roomId:8},async db=>{
      // No historic accounts touched; explicit IDs avoid consuming sequences.
      const columns=(await db.query("SELECT column_name,data_type FROM information_schema.columns WHERE table_schema='acfun_legacy' AND table_name='s8_players' ORDER BY ordinal_position",[])).rows;
      assert.equal(columns.length,124);
      for(const [i,pid] of markerIds.entries()){
        const row={};
        for(const col of columns){
          assert.match(col.column_name,/^[a-zA-Z_][a-zA-Z0-9_]*$/);
          if(['smallint','integer','bigint','numeric','real','double precision'].includes(col.data_type))row[col.column_name]=0;
          else if(['text','character varying','character'].includes(col.data_type))row[col.column_name]='';
          else throw new Error('UNEXPECTED_SOURCE_COLUMN_TYPE');
        }
        Object.assign(row,{pid,name:i?'QA_encounter_B':'QA_encounter_A',type:0,hp:100,mhp:100,pls:255,action:''});
        const keys=Object.keys(row);
        await db.query('INSERT INTO acfun_legacy.s8_players('+keys.map(k=>'"'+k+'"').join(',')+') VALUES('+keys.map((_,i)=>'$'+(i+1)).join(',')+')',Object.values(row));
      }
      const store=new SupabaseOriginalEncounterStore(db,8,'qa-only');
      const fetchPlayer=async id=>{
        const r=await db.query('SELECT * FROM acfun_legacy.s8_players WHERE pid=$1',[Number(id)]);
        assert.equal(r.rows.length,1);return {...decodeOriginalEncounterRow(r.rows[0]),battlelog:''};
      };
      const save=async p=>{await db.query('UPDATE acfun_legacy.s8_players SET hp=$1,state=$2,action=$3,bid=$4 WHERE pid=$5',[p.hp,p.state,p.action,p.bid,p.pid]);};
      const player=await fetchPlayer(markerIds[0]);initialHp=player.hp;
      const ctx={log:'',originalEnemy:null,enemy:null,battleTitle:'',main:'',cmd:''};
      const flow=new OriginalBattleFlow(ctx,{
        loadUserCommand:()=>{},loadAutoCommand:()=>{},strikePrepare:()=>{},
        // Synthetic strike is explicit: this is persistence integration, NOT
        // proof of the complete weapon/skill damage implementation.
        strike:a=>{a.dmg_dealt=10;},strikeFinish:()=>{},damage:(a,d)=>{d.hp-=a.dmg_dealt;},postDamage:()=>{},
        kill:()=>{throw new Error('UNEXPECTED_KILL');},canCounter:()=>true,savePlayer:save,
        loadCurrent:()=>{},loadEnemy:()=>{},saveEnemyLog:()=>{},addChat:()=>{},initBattle:()=>{},
        renderResult:()=>{rendered=true;return 'SYNTHETIC_RESULT';},findCorpse:()=>{throw new Error('UNEXPECTED_CORPSE');},renderNpcSkills:()=>{},
        meetmanTemplate:'synthetic',message:'',clubbaseEnabled:false,
      });
      const state={pid:player.pid,pls:255,mode:'command',log:'',hideflag:false};
      const r=await originalDiscoverPlayer(state,{
        listCandidates:async(place,id)=>(await store.listCandidates(place,id)).filter(p=>p.pid===markerIds[1]),
        fetchPlayer,savePlayer:save,updateSdata:()=>{},shuffle:p=>[...p],random99:()=>0,
        meetAlternative:enemy=>{player.action='enemy'+enemy.pid;},
      });
      found=r.found;assert(found);
      await originalEnemyAct({player,mode:'combat',command:'WK',log:''},{
        exists:async id=>id===String(markerIds[1]),fetchPlayer,updateSdata:()=>{},battle:(a,d,active)=>flow.run(a,d,active),
        checkCorpse:()=>false,findCorpse:()=>{},placeName:()=>'',next:()=>{throw new Error('UNEXPECTED_FALLTHROUGH');},
      });
      const rows=(await db.query('SELECT hp FROM acfun_legacy.s8_players WHERE pid=ANY($1::integer[]) ORDER BY pid',[markerIds])).rows;
      assert.deepEqual(rows.map(p=>Number(p.hp)),[90,90]);assert(rendered);
      const rate=await store.meetRate('search',255,player.pid);assert(rate>=23&&rate<=50);
      throw rollback;
    });}catch(e){if(e!==rollback)throw e;}
    assert.equal((await holder.query('SELECT pid FROM acfun_legacy.s8_players WHERE pid=ANY($1::integer[])',[markerIds])).rows.length,0);
    checks.push('discover -> enemy command -> attack/counter -> both SQL saves');
    checks.push('all synthetic player inserts and combat updates rolled back');
    console.log(JSON.stringify({pass:true,playable:false,syntheticStrike:true,checks,initialHp,found,rendered},null,2));
  }finally{
    for(const c of clients){try{await c.query('ROLLBACK');}catch{}try{await c.end();}catch{}}
  }
}
main().catch(e=>{console.error(JSON.stringify({pass:false,errorCode:String(e.code??e.name??'UNKNOWN')}));process.exitCode=1;});
