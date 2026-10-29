import{it,expect}from'vitest';import fs from'node:fs';import{gunzipSync}from'node:zlib';
import{OriginalPhpArray as A,type PackedPhpValue}from'../src/original-php-array';import{OriginalModuleDispatcher}from'../src/original-module-dispatch';import{originalHookCatalog}from'../src/generated/original-hook-catalog';import{registerOriginalWorldConfigs}from'../src/original-world-configs';import{originalNpcConfigData,originalWorldFileRows,originalWorldModulePaths}from'../src/generated/original-world-config-data';
const f=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync(new URL('./fixtures/original-world-configs-php.json.gz.base64',import.meta.url),'utf8'),'base64')).toString())as{cases:{gametype:number;level:number;eventOn:boolean;npc:PackedPhpValue;map:string[];shop:string[];trap:string[]}[]};
for(const[i,c]of f.cases.entries())it(`original world config ${i}: mode ${c.gametype}, level ${c.level}, event ${c.eventOn}`,async()=>{
 const npc=A.unpack(originalNpcConfigData)as A,before=A.pack(npc),catalog={...originalHookCatalog,check_achtype_available:[{module:'achievement_base',name:'check_achtype_available',magic:false}]},d=new OriginalModuleDispatcher(catalog);
 registerOriginalWorldConfigs(d,{gametype:c.gametype,level:c.level,npcConfigs:npc,modulePaths:originalWorldModulePaths,files:originalWorldFileRows});d.register('achievement_base','check_achtype_available',()=>c.eventOn?1:0);
 expect(A.pack(await d.call('npc','get_npclist'))).toEqual(c.npc);
 expect(await d.call('itemmain','get_itemfilecont')).toEqual(c.map);expect(await d.call('itemshop','get_shopconfig')).toEqual(c.shop);expect(await d.call('trap','get_trapfilecont')).toEqual(c.trap);
 expect(A.pack(npc)).toEqual(before);
});
