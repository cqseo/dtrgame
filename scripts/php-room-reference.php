<?php
/**
 * Evaluates the original's room helpers so the port can be compared against
 * them rather than against a reading of the source.
 *
 * These functions decide which rooms the lobby lists and what each one links
 * to, and they run on PHP's own rules — "0" is falsy, substr counts bytes,
 * the int cast takes a leading numeric prefix. Those are exactly the places a
 * reimplementation drifts, so the answers come from the original.
 *
 * stdin: {"root":..,"cases":[{"fn":"room_prefix_kind","args":[..]}, ..]}
 */
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_DEPRECATED);

$input = json_decode(stream_get_contents(STDIN), true);
if (!is_array($input)) {
    fwrite(STDERR, "expected JSON on stdin\n");
    exit(1);
}

$root = rtrim($input['root'], '/');
chdir($root);

define('IN_GAME', true);
define('GAME_ROOT', $root . '/');
define('CURSCRIPT', 'index');
define('LOAD_CORE_ONLY', true);
require GAME_ROOT . './include/common.inc.php';
// common.inc.php loads room.func.php but not roommng.func.php, which
// index.php requires separately and which owns check_room_available().
require_once GAME_ROOT . './include/roommng/roommng.func.php';

/** check_room_available() reads $now and the MOD_* constants from globals. */
function dts_check_room_available($roomtypedata, $when, $modules) {
    $GLOBALS['now'] = $when;
    foreach ($modules as $name) {
        $constant = 'MOD_' . strtoupper($name);
        if (!defined($constant)) define($constant, true);
    }
    return check_room_available($roomtypedata);
}

$results = [];
foreach ($input['cases'] as $case) {
    $fn = $case['fn'];
    $args = $case['args'] ?? [];
    try {
        switch ($fn) {
            case 'room_prefix_kind':
                $value = room_prefix_kind($args[0]);
                break;
            case 'room_check_subroom':
                $value = room_check_subroom($args[0]);
                break;
            case 'room_prefix2id':
                $value = room_prefix2id($args[0]);
                break;
            case 'room_id2prefix':
                $value = room_id2prefix($args[0]);
                break;
            case 'check_room_available':
                $value = dts_check_room_available($args[0], $args[1], $args[2] ?? []);
                break;
            default:
                $results[] = ['ok' => false, 'error' => "unknown function $fn"];
                continue 2;
        }
        $results[] = ['ok' => true, 'value' => $value, 'type' => gettype($value)];
    } catch (\Throwable $error) {
        $results[] = ['ok' => false, 'error' => $error->getMessage()];
    }
}

echo json_encode($results, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
