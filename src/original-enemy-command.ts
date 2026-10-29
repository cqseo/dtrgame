/** Original base/enemy/main.php request and initiative transitions. This joins
 * the encounter pipeline to OriginalBattleFlow, retaining the existing commands. */
import type {OriginalBattlePlayer,OriginalBattleActive} from './original-battle-flow';
import {originalPhpTruthy} from './original-player-discovery';
type Awaitable<T>=T|Promise<T>;
export interface OriginalEnemyPlayer extends OriginalBattlePlayer {pls:number;keep_enemy?:number;active_words?:string;}
export interface OriginalEnemyCommandState<P extends OriginalEnemyPlayer>{
  player:P;mode:string;command:string;log:string;
}
export interface OriginalEnemyPorts<P extends OriginalEnemyPlayer>{
  exists:(rawId:string)=>Promise<boolean>;
  fetchPlayer:(rawId:string)=>Promise<P>;
  updateSdata:()=>Awaitable<void>;
  battle:(a:P,d:P,active:OriginalBattleActive)=>Promise<void>;
  checkCorpse:(p:P)=>Awaitable<boolean>;
  findCorpse:(p:P)=>Awaitable<void>;
  placeName:(place:number)=>string;
  next:()=>Awaitable<void>;
}
export async function originalEnemyAct<P extends OriginalEnemyPlayer>(s:OriginalEnemyCommandState<P>,ports:OriginalEnemyPorts<P>):Promise<void>{
  if(s.command==='enter')s.player.keep_enemy=1;
  if(s.mode!=='combat'){await ports.next();return;}
  if(s.command==='back'){s.log+='你逃跑了。';s.mode='command';return;}
  const id=s.player.action.replaceAll('enemy','');
  if(!originalPhpTruthy(id)||!s.player.action.includes('enemy')){
    s.log+='<span class="yellow b">你没有遇到敌人，或已经离开战场！</span><br>';s.mode='command';return;
  }
  if(!await ports.exists(id)){s.log+='对方不存在！<br>';s.mode='command';return;}
  const enemy=await ports.fetchPlayer(id);
  if(enemy.pls!==s.player.pls){
    s.log+=`<span class="yellow b">${enemy.name}</span>已经离开了<span class="yellow b">${ports.placeName(s.player.pls)}</span>。<br>`;
    s.mode='command';return;
  }
  if(enemy.hp<=0){
    s.log+=`<span class="red b">${enemy.name}</span>已经死亡，不能被攻击。<br>`;
    if(await ports.checkCorpse(enemy)){
      s.player.action='corpse'+enemy.pid;s.player.keep_enemy=1;await ports.findCorpse(enemy);
    }
    return; // source does NOT switch mode to command in this branch
  }
  await ports.updateSdata();await ports.battle(s.player,enemy,1);
}
export async function originalEnemyPostAct<P extends OriginalEnemyPlayer>(s:OriginalEnemyCommandState<P>,next:()=>Awaitable<void>):Promise<void>{
  await next();
  if(!originalPhpTruthy(s.player.keep_enemy)&&s.player.action.startsWith('enemy')){
    s.player.action='';delete s.player.keep_enemy;
  }
}
export interface OriginalInitiativePorts<P>{
  base:(player:P,enemy:P)=>Awaitable<number>;
  multiplier:(player:P,enemy:P)=>Awaitable<number>;
  change:(player:P,enemy:P,rate:number)=>Awaitable<number>;
  range:readonly[number,number];random99:()=>number;
  showEnemy:(enemy:P)=>Awaitable<void>;
  battle:(a:P,d:P,active:OriginalBattleActive)=>Promise<void>;
  next:(enemy:P)=>Awaitable<void>;
}
export async function originalEnemyMeet<P extends OriginalEnemyPlayer>(player:P,enemy:P,ports:OriginalInitiativePorts<P>):Promise<void>{
  if(enemy.hp<=0){await ports.next(enemy);return;}
  player.active_words='<:BASEVAR:>';
  let rate=Math.min(Math.max(await ports.base(player,enemy),1),150);
  player.active_words='('+player.active_words+')';
  rate*=await ports.multiplier(player,enemy);
  rate=await ports.change(player,enemy,rate);
  rate=Math.max(ports.range[0],Math.min(ports.range[1],rate));
  const dice=ports.random99();
  if(!Number.isInteger(dice)||dice<0||dice>99)throw new RangeError('Invalid initiative RNG');
  if(dice<rate){player.action='enemy'+enemy.pid;player.keep_enemy=1;await ports.showEnemy(enemy);}
  else await ports.battle(enemy,player,0);
}
/** Default config supplied by the unmodified enemy module. */
export function originalEnemyInitiativeBase<P extends OriginalEnemyPlayer>(player:P,enemy:P):number{
  const value=enemy.type?55:50;
  player.active_words=(player.active_words??'').replaceAll('<:BASEVAR:>',String(value));
  return value;
}
