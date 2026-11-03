import {beforeAll,expect,it} from 'vitest';
// @ts-expect-error test-only Node builtin
import {readFileSync} from 'node:fs';
import initSqlJs from 'sql.js/dist/sql-wasm-browser.js';
import {SqliteLegacyDatabase} from '../src/legacy/php/sqlite-database';
import {legacyRowFromJson} from '../src/legacy/php/database';
import {LegacyVirtualFilesystem} from '../src/legacy/php/virtual-filesystem';
import {LEGACY_SQLITE_SHADOW_SCHEMA} from '../src/generated/legacy-sqlite-shadow-schema';
import {LEGACY_PUBLIC_STATIC_FILES} from '../src/generated/legacy-public-static-files';
import {createOriginalPublicPageEngine,ORIGINAL_TRANSACTIONAL_PUBLIC_PAGES} from '../src/runtime/original-public-page-engine';
import {originalRuntimeFiles} from '../src/runtime/original-game-engine';
import {legacyCookiePassword,legacyStoredPassword} from '../src/original-auth';
import {legacyDecode,legacyEncode} from '../src/original-protocol';
import {PhpArray} from '../src/legacy/template/values';
let SQL:Awaited<ReturnType<typeof initSqlJs>>;
beforeAll(async()=>{SQL=await initSqlJs({wasmBinary:readFileSync('node_modules/sql.js/dist/sql-wasm-browser.wasm')});});
const now=1793580000,pass=legacyCookiePassword('test-only');
function fixture(){
  const db=new SqliteLegacyDatabase(new SQL.Database(),{...Object.fromEntries(Object.keys(LEGACY_SQLITE_SHADOW_SCHEMA).map(n=>[n,[]])),
    acbra2_game:[legacyRowFromJson({groomid:0,groomstatus:40,gamestate:0,starttime:0})],
    acbra2_users:[legacyRowFromJson({uid:1,username:'Alpha',password:legacyStoredPassword('Alpha',pass),groupid:1})]
  });
  let fs=new LegacyVirtualFilesystem(originalRuntimeFiles(),{},now,{readonlyPaths:LEGACY_PUBLIC_STATIC_FILES});
  const run=(page:string,post:Array<[string,string]>=[],cookies:Array<[string,string]>=[])=>{
    fs=new LegacyVirtualFilesystem(originalRuntimeFiles(),fs.snapshot(),now,{directories:fs.directories,readonlyPaths:LEGACY_PUBLIC_STATIC_FILES});
    const engine=createOriginalPublicPageEngine({database:db,filesystem:fs,now});
    try{return {body:engine.run(page,{method:post.length?'POST':'GET',post,cookies,remoteAddress:'192.0.2.25'}),...engine};}
    catch(error){console.error({error,frames:(error as Error&{legacyFrames?:string[]}).legacyFrames,queries:db.issued.slice(-4)});throw error;}
  };
  return {db,run};
}
it.each([...ORIGINAL_TRANSACTIONAL_PUBLIC_PAGES])('executes original public GET %s with and without original account cookies',page=>{
  const {db,run}=fixture();
  try{
    for(const cookies of [[],[['acbra2_user','Alpha'],['acbra2_pass',pass]]] as Array<Array<[string,string]>>){
      const response=run(page,[],cookies);expect(typeof response.body).toBe('string');expect(response.response.status).toBe(page==='/error.php'?500:page==='/replay.php'?302:200);
    }
  }finally{db.close();}
});
it('matches the actual original PHP fatal response bytes for direct error.php',()=>{
  const {db,run}=fixture();
  try{
    const result=run('/error.php');expect(result.response.status).toBe(500);
    expect(result.body).toBe(readFileSync('test/fixtures/golden/original-error-fatal.html','utf8'));
  }finally{db.close();}
});
it('executes original profile edits and password changes without replacing card ownership or balances',async()=>{
  const {db,run}=fixture();
  try{
    db.array_update('acbra2_users',legacyRowFromJson({gold:100,card_data:await legacyEncode([{cardid:0,cardenergy:0}])}),"uid='1'");
    const original=db.rows('acbra2_users')[0]!;
    const result=run('/user.php',[['mode','edit'],['motto','original <&> profile'],['gender','f'],['icon','2'],['card','0'],['opass','test-only'],['npass','changed-pass'],['rnpass','changed-pass'],['skip_opening','1']],[['acbra2_user','Alpha'],['acbra2_pass',pass]]);
    const payload=await legacyDecode<Record<string,any>>(result.body);expect(payload.innerHTML.info).toBeTruthy();
    const account=db.rows('acbra2_users')[0]!;expect(account.get('motto')).toBe('original &lt;&amp;&gt; profile');
    expect(account.get('password')).toBe(legacyStoredPassword('Alpha',legacyCookiePassword('changed-pass')));
    expect(account.get('gold')).toBe(original.get('gold'));expect(account.get('card_data')).toBe(original.get('card_data'));
    expect(await legacyDecode(String(account.get('u_settings')))).toMatchObject({skip_opening:1});
    expect(result.response.headers.getSetCookie()).toHaveLength(1);
  }finally{db.close();}
});
it('claims an original mail attachment once, archives it, and charges the original recovery cost',()=>{
  const {db,run}=fixture(),cookies:Array<[string,string]>=[['acbra2_user','Alpha'],['acbra2_pass',pass]];
  try{
    db.array_update('acbra2_users',legacyRowFromJson({gold:200}),"uid='1'");
    db.array_insert('acbra2_messages',legacyRowFromJson({receiver:'Alpha',sender:'sys',title:'original attachment',content:'synthetic message',enclosure:'getqiegao_50',timestamp:now}));
    run('/messages.php',[['mode','check'],['sl1','1']],cookies);
    expect(db.rows('acbra2_users')[0]?.get('gold')).toBe('250');expect(db.rows('acbra2_messages')[0]?.get('checked')).toBe('1');
    run('/messages.php',[['mode','check'],['sl1','1']],cookies);expect(db.rows('acbra2_users')[0]?.get('gold')).toBe('250');
    run('/messages.php',[['mode','del'],['sl1','1']],cookies);
    expect(db.rows('acbra2_messages')).toHaveLength(0);expect(db.rows('acbra2_del_messages')).toHaveLength(1);
    const archived=db.rows('acbra2_del_messages')[0]!;
    run('/messages.php',[['mode','recover'],['sl'+archived.get('mid'),'1']],cookies);
    expect(db.rows('acbra2_users')[0]?.get('gold')).toBe('150');expect(db.rows('acbra2_del_messages')).toHaveLength(0);
    expect(db.rows('acbra2_messages')[0]?.get('checked')).toBe('1');
  }finally{db.close();}
});
it('draws from the unchanged original card pool and debits the original single-draw price',async()=>{
  const {db,run}=fixture(),cookies:Array<[string,string]>=[['acbra2_user','Alpha'],['acbra2_pass',pass]];
  try{
    db.array_update('acbra2_users',legacyRowFromJson({gold:100,card_data:await legacyEncode([{cardid:0,cardenergy:0}])}),"uid='1'");
    const result=run('/kuji.php',[['type','0'],['choice','1']],cookies);
    expect(result.body).toContain('ACFUN');expect(db.rows('acbra2_users')[0]?.get('gold')).toBe('1');
    const cards=await legacyDecode<unknown[]>(String(db.rows('acbra2_users')[0]?.get('card_data')));
    expect(Object.keys(cards)).toHaveLength(2);
    run('/kuji.php',[['type','0'],['choice','1']],cookies);expect(db.rows('acbra2_users')[0]?.get('gold')).toBe('1');
  }finally{db.close();}
});
it('executes the original login, failed password, cookie and logout code using the complete working copy',()=>{
  const {db,run}=fixture();
  try{
    expect(run('/login.php').body).toContain('name="username"');
    const failure=run('/login.php',[['username','Alpha'],['password','wrong-password']]);
    expect(failure.response.status).toBe(200);expect(failure.response.headers.getSetCookie()).toHaveLength(0);
    const login=run('/login.php',[['username','Alpha'],['password','test-only']]);
    expect(login.response.status).toBe(302);expect(login.response.headers.get('location')).toBe('index.php');
    expect(login.response.headers.getSetCookie().map(c=>c.split('=',1)[0])).toEqual(['acbra2_user','acbra2_pass','acbra2_roomid']);
    expect(db.rows('acbra2_users')[0]?.get('ip')).toBe('192.0.2.25');
    expect(db.rows('acbra2_users')[0]?.get('lastvisit')).toBe(String(now));
    expect(login.runtime.runPageScript([{kind:'return',value:{kind:'call',callee:'defined',args:[{kind:'literal',value:'MOD_SKILL58'}]}}]).value).toBe(false);
    const logout=run('/login.php',[['mode','quit']],[['acbra2_user','Alpha'],['acbra2_pass',pass]]);
    expect(logout.response.status).toBe(302);expect(logout.response.headers.getSetCookie()).toHaveLength(2);
  }finally{db.close();}
});
it('renders the original index and map and sends original chat through core-only hooks',async()=>{
  const {db,run}=fixture();
  try{
    const index=run('/index.php');expect(index.body).toContain('ACFUN');
    const map=run('/map.php');expect(map.body).toContain('ACFUN');expect(map.body).toContain('map');
    const cookies:Array<[string,string]>=[['acbra2_user','Alpha'],['acbra2_pass',pass]];
    const sent=run('/chat.php',[['sendmode','send'],['chatmsg','original chat <&>'],['chattype','0'],['lastcid','0']],cookies);
    const message=db.rows('acbra2_chat')[0];expect(message?.get('msg')).toBe('original chat &lt;&amp;&gt;');
    const payload=await legacyDecode<Record<string,any>>(sent.body);expect(Number(payload.lastcid)).toBeGreaterThan(0);
    expect(JSON.stringify(payload.msg)).toContain('original chat');
  }catch(error){console.error(error);throw error;}
  finally{db.close();}
});
it('runs the original registration challenge and account insertion with the original initial card and gold',async()=>{
  const {db,run}=fixture();
  try{
    const form=run('/register.php'),token=/name="register_token" value="([^"]+)"/.exec(form.body)?.[1];
    expect(token).toBeTruthy();
    const question=form.runtime.call('register_verification_question_get',[token!]) as PhpArray;
    const result=run('/register.php',[['cmd','post_register'],['username','Beta'],['npass','test-only'],['rnpass','test-only'],['register_token',token!],['vq_answer',String(question.get('correct_i'))],['gender','f'],['icon','1']]);
    const payload=await legacyDecode<Record<string,any>>(result.body);
    expect(payload.innerHTML.info).toBeTruthy();
    const account=db.rows('acbra2_users').find(r=>r.get('username')==='Beta');
    expect(account?.get('gold')).toBe('100');expect(account?.get('uid')).toBe('2');
    expect(await legacyDecode(String(account?.get('card_data')))).toEqual([{cardid:0,cardenergy:0}]);
    expect(result.response.headers.getSetCookie()).toHaveLength(2);
  }finally{db.close();}
});
it('generates an original recovery code, resets the password and consumes the code',()=>{
  const {db,run}=fixture();
  try{
    const result=run('/recovery.php',[['action','generate'],['current_password','test-only']],[['acbra2_user','Alpha'],['acbra2_pass',pass]]);
    const code=result.body.match(/[A-F0-9]{4}(?:-[A-F0-9]{4}){3}/)?.[0];expect(code).toBeTruthy();
    expect(db.rows('acbra2_recovery_codes')).toHaveLength(1);
    const reset=run('/recovery.php',[['action','reset'],['username','Alpha'],['recovery_code',code!],['newpass','changed-pass'],['newpass2','changed-pass']]);
    expect(reset.body).toContain('密码已重置');expect(db.rows('acbra2_recovery_codes')).toHaveLength(0);
    expect(db.rows('acbra2_users')[0]?.get('password')).toBe(legacyStoredPassword('Alpha',legacyCookiePassword('changed-pass')));
  }finally{db.close();}
});
