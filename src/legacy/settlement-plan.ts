/**
 * Pure projection of original core/sys/gamectl.php gameover_set_credits().
 * NO table updates, no history rows, no changes to player snapshots.
 * The original special hooks and full settlement orchestration remain gated.
 */
import { LEGACY_MODULE_VARS } from "../generated/legacy-module-vars";
import { PhpArray } from "./template/values";
import type { LegacyPlayerRecord } from "./player";
import { decideLegacyGameover, type LegacyGameoverDecision } from "./gameover-decision";
import { isWinner } from "./game-result";

export interface LegacyAccountReward {
  username: string;
  credits: number;
  gold: number;
  validgames: number;
  wingames: number;
  lastwin: number | null;
}
export interface LegacySettlementPlan {
  decision: Extract<LegacyGameoverDecision, { ready: true }>;
  winner: string;
  rewards: LegacyAccountReward[];
}
function value(p: LegacyPlayerRecord, key: keyof LegacyPlayerRecord): number {
  return Number(p[key] ?? 0);
}
function ignoredModes(): number[] {
  const modes = LEGACY_MODULE_VARS["sys"]?.["qiegao_ignore_mode"];
  if (!(modes instanceof PhpArray)) throw new Error("Captured sys.qiegao_ignore_mode is missing.");
  return modes.values().map(Number);
}
function phpRound(value: number): number {
  // Input terms are nonnegative in valid original player rows; the PHP
  // default rounding mode HALF_UP matches this operation for positive values.
  return Math.floor(value + 0.5);
}

export function projectLegacySettlement(
  players: Readonly<Record<string, LegacyPlayerRecord>>,
  gametype: number,
  gamestate: number,
  now: number
): LegacySettlementPlan | null {
  const decision = decideLegacyGameover(players, gametype, gamestate);
  if (!decision.ready) return null;
  if (!Number.isSafeInteger(now) || now < 0) throw new RangeError("Invalid settlement timestamp.");
  const ignored = ignoredModes().includes(gametype);
  const winner = decision.winners.join(",");
  const rewards: LegacyAccountReward[] = [];
  for (const p of Object.values(players)) {
    if (value(p, "type") !== 0) continue;
    const username = String(p.name);
    const hasWon = isWinner(username, winner);
    let credits = 0;
    let gold = 0;
    if (!ignored) {
      if (hasWon) {
        credits = decision.winmode === 2 ? 200 : 50;
        gold = decision.winmode === 2 ? 120 : 100;
      } else {
        credits = value(p, "hp") > 0 ? 25 : 10;
        gold = 10;
      }
      credits += value(p, "killnum") * 10;
      credits += value(p, "npckillnum") * 2;
      credits += phpRound(value(p, "lvl") / 2);
      const mastery = Math.max(...(["wp", "wk", "wg", "wc", "wd", "wf"] as const).map(slot => value(p, slot)));
      credits += Math.min(2000, phpRound(mastery / 25));
      credits += Math.min(2000, phpRound(value(p, "money") / 500));
    }
    const validgames = gametype === 15 ? 0 : 1;
    // The original uses "$key == $winner" (a joined string) instead of
    // is_winner() here. This causes team victories with >1 teammate to
    // credit the gold but not increment individual wingames. Keep it exact
    // until a deliberate rule change is authorized.
    const wingames = (((gametype !== 15 && [2, 3, 5, 7].includes(decision.winmode))
      || gametype === 1) && username === winner) ? 1 : 0;
    rewards.push({
      username, credits, gold, validgames, wingames, lastwin: wingames ? now : null
    });
  }
  return { decision, winner, rewards };
}
