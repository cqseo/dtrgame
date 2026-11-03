import { describe, expect, it, vi } from "vitest";
import { createLegacyRoomRecord } from "../src/legacy/room";
import { legacyCookiePassword, legacyStoredPassword } from "../src/original-auth";
import { LegacyGameDurableObject, type StoredLegacyMatch } from "../src/runtime/game-durable-object";
import { LegacyRoomDurableObject } from "../src/runtime/room-durable-object";
import { LegacyMatchStarter } from "../src/runtime/match-starter";
import { LegacyGameService } from "../src/runtime/game-service";
import type { SupabaseLegacyAccounts, SupabaseLegacyMatches, SupabaseLegacyMatchStart } from "../src/runtime/supabase";

function isolatedObject<T extends { fetch(request: Request): Promise<Response> }>(
  factory: (ctx: DurableObjectState) => T
) {
  const persisted = new Map<string, unknown>();
  let ready = Promise.resolve();
  const ctx = {
    storage: {
      get: async <S>(name: string): Promise<S | undefined> => persisted.get(name) as S | undefined,
      put: async (name: string, value: unknown) => { persisted.set(name, structuredClone(value)); }
    },
    blockConcurrencyWhile: (task: () => Promise<void>) => { ready = task(); }
  } as unknown as DurableObjectState;
  const instance = factory(ctx);
  const stub = {
    fetch: (url: string, options?: RequestInit) => instance.fetch(new Request(url, options))
  };
  return { instance, stub, persisted, ready: () => ready };
}

const post = (url: string, data: unknown) => new Request(url, {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data)
});

describe("two-player match start and authenticated turns on isolated Durable Objects", () => {
  it("bridges a ready room to a match and serializes two independent players' commands", async () => {
    const originalRoom = createLegacyRoomRecord(4, 0, "甲", 100);
    originalRoom.room.player[0]!.ready = 1;
    originalRoom.room.player[1]!.name = "乙";
    originalRoom.room.player[1]!.ready = 1;
    originalRoom.room.readystat = 2;

    const game = isolatedObject(ctx => new LegacyGameDurableObject(ctx, {} as Cloudflare.Env));
    const room = isolatedObject(ctx => new LegacyRoomDurableObject(ctx, {} as Cloudflare.Env));
    await Promise.all([game.ready(), room.ready()]);
    const replaced = await room.instance.fetch(post("https://room.internal/replace", originalRoom));
    expect(replaced.status).toBe(201);

    const start = vi.fn(async () => ({
      matchId: 4_000_000_031, gamenum: 31, gamestate: 40,
      profiles: [
        { username: "甲", password: "stored-a", groupid: 1, gender: "m", icon: "1", ip: "", card: 0, motto: "", killmsg: "", lastword: "" },
        { username: "乙", password: "stored-b", groupid: 1, gender: "f", icon: "2", ip: "", card: 0, motto: "", killmsg: "", lastword: "" }
      ]
    }));
    const gameNamespace = {
      idFromName: (id: string) => id,
      get: () => game.stub
    } as unknown as DurableObjectNamespace;
    const roomNamespace = {
      idFromName: (id: string) => id,
      get: () => room.stub
    } as unknown as DurableObjectNamespace;
    const started = await new LegacyMatchStarter(
      gameNamespace, roomNamespace,
      { start } as unknown as SupabaseLegacyMatchStart
    ).start(originalRoom, 200);

    expect(started.matchId).toBe(4_000_000_031);
    expect(started.record.groomstatus).toBe(40);
    expect((room.persisted.get("record") as { groomstatus: number }).groomstatus).toBe(40);
    const seeded = game.persisted.get("match") as StoredLegacyMatch;
    expect(seeded.version).toBe(0);
    expect(Object.keys(seeded.state.players)).toEqual(["甲", "乙"]);
    expect(seeded.state.players["甲"]?.teamID).toBe("红队");
    expect(seeded.state.players["乙"]?.teamID).toBe("蓝队");

    const password = legacyCookiePassword("fixture-password");
    const accounts = {
      findByUsername: vi.fn(async (name: string) => ["甲", "乙"].includes(name)
        ? { username: name, password: legacyStoredPassword(name, password), groupid: 1, roomid: 4 }
        : null)
    } as unknown as SupabaseLegacyAccounts;
    const matches = {
      forUser: vi.fn(async () => ({ matchId: started.matchId, roomId: 4, gamestate: 40, weather: 1 }))
    } as unknown as SupabaseLegacyMatches;
    const service = new LegacyGameService(gameNamespace, accounts, matches);
    const authenticated = (username: string, command?: string) => new Request("https://game.test/command.php", {
      method: command === undefined ? "GET" : "POST",
      headers: {
        cookie: `bra_user=${encodeURIComponent(username)}; bra_pass=${password}`,
        ...(command === undefined ? {} : { "content-type": "application/x-www-form-urlencoded" })
      },
      ...(command === undefined ? {} : { body: command })
    });

    const [first, second] = await Promise.all([
      service.execute(authenticated("甲", "mode=special&command=pose5"), 201),
      service.execute(authenticated("乙", "mode=special&command=tac4"), 202)
    ]);
    expect(first).toMatchObject({ ok: true, username: "甲" });
    expect(second).toMatchObject({ ok: true, username: "乙" });
    const final = game.persisted.get("match") as StoredLegacyMatch;
    expect(final.version).toBe(2);
    expect(final.state.players["甲"]?.pose).toBe(5);
    expect(final.state.players["乙"]?.tactic).toBe(4);
    expect((await service.state(authenticated("甲")))).toMatchObject({
      ok: true, snapshot: { version: 2 }
    });
    expect((await service.state(authenticated("乙")))).toMatchObject({
      ok: true, snapshot: { version: 2 }
    });
    expect((await service.state(new Request("https://game.test/game.php")))).toEqual({
      ok: false, status: 401, error: "no_login"
    });
  });
});
