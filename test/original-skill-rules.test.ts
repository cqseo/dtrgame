import {it,expect}from 'vitest';import fs from 'node:fs';import {gunzipSync}from 'node:zlib';
import {OriginalPhpArray as A,type PackedPhpValue}from '../src/original-php-array';import {OriginalModuleDispatcher}from '../src/original-module-dispatch';import {originalHookCatalog}from '../src/generated/original-hook-catalog';import {registerOriginalSkillRuntime}from '../src/original-skill-runtime';import {registerOriginalSkillRules}from '../src/original-skill-rules';
const f=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync(new URL('./fixtures/original-skill-rules-php.json.gz.base64',import.meta.url),'utf8'),'base64')).toString())as{tags:Record<string,string>;cases:{kind:string;id:number;input:PackedPhpValue;result:unknown;player:PackedPhpValue;log:string}[]};
for(const [i,c]of f.cases.entries())it(`source skill disable/immunity ${i}`,async()=>{
 const player=Object.fromEntries(A.unpack(c.input)as A);let log='';const catalog={...originalHookCatalog};
 // Synthetic skill 781 is the effect endpoint in the PHP harness, while the
 // real skillbase/disable/acquire chains and all their source overrides remain.
 catalog.acquire781=[{module:'skill781',name:'acquire781',magic:false}];
 const d=new OriginalModuleDispatcher(catalog);registerOriginalSkillRuntime(d,{currentPlayer:null,currentPid:0,ppid:0,acquired:new Map(),parameters:new Map(),enabledModules:new Set(['skill781']),updateCurrentPlayer:async()=>{throw Error('Unexpected current player');}});
 registerOriginalSkillRules(d,Object.fromEntries(Object.entries(f.tags).map(([id,tag])=>['MOD_SKILL'+id+'_INFO',tag])),text=>{log+=text;});
 d.register('skill781','acquire781',(_ctx,p)=>{(p as Record<string,unknown>).applied=1;});
 const result=await d.call('skillbase','skill_'+c.kind,c.id,player);
 expect(result??null).toEqual(c.result);expect(A.pack(player)).toEqual(c.player);expect(log).toEqual(c.log);
});
