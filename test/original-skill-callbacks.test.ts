import {it,expect}from 'vitest';import fs from 'node:fs';import {gunzipSync}from 'node:zlib';
import {OriginalModuleDispatcher}from '../src/original-module-dispatch';
import {originalHookCatalog}from '../src/generated/original-hook-catalog';
import {OriginalPhpArray,type PackedPhpValue}from '../src/original-php-array';
import {registerOriginalSkillCallbacks}from '../src/generated/original-skill-callbacks';
import {registerOriginalSkillRuntime}from '../src/original-skill-runtime';
import {OriginalPhpRandom}from '../src/original-random';
const fixture=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync(new URL('./fixtures/original-skill-callbacks-php.json.gz.base64',import.meta.url),'utf8'),'base64')).toString())as{cases:{module:string;name:string;variables:PackedPhpValue;input:PackedPhpValue;result:PackedPhpValue;returned:PackedPhpValue;nextRandom:number}[]};
const enabled=new Set(Object.values(originalHookCatalog).flat().map(x=>x.module));
for(const [i,c]of fixture.cases.entries())it(`source skill callback ${i}: ${c.module}/${c.name}`,async()=>{
 const random=new OriginalPhpRandom(42),variables=Object.fromEntries(OriginalPhpArray.unpack(c.variables)as OriginalPhpArray),player=Object.fromEntries(OriginalPhpArray.unpack(c.input)as OriginalPhpArray);
 const modules=Object.fromEntries([...enabled].map(name=>[name,{...variables}]));
 const d=new OriginalModuleDispatcher(originalHookCatalog,{modules,globals:variables,random});
 registerOriginalSkillRuntime(d,{currentPlayer:null,currentPid:0,ppid:0,acquired:new Map(),parameters:new Map(),enabledModules:enabled,updateCurrentPlayer:async()=>{throw new Error('Unexpected current-player load');}});
 registerOriginalSkillCallbacks(d);
 const returned=await d.call(c.module,c.name,player);
 expect(OriginalPhpArray.pack(player)).toEqual(c.result);expect(OriginalPhpArray.pack(returned)).toEqual(c.returned);expect(random.raw31()).toBe(c.nextRandom);
});
