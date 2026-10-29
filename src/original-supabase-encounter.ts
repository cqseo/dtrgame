import type {PgLegacyClient} from "./original-supabase-db";
import type {OriginalEncounterPlayer} from "./original-player-discovery";
import {originalMeetmanRate} from "./original-player-discovery";
const TABLES:Readonly<Record<number,string>>={0:"players",1:"s1_players",2:"s2_players",3:"s3_players",4:"s4_players",5:"s5_players",6:"s6_players",8:"s8_players"};
function integer(n:number,min:number,max:number,label:string){
  if(!Number.isSafeInteger(n)||n<min||n>max)throw new RangeError("Invalid "+label);
}
/** MySQL unsigned INT became PG bigint; node-pg returns bigint as strings.
 * Normalize only declared numeric encounter fields, never item/text columns. */
export function decodeOriginalEncounterRow(row:Record<string,unknown>):OriginalEncounterPlayer{
  const decoded={...row};
  for(const [key,min,max] of [['pid',1,16777215],['pls',0,255],['hp',0,4294967295]] as const){
    const raw=row[key];
    if(typeof raw!=='number' && !(typeof raw==='string'&&/^\d+$/.test(raw)))throw new TypeError('Invalid original '+key);
    const value=Number(raw);integer(value,min,max,key);decoded[key]=value;
  }
  if(typeof row.name!=='string')throw new TypeError('Invalid original player name');
  return decoded as OriginalEncounterPlayer;
}
/** Room transaction/session is owned by the caller. These are raw rows, which
 * must pass through original player-fetch effects before battle or discovery. */
export class SupabaseOriginalEncounterStore {
  private readonly table:string;
  constructor(private readonly db:PgLegacyClient,room:number,purpose:"qa-only"){
    if(purpose!=="qa-only")throw new Error("Original encounter release not accepted");
    if(!Number.isSafeInteger(room)||!Object.hasOwn(TABLES,room))throw new RangeError("Invalid original room");
    this.table='acfun_legacy."'+TABLES[room]+'"';
  }
  async listCandidates(place:number,pid:number):Promise<OriginalEncounterPlayer[]>{
    integer(place,0,255,"place");integer(pid,1,16777215,"pid");
    return (await this.db.query<Record<string,unknown>>(
      'SELECT * FROM '+this.table+' WHERE pls=$1 AND pid!=$2',[place,pid])).rows.map(decodeOriginalEncounterRow);
  }
  async meetRate(mode:string,place:number,pid:number):Promise<number>{
    integer(place,0,255,"place");integer(pid,1,16777215,"pid");
    const r=await this.db.query<{count:string}>(
      'SELECT count(*)::text AS count FROM '+this.table+
      ' WHERE pls=$1 AND pid!=$2 AND (hp>0 OR corpse_clear_flag!=1)',[place,pid]);
    if(!r.rows[0])throw new Error("Encounter count query returned no row");
    return originalMeetmanRate(mode,Number(r.rows[0].count));
  }
}
