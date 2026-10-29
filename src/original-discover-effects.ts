/**
 * Compose ORIGINAL base/explore discovery interception with source BASE
 * maptrap/mapitem handlers. Never roll trap outer probability twice.
 *
 * Caller must inject real event_main, discover_player, and trap() combat
 * hooks. Without them the source originalDiscover throws rather than
 * producing fictional gameplay. Real SQL implementation must use room
 * specific tables and a transaction/actor lock before accepting a mutation.
 */
import {
  originalTrapCheckAfterOuter,
  type OriginalTrapPort,
  type OriginalTrapRow
} from "./original-trap-select";
import {
  originalDiscoverItem,
  type OriginalItemDiscoveryPort,
  type OriginalItemFinding
} from "./original-item-discovery";
import type {
  OriginalDiscoverHooks,
  OriginalDiscoverState,
  OriginalDiscoveryMode
} from "./original-discovery-chain";
type CombinedState=OriginalItemFinding & OriginalDiscoverState;
export interface OriginalDiscoverEffectsPorts<S extends CombinedState> {
  trap:OriginalTrapPort<S>;
  item:OriginalItemDiscoveryPort<S>;
  eventAvailable?:()=>boolean;
  eventOdds?:()=>number;
  eventSpecial?:()=>boolean;
  eventMain?:(s:S)=>{state:S;occurred:boolean}|Promise<{state:S;occurred:boolean}>;
  continueAfterEvent?:(occurred:boolean,s:S)=>boolean;
  meetRate?:(mode:OriginalDiscoveryMode)=>number;
  itemOdds?:()=>number;
  itemOddsMultiplier?:()=>number;
  discoverPlayer?:(s:S)=>{state:S;found:boolean}|Promise<{state:S;found:boolean}>;
  continueAfterPlayer?:(found:boolean,s:S)=>boolean;
  /** Original source event/trap/metman/itemmain share THIS RNG stream. */
  random99:()=>number;
}
export function originalDiscoverBaseEffects<S extends CombinedState>(
 ports:OriginalDiscoverEffectsPorts<S>
):OriginalDiscoverHooks<S> {
  return {
    random99:ports.random99,
    ...(ports.eventAvailable?{eventAvailable:ports.eventAvailable}:{}),
    ...(ports.eventOdds?{eventOdds:ports.eventOdds}:{}),
    ...(ports.eventSpecial?{eventSpecial:ports.eventSpecial}:{}),
    ...(ports.eventMain?{eventMain:ports.eventMain}:{}),
    ...(ports.continueAfterEvent?{continueAfterEvent:ports.continueAfterEvent}:{}),
    trapMaxOdds:()=>ports.trap.maxOdds??40,
    trapCheck:async state=>{
      // The outer rand(0,99) was consumed in originalDiscover already.
      const result=await originalTrapCheckAfterOuter(state,ports.trap);
      return {state:result.state,triggered:result.triggered};
    },
    ...(ports.meetRate?{meetRate:ports.meetRate}:{}),
    ...(ports.discoverPlayer?{discoverPlayer:ports.discoverPlayer}:{}),
    ...(ports.continueAfterPlayer?{continueAfterPlayer:ports.continueAfterPlayer}:{}),
    itemOdds:ports.itemOdds??(()=>60),
    itemOddsMultiplier:ports.itemOddsMultiplier??(()=>1),
    discoverItem:async state=>{
      const result=await originalDiscoverItem(state,ports.item);
      return {state:result.state,found:result.found};
    }
  };
}