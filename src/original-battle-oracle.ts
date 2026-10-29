/** QA fixture driver only. Synthetic strike/storage ports; never a production game adapter. */
import {OriginalBattleFlow,type OriginalBattlePlayer,type OriginalBattlePorts,type OriginalBattleContext} from './original-battle-flow';
import type {OriginalEncounterPlayer} from './original-player-discovery';
export type Player=OriginalBattlePlayer & OriginalEncounterPlayer;
export type Case={id:string;active:0|1;damage:Record<string,number>;counter:boolean;reflect?:boolean;revive?:number[];outOfRange?:number;message?:string};
export type BattleFixture={case:Case;input:{a:Player;d:Player};expected:unknown};
export function originalBattleOracle(c:Case,trace:unknown[][]){
  const t=(...a:unknown[])=>{trace.push(a);};
  const context:OriginalBattleContext<Player>={log:'',originalEnemy:null,enemy:null,battleTitle:'',main:'',cmd:''};
  const ports:OriginalBattlePorts<Player>={
    loadUserCommand:p=>t('user',p.pid),loadAutoCommand:p=>t('auto',p.pid),
    strikePrepare:(a,d,active)=>{t('prepare',a.pid,active);d.deathmark=20;delete a.seckill;delete d.seckill;},
    strike:(a,d,active)=>{t('strike',a.pid,active);a.dmg_dealt=c.damage[String(a.pid)]!;a.physical_dmg_dealt=a.dmg_dealt;a.battlelogflag_fixture=1;},
    strikeFinish:(a,d,active)=>t('finish',a.pid,active),
    damage:(a,d,active)=>{t('damage',a.pid,active);d.hp-=a.dmg_dealt!;},
    postDamage:(a,d,active)=>{t('post',a.pid,active);if(c.reflect){a.hp=0;a.deathmark=21;}},
    kill:(a,d)=>{t('kill',a.pid,d.pid);d.hp=0;if(c.revive?.includes(d.pid)){d.hp=1;d.state=0;t('revive',d.pid);}return '原版击杀台词';},
    canCounter:(a,d,active)=>{t('counter',a.pid,active);if(c.outOfRange!==undefined)a.out_of_range=c.outOfRange;return c.counter;},
    savePlayer:p=>t('save',p.pid,p.hp,p.state,p.action),loadCurrent:p=>t('current',p.pid),
    loadEnemy:p=>t('enemy',p.pid),saveEnemyLog:(p,text)=>t('enemylog',p.pid,text),
    addChat:(channel,text)=>t('chat',channel,text),initBattle:()=>t('init',1),
    renderResult:p=>{t('result',p.pid);return 'RESULT';},findCorpse:p=>{t('corpse',p.pid);return 'CORPSE';},
    renderNpcSkills:()=>{throw new Error('Unexpected NPC skill render');},
    meetmanTemplate:'original-meetman-template',message:c.message??'',clubbaseEnabled:false,
    around:async(name,a,d,active,next)=>{if(name==='assault_end')t('end',a.pid,active);else await next();},
  };
  return {flow:new OriginalBattleFlow(context,ports),context,ports};
}
