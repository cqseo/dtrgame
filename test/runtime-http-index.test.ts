import { describe, expect, it, vi } from "vitest";
// @ts-expect-error test-only Node builtin
import { readFileSync } from "node:fs";
import { createLegacyRoomRecord } from "../src/legacy/room";
import { legacyCookiePassword, legacyStoredPassword } from "../src/original-auth";
import { legacyEncode } from "../src/original-protocol";
import { handleLegacyIndex } from "../src/runtime/http-index";
import type {
  SupabaseIndexGameRow,
  SupabaseLegacyAccounts,
  SupabaseLegacyIndex
} from "../src/runtime/supabase";

const assets = {
  async fetch(request: Request): Promise<Response> {
    try { return new Response(readFileSync(`public${new URL(request.url).pathname}`), { status: 200 }); }
    catch { return new Response("", { status: 404 }); }
  }
};

function game(overrides: Partial<SupabaseIndexGameRow> = {}): SupabaseIndexGameRow {
  return {
    groomid: 0, groomtype: 0, groomstatus: 40, gamenum: 1,
    gametype: 4, gamestate: 0, starttime: 0, validnum: 9, alivenum: 1,
    deathnum: 3, hdamage: 0, hplayer: "", winmode: 2, winner: "admin",
    areanum: 3, roomvars: "", ...overrides
  };
}

describe("legacy index page", () => {
  it("renders the real guest template and new-room bubblebox", async () => {
    const accounts = { findByUsername: vi.fn() } as unknown as SupabaseLegacyAccounts;
    const index = { load: vi.fn(async () => ({
      globalState: game(), rooms: [], siteText: { adminmsg: "", systemmsg: "" }
    })) } as unknown as SupabaseLegacyIndex;
    const response = await handleLegacyIndex(
      new Request("https://game.test/index.php"), accounts, index, assets, Date.UTC(2026, 9, 30, 3, 41)
    );
    const html = await response?.text();
    expect(response?.status).toBe(200);
    expect(html).toContain("<title> ACFUN 大 逃 杀 </title>");
    expect(html).toContain("当前没有任何房间。");
    expect(html).toContain('id="fmsgboxpersistent-newroombox"');
    expect(html).toContain("10月30日 星期五 03:41");
  });

  it("renders an authenticated user's current waiting room", async () => {
    const pass = legacyCookiePassword("secret");
    const account = { username: "房主", password: legacyStoredPassword("房主", pass), groupid: 1, roomid: 4 };
    const record = createLegacyRoomRecord(4, 0, "房主", 100);
    const room = game({
      groomid: 4, groomtype: 0, groomstatus: 10, gametype: 10,
      roomvars: await legacyEncode(record.room), winner: "", winmode: 0
    });
    const accounts = { findByUsername: vi.fn(async () => account) } as unknown as SupabaseLegacyAccounts;
    const index = { load: vi.fn(async () => ({
      globalState: game(), rooms: [room], siteText: {}
    })) } as unknown as SupabaseLegacyIndex;
    const response = await handleLegacyIndex(new Request("https://game.test/", {
      headers: { cookie: `bra_user=${encodeURIComponent("房主")}; bra_pass=${pass}` }
    }), accounts, index, assets, 200_000);
    const html = await response?.text();
    expect(html).toContain("欢迎你，房主！");
    expect(html).toContain("你现在在房间4 中。");
    expect(html).toContain('id="fmsgboxpersistent-roommain"');
    expect(html).toContain("房间编号:&nbsp;</span><span><span class=\"grey b\">s4</span>");
  });
});
