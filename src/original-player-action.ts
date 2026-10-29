/**
 * Core of original ACFUN DTS player/main.php and command_act.php.
 * This file is the PURE player command/save planning layer only.
 * Actual $chprocess module hooks, lock pool, skillbase overrides,
 * DB writes, templates and daemon are intentionally not simulated.
 */
import {originalMysqlUsernameKey} from "./original-mysql-collation";

export type OriginalPlayerFieldValue=string|number|boolean|null;
export type OriginalPlayerRow=Record<string,OriginalPlayerFieldValue>;

export interface OriginalPlayerActionState {
  hp:number; state:number; playerDeadFlag:number;
  mode:string; command:string; spCmd:string;
  motto:string; killmsg:string; lastword:string;
}
export interface OriginalUserWords {motto:string;killmsg:string;lastword:string;}

/** player\\pre_act: dead flag always wins, then mark all hp<=0 as dead. */
export function originalPlayerPreAct<T extends OriginalPlayerActionState>(s:T):T {
  const hp=s.playerDeadFlag?0:s.hp;
  return {...s,hp,playerDeadFlag:hp<=0?1:s.playerDeadFlag};
}
/** player\\act, *not* the whole module chain; input.sp_cmd is injected. */
export function originalPlayerAct<T extends OriginalPlayerActionState>(s:T):T {
  if(s.command==="menu")return {...s,mode:"command"};
  if(s.mode==="command"&&s.command==="special")return {...s,mode:s.spCmd};
  return {...s};
}
/** player\\post_act always reloads these 3 fields from the user account. */
export function originalPlayerPostAct<T extends OriginalPlayerActionState>(
 s:T, user:OriginalUserWords
):T {
  return {...s,motto:user.motto,killmsg:user.killmsg,lastword:user.lastword};
}

/** Exact command_act.php player\\act gating, including state<0 acceptance. */
export function originalPlayerShouldAct(gamestate:number,hp:number,state:number):boolean {
  return gamestate>=20 && hp>0 && state<=3;
}
export type OriginalCommandDecision=
 | {kind:"no_login"}
 | {kind:"redirect";url:"valid.php"|"end.php"}
 | {kind:"run";allowPlayerAct:boolean};
export function originalCommandActDecision(
  cuser:string|null,cpass:string|null,
  playerExists:boolean,gamestate:number,hp:number,state:number
):OriginalCommandDecision {
  if(!cuser||!cpass)return {kind:"no_login"};
  if(!playerExists)return {kind:"redirect",url:"valid.php"};
  if(gamestate===0)return {kind:"redirect",url:"end.php"};
  return {kind:"run",allowPlayerAct:originalPlayerShouldAct(gamestate,hp,state)};
}

/**
 * player_save phase as a no-write SQL update PLAN, matching player/main.php.
 * Source order is: filter to db_player_structure, strict diff vs origin_pool,
 * unset pid, force death one-way, guard human write by both pid+name.
 * It does NOT execute SQL or override skillbase\\player_save.
 */
export interface OriginalPlayerSavePlan {
  shouldWrite:boolean;
  pid:OriginalPlayerFieldValue;
  name:OriginalPlayerFieldValue;
  requireHumanName:boolean;
  changes:OriginalPlayerRow;
  persistedOrigin:OriginalPlayerRow|null;
  nextPool:OriginalPlayerRow|null;
}
function phpIsset(row:OriginalPlayerRow,key:string):boolean {
  return Object.prototype.hasOwnProperty.call(row,key) && row[key]!==null;
}
function phpStrictlyEqual(a:OriginalPlayerFieldValue,b:OriginalPlayerFieldValue):boolean {
  return a===b;
}
function phpNumeric(v:OriginalPlayerFieldValue):number {
  if(typeof v==="number")return v;
  if(v===null||v===false)return 0;
  if(v===true)return 1;
  const str=String(v).trim();
  if(!str)return 0;
  // PHP uses numeric comparisons in hp<=0 and !type; PHP numeric-string coercion.
  const m=/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?/.exec(str);
  return m?Number(m[0]):0;
}
function phpFalsy(v:OriginalPlayerFieldValue):boolean {
  return v===null||v===false||v===0||v===""||v==="0";
}
export function originalPlanPlayerSave(
  player:OriginalPlayerRow,
  dbPlayerFields:readonly string[],
  originalPool:OriginalPlayerRow|null
):OriginalPlayerSavePlan {
  const pid=phpIsset(player,"pid")?player.pid!:null;
  const nextPool=pid!==null?{...player}:null;
  const noWrite={shouldWrite:false,pid,name:player.name??null,requireHumanName:false,
    changes:{},persistedOrigin:null,nextPool} satisfies OriginalPlayerSavePlan;
  if(pid===null)return noWrite;
  const allowed=new Set(dbPlayerFields);
  const formatted:OriginalPlayerRow={};
  for(const key of dbPlayerFields)
    if(allowed.has(key)&&phpIsset(player,key))formatted[key]=player[key]!;
  const diff:OriginalPlayerRow={};
  for(const [key,val] of Object.entries(formatted)) {
    if(!originalPool || !phpIsset(originalPool,key) ||
      !phpStrictlyEqual(originalPool[key]!,val))diff[key]=val;
  }
  delete diff.pid;
  if(phpNumeric(player.hp??null)<=0) {
    diff.player_dead_flag=1;
    if(nextPool)nextPool.player_dead_flag=1;
  }
  if(phpIsset(diff,"player_dead_flag")&&phpFalsy(diff.player_dead_flag!)){
    delete diff.player_dead_flag;
  }
  const shouldWrite=Object.keys(diff).length>0;
  return {
    shouldWrite,pid,name:player.name??null,
    requireHumanName:phpFalsy(player.type??null),
    changes:diff,
    persistedOrigin:shouldWrite?{...nextPool}:null,nextPool,
  };
}

/** Safe parameterized UPDATE layout, no raw player-controlled SQL identifiers. */
export interface OriginalPlayerSqlPlan {
  sql:string;args:OriginalPlayerFieldValue[];
}
export function originalPlayerSaveSql(
 roomTable:string, plan:OriginalPlayerSavePlan, dbFields:readonly string[]
):OriginalPlayerSqlPlan|null {
  if(!plan.shouldWrite||plan.pid===null)return null;
  if(!/^(players|s[1-6]_players|s8_players)$/.test(roomTable))
    throw new RangeError("Unrecognized original room-specific players table");
  const allowed=new Set(dbFields);
  const fields=Object.keys(plan.changes);
  if(fields.some(x=>!allowed.has(x)||!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(x)))
    throw new RangeError("Non-original player database column");
  const values=fields.map(c=>plan.changes[c]!);
  const set=fields.map((col,i)=>'"'+col+'"=$'+(i+1)).join(",");
  const pidNumber=Number(plan.pid);
  if(!Number.isSafeInteger(pidNumber)||pidNumber<=0||pidNumber>16777215)throw new RangeError("Invalid source pid");
  const args:OriginalPlayerFieldValue[]=[...values,pidNumber];
  let sql='UPDATE acfun_legacy."'+roomTable+'" SET '+set+
    ' WHERE "pid"=$'+args.length;
  if(plan.requireHumanName) {
    if(typeof plan.name!=="string"||!plan.name)throw new RangeError("Human player name is required");
    // Original MySQL players.name CHAR(15) uses utf8_general_ci; PG
    // default case-sensitive equality would silently change save behavior.
    const key=originalMysqlUsernameKey(plan.name);
    if(key===null)throw new RangeError("Invalid original MySQL human player name");
    args.push(key);
    sql+=' AND acfun_legacy.mysql_username_weight_key("name")=$'+args.length;
  }
  return {sql:sql+' RETURNING "pid"',args};
}