import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import worker from "../src/index";
import { SIGNED_IN_ROUTES, normalizeGoldenBody } from "../scripts/golden-routes.mjs";

/**
 * Holds the Worker to the original's signed-in responses.
 *
 * Everything still outstanding — the lobby, rooms, and the pages that funnel
 * through command.php — only exists behind an account, so these fixtures are
 * captured through a real session against the isolated instance by
 * `npm run capture:golden-session`.
 *
 * MATCHING_ROUTES is a ratchet. Raise it only when a route genuinely starts
 * matching, never to make a run pass.
 */
const MATCHING_ROUTES = 1;

const dir = "test/fixtures/golden-session";
const load = name => JSON.parse(readFileSync(`${dir}/${name}.json`, "utf8"));

/** The original names its cookies with the table prefix. */
const SESSION_COOKIE = "acbra2_user=paritybot; acbra2_pass=0123456789abcdef0123456789abcdef";

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
      return new Response(readFileSync(path), { status: 200, headers: type ? { "content-type": type } : {} });
    }
  }
};

async function callWorker(fixture) {
  const init = { method: fixture.request.method, headers: { cookie: SESSION_COOKIE } };
  if (fixture.request.body) {
    init.headers["content-type"] = "application/x-www-form-urlencoded";
    init.body = new URLSearchParams(fixture.request.body).toString();
  }
  try {
    const response = await worker.fetch(
      new Request(`https://dts.zhangyingyin.top${fixture.request.path}`, init),
      env
    );
    return {
      status: response.status,
      location: response.headers.get("location"),
      body: normalizeGoldenBody(await response.text(), "paritybot")
    };
  } catch (error) {
    return { status: 0, location: null, body: `threw: ${error.message}` };
  }
}

describe("worker responses against the signed-in original", () => {
  it("has a fixture for every signed-in route", () => {
    const captured = new Set(
      readdirSync(dir).filter(f => f.endsWith(".json") && f !== "index.json").map(f => f.slice(0, -5))
    );
    for (const route of SIGNED_IN_ROUTES) {
      expect(captured.has(route.name), `missing fixture for ${route.name}`).toBe(true);
    }
  });

  it("keeps the original's own responses in the fixtures", () => {
    // Guards against a fixture set regenerated from the port, which would
    // make every later comparison meaningless.
    expect(load("in-index").body).toContain("<title> ACFUN 大 逃 杀 </title>");
    expect(load("in-index").status).toBe(200);
    // Signed in without a match, the original redirects these.
    expect(load("in-game").status).toBe(302);
    expect(load("in-game").headers.location).toBe("valid.php");
    expect(load("in-end").status).toBe(302);
    expect(load("in-end").headers.location).toBe("index.php");
    // The capture account's name must not be baked into the fixtures.
    for (const route of SIGNED_IN_ROUTES) {
      expect(load(route.name).body.includes("paritybot"), `${route.name} leaks the capture account`).toBe(false);
    }
  });

  it("does not regress the number of signed-in routes matching the original", async () => {
    const full = [];
    const statusOnly = [];
    const pending = [];

    for (const route of SIGNED_IN_ROUTES) {
      const fixture = load(route.name);
      const actual = await callWorker(fixture);
      const locationMatches =
        fixture.status !== 302 || actual.location === (fixture.headers.location ?? null);
      if (actual.status !== fixture.status || !locationMatches) {
        pending.push(`${fixture.request.path} status ${actual.status} != ${fixture.status}`);
      } else if (actual.body !== fixture.body) {
        statusOnly.push(fixture.request.path);
      } else {
        full.push(fixture.request.path);
      }
    }

    console.log(
      `signed-in route parity: ${full.length}/${SIGNED_IN_ROUTES.length} exact, ` +
        `${statusOnly.length} status-only, ${pending.length} not matching`
    );
    for (const entry of pending) console.log(`  pending: ${entry}`);

    expect(full.length).toBeGreaterThanOrEqual(MATCHING_ROUTES);
    expect(full.length + statusOnly.length + pending.length).toBe(SIGNED_IN_ROUTES.length);
  });
});
