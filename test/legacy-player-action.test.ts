import { describe, expect, it } from "vitest";
import { LEGACY_TABLES } from "../src/generated/legacy-tables";
import { createLegacyModuleRuntime } from "../src/legacy/php/compiled-modules";
import { InMemoryLegacyDatabase } from "../src/legacy/php/database";
import { PhpArray } from "../src/legacy/template/values";

/**
 * A whole player action, through the original's own code.
 *
 * command_act.php has no switch of commands. Move, search, combat and
 * items are all hook implementations of \player\act(), so what that file
 * does is call seven functions in order and let dispatch find the rest:
 *
 *   \player\load_playerdata(\player\fetch_playerdata($cuser));
 *   \player\post_load_profile_event();
 *   \player\init_playerdata();
 *   \player\pre_act();
 *   if ($gamestate >= 20 && $hp > 0 && $state <= 3) \player\act();
 *   \player\post_act();
 *
 * That makes this sequence the real measure of whether the port can run
 * the game, rather than any count of ported functions: every one of
 * those calls enters a hook chain that reaches across the 735 modules,
 * and a chain that touches anything missing raises rather than guessing.
 *
 * The database starts empty but complete -- every table the original
 * has, created from the generated schema -- which is the arrangement
 * asked for: get it running on an empty database and migrate the live
 * data afterwards.
 */
const row = (fields: Record<string, string>): PhpArray => {
  const array = new PhpArray();
  for (const [key, value] of Object.entries(fields)) array.set(key, value);
  return array;
};

function emptyDatabase(): Record<string, PhpArray[]> {
  const tables: Record<string, PhpArray[]> = {};
  for (const name of LEGACY_TABLES) tables[name] = [];
  return tables;
}

function seatedPlayer() {
  const tables = emptyDatabase();
  tables["acbra2_users"] = [
    row({ uid: "1", username: "paritybot", password: "x", roomid: "0", groupid: "1" })
  ];
  tables["acbra2_players"] = [
    row({
      pid: "1", type: "0", name: "paritybot", pass: "x", hp: "100", mhp: "100",
      sp: "80", pls: "5", state: "0", gd: "m"
    })
  ];
  tables["acbra2_game"] = [
    row({ groomid: "0", gamestate: "20", gamenum: "1", alivenum: "1", validnum: "1" })
  ];

  const database = new InMemoryLegacyDatabase(tables);
  const runtime = createLegacyModuleRuntime({ database });
  runtime.store.set("sys", "gtablepre", "acbra2_");
  runtime.store.set("sys", "tablepre", "acbra2_");
  runtime.store.set("sys", "room_id", "0");
  runtime.store.set("sys", "cuser", "paritybot");
  runtime.store.set("sys", "cpass", "x");
  runtime.store.set("sys", "now", String(Math.floor(Date.now() / 1000)));
  return { runtime, database };
}

describe("a player action, end to end through command_act.php's sequence", () => {
  it("runs every step without reaching anything unported", () => {
    const { runtime } = seatedPlayer();

    const profile = runtime.call("player\\fetch_playerdata", ["paritybot"]);
    expect(profile).toBeInstanceOf(PhpArray);

    // Each of these dispatches into a hook chain. Reaching a module that
    // was not compiled raises LegacyFunctionNotCompiled naming it, and an
    // unported builtin raises naming that, so "did not throw" is a real
    // statement about coverage rather than about these seven functions.
    expect(() => {
      runtime.call("player\\load_playerdata", [profile]);
      runtime.call("player\\post_load_profile_event", []);
      runtime.call("player\\init_playerdata", []);
      runtime.call("player\\pre_act", []);
      runtime.call("player\\act", []);
      runtime.call("player\\post_act", []);
    }).not.toThrow();
  });

  it("loads the player's own row rather than inventing one", () => {
    const { runtime } = seatedPlayer();
    const profile = runtime.call("player\\fetch_playerdata", ["paritybot"]);
    expect((profile as PhpArray).get("name")).toBe("paritybot");
    expect((profile as PhpArray).get("hp")).toBe("100");
  });

  it("reads and writes through the database rather than around it", () => {
    const { runtime, database } = seatedPlayer();
    const profile = runtime.call("player\\fetch_playerdata", ["paritybot"]);
    runtime.call("player\\load_playerdata", [profile]);
    runtime.call("player\\init_playerdata", []);
    runtime.call("player\\pre_act", []);
    expect(database.issued.length).toBeGreaterThan(1);
  });
});
