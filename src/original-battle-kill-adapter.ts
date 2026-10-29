/** Bridge clone-returning kill/revive implementation to PHP's by-reference
 * battle arrays. Caller supplies real news, revive skill and room save hooks. */
import {originalPlayerKillBase,type OriginalKillPlayer,type OriginalKillCounters,type OriginalKillHooks} from './original-player-kill';
function replaceOwn(target:OriginalKillPlayer,source:OriginalKillPlayer):void{
  for(const key of Object.keys(target))if(!Object.hasOwn(source,key))delete target[key];
  Object.assign(target,source);
}
export function originalBattleKillAdapter(counters:OriginalKillCounters,now:()=>number,hooks:OriginalKillHooks){
  return async(a:OriginalKillPlayer,d:OriginalKillPlayer):Promise<string>=>{
    const result=await originalPlayerKillBase(a,d,counters,now(),hooks);
    replaceOwn(a,result.attacker);
    if(a!==d)replaceOwn(d,result.victim);
    Object.assign(counters,result.counters);
    return result.message;
  };
}
