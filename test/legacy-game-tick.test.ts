import { describe, expect, it } from "vitest";
import { COMPILED_MODULE_NAMES, createLegacyModuleRuntime } from "../src/legacy/php/compiled-modules";
import { InMemoryLegacyDatabase } from "../src/legacy/php/database";
import { PhpArray } from "../src/legacy/template/values";

/**
 * Runs a whole game tick through the original's own code.
 *
 * sys\routine() is the engine: process_lock, load_gameinfo, updategame,
 * save_gameinfo, process_unlock. Everything the game does to a room on a
 * request goes through it, and reaching it transitively needs 282 modules
 * because a hook is all-or-nothing — dispatch enters at the newest
 * implementation and walks back through $chprocess, so every
 * implementation on a chain has to be there.
 *
 * This is a smoke test, not a parity test. It proves the tick runs on
 * compiled original code rather than refusing partway; whether each
 * module computes what the original computes is what the PHP oracle
 * suites are for.
 */
const row = (fields: Record<string, string>): PhpArray => {
  const array = new PhpArray();
  for (const [key, value] of Object.entries(fields)) array.set(key, value);
  return array;
};

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

function tickRuntime() {
  const database = new InMemoryLegacyDatabase({ dts_game: [row(GAME_ROW)] });
  const runtime = createLegacyModuleRuntime({ database });
  runtime.store.set("sys", "gtablepre", "dts_");
  runtime.store.set("sys", "room_id", "0");
  return { runtime, database };
}

describe("a game tick", () => {
  it("runs sys\\routine end to end on the original's compiled code", () => {
    const { runtime } = tickRuntime();
    expect(() => runtime.call("sys\\routine")).not.toThrow();
  });

  it("has every module the tick dispatches through", () => {
    // If one were missing, the call above would raise
    // LegacyFunctionNotCompiled rather than silently running an older
    // implementation, so this is really a check that the generator's
    // closure and the runtime agree.
    const { runtime } = tickRuntime();
    expect(COMPILED_MODULE_NAMES.length).toBeGreaterThanOrEqual(286);
    expect(runtime.registered().length).toBeGreaterThanOrEqual(3000);
    for (const required of ["sys", "map", "gameflow_base", "gameflow_combo", "noise"]) {
      expect(COMPILED_MODULE_NAMES).toContain(required);
    }
  });

  it("reads the room's row and writes it back", () => {
    const { runtime, database } = tickRuntime();
    runtime.call("sys\\routine");

    const selects = database.issued.filter(statement => statement.sql.startsWith("SELECT"));
    const updates = database.issued.filter(statement => statement.sql.startsWith("UPDATE"));
    expect(selects.length).toBeGreaterThanOrEqual(1);
    expect(updates.length).toBeGreaterThanOrEqual(1);
    // save_gameinfo_prepare_work drops the room columns by default, so a
    // tick cannot clobber a concurrent change to the room itself.
    for (const update of updates) {
      expect(update.sql).not.toContain("groomstatus =");
    }
  });

  it("leaves the room's own identity alone", () => {
    const { runtime, database } = tickRuntime();
    runtime.call("sys\\routine");
    const stored = database.tables.get("dts_game")?.[0];
    expect(stored?.get("groomid")).toBe("0");
    expect(stored?.get("groomtype")).toBe("0");
  });
});
