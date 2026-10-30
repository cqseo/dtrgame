import { execFileSync } from "node:child_process";

/**
 * Shared access to the original interpreter for differential tests.
 *
 * Every ported function is compared against the original rather than against
 * expectations, so this is the one place that knows how to reach it. A new
 * area adds cases to a table instead of a new oracle script.
 */
const PHP = process.env.DTS_PHP_BIN;
const ROOT = process.env.DTS_TEMPLATE_ROOT ?? "/opt/dts-sandbox/parity/instance";

/** True when the original interpreter is reachable; suites skip without it. */
export const hasOracle = Boolean(PHP);

/**
 * Calls functions in the original.
 *
 * `calls` entries take { fn, args, globals, read }: `globals` is seeded
 * before the call and `read` names globals to report back afterwards, which
 * matters because original functions mostly communicate through globals
 * rather than return values.
 */
export function callOriginal(calls, options = {}) {
  if (!PHP) throw new Error("DTS_PHP_BIN is not set; run through npm run test:php-parity");
  const payload = {
    root: options.root ?? ROOT,
    bootstrap: options.bootstrap ?? "core",
    curscript: options.curscript ?? "index",
    require: options.require ?? [],
    define: options.define ?? {},
    calls
  };
  let raw;
  try {
    raw = execFileSync(PHP, ["scripts/php-call-reference.php"], {
      input: JSON.stringify(payload),
      encoding: "utf8",
      maxBuffer: 128 * 1024 * 1024,
      timeout: options.timeout ?? 120000
    });
  } catch (error) {
    throw new Error(`PHP reference failed: ${error.stdout ?? ""}\n${error.stderr ?? ""}`);
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`PHP reference returned non-JSON: ${raw.slice(0, 400)}`);
  }
}

/**
 * Compares a ported function against the original across a list of argument
 * tuples, reporting every disagreement at once rather than stopping at the
 * first, so one run shows the whole shape of a difference.
 */
export function differential({ fn, port, cases, options, describeCase }) {
  const expected = callOriginal(cases.map(args => ({ fn, args })), options);
  const differences = [];
  cases.forEach((args, index) => {
    const reference = expected[index];
    const label = describeCase ? describeCase(args) : JSON.stringify(args);
    if (!reference?.ok) {
      differences.push(`${fn}(${label}): original failed: ${reference?.error ?? "no result"}`);
      return;
    }
    let actual;
    try {
      actual = port(...args);
    } catch (error) {
      differences.push(`${fn}(${label}): port threw ${error.message}`);
      return;
    }
    if (!sameValue(actual, reference.value)) {
      differences.push(
        `${fn}(${label}): port ${JSON.stringify(actual)} != original ${JSON.stringify(reference.value)}`
      );
    }
  });
  return differences;
}

/**
 * JSON hands back plain objects and arrays for PHP values, so comparison is
 * structural. PHP integers and floats both arrive as numbers, which is the
 * one place this is looser than the language itself.
 */
function sameValue(actual, expected) {
  if (actual === expected) return true;
  if (actual === null || expected === null) return actual === expected;
  if (typeof actual !== typeof expected) return false;
  if (typeof actual !== "object") return false;
  if (Array.isArray(actual) !== Array.isArray(expected)) return false;
  const a = Object.keys(actual);
  const b = Object.keys(expected);
  if (a.length !== b.length) return false;
  return a.every(key => sameValue(actual[key], expected[key]));
}
