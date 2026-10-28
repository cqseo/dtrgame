import { describe, expect, it } from "vitest";
import {
  legacyMd5, legacyCookiePassword, legacyStoredPassword,
  legacyPasswordMatches, legacyUsernameCheck, legacyPasswordCheck
} from "../src/original-auth";

describe("original PHP authentication compatibility (synthetic accounts)", () => {
  it.each([
    ["", "d41d8cd98f00b204e9800998ecf8427e"],
    ["abc", "900150983cd24fb0d6963f7d28e17f72"],
    ["中文", "a7bac2239fcdcb3a067903d8077c4a07"],
    ["玩家Alice", "273c9c7780983d693a0b8cb412f4ca4d"],
    ["password", "5f4dcc3b5aa765d61d8327deb882cf99"],
  ])("matches PHP md5 for UTF-8 input %s", (value, expected) => {
    expect(legacyMd5(value)).toBe(expected);
  });
  it("matches actual PHP's double-MD5 salted account format", () => {
    const username = "测试用户";
    const cookie = legacyCookiePassword("password");
    const stored = legacyStoredPassword(username, cookie);
    expect(cookie).toBe("5f4dcc3b5aa765d61d8327deb882cf99");
    expect(stored).toBe("451bc7941747d8bdfc3cc5fa3de9840a");
    expect(legacyPasswordMatches(username, cookie, stored)).toBe(true);
    expect(legacyPasswordMatches("不同用户名", cookie, stored)).toBe(false);
    expect(legacyPasswordMatches(username, legacyCookiePassword("wrong"), stored)).toBe(false);
  });
  it("respects the original optional unsalted-hash compatibility", () => {
    const cookie = legacyCookiePassword("old-password");
    expect(legacyPasswordMatches("user", cookie, cookie)).toBe(true);
    expect(legacyPasswordMatches("user", cookie, cookie, false)).toBe(false);
  });
  it("uses original 15-character name and validation rules", () => {
    expect(legacyUsernameCheck("测试用户")).toBe("name_ok");
    expect(legacyUsernameCheck("")).toBe("name_not_set");
    expect(legacyUsernameCheck("长".repeat(16))).toBe("name_too_long");
    expect(legacyUsernameCheck("bad\nname")).toBe("name_invalid");
    expect(legacyUsernameCheck("bad;name")).toBe("name_invalid");
    expect(legacyUsernameCheck("banned", /^banned$/)).toBe("name_banned");
  });
  it("matches byte-length password restrictions of installed PHP", () => {
    expect(legacyPasswordCheck("a", "a")).toBe("pass_ok");
    expect(legacyPasswordCheck("中文".repeat(9), "中文".repeat(9))).toBe("pass_ok");
    expect(legacyPasswordCheck("中文".repeat(25), "中文".repeat(25))).toBe("pass_too_long");
    expect(legacyPasswordCheck("", "")).toBe("pass_not_set");
    expect(legacyPasswordCheck("abcd", "abce")).toBe("pass_not_match");
  });
});