/**
 * Original ACFUN DTS command_game.php entry gate.
 *
 * Implements real auth, room assignment, original player lookup and game
 * mode selection; rendering the original templates and chat/news is a separate
 * mandatory next phase. Explicitly DOES NOT expose playable route or bypass
 * unported skillbase/player.init.
 *
 * Source: game.php -> render_page('command_game') ->
 * include/pages/command_game.php, include/roommng/room.func.php.
 */
import {
 legacyAuthenticateCookies,legacyReadCookiePair,
 type LegacyUserStore
} from "./original-login";
import {originalMysqlUsernameKey} from "./original-mysql-collation";
import type {PgLegacyClient} from "./original-supabase-db";
import type {OriginalGameRow} from "./original-supabase-game";
import {originalPlayerPreAct} from "./original-player-action";

const ROOM_PLAYERS:Readonly<Record<number,string>>={
 0:"players",1:"s1_players",2:"s2_players",3:"s3_players",
 4:"s4_players",5:"s5_players",6:"s6_players",8:"s8_players"
};
const ORIGINAL_TABLE_PREFIX="acbra2_";
export type OriginalGameEntryResult =
 | {kind:"no_login"}
 | {kind:"unsupported_room";roomId:number}
 | {kind:"redirect";url:"valid.php"|"end.php";roomId:number}
 | {kind:"player_password_resync_required";roomId:number;playerId:number}
 | {kind:"needs_original_template_renderer";roomId:number;
    gameNumber:number;playerId:number;playerMode:"death"|"rest"|"itemmain"|"command";
    deadFlagChanged:boolean;hpChanged:boolean};
export interface OriginalEntryPlayer {
 [field:string]:unknown;
 pid:number;name:string;pass:string;type:number;hp:number;state:number;
 player_dead_flag:number;itms0:string|number;
}
export interface OriginalGameEntryDeps {
 db:PgLegacyClient;
 users:LegacyUserStore;
 /** Game must be built only in an isolated QA environment. */
 purpose:"qa-only";
}
function phpTruthy(v:unknown):boolean {
 return !(v===undefined||v===null||v===false||v===0||v===""||v==="0");
}
/** PHP room_id2prefix() supports 0 plus actual s1-s6,s8 room numbers. */
export function originalRoomFromCookie(rawCookie:string,prefix=ORIGINAL_TABLE_PREFIX):number|null{
 const cookie=rawCookie.split(";").map(s=>s.trim()).find(s=>s.startsWith(prefix+"roomid="));
 if(!cookie)return 0;
 const encoded=cookie.slice((prefix+"roomid=").length);
 let value:string;
 try{value=decodeURIComponent(encoded);}catch{return null;}
 if(!/^(?:0|[1-9]\d*)$/.test(value))return null;
 const id=Number(value);
 if(!Number.isSafeInteger(id))return null;
 return Object.prototype.hasOwnProperty.call(ROOM_PLAYERS,id)?id:null;
}
/** Read-only entry decisions. Leaves authentic gameplay page unrendered. */
export async function originalResolveGameEntry(
 cookieHeader:string,deps:OriginalGameEntryDeps
):Promise<OriginalGameEntryResult>{
 if(deps.purpose!=="qa-only")throw new Error("Original game parity not accepted");
 const {username,cookiePassword}=legacyReadCookiePair(cookieHeader,ORIGINAL_TABLE_PREFIX);
 if(!username||!cookiePassword)return {kind:"no_login"};
 const user=await legacyAuthenticateCookies(cookieHeader,deps.users,ORIGINAL_TABLE_PREFIX);
 if(!user)return {kind:"no_login"};
 const roomId=originalRoomFromCookie(cookieHeader);
 if(roomId===null)return {kind:"unsupported_room",roomId:-1};
 const roomTable=ROOM_PLAYERS[roomId];
 if(!roomTable)throw new Error("Original room whitelist invalid");
 const nameKey=originalMysqlUsernameKey(user.username);
 if(!nameKey)throw new Error("Original UTF8 username weight unavailable");
 // Source MySQL name CHAR(15) compares in utf8_general_ci (accent insensitive).
 // Do not use Postgres exact equality (otherwise existing players disappear).
 const playerRows=await deps.db.query<OriginalEntryPlayer>(
  'SELECT pid,name,pass,type,hp,state,player_dead_flag,itms0 FROM acfun_legacy."'+
   roomTable+'" WHERE acfun_legacy.mysql_username_weight_key(name)=$1 AND type=0 LIMIT 1',
  [nameKey]
 );
 const player=playerRows.rows[0];
 // Source command_game.php checks player presence BEFORE game state.
 if(!player)return {kind:"redirect",url:"valid.php",roomId};
 const gameRows=await deps.db.query<OriginalGameRow & Record<string,unknown>>(
  "SELECT groomid,groomstatus,groomtype,gamenum,gamestate,roomvars,gamevars "+
  "FROM acfun_legacy.game WHERE groomid=$1 LIMIT 1",[roomId]
 );
 const game=gameRows.rows[0];
 if(!game)throw new Error("Original game row absent; do not invent room");
 // PHP resyncs player.pass to source user password before redirect logic.
 // A separate room transaction must write this; never silently skip the write.
 const currentUser=await deps.users.findByUsername(user.username);
 if(!currentUser)throw new Error("Authenticated source user disappeared");
 if(player.pass!==currentUser.password)
  return {kind:"player_password_resync_required",roomId,playerId:Number(player.pid)};
 if(Number(game.gamestate)===0)return {kind:"redirect",url:"end.php",roomId};
 // Source runs init_playerdata (and inherited player hooks) before this check.
 // We can apply base dead-flag parity, but cannot call this fully rendered.
 const hp0=Number(player.hp),flag0=Number(player.player_dead_flag);
 const checked=originalPlayerPreAct({
  hp:hp0,playerDeadFlag:flag0,state:Number(player.state),
  mode:"command",command:"",spCmd:"",motto:"",killmsg:"",lastword:""
 });
 if([4,5,6].includes(checked.state))return {kind:"redirect",url:"end.php",roomId};
 let playerMode: "death"|"rest"|"itemmain"|"command"="command";
 if(checked.hp<=0)playerMode="death";
 else if([1,2,3].includes(checked.state))playerMode="rest";
 else if(phpTruthy(player.itms0))playerMode="itemmain";
 return {kind:"needs_original_template_renderer",roomId,
  gameNumber:Number(game.gamenum),playerId:Number(player.pid),
  playerMode,deadFlagChanged:checked.playerDeadFlag!==flag0,
  hpChanged:checked.hp!==hp0};
}
