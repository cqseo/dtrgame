import { describe, expect, it } from "vitest";
import { LEGACY_COMPILED_INCLUDES } from "../src/generated/legacy-compiled-includes";
import { LEGACY_HELP_MODULE_TEMPLATES } from "../src/generated/legacy-help-module-templates";
import { SnapshotLegacyDatabase } from "../src/legacy/php/database";
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
});
