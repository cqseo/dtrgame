import {
  LEGACY_WEAPONS, calculateLegacyHitRate, calculateLegacyPhysicalDamage,
  canLegacyWeaponCounter, getLegacyAttackMethod, getLegacyWeaponRange, shouldImpairLegacyWeapon,
  type LegacyCombatant, type LegacyWeaponKind
} from "./combat";
import { LEGACY_INFINITE_DURABILITY } from "./item";
import { grantLegacyExperience } from "./level";
import type { LegacyPlayerRecord } from "./player";
import type { LegacyRandom } from "./random";

export interface LegacyStrikeResult {
  attacker: string;
  defender: string;
  kind: LegacyWeaponKind;
  hit: boolean;
  damage: number;
  killed: boolean;
  counter: boolean;
}

export interface LegacyAssaultResult {
  logHtml: string;
  strikes: LegacyStrikeResult[];
}

export interface LegacyAssaultInput {
  attacker: LegacyPlayerRecord;
  defender: LegacyPlayerRecord;
  active: boolean;
  weatherId: number;
  now: number;
  random: LegacyRandom;
}

const numberField = (player: LegacyPlayerRecord, key: keyof LegacyPlayerRecord): number => Number(player[key] ?? 0);
const textField = (player: LegacyPlayerRecord, key: keyof LegacyPlayerRecord): string => String(player[key] ?? "");

function combatant(player: LegacyPlayerRecord): LegacyCombatant {
  return {
    name: textField(player, "name"), hp: numberField(player, "hp"), mhp: numberField(player, "mhp"),
    sp: numberField(player, "sp"), att: numberField(player, "att"), def: numberField(player, "def"),
    pose: numberField(player, "pose"), tactic: numberField(player, "tactic"),
    wep: textField(player, "wep"), wepk: textField(player, "wepk"), wepe: numberField(player, "wepe"),
    weps: player.weps, wepsk: textField(player, "wepsk"),
    wp: numberField(player, "wp"), wk: numberField(player, "wk"), wg: numberField(player, "wg"),
    wc: numberField(player, "wc"), wd: numberField(player, "wd"), wf: numberField(player, "wf"),
    arbe: numberField(player, "arbe"), arhe: numberField(player, "arhe"),
    arae: numberField(player, "arae"), arfe: numberField(player, "arfe")
  };
}

function applyCombatant(player: LegacyPlayerRecord, view: LegacyCombatant): void {
  player.hp = view.hp;
  player.sp = view.sp;
  player.weps = view.weps;
  player.wp = view.wp;
  player.wk = view.wk;
  player.wg = view.wg;
  player.wc = view.wc;
  player.wd = view.wd;
  player.wf = view.wf;
}

function breakWeapon(player: LegacyPlayerRecord): void {
  player.wep = "拳头";
  player.wepk = "WN";
  player.wepe = 0;
  player.weps = LEGACY_INFINITE_DURABILITY;
  player.wepsk = "";
}

function attackExperience(attacker: LegacyPlayerRecord, defender: LegacyPlayerRecord): number {
  return Math.max(Math.round((numberField(defender, "lvl") - numberField(attacker, "lvl")) / 3), 1);
}

function kill(attacker: LegacyPlayerRecord, defender: LegacyPlayerRecord, kind: LegacyWeaponKind, now: number): void {
  defender.hp = 0;
  defender.state = LEGACY_WEAPONS[kind].deathState;
  defender.bid = numberField(attacker, "pid");
  defender.endtime = now;
  if (numberField(defender, "type") === 0 && numberField(defender, "pid") !== numberField(attacker, "pid")) {
    attacker.killnum = numberField(attacker, "killnum") + 1;
  } else if (numberField(defender, "type") > 0) {
    attacker.npckillnum = numberField(attacker, "npckillnum") + 1;
  }
}

function strike(
  attacker: LegacyPlayerRecord,
  defender: LegacyPlayerRecord,
  active: boolean,
  isCounter: boolean,
  weatherId: number,
  now: number,
  random: LegacyRandom,
  log: string[]
): LegacyStrikeResult {
  const attackView = combatant(attacker);
  const defendView = combatant(defender);
  const kind = getLegacyAttackMethod(attackView);
  const verb = LEGACY_WEAPONS[kind].verb;
  if (active) log.push(isCounter
    ? '<span class="red b">你的反击！</span><br>'
    : `你向<span class="red b">${defendView.name}</span>发起了攻击！<br>`);
  else log.push(isCounter
    ? `<span class="red b">${attackView.name}的反击！</span><br>`
    : `<span class="red b">${attackView.name}</span>突然向你袭来！<br>`);
  log.push(active
    ? `使用${attackView.wep}<span class="yellow b">${verb}</span>${defendView.name}！<br>`
    : `${attackView.name}使用${attackView.wep}<span class="yellow b">${verb}</span>你！<br>`);

  const hitRate = calculateLegacyHitRate(attackView, kind) + (weatherId === 12 ? 20 : 0);
  const hit = random.int(0, 99) < hitRate;
  let damage = 0;
  if (hit) {
    damage = calculateLegacyPhysicalDamage(attackView, defendView, weatherId, random, kind).damage;
    log.push(`造成了<span class="red b">${damage}</span>点物理伤害！<br>`);
    defendView.hp -= damage;
  } else {
    log.push("但是没有击中！<br>");
  }

  const impaired = shouldImpairLegacyWeapon(kind, hit, random);
  if (impaired && attackView.weps !== LEGACY_INFINITE_DURABILITY) {
    attackView.weps = Number(attackView.weps) - 1;
    const consumable = LEGACY_WEAPONS[kind].impairmentRate >= 1000;
    log.push(active
      ? consumable ? `你用掉了1个${attackView.wep}。<br>` : `你的${attackView.wep}的耐久度下降了1！<br>`
      : consumable ? `${attackView.name}用掉了1个${attackView.wep}。<br>` : `${attackView.name}的${attackView.wep}的耐久度下降了1！<br>`);
  }

  attackView[LEGACY_WEAPONS[kind].mastery] += 1;
  applyCombatant(attacker, attackView);
  applyCombatant(defender, defendView);
  if (impaired && attackView.weps !== LEGACY_INFINITE_DURABILITY && Number(attackView.weps) <= 0) breakWeapon(attacker);

  const killed = numberField(defender, "hp") <= 0;
  if (killed) {
    kill(attacker, defender, kind, now);
    log.push(active
      ? `<span class="yellow b">${textField(defender, "name")}</span><span class="red b">被你杀死了！</span><br>`
      : `<span class="red b">你被${textField(attacker, "name")}杀死了！</span><br>`);
  }
  if (damage > 0 && numberField(attacker, "hp") > 0) {
    log.push(grantLegacyExperience(attacker as unknown as Parameters<typeof grantLegacyExperience>[0], attackExperience(attacker, defender), random).logHtml);
  }
  return { attacker: attackView.name, defender: defendView.name, kind, hit, damage, killed, counter: isCounter };
}

function checkpoint(random: LegacyRandom): unknown {
  const value = random as LegacyRandom & { snapshot?: () => unknown };
  return typeof value.snapshot === "function" ? value.snapshot() : undefined;
}

function restore(random: LegacyRandom, value: unknown): void {
  const source = random as LegacyRandom & { restore?: (snapshot: unknown) => void };
  if (value !== undefined && typeof source.restore === "function") source.restore(value);
}

/** Base battle/battle.php assault: attack, optional weapon-range counter, atomic commit. */
export function executeLegacyAssault(input: LegacyAssaultInput): LegacyAssaultResult {
  const attacker = structuredClone(input.attacker);
  const defender = structuredClone(input.defender);
  const randomCheckpoint = checkpoint(input.random);
  const log: string[] = [];
  const strikes: LegacyStrikeResult[] = [];
  try {
    strikes.push(strike(attacker, defender, input.active, false, input.weatherId, input.now, input.random, log));
    if (numberField(attacker, "hp") > 0 && numberField(defender, "hp") > 0) {
      const counterView = combatant(defender);
      const attackerView = combatant(attacker);
      const counterRange = getLegacyWeaponRange(counterView);
      const attackerRange = getLegacyWeaponRange(attackerView);
      const outOfRange = counterRange < attackerRange || counterRange === 0 || attackerRange === 0;
      if (canLegacyWeaponCounter(combatant(defender), combatant(attacker), input.random)) {
        strikes.push(strike(defender, attacker, !input.active, true, input.weatherId, input.now, input.random, log));
      } else {
        log.push(input.active
          ? `<span class="red b">${textField(defender, "name")}${outOfRange ? "射程不足，无法反击" : "没能及时反击"}，逃跑了！</span><br>`
          : `<span class="red b">你${outOfRange ? "射程不足，无法反击" : "没能及时反击"}，逃跑了！</span><br>`);
      }
    }
    Object.assign(input.attacker, attacker);
    Object.assign(input.defender, defender);
    return { logHtml: log.join(""), strikes };
  } catch (error) {
    restore(input.random, randomCheckpoint);
    throw error;
  }
}
