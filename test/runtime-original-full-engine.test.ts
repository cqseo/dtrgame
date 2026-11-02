import { beforeAll, describe, expect, it, vi } from 'vitest';
// @ts-expect-error test-only Node builtin
import { readFileSync } from 'node:fs';
import initSqlJs from 'sql.js/dist/sql-wasm-browser.js';
import { SqliteLegacyDatabase } from '../src/legacy/php/sqlite-database';
import { legacyRowFromJson } from '../src/legacy/php/database';
import { createLegacyPlayerRecord } from '../src/generated/legacy-registry';
import { createOriginalGameEngine,originalRuntimeFiles } from '../src/runtime/original-game-engine';
import { LegacyVirtualFilesystem } from '../src/legacy/php/virtual-filesystem';
import { LEGACY_PUBLIC_STATIC_FILES } from '../src/generated/legacy-public-static-files';
import { legacyStoredPassword,legacyCookiePassword } from '../src/original-auth';
import { legacyDecode } from '../src/original-protocol';
import { createLegacyModuleRuntime } from '../src/legacy/php/compiled-modules';
import { toPhpFromJson } from '../src/legacy/php/codec';
import { PhpArray,phpStringBytes } from '../src/legacy/template/values';
import { LEGACY_SQLITE_SHADOW_SCHEMA } from '../src/generated/legacy-sqlite-shadow-schema';
import {createOriginalRoomUpdateEngine} from '../src/runtime/original-room-update';
let SQL:Awaited<ReturnType<typeof initSqlJs>>;
beforeAll(async()=>{SQL=await initSqlJs({wasmBinary:readFileSync('node_modules/sql.js/dist/sql-wasm-browser.wasm')});});
const now=1793580000;
const pass=legacyCookiePassword('test-only');
function harness(gametype=0,roomId=0){
  const players=['Alpha','Beta'].map((name,i)=>Object.assign(createLegacyPlayerRecord(),{
    name,pid:i+1,type:0,pass:legacyStoredPassword(name,pass),hp:400,mhp:400,sp:400,msp:400,
    att:100,def:100,pls:1,endtime:now-10,validtime:now-100,state:0,pose:3,tactic:2,card:0
  }));
  const tables={
    acbra2_game:[legacyRowFromJson({groomid:roomId,groomstatus:40,gamestate:30,gametype,gamenum:7,starttime:now-100,validnum:2,alivenum:2,
      areanum:0,areatime:now,arealist:Array.from({length:35},(_,i)=>i).join(',')})],
    acbra2_users:players.map((p,i)=>legacyRowFromJson({uid:i+1,username:p.name,password:p.pass,groupid:1,roomid:roomId})),
    acbra2_players:players.map(legacyRowFromJson), acbra2_messages:[],acbra2_del_messages:[],acbra2_chat:[],acbra2_log:[],acbra2_newsinfo:[],acbra2_history:[],acbra2_mapitem:[],acbra2_maptrap:[],acbra2_shopitem:[]
  };
  const renamed=Object.fromEntries(Object.entries(tables).map(([name,rows])=>[roomId>0&&/acbra2_(players|chat|log|newsinfo|mapitem|maptrap|shopitem)$/.test(name)?name.replace('acbra2_','acbra2_s'+roomId+'_'):roomId>0&&name==='acbra2_history'?'acbra2_shistory':name,rows]));
  const empty=Object.fromEntries(Object.keys(LEGACY_SQLITE_SHADOW_SCHEMA).map(name=>[name,[]]));
  const db=new SqliteLegacyDatabase(new SQL.Database(),{...empty,...renamed});
  return {db,engine:createOriginalGameEngine({database:db,roomId,now})};
}
describe('complete original module execution chain',()=>{
  it('applies skill58 full-health revival and stat gains only on the first lethal battle',async()=>{
    const {db,engine}=harness();
    const roll=vi.spyOn(Math,'random').mockReturnValue(0);
    try{
      const codec=createLegacyModuleRuntime();
      const values=codec.call('skillbase\\skillbase_save_process',[toPhpFromJson({58:1}),toPhpFromJson({'58_r':'0'})]) as PhpArray;
      db.array_update('acbra2_players',legacyRowFromJson({lvl:5,nskill:values.get(0),nskillpara:values.get(1)}),"pid='2'");
      let fs=engine.filesystem;
      for(const [round,hp]of [410,0].entries()){
        db.array_update('acbra2_players',legacyRowFromJson({action:'enemy2',wep:'调色刀',wepk:'WK',wepe:99999,weps:'∞',wk:99999}),"pid='1'");
        fs=new LegacyVirtualFilesystem(originalRuntimeFiles(),fs.snapshot(),now+round,{directories:fs.directories,readonlyPaths:LEGACY_PUBLIC_STATIC_FILES});
        const next=createOriginalGameEngine({database:db,roomId:0,now:now+round,filesystem:fs});
        await legacyDecode(next.run('command_act',{method:'POST',post:[['command','attack'],['mode','combat']],cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass]]},{tick:false}));
        const defender=db.rows('acbra2_players').find(p=>p.get('name')==='Beta');
        expect(defender?.get('hp')).toBe(String(hp));expect(defender?.get('mhp')).toBe('410');
        expect(defender?.get('def')).toBe('125');
      }
    }catch(error){console.error({error,frames:(error as Error & {legacyFrames?:string[]}).legacyFrames,queries:db.issued.slice(-3)});throw error;}
    finally{roll.mockRestore();db.close();}
  });
  it('keeps a dead teammate in the original team victory list and winner flags',async()=>{
    const {db,engine}=harness(14,4);
    try{
      db.array_update('acbra2_s4_players',legacyRowFromJson({teamID:'red'}),"type='0'");
      db.array_update('acbra2_s4_players',legacyRowFromJson({hp:0,state:22,player_dead_flag:1,endtime:now-1}),"pid='2'");
      await legacyDecode(engine.run('command_act',{method:'POST',post:[['command','menu']],cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass]]},{tick:false}));
      engine.runtime.call('sys\\gameover',[now]);
      expect(db.rows('acbra2_shistory')[0]?.get('winner')).toBe('Alpha,Beta');
      expect(db.rows('acbra2_shistory')[0]?.get('winnernum')).toBe('2');
      expect(db.rows('acbra2_s4_players').map(p=>p.get('winner_flag'))).toEqual(['2','2']);
    }catch(error){console.error({error,frames:(error as Error & {legacyFrames?:string[]}).legacyFrames,queries:db.issued.slice(-3)});throw error;}
    finally{db.close();}
  });
  it.each(['end3','end5','end7'])('preserves original %s special-ending history, news and rewards',async ending=>{
    const {db,engine}=harness();
    try{
      await legacyDecode(engine.run('command_act',{method:'POST',post:[['command','menu']],cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass]]},{tick:false}));
      engine.runtime.call('sys\\gameover',[now,ending,'Alpha']);
      expect(db.rows('acbra2_game')[0]?.get('gamestate')).toBe('0');
      expect(db.rows('acbra2_history')[0]?.get('winner')).toBe('Alpha');
      expect(db.rows('acbra2_newsinfo').some(n=>n.get('news')===ending)).toBe(true);
      expect(Number(db.rows('acbra2_users')[0]?.get('gold'))).toBeGreaterThan(0);
      expect(typeof engine.filesystem.read('gamedata/replays/7.dat')).toBe('string');
    }catch(error){console.error({error,frames:(error as Error & {legacyFrames?:string[]}).legacyFrames,queries:db.issued.slice(-3)});throw error;}
    finally{db.close();}
  });
  it('creates an original SOLO waiting room, admits the second account and broadcasts their chat',async()=>{
    const {db,engine}=harness();
    let fs=engine.filesystem;
    const command=async(name:string,room:number,post:Array<[string,string]>,time:number)=>{
      fs=new LegacyVirtualFilesystem(originalRuntimeFiles(),fs.snapshot(),time,{directories:fs.directories,readonlyPaths:LEGACY_PUBLIC_STATIC_FILES});
      const next=createOriginalGameEngine({database:db,roomId:room,now:time,filesystem:fs});
      return next.run('command_roomcmd',{method:'POST',post,cookies:[['acbra2_user',name],['acbra2_pass',pass],['acbra2_roomid',String(room)]]},{tick:false});
    };
    try{
      expect(await command('Alpha',0,[['command','newroom'],['para1','0']],now)).toBe('redirect:index.php');
      expect(db.rows('acbra2_game').find(r=>r.get('groomid')==='1')?.get('groomstatus')).toBe('10');
      expect(await command('Beta',0,[['command','enterroom'],['para1','1']],now+1)).toBe('redirect:index.php');
      await command('Beta',1,[['command','pos_enter'],['para1','1']],now+2);
      await command('Beta',1,[['command','newchat'],['para1','original room message']],now+3);
      const data=await legacyDecode<Record<string,any>>(String(db.rows('acbra2_game').find(r=>r.get('groomid')==='1')?.get('roomvars')));
      expect(data.player.map((p:any)=>p.name)).toEqual(['Alpha','Beta']);
      expect(JSON.stringify(data.chatdata)).toContain('original room message');
      expect(fs.exists('gamedata/tmp/rooms/1.txt')).toBe(true);
      expect(db.mutations().some(m=>m.table==='acbra2_roomlisteners')).toBe(false);
      const pollRequest={method:'POST',post:[['timestamp',String(data.timestamp)]],cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass],['acbra2_roomid','1']]} as const;
      const waiting=createOriginalRoomUpdateEngine({database:db,filesystem:fs,now:now+3});
      expect(waiting.run(pollRequest)).toBe('');
      expect(waiting.response.headers.get('x-original-room-wait')).toBe('1');
      const changed=createOriginalRoomUpdateEngine({database:db,filesystem:fs,now:now+3});
      const update=await legacyDecode<Record<string,any>>(changed.run({...pollRequest,post:[['timestamp','0']]}));
      expect(update.value.timestamp).toBe(data.timestamp);
      expect(update.innerHTML.roommain).toContain('Alpha');
      await command('Alpha',1,[['command','ready']],now+4);
      await command('Beta',1,[['command','ready']],now+5);
      const started=db.rows('acbra2_game').find(r=>r.get('groomid')==='1');
      expect(started?.get('groomstatus')).toBe('40');
      expect(Number(started?.get('gamestate'))).toBeGreaterThanOrEqual(30);
      expect(db.rows('acbra2_s1_players').filter(p=>p.get('type')==='0').map(p=>p.get('name'))).toEqual(['Alpha','Beta']);
      const afterStart=createOriginalRoomUpdateEngine({database:db,filesystem:fs,now:now+6});
      expect(await legacyDecode(afterStart.run(pollRequest,true))).toEqual({url:'game.php'});
    }catch(error){console.error({error,frames:(error as Error & {legacyFrames?:string[]}).legacyFrames,queries:db.issued.slice(-4)});throw error;}
    finally{db.close();}
  });
  it('preserves original gexit errors from the daemon without performing an action',async()=>{
    const {db,engine}=harness();
    try{
      const body=await legacyDecode<Record<string,unknown>>(engine.run('command_act',{method:'POST',post:[['command','menu']],cookies:[['acbra2_user','Alpha'],['acbra2_pass','wrong-token']]},{tick:false}));
      expect(body.url).toBe('error.php');expect(body.errormsg).toBeTruthy();
      expect(db.rows('acbra2_players')[0]?.get('a_actionnum')).toBe('0');
    }finally{db.close();}
  });
  it('initializes all original modules and runs the original command page',async()=>{
    const {db,engine}=harness();
    try{
      const output=engine.run('command_act',{method:'POST',uri:'/command.php',post:[['command','menu'],['mode','command']],cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass]]},{tick:false});
      const body=await legacyDecode<Record<string,unknown>>(output);
      expect(body.innerHTML).toBeDefined();
      expect(db.rows('acbra2_players').find(p=>p.get('name')==='Alpha')?.get('hp')).toBe('400');
    }catch(error){console.error({error,frames:(error as Error & {legacyFrames?:string[]}).legacyFrames,queries:db.issued.slice(-4)});throw error;}
    finally{db.close();}
  });
  it('executes original stance and movement commands and persists their effects',async()=>{
    const {db,engine}=harness();
    try{
      await legacyDecode(engine.run('command_act',{method:'POST',uri:'/command.php',post:[['command','pose5'],['mode','special']],cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass]]},{tick:false}));
      expect(db.rows('acbra2_players').find(p=>p.get('name')==='Alpha')?.get('pose')).toBe('5');
      const next=createOriginalGameEngine({database:db,roomId:0,now:now+2});
      await legacyDecode(next.run('command_act',{method:'POST',uri:'/command.php',post:[['command','move'],['mode','command'],['moveto','2']],cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass]]},{tick:false}));
      expect(db.rows('acbra2_players').find(p=>p.get('name')==='Alpha')?.get('pls')).toBe('2');
    }catch(error){console.error({error,frames:(error as Error & {legacyFrames?:string[]}).legacyFrames,queries:db.issued.slice(-3)});throw error;}
    finally{db.close();}
  });
  it('executes an original lethal battle and the complete original endgame hook chain',async()=>{
    const {db,engine}=harness();
    const roll=vi.spyOn(Math,'random').mockReturnValue(0);
    try{
      db.array_update('acbra2_players',legacyRowFromJson({action:'enemy2',wep:'调色刀',wepk:'WK',wepe:99999,weps:'∞',wk:99999}),"pid='1'");
      db.array_update('acbra2_players',legacyRowFromJson({hp:1,mhp:400,pose:1,tactic:2}),"pid='2'");
      const output=engine.run('command_act',{method:'POST',uri:'/command.php',post:[['command','attack'],['mode','combat']],cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass]]},{tick:false});
      await legacyDecode(output);
      expect(db.rows('acbra2_players').find(p=>p.get('name')==='Beta')?.get('hp')).toBe('0');
      engine.runtime.call('sys\\gameover',[now]);
      expect(db.rows('acbra2_game')[0]?.get('gamestate')).toBe('0');
      expect(db.rows('acbra2_history')).toHaveLength(1);
      expect(db.rows('acbra2_history')[0]?.get('winner')).toBe('Alpha');
      expect(Number(db.rows('acbra2_users')[0]?.get('gold'))).toBeGreaterThan(0);
      expect(db.rows('acbra2_newsinfo').some(n=>n.get('news')==='end2')).toBe(true);
      expect(typeof engine.filesystem.read('gamedata/replays/7.dat')).toBe('string');
      expect(engine.runtime.call('unfold',['/./gamedata/replays/7.dat'])).toBe(1);
      const bmp=engine.filesystem.read('gamedata/replays/7.1.rep.bmp');
      expect(bmp).not.toBe(false);
      const bytes=phpStringBytes(bmp||'');expect([...bytes.slice(0,2)]).toEqual([66,77]);expect(bytes.length).toBe(3056);
      const recorded=engine.filesystem.read('gamedata/replays/7.1.replay.data.0.js');
      expect(typeof recorded).toBe('string');
      const encoded=/new String\('([^']+)'\)/.exec(String(recorded))?.[1];
      expect(encoded).toBeTruthy();
      const frames=await legacyDecode<Array<Record<string,unknown>>>(encoded!);expect(frames[0]?.innerHTML).toBeDefined();
    }catch(error){console.error({error,frames:(error as Error & {legacyFrames?:string[]}).legacyFrames,queries:db.issued.slice(-3)});throw error;}
    finally{roll.mockRestore();db.close();}
  });
  it.each([{skill:545,mode:21,elapsed:60,hp:0},{skill:545,mode:21,elapsed:61,hp:400},
    {skill:475,mode:2,elapsed:14,hp:0},{skill:475,mode:2,elapsed:15,hp:200}])(
    'uses original revival hook skill $skill at $elapsed seconds',async({skill,mode,elapsed,hp})=>{
      const {db,engine}=harness(mode);
      try{
        const codec=createLegacyModuleRuntime();
        const values=codec.call('skillbase\\skillbase_save_process',[
          toPhpFromJson({[skill]:1}),toPhpFromJson({[skill+'_lastdeath']:now-elapsed})
        ]) as PhpArray;
        db.array_update('acbra2_players',legacyRowFromJson({hp:0,state:22,player_dead_flag:1,endtime:now-elapsed,
          nskill:values.get(0),nskillpara:values.get(1)}),"pid='1'");
        const output=engine.run('command_act',{method:'POST',uri:'/command.php',post:[['command','menu'],['mode','command']],cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass]]},{tick:false});
        const body=await legacyDecode<Record<string,unknown>>(output);
        expect(body.innerHTML).toBeDefined();
        expect(db.rows('acbra2_players').find(p=>p.get('name')==='Alpha')?.get('hp')).toBe(String(hp));
      }catch(error){console.error({error,frames:(error as Error & {legacyFrames?:string[]}).legacyFrames,queries:db.issued.slice(-3)});throw error;}
      finally{db.close();}
    });
  it('runs original rated-mode endgame including the unchanged 10,000 ELO simulations',async()=>{
    const {db,engine}=harness(10,3);
    try{
      db.array_update('acbra2_s3_players',legacyRowFromJson({hp:0,state:22,player_dead_flag:1,endtime:now-1}),"pid='2'");
      db.array_update('acbra2_game',legacyRowFromJson({alivenum:1,deathnum:1}),"groomid='3'");
      await legacyDecode(engine.run('command_act',{method:'POST',post:[['command','menu']],cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass]]},{tick:false}));
      engine.runtime.call('sys\\gameover',[now]);
      const users=db.rows('acbra2_users');
      expect(users.map(p=>Number(p.get('elo_playedtimes')))).toEqual([1,1]);
      expect(Number(users[0]?.get('elo_rating'))).toBeGreaterThan(1500);
      expect(Number(users[1]?.get('elo_rating'))).toBeLessThan(1500);
    }catch(error){console.error({error,frames:(error as Error & {legacyFrames?:string[]}).legacyFrames,queries:db.issued.slice(-3)});throw error;}
    finally{db.close();}
  },120_000);
  it('executes the original reset, clears prior room data and advances the match number',async()=>{
    const {db,engine}=harness();
    try{
      await legacyDecode(engine.run('command_act',{method:'POST',post:[['command','menu']],cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass]]},{tick:false}));
      db.array_insert('acbra2_chat',legacyRowFromJson({msg:'previous match',time:now-1}));
      engine.runtime.call('sys\\reset_game');
      expect(db.rows('acbra2_game')[0]?.get('gamenum')).toBe('8');
      expect(db.rows('acbra2_game')[0]?.get('gamestate')).toBe('5');
      expect(db.rows('acbra2_chat')).toHaveLength(0);
      expect(db.rows('acbra2_log')).toHaveLength(0);
      expect(db.rows('acbra2_users')).toHaveLength(2);
    }catch(error){console.error({error,frames:(error as Error & {legacyFrames?:string[]}).legacyFrames,queries:db.issued.slice(-3)});throw error;}
    finally{db.close();}
  });
  it('prepares the next match through every original rs_game extension',async()=>{
    const {db,engine}=harness();
    try{
      await legacyDecode(engine.run('command_act',{method:'POST',post:[['command','menu']],cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass]]},{tick:false}));
      engine.runtime.call('gameflow_base\\gamestate_prepare_game');
      expect(db.rows('acbra2_game')[0]?.get('gamestate')).toBe('10');
      expect(db.rows('acbra2_players').some(p=>Number(p.get('type'))>0)).toBe(true);
      expect(db.rows('acbra2_players').some(p=>p.get('type')==='0')).toBe(false);
      expect(db.rows('acbra2_mapitem').length).toBeGreaterThan(0);
      expect(db.rows('acbra2_shopitem').length).toBeGreaterThan(0);
      expect(db.rows('acbra2_users')).toHaveLength(2);
      engine.runtime.call('gameflow_base\\gamestate_start_game');
      engine.runtime.call('sys\\save_gameinfo');
      let fs=engine.filesystem;
      for(const [i,name]of ['Alpha','Beta'].entries()){
        fs=new LegacyVirtualFilesystem(originalRuntimeFiles(),fs.snapshot(),now+i+1,{directories:fs.directories,readonlyPaths:LEGACY_PUBLIC_STATIC_FILES});
        const enter=createOriginalGameEngine({database:db,roomId:0,now:now+i+1,filesystem:fs});
        const output=enter.run('command_valid',{method:'POST',post:[['mode','enter'],['card','0'],['gender','f'],['icon','1'],['motto','original profile'],['killmsg','test'],['lastword','test']],cookies:[['acbra2_user',name],['acbra2_pass',pass]]});
        expect(output).toBe('redirect:game.php');
      }
      const participants=db.rows('acbra2_players').filter(p=>p.get('type')==='0');
      expect(participants.map(p=>p.get('name'))).toEqual(['Alpha','Beta']);
      expect(participants.every(p=>Number(p.get('hp'))>0&&Number(p.get('mhp'))>0)).toBe(true);
      expect(db.rows('acbra2_game')[0]?.get('validnum')).toBe('2');
    }catch(error){console.error({error,frames:(error as Error & {legacyFrames?:string[]}).legacyFrames,queries:db.issued.slice(-2)});throw error;}
    finally{db.close();}
  },120_000);
});
