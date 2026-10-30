import { LEGACY_ROOM_CONFIGURATION } from "../generated/legacy-room-types";
import { createLegacyRoomRecord, getLegacyRoomType, type LegacyRoomRecord } from "../legacy/room";
import { legacyAuthenticateCookies } from "../original-login";
import { SupabaseLegacyAccounts, SupabaseLegacyLobby, SupabaseLegacyRooms } from "./supabase";

export type LegacyLobbyResult =
  | { ok: true; username: string; roomId: number; record: LegacyRoomRecord }
  | { ok: false; status: 401 | 404 | 409; error: string };

async function objectRecord(response: Response): Promise<LegacyRoomRecord> {
  const body = await response.json<LegacyRoomRecord & { error?: string }>();
  if (!response.ok) throw new Error(body.error ?? `Room object failed (${response.status}).`);
  return body;
}

/** Atomic create/join boundary used by command_roomcmd's newroom/enterroom branches. */
export class LegacyLobbyService {
  constructor(
    readonly namespace: DurableObjectNamespace,
    readonly accounts: SupabaseLegacyAccounts,
    readonly lobby: SupabaseLegacyLobby,
    readonly rooms: SupabaseLegacyRooms,
    readonly cookiePrefix = "bra_"
  ) {}

  async create(request: Request, roomType: number, now: number): Promise<LegacyLobbyResult> {
    const account = await legacyAuthenticateCookies(request.headers.get("cookie") ?? "", this.accounts, this.cookiePrefix);
    if (!account) return { ok: false, status: 401, error: "no_login" };
    if (account.roomid > 0) return { ok: false, status: 409, error: "你已在房间内，请先退出房间" };
    try {
      const config = getLegacyRoomType(roomType);
      if (!config.available) return { ok: false, status: 409, error: "该房间类型暂不能使用" };
      const draft = createLegacyRoomRecord(1, roomType, account.username, now);
      const roomId = await this.lobby.createRoom(account.username, draft);
      const record = { ...draft, roomId };
      const stub = this.namespace.get(this.namespace.idFromName(String(roomId)));
      const response = await stub.fetch("https://room.internal/replace", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(record)
      });
      return { ok: true, username: account.username, roomId, record: await objectRecord(response) };
    } catch (error) {
      return { ok: false, status: 409, error: error instanceof Error ? error.message : "房间参数错误" };
    }
  }

  async join(request: Request, roomId: number, now: number): Promise<LegacyLobbyResult> {
    const account = await legacyAuthenticateCookies(request.headers.get("cookie") ?? "", this.accounts, this.cookiePrefix);
    if (!account) return { ok: false, status: 401, error: "no_login" };
    if (account.roomid > 0) return { ok: false, status: 409, error: "你已在房间内，请先退出房间" };
    try {
      const row = await this.lobby.joinRoom(account.username, roomId);
      if (!row) return { ok: false, status: 404, error: `房间${roomId}数据记录不存在` };
      let record = await this.rooms.loadRecord(roomId, now);
      if (!record) return { ok: false, status: 404, error: `房间${roomId}数据记录不存在` };
      const stub = this.namespace.get(this.namespace.idFromName(String(roomId)));
      let response = await stub.fetch("https://room.internal/hydrate", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(record)
      });
      record = await objectRecord(response);
      response = await stub.fetch("https://room.internal/enter", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username: account.username })
      });
      return { ok: true, username: account.username, roomId, record: await objectRecord(response) };
    } catch (error) {
      return { ok: false, status: 409, error: error instanceof Error ? error.message : "进入房间失败" };
    }
  }
}

export const LEGACY_MAX_ROOM_NUM = LEGACY_ROOM_CONFIGURATION.maxRoomNum;
