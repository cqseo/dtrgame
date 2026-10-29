/**
 * Source-faithful ACFUN DTS tactic module: include/modules/base/tactic/main.php
 * and config/tactic.config.php on the unchanged live original PHP installation.
 * Pure math/command handlers only; parent $chprocess integration must be wired
 * into the real player action chain before any route is declared playable.
 */
export const ORIGINAL_TACTIC = {
  names: ["通常","重视攻击（已废弃）","重视防御","重视反击","重视躲避"],
  descriptions: ["不注重任何一方面的策略","","随时准备防御敌方攻击和陷阱的策略","随时准备反击的策略","试图回避敌人、陷阱和禁区的策略"],
  remarks: ["","","有75%概率使陷阱伤害-25%","反击率+30%","无法反击。陷阱回避率+20%，连斗前可以躲避禁区。"],
  playerUsable: [0,0,1,1,1],
  hideOdds: [0,0,0,-15,25],
  meetManOdds: [0,0,0,10,-15],
  attackModifier: [0,20,-25,25,-50],
  defendModifier: [0,-10,50,0,-10]
} as const;

export type OriginalTactic = 0|1|2|3|4;
export interface TacticContext {
  mode: string;
  command: string;
  tactic: number;
  log: string;
}
function asPhpInt(s: string): number {
  const m = /^\s*([+-]?\d+)/.exec(s);
  return m ? Number(m[1]) : 0;
}
const modifier = (values: readonly number[], tactic: number): number => values[tactic] ?? 0;

/** PHP tactic_change() casts input to integer, allows only values 2,3,4. */
export function originalTacticChange(
  state: TacticContext,
  nextTactic: string | number
): TacticContext {
  const index=asPhpInt(String(nextTactic));
  if (ORIGINAL_TACTIC.playerUsable[index]) {
    return {
      ...state,
      tactic:index,
      log:state.log + '应战策略变为<span class="yellow b">' + ORIGINAL_TACTIC.names[index] + '</span>。<br> '
    };
  }
  return {...state,log:state.log+"这是什么奇怪的应战策略啦！<br> "};
}

/** PHP: mode=='special' && strpos(command,'tac')===0; substr(command,3,1). */
export function originalTacticAct(state: TacticContext): { handled:boolean; state:TacticContext } {
  if (state.mode==="special" && state.command.startsWith("tac")) {
    const changed=originalTacticChange(state,state.command.substring(3,4));
    return {handled:true,state:{...changed,mode:"command"}};
  }
  return {handled:false,state};
}
/** tactic=4 cannot counter, even when parent handler permits it. */
export function originalCanCounter(attackerTactic:number,parentCanCounter:boolean):boolean {
  return attackerTactic===4 ? false:parentCanCounter;
}
export function originalMeetManRate(parent:number,ownTactic:number):number {
  return parent + modifier(ORIGINAL_TACTIC.meetManOdds,ownTactic);
}
export const originalFindManOdds=originalMeetManRate;
export function originalHideOdds(parent:number,enemyTactic:number):number {
  return parent + modifier(ORIGINAL_TACTIC.hideOdds,enemyTactic);
}
export function originalCounterRateBase(parent:number,attackerTactic:number):number {
  return parent+(attackerTactic===3?30:0);
}
/** PHP array_unshift($ret,$var), not multiplication of the entire result. */
export function originalAttackMultipliers(parent:readonly number[],attackerTactic:number):number[] {
  return [1+modifier(ORIGINAL_TACTIC.attackModifier,attackerTactic)/100,...parent];
}
export function originalDefenseMultipliers(parent:readonly number[],defenderTactic:number):number[] {
  return [1+modifier(ORIGINAL_TACTIC.defendModifier,defenderTactic)/100,...parent];
}
/** Source tactic=2: rand(0,99)<75 then round(damage*0.75). */
export function originalTrapDamage(parentDamage:number,ownTactic:number,phpRandom0to99:number):number {
  if (!Number.isInteger(phpRandom0to99) || phpRandom0to99<0 || phpRandom0to99>99)
    throw new RangeError("Expected PHP rand(0,99) integer");
  return ownTactic===2 && phpRandom0to99<75
    ? Math.floor(parentDamage*0.75 + 0.5) : parentDamage;
}
export function originalTrapEscapeRate(parent:number,ownTactic:number):number {
  return parent+(ownTactic===4?20:0);
}
export function originalCanAvoidKillArea(gameState:number,ownTactic:number,parent:boolean):boolean {
  return gameState<40 && ownTactic===4 ? true:parent;
}
/** Original post_pc_avoid_killarea logs only for type=0 human player. */
export function originalAvoidKillAreaLog(type:number,placeName:string):string|null {
  return type===0
    ? '<span class="yellow b">为了躲避禁区，你及时移动到了'+placeName+'</span><br>'
    : null;
}