import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
  checkRoomAvailable,
  roomCheckSubroom,
  roomId2Prefix,
  roomPrefix2Id,
  roomPrefixKind
} from "../src/legacy/room-prefix";

/**
 * Holds the room-prefix helpers to the original.
 *
 * The lobby calls these on every room it lists, and they run on PHP's own
 * rules rather than JavaScript's: "0" is falsy, substr counts bytes, and the
 * int cast takes a leading numeric prefix instead of failing. Each of those
 * is a place a reimplementation drifts quietly, so the cases below include
 * them deliberately rather than only the shapes the game happens to produce
 * today.
 *
 * Run through `npm run test:php-parity`.
 */
const php = process.env.DTS_PHP_BIN;
const root = process.env.DTS_TEMPLATE_ROOT ?? "/opt/dts-sandbox/parity/instance";

const oracle = cases => {
  try {
    return JSON.parse(
      execFileSync(php, ["scripts/php-room-reference.php"], {
        input: JSON.stringify({ root, cases }),
        encoding: "utf8",
        maxBuffer: 32 * 1024 * 1024,
        timeout: 120000
      })
    );
  } catch (error) {
    throw new Error(`PHP room reference failed: ${error.stdout ?? ""}\n${error.stderr ?? ""}`);
  }
};

/** Ordinary prefixes plus the edges where PHP and JavaScript disagree. */
const PREFIXES = [
  "s1", "s2", "s10", "s0", "n1", "x", "s", "",
  "0", "00", "1", 0, 1, 10,
  "s007", "s1abc", "sabc", "s-1", "s 2", "S1",
  "s2.9", "s99999", " s1", "s+3", "s１"
];

describe.skipIf(!php)("room prefix helpers against the original", () => {
  it("matches room_prefix_kind on every prefix shape", () => {
    const expected = oracle(PREFIXES.map(value => ({ fn: "room_prefix_kind", args: [value] })));
    PREFIXES.forEach((value, index) => {
      expect(roomPrefixKind(value), `room_prefix_kind(${JSON.stringify(value)})`).toEqual(
        expected[index].value
      );
    });
  });

  it("matches room_check_subroom, including PHP's falsy \"0\"", () => {
    const expected = oracle(PREFIXES.map(value => ({ fn: "room_check_subroom", args: [value] })));
    PREFIXES.forEach((value, index) => {
      expect(roomCheckSubroom(value), `room_check_subroom(${JSON.stringify(value)})`).toBe(
        expected[index].value
      );
    });
  });

  it("matches room_prefix2id, including the leading-numeric int cast", () => {
    const expected = oracle(PREFIXES.map(value => ({ fn: "room_prefix2id", args: [value] })));
    PREFIXES.forEach((value, index) => {
      expect(roomPrefix2Id(value), `room_prefix2id(${JSON.stringify(value)})`).toBe(
        expected[index].value
      );
    });
  });

  it("matches room_id2prefix on ids and on the values that are not", () => {
    const ids = [1, 2, 10, 0, "0", "", "3", "03", -1, "abc", 1.0, 2.5];
    const expected = oracle(ids.map(value => ({ fn: "room_id2prefix", args: [value] })));
    ids.forEach((value, index) => {
      expect(roomId2Prefix(value), `room_id2prefix(${JSON.stringify(value)})`).toEqual(
        expected[index].value
      );
    });
  });

  it("matches check_room_available across every gate it applies", () => {
    const now = 1793000000;
    const cases = [];
    for (const available of [1, 0, "", "1", true, false]) {
      for (const start of [0, now - 100, now + 100]) {
        for (const end of [0, now - 100, now + 100]) {
          for (const requiredModule of ["", "sys", "no_such_module"]) {
            cases.push({
              available,
              "available-start": start,
              "available-end": end,
              "req-mod": requiredModule
            });
          }
        }
      }
    }
    // "sys" is a core module the install always defines; the oracle defines
    // the same set so both sides answer the module gate identically.
    const defined = new Set(["SYS"]);
    const expected = oracle(cases.map(data => ({ fn: "check_room_available", args: [data, now, ["sys"]] })));
    cases.forEach((data, index) => {
      expect(checkRoomAvailable(data, now, defined), `case ${index}: ${JSON.stringify(data)}`).toBe(
        expected[index].value
      );
    });
  });
});
