/** Cloudflare QA only: actual PHP-produced fixtures, synthetic external effects. */
import {originalBattleOracle,type BattleFixture} from './original-battle-oracle';
import {ORIGINAL_BATTLE_GOLDEN} from './generated/original-battle-golden';
function canonical(value:unknown):string{
  if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
  if(value!==null&&typeof value==='object')return '{'+Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}';
  return JSON.stringify(value)??'null';
}
export async function runOriginalEncounterBattleSelftest(){
  const errors:string[]=[];
  const fixtures=ORIGINAL_BATTLE_GOLDEN as unknown as BattleFixture[];
  for(const f of fixtures){
    const {a,d}=structuredClone(f.input),trace:unknown[][]=[];
    const {flow,context}=originalBattleOracle(f.case,trace);
    await flow.run(a,d,f.case.active);
    if(canonical({a,d,trace,context})!==canonical(f.expected))errors.push(f.case.id+':'+f.case.active);
  }
  return {pass:errors.length===0,checks:fixtures.length,gamePlayable:false,syntheticOnly:true,
    productionDataAccess:false,source:'unmodified PHP battle/attack functions with synthetic effect ports',errors};
}
