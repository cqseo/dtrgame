// Local workerd compatibility probe using synthetic accounts only. This is
// not a production entry point or a substitute for PostgreSQL/browser QA.
import {createSqliteShadow} from '../src/runtime/sqlite-shadow';
import {createOriginalGameEngine,originalRuntimeFiles} from '../src/runtime/original-game-engine';
import {LegacyVirtualFilesystem,type LegacyVirtualFile} from '../src/legacy/php/virtual-filesystem';
import {LEGACY_PUBLIC_STATIC_FILES} from '../src/generated/legacy-public-static-files';
import {LEGACY_SQLITE_SHADOW_SCHEMA} from '../src/generated/legacy-sqlite-shadow-schema';
import {createLegacyPlayerRecord} from '../src/generated/legacy-registry';
import {legacyRowFromJson} from '../src/legacy/php/database';
import {legacyCookiePassword,legacyStoredPassword} from '../src/original-auth';
import {gdecode} from '../src/legacy/php/codec';
import {PhpArray} from '../src/legacy/template/values';
const pass=legacyCookiePassword('synthetic-local-only');
let database:ReturnType<typeof createSqliteShadow>|undefined;
let files:Record<string,LegacyVirtualFile>={},directories:string[]=[];
function fixture(){
  const now=Math.floor(Date.now()/1000);
  const players=['Alpha','Beta'].map((name,i)=>Object.assign(createLegacyPlayerRecord(),{pid:i+1,name,pass:legacyStoredPassword(name,pass),hp:400,mhp:400,sp:400,msp:400,att:100,def:100,pls:1,pose:3,tactic:2,validtime:now-100,endtime:now-10}));
  return createSqliteShadow({...Object.fromEntries(Object.keys(LEGACY_SQLITE_SHADOW_SCHEMA).map(n=>[n,[]])),
    acbra2_game:[legacyRowFromJson({groomid:0,groomstatus:40,gamenum:7,gamestate:30,gametype:0,starttime:now-100,areatime:now,validnum:2,alivenum:2,arealist:Array.from({length:35},(_,i)=>i).join(',')})],
    acbra2_users:players.map((p,i)=>legacyRowFromJson({uid:i+1,username:p.name,password:p.pass,groupid:1})),acbra2_players:players.map(legacyRowFromJson)
  });
}
export default {async fetch(request:Request,env:{ASSETS:Fetcher}){
  const url=new URL(request.url);
  if(!['localhost','127.0.0.1'].includes(url.hostname))return new Response('Local synthetic probe only.',{status:403});
  if(!['/probe','/game.php','/command.php'].includes(url.pathname))return env.ASSETS.fetch(request);
  try{
    const db=await(database??=fixture()),now=Math.floor(Date.now()/1000);
    const filesystem=new LegacyVirtualFilesystem(originalRuntimeFiles(),files,now,{directories,readonlyPaths:LEGACY_PUBLIC_STATIC_FILES});
    const engine=createOriginalGameEngine({database:db,filesystem,roomId:0,now});
    const post=request.method==='POST'?[...new URLSearchParams(await request.text())]:[['mode','special'],['command','pose5']];
    const body=engine.run(url.pathname==='/game.php'?'command_game':'command_act',{method:request.method,post:post as [string,string][],cookies:[['acbra2_user','Alpha'],['acbra2_pass',pass]],serverPort:url.port||'80'});
    ({files,directories}=filesystem.state());
    if(url.pathname==='/probe'){
      const payload=gdecode(body);
      return Response.json({ok:payload instanceof PhpArray&&payload.has('innerHTML'),pose:db.rows('acbra2_players')[0]?.get('pose'),replay:Object.keys(files).some(p=>p.endsWith('/1/replay.php')),originalModuleCount:735});
    }
    return new Response(body,{status:engine.response.status,headers:engine.response.headers});
  }catch(error){console.error(error);return Response.json({ok:false,error:error instanceof Error?error.message:String(error)},{status:500});}
}};
