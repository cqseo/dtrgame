import { describe, expect, it, vi } from "vitest";
import { legacyCookiePassword, legacyStoredPassword } from "../src/original-auth";
import { createLegacyRoomRecord, enterLegacyWaitingRoom } from "../src/legacy/room";
import { LegacyLobbyService } from "../src/runtime/lobby-service";
import type {
  SupabaseLegacyAccounts, SupabaseLegacyLobby, SupabaseLegacyRooms
} from "../src/runtime/supabase";

class LobbyStub {
  record = createLegacyRoomRecord(4, 0, "房主", 10);
  async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const path = new URL(String(input)).pathname;
    if (path === "/hydrate" || path === "/replace") {
      this.record = JSON.parse(String(init?.body));
      return Response.json(this.record, { status: 201 });
    }
    if (path === "/enter") {
      const body = JSON.parse(String(init?.body));
      this.record = enterLegacyWaitingRoom(this.record, body.username);
      return Response.json(this.record);
    }
    return Response.json({ error: "bad request" }, { status: 400 });
  }
}

function request(username: string, password: string): Request {
  return new Request("https://game.test/roomcmd.php?command=newroom&para1=0", {
    headers: { cookie: `bra_user=${encodeURIComponent(username)}; bra_pass=${password}` }
  });
}

describe("legacy lobby transaction boundary", () => {
  it("allocates a room then hydrates the matching Durable Object", async () => {
    const pass = legacyCookiePassword("secret");
    const account = { username: "房主", password: legacyStoredPassword("房主", pass), groupid: 1, roomid: 0 };
    const accounts = { findByUsername: vi.fn(async () => account) } as unknown as SupabaseLegacyAccounts;
    const lobby = { createRoom: vi.fn(async () => 4) } as unknown as SupabaseLegacyLobby;
    const rooms = {} as SupabaseLegacyRooms;
    const stub = new LobbyStub();
    const namespace = {
      idFromName: vi.fn(() => ({ toString: () => "4" })), get: vi.fn(() => stub)
    } as unknown as DurableObjectNamespace;
    const result = await new LegacyLobbyService(namespace, accounts, lobby, rooms).create(request("房主", pass), 0, 20);
    expect(result.ok && result.roomId).toBe(4);
    expect(stub.record.roomId).toBe(4);
    expect(stub.record.room.player[0]?.name).toBe("房主");
  });

  it("joins without occupying a slot and writes the original entry chat", async () => {
    const pass = legacyCookiePassword("secret");
    const account = { username: "访客", password: legacyStoredPassword("访客", pass), groupid: 1, roomid: 0 };
    const accounts = { findByUsername: vi.fn(async () => account) } as unknown as SupabaseLegacyAccounts;
    const lobby = { joinRoom: vi.fn(async () => ({ groomid: 4 })) } as unknown as SupabaseLegacyLobby;
    const stored = createLegacyRoomRecord(4, 0, "房主", 10);
    const rooms = { loadRecord: vi.fn(async () => stored) } as unknown as SupabaseLegacyRooms;
    const stub = new LobbyStub();
    const namespace = { idFromName: vi.fn(() => ({})), get: vi.fn(() => stub) } as unknown as DurableObjectNamespace;
    const result = await new LegacyLobbyService(namespace, accounts, lobby, rooms).join(request("访客", pass), 4, 20);
    expect(result.ok).toBe(true);
    expect(stub.record.room.player.some(slot => slot.name === "访客")).toBe(false);
    expect(stub.record.room.chatdata[9]?.data).toContain("访客进入了房间");
  });
});
