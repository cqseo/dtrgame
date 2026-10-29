import type {OriginalRoomTxClient}from './original-room-transaction';
import type {PgParameter}from './original-supabase-db';
import type {OriginalWorldStorage,WorldItemRow,WorldShopRow}from './original-world-population';
import {OriginalPhpArray as A}from './original-php-array';
import {originalMysqlUsernameKey}from './original-mysql-collation';
import {phpNumber,phpString}from './original-template-runtime';
const schema='acfun_runtime_qa_20261029';
type Kind='players'|'mapitem'|'maptrap'|'shopitem'|'chat'|'log'|'newsinfo';
const primary:Record<Kind,string>={players:'pid',mapitem:'iid',maptrap:'tid',shopitem:'sid',chat:'cid',log:'lid',newsinfo:'nid'};
interface Column extends Record<string,unknown>{column_name:string;data_type:string;column_default:string|null;is_identity:string;}
/** Explicit IDs reproduce source reset-to-1 behavior and roll back atomically.
 * No world object may escape its dedicated transaction and continue writing.
 */
export class SupabaseOriginalWorldStorage implements OriginalWorldStorage{
 private columns=new Map<Kind,Column[]>();private active=true;
 private constructor(readonly db:OriginalRoomTxClient,readonly roomId:number){}
 static async transaction<T>(db:OriginalRoomTxClient,id:number,run:(store:SupabaseOriginalWorldStorage)=>Promise<T>):Promise<T>{
  if(db.singleSession!==true)throw new Error('Dedicated world transaction required');
  if(!Number.isInteger(id)||id<0||id>12)throw new RangeError('Room not provisioned in QA');
  await db.query('BEGIN',[]);const store=new SupabaseOriginalWorldStorage(db,id);
  try{
   await db.query("SELECT set_config('statement_timeout','30000',true),set_config('lock_timeout','5000',true)",[]);
   // Same allocation lock as lobby/room commands until all use room-local locks.
   await db.query('SELECT pg_advisory_xact_lock($1,$2)',[20261029,0]);
   const result=await run(store);await db.query('COMMIT',[]);return result;
  }catch(error){await db.query('ROLLBACK',[]).catch(()=>undefined);throw error;}
  finally{store.active=false;}
 }
 private assertActive():void{if(!this.active)throw new Error('World transaction ended');}
 private table(kind:Kind):string{return schema+'."'+(this.roomId?'s'+this.roomId+'_':'')+kind+'"';}
 private async metadata(kind:Kind):Promise<Column[]>{
  const cached=this.columns.get(kind);if(cached)return cached;
  const name=(this.roomId?'s'+this.roomId+'_':'')+kind;
  const r=await this.db.query<Column>('SELECT column_name,data_type,column_default,is_identity FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2 ORDER BY ordinal_position',[schema,name]);
  if(!r.rows.length||r.rows.some(c=>!/^[A-Za-z_][A-Za-z0-9_]*$/.test(c.column_name)))throw new Error('Original QA table metadata missing');this.columns.set(kind,r.rows);return r.rows;
 }
 async reset(kind:Kind):Promise<void>{this.assertActive();await this.db.query('DELETE FROM '+this.table(kind),[]);const r=await this.db.query(`UPDATE ${schema}.runtime_room_sequences SET next_id=1 WHERE roomid=$1 AND table_kind=$2 RETURNING next_id`,[this.roomId,kind]);if(r.rows.length!==1)throw new Error('Missing original identity counter');}
 async resetPlayers():Promise<void>{await this.reset('players');}
 async resetShop():Promise<void>{await this.reset('shopitem');}
 async deleteNpcs():Promise<void>{this.assertActive();await this.db.query('DELETE FROM '+this.table('players')+' WHERE type>0',[]);}
 private async insert(kind:Kind,input:readonly Record<string,unknown>[]):Promise<void>{
  this.assertActive();if(!input.length)return;const columns=await this.metadata(kind),id=primary[kind],allowed=new Set(columns.map(c=>c.column_name));
  const rows=input.map(row=>{const result:Record<string,unknown>={};for(const[k,v]of Object.entries(row)){if(!allowed.has(k))throw new Error('Unformatted original row field: '+k);if(k!==id)result[k]=v;}
   for(const c of columns)if(c.column_default===null&&c.is_identity!=='YES'&&!Object.hasOwn(result,c.column_name))result[c.column_name]='';return result;});
  const keys=columns.map(c=>c.column_name).filter(k=>k===id||rows.some(r=>Object.hasOwn(r,k)));
  const counter=await this.db.query<{first_id:string|number}>(`UPDATE ${schema}.runtime_room_sequences SET next_id=next_id+$3 WHERE roomid=$1 AND table_kind=$2 RETURNING next_id-$3 AS first_id`,[this.roomId,kind,rows.length]);
  if(counter.rows.length!==1)throw new Error('Room identity counter missing');const first=Number(counter.rows[0]!.first_id);if(!Number.isSafeInteger(first+rows.length))throw new Error('Room identifier overflow');
  for(let start=0;start<rows.length;start+=200){const batch=rows.slice(start,start+200),params:PgParameter[]=[];
   const tuples=batch.map((row,i)=>'('+keys.map(key=>{
    if(key!==id&&!Object.hasOwn(row,key))return 'DEFAULT';const column=columns.find(c=>c.column_name===key)!;let value=key===id?first+start+i:row[key];
    if(['smallint','integer','bigint'].includes(column.data_type)){value=Math.trunc(phpNumber(value));if(!Number.isSafeInteger(value))throw new Error('Unsafe original numeric field');}
    else value=phpString(value);params.push(value as PgParameter);return '$'+params.length;
   }).join(',')+')');
   await this.db.query('INSERT INTO '+this.table(kind)+' ('+keys.map(k=>'"'+k+'"').join(',')+') OVERRIDING SYSTEM VALUE VALUES '+tuples.join(','),params);
  }
 }
 async insertNpc(player:A):Promise<void>{if(Number(player.get('type'))<=0)throw new Error('NPC insert requires non-player type');await this.insert('players',[Object.fromEntries(player)]);}
 async insertItems(rows:readonly WorldItemRow[]):Promise<void>{await this.insert('mapitem',rows.map(r=>({...r})));}
 async insertTraps(rows:readonly WorldItemRow[]):Promise<void>{await this.insert('maptrap',rows.map(r=>({...r})));}
 async insertShop(rows:readonly WorldShopRow[]):Promise<void>{await this.insert('shopitem',rows.map(r=>({...r})));}
 async npcOwner(name:string):Promise<number|null>{
  this.assertActive();const key=originalMysqlUsernameKey(name);if(key===null)return null;
  const rows=(await this.db.query<{pid:number;name:string}>('SELECT pid,name FROM '+this.table('players')+' WHERE type>0 ORDER BY pid',[])).rows;
  return rows.find(r=>originalMysqlUsernameKey(r.name)===key)?.pid??null;
 }
}
