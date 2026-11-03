import { legacyEncode } from "../original-protocol";
import { projectLegacySettlement, type LegacySettlementPlan } from "../legacy/settlement-plan";
import type { StoredLegacyMatch } from "./game-durable-object";
import { SupabaseLegacyRest } from "./supabase";

export interface LegacySettlementReceipt {
  matchId: number;
  historyGid: number;
  endedAt: number;
  snapshot: StoredLegacyMatch;
  plan: LegacySettlementPlan;
  hooksPending: true;
}

/** Server-only encoding of the original compressed history fields. No HTTP
 * request may supply awards, a winner or a replacement match snapshot. */
export async function legacySettlementHistory(snapshot: StoredLegacyMatch, now: number) {
  const ordered = Object.fromEntries(Object.entries(snapshot.state.players)
    .sort(([, a], [, b]) => Number(a.pid) - Number(b.pid)));
  const plan = projectLegacySettlement(ordered, snapshot.state.gametype, snapshot.state.gamestate, now);
  if (!plan) throw new Error("游戏尚未达到结算条件。");
  const entrants = Object.fromEntries(Object.entries(ordered).filter(([, p]) => Number(p.type) === 0)
    .map(([name, p]) => [name, { ...p, ...(plan.decision.winners.includes(name) ? { winner_flag: plan.decision.winmode } : {}) }]));
  const solo = plan.decision.winners.length === 1 ? entrants[plan.decision.winners[0]!] : undefined;
  return {
    validlist: plan.decision.winmode === 4 ? "" : await legacyEncode(entrants),
    winnerpdata: solo ? await legacyEncode(solo) : ""
  };
}

export class SupabaseLegacySettlement {
  constructor(readonly rest: SupabaseLegacyRest) {}

  async reconcile(matchId: number, expectedVersion: number): Promise<StoredLegacyMatch> {
    const rows = await this.rest.rpc<StoredLegacyMatch[]>("dtr_match_reconcile", {
      p_match_id: matchId, p_expected_version: expectedVersion
    });
    const snapshot = rows[0];
    if (!snapshot || snapshot.state?.matchId !== matchId || !Number.isSafeInteger(snapshot.version)
        || snapshot.version < expectedVersion) throw new Error("Cannot reconcile pending settlement.");
    return snapshot;
  }

  async settle(snapshot: StoredLegacyMatch, now: number): Promise<LegacySettlementReceipt> {
    const history = await legacySettlementHistory(snapshot, now);
    const receipt = await this.rest.rpc<LegacySettlementReceipt>("dtr_match_settle", {
      p_match_id: snapshot.state.matchId,
      p_expected_version: snapshot.version,
      p_ended_at: now,
      p_history: history
    });
    if (receipt?.matchId !== snapshot.state.matchId || receipt.snapshot?.state?.matchId !== receipt.matchId
        || receipt.snapshot.state.gamestate !== 0 || !receipt.snapshot.state.settlement
        || !Number.isSafeInteger(receipt.snapshot.version) || receipt.snapshot.version <= snapshot.version) {
      throw new Error("Invalid authoritative settlement receipt.");
    }
    return receipt;
  }
}
