import { describe, expect, it, vi } from "vitest";
import { legacyCookiePassword, legacyStoredPassword } from "../src/original-auth";
import { createLegacyRoomRecord } from "../src/legacy/room";
import { LegacyRoomService } from "../src/runtime/room-service";
import { LegacyGameService } from "../src/runtime/game-service";
import type { SupabaseLegacyAccounts, SupabaseLegacyRooms, SupabaseLegacyMatches } from "../src/runtime/supabase";

const password = legacyCookiePassword("fixture-only-password");
const account = {
  username: "甲", password: legacyStoredPassword("甲", password), groupid: 1, roomid: 2
};
const cookie = `bra_user=${encodeURIComponent(account.username)}; bra_pass=${password}`;
const request = (path: string, body?: string, type = "application/x-www-form-urlencoded") =>
  new Request(`https://game.test/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { cookie, ...(body === undefined ? {} : { "content-type": type }) },
    ...(body === undefined ? {} : { body })
  });

function services(
  stubFetch: (url: string, init?: RequestInit) => Promise<Response>,
  options: { roomRecord?: boolean; failLoad?: boolean } = {}
) {
  const accounts = {
    findByUsername: vi.fn(async () => account),
    setCurrentRoom: vi.fn(async () => undefined)
  } as unknown as SupabaseLegacyAccounts;
  const rooms = {
    loadRecord: vi.fn(async () => {
      if (options.failLoad) throw new Error("Supabase room read unavailable");
      return createLegacyRoomRecord(2, 0, "甲", 100);
    })
  } as unknown as SupabaseLegacyRooms;
  const matches = {
    forUser: vi.fn(async () => ({ matchId: 9001, roomId: 2, gamestate: 40, weather: 1 }))
  } as unknown as SupabaseLegacyMatches;
  const namespace = {
    idFromName: vi.fn(value => value),
    get: vi.fn(() => ({ fetch: vi.fn(stubFetch) }))
  } as unknown as DurableObjectNamespace;
  return {
    room: new LegacyRoomService(namespace, accounts, rooms),
    game: new LegacyGameService(namespace, accounts, matches),
    rooms, namespace
  };
}

describe("authenticated room and match failure boundaries", () => {
  it("returns a recoverable room-state error when its Durable Object is unreachable", async () => {
    const s = services(async () => { throw new Error("room transport unavailable"); });
    await expect(s.room.state(request("roomupdate.php"), 100)).resolves.toEqual({
      ok: false, status: 409, error: "room transport unavailable"
    });
    await expect(s.room.execute(request("roomcmd.php", "command=ready"), 100)).resolves.toMatchObject({
      ok: false, status: 409
    });
  });

  it("returns a recoverable room-state error on failed Supabase hydration", async () => {
    const s = services(async () => Response.json({ error: "missing" }, { status: 404 }), {
      failLoad: true
    });
    await expect(s.room.state(request("roomupdate.php"), 100)).resolves.toEqual({
      ok: false, status: 409, error: "Supabase room read unavailable"
    });
  });

  it("rejects bad room command content and transient command writes without throwing", async () => {
    const roomState = createLegacyRoomRecord(2, 0, "甲", 100);
    const s = services(async (url) => {
      if (url.endsWith("/state")) return Response.json(roomState);
      throw new Error("room commit unavailable");
    });
    await expect(s.room.execute(request("roomcmd.php", "command=ready", "application/json"), 100))
      .resolves.toMatchObject({ ok: false, status: 409 });
    await expect(s.room.execute(request("roomcmd.php", "command=ready"), 100))
      .resolves.toEqual({ ok: false, status: 409, error: "room commit unavailable" });
  });

  it("returns an actionable game-state error when the match object is unreachable", async () => {
    const s = services(async () => { throw new Error("match transport unavailable"); });
    await expect(s.game.state(request("game.php"))).resolves.toEqual({
      ok: false, status: 409, error: "match transport unavailable"
    });
  });

  it("handles failed match restoration rather than leaking an unhandled exception", async () => {
    const s = services(async (url) => {
      if (url.endsWith("/state")) return Response.json({ error: "missing" }, { status: 404 });
      throw new Error("snapshot restore unavailable");
    });
    await expect(s.game.state(request("game.php"))).resolves.toEqual({
      ok: false, status: 409, error: "snapshot restore unavailable"
    });
  });

  it("does not report a successful command when the game Durable Object rejects it", async () => {
    const s = services(async (url) => {
      if (url.endsWith("/state")) return Response.json({ version: 0, state: { matchId: 9001, players: {} } });
      throw new Error("match command unavailable");
    });
    await expect(s.game.execute(request("command.php", "command=move&moveto=1"), 100))
      .resolves.toEqual({ ok: false, status: 409, error: "match command unavailable" });
    await expect(s.game.execute(request("command.php", "command=move", "application/json"), 100))
      .resolves.toMatchObject({ ok: false, status: 409 });
  });
});
