import { afterEach, describe, expect, it, vi } from "vitest";
import { createLegacyPlayerRecord } from "../src/generated/legacy-registry";
import type { LegacyPlayerRecord } from "../src/legacy/player";
import { LegacyGameDurableObject, type LegacyMatchState } from "../src/runtime/game-durable-object";

function player(): LegacyPlayerRecord {
  const value = createLegacyPlayerRecord();
  Object.assign(value, {
    name: "测试者", hp: 300, mhp: 400, sp: 300, msp: 400,
    pls: 0, pose: 3, tactic: 2, state: 0, endtime: 100,
    inf: "", club: 0
  });
  return value;
}

function state(): LegacyMatchState {
  return {
    matchId: 9,
    gamestate: 30,
    gametype: 0,
    players: { "测试者": player() },
    availableAreas: [0, 1],
    forbiddenAreas: [],
    areaNames: ["无月之影", "端点"],
    mapItems: []
  };
}

function harness(env: Partial<Cloudflare.Env> = {}) {
  const values = new Map<string, unknown>();
  let ready = Promise.resolve();
  const ctx = {
    storage: {
      get: async <T>(key: string): Promise<T | undefined> => values.get(key) as T | undefined,
      put: async (key: string, value: unknown): Promise<void> => { values.set(key, structuredClone(value)); }
    },
    blockConcurrencyWhile: (callback: () => Promise<void>) => { ready = callback(); }
  } as unknown as DurableObjectState;
  const object = new LegacyGameDurableObject(ctx, env as Cloudflare.Env);
  return { object, values, ready: () => ready };
}

const post = (path: string, body: unknown) => new Request(`https://game.invalid${path}`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body)
});

describe("legacy match Durable Object", () => {
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  it("hydrates one match and commits a complete command transaction with a new version", async () => {
    const test = harness();
    await test.ready();
    const hydrated = await test.object.fetch(post("/hydrate", { version: 0, state: state() }));
    expect(hydrated.status).toBe(201);

    const moved = await test.object.fetch(post("/command", {
      username: "测试者", command: "move", input: { moveto: "1" }, now: 101
    }));
    expect(moved.status).toBe(200);
    const result = await moved.json<{ version: number; player: LegacyPlayerRecord; log: string }>();
    expect(result.version).toBe(1);
    expect(result.player.pls).toBe(1);
    expect(result.player.sp).toBe(285);
    expect(result.log).toContain("移动到了端点");

    const stored = test.values.get("match") as { version: number; state: LegacyMatchState };
    expect(stored.version).toBe(1);
    expect(stored.state.players["测试者"]?.pls).toBe(1);
  });

  it("serializes concurrent commands and leaves persisted state untouched on rejection", async () => {
    const test = harness();
    await test.ready();
    await test.object.fetch(post("/hydrate", { version: 0, state: state() }));
    const [first, second] = await Promise.all([
      test.object.fetch(post("/command", { username: "测试者", command: "pose5", mode: "special", now: 101 })),
      test.object.fetch(post("/command", { username: "测试者", command: "tac4", mode: "special", now: 102 }))
    ]);
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    const after = test.values.get("match") as { version: number; state: LegacyMatchState };
    expect(after.version).toBe(2);
    expect(after.state.players["测试者"]?.pose).toBe(5);
    expect(after.state.players["测试者"]?.tactic).toBe(4);

    const rejected = await test.object.fetch(post("/command", { username: "不存在", command: "search", now: 103 }));
    expect(rejected.status).toBe(404);
    expect((test.values.get("match") as { version: number }).version).toBe(2);
  });

  it("rejects malformed hydration instead of creating a partial match", async () => {
    const test = harness();
    await test.ready();
    const response = await test.object.fetch(post("/hydrate", { version: 0, state: { matchId: 0, players: {} } }));
    expect(response.status).toBe(400);
    expect(test.values.has("match")).toBe(false);
  });

  it("commits both sides of a battle in one match version", async () => {
    vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
      (array as Uint32Array)[0] = 0;
      return array;
    });
    const test = harness();
    await test.ready();
    const battleState = state();
    Object.assign(battleState.players["测试者"]!, {
      pid: 1, pls: 0, wep: "调色刀", wepk: "WK", wepe: 45, weps: 9,
      att: 100, def: 100, wk: 100, lvl: 0, exp: 0, skillpoint: 0, action: "enemy2"
    });
    const enemy = player();
    Object.assign(enemy, {
      pid: 2, name: "敌人", pls: 0, hp: 1, mhp: 400,
      wep: "地雷", wepk: "WD", weps: 1, att: 100, def: 100,
      wp: 100, wk: 100, wg: 100, wc: 100, wd: 100, wf: 100,
      lvl: 0, exp: 0, skillpoint: 0
    });
    battleState.players["敌人"] = enemy;
    await test.object.fetch(post("/hydrate", { version: 0, state: battleState }));

    const response = await test.object.fetch(post("/battle", {
      username: "测试者", target: "敌人", active: true, weatherId: 2, now: 123
    }));
    expect(response.status).toBe(200);
    const stored = test.values.get("match") as { version: number; state: LegacyMatchState };
    expect(stored.version).toBe(1);
    expect(stored.state.players["敌人"]).toMatchObject({ hp: 0, state: 22, bid: 1 });
    expect(stored.state.players["测试者"]).toMatchObject({ killnum: 1, action: "corpse2" });
  });

  it("runs an immediate passive assault when search discovers an alert enemy", async () => {
    const values = [0, 0, 99, 0, 40, 6, 99];
    vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
      (array as Uint32Array)[0] = values.shift() ?? 0;
      return array;
    });
    const test = harness();
    await test.ready();
    const battleState = state();
    Object.assign(battleState.players["测试者"]!, {
      pid: 1, pls: 0, pose: 1, tactic: 4,
      wep: "拳头", wepk: "WN", wepe: 0, weps: "∞",
      att: 100, def: 100, wp: 100, lvl: 0, exp: 0, skillpoint: 0
    });
    const enemy = player();
    Object.assign(enemy, {
      pid: 2, name: "敌人", type: 0, pls: 0, pose: 1, tactic: 2,
      wep: "调色刀", wepk: "WK", wepe: 45, weps: 9,
      att: 100, def: 100, wk: 100, lvl: 0, exp: 0, skillpoint: 0
    });
    battleState.players["敌人"] = enemy;
    battleState.weatherId = 2;
    await test.object.fetch(post("/hydrate", { version: 0, state: battleState }));

    const response = await test.object.fetch(post("/command", {
      username: "测试者", command: "search", now: 100
    }));
    expect(response.status).toBe(200);
    const body = await response.json<{ encounter: { active: boolean }; battleResult: { strikes: unknown[] } }>();
    expect(body.encounter.active).toBe(false);
    expect(body.battleResult.strikes).toHaveLength(1);
    const stored = test.values.get("match") as { version: number; state: LegacyMatchState };
    expect(stored.version).toBe(1);
    expect(Number(stored.state.players["测试者"]?.hp)).toBeLessThan(300);
    expect(Number(stored.state.players["敌人"]?.wk)).toBe(101);
  });

  it("restores a missing Durable Object snapshot from the private Supabase RPC", async () => {
    const fetchMock = vi.fn(async (request: RequestInfo | URL, init?: RequestInit) => {
      expect(new URL(String(request)).pathname).toBe("/rest/v1/rpc/dtr_match_load");
      expect(JSON.parse(String(init?.body))).toEqual({ p_match_id: 9 });
      return Response.json([{ version: 7, state: state() }]);
    });
    vi.stubGlobal("fetch", fetchMock);
    const test = harness({
      SUPABASE_URL: "https://qtjcjmpapjsgrrgtfica.supabase.co",
      SUPABASE_SECRET_KEY: "sb_secret_test_only"
    } as Partial<Cloudflare.Env>);
    await test.ready();
    const response = await test.object.fetch(post("/restore", { matchId: 9 }));
    expect(response.status).toBe(201);
    const stored = test.values.get("match") as { version: number; state: LegacyMatchState };
    expect(stored.version).toBe(7);
    expect(stored.state.matchId).toBe(9);
  });
});
