import { describe, expect, it } from "vitest";
import { SnapshotLegacyDatabase, legacyRowFromJson } from "../src/legacy/php/database";
import { runLegacyPage } from "../src/runtime/legacy-page-handler";

describe("original map.php game-state bootstrap", () => {
  it("loads the persisted room map before rendering original map coordinates", async () => {
    const database = new SnapshotLegacyDatabase({
      acbra2_game: [legacyRowFromJson({
        groomid: 0, groomtype: 0, groomstatus: 0,
        gametype: 0, gamestate: 0,
        arealist: Array.from({ length: 35 }, (_, index) => index).join(","),
        gamevars: "", roomvars: "", noisevars: ""
      })],
      acbra2_users: [],
      acbra2_messages: []
    });
    const html = await runLegacyPage(
      "/map.php",
      new Request("https://stage.invalid/map.php"),
      { database, tablePrefix: "acbra2_", roomId: "0" }
    );
    expect(html).toContain('id="map_display"');
    expect(html).toContain("冰封墓场");
    expect(html).toContain("常磐台中学");
    expect((html?.match(/mapspan(?:yellow|lime|red)/g) ?? []).length).toBe(34);
    expect(database.issued.some(query => /SELECT \* FROM acbra2_game/i.test(query.sql))).toBe(true);
    expect(database.issued.every(query => /^\s*SELECT\b/i.test(query.sql))).toBe(true);
  });
});
