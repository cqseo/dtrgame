import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

// The live original runs under php-cgi-82.sock (PHP 8.2.35) on the Baota host,
// so golden masters must come from that interpreter. tools/php-remote bridges
// to it over SSH and is used automatically when DTS_PHP_BIN is unset.
const bridge = resolve("tools/php-remote");
const usingBridge = !process.env.DTS_PHP_BIN && existsSync(bridge);
const php = process.env.DTS_PHP_BIN ?? (usingBridge ? bridge : "php");

// When the interpreter runs remotely the legacy root must be the frozen,
// write-protected copy on that host, not a path on this machine.
const legacyRoot =
  process.env.DTS_LEGACY_ROOT ??
  (usingBridge ? "/opt/dts-sandbox/parity/legacy-dts" : "../legacy-dts");

const probe = spawnSync(php, ["-n", "-v"], { encoding: "utf8" });
if (probe.error || probe.status !== 0) {
  console.error(
    "PHP reference runtime missing. Set DTS_PHP_BIN and DTS_LEGACY_ROOT to run the original source comparison."
  );
  process.exit(1);
}

const version = /^PHP (\d+\.\d+)\.(\d+)/.exec(probe.stdout ?? "");
if (!version) {
  console.error(`Could not determine PHP version from: ${(probe.stdout ?? "").split("\n")[0]}`);
  process.exit(1);
}
if (version[1] !== "8.2") {
  console.error(
    `Refusing to generate golden masters on PHP ${version[1]}.${version[2]}. ` +
      `The original site runs 8.2.x (php-cgi-82.sock); another minor version changes semantics.`
  );
  process.exit(1);
}

const suites = readdirSync("test")
  .filter(name => name.endsWith(".parity.test.mjs"))
  .sort()
  .map(name => `test/${name}`);
if (suites.length === 0) {
  console.error("No *.parity.test.mjs suites found under test/.");
  process.exit(1);
}

console.log(`PHP ${version[1]}.${version[2]} via ${usingBridge ? "tools/php-remote (SSH)" : php}`);
console.log(`Legacy root: ${legacyRoot}`);
console.log(`Suites: ${suites.length}`);

// Remote interpreter round-trips exceed vitest's 5s default.
const timeout = process.env.DTS_PARITY_TIMEOUT ?? "120000";
// The suites share one interpreter over one SSH connection. Run in parallel
// they contend for it and trip the oracle's own call timeout, which looks
// like a parity failure and is not one, so the files are run one at a time.
const run = spawnSync(
  process.execPath,
  [
    "node_modules/vitest/vitest.mjs",
    "run",
    "--no-file-parallelism",
    `--testTimeout=${timeout}`,
    ...suites
  ],
  { stdio: "inherit", env: { ...process.env, DTS_PHP_BIN: php, DTS_LEGACY_ROOT: legacyRoot } }
);
process.exit(run.status ?? 1);
