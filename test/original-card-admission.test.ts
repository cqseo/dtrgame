import {it,expect}from 'vitest';import fs from 'node:fs';import {gunzipSync}from 'node:zlib';
import {OriginalPhpArray,type PackedPhpValue}from '../src/original-php-array';
import {registerOriginalCardAdmission,type OriginalCardDefinition}from '../src/original-card-admission';
import {OriginalModuleDispatcher}from '../src/original-module-dispatch';import {OriginalPhpRandom}from '../src/original-random';import {originalHookCatalog}from '../src/generated/original-hook-catalog';
const f=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync(new URL('./fixtures/original-card-admission-php.json.gz.base64',import.meta.url),'utf8'),'base64')).toString())as{cards:PackedPhpValue;index:Record<string,number[]>;rareColors:Record<string,string>;cases:{id:number;seed:number;gametype:number;level:number|null;input:Record<string,unknown>;result:PackedPhpValue;nextRandom:number}[];selection:{gametype:number;level:number|null;input:number;result:number}[]};
const cardArray=OriginalPhpArray.unpack(f.cards)as OriginalPhpArray,cards=new Map<number,OriginalCardDefinition>();
for(const [id,value]of cardArray){const c=value as OriginalPhpArray;cards.set(Number(id),Object.fromEntries(c)as unknown as OriginalCardDefinition);}
function setup(gametype:number,level:number|null,seed:number){const d=new OriginalModuleDispatcher(originalHookCatalog),random=new OriginalPhpRandom(seed);registerOriginalCardAdmission(d,{gametype,level,cards,index:new Map(Object.entries(f.index)),rareColors:new Map(Object.entries(f.rareColors)),random,checkPlace:async p=>[0,1,2,3].includes(Number(p))?p:0});return {d,random};}
for(const [i,c]of f.cases.entries())it(`source card admission ${i}: card ${c.id}, mode ${c.gametype}, seed ${c.seed}`,async()=>{
 const {d,random}=setup(c.gametype,c.level,c.seed),input={...c.input};
 expect(d.missing('enter_battlefield_cardproc')).toEqual([]);
 const result=await d.call('cardbase','enter_battlefield_cardproc',input,c.id);
 expect(OriginalPhpArray.pack(result)).toEqual(c.result);
 expect(random.raw31()).toBe(c.nextRandom);expect(input).toEqual(c.input);
});
for(const [i,c]of f.selection.entries())it(`source card selection ${i}: mode ${c.gametype}, level ${c.level}`,async()=>{const {d}=setup(c.gametype,c.level,1);expect(await d.call('cardbase','get_enter_battlefield_card',c.input)).toBe(c.result);});
