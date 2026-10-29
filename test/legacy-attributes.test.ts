import { describe, expect, it } from "vitest";
import { readLegacyAttribute, replaceLegacyAttribute, processLegacyAttributeConfig, decodeLegacyAttributePayload } from "../src/legacy/attributes";
import { parseLegacyAttributes } from "../src/legacy/item";
describe("enabled compound attribute semantics", () => {
  it("distinguishes literal markers, valued markers and encoded payloads", () => {
    expect(readLegacyAttribute("^001", "s^001^ac2")).toBe(true);
    expect(readLegacyAttribute("^002", "s^001^ac2")).toBe(false);
    expect(readLegacyAttribute("^ac", "s^ac2^ac3")).toBe("2");
    expect(readLegacyAttribute("^ac", "s^ac2^ac3", true)).toBe(5);
    expect(readLegacyAttribute("^res", "^res_abc1")).toBe("abc");
    expect(parseLegacyAttributes("0s|0^001")).toEqual(["s", "^001"]);
  });
  it("replaces whole compound tokens while preserving separator bars", () => {
    expect(replaceLegacyAttribute("^ac", "", "s|^ac2^ac3^xyz4")).toBe("s|^xyz4");
    expect(replaceLegacyAttribute("s", "J", "s^res_sabc1")).toBe("J^res_sabc1");
    expect(replaceLegacyAttribute("^ac2", "", "^ac2", true)).toBe("^ac2");
  });
  it("expands config payloads before the crafted item is handed to inventory", () => {
    const encoded = processLegacyAttributeConfig("^res_<:comp_itmsk:>{杯子,WC,1,1,,}1^rtype2");
    expect(encoded).not.toContain("<:comp_itmsk:>");
    const payload = readLegacyAttribute("^res", encoded);
    expect(typeof payload).toBe("string");
    expect(decodeLegacyAttributePayload(String(payload))).toBe("杯子,WC,1,1,,");
  });
});
