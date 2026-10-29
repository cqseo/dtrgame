/**
 * Source-exact BASE trap probability and selection:
 * include/modules/base/items/trap/main.php discover -> trapcheck -> trapget.
 *
 * Critical: TWO random checks, first 0..99 < 40, then 0..39 compared to
 * 1.5 + trapCount/4. If hit and no traps, returns false; otherwise choose
 * rand(0,trapCount-1) from ORDER BY itmk DESC, delete tid before trap().
 *
 * The actual trap() damage/hit/miss/news/skill chain is not fabricated:
 * supplied as required handler; this port is NOT a finished trap module.
 */
export interface OriginalTrapRow {
 tid:number;
 pls:string|number;
 itm:string;itmk:string;itme:string|number;itms:string|number;itmsk:string;
}
export interface OriginalTrapPort<S> {
 randIntInclusive:(min:number,max:number)=>number;
 /** MUST yield source MySQL utf8_general_ci ORDER BY itmk DESC. */
 listTraps:(place:string|number)=>Promise<readonly OriginalTrapRow[]>|readonly OriginalTrapRow[];
 /** Source DELETE FROM maptrap WHERE tid='$tid' before trap resolution. */
 deleteTrap:(tid:number)=>Promise<boolean>|boolean;
 /** REQUIRED actual trapget/trap_hit/trap_miss original mechanics port. */
 resolveTrap:(state:S,chosen:OriginalTrapRow)=>Promise<S>|S;
 realTrapOddsChange?:(base:number,state:S)=>number;
 maxOdds?:number;
 minOdds?:number;
}
export interface OriginalTrapResult<S>{
 state:S;
 triggered:boolean;
 passedOuter:boolean;
 passedInner:boolean;
 selectedTid?:number;
 rollSequence:{min:number;max:number;value:number}[];
}
export function originalTrapEscapeRate(level:number,selfPlaced:boolean,bonus=0):number{
 const base=8+level/3+(selfPlaced?50:0)+bonus;
 return Math.min(90,base);
}
export function originalTrapReuseRate(level:number,selfPlaced:boolean):number{
 return 5+level/3+(selfPlaced?50:0);
}
export function originalTrapRealOdds(count:number,minOdds=1.5):number{
 if(!Number.isSafeInteger(count)||count<0)throw new RangeError("Trap count invalid");
 return minOdds+count/4;
}
export async function originalTrapCheck<S extends {pls:string|number}>(
 state:S,port:OriginalTrapPort<S>
):Promise<OriginalTrapResult<S>> {
 return originalTrapCore(state,port,false);
}
/**
 * ONLY call after base/items/trap discover() has already passed its own
 * rand(0,99) < trap_max_obbs check. Prevents double outer rolls when
 * composing with base/explore + event + trap $chprocess.
 */
export async function originalTrapCheckAfterOuter<S extends {pls:string|number}>(
 state:S,port:OriginalTrapPort<S>
):Promise<OriginalTrapResult<S>> {
 return originalTrapCore(state,port,true);
}
async function originalTrapCore<S extends {pls:string|number}>(
 state:S,port:OriginalTrapPort<S>,outerAlreadyPassed:boolean
):Promise<OriginalTrapResult<S>>{
 const steps:OriginalTrapResult<S>["rollSequence"]=[];
 const roll=(min:number,max:number)=>{
  const x=port.randIntInclusive(min,max);
  if(!Number.isInteger(x)||x<min||x>max)throw new RangeError("Invalid PHP rand(min,max)");
  steps.push({min,max,value:x});return x;
 };
 const max=port.maxOdds??40;
 const empty=(s:S,outer:boolean,inner:boolean):OriginalTrapResult<S>=>({
  state:s,triggered:false,passedOuter:outer,passedInner:inner,rollSequence:steps
 });
 if(!outerAlreadyPassed) {
   const outer=roll(0,99);
   if(!(outer<max))return empty(state,false,false);
 }
 // Source calculate_real_trap_obbs() separately calls the SQL count, then
 // trapcheck() subsequently loads trap list if the inner roll succeeds.
 const count=(await port.listTraps(state.pls)).length;
 const effective=port.realTrapOddsChange?.(originalTrapRealOdds(count,port.minOdds??1.5),state)
   ??originalTrapRealOdds(count,port.minOdds??1.5);
 const inner=roll(0,max-1);
 if(!(inner<effective))return empty(state,true,false);
 const traps=await port.listTraps(state.pls);
 if(traps.length===0)return empty(state,true,true);
 // Original SQL ORDER BY itmk DESC. Do not randomize pool before selection.
 // Preserve DB ordering exactly; JS localeCompare is NOT source MySQL collation.
 // The SQL adapter must implement original MySQL ORDER BY itmk DESC.
 const selected=traps[roll(0,traps.length-1)]!;
 if(!Number.isSafeInteger(selected.tid)||selected.tid<=0)throw new RangeError("Invalid source tid");
 if(!(await port.deleteTrap(selected.tid)))throw new Error("Selected original trap concurrently consumed");
 const next=await port.resolveTrap(state,selected);
 return {state:next,triggered:true,passedOuter:true,passedInner:true,
  selectedTid:selected.tid,rollSequence:steps};
}