import { describe, expect, it, vi } from "vitest";
import { legacyCookiePassword, legacyStoredPassword } from "../src/original-auth";
import { LegacyOriginalCommandService } from "../src/runtime/original-command-service";
import type {
  SupabaseLegacyAccounts,
  SupabaseLegacyMatches,
  SupabaseLegacyRest
} from "../src/runtime/supabase";

const cookiePassword = legacyCookiePassword("secret");
const account = {
  username: "测试者",
  password: legacyStoredPassword("测试者", cookiePassword),
  groupid: 1,
  roomid: 4
};
const match = {
  roomId: 4, matchId: 4_000_000_007, gamenum: 7, gamestate: 3,
  gametype: 10, groomtype: 0, groomstatus: 40, starttime: 123,
  validnum: 1, alivenum: 1, deathnum: 0, areanum: 1, weather: 1
};
const game = {
  gamenum: 7, gametype: 10, gamestate: 3, groomid: 4, groomtype: 0,
  groomstatus: 40, starttime: 123, afktime: 100, validnum: 1, alivenum: 1,
  deathnum: 0, combonum: 0, weather: 1, hack: 0, hdamage: 0, hplayer: "",
  winmode: 0, winner: "", areanum: 1, areatime: 0, areawarn: 0,
  arealist: "", noisevars: "", roomvars: "", gamevars: ""
};

describe("compiled original command service", () => {
  it("runs command.php's room routine over a Supabase snapshot and commits it", async () => {
    const rpc = vi.fn(async (name: string, _args: Readonly<Record<string, unknown>>) => {
      if (name === "dtr_legacy_database_load") {
        return [{ revision: 5, tables: { game: [game] } }];
      }
      if (name === "dtr_legacy_database_commit") return [{ revision: 6 }];
      throw new Error(`unexpected rpc ${name}`);
    });
    const accounts = { findByUsername: vi.fn(async () => account) } as unknown as SupabaseLegacyAccounts;
    const matches = { forUser: vi.fn(async () => match) } as unknown as SupabaseLegacyMatches;
    const service = new LegacyOriginalCommandService(
      { rpc } as unknown as SupabaseLegacyRest,
      accounts,
      matches
    );
    const request = new Request("https://game.test/command.php", {
      method: "POST",
      headers: { cookie: `bra_user=${encodeURIComponent(account.username)}; bra_pass=${cookiePassword}` }
    });

    await expect(service.executeRoomRoutine(request, 200)).resolves.toEqual({ ok: true, revision: 6 });
    expect(rpc.mock.calls.map(call => call[0])).toEqual([
      "dtr_legacy_database_load",
      "dtr_legacy_database_commit"
    ]);
    expect(rpc.mock.calls[1]?.[1]).toMatchObject({
      p_room_id: 4,
      p_expected_revision: 5
    });
  });
});
