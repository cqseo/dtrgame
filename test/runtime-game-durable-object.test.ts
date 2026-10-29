import { describe, expect, it } from "vitest";
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

function harness() {
  const values = new Map<string, unknown>();
  let ready = Promise.resolve();
  const ctx = {
    storage: {
      get: async <T>(key: string): Promise<T | undefined> => values.get(key) as T | undefined,
      put: async (key: string, value: unknown): Promise<void> => { values.set(key, structuredClone(value)); }
    },
    blockConcurrencyWhile: (callback: () => Promise<void>) => { ready = callback(); }
  } as unknown as DurableObjectState;
  const object = new LegacyGameDurableObject(ctx, {} as Cloudflare.Env);
  return { object, values, ready: () => ready };
}

const post = (path: string, body: unknown) => new Request(`https://game.invalid${path}`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body)
});

describe("legacy match Durable Object", () => {
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
});
