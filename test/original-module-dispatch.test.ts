import {describe,it,expect} from 'vitest';import fs from 'node:fs';
import {OriginalModuleDispatcher,OriginalModuleMissing,type OriginalHookCatalog} from '../src/original-module-dispatch';
import {originalHookCatalog} from '../src/generated/original-hook-catalog';
const fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/original-dispatch-php.json',import.meta.url),'utf8')) as {cases:{module:string;function:string;input:number;result:number;state:{value:number};trace:string[]}[]};
const catalog:OriginalHookCatalog={calculate:['oracle_base','oracle_mid','oracle_top'].map(module=>({module,name:'calculate',magic:true})),helper:[{module:'oracle_mid',name:'helper',magic:false}]};
function instance(){
 const trace:string[]=[],dispatcher=new OriginalModuleDispatcher(catalog,{trace});
 dispatcher.register('oracle_base','calculate',(_ctx,data)=>{const x=data as {value:number};trace.push('base');x.value++;return x.value;});
 dispatcher.register('oracle_mid','calculate',async(ctx,data)=>{const x=data as {value:number};trace.push('mid:before');const n=Number(await ctx.parent(x));trace.push('mid:after');x.value*=2;return n+10;});
 dispatcher.register('oracle_top','calculate',async(ctx,data)=>{const x=data as {value:number};trace.push('top:before');const n=Number(await ctx.parent(x));trace.push('top:after');x.value+=100;return n+1000;});
 dispatcher.register('oracle_mid','helper',async(ctx,data)=>{trace.push('helper');return ctx.call('oracle_base','calculate',data);});
 return {dispatcher,trace};
}
describe('Actual PHP __MAGIC__ dispatch compatibility',()=>{
 for(const [i,c]of fixture.cases.entries())it(`source dispatcher case ${i}`,async()=>{const {dispatcher,trace}=instance(),state={value:c.input};expect(await dispatcher.call(c.module,c.function,state)).toBe(c.result);expect(state).toEqual(c.state);expect(trace).toEqual(c.trace);});
 it('keeps simultaneous request stacks and state separate across awaits',async()=>{
  const a=instance(),b=instance(),sa={value:1},sb={value:9};
  const [ra,rb]=await Promise.all([a.dispatcher.call('oracle_base','calculate',sa),b.dispatcher.call('oracle_mid','calculate',sb)]);
  expect([ra,rb]).toEqual([1012,1020]);expect([sa.value,sb.value]).toEqual([104,120]);expect(a.trace).toEqual(b.trace);
 });
 it('refuses unported overrides instead of falling through to simpler behavior',async()=>{
  const d=new OriginalModuleDispatcher(originalHookCatalog);d.register('sys','rs_game',()=>true);
  await expect(d.call('sys','rs_game',63)).rejects.toBeInstanceOf(OriginalModuleMissing);
  expect(d.missing('rs_game')).toContain('instance10\\rs_game');
 });
 it('preserves installed load order for actual start and admission hooks',()=>{
  expect(originalHookCatalog.rs_game?.map(h=>h.module)).toEqual(['sys','map','player','npc','itemmain','itemshop','trap','weather','instance6','gtype1','tutorial','randrecipe','instance3','instance11','instance5','instance10']);
  expect(originalHookCatalog.post_enterbattlefield_events).toHaveLength(14);
 });
});
