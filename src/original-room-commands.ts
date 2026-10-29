import {originalRoomTypes as types} from './generated/original-room-types';
import {originalRoomInit,originalRoomChat,originalRoomPosition,originalRoomVariable,originalRoomOptionValid,originalRoomTakeover,originalUpdateRoomState,originalRoomAutoKick,type OriginalWaitingRoom,type OriginalRoomOption} from './original-room-state';
import {phpTruthy,phpNumber,phpString,phpBinary} from './original-template-runtime';

export class OriginalRoomMessage extends Error {}
export class OriginalRoomStartNotPorted extends Error {}
export interface RoomCommandEffects {
  heartbeat:'touch'|'clear'|null; save:boolean; leave:boolean; close:boolean; start:boolean;
}
function leader(room:OriginalWaitingRoom,pos:number):unknown{return (originalRoomVariable(room,'leader-position',types) as Record<number,unknown>)[pos];}
function refreshTeam(room:OriginalWaitingRoom,pos:number):void {
  const count=Number(originalRoomVariable(room,'pnum',types));
  for(let i=0;i<count;i++)if(leader(room,i)===pos&&room.player[i]!.forbidden){room.player[i]!.forbidden=0;room.player[i]!.name='';room.player[i]!.ready=0;}
}
/** Pure waiting-room command semantics. Persistence and start effects are awaited by the transaction owner. */
export function originalRoomCommand(room:OriginalWaitingRoom,command:string,p1:string,p2:string,user:string,now:number,status:number,gameState:number,ownerInactive:boolean):RoomCommandEffects {
  const fx:RoomCommandEffects={heartbeat:null,save:false,leave:false,close:false,start:false};
  if(!(status>=10&&status<40)&&command!=='leave')throw new OriginalRoomMessage('房间不在等待状态，命令无效。');
  if(status<40&&room.player[0]?.name===user)fx.heartbeat='touch';
  if(room.readystat===2&&!(command==='leave'&&room.roomtype===14&&gameState===0))throw new OriginalRoomMessage('房间已开始，命令无效。');
  originalUpdateRoomState(room,status>=40,now,types);
  if(originalRoomVariable(room,'soleroom',types)){fx.leave=command==='leave';return fx;}
  if(originalRoomAutoKick(room,now,types)){originalUpdateRoomState(room,status>=40,now,types);fx.save=true;}
  const pos=originalRoomPosition(room,user,types), count=Number(originalRoomVariable(room,'pnum',types));
  const chat=(message:string,color='grey')=>originalRoomChat(room,`<span class="${color} b">${message}</span><br>`);
  const save=()=>{originalUpdateRoomState(room,status>=40,now,types);fx.save=true;};
  if(command==='newchat'){originalRoomChat(room,`<span class="white b"><span class="yellow b">${user}:</span>&nbsp;${p1}</span><br>`);save();}
  else if(command.startsWith('pos')){
    const target=p1==='all'?'all':Math.trunc(phpNumber(p1));
    const seat=typeof target==='number'?room.player[target]:undefined;
    // PHP 7 compares 'all' and integer 0 as equal after the source's int cast.
    // Retain this odd precedence rather than silently modernizing its checks.
    if(phpBinary('!=','all',target)&&target===pos)chat(`${user}试图操作他自己的位置`,'red');
    else if(phpBinary('!=','all',target)&&(Number(target)<0||Number(target)>=count))chat(`${user}试图操作一个不存在的位置`,'red');
    else if(command==='pos_enter'){
      if(!seat)throw new OriginalRoomMessage('房间参数错误');
      if(seat.forbidden)chat(`${user}试图进入一个被禁用的位置`,'red');
      else if(phpTruthy(seat.name))chat(`${user}试图进入一个有人的位置`,'red');
      else{
        if(pos>=0){room.player[pos]!.name='';room.player[pos]!.ready=0;if(pos===0&&target!==0){room.roomfounder='';fx.heartbeat='clear';}if(pos===leader(room,pos))refreshTeam(room,pos);}
        seat.name=user;seat.ready=0;if(target===0){room.roomfounder=user;fx.heartbeat='touch';}
        chat(user+(pos<0?'进入了一个空位置':'移动了位置'));
      }
    }else if(pos<0)chat(`不在房间内的${user}试图操作一个位置`,'red');
    else if(command==='pos_disable'||command==='pos_enable'){
      const check=target==='all'?pos:target;
      if(pos!==0&&pos!==leader(room,check))chat(`并非队长的${user}试图操作一个位置`,'red');
      else if(phpTruthy(seat?.name))chat(`${user}试图操作一个有人的位置`,'red');
      else{
        room.player[pos]!.ready=0;
        if(command==='pos_disable'){
          if(phpTruthy(originalRoomVariable(room,'cannot-forbid',types))||count<=2)chat(`${user}试图禁用一个位置，但本房间不允许禁用`,'red');
          else if(target==='all'){
            for(const [i,s]of room.player.entries())if(!phpTruthy(s.name)&&(pos===0||pos===leader(room,i)))s.forbidden=1;
            chat(user+(pos===0?'禁用了全部空位置':'禁用了其队伍中的全部空位置'));
          }else{seat!.name='';seat!.forbidden=1;chat(user+(pos===0?'禁用了房间的一个位置':'禁用了其队伍的一个位置'));}
        }else{
          if(!seat)throw new OriginalRoomMessage('房间参数错误');
          seat.name='';seat.forbidden=0;chat(user+(pos===0?'重新启用了房间的一个位置':'重新启用了其队伍的一个位置'));
        }
      }
    }else if(command==='pos_kick'){
      if(!phpTruthy(seat?.name))chat(`${user}试图踢掉一个不存在的玩家`,'red');
      else if(pos!==0&&pos!==leader(room,Number(target)))chat(`并非房主或队长的${user}试图踢人`,'red');
      else{if(target===leader(room,Number(target)))refreshTeam(room,Number(target));const previous=seat!.name;seat!.name='';seat!.ready=0;chat(`${user}将${previous}踢出了房间`);}
    }
    save();
  }else if(command==='rmsetmode'){
    const type=Math.trunc(phpNumber(p1));
    if(pos===0&&types[type]&&type!==room.roomtype&&!types[type]!.soleroom){
      const next=originalRoomInit(type,user,types);next.chatdata=room.chatdata;
      const size=Math.min(count,Number(originalRoomVariable(next,'pnum',types)));
      for(let i=0;i<size;i++){const seat=room.player[i]!;if([1,2,3,4].includes(type)&&seat.forbidden&&!phpTruthy(seat.name))next.player[i]!.forbidden=1;else if(phpTruthy(seat.name))next.player[i]!.name=seat.name;}
      next.timestamp=room.timestamp;for(const key of Object.keys(room))delete room[key];Object.assign(room,next);
      chat(`${user}将房间模式修改为了${phpString(originalRoomVariable(room,'name',types))}`);save();
    }else chat(`${user}试图修改房间模式但未成功`,'red');
  }else if(command==='game-option'){
    if(pos!==0)chat(`并非房主的${user}试图改变游戏设置`,'red');
    else if(!originalRoomOptionValid(room.roomtype,p1,p2,types))chat(`${user}试图设置一个错误的游戏参数`,'red');
    else{
      const opt=(originalRoomVariable(room,'game-option',types) as Record<string,OriginalRoomOption>)[p1]!;
      const options=room.current_game_option as Record<string,string|number|null>,old=options[p1];
      let oldWord:unknown,newWord:unknown;
      if(opt.type==='number'){oldWord=phpTruthy(old)?old:0;newWord=p2;}
      else for(const value of opt.options??[]){if(phpBinary('==',value.value,old))oldWord=value.name;if(phpBinary('==',value.value,p2))newWord=value.name;if(oldWord!=null&&newWord!=null)break;}
      options[p1]=p2;
      if(!phpTruthy(opt['no-notice-when-modified']))chat(`${user}将 ${phpString(opt.title)} 从 ${phpString(oldWord)} 变为 ${phpString(newWord)} `);else room.timestamp++;
      if(p1==='group-num')for(let i=Math.min(Number(p2),Number(old))*5;i<Math.max(Number(p2),Number(old))*5;i++){room.player[i]!.name='';room.player[i]!.ready=0;room.player[i]!.forbidden=0;}
    }
    save();
  }else if(command==='takeover'){
    if(pos>0&&room.readystat!==2&&ownerInactive&&originalRoomTakeover(room,user,pos)){
      if(pos===leader(room,pos))refreshTeam(room,pos);fx.heartbeat='touch';chat(`原房主长时间离线，${user}已接管房间房主位置。`,'yellow');
    }else chat('房主仍在线、离线时间不足5分钟或你尚未入座，暂时不能接管。','yellow');
    save();
  }else if(command==='leave'){
    if(status<40&&pos>=0){if(pos===leader(room,pos))refreshTeam(room,pos);room.player[pos]!.name='';room.player[pos]!.ready=0;if(pos===0){room.roomfounder='';fx.heartbeat='clear';}}
    if(room.roomtype===14&&gameState===0&&room.roomfounder===user)room.roomfounder='';
    chat(`${user}离开了房间`);save();fx.leave=true;
    if(room.roomtype===14&&gameState===0&&!room.player.some(p=>phpTruthy(p.name)))fx.close=true;
  }else if(command==='ready'){
    if(pos>=0&&room.readystat===1&&!room.player[pos]!.ready&&!originalRoomVariable(room,'without-ready',types)){
      room.player[pos]!.ready=1;chat(`${user}点击了准备`);
      let allReady=true;for(let i=0;i<count;i++)if(!room.player[i]!.forbidden&&!room.player[i]!.ready)allReady=false;
      if(allReady){room.readystat=2;chat('所有人均已准备，游戏即将开始..');fx.start=true;}save();
    }
  }else if(command==='start'&&pos===0&&originalRoomVariable(room,'without-ready',types)){fx.start=true;}
  return fx;
}
