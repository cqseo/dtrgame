import type { LegacyRandom } from "./random";

export interface LegacyPoseDefinition {
  id: number;
  name: string;
  description: string;
  remark: string;
  playerUsable: boolean;
  itemFindOdds: number;
  findCharacterOdds: number;
  hideOdds: number;
  activeOdds: number;
  defensiveActiveOdds: number;
  attackModifier: number;
  defenseModifier: number;
  edibleModifier: number;
}

export const LEGACY_POSES: readonly LegacyPoseDefinition[] = [
  { id: 0, name: "通常", description: "最普通的姿态", remark: "-", playerUsable: false, itemFindOdds: 0, findCharacterOdds: 0, hideOdds: 0, activeOdds: 0, defensiveActiveOdds: 0, attackModifier: 0, defenseModifier: 0, edibleModifier: 0 },
  { id: 1, name: "作战姿态", description: "以备战为目的，提升攻防，略微提升角色发现率", remark: "陷阱遭遇率+1%", playerUsable: true, itemFindOdds: 0, findCharacterOdds: 5, hideOdds: 0, activeOdds: 5, defensiveActiveOdds: 0, attackModifier: 40, defenseModifier: 20, edibleModifier: 0 },
  { id: 2, name: "强袭姿态", description: "大幅提升被动先攻率的姿态，通常不可选", remark: "-", playerUsable: false, itemFindOdds: 0, findCharacterOdds: 0, hideOdds: 0, activeOdds: 0, defensiveActiveOdds: -40, attackModifier: 0, defenseModifier: 0, edibleModifier: 0 },
  { id: 3, name: "探物姿态", description: "以寻找物品为目的，提升道具发现率，但是影响攻击力", remark: "陷阱遭遇率+3%；移动和探索时必定会探索一次道具", playerUsable: true, itemFindOdds: 25, findCharacterOdds: 0, hideOdds: -10, activeOdds: 0, defensiveActiveOdds: 0, attackModifier: -25, defenseModifier: 10, edibleModifier: 0 },
  { id: 4, name: "偷袭姿态", description: "以先发制人为目的，提升角色发现率以及先手率，但是影响防御力", remark: "-", playerUsable: true, itemFindOdds: 0, findCharacterOdds: 10, hideOdds: 10, activeOdds: 25, defensiveActiveOdds: -10, attackModifier: 25, defenseModifier: -25, edibleModifier: 0 },
  { id: 5, name: "治疗姿态", description: "以自我治疗为目的，提升恢复能力，其他数值大幅恶化", remark: "不能反击；睡眠、治疗、静养恢复量3倍且异常恢复速度加快；<br>补给效果+20%", playerUsable: true, itemFindOdds: -25, findCharacterOdds: 0, hideOdds: -25, activeOdds: -35, defensiveActiveOdds: 35, attackModifier: -50, defenseModifier: -50, edibleModifier: 20 }
] as const;

export interface LegacyTacticDefinition {
  id: number;
  name: string;
  description: string;
  remark: string;
  playerUsable: boolean;
  hideOdds: number;
  meetCharacterOdds: number;
  attackModifier: number;
  defenseModifier: number;
}

export const LEGACY_TACTICS: readonly LegacyTacticDefinition[] = [
  { id: 0, name: "通常", description: "不注重任何一方面的策略", remark: "", playerUsable: false, hideOdds: 0, meetCharacterOdds: 0, attackModifier: 0, defenseModifier: 0 },
  { id: 1, name: "重视攻击（已废弃）", description: "", remark: "", playerUsable: false, hideOdds: 0, meetCharacterOdds: 0, attackModifier: 20, defenseModifier: -10 },
  { id: 2, name: "重视防御", description: "随时准备防御敌方攻击和陷阱的策略", remark: "有75%概率使陷阱伤害-25%", playerUsable: true, hideOdds: 0, meetCharacterOdds: 0, attackModifier: -25, defenseModifier: 50 },
  { id: 3, name: "重视反击", description: "随时准备反击的策略", remark: "反击率+30%", playerUsable: true, hideOdds: -15, meetCharacterOdds: 10, attackModifier: 25, defenseModifier: 0 },
  { id: 4, name: "重视躲避", description: "试图回避敌人、陷阱和禁区的策略", remark: "无法反击。陷阱回避率+20%，连斗前可以躲避禁区。", playerUsable: true, hideOdds: 25, meetCharacterOdds: -15, attackModifier: -50, defenseModifier: -10 }
] as const;

export const getLegacyPose = (id: number): LegacyPoseDefinition => LEGACY_POSES[id] ?? LEGACY_POSES[0]!;
export const getLegacyTactic = (id: number): LegacyTacticDefinition => LEGACY_TACTICS[id] ?? LEGACY_TACTICS[0]!;
export const canChangeLegacyPose = (id: number): boolean => LEGACY_POSES[id]?.playerUsable === true;
export const canChangeLegacyTactic = (id: number): boolean => LEGACY_TACTICS[id]?.playerUsable === true;
export const legacyPoseTrapOdds = (pose: number): number => pose === 1 ? 1 : pose === 3 ? 3 : 0;
export const legacyMeetCharacterBonus = (pose: number, tactic: number): number => {
  const poseDefinition = getLegacyPose(pose);
  return poseDefinition.findCharacterOdds - poseDefinition.itemFindOdds + getLegacyTactic(tactic).meetCharacterOdds;
};
export const legacyActiveOddsBonus = (attackerPose: number, defenderPose: number): number => getLegacyPose(attackerPose).activeOdds + getLegacyPose(defenderPose).defensiveActiveOdds;
export const legacyCanCounter = (pose: number, tactic: number): boolean => pose !== 5 && tactic !== 4;
export const legacyCounterRateBonus = (tactic: number): number => tactic === 3 ? 30 : 0;
export const legacyAttackMultipliers = (pose: number, tactic: number): [number, number] => [1 + getLegacyTactic(tactic).attackModifier / 100, 1 + getLegacyPose(pose).attackModifier / 100];
export const legacyDefenseMultipliers = (pose: number, tactic: number): [number, number] => [1 + getLegacyTactic(tactic).defenseModifier / 100, 1 + getLegacyPose(pose).defenseModifier / 100];
export const legacyRestRecovery = (pose: number, base: number): number => pose === 5 ? base * 3 : base;
export const legacyWoundRecoveryTime = (pose: number, baseSeconds: number): number => pose === 5 ? baseSeconds - 30 : baseSeconds;
export const legacyEdibleRecovery = (pose: number, base: number): number => Math.round(base * (100 + getLegacyPose(pose).edibleModifier) / 100);
export const legacyTrapEscapeRate = (tactic: number, base: number): number => tactic === 4 ? base + 20 : base;
export function legacyTrapDamage(tactic: number, baseDamage: number, random: LegacyRandom): number {
  return tactic === 2 && random.int(0, 99) < 75 ? Math.round(baseDamage * 0.75) : baseDamage;
}
