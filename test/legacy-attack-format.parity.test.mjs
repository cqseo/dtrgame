import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import {
  addFormat,
  b64ConvToValue,
  equalsignFormat,
  multiplyFormat,
  valueConvToB64
} from "../src/legacy/attack-format";

/**
 * Holds the combat-log formatters and the base-64 digit conversion to the
 * original.
 *
 * The formatters build the arithmetic a player reads after an attack, so
 * their spacing and signs are output, not decoration. One of them carries a
 * defect the port has to keep: multiply_format reads $asign, which it never
 * defines, so its separator is two spaces instead of "×" whenever $space is
 * truthy. The cases below cover both sides of that.
 *
 * Run through `npm run test:php-parity`.
 */
const BOOTSTRAP = { bootstrap: "full" };

const NUMBERS = [0, 1, -1, 5, -5, 12.5, -0.5, "7", "-7", "0", "", "abc", "1abc", null, true, false];
const TEXTS = ["", "12", "12 + 8", "12+8", "12×2", "base", "a = b"];

describe.skipIf(!hasOracle)("combat log formatters against the original", () => {
  it("matches add_format with and without spacing", () => {
    const cases = [];
    for (const value of NUMBERS) {
      for (const text of TEXTS) {
        for (const space of [1, 0]) cases.push([value, text, space]);
      }
    }
    const expected = callOriginal(
      cases.map(args => ({ fn: "\\attack\\add_format", args })),
      BOOTSTRAP
    );
    const differences = [];
    cases.forEach((args, index) => {
      const reference = expected[index];
      if (!reference?.ok) {
        differences.push(`add_format(${JSON.stringify(args)}): original failed: ${reference?.error}`);
        return;
      }
      const mine = addFormat(args[0], args[1], args[2]);
      if (mine !== reference.value) {
        differences.push(
          `add_format(${JSON.stringify(args)}): port ${JSON.stringify(mine)} != original ${JSON.stringify(reference.value)}`
        );
      }
    });
    expect(differences).toEqual([]);
  });

  it("matches multiply_format, including its undefined separator", () => {
    const cases = [];
    for (const value of [1, "1", 1.0, 2, 0.5, 0, -1, "2", "abc", true]) {
      for (const text of TEXTS) {
        for (const space of [1, 0]) cases.push([value, text, space]);
      }
    }
    const expected = callOriginal(
      cases.map(args => ({ fn: "\\attack\\multiply_format", args })),
      BOOTSTRAP
    );
    const differences = [];
    cases.forEach((args, index) => {
      const reference = expected[index];
      if (!reference?.ok) {
        differences.push(`multiply_format(${JSON.stringify(args)}): original failed: ${reference?.error}`);
        return;
      }
      const mine = multiplyFormat(args[0], args[1], args[2]);
      if (mine !== reference.value) {
        differences.push(
          `multiply_format(${JSON.stringify(args)}): port ${JSON.stringify(mine)} != original ${JSON.stringify(reference.value)}`
        );
      }
    });
    expect(differences).toEqual([]);
  });

  it("matches equalsign_format across styles and breakdown shapes", () => {
    const cases = [];
    for (const value of [20, "20", 0, ""]) {
      for (const text of TEXTS) {
        for (const style of [null, "", "red b", "lime"]) cases.push([value, text, style]);
      }
    }
    const expected = callOriginal(
      cases.map(args => ({ fn: "\\attack\\equalsign_format", args })),
      BOOTSTRAP
    );
    const differences = [];
    cases.forEach((args, index) => {
      const reference = expected[index];
      if (!reference?.ok) {
        differences.push(`equalsign_format(${JSON.stringify(args)}): original failed: ${reference?.error}`);
        return;
      }
      const mine = equalsignFormat(args[0], args[1], args[2]);
      if (mine !== reference.value) {
        differences.push(
          `equalsign_format(${JSON.stringify(args)}): port ${JSON.stringify(mine)} != original ${JSON.stringify(reference.value)}`
        );
      }
    });
    expect(differences).toEqual([]);
  });

  it("matches the base-64 digit conversion both ways, refusals included", () => {
    const characters = ["a", "z", "A", "Z", "0", "9", "+", "-", "m", "Q", "5", "*", "", " ", "aa"];
    const expectedDecode = callOriginal(
      characters.map(c => ({ fn: "\\skillbase\\b64_conv_to_value", args: [c] })),
      BOOTSTRAP
    );
    characters.forEach((character, index) => {
      const reference = expectedDecode[index];
      const label = `b64_conv_to_value(${JSON.stringify(character)})`;
      if (reference.ok) {
        expect(b64ConvToValue(character), label).toBe(reference.value);
      } else {
        // The original throws on anything outside its alphabet.
        expect(() => b64ConvToValue(character), label).toThrow();
      }
    });

    const values = [0, 25, 26, 51, 52, 61, 62, 63, 64, -1, 10.0, "10"];
    const expectedEncode = callOriginal(
      values.map(v => ({ fn: "\\skillbase\\value_conv_to_b64", args: [v] })),
      BOOTSTRAP
    );
    values.forEach((value, index) => {
      const reference = expectedEncode[index];
      const label = `value_conv_to_b64(${JSON.stringify(value)})`;
      if (reference.ok) {
        expect(valueConvToB64(value), label).toBe(reference.value);
      } else {
        expect(() => valueConvToB64(value), label).toThrow();
      }
    });
  });
});
