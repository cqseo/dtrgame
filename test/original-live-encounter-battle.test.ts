import {originalBattleOracle as battle,type Player,type Case,type BattleFixture} from '../src/original-battle-oracle';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {describe,it,expect} from 'vitest';
import {OriginalBattleFlow,type OriginalBattlePlayer,type OriginalBattlePorts,type OriginalBattleContext} from '../src/original-battle-flow';
import {originalDiscoverPlayer,originalPlayerDiscoverFilter,originalMeetmanRate,type OriginalEncounterPlayer} from '../src/original-player-discovery';
import {originalBattleKillAdapter} from '../src/original-battle-kill-adapter';
import type {OriginalKillPlayer} from '../src/original-player-kill';
import {originalReviveProcess} from '../src/original-revive-process';
import {originalEnemyAct,originalEnemyMeet,originalEnemyPostAct,originalEnemyInitiativeBase} from '../src/original-enemy-command';
type DiscoveryCase={id:string;candidates:Player[];fetched:Record<string,Player[]>;dice:number[]};
const fixtures=JSON.parse(gunzipSync(Buffer.from(readFileSync(new URL('./fixtures/original-live-encounter-battle.json.gz.base64',import.meta.url),'utf8').trim(),'base64')).toString('utf8')) as {
  battles:BattleFixture[];discoveries:{case:DiscoveryCase;expected:unknown}[];
  filters:{input:Player;expected:boolean}[];rates:{mode:string;count:number;expected:number}[];
  commands:{case:{id:string;command:string;mode:string;action:string;exists:boolean;enemy:Player;corpse:boolean};expected:unknown}[];
  initiative:{case:{dice:number[];type:number};expected:unknown}[];
};
describe('differential against actual unmodified PHP functions (synthetic effect ports)',()=>{
  for(const f of fixtures.commands)it(`enemy command ${f.case.id}`,async()=>{
    const c=f.case,player=structuredClone(fixtures.battles[0]!.input.a),trace:unknown[][]=[];
    player.action=c.action;const state={player,command:c.command,mode:c.mode,log:''};
    await originalEnemyAct(state,{
      exists:async()=>{trace.push(['exists']);return c.exists;},
      fetchPlayer:async id=>{trace.push(['fetch',id]);return structuredClone(c.enemy);},
      updateSdata:()=>{trace.push(['update']);},
      battle:async(a,d,active)=>{trace.push(['battle',a.pid,d.pid,active]);},
      checkCorpse:p=>{trace.push(['checkcorpse',p.pid]);return c.corpse;},
      findCorpse:p=>{trace.push(['corpse',p.pid]);},placeName:()=> '原版地图',
      next:()=>{trace.push(['next']);},
    });
    expect({player,mode:state.mode,log:state.log,trace}).toEqual(f.expected);
  });
  for(const [i,f] of fixtures.initiative.entries())it(`enemy initiative ${i}`,async()=>{
    const player=structuredClone(fixtures.battles[0]!.input.a),enemy=structuredClone(fixtures.battles[0]!.input.d);
    enemy.type=f.case.type;const trace:unknown[][]=[];
    await originalEnemyMeet(player,enemy,{
      base:originalEnemyInitiativeBase,multiplier:()=>1,change:(a,d,r)=>r,range:[10,99],random99:()=>f.case.dice[0]!,
      showEnemy:p=>{trace.push(['show',p.pid]);},battle:async(a,d,active)=>{trace.push(['battle',a.pid,d.pid,active]);},
      next:()=>{trace.push(['next']);},
    });
    expect({player,trace}).toEqual(f.expected);
  });
  it('clears enemy state only after post-act overrides, retaining an explicit keep flag',async()=>{
    const player=structuredClone(fixtures.battles[0]!.input.a);player.action='enemy2';
    const state={player,command:'menu',mode:'command',log:''};
    await originalEnemyPostAct(state,()=>{player.keep_enemy=1;});expect(player.action).toBe('enemy2');
    await originalEnemyPostAct(state,()=>{player.keep_enemy=0;});expect(player.action).toBe('');
    expect('keep_enemy' in player).toBe(false);
  });
  for(const f of fixtures.battles)it(`battle ${f.case.id} perspective=${f.case.active}`,async()=>{
    const {a,d}=structuredClone(f.input),trace:unknown[][]=[];
    const {flow,context}=battle(f.case,trace);
    await flow.run(a,d,f.case.active);
    expect({a,d,trace,context}).toEqual(f.expected);
  });
  for(const f of fixtures.discoveries)it(`discovery ${f.case.id}`,async()=>{
    const c=structuredClone(f.case),trace:unknown[][]=[],fetches:Record<number,number>={};
    const s={pid:1,pls:3,mode:'command',log:'',hideflag:false};
    const r=await originalDiscoverPlayer(s,{
      listCandidates:async()=>{trace.push(['candidates']);return c.candidates;},
      fetchPlayer:async id=>{trace.push(['fetch',id]);const i=fetches[id]??0;fetches[id]=i+1;const seq=c.fetched[String(id)]!;return structuredClone(seq[Math.min(i,seq.length-1)]!);},
      savePlayer:p=>{trace.push(['save',p.pid,p.hp,p.state,p.action]);},
      updateSdata:()=>{trace.push(['update']);},meetAlternative:p=>{trace.push(['meet',p.pid,p.hp]);},
      shuffle:rows=>[...rows].reverse(),random99:()=>{const d=c.dice.shift();if(d===undefined)throw new Error('RNG exhausted');return d;},
    });
    expect({found:r.found,log:s.log,mode:s.mode,hideflag:s.hideflag,trace}).toEqual(f.expected);
    expect(c.dice).toEqual([]);
  });
  it('matches PHP corpse filtering including string zero and unlimited durability',()=>{
    for(const f of fixtures.filters)expect(originalPlayerDiscoverFilter(f.input)).toBe(f.expected);
  });
  it('matches PHP encounter probabilities including empty corpse population',()=>{
    for(const f of fixtures.rates)expect(originalMeetmanRate(f.mode,f.count)).toBe(f.expected);
  });
  it('connects the existing death/revive implementation back to both battle references',async()=>{
    const input=structuredClone(fixtures.battles[0]!.input);
    const fill=(p:Player)=>Object.assign(p,{killnum:0,npckillnum:0,endtime:0,attackwith:'原版武器'}) as Player & OriginalKillPlayer;
    const a=fill(input.a),d=fill(input.d),counts={alivenum:2,deathnum:0};
    const trace:unknown[][]=[];
    const {context,ports}=battle({id:'bridge',active:1,damage:{1:150,2:10},counter:true},trace);
    const kill=originalBattleKillAdapter(counts,()=>123,{
      getKillMessage:()=> '原版击杀台词',saveGameInfo:()=>{},setReviveSequence:()=>{},
      processRevive:async(a,d,counters)=>{await originalReviveProcess(a,d,counters,{
        setSequence:()=>new Map([[1,42]]),veto:()=>false,check:()=>true,saveGameInfo:()=>{}
      });},deathNews:()=>{},revivePostDeathNews:()=>{}
    });
    ports.kill=(a,d)=>kill(a as Player & OriginalKillPlayer,d as Player & OriginalKillPlayer);
    await new OriginalBattleFlow(context,ports).run(a,d,1);
    expect(d.hp).toBe(1);expect(d.state).toBe(0);expect(a.hp).toBe(90);
    expect(d.counter_assaulted).toBe(1);expect(a.killnum).toBe(1);
    expect(counts).toEqual({alivenum:2,deathnum:0});
    expect(context.log).not.toContain('你对角色2说道');
  });
  it('does not continue to counter or render after a persistence failure',async()=>{
    const {a,d}=structuredClone(fixtures.battles[0]!.input),trace:unknown[][]=[];
    const {context,ports}=battle({id:'failure',active:1,damage:{1:150,2:10},counter:true},trace);
    ports.savePlayer=()=>{throw new Error('SAVE_FAILED');};
    await expect(new OriginalBattleFlow(context,ports).run(a,d,1)).rejects.toThrow('SAVE_FAILED');
    expect(trace.some(e=>['counter','result','corpse'].includes(String(e[0])))).toBe(false);
  });
});
