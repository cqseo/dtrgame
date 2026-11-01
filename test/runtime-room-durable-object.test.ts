import { afterEach, describe, expect, it, vi } from "vitest";
import { createLegacyRoomRecord } from "../src/legacy/room";
import { LegacyRoomDurableObject } from "../src/runtime/room-durable-object";

afterEach(() => vi.unstubAllGlobals());

async function roomHarness() {
  const original = createLegacyRoomRecord(4, 0, "甲", 10);
  const put = vi.fn(async () => undefined);
  let initialized: Promise<unknown> = Promise.resolve();
  const ctx = {
    storage: { get: vi.fn(async () => structuredClone(original)), put },
    blockConcurrencyWhile(callback: () => Promise<unknown>) {
      initialized = callback();
      return initialized;
    }
  } as unknown as DurableObjectState;
  const env = {
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SECRET_KEY: "sb_secret_fixture"
  } as unknown as Cloudflare.Env;
  const room = new LegacyRoomDurableObject(ctx, env);
  await initialized;
  const state = async () =>
    (await room.fetch(new Request("https://room.internal/state"))).json();
  const post = (path: string, body: object) =>
    room.fetch(new Request(`https://room.internal/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    }));
  return { original, put, room, state, post };
}

describe("room durability on failed Supabase persistence", () => {
  it("does not mutate the active room on failed entry", async () => {
    const h = await roomHarness();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ error: "unavailable" }, { status: 503 })));
    const response = await h.post("enter", { username: "乙" });
    expect(response.status).toBe(409);
    expect(await h.state()).toEqual(h.original);
    expect(h.put).not.toHaveBeenCalled();
  });

  it("does not switch the active room to a game when activation persistence fails", async () => {
    const h = await roomHarness();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ error: "unavailable" }, { status: 503 })));
    const response = await h.post("activate", { gamestate: 40, now: 100 });
    expect(response.status).toBe(409);
    expect(await h.state()).toEqual(h.original);
    expect(h.put).not.toHaveBeenCalled();
  });

  it("does not retain a room command when its database write fails", async () => {
    const h = await roomHarness();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ error: "unavailable" }, { status: 503 })));
    const response = await h.post("command", {
      command: "newchat", actor: "甲", para1: "hello", now: 20
    });
    expect(response.status).toBe(409);
    expect(await h.state()).toEqual(h.original);
    expect(h.put).not.toHaveBeenCalled();
  });

  it("persists implicit owner heartbeat updates even for commands reporting changed=false", async () => {
    const h = await roomHarness();
    const rpc = vi.fn(async () => Response.json(null));
    vi.stubGlobal("fetch", rpc);
    const response = await h.post("command", { command: "ready", actor: "甲", now: 100 });
    expect(response.status).toBe(200);
    const result = await response.json<{ changed: boolean }>();
    expect(result.changed).toBe(false);
    expect((await h.state()).ownerHeartbeat).toBe(100);
    expect(rpc).toHaveBeenCalledOnce();
    expect(h.put).toHaveBeenCalledOnce();
  });
});
