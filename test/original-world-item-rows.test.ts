import{it,expect}from'vitest';import fs from'node:fs';import{gunzipSync}from'node:zlib';
import{OriginalModuleDispatcher}from'../src/original-module-dispatch';import{originalHookCatalog}from'../src/generated/original-hook-catalog';import{OriginalPhpArray as A}from'../src/original-php-array';import{registerOriginalWorldItemRows}from'../src/original-world-item-rows';import{originalWorldFileRows}from'../src/generated/original-world-config-data';
const f=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync(new URL('./fixtures/original-world-item-rows-php.json.gz.base64',import.meta.url),'utf8'),'base64')).toString())as{cases:{gametype:number;eventOn:boolean;kind:string;rows?:{line:string;index:number;result:unknown[]}[];lines?:string[];result?:unknown[][]}[]};
for(const[i,c]of f.cases.entries())it(`original complete item-row group ${i}: ${c.kind} mode ${c.gametype}`,async()=>{
 const catalog={...originalHookCatalog,check_achtype_available:[{module:'achievement_base',name:'check_achtype_available',magic:false}]},d=new OriginalModuleDispatcher(catalog);
 registerOriginalWorldItemRows(d,{gametype:c.gametype,gamevars:new A([['instance10_stage',2]]),baseShop:originalWorldFileRows['include/modules/base/itemshop/config/shopitem.config.php']!,poisonEnabled:true,digitAttributesEnabled:true,npcOwner:async name=>name==='owner'?88:null});
 d.register('achievement_base','check_achtype_available',()=>c.eventOn?1:0);
 if(c.kind==='map')for(const row of c.rows!)expect(await d.call('itemmain','mapitem_row_data_seperate',row.line,row.index)).toEqual(row.result);
 else expect(await d.call('itemshop','get_shopitem_list',c.lines)).toEqual(c.result);
});
