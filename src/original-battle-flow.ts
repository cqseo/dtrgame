/** Source base/battle and base/attack execution, preserving references, logs,
 * death-before-counter ordering and source persistence/render boundaries.
 * NOT a complete combat implementation: weapon/skill/effect chains are required
 * ports. No fallback damage formula or successful no-op battle is supplied. */
import {originalPhpTruthy} from "./original-player-discovery";
export interface OriginalBattlePlayer extends Record<string,unknown> {
  pid:number;name:string;type:number;hp:number;state:number;action:string;
  wep:string;bid:number;battlelog:string;
  dmg_dealt?:number;mult_words_fdmgbs?:string;user_commanded?:number;
  is_counter?:number;physical_dmg_dealt?:number;wepimp?:number;actual_rapid_time?:number;
  counter_assaulted?:number;battle_msg?:string|null;out_of_range?:number|null;
}
export type OriginalBattleActive=0|1;
type Awaitable<T>=T|Promise<T>;
type Pair<P>=(a:P,d:P,active:OriginalBattleActive)=>Awaitable<void>;
export interface OriginalBattleContext<P> {
  log:string;originalEnemy:P|null;enemy:P|null;
  battleTitle:string;main:string;cmd:string;
}
export interface OriginalBattlePorts<P extends OriginalBattlePlayer> {
  loadUserCommand:(p:P)=>Awaitable<void>;
  loadAutoCommand:(p:P)=>Awaitable<void>;
  strikePrepare:Pair<P>;strike:Pair<P>;strikeFinish:Pair<P>;
  damage:Pair<P>;postDamage:Pair<P>;
  kill:(a:P,d:P)=>Awaitable<string>;
  canCounter:(a:P,d:P,active:OriginalBattleActive)=>Awaitable<boolean>;
  savePlayer:(p:P)=>Awaitable<void>;
  loadCurrent:(p:P)=>Awaitable<void>;
  loadEnemy:(p:P)=>Awaitable<void>;
  saveEnemyLog:(p:P,text:string)=>Awaitable<void>;
  addChat:(channel:number,text:string)=>Awaitable<void>;
  initBattle:(p:P,isMeet:1)=>Awaitable<void>;
  renderResult:(p:P)=>Awaitable<string>;
  findCorpse:(p:P)=>Awaitable<string>;
  renderNpcSkills:(p:P)=>Awaitable<void>;
  /** Source module constant, not a new template path. */
  meetmanTemplate:string;
  message:string;
  clubbaseEnabled:boolean;
  /** Ordered installed module interceptors call next at the PHP $chprocess
   * position. Returning without next intentionally replaces the base method. */
  around?:(name:string,a:P,d:P,active:OriginalBattleActive,next:()=>Promise<void>)=>Promise<void>;
}
export function originalBattleLog(a:OriginalBattlePlayer,d:OriginalBattlePlayer,active:OriginalBattleActive,text:string):string {
  // PHP str_replace replaces defender first, then attacker, even in inserted names.
  return text.replaceAll('<:pd_name:>',active?d.name:'你').replaceAll('<:pa_name:>',active?'你':a.name);
}
export class OriginalBattleFlow<P extends OriginalBattlePlayer> {
  constructor(readonly context:OriginalBattleContext<P>,private readonly ports:OriginalBattlePorts<P>){}
  private stage(name:string,a:P,d:P,active:OriginalBattleActive,next:()=>Promise<void>):Promise<void>{
    return this.ports.around?this.ports.around(name,a,d,active,next):next();
  }
  private async reloadPair(a:P,d:P,active:OriginalBattleActive){
    await this.ports.savePlayer(a);await this.ports.savePlayer(d);
    await this.ports.loadCurrent(active?a:d);
  }
  async killEnemy(a:P,d:P,active:OriginalBattleActive):Promise<void>{
    await this.stage('player_kill_enemy',a,d,active,async()=>{
      if(active){
        this.context.log+=`<span class="yellow b">${d.name}</span><span class="red b">被你杀死了！</span><br>`;
        d.battlelog+=`<span class="red b">你被${a.name}杀死了！</span><br>`;
      }else{
        this.context.log+=`<span class="red b">你被${a.name}杀死了！</span><br>`;
        a.battlelog+=`<span class="yellow b">${d.name}</span><span class="red b">被你杀死了！</span><br>`;
      }
      d.state=Number(d.deathmark);
      const words=await this.ports.kill(a,d);
      await this.stage('show_player_killwords',a,d,active,async()=>{
        if(d.hp<=0&&originalPhpTruthy(words))this.context.log+=active?
          `<br><span class='b'>你对${d.name}说道：</span><span class='yellow b'>“${words}”</span><br>`:
          `<br><span class='b'>${a.name}对你说道：</span><span class='yellow b'>“${words}”</span><br>`;
      });
    });
  }
  async attackFinish(a:P,d:P,active:OriginalBattleActive):Promise<void>{
    await this.stage('attack_finish',a,d,active,async()=>{
      await this.ports.damage(a,d,active);
      await this.ports.postDamage(a,d,active);
      if(d.hp<=0){await this.killEnemy(a,d,active);await this.reloadPair(a,d,active);}
      // This is a second IF, not an ELSE: reflected damage can kill both sides.
      // Revive hooks above may also alter attacker HP before this check.
      if(a.hp<=0){await this.killEnemy(d,a,(1-active) as OriginalBattleActive);await this.reloadPair(a,d,active);}
      delete a.physical_dmg_dealt;
      for(const k of Object.keys(a))if(k.startsWith('battlelogflag'))delete a[k];
    });
  }
  async attack(a:P,d:P,active:OriginalBattleActive):Promise<void>{
    await this.stage('attack_wrapper',a,d,active,async()=>{
      await this.stage('attack_prepare',a,d,active,async()=>{
        await this.stage('player_attack_enemy',a,d,active,async()=>{
          if(active){
            if(originalPhpTruthy(a.is_counter))this.context.log+='<span class="red b">你的反击！</span><br>';
            else{
              this.context.log+=`你向<span class="red b">${d.name}</span>发起了攻击！<br>`;
              d.battlelog+=`手持<span class="red b">${a.wep}</span>的<span class="yellow b">${a.name}</span>向你袭击！`;
            }
          }else if(originalPhpTruthy(a.is_counter))this.context.log+=`<span class="red b">${a.name}的反击！</span><br>`;
          else{
            this.context.log+=`<span class="red b">${a.name}</span>突然向你袭来！<br>`;
            a.battlelog+=`你发现了手持<span class="red b">${d.wep}</span>的<span class="yellow b">${d.name}</span>并且先发制人！`;
          }
        });
        if(originalPhpTruthy(a.user_commanded))await this.ports.loadUserCommand(a);
        else await this.ports.loadAutoCommand(a);
        await this.ports.loadAutoCommand(d);
        a.dmg_dealt=0;a.mult_words_fdmgbs='';
      });
      await this.stage('attack',a,d,active,async()=>{
        await this.ports.strikePrepare(a,d,active);
        await this.ports.strike(a,d,active);
        await this.ports.strikeFinish(a,d,active);
      });
      await this.attackFinish(a,d,active);
    });
  }
  private async cannotCounter(a:P,d:P,active:OriginalBattleActive){
    await this.stage('cannot_counter',a,d,active,async()=>{
      await this.stage('player_cannot_counter',a,d,active,async()=>{
        // PHP isset: even out_of_range=0 chooses the range-specific wording.
        const words=a.out_of_range!==undefined&&a.out_of_range!==null?'射程不足，无法反击':'没能及时反击';
        this.context.log+=originalBattleLog(a,d,active,`<span class="red b"><:pa_name:>${words}，逃跑了！</span><br>`);
        d.battlelog+=originalBattleLog(a,d,(1-active) as OriginalBattleActive,`<:pa_name:>${words}，逃跑了。<br>`);
      });
    });
  }
  async assault(a:P,d:P,active:OriginalBattleActive):Promise<void>{
    await this.stage('assault_prepare',a,d,active,async()=>{
      a.user_commanded=active?1:0;d.user_commanded=0;
    });
    await this.stage('assault',a,d,active,async()=>{
      for(const p of [a,d]){
        p.is_counter=0;p.physical_dmg_dealt=0;p.wepimp=0;p.actual_rapid_time=0;p.battlelog='';
      }
      await this.attack(a,d,active);
      const counterActive=(1-active) as OriginalBattleActive;
      await this.stage('counter_assault_wrapper',d,a,counterActive,async()=>{
        if(d.hp>0&&a.hp>0){
          d.is_counter=1;
          if(await this.ports.canCounter(d,a,counterActive)){
            d.counter_assaulted=1;
            await this.stage('counter_assault',d,a,counterActive,async()=>{
              d.is_counter=1;
              await this.attack(d,a,counterActive);
              delete d.is_counter;
              if(a.hp>0)await this.stage('assault_end',a,d,active,async()=>{});
            });
          }else{d.counter_assaulted=0;await this.cannotCounter(d,a,counterActive);}
          delete d.is_counter;delete d.out_of_range;
        }
      });
    });
    await this.stage('assault_finish',a,d,active,async()=>{
      for(const p of [a,d])for(const k of ['is_counter','physical_dmg_dealt','wepimp','actual_rapid_time'])delete p[k];
    });
  }
  async run(a:P,d:P,active:OriginalBattleActive):Promise<void>{
    if(active!==0&&active!==1)throw new RangeError('Invalid original battle perspective');
    await this.stage('battle_wrapper',a,d,active,async()=>{
      this.context.originalEnemy=structuredClone(active?d:a);
      await this.stage('battle_prepare',a,d,active,async()=>{
        await this.stage('send_battle_msg',a,d,active,async()=>{
          const message=this.ports.message;
          if(originalPhpTruthy(message)){
            this.context.log+=`<span class="lime b">你向${d.name}喊道：“${message}”</span><br>`;
            d.battle_msg=`<span class="lime b">${a.name}向你喊道：“${message}”</span><br><br>`;
            await this.ports.addChat(6,`${a.name}高喊着“${message}”杀向了${d.name}`);
          }
        });
        a.bid=d.pid;d.bid=a.pid;
      });
      await this.stage('battle',a,d,active,()=>this.assault(a,d,active));
      await this.stage('battle_finish',a,d,active,async()=>{});
      if(active){
        if(d.hp<=0&&a.hp>0)a.action='corpse'+d.pid;
        if(a.hp<=0&&d.hp>0&&d.action===''&&d.type===0)d.action='pacorpse'+a.pid;
      }else{
        if(d.hp<=0&&a.hp>0&&a.action===''&&a.type===0)a.action='pacorpse'+d.pid;
        if(a.hp<=0&&d.hp>0)d.action='corpse'+a.pid;
      }
      const enemy=active?d:a,current=active?a:d;
      // PHP edata is a copy made BEFORE save_enemy_battlelog prepends battle_msg.
      this.context.enemy=structuredClone(enemy);
      await this.ports.savePlayer(a);await this.ports.savePlayer(d);
      await this.ports.loadEnemy(enemy);
      if(enemy.type===0){
        if(enemy.battle_msg!==undefined&&enemy.battle_msg!==null)enemy.battlelog=String(enemy.battle_msg)+enemy.battlelog;
        if(originalPhpTruthy(enemy.battlelog))await this.ports.saveEnemyLog(enemy,enemy.battlelog);
      }
      await this.ports.loadCurrent(current);
      this.context.battleTitle='战斗发生';this.context.main=this.ports.meetmanTemplate;
      await this.ports.initBattle(this.context.enemy,1);
      const action=current.action;
      // PHP (int) permits a numeric prefix; use parseInt rather than Number.
      const corpse=action.startsWith('corpse')&&parseInt(action.slice(6),10)===enemy.pid;
      this.context.cmd=corpse?await this.ports.findCorpse(this.context.enemy):await this.ports.renderResult(this.context.enemy);
      if(this.ports.clubbaseEnabled)await this.ports.renderNpcSkills(this.context.enemy);
    });
  }
}
