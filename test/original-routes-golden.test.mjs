import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import worker from "../src/index";
import { GOLDEN_ROUTES, normalizeGoldenBody } from "../scripts/golden-routes.mjs";

/**
 * Holds the Worker to whole responses captured from the running original.
 *
 * Fixtures under test/fixtures/golden are produced by `npm run capture:golden`
 * against the isolated instance of the captured source, served by PHP 8.2.35
 * behind the production nginx routing contract. Comparing against them is what
 * separates "the port renders something" from "the port returns what the
 * original returns".
 *
 * MATCHING_ROUTES is a ratchet. Raise it only when a route genuinely starts
 * matching the original, never to make a run pass.
 */
const MATCHING_ROUTES = 9;

const dir = "test/fixtures/golden";
const load = name => JSON.parse(readFileSync(`${dir}/${name}.json`, "utf8"));

// Mirrors the assets binding: serves public/ exactly, and 404s otherwise
// because not_found_handling is "none".
const ASSET_TYPES = {
  js: "text/javascript", css: "text/css", htm: "text/html", html: "text/html",
  png: "image/png", gif: "image/gif", jpg: "image/jpeg", ico: "image/x-icon",
  webmanifest: "application/manifest+json"
};
const env = {
  APP_ENV: "test",
  SUPABASE_URL: "https://example.invalid",
  ASSETS: {
    fetch: async request => {
      const path = `public${new URL(request.url).pathname}`;
      if (!existsSync(path) || !statSync(path).isFile()) return new Response("", { status: 404 });
      const type = ASSET_TYPES[path.slice(path.lastIndexOf(".") + 1).toLowerCase()];
      return new Response(readFileSync(path), {
        status: 200,
        headers: type ? { "content-type": type } : {}
      });
    }
  }
};

async function callWorker(fixture) {
  const init = { method: fixture.request.method };
  if (fixture.request.body) {
    init.headers = { "content-type": "application/x-www-form-urlencoded" };
    init.body = new URLSearchParams(fixture.request.body).toString();
  }
  try {
    const response = await worker.fetch(
      new Request(`https://dts.zhangyingyin.top${fixture.request.path}`, init),
      env
    );
    return { status: response.status, body: normalizeGoldenBody(await response.text()) };
  } catch (error) {
    return { status: 0, body: `threw: ${error.message}` };
  }
}

describe("worker responses against the captured original", () => {
  it("has a fixture for every route in the contract", () => {
    const captured = new Set(
      readdirSync(dir).filter(f => f.endsWith(".json") && f !== "index.json").map(f => f.slice(0, -5))
    );
    for (const route of GOLDEN_ROUTES) {
      expect(captured.has(route.name), `missing fixture for ${route.name}`).toBe(true);
    }
  });

  it("keeps the original's own markup in the fixtures", () => {
    // Guards against a fixture set regenerated from the port instead of the
    // original, which would make every later comparison meaningless.
    expect(load("page-index").body).toContain("<title> ACFUN 大 逃 杀 </title>");
    expect(load("asset-game-20240318-js").body).toContain("postCmd(");
    expect(load("gone-install-new").status).toBe(410);
    expect(load("command-get-denied").status).toBe(403);
  });

  it("does not regress the number of routes matching the original", async () => {
    const statusOnly = [];
    const full = [];
    const pending = [];

    for (const route of GOLDEN_ROUTES) {
      const fixture = load(route.name);
      const actual = await callWorker(fixture);
      if (actual.status !== fixture.status) {
        pending.push(`${fixture.request.path} status ${actual.status} != ${fixture.status}`);
      } else if (actual.body !== fixture.body) {
        statusOnly.push(fixture.request.path);
      } else {
        full.push(fixture.request.path);
      }
    }

    console.log(
      `original route parity: ${full.length}/${GOLDEN_ROUTES.length} exact, ` +
        `${statusOnly.length} status-only, ${pending.length} not matching`
    );
    for (const entry of pending) console.log(`  pending: ${entry}`);

    expect(full.length).toBeGreaterThanOrEqual(MATCHING_ROUTES);
    expect(full.length + statusOnly.length + pending.length).toBe(GOLDEN_ROUTES.length);
  });
});
