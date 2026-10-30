<?php
/**
 * Captures the original's signed-in responses.
 *
 * The signed-out pages could be captured with plain GETs, but everything
 * left — the lobby, rooms, the command engine — only exists behind an
 * account. This drives the isolated golden-master instance over HTTP with a
 * real cookie jar, so what is recorded is what the original actually sends a
 * signed-in browser, not an approximation assembled from reading the source.
 *
 * Registration goes through the original's own register.php, including its
 * verification question: the correct answer is read from the same function
 * the page uses, which makes this a test harness with server access rather
 * than a bypass of game logic.
 *
 * Only ever points at the isolated instance and its own database. The live
 * site and live player data are never touched.
 *
 * stdin: {"root":..,"origin":..,"account":{"username":..,"password":..},
 *         "steps":[{"method":"GET"|"POST","path":..,"body":{..}}]}
 */
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_DEPRECATED);

$input = json_decode(stream_get_contents(STDIN), true);
if (!is_array($input)) {
    fwrite(STDERR, "expected JSON on stdin\n");
    exit(1);
}

$root = rtrim($input['root'], '/');
$origin = rtrim($input['origin'] ?? 'http://127.0.0.1:18090', '/');
$jar = tempnam(sys_get_temp_dir(), 'dts-cookies-');

register_shutdown_function(function () use ($jar) { @unlink($jar); });

// The original's bootstrap must run in the global scope: its configuration,
// including $gtablepre, is read as globals by the database layer. Requiring
// it inside a function makes those locals and the queries lose their table
// prefix.
chdir($root);
define('IN_GAME', true);
define('GAME_ROOT', $root . '/');
define('CURSCRIPT', 'register');
define('LOAD_CORE_ONLY', true);
require GAME_ROOT . './include/common.inc.php';

/** One HTTP call against the instance, sharing the cookie jar. */
function dts_http($origin, $jar, $method, $path, $body = null) {
    $handle = curl_init($origin . $path);
    curl_setopt_array($handle, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_COOKIEJAR => $jar,
        CURLOPT_COOKIEFILE => $jar,
        CURLOPT_TIMEOUT => 60,
        CURLOPT_USERAGENT => 'dts-golden-master/1.0',
    ]);
    if ($method === 'POST') {
        curl_setopt($handle, CURLOPT_POST, true);
        curl_setopt($handle, CURLOPT_POSTFIELDS, http_build_query($body ?? []));
    }
    $raw = curl_exec($handle);
    if ($raw === false) {
        $error = curl_error($handle);
        curl_close($handle);
        return ['ok' => false, 'error' => $error];
    }
    $status = curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
    $headerSize = curl_getinfo($handle, CURLINFO_HEADER_SIZE);
    curl_close($handle);

    $headerText = substr($raw, 0, $headerSize);
    $kept = [];
    foreach (explode("\r\n", $headerText) as $line) {
        $parts = explode(':', $line, 2);
        if (count($parts) !== 2) continue;
        $name = strtolower(trim($parts[0]));
        if (in_array($name, ['content-type', 'location', 'allow'], true)) {
            $kept[$name] = trim($parts[1]);
        }
    }
    return ['ok' => true, 'status' => $status, 'headers' => $kept, 'body' => substr($raw, $headerSize)];
}

/**
 * Registers the account if it does not exist, answering the original's
 * verification question with the value its own generator considers correct.
 */
function dts_ensure_account($origin, $jar, $username, $password) {
    if (!empty(fetch_udata_by_username($username, 'uid'))) {
        return ['created' => false];
    }

    $token = register_fatenum_create();
    $question = register_verification_question_get($token);

    $response = dts_http($origin, $jar, 'POST', '/register.php', [
        'cmd' => 'post_register',
        'username' => $username,
        'npass' => $password,
        'rnpass' => $password,
        'gender' => 'm',
        'icon' => 0,
        'motto' => '',
        'killmsg' => '',
        'lastword' => '',
        'register_token' => $token,
        'vq_answer' => (int)$question['correct_i'],
    ]);

    $exists = !empty(fetch_udata_by_username($username, 'uid'));
    return ['created' => $exists, 'register_response' => $response];
}

$account = $input['account'] ?? [];
$username = $account['username'] ?? '';
$password = $account['password'] ?? '';
$results = ['account' => null, 'steps' => []];

if ($username !== '') {
    $results['account'] = dts_ensure_account($origin, $jar, $username, $password);
    $results['login'] = dts_http($origin, $jar, 'POST', '/login.php', [
        'username' => $username,
        'password' => $password,
    ]);
}

foreach (($input['steps'] ?? []) as $step) {
    $results['steps'][] = dts_http(
        $origin,
        $jar,
        strtoupper($step['method'] ?? 'GET'),
        $step['path'],
        $step['body'] ?? null
    );
}

echo json_encode($results, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
