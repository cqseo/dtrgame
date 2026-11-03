import { describe, expect, it } from "vitest";
import { cookiesOf } from "../src/runtime/legacy-page-handler";
import { legacyReadCookiePair } from "../src/original-login";

describe("original PHP 8.2 cookie parsing", () => {
  it("preserves literal + while decoding %2B and %20 in page requests", () => {
    const request = new Request("https://game.test/index.php", {
      headers: {
        cookie: "acbra2_data=a+b%2Bc%20d; other=x%3Dy; raw=foo+bar"
      }
    });
    expect(cookiesOf(request)).toEqual([
      ["acbra2_data", "a+b+c d"],
      ["other", "x=y"],
      ["raw", "foo+bar"]
    ]);
  });

  it("keeps cookie values with embedded equals signs intact", () => {
    const request = new Request("https://game.test/index.php", {
      headers: { cookie: "token=abc==; noequals; valid=ok" }
    });
    expect(cookiesOf(request)).toEqual([
      ["token", "abc=="],
      ["valid", "ok"]
    ]);
  });

  it("uses consistent raw cookie decoding in the login adapter", () => {
    expect(legacyReadCookiePair("bra_user=A+B; bra_pass=abc%2Bdef", "bra_"))
      .toEqual({ username: "A+B", cookiePassword: "abc+def" });
  });
});
