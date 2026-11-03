import { afterEach, describe, expect, it, vi } from "vitest";
import { createLegacyPlayerRecord } from "../src/generated/legacy-registry";
import { projectLegacySettlement } from "../src/legacy/settlement-plan";
import { LegacyGameDurableObject, type StoredLegacyMatch } from "../src/runtime/game-durable-object";
import { renderLegacyCommandPanel } from "../src/runtime/game-render";
import { legacyDecode } from "../src/original-protocol";
import type { LegacySettlementReceipt } from "../src/runtime/settlement";

const post = (path: string, body: unknown = {}) => new Request(`https://game.internal${path}`, {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
});
const get = () => new Request("https://game.internal/state");
const matchId = 3_000_000_007;
function snapshot(): StoredLegacyMatch {
  const a = createLegacyPlayerRecord(); const b = createLegacyPlayerRecord();
  Object.assign(a, { name: "Alpha", pid: 1, type: 0, hp: 100 });
  Object.assign(b, { name: "Beta", pid: 2, type: 0, hp: 0 });
  return { version: 8, state: { matchId, gamestate: 40, gametype: 0,
    players: { Alpha: a, Beta: b }, availableAreas: [1], forbiddenAreas: [], areaNames: ["A"] } };
}
function harness(values = new Map<string, unknown>([["match", snapshot()]]), enabled = true) {
  const put = vi.fn(async (key: string, value: unknown) => { values.set(key, structuredClone(value)); });
  let ready = Promise.resolve();
  const ctx = { storage: { get: async (key: string) => structuredClone(values.get(key)), put },
    blockConcurrencyWhile: (cb: () => Promise<void>) => { ready = cb(); return ready; }
  } as unknown as DurableObjectState;
  const object = new LegacyGameDurableObject(ctx, {
    SUPABASE_URL: "https://fixture.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_fixture",
    ...(enabled ? { DTS_SETTLEMENT_EXPERIMENTAL: "enabled" } : {})
  } as Cloudflare.Env);
  return { object, values, put, ready: () => ready };
}
function database() {
  let stored = snapshot();
  let calls = 0;
  let loseResponse = false;
  let offline = false;
  let receipt: LegacySettlementReceipt | undefined;
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const path = new URL(String(input)).pathname;
    if (offline) throw new Error("database offline");
    if (path.endsWith("dtr_match_reconcile")) {
      expect(JSON.parse(String(init?.body))).toEqual({ p_match_id: matchId, p_expected_version: 8 });
      return Response.json([stored]);
    }
    if (path.endsWith("dtr_match_settle")) {
      calls++;
      const args = JSON.parse(String(init?.body));
      expect(Object.keys(args).sort()).toEqual(["p_ended_at", "p_expected_version", "p_history", "p_match_id"]);
      expect(args.p_match_id).toBe(matchId);
      expect(args.p_expected_version).toBe(8);
      expect(await legacyDecode(args.p_history.validlist)).toMatchObject({ Alpha: { winner_flag: 2 } });
      const plan = projectLegacySettlement(stored.state.players, 0, 40, args.p_ended_at)!;
      const next = structuredClone(stored);
      next.version++;
      next.state.gamestate = 0;
      next.state.players.Alpha!.winner_flag = 2;
      next.state.settlement = { historyGid: 101, endedAt: args.p_ended_at, winmode: 2, winner: "Alpha", hooksPending: true };
      stored = next;
      receipt = { matchId, historyGid: 101, endedAt: args.p_ended_at, snapshot: next, plan, hooksPending: true };
      if (loseResponse) throw new Error("response lost after SQL commit");
      return Response.json(receipt);
    }
    if (path.endsWith("dtr_match_save")) throw new Error("must never save old state after settlement");
    throw new Error(`Unexpected RPC: ${path}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  return { fetchMock, calls: () => calls, receipt: () => receipt, setOffline: (v: boolean) => { offline=v; },
    loseResponse: () => { loseResponse=true; } };
}

describe("Durable Object settlement commit and recovery", () => {
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it("stays disabled unless explicitly enabled and never trusts supplied award fields", async () => {
    const db = database(); const test = harness(undefined, false);
    expect((await test.object.fetch(post("/settle", { winner: "Beta", gold: 999999 }))).status).toBe(503);
    expect(db.calls()).toBe(0);
    expect(test.values.get("match")).toEqual(snapshot());
    const enabled = harness();
    expect((await enabled.object.fetch(post("/settle", { winner: "Beta", gold: 999999 }))).status).toBe(200);
    expect(db.calls()).toBe(1);
    expect((await enabled.object.fetch(get())).status).toBe(200);
  });

  it("serializes settlement and subsequent gameplay, reusing exactly one terminal snapshot", async () => {
    const db = database(); const test = harness();
    const [first, command, second] = await Promise.all([
      test.object.fetch(post("/settle")),
      test.object.fetch(post("/command", { username: "Alpha", command: "pose5", now: 202 })),
      test.object.fetch(post("/settle"))
    ]);
    expect(first.status).toBe(200); expect(command.status).toBe(409); expect(second.status).toBe(200);
    expect(await second.json()).toEqual(await first.json());
    expect(db.calls()).toBe(1);
    for (const path of ["/battle", "/corpse"]) expect((await test.object.fetch(post(path))).status).toBe(409);
    const stored = test.values.get("match") as StoredLegacyMatch;
    expect(stored).toEqual(db.receipt()?.snapshot);
    expect(renderLegacyCommandPanel(stored, "Alpha")).toContain("本局游戏已结束");
    expect(renderLegacyCommandPanel(stored, "Beta")).toContain("本局游戏已结束");
    expect(renderLegacyCommandPanel(stored, "Alpha")).not.toContain("postCmd");
  });

  it("recovers after SQL commits but the RPC response is lost, refusing gameplay while DB is down", async () => {
    const db = database(); const test = harness(); db.loseResponse();
    expect((await test.object.fetch(post("/settle"))).status).toBe(409);
    expect(db.calls()).toBe(1);
    expect(test.values.get("settlement-pending")).toEqual({ matchId, version: 8 });
    expect((test.values.get("match") as StoredLegacyMatch).state.gamestate).toBe(40);
    db.setOffline(true);
    expect((await test.object.fetch(post("/command", { username: "Alpha", command: "search", now: 210 }))).status).toBe(409);
    expect((await test.object.fetch(get())).status).toBe(409);
    db.setOffline(false);
    const recovered = await test.object.fetch(get());
    expect(recovered.status).toBe(200);
    expect(await recovered.json()).toEqual(db.receipt()?.snapshot);
    expect((await test.object.fetch(post("/settle"))).status).toBe(200);
    expect(db.calls()).toBe(1);
  });

  it("a fresh object repairs persisted precommit state before accepting any command", async () => {
    const db = database(); const old = harness();
    const normalPut = old.put.getMockImplementation()!;
    old.put.mockImplementation(async (key, value) => {
      if (key === "match") throw new Error("DO storage failed after SQL commit");
      return normalPut(key, value);
    });
    expect((await old.object.fetch(post("/settle"))).status).toBe(409);
    expect(db.calls()).toBe(1);
    expect(old.values.get("settlement-pending")).toEqual({ matchId, version: 8 });
    const restarted = harness(old.values, false);
    expect((await restarted.object.fetch(post("/battle", { username: "Alpha", now: 220 }))).status).toBe(409);
    expect(await (await restarted.object.fetch(get())).json()).toEqual(db.receipt()?.snapshot);
    expect(restarted.values.get("settlement-pending")).toBe(0);
    expect(db.calls()).toBe(1);
  });

  it("does not contact SQL when the durable pending marker cannot be saved", async () => {
    const db = database(); const test = harness();
    test.put.mockRejectedValueOnce(new Error("cannot save pending marker"));
    expect((await test.object.fetch(post("/settle"))).status).toBe(409);
    expect(db.calls()).toBe(0);
  });

  it("resumes an uncommitted match only from the database's fenced version", async () => {
    const fenced = snapshot(); fenced.version=9;
    const mock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).endsWith("dtr_match_reconcile")) return Response.json([fenced]);
      if (String(input).endsWith("dtr_match_save")) {
        expect(JSON.parse(String(init?.body)).p_version).toBe(10);
        return Response.json(true);
      }
      throw new Error("Unexpected RPC during fenced recovery");
    });
    vi.stubGlobal("fetch", mock);
    const values = new Map<string, unknown>([["match",snapshot()],["settlement-pending",{matchId,version:8}]]);
    const restarted = harness(values);
    expect((await restarted.object.fetch(post("/command", { username: "Alpha", command: "pose5", mode: "special", now: 202 }))).status).toBe(200);
    expect((values.get("match") as StoredLegacyMatch).version).toBe(10);
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it("keeps terminal state when clearing the pending marker fails", async () => {
    const db = database(); const test = harness();
    const normalPut = test.put.getMockImplementation()!;
    test.put.mockImplementationOnce(normalPut).mockImplementationOnce(normalPut)
      .mockRejectedValueOnce(new Error("marker clear failed"));
    expect((await test.object.fetch(post("/settle"))).status).toBe(409);
    const restarted = harness(test.values);
    expect((await restarted.object.fetch(post("/command", { username: "Alpha", command: "search", now: 230 }))).status).toBe(409);
    expect(db.calls()).toBe(1);
    expect(await (await restarted.object.fetch(get())).json()).toEqual(db.receipt()?.snapshot);
  });

  it("escapes archived winner names in the ended command panel", () => {
    const stored = snapshot(); stored.state.gamestate=0;
    stored.state.settlement={ historyGid: 101, endedAt: 200, winmode: 2, winner: "<script>bad</script>", hooksPending: true };
    const html = renderLegacyCommandPanel(stored, "Alpha");
    expect(html).toContain("&lt;script&gt;bad&lt;/script&gt;");
    expect(html).not.toContain("<script>");
  });
});
