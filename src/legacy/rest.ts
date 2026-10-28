import { legacyRestRecovery, legacyWoundRecoveryTime } from "./stance";
import { healLegacyCondition, LEGACY_WOUND_NAMES } from "./wound";

export const LEGACY_REST_SLEEP_SECONDS_PER_PERCENT = 3;
export const LEGACY_REST_HEAL_SECONDS_PER_PERCENT = 6;
export const LEGACY_REST_CONDITION_RECOVERY_SECONDS = 90;
export const LEGACY_REST_NAMES = ["通常", "睡眠", "治疗", "静养"] as const;
export const LEGACY_HOSPITAL_AREAS = [11, 19] as const;

export interface LegacyRestPlayer {
  hp: number;
  mhp: number;
  sp: number;
  msp: number;
  inf: string;
  pose: number;
  state: number;
  endtime: number;
}

export function calculateLegacyRestStamina(player: LegacyRestPlayer, seconds: number): number {
  return legacyRestRecovery(player.pose, Math.round(player.msp * seconds / LEGACY_REST_SLEEP_SECONDS_PER_PERCENT / 100));
}

export function calculateLegacyRestHealth(player: LegacyRestPlayer, seconds: number): number {
  let value = Math.round(player.mhp * seconds / LEGACY_REST_HEAL_SECONDS_PER_PERCENT / 100);
  if (player.inf.includes("b")) value = Math.round(value / 2);
  return legacyRestRecovery(player.pose, value);
}

/** Direct port of rest\rest() with enabled pose and wound hooks. */
export function applyLegacyRest(player: LegacyRestPlayer, now: number): { hpRecovered: number; spRecovered: number; healedConditions: string[]; logHtml: string } {
  const seconds = now - player.endtime;
  player.endtime = now;
  const oldHp = player.hp;
  const oldSp = player.sp;
  let logHtml = "";
  if ((player.state === 1 || player.state === 3) && player.sp < player.msp) {
    player.sp = Math.min(player.msp, player.sp + calculateLegacyRestStamina(player, seconds));
    if (player.sp > oldSp) logHtml += `你的体力恢复了<span class="yellow b">${player.sp - oldSp}</span>点。`;
  }
  if ((player.state === 2 || player.state === 3) && player.hp < player.mhp) {
    player.hp = Math.min(player.mhp, player.hp + calculateLegacyRestHealth(player, seconds));
    if (player.hp > oldHp) logHtml += `你的生命恢复了<span class="yellow b">${player.hp - oldHp}</span>点。`;
  }
  logHtml += "<br>";
  const healedConditions: string[] = [];
  if (player.state === 3 && player.inf) {
    const recoverySeconds = legacyWoundRecoveryTime(player.pose, LEGACY_REST_CONDITION_RECOVERY_SECONDS);
    if (seconds > recoverySeconds) {
      while (player.inf) {
        const condition = player.inf[0]!;
        const name = LEGACY_WOUND_NAMES[condition as keyof typeof LEGACY_WOUND_NAMES] ?? condition;
        logHtml += `<span class="yellow b">你从${name}状态中恢复了！</span><br>`;
        healedConditions.push(condition);
        player.inf = healLegacyCondition(player.inf, condition);
      }
    } else logHtml += "也许是时间不够吧……你没有治好任何异常状态。<br>";
  }
  return { hpRecovered: player.hp - oldHp, spRecovered: player.sp - oldSp, healedConditions, logHtml };
}
