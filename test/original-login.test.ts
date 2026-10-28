import { describe, expect, it } from "vitest";
import {
  legacyAuthenticateForm, legacyAuthenticateCookies, legacyCookieHeaders,
  legacyReadCookiePair, type LegacyUserStore
} from "../src/original-login";
import { legacyCookiePassword, legacyStoredPassword } from "../src/original-auth";

const username = "测试用户";
const password = "ExamplePassword2026";
const cookie = legacyCookiePassword(password);
const fakeStore: LegacyUserStore = {
  async findByUsername(name) {
    if (name !== username) return null;
    return { username, password: legacyStoredPassword(username, cookie), groupid: 1, roomid: 3 };
  }
};
describe("original PHP login and 15-day cookies using synthetic accounts", () => {
  it("returns original salted cookie and account identity", async () => {
    const result = await legacyAuthenticateForm(new URLSearchParams({ username, password }), fakeStore);
    expect(result).toEqual({ ok: true, username, cookiePassword: cookie });
  });
  it("rejects absent, banned, and incorrect account credentials", async () => {
    expect(await legacyAuthenticateForm(new URLSearchParams({ username, password: "wrong" }), fakeStore))
      .toMatchObject({ ok: false, error: "wrong_pw" });
    expect(await legacyAuthenticateForm(new URLSearchParams({ username: "不存在", password }), fakeStore))
      .toMatchObject({ ok: false, error: "user_not_exists" });
    const banned: LegacyUserStore = {
      async findByUsername() { return { username, password: legacyStoredPassword(username, cookie), groupid: 0, roomid: 0 }; }
    };
    expect(await legacyAuthenticateForm(new URLSearchParams({ username, password }), banned))
      .toMatchObject({ ok: false, error: "user_ban" });
  });
  it("generates compatible 15-day PHP-style cookies, password HttpOnly", async () => {
    const [u, p] = legacyCookieHeaders(username, cookie, "bra_", true, Date.UTC(2026, 9, 28));
    expect(u).toContain("bra_user=");
    expect(u).toContain("Expires=Thu, 12 Nov 2026 00:00:00 GMT");
    expect(p).toContain("bra_pass=");
    expect(p).toContain("; HttpOnly");
    expect(p).toContain("; Secure");
    expect(u).not.toContain("HttpOnly");
    const pair = legacyReadCookiePair(u.split(";")[0] + "; " + p.split(";")[0], "bra_");
    expect(pair).toEqual({ username, cookiePassword: cookie });
    const valid = await legacyAuthenticateCookies(u.split(";")[0] + "; " + p.split(";")[0], fakeStore, "bra_");
    expect(valid?.roomid).toBe(3);
  });
  it("rejects mismatched or malformed session cookie pairs", async () => {
    expect(await legacyAuthenticateCookies("bra_user=" + encodeURIComponent(username) + "; bra_pass=bad", fakeStore, "bra_")).toBeNull();
    expect(await legacyAuthenticateCookies("bra_user=" + encodeURIComponent(username) + "; bra_pass=" + legacyCookiePassword("bad"), fakeStore, "bra_")).toBeNull();
    expect(await legacyAuthenticateCookies("bra_user=" + encodeURIComponent(username), fakeStore, "bra_")).toBeNull();
  });
});
