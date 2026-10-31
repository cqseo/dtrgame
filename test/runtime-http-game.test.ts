import { describe, expect, it, vi } from "vitest";
// @ts-expect-error test-only Node builtin
import { readFileSync } from "node:fs";
import { createLegacyEntrant } from "../src/legacy/player";
import type { LegacyRandom } from "../src/legacy/random";
import { legacyDecode } from "../src/original-protocol";
import type { StoredLegacyMatch } from "../src/runtime/game-durable-object";
import type { LegacyGameService } from "../src/runtime/game-service";
import {
  handleLegacyGameCommand,
  handleLegacyGamePage,
  handleOriginalRoomRoutineCommand
} from "../src/runtime/http-game";
import type { LegacyOriginalCommandService } from "../src/runtime/original-command-service";
import type { LegacyUserMatch } from "../src/runtime/supabase";

const assets = {
  async fetch(request: Request): Promise<Response> {
    try { return new Response(readFileSync(`public${new URL(request.url).pathname}`), { status: 200 }); }
    catch { return new Response("", { status: 404 }); }
  }
};
const match: LegacyUserMatch = {
  roomId: 4, matchId: 4_000_000_001, gamenum: 1, gamestate: 40,
  gametype: 10, groomtype: 0, groomstatus: 40, starttime: 100,
  validnum: 1, alivenum: 1, deathnum: 0, areanum: 0, weather: 1
};

function snapshot(version = 0): StoredLegacyMatch {
  const random: LegacyRandom = { int: minimum => minimum };
  const player = createLegacyEntrant({
    name: "测试者", gender: "m", icon: 1, serialNumber: 1, now: 100,
    random, areaWave: 0, spawnArea: 2
  });
  player.pid = 1;
  return {
    version,
    state: {
      matchId: match.matchId, gamestate: 40, gametype: 10, players: { "测试者": player },
      availableAreas: [1, 2], forbiddenAreas: [], areaNames: ["无", "分校", "北村住宅区"]
    }
  };
}

describe("legacy game HTTP surface", () => {
  it("returns the byte-compatible login error when cookie authentication fails", async () => {
    const service = {
      state: vi.fn(async () => ({ ok: false as const, status: 401 as const, error: "no_login" }))
    } as unknown as LegacyGameService;
    const response = await handleLegacyGamePage(
      new Request("https://game.test/game.php", { headers: { cookie: "bra_user=invalid; bra_pass=invalid" } }),
      service,
      assets
    );
    const html = await response?.text();
    expect(response?.status).toBe(200);
    expect(html).toContain("用户未登陆，请从首页登录后再进入游戏");
    expect(html).toContain("<title> ACFUN 大 逃 杀 </title>");
  });

  it("renders a signed-in match with the original frame and working command form", async () => {
    const service = {
      state: vi.fn(async () => ({ ok: true as const, username: "测试者", match, snapshot: snapshot() }))
    } as unknown as LegacyGameService;
    const response = await handleLegacyGamePage(
      new Request("https://game.test/game.php"), service, assets
    );
    const html = await response?.text();
    expect(html).toContain("<title> ACFUN 大 逃 杀 </title>");
    expect(html).toContain('id="game_interface"');
    expect(html).toContain('id="gamecmd"');
    expect(html).toContain("北村住宅区");
    expect(html).not.toContain("{template");
  });

  it("returns the original encoded command payload after a state mutation", async () => {
    const updated = snapshot(1);
    updated.state.players["测试者"]!.sp = 385;
    const service = {
      execute: vi.fn(async () => ({
        ok: true as const, username: "测试者", match, snapshot: updated,
        output: { log: "移动完成" }
      }))
    } as unknown as LegacyGameService;
    const response = await handleLegacyGameCommand(new Request("https://game.test/command.php", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "mode=command&command=move&moveto=1"
    }), service, 200);
    const payload = await legacyDecode<Record<string, unknown>>(await response!.text());
    expect(payload).toMatchObject({
      innerHTML: { log: "移动完成", sp: "385 / 400", anum: 1 },
      value: { mode: "command", command: "menu" }
    });
  });

  it("routes room_routine_single through the compiled original command service", async () => {
    const executeRoomRoutine = vi.fn(async (_request: Request, _now: number) => ({
      ok: true as const,
      revision: 8
    }));
    const response = await handleOriginalRoomRoutineCommand(new Request("https://game.test/command.php", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "page=command&command=room_routine_single"
    }), { executeRoomRoutine } as unknown as LegacyOriginalCommandService, 200);

    expect(response?.status).toBe(200);
    expect(await response?.text()).toBe("");
    expect(executeRoomRoutine).toHaveBeenCalledOnce();
    expect(executeRoomRoutine.mock.calls[0]?.[1]).toBe(200);
  });

  it("leaves other commands on the existing path until their original page program is connected", async () => {
    const executeRoomRoutine = vi.fn();
    const response = await handleOriginalRoomRoutineCommand(new Request("https://game.test/command.php", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "page=command&command=move&moveto=1"
    }), { executeRoomRoutine } as unknown as LegacyOriginalCommandService, 200);
    expect(response).toBeUndefined();
    expect(executeRoomRoutine).not.toHaveBeenCalled();
  });
});
