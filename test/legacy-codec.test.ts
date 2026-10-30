import { describe, expect, it } from "vitest";
import { gdecode, gencode, phpJsonEncode } from "../src/legacy/php/codec";
import { PhpArray } from "../src/legacy/template/values";

/**
 * Holds gencode() to the bytes PHP produces.
 *
 * Round-tripping is not enough. array_update() writes a column only when
 * its value differs from the one it read, so an encoder that produced a
 * different-but-equivalent gzip would make every save look like a change
 * and rewrite every column on every tick.
 *
 * The expected strings below were taken from the live PHP 8.2.35 by
 * running `base64_encode(gzencode(json_encode($case)))` on it, so they are
 * the original's own output rather than this port's.
 */
const array = (entries: [string | number, unknown][]): PhpArray => {
  const result = new PhpArray();
  for (const [key, value] of entries) result.set(key, value as never);
  return result;
};
const list = (values: unknown[]): PhpArray => {
  const result = new PhpArray();
  for (const value of values) result.push(value as never);
  return result;
};

/** Captured from the original interpreter; see the comment above. */
const VECTORS: { name: string; value: PhpArray; json: string; gencode: string }[] = [
  {
    name: "empty array",
    value: new PhpArray(),
    json: "[]",
    gencode: "H4sIAAAAAAAAA4uOBQApu0wNAgAAAA=="
  },
  {
    name: "one key",
    value: array([["a", 1]]),
    json: '{"a":1}',
    gencode: "H4sIAAAAAAAAA6tWSlSyMqwFAK+sG1YHAAAA"
  },
  {
    name: "nested, with numeric string keys",
    value: array([
      ["map_display_group", 0],
      ["plsinfo", array([["1", "x"], ["2", "y"]])]
    ]),
    json: '{"map_display_group":0,"plsinfo":{"1":"x","2":"y"}}',
    gencode:
      "H4sIAAAAAAAAA6tWyk0siE/JLC7ISayMTy/KLy1QsjLQUSrIKc7MS8tXsqpWMlSyUqpQ0lEyAtKVSrW1AM4DIh4zAAAA"
  },
  {
    name: "a list",
    value: list([10, 20, 30]),
    json: "[10,20,30]",
    gencode: "H4sIAAAAAAAAA4s2NNAxMtAxNogFABiPIvgKAAAA"
  },
  {
    name: "slashes, which PHP escapes",
    value: array([["url", "img/map/a.jpg"]]),
    json: '{"url":"img\\/map\\/a.jpg"}',
    gencode: "H4sIAAAAAAAAA6tWKi3KUbJSysxNj9HPTSyI0U/UyypIV6oFAHBMiCMZAAAA"
  },
  {
    name: "Chinese, which PHP escapes as \\uXXXX",
    value: array([["name", "冰封墓场"], ["msg", "你消耗了体力"]]),
    json: '{"name":"\\u51b0\\u5c01\\u5893\\u573a","msg":"\\u4f60\\u6d88\\u8017\\u4e86\\u4f53\\u529b"}',
    gencode:
      "H4sIAAAAAAAAA6tWykvMTVWyUoopNTVMMgCSyQaGQNLC0hhImhsnKuko5RangxWYpJkBFZilWFjElFoYGJoDRVItzEDipiDFRpZJSrUA3+3XOFAAAAA="
  },
  {
    name: "mixed keys, which stop it being a list",
    value: array([[0, "a"], ["b", "c"]]),
    json: '{"0":"a","b":"c"}',
    gencode: "H4sIAAAAAAAAA6tWMlCyUkpU0lFKAtLJSrUAMijb0BEAAAA="
  },
  {
    name: "a float, a boolean and a null",
    value: array([["f", 1.5], ["t", true], ["n", null]]),
    json: '{"f":1.5,"t":true,"n":null}',
    gencode: "H4sIAAAAAAAAA6tWSlOyMtQz1VEqUbIqKSpN1VHKU7LKK83JqQUA8rn0oBsAAAA="
  },
  {
    name: "something long enough to really compress",
    value: array([["long", "abc".repeat(200)]]),
    json: `{"long":"${"abc".repeat(200)}"}`,
    gencode: "H4sIAAAAAAAAA6tWysnPS1eyUkpMSh5Fo4jqSKkWAP0gAJdjAgAA"
  }
];

describe("gencode and gdecode against the original's bytes", () => {
  it.each(VECTORS)("serialises $name as PHP's json_encode does", ({ value, json }) => {
    expect(phpJsonEncode(value)).toBe(json);
  });

  it.each(VECTORS)("encodes $name to the same bytes PHP does", ({ value, gencode: expected }) => {
    expect(gencode(value)).toBe(expected);
  });

  it.each(VECTORS)("reads back what PHP wrote for $name", ({ gencode: encoded, value }) => {
    const decoded = gdecode(encoded);
    expect(decoded).toBeInstanceOf(PhpArray);
    // Comparing the re-encoding checks keys, order and types at once.
    expect(phpJsonEncode(decoded)).toBe(phpJsonEncode(value));
  });

  it("returns an empty array for a column that was never written", () => {
    // The original's gdecode returns array() for any falsy input, which is
    // the state of a room that has not started.
    expect(gdecode("")).toBeInstanceOf(PhpArray);
    expect((gdecode("") as PhpArray).keys()).toEqual([]);
    expect((gdecode(null) as PhpArray).keys()).toEqual([]);
  });

  it("turns numeric object keys back into integer keys, as json_decode does", () => {
    const decoded = gdecode(gencode(array([["1", "x"], ["2", "y"]]))) as PhpArray;
    expect(decoded.keys()).toEqual([1, 2]);
  });
});
