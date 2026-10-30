#!/usr/bin/env node
/**
 * Request-level golden-master capture against the original.
 *
 * The existing PHP oracle compares pure functions. This drives the real
 * original over HTTP — the isolated instance that runs the captured source
 * under PHP 8.2.35 with the production nginx routing contract — and records
 * whole responses, so the TypeScript port is held to the original's actual
 * output rather than to a reimplementation of it.
 *
 * Start the forward first:  tools/golden-tunnel up
 * Then:                     npm run capture:golden
 *
 * Fixtures land in test/fixtures/golden/ and are compared by
 * test/original-routes.parity.test.mjs.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { normalizeGoldenBody, GOLDEN_ROUTES } from "./golden-routes.mjs";

const origin = process.env.DTS_GOLDEN_ORIGIN ?? "http://127.0.0.1:18090";
const outDir = resolve("test/fixtures/golden");

// Only headers that form part of the contract; Date and similar drift.
const KEPT_HEADERS = ["content-type", "location", "allow"];

async function capture(route) {
  const init = { redirect: "manual", method: route.method ?? "GET" };
  if (route.body) {
    init.headers = { "content-type": "application/x-www-form-urlencoded" };
    init.body = new URLSearchParams(route.body).toString();
  }
  const response = await fetch(new URL(route.path, origin), init);
  const raw = await response.text();
  const headers = {};
  for (const name of KEPT_HEADERS) {
    const value = response.headers.get(name);
    if (value !== null) headers[name] = value;
  }
  return {
    name: route.name,
    request: { method: init.method, path: route.path, body: route.body ?? null },
    status: response.status,
    headers,
    bodyBytes: Buffer.byteLength(raw),
    body: normalizeGoldenBody(raw)
  };
}

mkdirSync(outDir, { recursive: true });

const index = [];
let failed = 0;
for (const route of GOLDEN_ROUTES) {
  try {
    const fixture = await capture(route);
    writeFileSync(`${outDir}/${route.name}.json`, `${JSON.stringify(fixture, null, 2)}\n`);
    index.push({ name: route.name, path: route.path, method: fixture.request.method, status: fixture.status });
    const expected = route.expectStatus;
    const flag = expected !== undefined && expected !== fixture.status ? `  !! expected ${expected}` : "";
    console.log(`${String(fixture.status).padEnd(4)} ${fixture.request.method.padEnd(5)} ${route.path}${flag}`);
    if (flag) failed += 1;
  } catch (error) {
    console.error(`FAIL  ${route.path}: ${error.message}`);
    failed += 1;
  }
}

writeFileSync(
  `${outDir}/index.json`,
  `${JSON.stringify({ origin: "isolated golden-master instance", capturedRoutes: index.length, routes: index }, null, 2)}\n`
);

console.log(`\n${index.length} fixtures written to test/fixtures/golden/`);
if (failed > 0) {
  console.error(`${failed} route(s) did not match the expected contract status.`);
  process.exit(1);
}
