import type {PgLegacyClient} from './original-supabase-db';
import {legacyEncode,legacyDecode} from './original-protocol';
import {originalRoomTypes as types} from './generated/original-room-types';
import {originalRoomInit,originalRoomChat,originalUpdateRoomState,originalRoomAutoKick,originalRoomParticipants,type OriginalWaitingRoom} from './original-room-state';
import {originalRoomCommand,OriginalRoomMessage,OriginalRoomStartNotPorted} from './original-room-commands';
import {phpTruthy,phpString} from './original-template-runtime';

export interface RuntimeRoomRow extends Record<string,unknown>{groomid:number;groomstatus:number;groomtype:number;gametype:number;gamestate:number;roomvars:string;starttime:number;is_open:boolean|null;updated_at:number;owner_seen_at:number|null;}
export interface RuntimeRoomResult {id:number;state:OriginalWaitingRoom;row:RuntimeRoomRow;leave?:boolean;}
const BASE='acfun_runtime_qa_20261029';
/** All room reads/mutations use a dedicated PG connection and one transaction.
 * The allocation lock also serializes lobby sweeps with room commands. This
 * deliberately prioritizes original consistency before parallel room throughput.
 */
export class OriginalRuntimeRooms {
  constructor(private readonly db:PgLegacyClient,private readonly now:number){}
  async transaction<T>(run:()=>Promise<T>):Promise<T>{
    await this.db.query('BEGIN',[]);
    try{
      await this.db.query("SELECT set_config('statement_timeout','10000',true),set_config('lock_timeout','5000',true)",[]);
      await this.db.query('SELECT pg_advisory_xact_lock($1,$2)',[20261029,0]);
      const result=await run();await this.db.query('COMMIT',[]);return result;
    }catch(e){await this.db.query('ROLLBACK',[]).catch(()=>undefined);throw e;}
  }
  async all():Promise<RuntimeRoomRow[]>{
    return (await this.db.query<RuntimeRoomRow>(`SELECT g.*,f.is_open,f.updated_at,f.owner_seen_at FROM ${BASE}.game g LEFT JOIN ${BASE}.runtime_room_flags f ON f.roomid=g.groomid ORDER BY g.groomid`,[])).rows;
  }
  private async save(row:RuntimeRoomRow,state:OriginalWaitingRoom,heartbeat:'touch'|'clear'|null=null):Promise<void>{
    await this.db.query(`UPDATE ${BASE}.game SET roomvars=$1 WHERE groomid=$2`,[await legacyEncode(state),Number(row.groomid)]);
    await this.db.query(`UPDATE ${BASE}.runtime_room_flags SET updated_at=$1,owner_seen_at=CASE WHEN $2='touch' THEN $1 WHEN $2='clear' THEN NULL ELSE owner_seen_at END WHERE roomid=$3`,[this.now,heartbeat,Number(row.groomid)]);
    await this.db.query(`DELETE FROM ${BASE}.roomlisteners WHERE roomid=$1 AND timestamp<$2`,[Number(row.groomid),state.timestamp]);
  }
  async find(id:number):Promise<RuntimeRoomResult|null>{
    const row=(await this.all()).find(r=>Number(r.groomid)===id);
    if(!row||!row.is_open||Number(row.groomstatus)===0)return null;
    const state=await legacyDecode<OriginalWaitingRoom>(row.roomvars);
    if(!state||!Array.isArray(state.player)||!types[state.roomtype])throw new Error('Invalid saved original room');
    return {id,state,row};
  }
  async create(typeId:number,user:string,constants:Readonly<Record<string,unknown>>):Promise<RuntimeRoomResult>{
    const type=types[typeId];if(!type)throw new OriginalRoomMessage('房间参数错误');
    if(!phpTruthy(type.available)||(type['available-start']&&this.now<Number(type['available-start']))||(type['available-end']&&this.now>Number(type['available-end']))||(type['req-mod']&&!Object.hasOwn(constants,'MOD_'+phpString(type['req-mod']).toUpperCase())))throw new OriginalRoomMessage('该房间类型暂不能使用');
    // Starting permanent/non-ready rooms invokes sys.routine immediately.
    // Keep the whole transaction uncommitted until that chain is implemented.
    if(type['without-ready'])throw new OriginalRoomStartNotPorted('Original immediate-start chain not yet ported');
    const rows=await this.all();let maximum=10,owned=0;const ownedByType=new Map<number,number>(),countByType=new Map<number,number>();
    for(const row of rows){
      const t=types[Number(row.groomtype)];if(t?.soleroom){maximum++;continue;}
      if(!row.is_open||(Number(row.groomtype)===14&&Number(row.groomstatus)===0))continue;
      const id=Number(row.groomtype),count=(countByType.get(id)??0)+1;countByType.set(id,count);
      if(t?.globalnum&&count>=Number(t.globalnum)&&id===typeId)throw new OriginalRoomMessage(`${phpString(t.name)}房间数目已达上限，请在其中任一房间游戏结束后再尝试创建房间！`);
      const data=await legacyDecode<OriginalWaitingRoom>(row.roomvars);
      if(Number(row.groomstatus)>0&&data.roomfounder===user){
        owned++;const n=(ownedByType.get(id)??0)+1;ownedByType.set(id,n);
        if(id===typeId&&!t?.['without-ready']&&t?.privatenum&&n>=Number(t.privatenum))throw new OriginalRoomMessage(`你已经创建了${t.privatenum}个${phpString(t.name)}房间，请在其中任一房间游戏结束后再尝试创建房间！`);
        else if(owned>=3)throw new OriginalRoomMessage('你已经创建了3个以上的房间，请在其中任一房间游戏结束后再尝试创建房间');
      }
    }
    let choice=0;
    for(let i=1;i<=maximum;i++){const row=rows.find(r=>Number(r.groomid)===i);if(!row||Number(row.groomstatus)===0){choice=i;break;}}
    if(!choice)throw new OriginalRoomMessage('房间数目已经达到上限，请加入一个已存在的房间');
    const state=originalRoomInit(typeId,user,types);state.player[0]!.name=user;
    await this.db.query(`INSERT INTO ${BASE}.game (groomid,groomstatus,groomtype,gametype,gamestate,roomvars,gamevars) VALUES($1,10,$2,$3,0,$4,'') ON CONFLICT(groomid) DO UPDATE SET groomstatus=10,groomtype=$2,gametype=$3,gamestate=0,roomvars=$4`,[choice,typeId,Number(type.gtype),await legacyEncode(state)]);
    await this.db.query(`INSERT INTO ${BASE}.runtime_room_flags(roomid,is_open,updated_at,owner_seen_at) VALUES($1,true,$2,$2) ON CONFLICT(roomid) DO UPDATE SET is_open=true,updated_at=$2,owner_seen_at=$2`,[choice,this.now]);
    await this.db.query(`DELETE FROM ${BASE}.roomlisteners WHERE roomid=$1`,[choice]);
    return this.enter(choice,user);
  }
  async enter(id:number,user:string):Promise<RuntimeRoomResult>{
    const all=await this.all(),raw=all.find(r=>Number(r.groomid)===id);
    if(!raw)throw new OriginalRoomMessage(`房间${id}数据记录不存在`);
    if(Number(raw.groomstatus)===0)throw new OriginalRoomMessage(`房间${id}已关闭`);
    if(!raw.is_open)throw new OriginalRoomMessage(`房间${id}缓存文件不存在`);
    const result=await this.find(id);if(!result)throw new Error('Room disappeared');
    if(types[Number(raw.groomtype)]?.['without-ready'])throw new OriginalRoomStartNotPorted('Original immediate-entry chain not yet ported');
    originalRoomChat(result.state,`<span class="grey b">${user}进入了房间</span><br>`);
    originalUpdateRoomState(result.state,Number(raw.groomstatus)>=40,this.now,types);
    await this.save(raw,result.state,result.state.player[0]?.name===user&&Number(raw.groomstatus)<40?'touch':null);
    return result;
  }
  async command(id:number,user:string,command:string,p1:string,p2:string):Promise<RuntimeRoomResult>{
    const result=await this.find(id);if(!result)throw new OriginalRoomMessage('房间开关文件不存在。');
    const {state,row}=result;
    const stamp=Number(row.owner_seen_at??row.updated_at);
    const fx=originalRoomCommand(state,command,p1,p2,user,this.now,Number(row.groomstatus),Number(row.gamestate),this.now-stamp>=300);
    if(fx.start)throw new OriginalRoomStartNotPorted('Original game initialization is incomplete');
    if(fx.save)await this.save(row,state,fx.heartbeat);
    else if(fx.heartbeat)await this.db.query(`UPDATE ${BASE}.runtime_room_flags SET owner_seen_at=$1 WHERE roomid=$2`,[fx.heartbeat==='touch'?this.now:null,id]);
    if(fx.close){await this.db.query(`UPDATE ${BASE}.game SET groomstatus=0,roomvars='' WHERE groomid=$1`,[id]);await this.db.query(`UPDATE ${BASE}.runtime_room_flags SET is_open=false WHERE roomid=$1`,[id]);}
    return {...result,leave:fx.leave};
  }
  async poll(id:number,user:string):Promise<RuntimeRoomResult|null>{
    const result=await this.find(id);if(result&&result.state.player[0]?.name===user)await this.db.query(`UPDATE ${BASE}.runtime_room_flags SET owner_seen_at=$1 WHERE roomid=$2`,[this.now,id]);return result;
  }
  async lobby():Promise<RuntimeRoomResult[]>{
    const result:RuntimeRoomResult[]=[];
    for(const row of await this.all()){
      if(Number(row.groomid)<=0||!row.is_open||Number(row.groomstatus)<=0)continue;
      const state=await legacyDecode<OriginalWaitingRoom>(row.roomvars);
      if(Number(row.groomstatus)>=40)throw new OriginalRoomStartNotPorted('Running room routine is not yet ported');
      const changed=originalUpdateRoomState(state,false,this.now,types)|originalRoomAutoKick(state,this.now,types);
      if(changed){originalUpdateRoomState(state,false,this.now,types);await this.save(row,state);}
      if(!originalRoomParticipants(state,types)[0]){
        await this.db.query(`UPDATE ${BASE}.game SET groomstatus=0 WHERE groomid=$1`,[Number(row.groomid)]);
        await this.db.query(`UPDATE ${BASE}.runtime_room_flags SET is_open=false WHERE roomid=$1`,[Number(row.groomid)]);continue;
      }
      result.push({id:Number(row.groomid),row,state});
    }
    return result;
  }
}
