import {SnapshotLegacyDatabase} from '../legacy/php/database';
import {PhpArray,toStringValue,type PhpValue} from '../legacy/template/values';
import type {LegacyPageRequest} from '../legacy/php/runtime';
import {cookiesOf,runLegacyPageResponse} from './legacy-page-handler';
import type {OriginalActorCommand} from './original-game-actor';

const WRAPPERS=new Set(['/game.php','/valid.php','/roomcmd.php','/end.php','/winner.php','/rank.php','/alive.php','/help.php','/news.php','/logistics.php']);
const PAGES=new Set(['command_act','command_game','command_roomcmd','command_valid','command_end','command_winner','command_rank','command_alive','command_help','command_news','command_aranking','command_logistics']);
const pairs=(value:PhpValue|undefined):Array<[string,string]>=>value instanceof PhpArray?value.pairs().map(([k,v])=>[String(k),toStringValue(v)]):[];
function pageOf(post:readonly(readonly[string,string])[]):string{
  const page=new Map(post).get('page');return !page||page==='command'?'command_act':page;
}
function roomOf(request:LegacyPageRequest):number{
  const posted=new Map(request.post??[]),cookies=new Map(request.cookies??[]);
  const value=posted.get('game_roomid')??cookies.get('acbra2_roomid')??'0';
  if(!/^\d+$/.test(value))return 0;const n=Number(value);return Number.isSafeInteger(n)&&n>=0&&n<=12?n:0;
}
function httpContext(request:Request):Pick<LegacyPageRequest,'remoteAddress'|'userAgent'|'serverPort'>{
  const url=new URL(request.url);return {remoteAddress:request.headers.get('cf-connecting-ip')??'',userAgent:request.headers.get('user-agent')??'',serverPort:url.port||(url.protocol==='https:'?'443':'80')};
}
/** Run the original public wrapper twice: first to capture its daemon POST,
 * then with the committed response replacing curl_post(). Redirects, errors,
 * GET extras, cookie filters and user text remain the original PHP code. */
export async function handleOriginalEngineHttp(request:Request,namespace:DurableObjectNamespace):Promise<Response|undefined>{
  const pathname=new URL(request.url).pathname;
  if(pathname!=='/command.php'&&pathname!=='/roomupdate.php'&&!WRAPPERS.has(pathname))return undefined;
  if(!['GET','HEAD','POST'].includes(request.method))return new Response('Method Not Allowed',{status:405});
  let forwarded:LegacyPageRequest|undefined;
  const context=httpContext(request),database=new SnapshotLegacyDatabase();
  if(pathname==='/roomupdate.php'){
    forwarded={method:request.method,uri:pathname,post:request.method==='POST'?[...new URLSearchParams(await request.clone().text())]:[],cookies:cookiesOf(request),...context};
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
  const page=pathname==='/roomupdate.php'?'roomupdate':pageOf(forwarded.post??[]);
  if(pathname!=='/roomupdate.php'&&!PAGES.has(page))return new Response('Invalid original page.',{status:400});
  const roomId=roomOf(forwarded),command:OriginalActorCommand={roomId,page,request:forwarded};
  const actor=namespace.get(namespace.idFromName('original-room:'+roomId));
  const response=await actor.fetch(new Request('https://original.internal/execute',{method:'POST',body:JSON.stringify(command),headers:{'content-type':'application/json'}}));
  if(pathname==='/command.php'||pathname==='/roomupdate.php')return request.method==='HEAD'?new Response(null,response):response;
  // A transport/storage failure has no committed original page to render.
  if(response.status>=500)return response;
  const body=(await response.text()).trim(),responseCookies=new PhpArray();
  for(const cookie of response.headers.getSetCookie()){
    const first=cookie.split(';',1)[0]!,i=first.indexOf('=');if(i>0)responseCookies.set(first.slice(0,i),first.slice(i+1));
  }
  return runLegacyPageResponse(pathname,request,{database,tablePrefix:'acbra2_',originalCurlPost:()=>body,
    initialGlobals:new Map([['response_cookies',responseCookies]])});
}
