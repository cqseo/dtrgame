<?php
/**
 * Dumps every module variable the original defines, after a full load.
 *
 * The original keeps each module's configuration in
 * include/modules/<path>/config/*.config.php — 139 files and about 1.7MB of
 * the numbers the contract forbids changing: item stats, drop tables, map
 * areas, skill costs, cooldowns. Hand-copying those into TypeScript is both
 * the slowest remaining work and the easiest place to introduce a silent
 * value change.
 *
 * So PHP does the reading. After include/common.inc.php has loaded all the
 * modules, every module variable exists as a global named
 * ___LOCAL_<MODULE>__VARS__<name>, already past every include, default and
 * per-module override in the original's own load order. Dumping those
 * globals captures the values as the running game sees them, which no
 * re-implementation of the config loader could guarantee.
 *
 * stdin:  {"root": "/path/to/instance"}
 * stdout: {"modules": {"cooldown": {"movecoldtime": 650, ...}, ...},
 *          "skipped": ["<module>.<name>", ...]}
 *
 * `skipped` names variables withheld rather than silently dropped, so the
 * generator can fail loudly instead of emitting a thinner table than the
 * original has.
 */
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_DEPRECATED);

$input = json_decode(stream_get_contents(STDIN), true);
$root = rtrim($input['root'] ?? '', '/');
if (!is_dir($root)) {
    fwrite(STDERR, "root not found: $root\n");
    exit(1);
}

chdir($root);
define('IN_GAME', true);
define('GAME_ROOT', $root . '/');
define('CURSCRIPT', 'index');

require GAME_ROOT . './include/common.inc.php';

/**
 * Credentials must never reach the repository. Module configs hold game
 * data rather than secrets, but this dump is mechanical and the repository
 * is public, so anything credential-shaped is withheld and reported.
 */
function looks_like_secret($module, $name) {
    // Game data the pattern below would otherwise catch. Each is named with
    // its reason: removing an entry drops real content the contract forbids
    // changing, so none of these may be deleted without checking the source.
    $ALLOW = [
        // The item hotkey layout: array(4=>'qq', 5=>'ww', ...). "key" as in
        // keyboard.
        'itemmain.item_hotkey_id_list',
        // The 124-column player schema and its column types, which every
        // read and write of a player goes through. Caught by /^db/.
        'player.db_player_structure',
        'player.db_player_structure_types',
        // Skill trigger words and ids: '「巨大灯泡」', '挑战者', a weather
        // list. "key" as in keyword.
        'skill505.skill505_keyitm',
        'skill558.skill558_keyword',
        'skill588.sk588_wthkey_list',
    ];
    if (in_array("$module.$name", $ALLOW, true)) return false;

    $DENY = ['dbhost', 'dbuser', 'dbpw', 'dbname', 'gtablepre', 'server_address'];
    if (in_array(strtolower($name), $DENY, true)) return true;
    return (bool) preg_match('/pass|pwd|secret|key|token|salt|auth|sign|^db/i', $name);
}

/**
 * Values are reported in a shape that survives JSON without losing what PHP
 * meant. PHP arrays are ordered maps, so a list and a map must stay
 * distinguishable; the generator rebuilds a PhpArray from this.
 */
function encode_value($value, $depth = 0) {
    if ($depth > 24) return ['t' => 'deep'];
    if (is_array($value)) {
        $entries = [];
        foreach ($value as $key => $item) {
            $entries[] = [is_int($key) ? $key : (string) $key, encode_value($item, $depth + 1)];
        }
        return ['t' => 'array', 'v' => $entries];
    }
    if (is_bool($value)) return ['t' => 'bool', 'v' => $value];
    if (is_int($value)) return ['t' => 'int', 'v' => $value];
    if (is_float($value)) {
        // JSON has no NAN or INF, and a float that is integral must not come
        // back as an int or arithmetic downstream would differ.
        if (!is_finite($value)) return ['t' => 'float', 'v' => (string) $value];
        return ['t' => 'float', 'v' => $value];
    }
    if (is_null($value)) return ['t' => 'null'];
    if (is_string($value)) return ['t' => 'string', 'v' => $value];
    // Closures and objects are code, not data; they are ported by hand.
    if (is_object($value)) return ['t' => 'object', 'v' => get_class($value)];
    return ['t' => 'other', 'v' => gettype($value)];
}

$modules = [];
$skipped = [];
foreach ($GLOBALS as $global => $value) {
    if (!preg_match('/^___LOCAL_(.+)__VARS__(.+)$/', $global, $m)) continue;
    $module = strtolower($m[1]);
    $name = $m[2];
    if (looks_like_secret($module, $name)) {
        $skipped[] = "$module.$name";
        continue;
    }
    if (!isset($modules[$module])) $modules[$module] = [];
    $modules[$module][$name] = encode_value($value);
}

ksort($modules);
foreach ($modules as &$vars) ksort($vars);
unset($vars);
sort($skipped);

echo json_encode(
    ['modules' => $modules, 'skipped' => $skipped],
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);
