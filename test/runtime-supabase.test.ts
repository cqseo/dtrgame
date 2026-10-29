import { describe, expect, it, vi } from "vitest";
import { createLegacyRoomRecord } from "../src/legacy/room";
import { legacyEncode } from "../src/original-protocol";
import {
  SupabaseLegacyAccounts,
  SupabaseLegacyRest,
  SupabaseLegacyRooms
} from "../src/runtime/supabase";

function client(fetchMock: typeof fetch): SupabaseLegacyRest {
  return new SupabaseLegacyRest({
    url: "https://qtjcjmpapjsgrrgtfica.supabase.co",
    secretKey: "sb_secret_test_only",
    schema: "acfun_runtime_qa_20261029",
    fetch: fetchMock
  });
}

describe("Supabase legacy runtime adapter", () => {
  it("rejects browser publishable keys", () => {
    expect(() => new SupabaseLegacyRest({
      url: "https://qtjcjmpapjsgrrgtfica.supabase.co",
      secretKey: "sb_publishable_wrong",
      schema: "acfun_runtime_qa_20261029"
    })).toThrow("server-side Supabase secret key");
  });

  it("reads an original account only from the selected QA schema", async () => {
    const fetchMock = vi.fn(async (request: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(String(request));
      expect(url.pathname).toBe("/rest/v1/users");
      expect(url.searchParams.get("username")).toBe("eq.测试者");
      const headers = new Headers(init?.headers);
      expect(headers.get("accept-profile")).toBe("acfun_runtime_qa_20261029");
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
      if (!init?.method) return Response.json([{
        groomid: 3, groomtype: 0, groomstatus: 10, gametype: 10, gamestate: 0, roomvars: encoded
      }]);
      return new Response(null, { status: 204 });
    }) as unknown as typeof fetch;
    const rooms = new SupabaseLegacyRooms(client(fetchMock));
    const loaded = await rooms.loadRecord(3, 20);
    expect(loaded?.room.player[0]?.name).toBe("甲");
    expect(loaded?.ownerHeartbeat).toBe(20);
    await rooms.saveRecord(loaded!);
    expect(requests[1]?.init?.method).toBe("PATCH");
    expect(new Headers(requests[1]?.init?.headers).get("content-profile")).toBe("acfun_runtime_qa_20261029");
    expect(JSON.parse(String(requests[1]?.init?.body))).toMatchObject({ groomtype: 0, groomstatus: 10 });
  });
});
