import {it,expect}from 'vitest';import fs from 'node:fs';
import {registerOriginalSkillRuntime,type OriginalSkillRuntime}from '../src/original-skill-runtime';
import {OriginalPhpArray,type PackedPhpValue}from '../src/original-php-array';
import {OriginalModuleDispatcher}from '../src/original-module-dispatch';
const f=JSON.parse(fs.readFileSync(new URL('./fixtures/original-skill-bookkeeping-php.json',import.meta.url),'utf8'))as{cases:{isCurrent:boolean;acquired:number;noCover:number;operation:string;input:PackedPhpValue;player:PackedPhpValue;globalAcquired:PackedPhpValue;globalParameters:PackedPhpValue;returned:unknown;trace:string[];ppid:number}[]};
const names=['skill_acquire','skill_lost','skill_query','skill_setvalue','skill_getvalue','skill_delvalue','skill_enabled','skill_enabled_core','get_acquired_skill_array'];
const catalog=Object.fromEntries(names.map(name=>[name,[{name,module:'skillbase',magic:true}]]));
catalog.acquire4=[{name:'acquire4',module:'skill4',magic:true}];catalog.lost4=[{name:'lost4',module:'skill4',magic:true}];
for(const [i,c]of f.cases.entries())it(`PHP skill bookkeeping ${i}: ${c.operation} current=${c.isCurrent}`,async()=>{
 const player=Object.fromEntries(OriginalPhpArray.unpack(c.input)as OriginalPhpArray),trace:string[]=[],runtime:OriginalSkillRuntime={currentPlayer:{...player},currentPid:88,ppid:-1,acquired:new Map([[4,c.acquired]]),parameters:new Map<string,unknown>([['4_tsk_expire','123'],['4_eqpsk_flag',1]]),enabledModules:new Set(['skill4']),updateCurrentPlayer:async()=>{trace.push('update_sdata');}};
 const d=new OriginalModuleDispatcher(catalog);registerOriginalSkillRuntime(d,runtime);
 d.register('skill4','acquire4',async(ctx,value)=>{trace.push('acquire');const p=value as Record<string,unknown>;p.hp=Number(p.hp)+10;await ctx.call('skillbase','skill_setvalue',4,'count',1,p);});
 d.register('skill4','lost4',(_ctx,value)=>{trace.push('lost');const p=value as Record<string,unknown>;p.hp=Number(p.hp)-5;});
 const returned=await d.call('skillbase','skill_'+c.operation,4,player,c.noCover);
 expect(OriginalPhpArray.pack(player)).toEqual(c.player);expect(OriginalPhpArray.pack(runtime.acquired)).toEqual(c.globalAcquired);expect(OriginalPhpArray.pack(runtime.parameters)).toEqual(c.globalParameters);expect(returned??null).toEqual(c.returned);expect(trace).toEqual(c.trace);expect(runtime.ppid).toBe(c.ppid);
});
