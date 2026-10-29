import {OriginalModuleDispatcher}from './original-module-dispatch';
import {OriginalPhpArray}from './original-php-array';
import {phpNumber,phpString,phpTruthy}from './original-template-runtime';
export type OriginalSkillPlayer=Record<string,unknown>;
export interface OriginalSkillRuntime {
 currentPlayer:OriginalSkillPlayer|null;currentPid:number;ppid:number;
 acquired:Map<number,number>;parameters:Map<string,unknown>;enabledModules:ReadonlySet<string>;
 updateCurrentPlayer():Promise<void>;
}
function player(p:unknown):OriginalSkillPlayer {if(!p||typeof p!=='object'||p instanceof Map)throw new Error('Skill player unavailable');return p as OriginalSkillPlayer;}
function map(p:OriginalSkillPlayer,key:string):Map<string|number,unknown>{let m=p[key];if(m==null){m=new OriginalPhpArray();p[key]=m;}if(!(m instanceof Map))throw new Error('Unloaded original skill map: '+key);return m;}
/** Native skill bookkeeping. Callback semantics remain dispatched through the
 * installed hooks; missing callbacks/effects fail the enclosing transaction.
 */
export function registerOriginalSkillRuntime(d:OriginalModuleDispatcher,r:OriginalSkillRuntime):void {
 const current=(p:unknown,query=false)=>p==null||phpTruthy((p as OriginalSkillPlayer).pid)&&Number((p as OriginalSkillPlayer).pid)===(query?r.ppid:r.currentPid);
 const initializePid=()=>{if(r.ppid===-1&&r.currentPid)r.ppid=r.currentPid;};
 d.register('skillbase','skill_setvalue',(_ctx,id,key,value,p)=>{initializePid();const params=current(p,true)?r.parameters:map(player(p),'parameter_list');params.set(phpString(id)+'_'+phpString(key),value);});
 d.register('skillbase','skill_getvalue',(_ctx,id,key,p)=>{initializePid();const params=current(p,true)?r.parameters:map(player(p),'parameter_list');return params.get(phpString(id)+'_'+phpString(key))??null;});
 d.register('skillbase','skill_delvalue',(_ctx,id,key,p)=>{initializePid();const params=p==null||Number((p as OriginalSkillPlayer).pid)===r.ppid?r.parameters:map(player(p),'parameter_list');params.delete(phpString(id)+'_'+phpString(key));});
 d.register('skillbase','skill_acquire',async(ctx,idValue,pValue,noCover)=>{
   const id=Math.trunc(phpNumber(idValue));let p=pValue;
   if(p==null){await r.updateCurrentPlayer();p={...player(r.currentPlayer)};}
   const acquired=current(p)?r.acquired:map(player(p),'acquired_list'),already=phpTruthy(acquired.get(id));
   if(!already)acquired.set(id,1);
   if(r.enabledModules.has('skill'+id)&&!(already&&phpTruthy(noCover)))await ctx.call('skill'+id,'acquire'+id,p);
   await ctx.call('skillbase','skill_delvalue',id,'tsk_expire',p);await ctx.call('skillbase','skill_delvalue',id,'eqpsk_flag',p);
 });
 d.register('skillbase','skill_lost',async(ctx,idValue,pValue)=>{
   const id=Math.trunc(phpNumber(idValue));let p=pValue;
   if(p==null){await r.updateCurrentPlayer();p={...player(r.currentPlayer)};}
   const acquired=Number(player(p).pid)===r.currentPid?r.acquired:map(player(p),'acquired_list');
   if(phpTruthy(acquired.get(id))){acquired.set(id,0);if(r.enabledModules.has('skill'+id))await ctx.call('skill'+id,'lost'+id,p);}
 });
 d.register('skillbase','get_acquired_skill_array',(_ctx,p)=>{initializePid();const acquired=current(p,true)?r.acquired:map(player(p),'acquired_list');return [...acquired].filter(([,value])=>phpNumber(value)===1).map(([key])=>key);});
 d.register('skillbase','skill_query',async(ctx,idValue,p)=>{initializePid();const id=Math.trunc(phpNumber(idValue)),acquired=current(p,true)?r.acquired:map(player(p),'acquired_list');return phpTruthy(acquired.get(id))&&await ctx.call('skillbase','skill_enabled',id,current(p,true)?r.currentPlayer:p);});
 d.register('skillbase','skill_enabled', (ctx,id,p)=>ctx.call('skillbase','skill_enabled_core',id,p));
 d.register('skillbase','skill_enabled_core',()=>true);
}
