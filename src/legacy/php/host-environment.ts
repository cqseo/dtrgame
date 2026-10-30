/**
 * The parts of the original's environment that are not module code.
 *
 * Everything here is a global the original defines outside its modules —
 * in include/global.func.php or in a page script — which module code then
 * calls. They are provided rather than compiled because their bodies are
 * about the host, not about the game: files, locks, paths.
 *
 * Each one has to be justified, because this is exactly where a port
 * drifts. The rule applied: reproduce the original's *behaviour*, and say
 * so when the mechanism differs because the platform differs.
 */
import type { HostFunction } from "../template/builtins";
import { PhpArray, type PhpValue } from "../template/values";

/**
 * The original computes GAME_ROOT from __FILE__ and uses it to build
 * filesystem paths. A Worker has no filesystem, and the paths that survive
 * are only ever handed to the lock helpers below, which do not touch one
 * either. The value is kept so that concatenation produces the same
 * strings the original would log or compare.
 */
export const GAME_ROOT = "/";

/**
 * The file lock the original takes around each room's turn.
 *
 * sys\process_lock() polls for gamedata/tmp/processlock/process_<room>.nlk
 * and waits up to ten seconds for whoever holds it, so that two requests
 * for the same room cannot update the game row at once.
 *
 * On Cloudflare the room's Durable Object already guarantees that: every
 * request for a room is handled by one object, one at a time. The
 * invariant the lock exists to enforce therefore already holds before any
 * of this code runs, and a request never finds the lock held.
 *
 * This is a change of mechanism, not of behaviour, and it is the only one
 * of its kind so far. It is safe only while every caller of a room's game
 * row goes through that room's Durable Object; if anything ever updates a
 * game row from outside one, this stops being true and the lock has to
 * come back as something real, such as a row in the database.
 */
export function createLockFunctions(): Map<string, HostFunction> {
  const functions = new Map<string, HostFunction>();

  // Never contended: the Durable Object serialises the room already.
  functions.set("check_lock", () => false);
  // The original returns the handle it opened; nothing reads it.
  functions.set("create_lock", () => true);
  functions.set("release_lock", () => true);

  return functions;
}

/**
 * Filesystem helpers the original uses for its own caches.
 *
 * These refuse rather than pretending to succeed. A port that quietly
 * returned "written" would lose data the original kept, and one that
 * quietly returned "missing" would make the original rebuild a cache on
 * every request. Both are wrong in ways that would not show up as an
 * error, so the ones that are actually needed must be given a real
 * implementation over the platform's storage when the time comes.
 */
export function createFilesystemFunctions(): Map<string, HostFunction> {
  const functions = new Map<string, HostFunction>();
  const refuse = (name: string): HostFunction => () => {
    throw new Error(
      `${name}() touches the filesystem, which a Worker does not have. Give it a ` +
        "real implementation over Durable Object storage before using the path " +
        "that calls it."
    );
  };
  for (const name of ["writeover", "openfile", "gdir", "touch", "unlink", "filemtime"]) {
    functions.set(name, refuse(name));
  }
  // file_exists is answerable: nothing this port writes exists on a disk.
  functions.set("file_exists", () => false);
  return functions;
}

/** The constants include/common.inc.php defines before any module runs. */
export function createHostConstants(curscript: string): Map<string, PhpValue> {
  return new Map<string, PhpValue>([
    ["IN_GAME", true],
    ["GAME_ROOT", GAME_ROOT],
    ["CURSCRIPT", curscript],
    ["TPLDIR", "./templates/default"],
    ["STYLEID", "1"],
    ["TEMPLATEID", "1"]
  ]);
}

/** Everything above, as one map. */
export function createHostFunctions(): Map<string, HostFunction> {
  return new Map<string, HostFunction>([
    ...createLockFunctions(),
    ...createFilesystemFunctions()
  ]);
}

/** Kept for callers that want an empty array without importing PhpArray. */
export const emptyArray = (): PhpValue => new PhpArray();
