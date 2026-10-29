/**
 * Isolated Supabase/PostgreSQL ACFUN original map trap/item tables.
 * Performs only source-shaped selection/claim statements; the caller must
 * run a session-affine BEGIN/COMMIT transaction with real original action
 * hooks to ensure mapitem removal and player save succeed together.
 *
 * DO NOT use this against live rooms before original module acceptance.
 */
import type { PgLegacyClient } from "./original-supabase-db";
import type { OriginalTrapRow } from "./original-trap-select";
import type { OriginalMapItem } from "./original-item-discovery";
export type OriginalRoomIndex = 0|1|2|3|4|5|6|8;
const ROOM_SUFFIX:Readonly<Record<OriginalRoomIndex,string>>={
  0:"",1:"s1_",2:"s2_",3:"s3_",4:"s4_",5:"s5_",6:"s6_",8:"s8_"
};
function roomTable(room:number,kind:"maptrap"|"mapitem"):string {
 if(!Number.isInteger(room)||!Object.prototype.hasOwnProperty.call(ROOM_SUFFIX,room))
   throw new RangeError("Original ACFUN room number is invalid");
 return 'acfun_legacy."'+ROOM_SUFFIX[room as OriginalRoomIndex]+kind+'"';
}
function sourcePlace(value:string|number):number {
 const n=typeof value==="number"?value:Number(value);
 if(!Number.isInteger(n)||n<0||n>255)throw new RangeError("Invalid source map number");
 return n;
}
export class SupabaseOriginalDiscoveryStore {
 constructor(
  private readonly db:PgLegacyClient,
  private readonly room:OriginalRoomIndex,
  purpose:"qa-only"
 ){
  if(purpose!=="qa-only")throw new Error("Original encounter/item/trap gameplay not yet accepted");
  roomTable(room,"maptrap");
 }
 async listTraps(place:string|number):Promise<OriginalTrapRow[]> {
  const name=roomTable(this.room,"maptrap");
  // Source MySQL ORDER BY itmk DESC with utf8_general_ci; never JS localeCompare.
  const result=await this.db.query<OriginalTrapRow & Record<string,unknown>>(
   "SELECT tid,pls,itm,itmk,itme,itms,itmsk FROM "+name+
   ' WHERE pls=$1 ORDER BY acfun_legacy.mysql_username_weight_key(itmk) DESC',
   [sourcePlace(place)]
  );
  return result.rows;
 }
 async deleteTrap(tid:number):Promise<boolean> {
  if(!Number.isSafeInteger(tid)||tid<=0)throw new RangeError("Invalid original trap id");
  const result=await this.db.query<{tid:number}>(
   "DELETE FROM "+roomTable(this.room,"maptrap")+' WHERE tid=$1 RETURNING tid',[tid]
  );
  return result.rows.length===1;
 }
 async loadItems(place:string|number):Promise<OriginalMapItem[]> {
  const result=await this.db.query<OriginalMapItem & Record<string,unknown>>(
   "SELECT iid,pls,itm,itmk,itme,itms,itmsk FROM "+roomTable(this.room,"mapitem")+
   " WHERE pls=$1",[sourcePlace(place)]
  );
  return result.rows;
 }
 async deleteItem(iid:number):Promise<boolean> {
  if(!Number.isSafeInteger(iid)||iid<=0)throw new RangeError("Invalid original item id");
  const result=await this.db.query<{iid:number}>(
   "DELETE FROM "+roomTable(this.room,"mapitem")+' WHERE iid=$1 RETURNING iid',[iid]
  );
  return result.rows.length===1;
 }
}