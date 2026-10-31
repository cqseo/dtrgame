import { describe, expect, it } from "vitest";
import { LegacyHttpResponse } from "../src/runtime/legacy-http-response";
import { createLegacyModuleRuntime } from "../src/legacy/php/compiled-modules";
import { parseModuleFile } from "../src/legacy/php/parser";
import { runLegacyPageResponse } from "../src/runtime/legacy-page-handler";
import { SnapshotLegacyDatabase } from "../src/legacy/php/database";

describe("original PHP HTTP effects", () => {
  it("runs the compiled game logout page and preserves both deleted cookies", async () => {
    const response = await runLegacyPageResponse("/game.php", new Request("https://game.test/game.php", {
      method: "POST", body: "mode=quit"
    }), { database: new SnapshotLegacyDatabase(), tablePrefix: "acbra2_" });
    expect(response?.status).toBe(302);
    expect(response?.headers.get("location")).toBe("index.php");
    expect(response?.headers.getSetCookie()).toHaveLength(2);
    expect(response?.headers.getSetCookie()[1]).toContain("HttpOnly");
  });

  it("executes the compiled command maintenance guard without database access", async () => {
    const database = new SnapshotLegacyDatabase();
    const response = await runLegacyPageResponse("/command.php", new Request("https://game.test/command.php", {
      method: "POST", body: "command=maintain"
    }), { database, tablePrefix: "acbra2_" });
    expect(response?.status).toBe(403);
    expect(await response?.text()).toBe("Forbidden");
    expect(database.issued).toEqual([]);
  });
  it("writes preg_match_all captures through the runtime builtin fallback", () => {
    const runtime = createLegacyModuleRuntime();
    const result = runtime.runPageScript(parseModuleFile(`<?php
      preg_match_all('/([a-z]+)/', 'one two', $matches);
      echo count($matches[1]); echo ':'; echo $matches[1][1];
    `));
    expect(result.output).toBe("2:two");
  });

  it("keeps cookies, redirect and body when PHP exits", () => {
    const response = new LegacyHttpResponse();
    const runtime = createLegacyModuleRuntime({ functions: response.functions() });
    const result = runtime.runPageScript(parseModuleFile(`<?php
      setcookie('acbra2_user', '玩家 one', 0, '/', '', true, false);
      setcookie('acbra2_pass', 'token', 0, '/', '', true, true);
      header('Location: index.php');
      echo 'saved'; exit(); echo 'unreachable';
    `));
    expect(result.output).toBe("saved");
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("index.php");
    expect(response.headers.getSetCookie()).toEqual([
      "acbra2_user=%E7%8E%A9%E5%AE%B6+one; Path=/; Secure",
      "acbra2_pass=token; Path=/; Secure; HttpOnly"
    ]);
    expect(new LegacyHttpResponse().headers.getSetCookie()).toEqual([]);
  });

  it("returns a forbidden status set by the original maintenance guard", () => {
    const response = new LegacyHttpResponse();
    const runtime = createLegacyModuleRuntime({ functions: response.functions() });
    const result = runtime.runPageScript(parseModuleFile("<?php http_response_code(403); exit('Forbidden');"));
    expect(response.status).toBe(403);
    expect(result.output).toBe("Forbidden");
  });
});
