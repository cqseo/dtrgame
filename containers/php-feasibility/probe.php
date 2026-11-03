<?php
// Read-only PHP/MySQL reachability probe for a disposable test database.
// The config is mounted at runtime, never embedded in the image or logged.
if (getenv('DTR_PROBE_CONFIRM') !== 'isolated-test-database') {
    fwrite(STDERR, "Refusing: select an isolated test database first.\n");
    exit(2);
}
$config = getenv('DTR_PROBE_CONFIG');
if (!$config || !is_readable($config)) {
    fwrite(STDERR, "Isolated database config is unavailable.\n");
    exit(2);
}
require $config;
mysqli_report(MYSQLI_REPORT_OFF);
$db = @new mysqli($dbhost, $dbuser, $dbpw, $dbname);
if ($db->connect_errno) {
    fwrite(STDERR, "Isolated database connection failed.\n");
    exit(1);
}
$result = $db->query('SELECT 1');
if (!$result || $result->fetch_row()[0] !== '1') {
    fwrite(STDERR, "Read-only query failed.\n");
    exit(1);
}
echo "Isolated MySQL read-only probe passed.\n";
$db->close();
