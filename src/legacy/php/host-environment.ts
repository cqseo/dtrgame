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
/**
 * The modification time reported for the compiled-in templates.
 *
 * Any fixed value in the past works; this one is the date the templates
 * were captured, so it reads as what it is rather than as a magic number.
 */
const TEMPLATE_MTIME = 1761782400;

export function createFilesystemFunctions(): Map<string, HostFunction> {
  const functions = new Map<string, HostFunction>();
  const refuse = (name: string): HostFunction => () => {
    throw new Error(
      `${name}() touches the filesystem, which a Worker does not have. Give it a ` +
        "real implementation over Durable Object storage before using the path " +
        "that calls it."
    );
  };
  for (const name of ["writeover", "openfile", "gdir", "touch", "unlink"]) {
    functions.set(name, refuse(name));
  }

  /*
   * filemtime is answerable, and answering it is not pretending.
   *
   * The original calls it to decide whether a compiled template is older
   * than its source. Here the templates are compiled into the Worker, so
   * they genuinely cannot change between requests, and a fixed timestamp
   * is the truthful answer rather than a convenient one. It is the build
   * itself that changes them, and a build is a new Worker.
   *
   * The value is a constant rather than the current time: returning
   * "now" would make every comparison say the source is newer and send
   * the original into recompiling on every request.
   */
  functions.set("filemtime", () => TEMPLATE_MTIME);

  /*
   * debug_backtrace returns an empty stack.
   *
   * The original calls it only from its error reporting, to say where a
   * warning came from. The interpreter does not keep PHP-level frames,
   * so there is no stack to give; an empty array is what PHP itself
   * returns when there is nothing above the current frame. The effect is
   * a thinner admin-facing error trace, and no change to anything a
   * player sees.
   */
  functions.set("debug_backtrace", () => new PhpArray());
  functions.set("debug_print_backtrace", () => null);
  // file_exists is answerable: nothing this port writes exists on a disk.
  functions.set("file_exists", () => false);
  return functions;
}

/**
 * The constants include/common.inc.php defines before any module runs.
 *
 * curscript is null when a page script is about to run: every page opens
 * with its own define('CURSCRIPT', ...), and a constant that is already
 * set cannot be redefined, so presetting it would make every page think
 * it was some other page.
 */
export function createHostConstants(curscript: string | null): Map<string, PhpValue> {
  const constants = new Map<string, PhpValue>([
    ["IN_GAME", true],
    ["GAME_ROOT", GAME_ROOT],
    ["TPLDIR", "./templates/default"],
    ["STYLEID", "1"],
    ["TEMPLATEID", "1"],

    // PHP's own constants, with PHP's values. These are not choices: the
    // original reads them because the interpreter defines them, so the
    // port defines them the same way. The set is the one an inventory of
    // the captured source shows it actually references.
    ["PATHINFO_DIRNAME", 1],
    ["PATHINFO_BASENAME", 2],
    ["PATHINFO_EXTENSION", 4],
    ["PATHINFO_FILENAME", 8],
    ["FILE_APPEND", 8],
    ["FILE_IGNORE_NEW_LINES", 2],
    ["FILE_SKIP_EMPTY_LINES", 4],
    ["LOCK_SH", 1],
    ["LOCK_EX", 2],
    ["LOCK_UN", 3],
    ["ENT_COMPAT", 3],
    ["ENT_QUOTES", 11],
    ["JSON_PRETTY_PRINT", 128],
    ["JSON_UNESCAPED_SLASHES", 64],
    ["JSON_UNESCAPED_UNICODE", 256],
    ["PREG_PATTERN_ORDER", 1],
    ["PREG_SET_ORDER", 2],
    ["PREG_OFFSET_CAPTURE", 256],
    ["MYSQLI_ASSOC", 1],
    ["MYSQLI_NUM", 2],
    ["MYSQLI_BOTH", 3],
    ["MYSQLI_REPORT_OFF", 0],
    ["SORT_REGULAR", 0],
    ["SORT_NUMERIC", 1],
    ["SORT_STRING", 2],
    ["COUNT_NORMAL", 0],
    ["COUNT_RECURSIVE", 1],
    ["STR_PAD_RIGHT", 1],
    ["STR_PAD_LEFT", 0],
    ["STR_PAD_BOTH", 2],
    ["M_PI", Math.PI],
    ["PHP_EOL", "\n"],
    ["PHP_INT_MAX", 9223372036854775807],
    ["PHP_INT_MIN", -9223372036854775808],
    ["PHP_INT_SIZE", 8],
    ["E_ALL", 32767],
    ["E_ERROR", 1],
    ["E_WARNING", 2],
    ["E_NOTICE", 8],
    ["E_STRICT", 2048],
    ["E_DEPRECATED", 8192],
    ["E_USER_DEPRECATED", 16384],
    ["E_RECOVERABLE_ERROR", 4096],

    // The interpreter the original runs on, reported as it reports
    // itself, because the source compares against it.
    ["PHP_VERSION", "8.2.35"],
    ["PHP_VERSION_ID", 80235],
    // Not CLI: the original takes a different branch for the command
    // line, and a Worker is serving a request.
    ["PHP_SAPI", "cgi-fcgi"],
    ["PHP_SELF", ""],
    ["PHP_NORMAL_READ", 1],

    /*
     * The magic constants, which the original passes to gexit() to build
     * an error trace: gexit($_ERROR['x'], __file__, __line__).
     *
     * PHP substitutes these per file and per line. The port does not
     * track either through the compiled ASTs, so an error raised here
     * names the game root and line 0 where the original would name the
     * file and the line. That is a difference in an admin-facing error
     * trace only -- the message itself, which is what a player sees, is
     * the original's. Making them exact means carrying positions through
     * the parser, which is worth doing if these ever reach a player.
     *
     * PHP matches these case-insensitively, and the original writes them
     * lowercase, so both spellings are defined.
     */
    ["__FILE__", GAME_ROOT],
    ["__file__", GAME_ROOT],
    ["__LINE__", 0],
    ["__line__", 0],
    ["__DIR__", GAME_ROOT],
    ["__dir__", GAME_ROOT],
    ["__FUNCTION__", ""],
    ["__CLASS__", ""],
    ["__METHOD__", ""]
  ]);
  if (curscript !== null) constants.set("CURSCRIPT", curscript);
  return constants;
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
