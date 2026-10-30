import { legacyAuthenticateCookies } from "../original-login";
import { parseLegacyForm } from "./command";
import type { StoredLegacyMatch } from "./game-durable-object";
import { SupabaseLegacyAccounts, SupabaseLegacyMatches, type LegacyUserMatch } from "./supabase";

export type LegacyGameStateResult =
  | { ok: true; username: string; match: LegacyUserMatch; snapshot: StoredLegacyMatch }
  | { ok: false; status: 401 | 404 | 409; error: string };

export type LegacyGameCommandResult =
  | { ok: true; username: string; match: LegacyUserMatch; snapshot: StoredLegacyMatch; output: Record<string, unknown> }
  | { ok: false; status: 401 | 404 | 409; error: string };

async function json<T>(response: Response): Promise<T> {
  const body = await response.json<{ error?: string } & T>();
  if (!response.ok) throw new Error(body.error ?? `Game object failed (${response.status}).`);
  return body;
}

/** Authenticated access to one serialized active match. */
export class LegacyGameService {
  constructor(
    readonly namespace: DurableObjectNamespace,
    readonly accounts: SupabaseLegacyAccounts,
    readonly matches: SupabaseLegacyMatches,
    readonly cookiePrefix = "bra_"
  ) {}

  async state(request: Request): Promise<LegacyGameStateResult> {
    const account = await legacyAuthenticateCookies(request.headers.get("cookie") ?? "", this.accounts, this.cookiePrefix);
    if (!account) return { ok: false, status: 401, error: "no_login" };
    const match = await this.matches.forUser(account.username);
    if (!match) return { ok: false, status: 404, error: "你当前不在进行中的游戏里。" };
    const stub = this.namespace.get(this.namespace.idFromName(String(match.matchId)));
    let response = await stub.fetch("https://game.internal/state");
    if (response.status === 404) {
      response = await stub.fetch("https://game.internal/restore", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ matchId: match.matchId })
      });
    }
    try {
      return { ok: true, username: account.username, match, snapshot: await json<StoredLegacyMatch>(response) };
    } catch (error) {
      return { ok: false, status: 409, error: error instanceof Error ? error.message : "游戏数据读取失败。" };
    }
  }

  async execute(request: Request, now = Math.floor(Date.now() / 1000)): Promise<LegacyGameCommandResult> {
    const current = await this.state(request);
    if (!current.ok) return current;
    const input = await parseLegacyForm(request);
    const stub = this.namespace.get(this.namespace.idFromName(String(current.match.matchId)));
    const command = input.command ?? "menu";
    let response: Response;
    if (command === "attack") {
      response = await stub.fetch("https://game.internal/battle", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: current.username, target: input.target ?? "", active: true, weatherId: current.match.weather, now })
      });
    } else {
      response = await stub.fetch("https://game.internal/command", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: current.username,
          mode: input.mode ?? "command",
          command,
          input,
          now,
          requestStartMs: Date.now()
        })
      });
    }
    try {
      const output = await json<Record<string, unknown>>(response);
      const refreshed = await json<StoredLegacyMatch>(await stub.fetch("https://game.internal/state"));
      return { ok: true, username: current.username, match: current.match, snapshot: refreshed, output };
    } catch (error) {
      return { ok: false, status: 409, error: error instanceof Error ? error.message : "游戏命令执行失败。" };
    }
  }
}
