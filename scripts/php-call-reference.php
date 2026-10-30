<?php
/**
 * Calls any function in the original and reports what it returned and what
 * it changed.
 *
 * Until now each area needed its own oracle script, which made the fixed
 * cost of porting a handful of functions larger than the porting itself.
 * There are 5,235 hook implementations left, so that overhead is the thing
 * worth removing: with this, adding a function to the differential harness
 * is a few lines in a case table rather than a new PHP file.
 *
 * Original functions mostly communicate through globals rather than
 * arguments, so a case can seed globals before the call and name the ones to
 * read back afterwards. Both sides of the comparison then see the same
 * inputs and the same effects, not just the return value.
 *
 * stdin:
 * {
 *   "root": "/path/to/instance",
 *   "bootstrap": "core" | "full",      // LOAD_CORE_ONLY, or every module
 *   "require": ["include/roommng/roommng.func.php"],
 *   "define": {"MOD_SKILL20": true},
 *   "calls": [
 *     {
 *       "fn": "room_prefix2id" | "\\map\\get_area_interval",
 *       "args": [..],
 *       "globals": {"now": 1793000000},   // seeded before the call
 *       "read": ["sdata", "log"]          // globals read back after
 *     }
 *   ]
 * }
 *
 * Each result is {ok, value, type, globals?} or {ok:false, error}.
 */
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_DEPRECATED);

$input = json_decode(stream_get_contents(STDIN), true);
if (!is_array($input)) {
    fwrite(STDERR, "expected JSON on stdin\n");
    exit(1);
}

$root = rtrim($input['root'] ?? '', '/');
if (!is_dir($root)) {
    fwrite(STDERR, "root not found: $root\n");
    exit(1);
}

chdir($root);

define('IN_GAME', true);
define('GAME_ROOT', $root . '/');
define('CURSCRIPT', $input['curscript'] ?? 'index');
if (($input['bootstrap'] ?? 'core') === 'core') {
    define('LOAD_CORE_ONLY', true);
}

// Constants the case wants in place before anything loads, so a module gate
// such as defined('MOD_SKILL20') answers the way the case intends.
foreach (($input['define'] ?? []) as $name => $value) {
    if (!defined($name)) define($name, $value);
}

require GAME_ROOT . './include/common.inc.php';

// Files the entry script pulls in separately; common.inc.php does not load
// every helper the pages use.
foreach (($input['require'] ?? []) as $relative) {
    $file = GAME_ROOT . './' . ltrim($relative, '/');
    if (is_file($file)) require_once $file;
}

/** Resolves a plain or namespaced name to something callable. */
function dts_resolve($name) {
    $candidate = ltrim($name, '\\');
    if (function_exists($candidate)) return $candidate;
    if (function_exists('\\' . $candidate)) return '\\' . $candidate;
    return null;
}

$results = [];
foreach (($input['calls'] ?? []) as $call) {
    $name = $call['fn'] ?? '';
    $callable = dts_resolve($name);
    if ($callable === null) {
        $results[] = ['ok' => false, 'error' => "undefined function $name"];
        continue;
    }

    foreach (($call['globals'] ?? []) as $variable => $value) {
        $GLOBALS[$variable] = $value;
    }

    try {
        $value = call_user_func_array($callable, $call['args'] ?? []);
        $entry = ['ok' => true, 'value' => $value, 'type' => gettype($value)];
        if (!empty($call['read'])) {
            $after = [];
            foreach ($call['read'] as $variable) {
                $after[$variable] = $GLOBALS[$variable] ?? null;
            }
            $entry['globals'] = $after;
        }
        $results[] = $entry;
    } catch (\Throwable $error) {
        $results[] = ['ok' => false, 'error' => $error->getMessage()];
    }
}

echo json_encode($results, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
