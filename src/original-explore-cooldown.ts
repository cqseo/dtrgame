/**
 * Original base/cooldown::move/search WRAPS base/explore::move/search.
 * Cooldown is set before base exploration validates location or stamina.
 * This composition requires an actual injected discovery chain; it refuses
 * to silently skip original event/trap/player/item effects.
 */
import {
 originalCooldownBeforeAction,originalCooldownPostAct,type OriginalCooldownState
} from "./original-cooldown";
import {
 originalMove,originalSearch,type OriginalExploreState,
 type OriginalMapState,type OriginalPlsNo,type OriginalExploreHooks
} from "./original-explore-map";
import {originalDiscover,type OriginalDiscoverHooks,type OriginalDiscoverState} from "./original-discovery-chain";

export type OriginalExploreActor = OriginalExploreState & OriginalDiscoverState;
export interface OriginalExploreCooldownRun<T extends OriginalExploreActor>{
  player:T;
  cooldown:OriginalCooldownState;
  action:"move"|"search";
  accepted:boolean;
  executed:boolean;
  discovery?: {stage:string;found:boolean};
}
export interface OriginalExploreCooldownInput<T extends OriginalExploreActor> {
  player:T;
  cooldown:OriginalCooldownState;
  map:OriginalMapState;
  action:"move"|"search";
  destination?:OriginalPlsNo;
  nowMs:number;
  pageStartMs:number;
  // Original skill/weather/instance cost and can-enter override chain.
  baseHooks?:Omit<OriginalExploreHooks<T>,"moveToArea"|"searchArea">;
  // Original event/trap/metman/itemmain hooks MUST be implemented, not guessed.
  discovery:OriginalDiscoverHooks<T>;
}
export async function originalExploreWithCooldown<T extends OriginalExploreActor>(
  input:OriginalExploreCooldownInput<T>
):Promise<OriginalExploreCooldownRun<T>> {
 const started=originalCooldownBeforeAction(input.cooldown,input.action,input.nowMs);
 let player=input.player;
 let accepted=false;
 let executed=false;
 let discovery:{stage:string;found:boolean}|undefined;
 if(started.blocked){
   player={...player,mode:started.state.mode,log:player.log+
     started.state.log.slice(input.cooldown.log.length)} as T;
 }else{
   const onDiscover=async(state:T,mode:"move"|"search")=>{
     const d=await originalDiscover(state,mode,input.discovery);
     discovery={stage:d.stoppedAt,found:d.discovered};
     return d.state;
   };
   const hooks:OriginalExploreHooks<T>={
     ...(input.baseHooks??{}),
     moveToArea:(s)=>onDiscover(s,"move"),
     searchArea:(s)=>onDiscover(s,"search")
   };
   if(input.action==="move"){
     const result=await originalMove(player,input.map,input.destination??99,hooks);
     player=result.state;accepted=result.moved;
   }else{
     const result=await originalSearch(player,input.map,hooks);
     player=result.state;accepted=result.searched;
   }
   executed=true; // original cooldown module called the parent move/search
 }
 const cooldown=originalCooldownPostAct(started.state,input.pageStartMs,input.nowMs);
 return {player,cooldown,action:input.action,accepted,executed,
   ...(discovery?{discovery}:{})};
}