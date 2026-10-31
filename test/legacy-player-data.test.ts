import { describe, expect, it } from "vitest";
import { createLegacyModuleRuntime } from "../src/legacy/php/compiled-modules";
import { InMemoryLegacyDatabase } from "../src/legacy/php/database";
import { PhpArray } from "../src/legacy/template/values";

/**
 * Reads and writes a player through the original's own code.
 *
 * fetch_udata_by_username() and update_udata_multilist() are not module
 * functions; they live in include/user.func.php in the global namespace,
 * and module code calls them unqualified. They are compiled like anything
 * else rather than hand-written, so what runs here is the original's.
 *
 * Everything a logged-in page does starts with one of these, so they are
 * what stands between the tick working and a player being able to act.
 */
const row = (fields: Record<string, string>): PhpArray => {
  const array = new PhpArray();
  for (const [key, value] of Object.entries(fields)) array.set(key, value);
  return array;
};

const PLAYER = {
  username: "paritybot",
  password: "x",
  name: "测试员",
  hp: "100",
  sp: "80",
  pls: "5",
  gold: "120",
  credits: "40"
};

function runtimeWithPlayers(players: Record<string, string>[] = [PLAYER]) {
  const database = new InMemoryLegacyDatabase({
    acbra2_users: players.map(row),
    acbra2_game: []
  });
  const runtime = createLegacyModuleRuntime({ database });
  runtime.store.set("sys", "gtablepre", "acbra2_");
  runtime.store.set("sys", "room_id", "0");
  return { runtime, database };
}

describe("player data, through the original's own accessors", () => {
  it("reads one player by name", () => {
    const { runtime } = runtimeWithPlayers();
    const found = runtime.call("fetch_udata_by_username", ["paritybot"]);
    expect(found).toBeInstanceOf(PhpArray);
    expect((found as PhpArray).get("name")).toBe("测试员");
    expect((found as PhpArray).get("hp")).toBe("100");
  });

  it("returns null for someone who is not there, as the original does", () => {
    // fetch_udata_by_username returns NULL rather than an empty array, and
    // callers test it with empty(), so the distinction matters.
    const { runtime } = runtimeWithPlayers();
    expect(runtime.call("fetch_udata_by_username", ["nobody"])).toBeNull();
  });

  it("reads several players at once, keyed by name", () => {
    const second = { ...PLAYER, username: "other", name: "另一个" };
    const { runtime } = runtimeWithPlayers([PLAYER, second]);
    const list = new PhpArray();
    list.push("paritybot");
    list.push("other");
    const where = new PhpArray();
    where.set("username", list);

    const found = runtime.call("fetch_udata_multilist", ["*", where]);
    expect(found).toBeInstanceOf(PhpArray);
    expect((found as PhpArray).keys().length).toBe(2);
  });

  it("asks for only the columns it was given", () => {
    const { runtime, database } = runtimeWithPlayers();
    runtime.call("fetch_udata_by_username", ["paritybot", "hp,sp"]);
    const selects = database.issued.filter(statement => statement.sql.startsWith("SELECT"));
    expect(selects.at(-1)?.sql).toContain("hp,sp");
    expect(selects.at(-1)?.sql).not.toContain("SELECT *");
  });
});
