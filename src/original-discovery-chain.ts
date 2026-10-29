/**
 * ACFUN DTS discovery ORDER / probability gates only:
 * event -> trap -> metman -> itemmain -> explore base fallback.
 *
 * This is the original module override chain, not an invented single
 * probability formula. All actual event effects, trap damage/deletion,
 * NPC encounter and item pickup MUST come from their separate source
 * ports through injected hooks, with original random calls in order.
 */
export type OriginalDiscoveryMode="move"|"search"|"search2"|string;
export type OriginalDiscoveryStage="event"|"trap"|"metman"|"itemmain"|"empty";
export type OriginalRandom0to99=()=>number;
export interface OriginalDiscoverState {
 mode:string;
 log:string;
 hp:number;
 pose:number;
}
export interface OriginalDiscoverHooks<S extends OriginalDiscoverState>{
 random99:OriginalRandom0to99;
 eventAvailable?:()=>boolean;
 eventOdds?:()=>number;
 eventSpecial?:()=>boolean;
 eventMain?:(s:S)=>{state:S;occurred:boolean}|Promise<{state:S;occurred:boolean}>;
 continueAfterEvent?:(occurred:boolean,s:S)=>boolean;
 trapMaxOdds?:()=>number;
 trapCheck?:(s:S)=>{state:S;triggered:boolean}|Promise<{state:S;triggered:boolean}>;
 meetRate?:(schmode:OriginalDiscoveryMode)=>number;
 discoverPlayer?:(s:S)=>{state:S;found:boolean}|Promise<{state:S;found:boolean}>;
 continueAfterPlayer?:(found:boolean,s:S)=>boolean;
 itemOdds?:()=>number;
 itemOddsMultiplier?:()=>number;
 discoverItem?:(s:S)=>{state:S;found:boolean}|Promise<{state:S;found:boolean}>;
}
export const ORIGINAL_DISCOVERY_DEFAULTS={
 eventOdds:4, // original base/event/config/event.config.php; other modules may override
 trapMaxOdds:40,
 minMeetRate:20,
 itemOdds:60,
 itemMultiplier:1
} as const;
function roll(draw:OriginalRandom0to99):number {
 const n=draw();
 if(!Number.isInteger(n)||n<0||n>99)throw new RangeError("Original PHP rand(0,99) roll required");
 return n;
}
/**
 * Source original metman/main.php calculate_meetman_rate_by_mode:
 * 0 nearby players => 50% for each mode, otherwise pcount*3 capped 30
 * plus search 20 / move 40 / search2 100, then global 20% floor.
 */
export function originalMeetmanRate(mode:OriginalDiscoveryMode,nearby:number):number {
 if(!Number.isSafeInteger(nearby)||nearby<0)throw new RangeError("Invalid source player count");
 if(nearby===0 && (mode==="search"||mode==="move"||mode==="search2"))return 50;
 const extra=Math.min(30,nearby*3);
 if(mode==="search")return 20+extra;
 if(mode==="move")return 40+extra;
 if(mode==="search2")return 100;
 return 0;
}
export function originalTrapRealOdds(count:number,base=1.5):number{
 if(!Number.isSafeInteger(count)||count<0)throw new RangeError("Invalid original trap count");
 return base+count/4;
}
export function originalItemFindOdds(base:number,multiplier:number,buff=0):number {
 return buff+base*multiplier;
}
export interface OriginalDiscoveryResult<S> {
 state:S;
 discovered:boolean;
 stoppedAt:OriginalDiscoveryStage;
 invokedStages:OriginalDiscoveryStage[];
 rolls:number[];
}
/** Original stage override order; never fabricates combat, player, or item effects. */
export async function originalDiscover<S extends OriginalDiscoverState>(
 initial:S,schmode:OriginalDiscoveryMode,hooks:OriginalDiscoverHooks<S>
):Promise<OriginalDiscoveryResult<S>> {
 let state=initial;
 const steps:OriginalDiscoveryStage[]=[];
 const rolls:number[]=[];
 const nextRoll=()=>{const r=roll(hooks.random99);rolls.push(r);return r;};
 const stop=(stage:OriginalDiscoveryStage,discovered:boolean):OriginalDiscoveryResult<S> =>
   ({state,discovered,stoppedAt:stage,invokedStages:steps,rolls});
 steps.push("event");
 if((hooks.eventAvailable?.()??true) && (
   nextRoll()<(hooks.eventOdds?.()??ORIGINAL_DISCOVERY_DEFAULTS.eventOdds) ||
   (hooks.eventSpecial?.()??false)
 )) {
   if(!hooks.eventMain)throw new Error("Original event_main module not installed");
   const result=await hooks.eventMain(state);state=result.state;
   if(!(hooks.continueAfterEvent?.(result.occurred,state)??!result.occurred)){
     state={...state,mode:"command"};
     // Original event discover returns without a discovery value.
     return stop("event",false);
   }
 }
 steps.push("trap");
 if(nextRoll()<(hooks.trapMaxOdds?.()??ORIGINAL_DISCOVERY_DEFAULTS.trapMaxOdds)){
   if(!hooks.trapCheck)throw new Error("Original trapcheck module not installed");
   const result=await hooks.trapCheck(state);state=result.state;
   if(result.triggered)return stop("trap",false);
 }
 steps.push("metman");
 const metrate=Math.max(hooks.meetRate?.(schmode)??0,ORIGINAL_DISCOVERY_DEFAULTS.minMeetRate);
 if(nextRoll()<metrate){
   if(!hooks.discoverPlayer)throw new Error("Original discover_player module not installed");
   const result=await hooks.discoverPlayer(state);state=result.state;
   const continueAfter=hooks.continueAfterPlayer?.(result.found,state)
     ??(!result.found&&state.hp>0&&state.pose===3);
   if(!continueAfter)return stop("metman",result.found);
 }
 steps.push("itemmain");
 const odds=originalItemFindOdds(hooks.itemOdds?.()??ORIGINAL_DISCOVERY_DEFAULTS.itemOdds,
   hooks.itemOddsMultiplier?.()??1);
 if(nextRoll()<odds){
   if(!hooks.discoverItem)throw new Error("Original discover_item module not installed");
   const result=await hooks.discoverItem(state);state=result.state;
   return stop("itemmain",result.found);
 }
 steps.push("empty");
 state={...state,log:state.log+"但是什么都没有发现。<br>"};
 return stop("empty",false);
}