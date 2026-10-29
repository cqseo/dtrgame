import {it,expect}from 'vitest';import fs from 'node:fs';import {gunzipSync}from 'node:zlib';
import {OriginalPhpArray as A,type PackedPhpValue}from '../src/original-php-array';import {OriginalModuleDispatcher}from '../src/original-module-dispatch';import {originalHookCatalog}from '../src/generated/original-hook-catalog';import {registerOriginalPostAdmission}from '../src/generated/original-post-admission';
const f=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync(new URL('./fixtures/original-post-admission-php.json.gz.base64',import.meta.url),'utf8'),'base64')).toString())as{cases:{gametype:number;input:PackedPhpValue;result:PackedPhpValue;trace:PackedPhpValue;gamevars:PackedPhpValue}[]};
const a=(pairs:readonly(readonly[string|number,unknown])[])=>new A(pairs);
for(const [i,c]of f.cases.entries())it(`all original admission hooks ${i}: mode ${c.gametype}`,async()=>{
 const player=Object.fromEntries(A.unpack(c.input)as A),trace:unknown[]=[],gamevars=new A(),constants:Record<string,unknown>={};
 for(const id of [4,12,569,577,584,714,952,1003,1006,1001,901])constants['MOD_SKILL'+id]=true;
 constants.MOD_SKILL4_INFO='club;';constants.MOD_SKILL12_INFO='club;';constants.MOD_SKILL584_INFO='card;';
 const vars={gametype:c.gametype,now:1793232000,starttime:1793231900,validnum:7,gamevars,
  roomvars:a([['current_game_option',a([['lvl',15]])]]),cards:a([[0,a([['valid',a([['gamevars',a([['from_card',3]])]])]])]]),
  valid_skills:a([[c.gametype,a([[0,1001]])]]),achlist:a([['normal',a([[0,901]])]]),ach_allow_mode:a([[0,a([0,10,13,17,19,20,21].map((x,i)=>[i,x]))]]),cudata:new A(),tablepre:'isolated_',
  db:{query:async()=>{trace.push('query');return[];},num_rows:()=>0}};
 // Match the PHP harness exactly: retain the full 14-layer event chain and
 // use explicit synthetic terminal adapters for the effects under observation.
 const catalog={...originalHookCatalog};
 for(const [name,module]of Object.entries({skill_query:'skillbase',skill_acquire:'skillbase',skill_lost:'skillbase',skill_setvalue:'skillbase',get_acquired_skill_array:'skillbase',check_skill_info:'skillbase',lost569:'skill569',lost577:'skill577',skill952_sendin_core:'skill952',get_cardlist_energy_from_udata:'cardbase',check_achtype_available:'achievement_base',get_rand_task:'skill960',save_gameinfo:'sys',addnews:'sys'}))catalog[name]=[{name,module,magic:false}];
 const d=new OriginalModuleDispatcher(catalog,{modules:Object.fromEntries(['sys','player','skillbase','cardbase','achievement_base'].map(n=>[n,vars])),constants});
 registerOriginalPostAdmission(d);
 const map=(p:unknown,k:string)=>(p as Record<string,unknown>)[k]as A;
 d.register('skillbase','skill_query',(_ctx,id,p)=>!!map(p,'acquired_list').get(Number(id)));
 d.register('skillbase','skill_acquire',(_ctx,id,p)=>{trace.push(['acquire',id]);map(p,'acquired_list').set(Number(id),1);});
 d.register('skillbase','skill_lost',(_ctx,id,p)=>{trace.push(['lost',id]);map(p,'acquired_list').set(Number(id),0);});
 d.register('skillbase','skill_setvalue',(_ctx,id,key,value,p)=>{trace.push(['set',id,key,value]);map(p,'parameter_list').set(id+'_'+key,value);});
 d.register('skillbase','get_acquired_skill_array',(_ctx,p)=>[...map(p,'acquired_list')].filter(([,v])=>v).map(([k])=>k));
 d.register('skillbase','check_skill_info',()=>false);
 d.register('skill569','lost569',()=>{trace.push('lost569');});d.register('skill577','lost577',()=>{trace.push('lost577');});
 d.register('skill952','skill952_sendin_core',(_ctx,item)=>{trace.push(['senditem',item]);});
 d.register('cardbase','get_cardlist_energy_from_udata',()=>[new A(),new A(),a([[0,a([['blink',2]])]])]);
 d.register('achievement_base','check_achtype_available',()=>1);
 d.register('skill960','get_rand_task',(_ctx,_p,a,b)=>{trace.push(['task',a,b]);});
 // These synthetic endpoints capture admission side effects, not game saves.
 d.register('sys','save_gameinfo',()=>{trace.push('saveGame');});
 d.register('sys','addnews',(_ctx,...args)=>{trace.push(['news',args]);});
 await d.call('player','post_enterbattlefield_events',player);
 expect(A.pack(player)).toEqual(c.result);expect(A.pack(trace)).toEqual(c.trace);expect(A.pack(gamevars)).toEqual(c.gamevars);
});
