/** Direct port of roommng.func.php waiting-room primitives. No game-start stub. */
import { phpBinary, phpTruthy } from './original-template-runtime';
export interface OriginalRoomOption {
  type: string; options?: {value: string | number; default?: boolean; [key: string]: unknown}[];
  min?: number|string; max?: number|string; [key: string]: unknown;
}
export interface OriginalRoomType {
  pnum: number; 'leader-position': number[] | Record<number,number>;
  'game-option'?: Record<string,OriginalRoomOption>; [key: string]: unknown;
}
export interface OriginalRoomSeat { name: string; ready: number; forbidden: number; leader: number }
export interface OriginalWaitingRoom {
  roomtype: number; readystat: number; roomfounder: string; kicktime: number;
  player: OriginalRoomSeat[]; timestamp: number;
  chatdata: {cid: number; data: string}[];
  current_game_option: Record<string,string|number|null> | [];
  [key: string]: unknown;
}
export type OriginalRoomTypes = Readonly<Record<number,OriginalRoomType>>;
function typeFor(types: OriginalRoomTypes, id: number): OriginalRoomType {
  const type=types[id]; if (!type) throw new RangeError('Original room type missing'); return type;
}
export function originalRoomVariable(room: OriginalWaitingRoom, name: string, types: OriginalRoomTypes): unknown {
  if(name==='pnum' && (room.current_game_option as Record<string,unknown>)['group-num'] != null)
    return Number((room.current_game_option as Record<string,unknown>)['group-num'])*5;
  if(room[name] != null) return room[name];
  const type=typeFor(types,room.roomtype);
  if(type[name] != null) return type[name];
  return (room.current_game_option as Record<string,unknown>)[name] ?? null;
}
export function originalRoomInit(id: number, user: string, types: OriginalRoomTypes): OriginalWaitingRoom {
  const type=typeFor(types,id), options: Record<string,string|number|null>={};
  for(const [key,option] of Object.entries(type['game-option'] ?? {}))
    options[key]=option.options?.find(o=>phpTruthy(o.default))?.value ?? null;
  return { roomtype:id,readystat:0,roomfounder:user,kicktime:0,
    player:Array.from({length:type.pnum},(_,i)=>({name:'',ready:0,forbidden:0,leader:type['leader-position'][i]!})),
    timestamp:1,chatdata:Array.from({length:10},()=>({cid:-1,data:''})),
    current_game_option:Object.keys(options).length ? options : [] };
}
export function originalUpdateRoomState(room: OriginalWaitingRoom, running: boolean, now: number, types: OriginalRoomTypes): number {
  const type=typeFor(types,room.roomtype), count=Number(originalRoomVariable(room,'pnum',types));
  const leaders=originalRoomVariable(room,'leader-position',types) as Record<number,number>;
  const teams=new Set<number>(); let full=true, changed=0;
  for(let i=0;i<count;i++) {
    const seat=room.player[i]; if(!seat) throw new Error('Missing source room seat');
    if(!seat.forbidden) { if(seat.name==='') full=false; else teams.add(leaders[i]!); }
  }
  if(teams.size<Number(originalRoomVariable(room,'min-team',types))) full=false;
  if(!running && full && room.readystat===0) {
    room.readystat=1;
    room.kicktime=now+(phpTruthy(type['ready-expire-time'])?Number(type['ready-expire-time']):30);
    room.timestamp++;
    for(let i=0;i<type.pnum;i++) room.player[i]!.ready=0;
    changed=1;
  }
  if(!full) {room.readystat=0;changed=1;}
  return changed;
}
export function originalRoomChat(room: OriginalWaitingRoom, message: string): void {
  if(phpTruthy(message)) {
    for(let i=1;i<=9;i++) room.chatdata[i-1]={...room.chatdata[i]!};
    room.chatdata[9]={cid:Math.max(room.chatdata[8]!.cid,0)+1,data:message};
  }
  room.timestamp++;
}
export function originalRoomAutoKick(room: OriginalWaitingRoom, now: number, types: OriginalRoomTypes): number {
  if(room.readystat!==1 || now<room.kicktime) return 0;
  const count=Number(originalRoomVariable(room,'pnum',types));
  for(let i=0;i<count;i++) {
    const seat=room.player[i]!;
    if(!seat.forbidden && !seat.ready && seat.name!=='') {
      originalRoomChat(room,`<span class="grey b">${seat.name}因为长时间未准备，被系统踢出了位置。</span><br>`);
      seat.name='';
    }
  }
  return 1;
}
export function originalRoomParticipants(room: OriginalWaitingRoom, types: OriginalRoomTypes): [number,number] {
  const count=Number(originalRoomVariable(room,'pnum',types)); let present=0,required=count;
  for(let i=0;i<count;i++) {const seat=room.player[i]!;if(seat.name!=='')present++;else if(seat.forbidden)required--;}
  return [present,required];
}
export function originalRoomPosition(room: OriginalWaitingRoom, user: string, types: OriginalRoomTypes): number {
  const count=Number(originalRoomVariable(room,'pnum',types));
  for(let i=0;i<count;i++) if(!room.player[i]!.forbidden && phpBinary('==',room.player[i]!.name,user))return i;
  return -1;
}
export function originalRoomTakeover(room: OriginalWaitingRoom, user: string, position: number): boolean {
  const owner=room.player[0],seat=room.player[position];
  if(position<=0 || !phpTruthy(user) || !owner || !phpTruthy(owner.name) || owner.name===user ||
    !seat || !phpTruthy(seat.name) || seat.name!==user || seat.forbidden)return false;
  owner.name=user; owner.ready=0; owner.forbidden=0; seat.name=''; seat.ready=0;
  room.readystat=0;room.kicktime=0;room.roomfounder=user;
  for(const player of room.player)player.ready=0;
  return true;
}
export function originalRoomOptionValid(typeId: number, key: string, value: unknown, types: OriginalRoomTypes): boolean {
  const option=typeFor(types,typeId)['game-option']?.[key]; if(!option)return false;
  if(option.type==='number') {
    const number=Math.trunc(parseFloat(String(value)) || 0);
    return !(option.min != null && number<Number(option.min)) && !(option.max != null && number>Number(option.max));
  }
  return (option.options ?? []).some(o=>phpBinary('==',value,o.value));
}
