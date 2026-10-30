import { describe, expect, it, vi } from "vitest";
// Node types are intentionally not part of the Worker production tsconfig.
// @ts-expect-error test-only Node builtin
import { readFileSync } from "node:fs";
import { legacyCookiePassword, legacyStoredPassword } from "../src/original-auth";
import { handleLegacyLogin } from "../src/runtime/http-auth";
import type { SupabaseLegacyAccounts } from "../src/runtime/supabase";

const assets = {
  async fetch(request: Request): Promise<Response> {
    const path = `public${new URL(request.url).pathname}`;
    try { return new Response(readFileSync(path), { status: 200 }); }
    catch { return new Response("", { status: 404 }); }
  }
};

describe("legacy HTTP login endpoint", () => {
  it("authenticates, records the login and emits original cookies", async () => {
    const cookiePassword = legacyCookiePassword("secret");
    const accounts = {
      findByUsername: vi.fn(async () => ({
        username: "测试者", password: legacyStoredPassword("测试者", cookiePassword), groupid: 1, roomid: 7
      })),
      recordLastLogin: vi.fn(async () => undefined),
      setCurrentRoom: vi.fn(async () => undefined)
    } as unknown as SupabaseLegacyAccounts;
    const response = await handleLegacyLogin(new Request("https://game.test/login.php", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "username=%E6%B5%8B%E8%AF%95%E8%80%85&password=secret"
    }), accounts, assets, Date.UTC(2026, 9, 30));

    expect(response?.status).toBe(302);
    expect(response?.headers.get("location")).toBe("index.php");
    const cookies = response?.headers.getSetCookie() ?? [];
    expect(cookies.some(cookie => cookie.startsWith("bra_user="))).toBe(true);
    expect(cookies.some(cookie => cookie.startsWith("bra_pass=") && cookie.includes("HttpOnly"))).toBe(true);
    expect(cookies.some(cookie => cookie.startsWith("bra_roomid=0"))).toBe(true);
    expect(accounts.recordLastLogin).toHaveBeenCalledWith("测试者", 1793318400);
    expect(accounts.setCurrentRoom).toHaveBeenCalledWith("测试者", 0);
  });

  it("renders the original gexit error page for a bad password", async () => {
    const accounts = {
      findByUsername: vi.fn(async () => ({ username: "测试者", password: "bad", groupid: 1, roomid: 0 }))
    } as unknown as SupabaseLegacyAccounts;
    const response = await handleLegacyLogin(new Request("https://game.test/login.php", {
      method: "POST", body: "username=%E6%B5%8B%E8%AF%95%E8%80%85&password=secret"
    }), accounts, assets);
    const body = await response?.text();
    expect(response?.status).toBe(200);
    expect(body).toContain("用户名或密码错误，请检查输入");
    expect(body).toContain("<title> ACFUN 大 逃 杀 </title>");
  });

  it("clears credentials on quit without querying Supabase", async () => {
    const accounts = { findByUsername: vi.fn() } as unknown as SupabaseLegacyAccounts;
    const response = await handleLegacyLogin(
      new Request("https://game.test/login.php?mode=quit"), accounts, assets
    );
    expect(response?.status).toBe(302);
    expect(response?.headers.getSetCookie()).toHaveLength(2);
    expect(accounts.findByUsername).not.toHaveBeenCalled();
  });
});
