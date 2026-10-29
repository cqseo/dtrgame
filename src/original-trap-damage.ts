/**
 * Base original ACFUN DTS trap hit/miss core. Isolated pure phase runner.
 * SOURCE: include/modules/base/items/trap/main.php lines 88-321.
 *
 * IMPORTANT: this is the source BASE implementation, not the complete
 * inherited skill/instance/card trap() override chain. External hooks
 * must preserve original module precedence and same-room transaction.
 */
import type { OriginalTrapRow } from "./original-trap-select";

export interface OriginalTrapVictim {
  pid:number;
  name:string;
  hp:number;
  state:number;
  lvl:number;
  log:string;
  mode:string;
  itm0:string;
  itmk0:string;
  itme0:number;
  itms0:string|number;
  itmsk0:string;
}
export interface OriginalTrapOwner {
  pid:number;
  name:string;
  type:number;
}
export interface OriginalBaseTrapContext {
  trap:OriginalTrapRow;
  owner:OriginalTrapOwner|null;
  ownerIsSelf:boolean;
  now:number;
}
export interface OriginalTrapNews {
  kind:"trap"|"trapmiss";
  at:number;
  victim:string;
  owner:string;
  trapName:string;
  damage?:number;
}
export interface OriginalBaseTrapHook<S extends OriginalTrapVictim> {
  /** Single original rand(0,max) per branch with inclusive endpoints. */
  randIntInclusive:(min:number,max:number)=>number;
  /** Fully inherited trap/get_trap_escape_rate() may override base 8+lvl/3. */
  getEscapeRate?:(state:S,trap:OriginalTrapRow,ownerIsSelf:boolean)=>number;
  /** Fully inherited get_trap_damage() may override base trap strength. */
  getTrapDamage?:(state:S,trap:OriginalTrapRow,baseRoll:number)=>number;
  getTrapDamageMultipliers?:(state:S,trap:OriginalTrapRow,damage:number)=>number[];
  finalDamageUp?:(state:S,trap:OriginalTrapRow,damage:number)=>number;
  finalDamageDown?:(state:S,trap:OriginalTrapRow,damage:number)=>number;
  finalDamageChange?:(state:S,trap:OriginalTrapRow,damage:number)=>number;
  postTrapHit?:(state:S,trap:OriginalTrapRow,damage:number)=>Promise<S>|S;
  /** Required: original kill() + revive/achievements/news/save logic. */
  onLethalDamage?:(state:S,ctx:OriginalBaseTrapContext)=>Promise<S>|S;
  /** Actual logger/news must be transactional and source consistent. */
  emitNews?:(event:OriginalTrapNews)=>Promise<void>|void;
  /** Actual owner log (send_trap_enemylog) must be transactional. */
  sendOwnerLog?:(content:string,owner:OriginalTrapOwner)=>Promise<void>|void;
  /** Original calculation 5+level/3 (+50 for self) may be overridden. */
  getReuseRate?:(state:S,ownerIsSelf:boolean)=>number;
}
export interface OriginalBaseTrapResult<S>{
  state:S; hit:boolean; lethallyDamaged:boolean;
  outcome:"hit"|"miss_reuse"|"miss_break";
  damage:number;
  rolls:{min:number;max:number;value:number}[];
}
function asPhpNumeric(v:string|number):number {
 const n=Number(v);
 return Number.isFinite(n)?n:0;
}
function phpRoundPositive(n:number):number {
 return Math.floor(n+0.5);
}
function checkedRand(
 fn:(min:number,max:number)=>number, min:number,max:number,
 calls:{min:number;max:number;value:number}[]
):number {
 const value=fn(min,max);
 if(!Number.isInteger(value)||value<min||value>max)
  throw new RangeError("Expected original rand(min,max) integer");
 calls.push({min,max,value});
 return value;
}
function clearTrapHand<S extends OriginalTrapVictim>(s:S):S {
 return {...s,itm0:"",itmk0:"",itmsk0:"",itme0:0,itms0:0};
}
function trapPrefix<S extends OriginalTrapVictim>(
 s:S,ctx:OriginalBaseTrapContext
):string {
 if(ctx.ownerIsSelf)return "你自己设置的";
 return ctx.owner?'<span class="yellow b">'+ctx.owner.name+"</span>设置的":"";
}
function ownerLog<S extends OriginalTrapVictim>(
 s:S,ctx:OriginalBaseTrapContext,isHit:boolean
):string|null {
 if(!ctx.owner||ctx.ownerIsSelf)return null;
 if(isHit&&s.hp<=0)
  return '<span class="red b">'+s.name+"触发了你设置的陷阱"+ctx.trap.itm+"并被杀死了！</span><br>";
 if(isHit)
  return '<span class="yellow b">'+s.name+"触发了你设置的陷阱"+ctx.trap.itm+"！</span><br>";
 return '<span class="yellow b">'+s.name+"回避了你设置的陷阱"+ctx.trap.itm+"！</span><br>";
}
/** Hit resolution begins AFTER trapget deleted the chosen tid. */
export async function originalBaseTrapResolve<S extends OriginalTrapVictim>(
 initial:S,ctx:OriginalBaseTrapContext,hook:OriginalBaseTrapHook<S>
):Promise<OriginalBaseTrapResult<S>>{
 const rolls:OriginalBaseTrapResult<S>["rolls"]=[];
 const rand=(min:number,max:number)=>checkedRand(hook.randIntInclusive,min,max,rolls);
 const prefix=trapPrefix(initial,ctx);
 let escape=hook.getEscapeRate?.(initial,ctx.trap,ctx.ownerIsSelf)
   ??(8+initial.lvl/3+(ctx.ownerIsSelf?50:0));
 escape=Math.min(escape,90);
 const decision=rand(0,99);
 const news=(kind:OriginalTrapNews["kind"],damage?:number):OriginalTrapNews=>({
   kind,at:ctx.now,victim:initial.name,owner:ctx.owner?.name??"",
   trapName:ctx.trap.itm,...(damage===undefined?{}:{damage})
 });
 if(decision<escape){
   if(ctx.owner)await hook.emitNews?.(news("trapmiss"));
   const log=ownerLog(initial,ctx,false);
   if(log && ctx.owner)await hook.sendOwnerLog?.(log,ctx.owner);
   const reuse=hook.getReuseRate?.(initial,ctx.ownerIsSelf)
     ??(5+initial.lvl/3+(ctx.ownerIsSelf?50:0));
   const second=rand(0,99);
   if(second<reuse){
     return {state:{...initial,
       log:initial.log+"你发现了"+prefix+'陷阱<span class="yellow b">'+ctx.trap.itm+
       "</span>，不过你并没有触发它。陷阱看上去还可以重复使用。<br>",
       itmsk0:"",itmk0:ctx.trap.itmk.replaceAll("TO","TN"),mode:"itemfind"
     },hit:false,lethallyDamaged:false,outcome:"miss_reuse",damage:0,rolls};
   }
   return {state:{...clearTrapHand(initial),
     log:initial.log+"你发现了"+prefix+'陷阱<span class="yellow b">'+ctx.trap.itm+
     "</span>，不过你成功地回避了它。<br>",mode:"command"
   },hit:false,lethallyDamaged:false,outcome:"miss_break",damage:0,rolls};
 }
 // PHP rand(0, $itme0/2) truncates the positive fractional upper bound.
 const strength=asPhpNumeric(ctx.trap.itme);
 if(strength<0)throw new RangeError("Original trap strength cannot be negative");
 const baseRoll=rand(0,Math.trunc(strength/2));
 const base=phpRoundPositive(baseRoll+strength/2);
 let damage=hook.getTrapDamage?.(initial,ctx.trap,baseRoll)??base;
 let msg=initial.log+"糟糕，你触发了"+prefix+'陷阱<span class="yellow b">'+ctx.trap.itm+"</span>！";
 const multipliers=hook.getTrapDamageMultipliers?.(initial,ctx.trap,damage)??[];
 if(multipliers.length){
  let final=damage;let factors="";
  for(const m of multipliers){final*=m;factors+="×"+m;}
  final=Math.max(1,phpRoundPositive(final));
  msg+="你受到了"+damage+factors+'＝<span class="dmg">'+final+"</span>点伤害。<br>";
  damage=final;
 }else msg+='你受到了<span class="dmg">'+damage+"</span>点伤害！<br>";
 damage=hook.finalDamageUp?.(initial,ctx.trap,damage)??damage;
 damage=hook.finalDamageDown?.(initial,ctx.trap,damage)??damage;
 damage=hook.finalDamageChange?.(initial,ctx.trap,damage)??damage;
 let state={...initial,hp:initial.hp-damage,log:msg} as S;
 if(damage>0)state=(await hook.postTrapHit?.(state,ctx.trap,damage))??state;
 if(ctx.owner)await hook.emitNews?.(news("trap",damage));
 const log=ownerLog(state,ctx,true);
 if(log&&ctx.owner)await hook.sendOwnerLog?.(log,ctx.owner);
 const lethal=state.hp<=0;
 if(lethal){
   // This is a REQUIRED source player.kill + revive + news + stats callback.
   // Without the full original implementation fail hard, never invent death.
   if(!hook.onLethalDamage)throw new Error("ORIGINAL_PLAYER_KILL_REVIVE_NOT_IMPLEMENTED");
   state={...state,
     log:state.log+'<span class="red b">你被'+prefix+"陷阱杀死了！</span>",
     state:27} as S;
   state=await hook.onLethalDamage(state,ctx);
 }
 return {state:clearTrapHand(state),hit:true,lethallyDamaged:lethal,
   outcome:"hit",damage,rolls};
}
