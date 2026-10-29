/**
 * Original ACFUN DTS player/main.php revival mechanism (base).
 * This is a 1:1 base order dispatcher, not a replacement for every
 * skill/card/instance inherited revive_check / revive_veto handler.
 *
 * Original priority: set_revive_sequence -> (empty or veto?) -> ksort()
 * -> each revive_check -> pre_revive_events -> revive_events
 * -> post_revive_events -> stop. Source player.kill calls deathnews later.
 */
export interface OriginalReviveTarget {
  pid:number;
  type:number;
  hp:number;
  state:number;
  o_state?:number;
  npc_revived?:number;
}
export interface OriginalReviveCounters {deathnum:number;alivenum:number}
export interface OriginalReviveHooks<A,T extends OriginalReviveTarget>{
  /** Source override chain must supply registered revive_sequence entries. */
  setSequence:(attacker:A,target:T)=>Promise<ReadonlyMap<number,number>>|ReadonlyMap<number,number>;
  veto:(attacker:A,target:T)=>Promise<boolean>|boolean;
  check:(attacker:A,target:T,reviveKey:number)=>Promise<boolean>|boolean;
  pre?:(attacker:A,target:T,reviveKey:number)=>Promise<void>|void;
  post?:(attacker:A,target:T,reviveKey:number)=>Promise<void>|void;
  revive?:(attacker:A,target:T,reviveKey:number,counters:OriginalReviveCounters)=>Promise<void>|void;
  saveGameInfo:(counters:OriginalReviveCounters)=>Promise<void>|void;
}
export interface OriginalReviveResult<T extends OriginalReviveTarget> {
  target:T;
  revived:boolean;
  triggeredKey:number|null;
  checkedKeys:number[];
  sequenceEmpty:boolean;
  vetoed:boolean;
}
/**
 * Caller owns player and room transaction, not one transaction per callback.
 * The sequence's numeric values, not its priority keys, are tested.
 * Original PHP ksort() on integer map keys sorts lower priority first.
 */
export async function originalReviveProcess<A,T extends OriginalReviveTarget>(
 attacker:A,target:T,counters:OriginalReviveCounters,hooks:OriginalReviveHooks<A,T>
):Promise<OriginalReviveResult<T>>{
 const sequence=await hooks.setSequence(attacker,target);
 const entries=[...sequence.entries()];
 for(const [priority,key] of entries) {
  if(!Number.isSafeInteger(priority)||!Number.isSafeInteger(key))
   throw new RangeError("Original revive priority/key must be integers");
 }
 const checkedKeys:number[]=[];
 if(entries.length===0)return {target,revived:false,triggeredKey:null,checkedKeys,
   sequenceEmpty:true,vetoed:false};
 if(await hooks.veto(attacker,target))return {target,revived:false,triggeredKey:null,checkedKeys,
   sequenceEmpty:false,vetoed:true};
 for(const [,key] of entries.sort((a,b)=>a[0]-b[0])){
  checkedKeys.push(key);
  if(await hooks.check(attacker,target,key)){
   // Source default pre_revive_events records death state.
   target.o_state=target.state;
   if(hooks.pre)await hooks.pre(attacker,target,key);
   if(hooks.revive)await hooks.revive(attacker,target,key,counters);
   else {
    // Original base revive_events(): HP=1/state=0, death--, alive++,
    // NPCs get npc_revived=1; save_gameinfo in the same transaction.
    target.state=0;
    target.hp=1;
    counters.deathnum--;
    if(target.type===0)counters.alivenum++;
    else if(target.type>0)target.npc_revived=1;
    await hooks.saveGameInfo(counters);
   }
   if(hooks.post)await hooks.post(attacker,target,key);
   return {target,revived:true,triggeredKey:key,checkedKeys,
     sequenceEmpty:false,vetoed:false};
  }
 }
 return {target,revived:false,triggeredKey:null,checkedKeys,
   sequenceEmpty:false,vetoed:false};
}
