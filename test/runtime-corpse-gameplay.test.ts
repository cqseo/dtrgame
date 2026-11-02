import { describe, expect, it, vi } from "vitest";
import { createLegacyPlayerRecord } from "../src/generated/legacy-registry";
import { legacyCookiePassword, legacyStoredPassword } from "../src/original-auth";
import { renderLegacyCommandPanel } from "../src/runtime/game-render";
import { LegacyGameDurableObject, type LegacyMatchState, type StoredLegacyMatch } from "../src/runtime/game-durable-object";
import { LegacyGameService } from "../src/runtime/game-service";
import type { SupabaseLegacyAccounts, SupabaseLegacyMatches } from "../src/runtime/supabase";

function matchState(): LegacyMatchState {
  const player = createLegacyPlayerRecord();
  Object.assign(player, {
    pid: 1, name: "甲", hp: 320, mhp: 400, sp: 350, msp: 400,
    pls: 1, action: "corpse2", money: 40, state: 0,
    itm1: "", itmk1: "", itme1: 0, itms1: 0, itmsk1: ""
  });
  const corpse = createLegacyPlayerRecord();
  Object.assign(corpse, {
    pid: 2, name: "乙", hp: 0, pls: 1, money: 120, state: 22,
    wep: "短剑", wepk: "WK", wepe: 30, weps: 7,
    itm1: "药剂", itmk1: "HH", itme1: 40, itms1: 2, itmsk1: ""
  });
  return {
    matchId: 8001, gamestate: 40, gametype: 10,
    players: { "甲": player, "乙": corpse },
    availableAreas: [1, 2], forbiddenAreas: [], areaNames: ["无", "森林", "城镇"]
  };
}

function harness() {
  const persisted = new Map<string, unknown>();
  let initialized = Promise.resolve();
  const ctx = {
    storage: {
      get: async <T>(key: string): Promise<T | undefined> => persisted.get(key) as T | undefined,
      put: async (key: string, value: unknown) => { persisted.set(key, structuredClone(value)); }
    },
    blockConcurrencyWhile: (task: () => Promise<void>) => { initialized = task(); }
  } as unknown as DurableObjectState;
  const game = new LegacyGameDurableObject(ctx, {} as Cloudflare.Env);
  const stub = {
    fetch: vi.fn((url: string, init?: RequestInit) => game.fetch(new Request(url, init)))
  };
  const namespace = {
    idFromName: vi.fn(value => value),
    get: vi.fn(() => stub)
  } as unknown as DurableObjectNamespace;
  const password = legacyCookiePassword("fixture-only-secret");
  const accounts = {
    findByUsername: vi.fn(async (name: string) => name === "甲"
      ? { username: "甲", password: legacyStoredPassword("甲", password), groupid: 1, roomid: 2 }
      : null)
  } as unknown as SupabaseLegacyAccounts;
  const matches = {
    forUser: vi.fn(async () => ({ matchId: 8001, roomId: 2, gamestate: 40, weather: 1 }))
  } as unknown as SupabaseLegacyMatches;
  const service = new LegacyGameService(namespace, accounts, matches);
  const command = (body: string) => new Request("https://game.test/command.php", {
    method: "POST",
    headers: {
      cookie: `bra_user=%E7%94%B2; bra_pass=${password}`,
      "content-type": "application/x-www-form-urlencoded"
    },
    body
  });
  const seed = async (initial = matchState()) => {
    await initialized;
    const response = await game.fetch(new Request("https://game.internal/hydrate", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ version: 0, state: initial })
    }));
    expect(response.status).toBe(201);
  };
  const snapshot = () => persisted.get("match") as StoredLegacyMatch;
  return { seed, snapshot, stub, service, command, game };
}

describe("original corpse discovery through browser command.php to durable match state", () => {
  it("renders original corpse menu with money, equipment, backpack and exit actions", () => {
    const state: StoredLegacyMatch = { version: 0, state: matchState() };
    const panel = renderLegacyCommandPanel(state, "甲");
    expect(panel).toContain("乙的尸体");
    expect(panel).toContain("拾取金钱 120");
    expect(panel).toContain("拾取 短剑");
    expect(panel).toContain("拾取 药剂");
    expect(panel).toContain("销毁尸体");
    expect(panel).toContain("value='corpse'");
    expect(panel).toContain("value='money'");
    state.state.players["乙"]!.name = "<script>alert(1)</script>";
    expect(renderLegacyCommandPanel(state, "甲")).not.toContain("<script>");
  });

  it("moves money from the server-side encountered corpse, ignoring forged HTTP targets", async () => {
    const test = harness();
    await test.seed();
    const result = await test.service.execute(test.command("mode=corpse&command=money&target=forged"), 101);
    expect(result).toMatchObject({ ok: true, snapshot: { version: 1 } });
    expect(test.stub.fetch.mock.calls.some(([url]) => String(url).endsWith("/corpse"))).toBe(true);
    const game = test.snapshot();
    expect(game.state.players["甲"]).toMatchObject({ money: 160, action: "" });
    expect(game.state.players["乙"]).toMatchObject({ money: 0 });
    await expect(test.service.execute(test.command("mode=corpse&command=money"), 102))
      .resolves.toMatchObject({ ok: false, status: 409 });
    expect(test.snapshot().version).toBe(1);
  });

  it("takes an inventory item once and persists both parties in one version", async () => {
    const test = harness();
    await test.seed();
    const result = await test.service.execute(test.command("mode=corpse&command=itm1"), 101);
    expect(result).toMatchObject({ ok: true, snapshot: { version: 1 } });
    expect(test.snapshot().state.players["甲"]).toMatchObject({ itm1: "药剂", itms1: 2, action: "" });
    expect(test.snapshot().state.players["乙"]).toMatchObject({ itm1: "", itms1: 0 });
    await expect(test.service.execute(test.command("mode=corpse&command=itm1"), 102))
      .resolves.toMatchObject({ ok: false, status: 409 });
  });

  it("allows exit without looting and rejects corpse target substitution", async () => {
    const test = harness();
    await test.seed();
    const rejected = await test.game.fetch(new Request("https://game.internal/corpse", {
      method: "POST", body: JSON.stringify({ username: "甲", target: "不存在", item: "money", now: 101 })
    }));
    expect(rejected.status).toBe(409);
    expect(test.snapshot().version).toBe(0);
    const result = await test.service.execute(test.command("mode=corpse&command=menu"), 102);
    expect(result).toMatchObject({ ok: true, snapshot: { version: 1 } });
    expect(test.snapshot().state.players["甲"]).toMatchObject({ action: "", money: 40 });
    expect(test.snapshot().state.players["乙"]).toMatchObject({ money: 120 });
  });

  it("destroys the encountered corpse and prevents a second mutation", async () => {
    const test = harness();
    await test.seed();
    const result = await test.service.execute(test.command("mode=corpse&command=destroy"), 110);
    expect(result).toMatchObject({ ok: true, snapshot: { version: 1 } });
    const after = test.snapshot();
    expect(after.state.players["乙"]).toMatchObject({
      money: 0, state: 16, corpse_clear_flag: 1, itms1: 0, weps: 0
    });
    expect(after.state.players["甲"]?.action).toBe("");
    const repeated = await test.service.execute(test.command("mode=corpse&command=destroy"), 111);
    expect(repeated).toMatchObject({ ok: false, status: 409 });
    expect(test.snapshot().version).toBe(1);
  });

  it("transfers a corpse weapon through the original item pickup path", async () => {
    const test = harness();
    await test.seed();
    const result = await test.service.execute(test.command("mode=corpse&command=wep"), 111);
    expect(result).toMatchObject({ ok: true, snapshot: { version: 1 } });
    const player = test.snapshot().state.players["甲"]!;
    const corpse = test.snapshot().state.players["乙"]!;
    expect(player.itm1).toBe("短剑");
    expect(player.itms1).toBe(7);
    expect(player.action).toBe("");
    expect(corpse.wep).toBe("拳头");
    expect(corpse.wepk).toBe("WN");
  });

  it("rejects dead looters and unknown corpse commands without a state mutation", async () => {
    const test = harness();
    const initial = matchState();
    initial.players["甲"]!.hp = 0;
    await test.seed(initial);
    const invalid = await test.service.execute(test.command("mode=corpse&command=takeaway"), 101);
    expect(invalid).toMatchObject({ ok: false, status: 409 });
    expect(test.snapshot().version).toBe(0);
    const dead = await test.service.execute(test.command("mode=corpse&command=money"), 102);
    expect(dead).toMatchObject({ ok: false, status: 409 });
    expect(test.snapshot().version).toBe(0);
  });
});
