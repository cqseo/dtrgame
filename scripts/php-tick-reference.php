<?php
/**
 * Runs a whole game tick on the original and reports what it changed.
 *
 * The port can now run sys\routine() on 286 compiled modules, but running
 * is not the same as computing the same thing. This drives the original
 * through the identical tick so the two can be compared field by field.
 *
 * It seeds the game row, calls \sys\routine(), and reads the row back, so
 * what comes out is the original's own answer to "given this room state,
 * what does one tick do to it".
 *
 * It writes only to the isolated parity instance's own database, which is
 * a clone. The live site is never touched.
 *
 * stdin:
 * {
 *   "root": "/path/to/instance",
 *   "roomId": "0",
 *   "row": {"gamestate": "1", "alivenum": "7", ...},
 *   "now": 1762000000
 * }
 * stdout: {"ok":true,"before":{..},"after":{..},"changed":{..}}
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
define('CURSCRIPT', 'command');

// common.inc.php runs a tick itself on the way in, which would mean two
// ticks per run and a comparison against the wrong state. NO_SYS_UPDATE is
// the original's own way of loading without one, so the tick below is the
// only one and its inputs are the ones this script set.
define('NO_SYS_UPDATE', true);

require GAME_ROOT . './include/common.inc.php';

global $db, $gtablepre;
$roomId = (string) ($input['roomId'] ?? '0');

/** The columns the caller wants set before the tick runs. */
$seed = $input['row'] ?? [];
if (!empty($seed)) {
    $assignments = [];
    foreach ($seed as $column => $value) {
        // Column names come from the caller's fixture, not from a request,
        // but they are still checked rather than trusted into SQL.
        if (!preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $column)) {
            echo json_encode(['ok' => false, 'error' => "bad column name: $column"]);
            exit(0);
        }
        $assignments[] = "`$column` = '" . addslashes((string) $value) . "'";
    }
    $db->query(
        "UPDATE {$gtablepre}game SET " . implode(',', $assignments) .
        " WHERE groomid='" . addslashes($roomId) . "'"
    );
}

$readRow = function () use ($db, $gtablepre, $roomId) {
    $result = $db->query(
        "SELECT * FROM {$gtablepre}game WHERE groomid='" . addslashes($roomId) . "'"
    );
    $row = $db->fetch_array($result);
    return is_array($row) ? $row : [];
};

$before = $readRow();
if (empty($before)) {
    echo json_encode(['ok' => false, 'error' => "no game row for room $roomId"]);
    exit(0);
}

// $room_id is what load_gameinfo selects on, and the tick reads $now
// throughout; both are normally set by the request.
$GLOBALS['room_id'] = $roomId;
if (isset($input['now'])) $GLOBALS['___LOCAL_SYS__VARS__now'] = (int) $input['now'];

try {
    \sys\routine();
} catch (\Throwable $error) {
    echo json_encode(['ok' => false, 'error' => $error->getMessage()]);
    exit(0);
}

$after = $readRow();

$changed = [];
foreach ($after as $column => $value) {
    if (is_int($column)) continue;
    if (!array_key_exists($column, $before) || $before[$column] !== $value) {
        $changed[$column] = ['from' => $before[$column] ?? null, 'to' => $value];
    }
}

echo json_encode(
    [
        'ok' => true,
        // The port has to use the same prefix, or it looks for tables that
        // do not exist. It is reported rather than assumed by the caller.
        'tablepre' => $gtablepre,
        'now' => $GLOBALS['___LOCAL_SYS__VARS__now'] ?? null,
        'before' => $before,
        'after' => $after,
        'changed' => $changed
    ],
    JSON_UNESCAPED_UNICODE
);
