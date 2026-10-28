import { emptyLegacyItem, isLegacyItemEmpty, type LegacyItem } from "./item";
import type { LegacyRandom } from "./random";
import { legacyActiveOddsBonus } from "./stance";
import { getLegacyWeather } from "./weather";

export const LEGACY_TEAM_CREATE_SP = 200;
export const LEGACY_TEAM_JOIN_SP = 100;
export const LEGACY_TEAM_LIMIT = 5;
export const LEGACY_CORPSE_DISCOVERY_ODDS = 50;
export const LEGACY_CORPSE_PROTECTION_SECONDS = 10;
export const LEGACY_CORPSE_SHORT_PROTECTION_SECONDS = 5;
export const LEGACY_ACTIVE_ODDS_PC = 50;
export const LEGACY_ACTIVE_ODDS_NPC = 55;
export const LEGACY_ACTIVE_ODDS_RANGE = [10, 99] as const;

export interface LegacyTeamPlayer {
  name: string;
  sp: number;
  teamID: string;
  teamPass: string;
}

export interface LegacyTeamResult { ok: boolean; logHtml: string; }

const utf8Length = (value: string): number => new TextEncoder().encode(value).length;

function validateTeamCredentials(teamID: string, password: string, noItemName: string, making: boolean): LegacyTeamResult | null {
  if (!teamID || !password) return { ok: false, logHtml: "队伍名和密码不能为空，请重新输入。<br>" };
  if (utf8Length(teamID) > 20) return { ok: false, logHtml: "队伍名称过长，请重新输入。<br>" };
  if (utf8Length(password) > 20) return { ok: false, logHtml: "队伍密码过长，请重新输入。<br>" };
  if (teamID === noItemName || (making && teamID === "all")) return { ok: false, logHtml: `队伍名不能为<span class="red b">${teamID}</span>，请重新输入。<br>` };
  return null;
}

export function createLegacyTeam(player: LegacyTeamPlayer, teamID: string, password: string, existingTeamIDs: readonly string[], noItemName: string): LegacyTeamResult {
  const invalid = validateTeamCredentials(teamID, password, noItemName, true);
  if (invalid) return invalid;
  if (player.teamID) return { ok: false, logHtml: `你已经加入了队伍<span class="yellow b">${player.teamID}</span>，请先退出队伍。<br>` };
  if (player.sp <= LEGACY_TEAM_CREATE_SP) return { ok: false, logHtml: `体力不足，不能创建队伍。至少需要<span class="yellow b">${LEGACY_TEAM_CREATE_SP}</span>点体力。<br>` };
  if (existingTeamIDs.includes(teamID)) return { ok: false, logHtml: `队伍<span class="yellow b">${teamID}</span>已经存在，请更换队伍名。<br>` };
  player.teamID = teamID; player.teamPass = password; player.sp -= LEGACY_TEAM_CREATE_SP;
  return { ok: true, logHtml: `你创建了队伍<span class="yellow b">${teamID}</span>。<br>` };
}

export function joinLegacyTeam(player: LegacyTeamPlayer, teamID: string, password: string, members: readonly LegacyTeamPlayer[], noItemName: string): LegacyTeamResult {
  const invalid = validateTeamCredentials(teamID, password, noItemName, false);
  if (invalid) return invalid;
  if (player.teamID) return { ok: false, logHtml: `你已经加入了队伍<span class="yellow b">${player.teamID}</span>，请先退出队伍。<br>` };
  if (player.sp <= LEGACY_TEAM_JOIN_SP) return { ok: false, logHtml: `体力不足，不能加入队伍。至少需要<span class="yellow b">${LEGACY_TEAM_JOIN_SP}</span>点体力。<br>` };
  const team = members.filter((member) => member.teamID === teamID);
  if (!team.length) return { ok: false, logHtml: `队伍<span class="yellow b">${teamID}</span>不存在，请先创建队伍。<br>` };
  if (team.length >= LEGACY_TEAM_LIMIT) return { ok: false, logHtml: `队伍<span class="yellow b">${teamID}</span>人数已满，请更换队伍。<br>` };
  if (team[0]!.teamPass !== password) return { ok: false, logHtml: `密码错误，不能加入队伍<span class="yellow b">${teamID}</span>。<br>` };
  player.teamID = teamID; player.teamPass = password; player.sp -= LEGACY_TEAM_JOIN_SP;
  return { ok: true, logHtml: `你加入了队伍<span class="yellow b">${teamID}</span>。<br>` };
}

export function quitLegacyTeam(player: LegacyTeamPlayer): LegacyTeamResult {
  if (!player.teamID) return { ok: false, logHtml: "你不在队伍中。<br>" };
  const oldTeam = player.teamID;
  player.teamID = ""; player.teamPass = "";
  return { ok: true, logHtml: `你退出了队伍<span class="yellow b">${oldTeam}</span>。<br>` };
}

export function calculateLegacyActiveOdds(input: { defenderIsNpc: boolean; attackerPose: number; defenderPose: number; attackerTactic: number; weatherId: number; multiplier?: number }): number {
  const base = input.defenderIsNpc ? LEGACY_ACTIVE_ODDS_NPC : LEGACY_ACTIVE_ODDS_PC;
  // The legacy tactic module changes encounter odds, not battle initiative.
  const additive = legacyActiveOddsBonus(input.attackerPose, input.defenderPose) + getLegacyWeather(input.weatherId).activeOdds;
  const beforeFinalClamp = Math.min(Math.max(base + additive, 1), 150) * (input.multiplier ?? 1);
  return Math.max(LEGACY_ACTIVE_ODDS_RANGE[0], Math.min(LEGACY_ACTIVE_ODDS_RANGE[1], beforeFinalClamp));
}

export const rollLegacyActive = (odds: number, random: LegacyRandom): boolean => random.int(0, 99) < odds;

export function canDiscoverLegacyCorpse(endtime: number, now: number, random: LegacyRandom): boolean {
  if (endtime > now - LEGACY_CORPSE_SHORT_PROTECTION_SECONDS) return false;
  return random.int(0, 99) < LEGACY_CORPSE_DISCOVERY_ODDS;
}

export function legacyCorpseHasLoot(input: { money: number; weapon: LegacyItem; body: LegacyItem; head: LegacyItem; arms: LegacyItem; feet: LegacyItem; accessory: LegacyItem; inventory: readonly LegacyItem[]; cleared: boolean }): boolean {
  if (input.cleared) return false;
  if (!isLegacyItemEmpty(input.weapon) && (input.weapon.itmk !== "WN" || input.weapon.itme > 0)) return true;
  if (!isLegacyItemEmpty(input.body) && (input.body.itmk !== "DN" || input.body.itme > 0)) return true;
  return input.money !== 0 || !isLegacyItemEmpty(input.head) || !isLegacyItemEmpty(input.arms) || !isLegacyItemEmpty(input.feet) || !isLegacyItemEmpty(input.accessory) || input.inventory.some((item) => !isLegacyItemEmpty(item));
}

export function giveLegacyItem(sender: LegacyItem[], receiver: LegacyItem[], oneBasedSlot: number): LegacyTeamResult {
  const sent = sender[oneBasedSlot - 1];
  if (!sent || isLegacyItemEmpty(sent)) return { ok: false, logHtml: "此道具不存在！" };
  const blank = receiver.findIndex(isLegacyItemEmpty);
  if (blank < 0) return { ok: false, logHtml: "包裹已经满了，不能赠送物品。<br>" };
  receiver[blank] = sent;
  sender[oneBasedSlot - 1] = emptyLegacyItem();
  return { ok: true, logHtml: sent.itm };
}
