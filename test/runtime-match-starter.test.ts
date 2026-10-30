import { describe, expect, it, vi } from "vitest";
import { createLegacyRoomRecord } from "../src/legacy/room";
import { LegacyMatchStarter, legacyOpeningGamestate } from "../src/runtime/match-starter";
import type { SupabaseLegacyMatchStart } from "../src/runtime/supabase";

describe("waiting-room to match bridge", () => {
  it("preserves the original opening-state rules", () => {
    const solo = createLegacyRoomRecord(4, 0, "甲", 10);
    expect(legacyOpeningGamestate(solo)).toBe(40);
    solo.room.current_game_option["opening-gamestate"] = "30";
    expect(legacyOpeningGamestate(solo)).toBe(30);
    const tutorial = createLegacyRoomRecord(7, 7, "甲", 10);
    expect(legacyOpeningGamestate(tutorial)).toBe(30);
  });

  it("creates players, persists version zero, then activates the room", async () => {
    const record = createLegacyRoomRecord(4, 0, "甲", 10);
    record.room.player[1]!.name = "乙";
    record.room.player[0]!.ready = 1;
    record.room.player[1]!.ready = 1;
    record.room.readystat = 2;
    const start = vi.fn(async () => ({
      matchId: 4_000_000_001, gamenum: 1, gamestate: 40,
      profiles: [
        { username: "甲", password: "a", groupid: 1, gender: "m", icon: "1", ip: "", card: 0, motto: "", killmsg: "", lastword: "" },
        { username: "乙", password: "b", groupid: 1, gender: "f", icon: "2", ip: "", card: 0, motto: "", killmsg: "", lastword: "" }
      ]
    }));
    let snapshot: { version: number; state: { players: Record<string, { teamID: string; pls: number }> } } | undefined;
    const gameStub = { fetch: vi.fn(async (_url: string, init?: RequestInit) => {
      snapshot = JSON.parse(String(init?.body));
      return Response.json(snapshot, { status: 201 });
    }) };
    const active = structuredClone(record);
    active.groomstatus = 40;
    active.gamestate = 40;
    const roomStub = { fetch: vi.fn(async () => Response.json(active)) };
    const games = { idFromName: vi.fn(name => name), get: vi.fn(() => gameStub) } as unknown as DurableObjectNamespace;
    const rooms = { idFromName: vi.fn(name => name), get: vi.fn(() => roomStub) } as unknown as DurableObjectNamespace;

    const result = await new LegacyMatchStarter(
      games, rooms, { start } as unknown as SupabaseLegacyMatchStart
    ).start(record, 100);

    expect(start).toHaveBeenCalledWith(4, ["甲", "乙"], 40, 100);
    expect(snapshot?.version).toBe(0);
    expect(Object.keys(snapshot?.state.players ?? {})).toEqual(["甲", "乙"]);
    expect(snapshot?.state.players["甲"]?.teamID).toBe("红队");
    expect(snapshot?.state.players["乙"]?.teamID).toBe("蓝队");
    expect(snapshot?.state.players["甲"]?.pls).not.toBe(0);
    expect(result.record.groomstatus).toBe(40);
  });
});
