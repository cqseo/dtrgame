import { legacyAuthenticateCookies } from "../original-login";
import type { LegacyRoomCommandResult, LegacyRoomRecord } from "../legacy/room";
import { parseLegacyForm, toLegacyRoomCommand } from "./command";
import { SupabaseLegacyAccounts, SupabaseLegacyRooms } from "./supabase";

export type LegacyRoomServiceResult =
  | { ok: true; username: string; result: LegacyRoomCommandResult }
  | { ok: false; status: 401 | 404 | 409; error: string };

async function readJson<T>(response: Response): Promise<T> {
  const value = await response.json<{ error?: string } & T>();
  if (!response.ok) throw new Error(value.error ?? `Room object failed (${response.status}).`);
  return value;
}

/** Authenticated transaction boundary: Supabase snapshot -> one DO command -> Supabase commit. */
export class LegacyRoomService {
  constructor(
    readonly namespace: DurableObjectNamespace,
    readonly accounts: SupabaseLegacyAccounts,
    readonly rooms: SupabaseLegacyRooms,
    readonly cookiePrefix = "bra_"
  ) {}

  async execute(request: Request, now: number): Promise<LegacyRoomServiceResult> {
    const account = await legacyAuthenticateCookies(request.headers.get("cookie") ?? "", this.accounts, this.cookiePrefix);
    if (!account) return { ok: false, status: 401, error: "no_login" };
    if (!Number.isSafeInteger(account.roomid) || account.roomid < 1) {
      return { ok: false, status: 404, error: "你不在房间内，请先进入房间" };
    }
    const id = this.namespace.idFromName(String(account.roomid));
    const stub = this.namespace.get(id);
    let stateResponse = await stub.fetch("https://room.internal/state");
    if (stateResponse.status === 404) {
      const persisted = await this.rooms.loadRecord(account.roomid, now);
      if (!persisted) return { ok: false, status: 404, error: "房间数据记录不存在。" };
      stateResponse = await stub.fetch("https://room.internal/hydrate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(persisted)
      });
    }
    await readJson<LegacyRoomRecord>(stateResponse);
    const input = await parseLegacyForm(request);
    const command = toLegacyRoomCommand(input, account.username, now);
    const commandResponse = await stub.fetch("https://room.internal/command", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(command)
    });
    let result: LegacyRoomCommandResult;
    try {
      result = await readJson<LegacyRoomCommandResult>(commandResponse);
    } catch (error) {
      return { ok: false, status: 409, error: error instanceof Error ? error.message : "房间命令失败。" };
    }
    if (result.left) await this.accounts.setCurrentRoom(account.username, 0);
    return { ok: true, username: account.username, result };
  }
}
