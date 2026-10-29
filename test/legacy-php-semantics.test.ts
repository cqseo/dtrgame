import { describe, expect, it } from "vitest";
import { phpArrayKey, phpBool, phpEmpty, phpInt, phpLooseEqual, phpNumber, phpString } from "../src/legacy/php-semantics";

describe("PHP 7.4 compatibility scalars", () => {
  it("matches empty and boolean behavior used by original modules", () => {
    expect([undefined, null, false, 0, 0n, "", "0", []].map(phpEmpty)).toEqual(Array(8).fill(true));
    expect([true, 1, -1, "00", "false", [0], {}].map(phpBool)).toEqual(Array(7).fill(true));
  });

  it("preserves legacy numeric, integer and string coercion", () => {
    expect(phpNumber("  -12.5xyz")).toBe(-12.5);
    expect(phpNumber("not numeric")).toBe(0);
    expect(phpInt("9.9foo")).toBe(9);
    expect(phpString(false)).toBe("");
    expect(phpString(true)).toBe("1");
  });

  it("casts PHP array keys and common loose comparisons", () => {
    expect([phpArrayKey("8"), phpArrayKey("08"), phpArrayKey(-2.9), phpArrayKey(false), phpArrayKey(null)]).toEqual([8, "08", -2, 0, ""]);
    expect(phpLooseEqual(0, "anything")).toBe(true);
    expect(phpLooseEqual(12, "12abc")).toBe(true);
    expect(phpLooseEqual(false, "0")).toBe(true);
    expect(phpLooseEqual("2", 3)).toBe(false);
  });
});
