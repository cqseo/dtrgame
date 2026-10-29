/**
 * Original PHP core/sys/global.php save_gameinfo() base compatibility.
 * Preserves the room-info protection under ignore_room=1, and storage's
 * original gzip+base64 JSON fields. Does not replace skill overrides.
 * QA-only SQL plan; transaction is managed by originalWithRoomTransaction().
 */
import {legacyEncode} from "./original-protocol";
export type OriginalGameinfoValue=string|number|boolean|null|readonly number[]|unknown[]|Record<string,unknown>;
export type OriginalGameinfo=Record<string,OriginalGameinfoValue>;
export const ORIGINAL_GAMEINFO_FIELDS=[
 "gamenum","gametype","gamestate","groomid","groomtype","groomstatus",
 "starttime","afktime","validnum","alivenum","deathnum","combonum",
 "weather","hack","hdamage","hplayer","winmode","winner","areanum",
 "areatime","areawarn","arealist","noisevars","roomvars","gamevars"
] as const;
const ROOM_FIELDS=new Set(["groomid","groomtype","groomstatus","roomvars"]);
const GZIP_FIELDS=new Set(["noisevars","roomvars","gamevars"]);
const FIELD_SET=new Set<string>(ORIGINAL_GAMEINFO_FIELDS);
export interface OriginalGameinfoSql {
  sql:string;args:unknown[];serialized:OriginalGameinfo;
}
function boolPhp(value:unknown):boolean{
 return value!==null && value!==undefined && value!==false &&
 value!==0 && value!=="" && value!=="0";
}
/** Source's gameinfo_audit: only these four fields are normalized here. */
export function originalGameinfoAudit(input:OriginalGameinfo,now:number):OriginalGameinfo{
 const g={...input};
 if(typeof g.alivenum==="number"&&g.alivenum<0)g.alivenum=0;
 if(typeof g.deathnum==="number"&&g.deathnum<0)g.deathnum=0;
 if(!boolPhp(g.afktime))g.afktime=now;
 if(!boolPhp(g.hdamage))g.hdamage=0;
 if(!boolPhp(g.hplayer))g.hplayer="";
 return g;
}
export async function originalPrepareGameinfo(
 input:OriginalGameinfo,ignoreRoom=true
):Promise<OriginalGameinfo>{
 if(input.gamenum===undefined||input.gamestate===undefined)
  throw new Error("Original PHP save_gameinfo: gamenum/gamestate unavailable");
 const g:OriginalGameinfo={};
 for(const [k,v] of Object.entries(input)){
  if(!FIELD_SET.has(k))throw new RangeError("Non-source original gameinfo column");
  if(ignoreRoom&&ROOM_FIELDS.has(k))continue;
  if(k==="arealist"){
   if(!Array.isArray(v))throw new TypeError("Expected original arealist array");
   g[k]=v.join(",");
  } else if(GZIP_FIELDS.has(k)) {
   // Source saves gencode() compressed variables, never JSON.stringify directly.
   g[k]=await legacyEncode(v);
  } else g[k]=v;
 }
 return g;
}
export async function originalGameinfoSaveSql(
 input:OriginalGameinfo,roomId:number,now:number,ignoreRoom=true
):Promise<OriginalGameinfoSql> {
 if(!Number.isSafeInteger(roomId)||![0,1,2,3,4,5,6,8].includes(roomId))
   throw new RangeError("Unrecognized original DTS room id");
 const normalized=originalGameinfoAudit(input,now);
 const serialized=await originalPrepareGameinfo(normalized,ignoreRoom);
 const fields=Object.keys(serialized);
 if(!fields.length)throw new Error("Empty original gameinfo update");
 const args=fields.map(k=>serialized[k]);
 args.push(roomId);
 return {sql:'UPDATE acfun_legacy."game" SET '+
  fields.map((k,i)=>'"'+k+'"=$'+(i+1)).join(",")+
  ' WHERE groomid=$'+args.length+' RETURNING groomid',args,serialized};
}
