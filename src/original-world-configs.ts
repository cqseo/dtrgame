import{OriginalModuleDispatcher}from'./original-module-dispatch';
import{OriginalPhpArray as A}from'./original-php-array';
import{phpNumber}from'./original-template-runtime';
export interface OriginalWorldConfigPorts {
 gametype:number;level:number;npcConfigs:A;modulePaths:Readonly<Record<string,string>>;files:Readonly<Record<string,readonly string[]>>;
}
function copy(value:unknown):unknown{return value instanceof Map?new A([...value].map(([k,v])=>[k,copy(v)])):value;}
export function registerOriginalWorldConfigs(d:OriginalModuleDispatcher,p:OriginalWorldConfigPorts):void{
 const modes:Readonly<Record<string,number>>={instance6:16,instance8:18,instance7:17,gtype1:1,instance9:19,instance3:13,instance11:21,instance5:15,instance10:20};
 const npc=(module:string,key:string):A=>{const m=p.npcConfigs.get(module)as A|undefined,value=m?.get(key);if(!(value instanceof A))throw new Error('Missing original NPC config '+module+'/'+key);return copy(value)as A;};
 d.register('npc','get_npclist',()=>npc('npc','npcinfo'));
 for(const[module,mode]of Object.entries(modes))d.register(module,'get_npclist',ctx=>{
  if(p.gametype!==mode)return ctx.parent();const data=npc(module,'npcinfo_'+module);
  if(module==='instance3'&&p.level>10){const sub=(data.get(1)as A).get('sub')as A;(sub.get(0)as A).set('name','红暮 DUMMY');}return data;
 });
 d.register('aprilfool2018','get_npclist',async ctx=>{const result=await ctx.parent()as A;if([0,4].includes(p.gametype)&&phpNumber(await ctx.call('achievement_base','check_achtype_available',34))===1)for(const[k,v]of npc('aprilfool2018','snpcinfo'))result.set(k,v);return result;});
 const file=(module:string,name:string):readonly string[]=>{const path='include/modules/'+p.modulePaths[module]+'config/'+name+'.config.php',data=p.files[path];if(!data)throw new Error('Missing original world file '+path);return [...data];};
 const specs=[['get_itemfilecont','itemmain','mapitem',['instance8','instance7','instance9','instance3','instance11','instance10']],['get_shopconfig','itemshop','shopitem',['instance6','instance8','instance7','gtype1','instance9','instance3','instance11','instance5','instance10']],['get_trapfilecont','trap','trapitem',['instance8','instance7','instance9','instance11','instance10']]]as const;
 for(const[hook,base,name,overrides]of specs){d.register(base,hook,()=>file(base,name));for(const module of overrides)d.register(module,hook,ctx=>p.gametype===modes[module]?file(module,name):ctx.parent());}
}
