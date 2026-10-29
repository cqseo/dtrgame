import type {PgLegacyClient} from './original-supabase-db';
import type {LegacyAccountRow} from './original-login';
import {legacyEncode} from './original-protocol';
import {OriginalRuntimeRooms,type RuntimeRoomResult} from './original-runtime-rooms';
import {originalRoomTypes} from './generated/original-room-types';
import {originalRoomTemplates,originalRoomTemplateConstants,originalLobbyDefaults} from './generated/original-room-templates';
import {originalAccountDefaults,originalErrorMessages} from './generated/original-account-templates';
import {originalRoomPosition,originalRoomParticipants,originalRoomVariable} from './original-room-state';
import {originalFormInput} from './original-request-input';
import {OriginalRoomMessage,OriginalRoomStartNotPorted} from './original-room-commands';
import {phpNumber,phpString,type TemplateContext} from './original-template-runtime';
import {originalAccountPage} from './original-account-http';

export function runtimeRoomId(cookie:string):number {
  const value=cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith('acbra2_roomid='))?.slice(14)??'0';
  try{const number=Math.trunc(phpNumber(decodeURIComponent(value)));return number>=0&&number<=255?number:0;}catch{return 0;}
}
function roomCookie(id:number,secure:boolean):string{return `acbra2_roomid=${id}; Path=/`+(secure?'; Secure':'');}
const headers=()=>new Headers({'content-type':'text/html; charset=utf-8','cache-control':'private, no-store, max-age=0'});
function render(name:string,context:TemplateContext):string {
  const template=originalRoomTemplates[name];if(!template)throw new Error('Unported room template');
  return template(context,originalRoomTemplateConstants,()=>{throw new Error('Unstaged template file');},originalRoomTemplates);
}
async function wire(data:unknown,roomId?:number,secure=false):Promise<Response>{const h=headers();if(roomId!==undefined)h.append('set-cookie',roomCookie(roomId,secure));return new Response(await legacyEncode(data),{headers:h});}
export async function originalRoomUpdateBody(room:RuntimeRoomResult,user:string,now:number):Promise<string>{
  if(Number(room.row.groomstatus)>=40)return legacyEncode({url:'game.php'});
  const data:Record<string,unknown>={innerHTML:{roommain:render('roommain',{roomdata:room.state,room_id:room.id,upos:originalRoomPosition(room.state,user,originalRoomTypes),roomtypelist:originalRoomTypes,__renderNow:now})},value:{timestamp:room.state.timestamp}};
  if(room.state.readystat===2)(data.innerHTML as Record<string,string>).roomchatarea='<div></div>';else data.lastchat=room.state.chatdata;
  return legacyEncode(data);
}
export async function originalRoomHttp(request:Request,raw:URLSearchParams,db:PgLegacyClient,user:LegacyAccountRow|null):Promise<Response>{
  const url=new URL(request.url),secure=url.protocol==='https:',form=originalFormInput(raw),now=Math.floor(Date.now()/1000),rooms=new OriginalRuntimeRooms(db,now),id=runtimeRoomId(request.headers.get('cookie')??'');
  if(url.pathname==='/roomcmd.php'||url.pathname==='/roomupdate.php'){
    if(!user)return url.pathname==='/roomcmd.php'?originalAccountPage('error',{message:originalErrorMessages.no_login,gamecredits:''},'roomcmd'):wire({url:'error.php',errormsg:originalErrorMessages.no_login});
    try {
      if(url.pathname==='/roomupdate.php'){
        let result=await rooms.transaction(()=>rooms.poll(id,user.username));
        if(!result)return wire({url:'index.php'},0,secure);
        if(Number(result.row.groomstatus)>=40)return wire({url:'game.php'});
        const timestamp=Math.trunc(phpNumber(form.get('timestamp'))),deadline=Date.now()+30000;
        while(timestamp>=result.state.timestamp&&Number(result.row.groomstatus)<40&&Date.now()<deadline&&!request.signal.aborted){
          await new Promise(resolve=>setTimeout(resolve,Math.min(750,deadline-Date.now())));
          const refreshed=await rooms.transaction(()=>rooms.find(id));
          if(!refreshed)return new Response('',{headers:headers()});result=refreshed;
        }
        if(request.signal.aborted||timestamp>=result.state.timestamp&&Number(result.row.groomstatus)<40)return new Response('',{headers:headers()});
        return new Response(await originalRoomUpdateBody(result,user.username,now),{headers:headers()});
      }
      const command=form.get('command')??'',p1=form.get('para1')??'',p2=form.get('para2')??'';
      const result=await rooms.transaction(async()=>{
        if(command==='newroom'||command==='enterroom'){
          if(id>0)throw new OriginalRoomMessage('你已在房间内，请先退出房间');
          return command==='newroom'?rooms.create(Math.trunc(phpNumber(p1)),user.username,originalRoomTemplateConstants):rooms.enter(Math.trunc(phpNumber(p1)),user.username);
        }
        if(id===0){if(command==='leave')return null;throw new OriginalRoomMessage('你不在房间内，请先进入房间');}
        return rooms.command(id,user.username,command,p1,p2);
      });
      if(command==='newroom'||command==='enterroom'){
        const h=headers();h.append('set-cookie',roomCookie(result!.id,secure));
        // render_page converts the original redirect: marker to a Location response
        // for full page requests. Ajax still receives the unchanged marker.
        if(url.searchParams.has('command')){h.set('location','index.php');return new Response(null,{status:302,headers:h});}
        h.set('location','index.php');return new Response(null,{status:302,headers:h});
      }
      if(!result||result.leave){if(url.searchParams.has('command')){const h=headers();h.append('set-cookie',roomCookie(0,secure));h.set('location','index.php');return new Response(null,{status:302,headers:h});}return wire({url:'index.php'},0,secure);}
      return new Response('',{headers:headers()});
    }catch(error){
      if(error instanceof OriginalRoomMessage)return url.pathname==='/roomcmd.php'?originalAccountPage('error',{message:error.message,gamecredits:''},'roomcmd'):wire({url:'error.php',errormsg:error.message});
      if(error instanceof OriginalRoomStartNotPorted)return new Response('Original game initialization is not yet ported.',{status:501,headers:headers()});
      throw error;
    }
  }
  const snapshot=await rooms.transaction(async()=>({rooms:await rooms.lobby(),all:await rooms.all()}));
  const current=snapshot.rooms.find(r=>r.id===id),row=snapshot.all.find(r=>Number(r.groomid)===(current?id:0));
  if(!row)throw new Error('Original standard game row missing');
  const roomlist:Record<number,unknown>={};
  const sorted=snapshot.rooms.map(r=>{
    const [present,maximum]=originalRoomParticipants(r.state,originalRoomTypes),sole=originalRoomVariable(r.state,'soleroom',originalRoomTypes);
    const entry={id:r.id,gamestate:Number(r.row.gamestate),status:Number(r.row.groomstatus),nowplayer:present,maxplayer:maximum,roomtype:r.state.roomtype,roomdata:r.state,soleroom:sole,runningtime:Number(r.row.starttime)>0?now-Number(r.row.starttime):0};
    roomlist[r.id]=entry;return {entry,weight:Math.max(0,(sole?0:Number(r.row.groomstatus)>=40?20000:10000-(maximum-present)*100)+r.id)};
  }).sort((a,b)=>a.weight-b.weight);
  const date=new Date(now*1000),start=Number(row.starttime),gameState=Number(row.gamestate),intervals=originalLobbyDefaults.areainterval as Record<number,number>;
  const text=(await db.query<{name:string;content:string}>(`SELECT name,content FROM acfun_runtime_qa_20261029.runtime_site_text`,[])).rows;
  const context:TemplateContext={...originalAccountDefaults,...originalLobbyDefaults,...row,roomtypelist:originalRoomTypes,roomlist,shroomlist:sorted.map(r=>r.entry),
    cuser:user?.username??'',cpass:user?'authenticated':'',room_id:current?id:0,room_prefix:current?'s'+id:'',roomdata:current?.state??[],upos:current&&user?originalRoomPosition(current.state,user.username,originalRoomTypes):-1,
    now,__renderNow:now,year:date.getUTCFullYear(),month:date.getUTCMonth()+1,day:date.getUTCDate(),hour:String(date.getUTCHours()).padStart(2,'0'),min:String(date.getUTCMinutes()).padStart(2,'0'),sec:String(date.getUTCSeconds()).padStart(2,'0'),wday:date.getUTCDay(),
    timing:gameState>10?(now-start)*1000:Math.max(0,start-now)*1000,areaintv:intervals?.[Number(row.gametype)]??intervals?.[0],
    adminmsg:text.find(r=>r.name==='adminmsg')?.content??'',systemmsg:text.find(r=>r.name==='systemmsg')?.content??''};
  const h=headers();if(id&&!current)h.append('set-cookie',roomCookie(0,secure));
  return new Response(render('index',context),{headers:h});
}
