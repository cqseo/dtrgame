import { afterEach, describe, expect, it, vi } from "vitest";
import { createLegacyPlayerRecord } from "../src/generated/legacy-registry";
import type { LegacyPlayerRecord } from "../src/legacy/player";
import { LegacyGameDurableObject, type LegacyMatchState } from "../src/runtime/game-durable-object";
import { renderLegacyCommandPanel } from "../src/runtime/game-render";

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
  const put = vi.fn(async (key: string, value: unknown): Promise<void> => {
    values.set(key, structuredClone(value));
  });
  let ready = Promise.resolve();
  const ctx = {
    storage: {
      get: async <T>(key: string): Promise<T | undefined> => values.get(key) as T | undefined,
      put
    },
    blockConcurrencyWhile: (callback: () => Promise<void>) => { ready = callback(); }
  } as unknown as DurableObjectState;
  const object = new LegacyGameDurableObject(ctx, env as Cloudflare.Env);
  return { object, values, put, ready: () => ready };
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

  it("returns an HTTP failure and keeps the previous match when storage rejects a command", async () => {
    const test = harness();
    await test.ready();
    await test.object.fetch(post("/hydrate", { version: 0, state: state() }));
    test.put.mockRejectedValueOnce(new Error("durable storage unavailable"));
    const response = await test.object.fetch(post("/command", {
      username: "测试者", command: "move", input: { moveto: "1" }, now: 101
    }));
    expect(response.status).toBe(409);
    const stateResponse = await test.object.fetch(new Request("https://game.invalid/state"));
    const current = await stateResponse.json<{ version: number; state: LegacyMatchState }>();
    expect(current.version).toBe(0);
    expect(current.state.players["测试者"]?.pls).toBe(0);
    expect((test.values.get("match") as { version: number }).version).toBe(0);
  });

  it("does not expose a restored match when Durable Object storage fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json([{ version: 7, state: state() }])));
    const test = harness({
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SECRET_KEY: "sb_secret_fixture"
    } as Partial<Cloudflare.Env>);
    await test.ready();
    test.put.mockRejectedValueOnce(new Error("durable storage unavailable"));
    const response = await test.object.fetch(post("/restore", { matchId: 9 }));
    expect(response.status).toBe(409);
    expect((await test.object.fetch(new Request("https://game.invalid/state"))).status).toBe(404);
    expect(test.values.has("match")).toBe(false);
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
    expect(stored.state.players["敌人"]).toMatchObject({ hp: 0, state: 22, bid: 1, endtime: 123 });
    expect(stored.state.players["测试者"]).toMatchObject({ killnum: 1, action: "corpse2" });
    // A fatal combat transaction must feed the original PHP death details,
    // rather than leaving the victim with an empty or playable command UI.
    const deadView = renderLegacyCommandPanel(stored, "敌人");
    expect(deadView).toContain("战败身亡");
    expect(deadView).toContain("凶手：测试者");
    expect(deadView).toContain("死亡时间：");
    expect(deadView).toContain("本次生命已结束");
    expect(deadView).not.toContain("现在想要做什么？");
    const beforePreview = structuredClone(test.values.get("match"));
    const previewResponse = await test.object.fetch(new Request("https://game.invalid/settlement-preview"));
    expect(previewResponse.status).toBe(200);
    expect(await previewResponse.json()).toMatchObject({
      ready: true, winmode: 2, winners: ["测试者"], validnum: 2, alivenum: 1, winnum: 1
    });
    expect(test.values.get("match")).toEqual(beforePreview);
    expect((test.values.get("match") as { version: number }).version).toBe(1);
    const rewardResponse = await test.object.fetch(new Request("https://game.invalid/settlement-plan"));
    expect(rewardResponse.status).toBe(200);
    const rewards = await rewardResponse.json<{ matchId: number; version: number; plan: {
      winner: string; rewards: Array<{ username: string; credits: number; gold: number; wingames: number }>
    } }>();
    expect(rewards.matchId).toBe(stored.state.matchId);
    expect(rewards.version).toBe(1);
    expect(rewards.plan.winner).toBe("测试者");
    expect(rewards.plan.rewards).toMatchObject([
      { username: "测试者", gold: 120, credits: 214, wingames: 1 },
      { username: "敌人", gold: 10, credits: 14, wingames: 0 }
    ]);
    expect(test.values.get("match")).toEqual(beforePreview);
  });

  it("binds attacks to saved enemy pid and refuses forged targets without mutating the match", async () => {
    vi.spyOn(crypto, "getRandomValues").mockImplementation(array => {
      (array as Uint32Array)[0] = 0;
      return array;
    });
    const test = harness();
    await test.ready();
    const current = state();
    Object.assign(current.players["测试者"]!, {
      pid: 1, pls: 0, action: "enemy2",
      wep: "调色刀", wepk: "WK", wepe: 45, weps: 9,
      att: 100, def: 100, wk: 100
    });
    const encountered = player();
    Object.assign(encountered, { pid: 2, name: "已遭遇", pls: 0, hp: 200, mhp: 400 });
    const uninvolved = player();
    Object.assign(uninvolved, { pid: 3, name: "其他玩家", pls: 0, hp: 200, mhp: 400 });
    current.players["已遭遇"] = encountered;
    current.players["其他玩家"] = uninvolved;
    current.weatherId = 2;
    await test.object.fetch(post("/hydrate", { version: 0, state: current }));

    const forged = await test.object.fetch(post("/battle", {
      username: "测试者", target: "其他玩家", now: 120, active: false, weatherId: 999
    }));
    expect(forged.status).toBe(409);
    const afterForgery = test.values.get("match") as { version: number; state: LegacyMatchState };
    expect(afterForgery.version).toBe(0);
    expect(afterForgery.state.players["其他玩家"]?.hp).toBe(200);

    const legitimate = await test.object.fetch(post("/battle", {
      username: "测试者", now: 120
    }));
    expect(legitimate.status).toBe(200);
    const afterBattle = test.values.get("match") as { version: number; state: LegacyMatchState };
    expect(afterBattle.version).toBe(1);
    expect(afterBattle.state.players["其他玩家"]?.hp).toBe(200);

    const replayWithoutEncounter = await test.object.fetch(post("/battle", {
      username: "其他玩家", now: 121
    }));
    expect(replayWithoutEncounter.status).toBe(409);
    expect((test.values.get("match") as { version: number }).version).toBe(1);
  });

  it("uses snapshot weather and initiative, ignoring spoofed battle request values", async () => {
    vi.spyOn(crypto, "getRandomValues").mockImplementation(array => {
      (array as Uint32Array)[0] = 0;
      return array;
    });
    const create = async () => {
      const test = harness();
      await test.ready();
      const current = state();
      Object.assign(current.players["测试者"]!, {
        pid: 1, action: "enemy2", pls: 0, att: 100, def: 100, wk: 100,
        wep: "调色刀", wepk: "WK", wepe: 45, weps: 9
      });
      const enemy = player();
      Object.assign(enemy, { pid: 2, name: "敌人", pls: 0, hp: 300, mhp: 400 });
      current.players["敌人"] = enemy;
      current.weatherId = 2;
      await test.object.fetch(post("/hydrate", { version: 0, state: current }));
      return test;
    };
    const first = await create();
    const second = await create();
    const normal = await first.object.fetch(post("/battle", { username: "测试者", now: 100 }));
    const spoofed = await second.object.fetch(post("/battle", {
      username: "测试者", now: 100, target: "敌人", active: false, weatherId: 999
    }));
    expect(normal.status).toBe(200);
    expect(spoofed.status).toBe(200);
    expect(await spoofed.json()).toEqual(await normal.json());
    expect(second.values.get("match")).toEqual(first.values.get("match"));
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

  it("atomically transfers one corpse item through the original pending-item pickup path", async () => {
    const test = harness();
    await test.ready();
    const corpseState = state();
    Object.assign(corpseState.players["测试者"]!, {
      pid: 1, pls: 0, action: "corpse2",
      itm1: "", itmk1: "", itme1: 0, itms1: 0, itmsk1: ""
    });
    const corpse = player();
    Object.assign(corpse, {
      pid: 2, name: "死者", pls: 0, hp: 0,
      itm1: "针", itmk1: "WC", itme1: 10, itms1: 2, itmsk1: ""
    });
    corpseState.players["死者"] = corpse;
    await test.object.fetch(post("/hydrate", { version: 0, state: corpseState }));
    const response = await test.object.fetch(post("/corpse", {
      username: "测试者", target: "死者", item: "itm1", now: 100
    }));
    expect(response.status).toBe(200);
    const stored = test.values.get("match") as { version: number; state: LegacyMatchState };
    expect(stored.version).toBe(1);
    expect(stored.state.players["测试者"]).toMatchObject({ itm1: "针", itms1: 2, action: "" });
    expect(stored.state.players["死者"]).toMatchObject({ itm1: "", itms1: 0 });
  });
});
