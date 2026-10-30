import { describe, expect, it } from "vitest";
import { applyOriginalRouting } from "../src/original-routing";

/**
 * Edge cases of the original's routing contract that the captured fixtures do
 * not each cover individually. nginx resolves `=` before `^~` before regular
 * expressions, and getting that order wrong silently changes which paths the
 * browser can reach.
 */
describe("original edge routing", () => {
  const status = (path: string, method = "GET") => applyOriginalRouting(path, method)?.status ?? null;

  it("retires the installer and refuses the installer directory", () => {
    expect(status("/install_NEW.php")).toBe(410);
    expect(status("/install/")).toBe(403);
    expect(status("/install/bra.install.sql")).toBe(403);
  });

  it("allows command.php only by POST", () => {
    expect(status("/command.php", "POST")).toBeNull();
    expect(status("/command.php", "GET")).toBe(403);
    expect(status("/command.php", "HEAD")).toBe(403);
    expect(status("/command.php", "PUT")).toBe(403);
  });

  it("keeps the other original endpoints open to any method", () => {
    expect(status("/roomcmd.php", "POST")).toBeNull();
    expect(status("/roomupdate.php", "GET")).toBeNull();
    expect(status("/index.php", "GET")).toBeNull();
  });

  it("exposes the shipped client but nothing else under /include/", () => {
    expect(status("/include/javascript/game.20240318.js")).toBeNull();
    expect(status("/include/javascript/common.20240301.js")).toBeNull();
    expect(status("/include/javascript/notes.php")).toBe(403);
    expect(status("/include/common.inc.php")).toBe(403);
    expect(status("/include/db/db_mysqli.class.php")).toBe(403);
  });

  it("exposes stylesheets but nothing else under /gamedata/", () => {
    expect(status("/gamedata/css/style.css")).toBeNull();
    expect(status("/gamedata/css/evil.php")).toBe(403);
    expect(status("/gamedata/modules.list.php")).toBe(403);
    expect(status("/gamedata/replays/1.txt")).toBe(403);
  });

  it("refuses dotted paths and the retired extension list anywhere", () => {
    expect(status("/.git/config")).toBe(403);
    expect(status("/.env")).toBe(403);
    expect(status("/docker-compose.yml")).toBe(403);
    expect(status("/backup.sql")).toBe(403);
    expect(status("/README.md")).toBe(403);
    // Not on the list, so the application still decides.
    expect(status("/log.txt")).toBeNull();
  });

  it("keeps the loopback-only maintenance scripts away from the browser", () => {
    for (const script of [
      "/modulemng.php",
      "/modulemng_activate.php",
      "/daemonmng.php",
      "/gencode_transformer.php",
      "/tools_users_card_reissue.php",
      "/tools_users_table_alter.php"
    ]) {
      expect(status(script), script).toBe(403);
    }
  });

  it("answers refusals with the original's own error pages", async () => {
    const forbidden = applyOriginalRouting("/gamedata/modules.list.php", "GET")!;
    expect(forbidden.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(await forbidden.text()).toBe(
      "<html>\r\n<head><title>403 Forbidden</title></head>\r\n<body>\r\n" +
        "<center><h1>403 Forbidden</h1></center>\r\n<hr><center>nginx</center>\r\n</body>\r\n</html>\r\n"
    );
    const gone = applyOriginalRouting("/install_NEW.php", "GET")!;
    expect(await gone.text()).toBe(
      "<html>\r\n<head><title>410 Gone</title></head>\r\n<body>\r\n" +
        "<center><h1>410 Gone</h1></center>\r\n<hr><center>nginx</center>\r\n</body>\r\n</html>\r\n"
    );
  });
});
