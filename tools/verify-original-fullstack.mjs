// Real workerd + SQLite Wasm + DO storage + original SQL transaction functions.
// Entirely disposable PostgreSQL-compatible PGlite data; no production secrets.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {build} from 'esbuild';
import {Miniflare,Response,convertV4MiniflareOptions} from 'miniflare';
import {PGlite} from '@electric-sql/pglite';
import {legacyCookiePassword,legacyStoredPassword} from '../src/original-auth.ts';
import {legacyDecode} from '../src/original-protocol.ts';
import {verifyOriginalBrowserOpening} from './original-browser-qa.mjs';

const root=process.cwd(),db=new PGlite(),password='synthetic-local-only';
let mf;
const rpcFailures=[];
const cookies=new Map([['Alpha',new Map()],['Beta',new Map()]]);
const rpcArguments={
  dtr_original_load:[],
  dtr_original_commit:['p_request_id','p_request_digest','p_expected_revision','p_signature','p_changes','p_files','p_directories','p_counters','p_response'],
  dtr_original_reconcile:['p_request_id','p_request_digest','p_expected_revision']
};
async function postgrest(request){
  const url=new URL(request.url),name=url.pathname.slice('/rest/v1/rpc/'.length),argumentsList=rpcArguments[name];
  if(url.origin!=='https://synthetic-postgres.invalid'||!url.pathname.startsWith('/rest/v1/rpc/')||request.method!=='POST'||!argumentsList||request.headers.get('apikey')!=='synthetic-local-only')return new Response('Isolated RPC denied',{status:403});
  try{
    const args=await request.json(),values=argumentsList.map(key=>args[key]);
    const query='select public.'+name+'('+values.map((_,i)=>'$'+(i+1)).join(',')+') as value';
    const result=(await db.query(query,values)).rows[0].value;
    return Response.json(result);
  }catch(error){rpcFailures.push({name,message:error.message});console.error('QA database RPC:',name,error.message);return new Response('Isolated RPC failed',{status:500});}
}
async function assets(request){
  const publicRoot=resolve(root,'public'),path=resolve(publicRoot,'.'+decodeURIComponent(new URL(request.url).pathname));
  if(!path.startsWith(publicRoot+sep))return new Response('Not Found',{status:404});
  try{
    const bytes=await readFile(path),types={'.js':'application/javascript','.css':'text/css','.png':'image/png','.gif':'image/gif','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
    return new Response(request.method==='HEAD'?null:bytes,{headers:{'content-type':types[extname(path)]??'application/octet-stream'}});
  }catch{return new Response('Not Found',{status:404});}
}
async function request(user,path,post){
  const jar=cookies.get(user),headers={'cf-connecting-ip':user==='Alpha'?'192.0.2.10':'192.0.2.11'};
  if(jar.size)headers.cookie=[...jar].map(([k,v])=>k+'='+v).join('; ');
  if(post)headers['content-type']='application/x-www-form-urlencoded';
  const response=await mf.dispatchFetch('http://localhost'+path,{method:post?'POST':'GET',headers,...(post?{body:new URLSearchParams(post).toString()}:{}),redirect:'manual',signal:AbortSignal.timeout(120_000)});
  for(const cookie of response.headers.getSetCookie()){
    const first=cookie.split(';',1)[0],at=first.indexOf('=');jar.set(first.slice(0,at),first.slice(at+1));
  }
  return {response,body:await response.text()};
}
function pass(name){console.log('PASS '+name);}
try{
  await db.exec('create role anon;create role authenticated;create role service_role;');
  await db.exec(await readFile(resolve(root,'src/generated/legacy-schema.sql'),'utf8'));
  for(const file of ['20261102171000_original_full_request_transactions.sql','20261102183000_original_room_slots.sql','20261102190000_original_writer_cutover.sql'])await db.exec(await readFile(resolve(root,'supabase/migrations',file),'utf8'));
  await db.exec('insert into public.acbra2_game(groomid,groomstatus,gamenum,gamestate,starttime)values(0,40,1,0,0);');
  for(const name of cookies.keys())await db.query('insert into public.acbra2_users(username,password,groupid)values($1,$2,1)',[name,legacyStoredPassword(name,legacyCookiePassword(password))]);
  await db.exec("select public.dtr_original_set_mode('paused');select public.dtr_original_set_mode('original');");
  const bundle=await build({entryPoints:[resolve(root,'tools/original-fullstack-qa-worker.ts')],bundle:true,format:'esm',platform:'browser',target:'es2022',write:false,minify:true,
    plugins:[{name:'precompiled-original-sqlite',setup(build){build.onResolve({filter:/\.wasm$/},()=>({path:'./sqlite.wasm',external:true}));}}]});
  mf=new Miniflare(convertV4MiniflareOptions({cf:false,host:'127.0.0.1',port:0,workers:[{name:'original-fullstack-isolated',routes:['http://localhost/*'],compatibilityDate:'2026-10-28',
    modulesRoot:root,modules:[{type:'ESModule',path:resolve(root,'tools/qa-worker.mjs'),contents:bundle.outputFiles[0].text},{type:'CompiledWasm',path:resolve(root,'tools/sqlite.wasm'),contents:new Uint8Array(await readFile(resolve(root,'node_modules/sql.js/dist/sql-wasm-browser.wasm')))}],
    durableObjects:{ORIGINAL:{className:'OriginalGameActor',useSQLite:true}},
    bindings:{DTS_ORIGINAL_ENGINE:'enabled',SUPABASE_URL:'https://synthetic-postgres.invalid',SUPABASE_SECRET_KEY:'synthetic-local-only'},
    serviceBindings:{ASSETS:assets},outboundService:postgrest
  }]}));
  await mf.ready;
  if(process.argv.includes('--browser')){
    const result=await verifyOriginalBrowserOpening({mf,db,password});
    assert.deepEqual(rpcFailures,[]);
    console.log(JSON.stringify({ok:true,syntheticOnly:true,workerd:true,canonicalSql:true,...result}));
  }else{
  for(const name of cookies.keys()){
    const login=await request(name,'/login.php',{username:name,password});assert.equal(login.response.status,302,login.body);assert.equal(login.response.headers.get('location'),'index.php');
    assert(cookies.get(name).has('acbra2_pass'));
  }
  pass('two independent original logins through workerd, canonical commit and cookies');
  const created=await request('Alpha','/roomcmd.php?command=newroom&para1=0');assert.equal(created.response.status,302,created.body);
  assert.equal(cookies.get('Alpha').get('acbra2_roomid'),'1');
  const entered=await request('Beta','/roomcmd.php?command=enterroom&para1=1');assert.equal(entered.response.status,302,entered.body);
  await request('Beta','/roomcmd.php',{command:'pos_enter',para1:'1'});
  const lobby=await request('Alpha','/roomupdate.php',{timestamp:'0'}),state=await legacyDecode(lobby.body);
  assert(state.innerHTML.roommain.includes('Alpha')&&state.innerHTML.roommain.includes('Beta'));
  pass('original create/join/seat and complete two-player lobby HTML over actual DO transport');
  const poll=request('Alpha','/roomupdate.php',{timestamp:String(state.value.timestamp)});
  const chatted=await request('Beta','/roomcmd.php',{command:'newchat',para1:'isolated full-stack chat'});assert.equal(chatted.response.status,200,chatted.body);
  const changed=await Promise.race([poll,new Promise((_,reject)=>{const timer=setTimeout(()=>reject(new Error('DO room broadcast did not wake its subscriber')),10_000);timer.unref();})]);
  assert(JSON.stringify(await legacyDecode(changed.body)).includes('isolated full-stack chat'));
  pass('waiting player does not block the second account; canonical commit broadcasts original lobby updates');
  await request('Alpha','/roomcmd.php',{command:'ready'});
  await request('Beta','/roomcmd.php',{command:'ready'});
  const players=(await db.query('select name,hp from public.acbra2_s1_players where type=0 order by pid')).rows;
  assert.deepEqual(players.map(p=>p.name),['Alpha','Beta']);assert(players.every(p=>p.hp>0));
  for(const name of cookies.keys()){
    const game=await request(name,'/game.php');assert.equal(game.response.status,200,game.body);assert(game.body.includes('gamecmd')&&game.body.includes('ACFUN'));
  }
  pass('both accounts ready, initialize the original match and render original game pages');
  const outcomes=await Promise.all([request('Alpha','/command.php',{mode:'special',command:'pose5'}),request('Beta','/command.php',{mode:'special',command:'pose4'})]);
  assert(outcomes.every(r=>r.response.status===200));
  assert.deepEqual((await db.query('select name,pose from public.acbra2_s1_players where type=0 order by pid')).rows,[{name:'Alpha',pose:5},{name:'Beta',pose:4}]);
  pass('simultaneous original player commands serialize and persist independently');
  let completeMatch=false;
  if(process.argv.includes('--finish-match')){
    let pvpAttacks=0;
    for(let turn=0;turn<240;turn++){
      const participants=(await db.query('select pid,name,hp,pls,action from public.acbra2_s1_players where type=0 order by pid')).rows;
      const living=participants.filter(p=>p.hp>0);
      if(living.length<=1){
        await request(living[0]?.name??'Alpha','/command.php',{mode:'command',command:'menu'});break;
      }
      const player=participants[turn%2],enemy=participants[(turn+1)%2];
      let command;
      if(player.action==='enemy'+enemy.pid){command={mode:'combat',command:'attack'};pvpAttacks++;}
      else if(player.action){command={mode:'command',command:'menu'};}
      else if(player.pls!==enemy.pls){command={mode:'command',command:'move',moveto:String(enemy.pls)};}
      else command={mode:'command',command:'search'};
      const result=await request(player.name,'/command.php',command);
      assert.equal(result.response.status,200,result.body);
      if(turn%10===0)console.log('MATCH',JSON.stringify({turn,pvpAttacks,players:participants,command}));
      // Use real original command cooldowns. No database changes, stat
      // inflation or substituted battle outcomes are used after seeding.
      await new Promise(resolve=>setTimeout(resolve,750));
    }
    const ended=(await db.query('select gamestate from public.acbra2_game where groomid=1')).rows[0];
    assert.equal(ended.gamestate,0,'Original synthetic match did not finish within the QA turn limit.');
    // Original exploration can resolve an automatic attack without leaving
    // action=enemy<pid>. Its retained kill news is authoritative evidence.
    const combatNews=(await db.query("select news,a,b,c from public.acbra2_s1_newsinfo where news like 'death%' and a in ('Alpha','Beta') and c in ('Alpha','Beta') and a<>c")).rows;
    console.log('MATCH DEATH NEWS',JSON.stringify((await db.query("select news,a,b,c,d from public.acbra2_s1_newsinfo where news like 'death%' and a in ('Alpha','Beta')")).rows));
    assert(pvpAttacks>0||combatNews.length>0,'No actual player-vs-player encounter was exercised.');
    const history=(await db.query('select winner from public.acbra2_shistory order by gid desc limit 1')).rows[0];
    assert(['Alpha','Beta'].includes(history.winner));
    for(const name of cookies.keys()){
      const endedPage=await request(name,'/end.php');assert.equal(endedPage.response.status,200,endedPage.body);assert(endedPage.body.includes('ACFUN'));
    }
    const rewards=(await db.query('select username,gold,validgames,wingames from public.acbra2_users order by uid')).rows;
    console.log('MATCH COMPLETE',JSON.stringify({manualPvpAttacks:pvpAttacks,combatNews,winner:history.winner,rewards}));
    completeMatch=true;pass('original player encounters, lethal battle, canonical settlement and both original end pages');
    const beforeRepeat=JSON.stringify(rewards);
    await request('Alpha','/end.php');await request('Beta','/end.php');
    assert.equal(JSON.stringify((await db.query('select username,gold,validgames,wingames from public.acbra2_users order by uid')).rows),beforeRepeat);
    pass('reloading both settlement pages does not repeat original awards or victory counts');
    const oldGame=(await db.query('select gamenum from public.acbra2_game where groomid=1')).rows[0].gamenum;
    await request('Alpha','/roomcmd.php',{command:'leave'});await request('Beta','/roomcmd.php',{command:'leave'});await request('Alpha','/index.php');
    assert.equal((await db.query('select groomstatus from public.acbra2_game where groomid=1')).rows[0].groomstatus,0);
    const nextRoom=await request('Alpha','/roomcmd.php?command=newroom&para1=0');assert.equal(nextRoom.response.status,302,nextRoom.body);
    await request('Beta','/roomcmd.php?command=enterroom&para1=1');await request('Beta','/roomcmd.php',{command:'pos_enter',para1:'1'});
    await request('Alpha','/roomcmd.php',{command:'ready'});await request('Beta','/roomcmd.php',{command:'ready'});
    const nextGame=(await db.query('select gamenum,gamestate from public.acbra2_game where groomid=1')).rows[0];
    assert(nextGame.gamenum>oldGame&&nextGame.gamestate>=20);
    assert.equal((await db.query('select count(*)::int as n from public.acbra2_users')).rows[0].n,2);
    assert.deepEqual((await db.query('select name from public.acbra2_s1_players where type=0 order by pid')).rows.map(p=>p.name),['Alpha','Beta']);
    pass('original room recycling and next match retain the same accounts and advance the game number');
  }
  assert.deepEqual(rpcFailures,[],'Canonical SQL must not hide deterministic conversion failures behind command retries.');
  console.log(JSON.stringify({ok:true,syntheticOnly:true,workerd:true,canonicalSql:true,browser:false,completeMatch}));
  }
}finally{
  if(mf)await mf.dispose();await db.close();
}
