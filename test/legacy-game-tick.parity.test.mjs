import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { createLegacyModuleRuntime } from "../src/legacy/php/compiled-modules";
import { InMemoryLegacyDatabase } from "../src/legacy/php/database";
import { PhpArray } from "../src/legacy/template/values";

/**
 * Compares a whole game tick against the original's.
 *
 * The port runs sys\routine() on 286 compiled modules, but running is not
 * computing the same thing. This drives the original through the same
 * tick, from the same room state, and compares the row afterwards column
 * by column.
 *
 * The original is the source of both sides' input: the PHP side seeds the
 * row, reads it back, runs the tick and reports before and after, and the
 * port is given that exact `before`. So neither side is comparing against
 * a fixture someone typed.
 *
 * Run through `npm run test:php-parity`.
 */
const php = process.env.DTS_PHP_BIN;
const root = process.env.DTS_PHP_ROOT ?? "/opt/dts-sandbox/parity/instance";

function originalTick(seed, now) {
  const stdout = execFileSync(php, ["scripts/php-tick-reference.php"], {
    input: JSON.stringify({ root, roomId: "0", row: seed, now }),
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    timeout: 120000
  });
  return JSON.parse(stdout);
}

/** The port's tick, from the row the original started with. */
function portedTick(before, now, tablepre) {
  const row = new PhpArray();
  for (const [column, value] of Object.entries(before)) {
    if (!Number.isNaN(Number(column))) continue; // mysql_fetch_array's numeric aliases
    row.set(column, value);
  }
  const database = new InMemoryLegacyDatabase({ [`${tablepre}game`]: [row] });
  const runtime = createLegacyModuleRuntime({ database });
  runtime.store.set("sys", "gtablepre", tablepre);
  runtime.store.set("sys", "room_id", "0");
  runtime.store.set("sys", "now", now);
  runtime.call("sys\\routine");

  const after = {};
  const stored = database.tables.get(`${tablepre}game`)[0];
  for (const key of stored.keys()) after[String(key)] = String(stored.get(key) ?? "");
  return after;
}

/**
 * Room states worth ticking.
 *
 * gamestate drives gameflow_base\gamestateupdate: 0 with a start time
 * inside the ready window prepares the game, 10 with the start time
 * reached begins it, and anything else should leave the row alone.
 */
const NOW = 1762000000;
const CASES = [
  {
    name: "an idle room, where a tick should change nothing",
    seed: { gamestate: "1", alivenum: "7", deathnum: "2", starttime: "0" },
    now: NOW
  },
  {
    name: "a room whose start time has not come near yet",
    seed: { gamestate: "0", starttime: String(NOW + 86400), alivenum: "0", deathnum: "0" },
    now: NOW
  },
  {
    name: "a running room",
    seed: { gamestate: "3", starttime: String(NOW - 600), alivenum: "7", deathnum: "2" },
    now: NOW
  }
];

/**
 * Not covered yet: a room inside its ready window.
 *
 * That path calls sys\reset_game(), which reads gamedata/sql/reset.sql off
 * disk and runs it against a dozen tables. The port refuses the file read
 * rather than pretending, and the in-memory database has only the game
 * table, so the case cannot run on this side yet. It is left out rather
 * than weakened, and it is the next thing this suite should gain once the
 * reset path has somewhere real to read and write.
 */

describe.skipIf(!php)("a game tick against the original", () => {
  it.each(CASES)("matches the original for $name", ({ seed, now }) => {
    const reference = originalTick(seed, now);
    expect(reference.ok, reference.error ?? "").toBe(true);

    const ours = portedTick(reference.before, now, reference.tablepre);

    // Compare only the columns the original reports, and as strings,
    // because that is how MySQL hands them back on both sides.
    const differences = [];
    for (const [column, value] of Object.entries(reference.after)) {
      if (!Number.isNaN(Number(column))) continue;
      const mine = ours[column];
      if (mine !== String(value)) {
        differences.push(
          `${column}: ours ${JSON.stringify(mine)} != original ${JSON.stringify(String(value))}` +
            ` (was ${JSON.stringify(String(reference.before[column] ?? ""))})`
        );
      }
    }
    expect(differences).toEqual([]);
  });
});
