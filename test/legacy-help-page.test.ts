import { describe, expect, it } from "vitest";
import { LEGACY_COMPILED_INCLUDES } from "../src/generated/legacy-compiled-includes";
import { LEGACY_HELP_MODULE_TEMPLATES } from "../src/generated/legacy-help-module-templates";
import { SnapshotLegacyDatabase, legacyRowFromJson } from "../src/legacy/php/database";
import { runLegacyPage } from "../src/runtime/legacy-page-handler";

describe("original help.php dynamic includes", () => {
  it("bundles original PHP configuration and module template data", () => {
    expect(LEGACY_COMPILED_INCLUDES["./include/modules/base/itemmix/itemmix/config/itemmix.config.php"]).toBeDefined();
    expect(LEGACY_COMPILED_INCLUDES["./include/modules/base/addnpc/config/addnpc.config.php"]).toBeDefined();
    expect(LEGACY_HELP_MODULE_TEMPLATES.MOD_CLUBBASE_SKILLPAGE).toContain("get_skillpage");
  });

  it("renders the original public help page rather than returning 500", async () => {
    const body = await runLegacyPage("/help.php", new Request("https://game.test/help.php"), {
      tablePrefix: "acbra2_",
      roomId: "0",
      database: new SnapshotLegacyDatabase({
        acbra2_game: [],
        acbra2_users: [],
        acbra2_messages: []
      })
    });
    expect(body).toContain("<title> ACFUN 大 逃 杀 </title>");
    expect(body?.length).toBeGreaterThan(100_000);
    expect(body).toContain("合成");
  });

  it("loads the current game area order before rendering the PHP command help", async () => {
    // Original command.php is both the browser entry and the daemon entry:
    // its server-side common.inc.php loads and decodes the game row before
    // map\\get_plsnum(). The proxy-side NO_SYS_UPDATE must not suppress
    // that read-only initialization when the Worker runs the daemon inline.
    const areaOrder = Array.from({ length: 35 }, (_, index) => index).join(",");
    const database = new SnapshotLegacyDatabase({
      acbra2_game: [legacyRowFromJson({
        groomid: 0, groomtype: 0, groomstatus: 0,
        gametype: 0, gamestate: 0, arealist: areaOrder,
        noisevars: "", roomvars: "", gamevars: ""
      })],
      acbra2_users: [],
      acbra2_messages: []
    });
    const body = await runLegacyPage("/help.php", new Request("https://game.test/help.php"), {
      tablePrefix: "acbra2_", roomId: "0", database
    });
    expect(body).toContain("地图中共有35个区域");
    expect(body).toContain('<div id="fmsgboxclub1"');
    expect(body).toContain('<span>\n生命\n</span>');
    expect(body).toContain('class="skilldesc_left b3"');
    // Skill 56's original initializer must preserve its NPC preset when
    // referencing `global $skill56_npc` and the asset probe must resolve
    // each NPC's real portrait filename from public/.
    expect(body).toContain("以下是所有可能被召唤出的佣兵的列表");
    expect(body).toContain("肥宅");
    expect(body).toContain("春原 阳平");
    expect(body).toContain('src="img/n_150.gif"');
    expect(body).toContain('src="img/n_160.gif"');
    expect(database.issued.some(statement => /SELECT \* FROM acbra2_game/i.test(statement.sql))).toBe(true);
  });
});
