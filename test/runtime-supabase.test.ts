import { describe, expect, it, vi } from "vitest";
import { createLegacyRoomRecord } from "../src/legacy/room";
import { legacyEncode } from "../src/original-protocol";
import {
  SupabaseLegacyAccounts,
  SupabaseLegacyIndex,
  SupabaseLegacyMatches,
  SupabaseLegacyRest,
  SupabaseLegacyRooms,
  SupabaseMatchSnapshots
} from "../src/runtime/supabase";
import { SupabaseLegacyDatabase } from "../src/runtime/supabase-legacy-database";

function client(fetchMock: typeof fetch): SupabaseLegacyRest {
  return new SupabaseLegacyRest({
    url: "https://qtjcjmpapjsgrrgtfica.supabase.co",
    secretKey: "sb_secret_test_only",
    fetch: fetchMock
  });
}

describe("Supabase legacy runtime adapter", () => {
  it("rejects browser publishable keys", () => {
    expect(() => new SupabaseLegacyRest({
      url: "https://qtjcjmpapjsgrrgtfica.supabase.co",
      secretKey: "sb_publishable_wrong",
    })).toThrow("server-side Supabase secret key");
  });

  it("reads an original account only from the selected QA schema", async () => {
    const fetchMock = vi.fn(async (request: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(String(request));
      expect(url.pathname).toBe("/rest/v1/rpc/dtr_legacy_user");
      expect(JSON.parse(String(init?.body))).toEqual({ p_username: "测试者" });
      const headers = new Headers(init?.headers);
      expect(headers.get("accept-profile")).toBe("public");
      expect(headers.get("apikey")).toBe("sb_secret_test_only");
      expect(headers.has("authorization")).toBe(false);
      return Response.json([{ username: "测试者", password: "digest", groupid: 1, roomid: 0 }]);
    }) as unknown as typeof fetch;
    const row = await new SupabaseLegacyAccounts(client(fetchMock)).findByUsername("测试者");
    expect(row).toEqual({ username: "测试者", password: "digest", groupid: 1, roomid: 0 });
  });

  it("decodes and saves the original roomvars wire representation", async () => {
    const source = createLegacyRoomRecord(3, 0, "甲", 10);
    const encoded = await legacyEncode(source.room);
    const requests: { url: string; init?: RequestInit }[] = [];
    const fetchMock = vi.fn(async (request: RequestInfo | URL, init?: RequestInit) => {
      requests.push({ url: String(request), ...(init ? { init } : {}) });
      if (String(request).endsWith("/rpc/dtr_legacy_room")) return Response.json([{
        groomid: 3, groomtype: 0, groomstatus: 10, gametype: 10, gamestate: 0, roomvars: encoded
      }]);
      return new Response(null, { status: 204 });
    }) as unknown as typeof fetch;
    const rooms = new SupabaseLegacyRooms(client(fetchMock));
    const loaded = await rooms.loadRecord(3, 20);
    expect(loaded?.room.player[0]?.name).toBe("甲");
    expect(loaded?.ownerHeartbeat).toBe(20);
    await rooms.saveRecord(loaded!);
    expect(requests[1]?.init?.method).toBe("POST");
    expect(new URL(requests[1]!.url).pathname).toBe("/rest/v1/rpc/dtr_legacy_save_room");
    expect(new Headers(requests[1]?.init?.headers).get("content-profile")).toBe("public");
    expect(JSON.parse(String(requests[1]?.init?.body))).toMatchObject({ p_groomtype: 0, p_groomstatus: 10 });
  });

  it("loads the global and active-room index snapshot in one RPC", async () => {
    const fetchMock = vi.fn(async (request: RequestInfo | URL) => {
      expect(new URL(String(request)).pathname).toBe("/rest/v1/rpc/dtr_legacy_index_state");
      return Response.json([{
        global_state: { groomid: 0, gamenum: 1 },
        rooms: [{ groomid: 4, groomstatus: 10 }],
        site_text: { adminmsg: "公告" }
      }]);
    }) as unknown as typeof fetch;
    await expect(new SupabaseLegacyIndex(client(fetchMock)).load()).resolves.toMatchObject({
      globalState: { groomid: 0, gamenum: 1 },
      rooms: [{ groomid: 4, groomstatus: 10 }],
      siteText: { adminmsg: "公告" }
    });
  });

  it("locates only the authenticated user's active match", async () => {
    const fetchMock = vi.fn(async (request: RequestInfo | URL, init?: RequestInit) => {
      expect(new URL(String(request)).pathname).toBe("/rest/v1/rpc/dtr_legacy_user_match");
      expect(JSON.parse(String(init?.body))).toEqual({ p_username: "测试者" });
      return Response.json([{
        room_id: 4, match_id: 4_000_000_007, gamenum: 7, gamestate: 40,
        gametype: 10, groomtype: 0, groomstatus: 40, starttime: 123,
        validnum: 2, alivenum: 2, deathnum: 0, areanum: 0, weather: 1
      }]);
    }) as unknown as typeof fetch;

    await expect(new SupabaseLegacyMatches(client(fetchMock)).forUser("测试者")).resolves.toEqual({
      roomId: 4, matchId: 4_000_000_007, gamenum: 7, gamestate: 40,
      gametype: 10, groomtype: 0, groomstatus: 40, starttime: 123,
      validnum: 2, alivenum: 2, deathnum: 0, areanum: 0, weather: 1
    });
  });

  it("loads and version-guards complete match snapshots through private server RPCs", async () => {
    const requests: { path: string; body: unknown }[] = [];
    const fetchMock = vi.fn(async (request: RequestInfo | URL, init?: RequestInit) => {
      const path = new URL(String(request)).pathname;
      const body = JSON.parse(String(init?.body));
      requests.push({ path, body });
      if (path.endsWith("/dtr_match_load")) return Response.json([{ version: 7, state: { matchId: 9, gamestate: 10 } }]);
      return Response.json(true);
    }) as unknown as typeof fetch;
    const snapshots = new SupabaseMatchSnapshots<{ matchId: number; gamestate: number }>(client(fetchMock));

    await expect(snapshots.load(9)).resolves.toEqual({ version: 7, state: { matchId: 9, gamestate: 10 } });
    await expect(snapshots.save(9, 8, { matchId: 9, gamestate: 20 })).resolves.toBe(true);
    expect(requests).toEqual([
      { path: "/rest/v1/rpc/dtr_match_load", body: { p_match_id: 9 } },
      { path: "/rest/v1/rpc/dtr_match_save", body: { p_match_id: 9, p_version: 8, p_state: { matchId: 9, gamestate: 20 } } }
    ]);
    await expect(snapshots.load(0)).resolves.toBeNull();
    expect(() => snapshots.save(9, -1, { matchId: 9, gamestate: 20 })).toThrow("Invalid match snapshot identity");
  });

  it("runs synchronous legacy SQL over one Supabase snapshot and commits only changed rows", async () => {
    const requests: { path: string; body: Record<string, unknown> }[] = [];
    const fetchMock = vi.fn(async (request: RequestInfo | URL, init?: RequestInit) => {
      const path = new URL(String(request)).pathname;
      const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
      requests.push({ path, body });
      if (path.endsWith("/dtr_legacy_database_load")) {
        return Response.json([{
          revision: 3,
          tables: { players: [{ pid: 2, name: "测试者", hp: 10, type: 0 }] }
        }]);
      }
      return Response.json([{ revision: 4 }]);
    }) as unknown as typeof fetch;

    const database = await SupabaseLegacyDatabase.load(client(fetchMock), 4, "测试者", ["players"]);
    expect(database.query("UPDATE acbra2_s4_players SET hp = '8' WHERE pid='2'")).toBe(true);
    await expect(database.commit()).resolves.toBe(4);

    expect(requests[0]).toEqual({
      path: "/rest/v1/rpc/dtr_legacy_database_load",
      body: { p_room_id: 4, p_username: "测试者", p_tables: ["players"] }
    });
    expect(requests[1]?.path).toBe("/rest/v1/rpc/dtr_legacy_database_commit");
    expect(requests[1]?.body).toMatchObject({ p_room_id: 4, p_expected_revision: 3 });
    expect(requests[1]?.body.p_changes).toEqual([{
      operation: "upsert",
      table: "acbra2_s4_players",
      key: { pid: "2" },
      row: { pid: "2", name: "测试者", hp: "8", type: "0" }
    }]);
  });
});
