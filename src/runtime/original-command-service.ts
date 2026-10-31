import { legacyAuthenticateCookies } from "../original-login";
import { createLegacyModuleRuntime } from "../legacy/php/compiled-modules";
import type { SupabaseLegacyAccounts, SupabaseLegacyMatches, SupabaseLegacyRest } from "./supabase";
import { SupabaseLegacyDatabase, legacyPhysicalTableName } from "./supabase-legacy-database";

export type LegacyRoutineResult =
  | { ok: true; revision: number }
  | { ok: false; status: 401 | 404 | 409; error: string };

/**
 * First real command.php vertical slice.
 *
 * `room_routine_single` is an original command: command.php performs the
 * common sys\routine() tick and then returns without a page body. This runs
 * that exact compiled routine over the Supabase request snapshot instead of
 * the temporary hand-written match model.
 */
export class LegacyOriginalCommandService {
  constructor(
    readonly rest: SupabaseLegacyRest,
    readonly accounts: SupabaseLegacyAccounts,
    readonly matches: SupabaseLegacyMatches,
    readonly cookiePrefix = "bra_"
  ) {}

  async executeRoomRoutine(request: Request, now: number): Promise<LegacyRoutineResult> {
    const account = await legacyAuthenticateCookies(
      request.headers.get("cookie") ?? "",
      this.accounts,
      this.cookiePrefix
    );
    if (!account) return { ok: false, status: 401, error: "no_login" };
    const match = await this.matches.forUser(account.username);
    if (!match) return { ok: false, status: 404, error: "你当前不在进行中的游戏里。" };

    try {
      const database = await SupabaseLegacyDatabase.load(
        this.rest,
        match.roomId,
        account.username,
        ["game"]
      );
      const runtime = createLegacyModuleRuntime({ database });
      const roomPrefix = match.roomId > 0 ? `s${match.roomId}` : "";
      runtime.store.set("sys", "gtablepre", "acbra2_");
      runtime.store.set("sys", "room_id", String(match.roomId));
      runtime.store.set("sys", "room_prefix", roomPrefix);
      runtime.store.set("sys", "tablepre", legacyPhysicalTableName(match.roomId, "players").replace(/players$/, ""));
      runtime.store.set("sys", "wtablepre", match.roomId > 0 ? "acbra2_s" : "acbra2_");
      runtime.store.set("sys", "now", now);
      runtime.store.set("sys", "cuser", account.username);
      runtime.store.set("sys", "cpass", account.password);

      runtime.call("sys\\routine");
      return { ok: true, revision: await database.commit() };
    } catch (error) {
      return {
        ok: false,
        status: 409,
        error: error instanceof Error ? error.message : "游戏状态刷新失败。"
      };
    }
  }
}
