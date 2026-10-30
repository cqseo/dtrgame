import { describe, expect, it, vi } from "vitest";
import worker, { ORIGINAL_STAGING_STATUS, type OriginalEnv } from "../src/index";

function mockEnv() {
  const fetch = vi.fn(async (request: Request) =>
    new Response(request.url.includes("index.php")
      ? "<title> ACFUN 大 逃 杀 </title>"
      : "original-byte-identical-asset", { status: 200 }));
  return { env: { ASSETS: { fetch } } as unknown as OriginalEnv, assetFetch: fetch };
}
describe("original-only Worker staging (no fake playability)", () => {
  it("resolves the root to /index.php and reports it unported", async () => {
    // The root maps to index.php as the original's index does, but the page
    // itself is not ported, so it answers 501. An earlier version of this
    // test expected 200 from a mocked asset bundle that returned HTML for
    // index.php; the real bundle carries no .php at all, so that expectation
    // described the mock rather than the Worker, and hid the page answering
    // 404 — telling a browser the original's own URL does not exist.
    const { env, assetFetch } = mockEnv();
    const r = await worker.fetch(new Request("https://example.com/"), env);
    expect(r.status).toBe(501);
    expect(assetFetch).not.toHaveBeenCalled();
  });
  it("preserves original CSS and JS paths without transformation", async () => {
    const { env, assetFetch } = mockEnv();
    const path = "/include/javascript/game.20240318.js";
    const r = await worker.fetch(new Request("https://example.com" + path), env);
    expect(await r.text()).toBe("original-byte-identical-asset");
    expect(assetFetch.mock.calls[0]?.[0].url).toBe("https://example.com" + path);
  });
  it("does not disguise missing game commands as a playable game", async () => {
    const { env, assetFetch } = mockEnv();
    for (const path of ["/roomcmd.php", "/login.php", "/register.php"]) {
      const r = await worker.fetch(new Request("https://example.com" + path, {
        method: "POST", body: new URLSearchParams({ mode: "main" })
      }), env);
      expect(r.status).toBe(501);
    }
    expect(assetFetch).not.toHaveBeenCalled();

    const command = await worker.fetch(new Request("https://example.com/command.php", {
      method: "POST", body: new URLSearchParams({ mode: "main" })
    }), mockEnv().env);
    expect(command.status).toBe(200);
  });
  it("rejects unported PHP endpoints but preserves guest HTML", async () => {
    const { env } = mockEnv();
    expect((await worker.fetch(new Request("https://example.com/valid.php"), env)).status).toBe(501);
    const r = await worker.fetch(new Request("https://example.com/game.php"), env);
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toBe("text/html; charset=UTF-8");
  });
  it("reports exact scope and readiness honestly", async () => {
    const { env } = mockEnv();
    const r = await worker.fetch(new Request("https://example.com/__stage_status"), env);
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual(ORIGINAL_STAGING_STATUS);
    expect(ORIGINAL_STAGING_STATUS.legacyModuleScope).toBe(735);
    expect(ORIGINAL_STAGING_STATUS.playable).toBe(false);
  });
});
