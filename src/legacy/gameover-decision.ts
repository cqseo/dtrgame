/**
 * Side-effect-free eligibility decision from original core/sys/gamectl.php
 * gameover() when no explicit gmode/winname was supplied.
 *
 * This does NOT execute original payout, history, winmode-specific hooks,
 * revive rules, or database updates. Do not auto-finalize a live match from
 * this helper alone.
 */
import { LEGACY_MODULE_VARS } from "../generated/legacy-module-vars";
import { PhpArray } from "./template/values";
import type { LegacyPlayerRecord } from "./player";

export type LegacyGameoverDecision =
  | { ready: false; reason: "not-started" | "multiple-survivors" | "multiple-teams" }
  | { ready: true; winmode: 1 | 2 | 4; winners: string[]; validnum: number; alivenum: number; winnum: number };

function teamWinModes(): ReadonlySet<number> {
  const value = LEGACY_MODULE_VARS["sys"]?.["teamwin_mode"];
  if (!(value instanceof PhpArray)) {
    throw new Error("Original PHP teamwin_mode configuration is missing.");
  }
  return new Set(value.values().map(Number));
}

export function decideLegacyGameover(
  players: Readonly<Record<string, LegacyPlayerRecord>>,
  gametype: number,
  gamestate: number
): LegacyGameoverDecision {
  // Original gameover() exits immediately when the game has not started.
  if (gamestate < 5) return { ready: false, reason: "not-started" };
  const real = Object.values(players).filter(player => Number(player.type) === 0);
  const alive = real.filter(player => Number(player.hp) > 0);
  if (real.length === 0) {
    return { ready: true, winmode: 4, winners: [], validnum: 0, alivenum: 0, winnum: 0 };
  }
  if (alive.length === 0) {
    return { ready: true, winmode: 1, winners: [], validnum: real.length, alivenum: 0, winnum: 0 };
  }
  if (!teamWinModes().has(gametype)) {
    if (alive.length !== 1) return { ready: false, reason: "multiple-survivors" };
    return { ready: true, winmode: 2, winners: [String(alive[0]!.name)],
      validnum: real.length, alivenum: 1, winnum: 1 };
  }
  // The original loops over living players, requiring identical nonempty
  // team IDs if there is a second survivor. A lone unteamed survivor wins.
  const firstTeam = String(alive[0]!.teamID ?? "");
  if (alive.slice(1).some(player => !firstTeam || String(player.teamID ?? "") !== firstTeam)) {
    return { ready: false, reason: "multiple-teams" };
  }
  const winners = firstTeam
    ? real.filter(player => String(player.teamID ?? "") === firstTeam).map(player => String(player.name))
    : [String(alive[0]!.name)];
  return { ready: true, winmode: 2, winners, validnum: real.length,
    alivenum: alive.length, winnum: winners.length };
}
