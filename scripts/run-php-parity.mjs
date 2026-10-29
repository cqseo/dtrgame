import { spawnSync } from "node:child_process";
const php = process.env.DTS_PHP_BIN ?? "php";
const probe = spawnSync(php, ["-n", "-v"], { encoding: "utf8" });
if (probe.error || probe.status !== 0) {
  console.error("PHP reference runtime missing. Set DTS_PHP_BIN and DTS_LEGACY_ROOT to run the original source comparison.");
  process.exit(1);
}
const run = spawnSync(process.execPath, ["node_modules/vitest/vitest.mjs", "run", "test/legacy-crafting-php.parity.test.mjs"], {
  stdio: "inherit", env: { ...process.env, DTS_PHP_BIN: php }
});
process.exit(run.status ?? 1);
