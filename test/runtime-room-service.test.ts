import { describe, expect, it, vi } from "vitest";
import { legacyCookiePassword, legacyStoredPassword } from "../src/original-auth";
import { applyLegacyRoomCommand, createLegacyRoomRecord, type LegacyRoomRecord } from "../src/legacy/room";
import { LegacyRoomService } from "../src/runtime/room-service";
import type { SupabaseLegacyAccounts, SupabaseLegacyRooms } from "../src/runtime/supabase";

class FakeRoomStub {
  record: LegacyRoomRecord | undefined;

  async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const path = new URL(String(input)).pathname;
    if (path === "/state") return this.record ? Response.json(this.record) : Response.json({ error: "missing" }, { status: 404 });
    if (path === "/hydrate") {
      this.record = JSON.parse(String(init?.body)) as LegacyRoomRecord;
      return Response.json(this.record, { status: 201 });
    }
    if (path === "/command" && this.record) {
      const command = JSON.parse(String(init?.body));
      return Response.json(applyLegacyRoomCommand({ record: this.record }, command));
    }
    return Response.json({ error: "bad request" }, { status: 400 });
  }
}

describe("authenticated room persistence service", () => {
  it("hydrates once and delegates the serialized command to the room object", async () => {
    const cookiePass = legacyCookiePassword("secret");
    const account = { username: "甲", password: legacyStoredPassword("甲", cookiePass), groupid: 1, roomid: 2 };
    const setCurrentRoom = vi.fn(async () => undefined);
    const accounts = {
      findByUsername: vi.fn(async () => account),
      setCurrentRoom
    } as unknown as SupabaseLegacyAccounts;
    const persisted = createLegacyRoomRecord(2, 0, "甲", 10);
    const loadRecord = vi.fn(async () => structuredClone(persisted));
    const saveRecord = vi.fn(async () => undefined);
    const rooms = { loadRecord, saveRecord } as unknown as SupabaseLegacyRooms;
    const stub = new FakeRoomStub();
    const namespace = {
      idFromName: vi.fn(() => ({ toString: () => "2" })),
      get: vi.fn(() => stub)
    } as unknown as DurableObjectNamespace;
    const service = new LegacyRoomService(namespace, accounts, rooms);
    const request = new Request("https://game.test/roomcmd.php", {
      method: "POST",
      headers: {
        cookie: `bra_user=${encodeURIComponent("甲")}; bra_pass=${cookiePass}`,
        "content-type": "application/x-www-form-urlencoded"
      },
      body: "command=newchat&para1=hello"
    });
    const result = await service.execute(request, 20);
    expect(result.ok).toBe(true);
    expect(loadRecord).toHaveBeenCalledOnce();
    expect(saveRecord).not.toHaveBeenCalled();
    expect(stub.record?.room.chatdata[9]?.data).toContain("甲:</span>&nbsp;hello");
    expect(setCurrentRoom).not.toHaveBeenCalled();
  });

  it("does not touch room storage for an invalid cookie", async () => {
    const accounts = { findByUsername: vi.fn(async () => null) } as unknown as SupabaseLegacyAccounts;
    const rooms = { loadRecord: vi.fn(), saveRecord: vi.fn() } as unknown as SupabaseLegacyRooms;
    const namespace = { idFromName: vi.fn(), get: vi.fn() } as unknown as DurableObjectNamespace;
    const result = await new LegacyRoomService(namespace, accounts, rooms).execute(
      new Request("https://game.test/roomcmd.php", { method: "POST", body: "command=ready" }), 20
    );
    expect(result).toEqual({ ok: false, status: 401, error: "no_login" });
    expect(namespace.idFromName).not.toHaveBeenCalled();
  });
});
