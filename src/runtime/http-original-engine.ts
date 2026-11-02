import {SnapshotLegacyDatabase} from '../legacy/php/database';
import {PhpArray,toStringValue,type PhpValue} from '../legacy/template/values';
import type {LegacyPageRequest} from '../legacy/php/runtime';
import {cookiesOf,runLegacyPageResponse} from './legacy-page-handler';
import type {OriginalActorCommand} from './original-game-actor';
import {ORIGINAL_TRANSACTIONAL_PUBLIC_PAGES} from './original-public-page-engine';
import {ORIGINAL_ROOM_ID_LIMIT} from '../generated/legacy-sqlite-shadow-schema';

const WRAPPERS=new Set(['/game.php','/valid.php','/roomcmd.php','/end.php','/winner.php','/rank.php','/alive.php','/help.php','/news.php','/logistics.php']);
const PAGES=new Set(['command_act','command_game','command_roomcmd','command_valid','command_end','command_winner','command_rank','command_alive','command_help','command_news','command_aranking','command_logistics']);
const pairs=(value:PhpValue|undefined):Array<[string,string]>=>value instanceof PhpArray?value.pairs().map(([k,v])=>[String(k),toStringValue(v)]):[];
function pageOf(post:readonly(readonly[string,string])[]):string{
  const values=new Map(post),command=values.get('command');
  if(command==='area_timing_refresh'||command==='room_routine_single')return 'command_transport';
  const page=values.get('page');return !page||page==='command'?'command_act':page;
}
function roomOf(request:LegacyPageRequest):number{
  const posted=new Map(request.post??[]),cookies=new Map(request.cookies??[]);
  const value=posted.get('game_roomid')??cookies.get('acbra2_roomid')??'0';
  if(!/^\d+$/.test(value))return 0;const n=Number(value);return Number.isSafeInteger(n)&&n>=0&&n<=ORIGINAL_ROOM_ID_LIMIT?n:0;
}
function httpContext(request:Request):Pick<LegacyPageRequest,'remoteAddress'|'userAgent'|'serverPort'>{
  const url=new URL(request.url);return {remoteAddress:request.headers.get('cf-connecting-ip')??'',userAgent:request.headers.get('user-agent')??'',serverPort:url.port||(url.protocol==='https:'?'443':'80')};
}
/** Run the original public wrapper twice: first to capture its daemon POST,
 * then with the committed response replacing curl_post(). Redirects, errors,
 * GET extras, cookie filters and user text remain the original PHP code. */
export async function handleOriginalEngineHttp(request:Request,namespace:DurableObjectNamespace):Promise<Response|undefined>{
  const rawPath=new URL(request.url).pathname,pathname=rawPath==='/'?'/index.php':rawPath;
  const publicPage=ORIGINAL_TRANSACTIONAL_PUBLIC_PAGES.has(pathname);
  if(pathname!=='/command.php'&&pathname!=='/roomupdate.php'&&!publicPage&&!WRAPPERS.has(pathname))return undefined;
  if(!['GET','HEAD','POST'].includes(request.method))return new Response('Method Not Allowed',{status:405});
  let forwarded:LegacyPageRequest|undefined;
  const context=httpContext(request),database=new SnapshotLegacyDatabase();
  if(pathname==='/roomupdate.php'||publicPage){
    const url=new URL(request.url);
    forwarded={method:request.method,uri:pathname+url.search,get:[...url.searchParams],post:request.method==='POST'?[...new URLSearchParams(await request.clone().text())]:[],cookies:cookiesOf(request),...context};
  }else if(pathname==='/command.php'){
    if(request.method!=='POST')return new Response('Forbidden',{status:403});
    const post=[...new URLSearchParams(await request.clone().text())];
    if(post.some(([k])=>k==='conn_passwd')||new Map(post).get('command')==='maintain')return new Response('Forbidden',{status:403});
    forwarded={method:'POST',uri:'/command.php',post,cookies:cookiesOf(request),...context};
  }else{
    const first=await runLegacyPageResponse(pathname,request,{database,tablePrefix:'acbra2_',originalCurlPost:args=>{
      forwarded={method:'POST',uri:'/command.php',post:pairs(args[1]),cookies:pairs(args[2]),...context};return '';
    }});
    if(!forwarded)return first;
  }
  const page=publicPage?'public:'+pathname:pathname==='/roomupdate.php'?'roomupdate':pageOf(forwarded.post??[]);
  const direct=page==='command_transport'&&['area_timing_refresh','room_routine_single'].includes(new Map(forwarded.post).get('command')??'');
  if(pathname!=='/roomupdate.php'&&!publicPage&&!direct&&!PAGES.has(page))return new Response('Invalid original page.',{status:400});
  const roomId=roomOf(forwarded),command:OriginalActorCommand={roomId,page,request:forwarded};
  const actor=namespace.get(namespace.idFromName('original-room:'+roomId));
  // The original public redirect belongs to the player's browser. Native
  // DO fetch otherwise follows it against /index.php inside the actor and
  // turns a successful original login into the actor's internal 404.
  const response=await actor.fetch(new Request('https://original.internal/execute',{method:'POST',body:JSON.stringify(command),headers:{'content-type':'application/json'},redirect:'manual'}));
  if(pathname==='/command.php'||pathname==='/roomupdate.php'||publicPage)return request.method==='HEAD'?new Response(null,response):response;
  // A transport/storage failure has no committed original page to render.
  if(response.status>=500)return response;
  const body=(await response.text()).trim(),responseCookies=new PhpArray();
  for(const cookie of response.headers.getSetCookie()){
    const first=cookie.split(';',1)[0]!,i=first.indexOf('=');if(i>0)responseCookies.set(first.slice(0,i),first.slice(i+1));
  }
  return runLegacyPageResponse(pathname,request,{database,tablePrefix:'acbra2_',originalCurlPost:()=>body,
    initialGlobals:new Map([['response_cookies',responseCookies]])});
}
