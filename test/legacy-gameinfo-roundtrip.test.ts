import { describe, expect, it } from "vitest";
import { InMemoryLegacyDatabase, LegacyQueryResult } from "../src/legacy/php/database";
import { createLegacyModuleRuntime } from "../src/legacy/php/compiled-modules";
import { PhpArray, type PhpValue } from "../src/legacy/template/values";

/**
 * Runs the original's own load_gameinfo() and save_gameinfo().
 *
 * This is the tick's entire database surface: one SELECT from the game
 * table on the way in, one array_update() on the way out. Both are the
 * original's compiled code, not a re-implementation, so what is being
 * checked is that the runtime can carry a row into module variables and
 * carry the changes back out.
 *
 * The interesting part is load_gameinfo's last line:
 *
 *     foreach ($gameinfo as $key => $value) ${$key} = $value;
 *
 * a variable variable assigned inside a function whose scope was aliased
 * to the sys module by eval(import_module('sys')). Every column of the row
 * therefore has to land in the sys module's variables, which is where the
 * rest of the game reads them from.
 */
const row = (fields: Record<string, string | number>): PhpArray => {
  const array = new PhpArray();
  for (const [key, value] of Object.entries(fields)) array.set(key, value);
  return array;
};

/** A game row shaped like the original's, including its encoded columns. */
const GAME_ROW = {
  groomid: "0",
  gamenum: "41",
  gamestate: "1",
  alivenum: "7",
  deathnum: "2",
  afktime: "1762000000",
  hdamage: "120",
  hplayer: "someone",
  arealist: "1,2,3,5,8",
  noisevars: "",
  roomvars: "",
  gamevars: "",
  groomtype: "0",
  groomstatus: "40"
};

function runtimeWithGame() {
  const database = new InMemoryLegacyDatabase({ dts_game: [row(GAME_ROW)] });
  const runtime = createLegacyModuleRuntime({ database });
  // $gtablepre and $room_id come from the request in the original; the
  // generated table withholds the prefix as credential-shaped, so the test
  // supplies both the way sys/init.php would.
  runtime.store.set("sys", "gtablepre", "dts_");
  runtime.store.set("sys", "room_id", "0");
  return { runtime, database };
}

describe("the game row, through the original's own code", () => {
  it("loads every column into the sys module's variables", () => {
    const { runtime } = runtimeWithGame();
    runtime.call("sys\\load_gameinfo");

    // Straight columns.
    expect(runtime.store.get("sys", "gamenum")).toBe("41");
    expect(runtime.store.get("sys", "alivenum")).toBe("7");
    expect(runtime.store.get("sys", "hplayer")).toBe("someone");

    // load_gameinfo_post_work_core() splits arealist on the way in, so the
    // rest of the game sees a list rather than the stored string.
    const areas = runtime.store.get("sys", "arealist");
    expect(areas).toBeInstanceOf(PhpArray);
    expect((areas as PhpArray).values()).toEqual(["1", "2", "3", "5", "8"]);
  });

  // The save path is blocked on one thing only: noise fills noisevars, so
  // save_gameinfo_prepare_work calls gencode(), which is
  // base64(gzip(json)). The Worker's CompressionStream is async and this
  // interpreter is synchronous, so a synchronous gzip has to land first.
  // These are written against the behaviour they must have, and skipped
  // until it does, rather than being weakened to pass.
  it.skip("writes back only what changed, as array_update does", () => {
    const { runtime, database } = runtimeWithGame();
    runtime.call("sys\\load_gameinfo");

    // One player dies: the game's own numbers move.
    runtime.store.set("sys", "alivenum", 6);
    runtime.store.set("sys", "deathnum", 3);
    runtime.call("sys\\save_gameinfo");

    const updates = database.issued.filter(statement => statement.sql.startsWith("UPDATE"));
    expect(updates).toHaveLength(1);
    const sql = updates[0]?.sql ?? "";
    expect(sql).toContain("alivenum = '6'");
    expect(sql).toContain("deathnum = '3'");

    // save_gameinfo_prepare_work() unsets the room columns by default, so a
    // concurrent change to the room cannot be clobbered by a stale copy.
    expect(sql).not.toContain("groomid =");
    expect(sql).not.toContain("groomtype =");
    expect(sql).not.toContain("groomstatus =");

    // arealist goes back as the joined string it was stored as.
    expect(sql).toContain("arealist = '1,2,3,5,8'");
  });

  it.skip("leaves the stored row holding the new values", () => {
    const { runtime, database } = runtimeWithGame();
    runtime.call("sys\\load_gameinfo");
    runtime.store.set("sys", "alivenum", 6);
    runtime.call("sys\\save_gameinfo");

    const stored = database.tables.get("dts_game")?.[0];
    expect(stored?.get("alivenum")).toBe("6");
    // Untouched columns keep what they had.
    expect(stored?.get("hplayer")).toBe("someone");
  });

  it("refuses to save until a synchronous gzip exists, naming why", () => {
    // Returning an empty array from gdecode, or an empty string from
    // gencode, would read as "this room has no settings" and quietly reset
    // the game's own state. Refusing is the only safe placeholder.
    const { runtime } = runtimeWithGame();
    runtime.call("sys\\load_gameinfo");
    expect(() => runtime.call("sys\\save_gameinfo")).toThrowError(/synchronous gzip/);
  });

  it("refuses a statement it cannot parse rather than guessing", () => {
    // A wrong guess here would be a wrong game state, so the in-memory
    // database is deliberately narrow and loud.
    const database = new InMemoryLegacyDatabase({ dts_game: [] });
    expect(() => database.query("TRUNCATE TABLE dts_game")).toThrowError(/will not guess/);
  });

  it("walks a result one row at a time and stops at the end", () => {
    // Every `while ($row = $db->fetch_array($result))` in the original
    // depends on false ending the loop.
    const database = new InMemoryLegacyDatabase({});
    const result = new LegacyQueryResult([row({ a: "1" }), row({ a: "2" })]);
    const handle = result as unknown as PhpValue;
    expect(database.fetch_array(handle)).toBeInstanceOf(PhpArray);
    expect(database.fetch_array(handle)).toBeInstanceOf(PhpArray);
    expect(database.fetch_array(handle)).toBe(false);
  });
});
