import {OriginalModuleDispatcher}from './original-module-dispatch';
import {callbackGet}from './original-skill-callback-runtime';
import {phpNumber,phpString,phpTruthy}from './original-template-runtime';
/** All installed skill-enable and skill-acquire overrides. */
export function registerOriginalSkillRules(d:OriginalModuleDispatcher,constants:Readonly<Record<string,unknown>>,appendLog:(text:string)=>void):void{
  d.register('skillbase','check_skill_info',(_ctx,id,tag)=>{
    const label=phpString(tag).replaceAll(';','')+';',key='MOD_SKILL'+phpString(id)+'_INFO';
    return Object.hasOwn(constants,key)&&phpString(constants[key]).includes(label);
  });
  for(const [module,flag,featuresSurvive]of [['ex_direct','direct_ignore_skills',true],['skill46','skill46_flag',true],['skill575','skill575_flag',true],['skill440','skill440_flag',false],['skill433','skill433_flag',true]]as const){
    d.register(module,'skill_enabled_core',async(ctx,idValue,p)=>{
      const id=Math.trunc(phpNumber(idValue));
      if(p!=null&&phpTruthy(callbackGet(p,flag))){
        const achievement=await ctx.call('skillbase','check_skill_info',id,'achievement'),hidden=await ctx.call('skillbase','check_skill_info',id,'hidden');
        if(!achievement&&!hidden&&(!featuresSurvive||!await ctx.call('skillbase','check_skill_info',id,'feature')))return 0;
      }
      return ctx.parent(id,p);
    });
  }
  d.register('skill513','skill_enabled',async(ctx,id,p)=>{
    let result=await ctx.parent(id,p);
    if(!phpTruthy(result)&&phpNumber(id)!==513&&phpTruthy(callbackGet(callbackGet(p,'acquired_list'),513))&&!phpTruthy(callbackGet(p,'npc_evolved'))){
      result=true;
      if(!phpTruthy(callbackGet(p,'skill513_log'))){appendLog('<span class="red b">「心墙」使技能不会被无效化！</span><br>');(p as Record<string,unknown>).skill513_log=1;}
    }
    return result;
  });
  for(const id of [461,803])d.register('skill'+id,'skill_acquire',async(ctx,skill,p,noCover)=>{
    if(await ctx.call('skillbase','check_skill_info',skill,'debuff')&&await ctx.call('skillbase','skill_query',id,p))return;
    return ctx.parent(skill,p,noCover);
  });
}
