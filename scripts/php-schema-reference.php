<?php
/**
 * Reports the original's real table schema, as the running game sees it.
 *
 * install/bra.install.sql is the schema the game shipped with, not the one
 * it runs on: tools_users_table_alter.php and the patches beside it have
 * since added columns, and a port built from the install file would be
 * missing them. So the authority is the live DDL.
 *
 * This reads it through the original's own $db connection, which means the
 * database credentials are read and used entirely on the remote host and
 * never travel back. Only `SHOW CREATE TABLE` output is returned: DDL, no
 * rows, so no player data crosses the bridge either.
 *
 * It runs against the isolated parity instance, whose database is a clone.
 * The live site is never touched.
 *
 * stdin:  {"root": "/path/to/instance"}
 * stdout: {"ok":true,"tablepre":"acbra2_","tables":{"<name>":"<DDL>"}}
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
// Loading for a schema read must not advance the game.
define('NO_SYS_UPDATE', true);

require GAME_ROOT . './include/common.inc.php';

$prefix = isset($tablepre) ? $tablepre : '';
if ($prefix === '') {
    fwrite(STDERR, "no table prefix: refusing to dump every table on the server\n");
    exit(1);
}

$tables = array();
$list = $db->query('SHOW TABLES');
while ($row = $db->fetch_array($list, MYSQLI_NUM)) {
    $name = $row[0];
    // Only this instance's own tables. The prefix check keeps the dump to
    // the game and away from anything else sharing the server.
    if (strpos($name, $prefix) !== 0) {
        continue;
    }
    $created = $db->fetch_array($db->query('SHOW CREATE TABLE `' . $name . '`'), MYSQLI_NUM);
    $tables[$name] = $created[1];
}

ksort($tables);
echo json_encode(
    array('ok' => true, 'tablepre' => $prefix, 'tables' => $tables),
    JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
);
