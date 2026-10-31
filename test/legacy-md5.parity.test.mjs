import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { md5 } from "../src/legacy/template/md5.ts";

/**
 * Holds md5() to PHP's own, byte for byte.
 *
 * The original's accounts are MD5: acbra2_users.password is char(32) and
 * create_cookiepass() produces it. A digest that differs anywhere locks
 * every existing player out, and the failure would look like "wrong
 * password" rather than like a bug, so this is checked against the real
 * interpreter rather than against vectors copied from somewhere.
 *
 * The cases cover what the original actually hashes: ASCII names and
 * passwords, UTF-8 Chinese names, the empty string, and lengths either
 * side of MD5's 56-byte padding boundary, where a wrong implementation
 * usually first diverges.
 */
/*
 * Gated on DTS_PHP_BIN, like the other parity suites, so the default
 * `vitest run` does not reach across the network. The bridge is an SSH
 * connection to the reference host; when that host is slow a suite that
 * ran it unconditionally would hang the whole run rather than fail, as
 * this one did before the gate and the timeout below.
 */
const PHP = process.env.DTS_PHP_BIN;

const CASES = [
  "",
  "a",
  "probe",
  "probe123",
  "测试员",
  "小黄",
  "paritybot:0",
  "a".repeat(55),
  "a".repeat(56),
  "a".repeat(57),
  "a".repeat(64),
  "a".repeat(119),
  "a".repeat(120),
  "用户名很长的情况下也要一致用户名很长的情况下也要一致",
  "~!@#$%^&*()_+{}|:\"<>?`-=[]\\;',./"
];

describe.skipIf(!PHP)("md5 against PHP", () => {
  it("matches PHP's md5() on every case", () => {
    const script =
      "<?php $in = json_decode(stream_get_contents(STDIN), true); " +
      "$out = array(); foreach ($in as $s) { $out[] = md5($s); } " +
      "echo json_encode($out);";
    const expected = JSON.parse(
      execFileSync(PHP, ["-r", script.slice(6)], {
        input: JSON.stringify(CASES),
        encoding: "utf8",
        maxBuffer: 1 << 20,
        // Never wait on the bridge indefinitely: a stalled SSH session
        // must fail this suite, not hang the run.
        timeout: 120_000
      })
    );

    const actual = CASES.map(value => md5(value));
    expect(actual).toEqual(expected);
    // A ratchet on the count, so an empty case list cannot pass as agreement.
    expect(actual.length).toBeGreaterThanOrEqual(15);
  });
});
