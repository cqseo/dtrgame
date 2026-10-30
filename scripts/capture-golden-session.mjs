#!/usr/bin/env node
/**
 * Captures the original's signed-in responses as golden masters.
 *
 * The signed-out set was reachable with plain GETs; everything still
 * outstanding — the lobby, rooms, and the pages that funnel through
 * command.php — only exists behind an account. This registers a disposable
 * account on the isolated instance through the original's own register.php,
 * signs in, and records what the original sends a signed-in browser.
 *
 * The instance has its own database. Live player data is never touched, and
 * the account exists only there.
 *
 * Usage: npm run capture:golden-session
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { SIGNED_IN_ROUTES, normalizeGoldenBody } from "./golden-routes.mjs";

const bridge = resolve("tools/php-remote");
const php = process.env.DTS_PHP_BIN ?? (existsSync(bridge) ? bridge : "php");
const root = process.env.DTS_TEMPLATE_ROOT ?? "/opt/dts-sandbox/parity/instance";
const origin = process.env.DTS_GOLDEN_INSTANCE ?? "http://127.0.0.1:18090";
const outDir = resolve("test/fixtures/golden-session");

/**
 * A fixed, obviously non-human account so repeated captures are comparable
 * and the rows it leaves behind are recognisable.
 */
const ACCOUNT = {
  username: process.env.DTS_PARITY_USER ?? "paritybot",
  password: process.env.DTS_PARITY_PASS ?? "ParityBot!2026"
};

const result = JSON.parse(
  execFileSync(php, ["scripts/php-session-fixture.php"], {
    input: JSON.stringify({
      root,
      origin,
      account: ACCOUNT,
      steps: SIGNED_IN_ROUTES.map(route => ({
        method: route.method ?? "GET",
        path: route.path,
        body: route.body ?? null
      }))
    }),
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    timeout: 300000
  })
);

if (result.login?.status === undefined) {
  console.error("Could not sign in to the isolated instance.");
  console.error(JSON.stringify(result).slice(0, 500));
  process.exit(1);
}
// login.php answers a successful sign-in with a redirect to index.php.
if (result.login.status !== 302) {
  console.error(`Sign-in did not redirect as the original does: status ${result.login.status}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const index = [];
let failed = 0;

SIGNED_IN_ROUTES.forEach((route, position) => {
  const step = result.steps[position];
  if (!step?.ok) {
    console.error(`FAIL  ${route.path}: ${step?.error ?? "no response"}`);
    failed += 1;
    return;
  }
  const fixture = {
    name: route.name,
    request: { method: route.method ?? "GET", path: route.path, body: route.body ?? null },
    signedIn: true,
    status: step.status,
    headers: step.headers ?? {},
    bodyBytes: Buffer.byteLength(step.body ?? ""),
    body: normalizeGoldenBody(step.body ?? "", ACCOUNT.username)
  };
  writeFileSync(`${outDir}/${route.name}.json`, `${JSON.stringify(fixture, null, 2)}\n`);
  index.push({ name: route.name, path: route.path, status: fixture.status, bytes: fixture.bodyBytes });
  const expected = route.expectStatus;
  const flag = expected !== undefined && expected !== fixture.status ? `  !! expected ${expected}` : "";
  console.log(`${String(fixture.status).padEnd(4)} ${route.path.padEnd(18)} ${String(fixture.bodyBytes).padStart(7)} bytes${flag}`);
  if (flag) failed += 1;
});

writeFileSync(
  `${outDir}/index.json`,
  `${JSON.stringify({ account: ACCOUNT.username, capturedRoutes: index.length, routes: index }, null, 2)}\n`
);

console.log(`\n${index.length} signed-in fixtures written to test/fixtures/golden-session/`);
if (failed > 0) {
  console.error(`${failed} route(s) did not match the expected contract status.`);
  process.exit(1);
}
