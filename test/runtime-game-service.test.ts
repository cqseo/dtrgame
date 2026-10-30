import { describe, expect, it, vi } from "vitest";
import { createLegacyEntrant } from "../src/legacy/player";
import type { LegacyRandom } from "../src/legacy/random";
import { legacyCookiePassword, legacyStoredPassword } from "../src/original-auth";
import type { StoredLegacyMatch } from "../src/runtime/game-durable-object";
import { LegacyGameService } from "../src/runtime/game-service";
import type { SupabaseLegacyAccounts, SupabaseLegacyMatches } from "../src/runtime/supabase";

const random: LegacyRandom = { int: (minimum) => minimum };
const cookiePass = legacyCookiePassword("secret");
const account = {
  username: "测试者", password: legacyStoredPassword("测试者", cookiePass), groupid: 1, roomid: 4
};
const match = {
  roomId: 4, matchId: 4_000_000_007, gamenum: 7, gamestate: 40,
  gametype: 10, groomtype: 0, groomstatus: 40, starttime: 123,
  validnum: 1, alivenum: 1, deathnum: 0, areanum: 0, weather: 1
};

function snapshot(version = 0): StoredLegacyMatch {
  const player = createLegacyEntrant({
    name: "测试者", gender: "m", icon: 1, serialNumber: 1, now: 123,
    random, areaWave: 0, spawnArea: 2
  });
  player.pid = 1;
  return {
    version,
    state: {
      matchId: match.matchId, gamestate: 40, gametype: 10,
      players: { "测试者": player }, availableAreas: [1, 2], forbiddenAreas: [],
      areaNames: ["无", "分校", "北村住宅区"], weatherId: 1
    }
  };
}

function request(body?: string): Request {
  return new Request("https://game.test/command.php", {
    method: body === undefined ? "GET" : "POST",
    headers: {
      cookie: `bra_user=${encodeURIComponent(account.username)}; bra_pass=${cookiePass}`,
      ...(body === undefined ? {} : { "content-type": "application/x-www-form-urlencoded" })
    },
    ...(body === undefined ? {} : { body })
  });
}

function service(fetchStub: (url: string, init?: RequestInit) => Promise<Response>): LegacyGameService {
  const namespace = {
    idFromName: vi.fn(value => value),
    get: vi.fn(() => ({ fetch: vi.fn(fetchStub) }))
  } as unknown as DurableObjectNamespace;
  const accounts = { findByUsername: vi.fn(async () => account) } as unknown as SupabaseLegacyAccounts;
  const matches = { forUser: vi.fn(async () => match) } as unknown as SupabaseLegacyMatches;
  return new LegacyGameService(namespace, accounts, matches);
}

describe("authenticated game transport", () => {
  it("restores a missing durable object from the private snapshot store", async () => {
    const calls: string[] = [];
    const original = snapshot();
    const sut = service(async (url, init) => {
      calls.push(`${init?.method ?? "GET"} ${new URL(url).pathname}`);
      if (calls.length === 1) return Response.json({ error: "missing" }, { status: 404 });
      return Response.json(original, { status: 201 });
    });

    await expect(sut.state(request())).resolves.toMatchObject({ ok: true, snapshot: original });
    expect(calls).toEqual(["GET /state", "POST /restore"]);
  });

  it("executes a command only as the cookie-authenticated player and refreshes state", async () => {
    const initial = snapshot();
    const refreshed = snapshot(1);
    refreshed.state.players["测试者"]!.sp = 385;
    const bodies: unknown[] = [];
    let stateReads = 0;
    const sut = service(async (url, init) => {
      const path = new URL(url).pathname;
      if (path === "/state") return Response.json(stateReads++ === 0 ? initial : refreshed);
      bodies.push(JSON.parse(String(init?.body)));
      return Response.json({ version: 1, log: "移动完成" });
    });

    const result = await sut.execute(request("mode=command&command=move&moveto=1"), 200);
    expect(result).toMatchObject({ ok: true, username: "测试者", snapshot: { version: 1 } });
    expect(bodies[0]).toMatchObject({
      username: "测试者", mode: "command", command: "move", now: 200,
      input: { mode: "command", command: "move", moveto: "1" }
    });
  });

  it("rejects a missing or invalid legacy session before locating a match", async () => {
    const accounts = { findByUsername: vi.fn() } as unknown as SupabaseLegacyAccounts;
    const matches = { forUser: vi.fn() } as unknown as SupabaseLegacyMatches;
    const namespace = {} as DurableObjectNamespace;
    const result = await new LegacyGameService(namespace, accounts, matches).state(
      new Request("https://game.test/game.php")
    );
    expect(result).toEqual({ ok: false, status: 401, error: "no_login" });
    expect(matches.forUser).not.toHaveBeenCalled();
  });
});
