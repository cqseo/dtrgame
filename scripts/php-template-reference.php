<?php
/**
 * Runs the original's own template compiler so the TypeScript port can be
 * held to its output.
 *
 * include/template.func.php is a Discuz-derived compiler whose result depends
 * on a long chain of text rewrites — indent stripping, {LF}, the
 * variable-variable detour through [@[ ]@], div newline collapsing, nospace,
 * transamp. Reimplementing that from reading alone would be guesswork.
 *
 * stdin: {"root":..,"cases":[{"action":"compile"|"render","template":..,
 *                             "vars":{..}}]}
 *
 * "compile" returns the compiled PHP text, which isolates compiler
 * differences from evaluator differences. "render" returns the rendered
 * output. Runs against the writable golden-master instance because
 * parse_template writes its result to disk.
 */
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_DEPRECATED);

$input = json_decode(stream_get_contents(STDIN), true);
if (!is_array($input)) {
    fwrite(STDERR, "expected JSON on stdin\n");
    exit(1);
}

$root = rtrim($input['root'], '/');
if (!is_dir($root)) {
    fwrite(STDERR, "root not found: $root\n");
    exit(1);
}

chdir($root);

define('IN_GAME', true);
define('GAME_ROOT', $root . '/');
define('CURSCRIPT', $input['curscript'] ?? 'index');
define('STYLEID', '1');
define('TEMPLATEID', '1');
define('TPLDIR', './templates/default');

$tplrefresh = 1;
$charset = 'utf-8';
$language = array();

require GAME_ROOT . './include/global.func.php';
require GAME_ROOT . './include/template.func.php';

$scratch = sys_get_temp_dir() . '/dts-template-oracle';
@mkdir($scratch, 0700, true);

/** Locates a template the way template() does, by bare name or by path. */
function dts_template_file($name, $root) {
    if (strpos($name, '/') === false) {
        return $root . '/templates/default/' . $name . '.htm';
    }
    return $name . '.htm';
}

function dts_compile($name, $root, $scratch) {
    $source = dts_template_file($name, $root);
    if (!is_file($source)) {
        return ['ok' => false, 'error' => "template not found: $name"];
    }
    $object = $scratch . '/' . md5($name) . '.tpl.php';
    try {
        parse_template($source, $object, 1, './templates/default', 1);
        return ['ok' => true, 'compiled' => file_get_contents($object)];
    } catch (\Throwable $error) {
        return ['ok' => false, 'error' => $error->getMessage()];
    }
}

function dts_render($case) {
    foreach (($case['vars'] ?? []) as $name => $value) {
        $GLOBALS[$name] = $value;
    }
    extract($case['vars'] ?? []);
    ob_start();
    try {
        include template($case['template']);
        return ['ok' => true, 'output' => ob_get_clean()];
    } catch (\Throwable $error) {
        ob_end_clean();
        return ['ok' => false, 'error' => $error->getMessage()];
    }
}

/**
 * parse_template loads templates.lang.php into $language and substitutes
 * {lang x} at compile time, so the port needs the same map to agree.
 */
function dts_language($root) {
    $language = array();
    $file = $root . '/templates/default/templates.lang.php';
    if (is_file($file)) {
        include $file;
    }
    return ['ok' => true, 'language' => $language];
}

$results = [];
foreach ($input['cases'] as $case) {
    switch ($case['action'] ?? 'render') {
        case 'compile':
            $results[] = dts_compile($case['template'], $root, $scratch);
            break;
        case 'language':
            $results[] = dts_language($root);
            break;
        default:
            $results[] = dts_render($case);
    }
}

echo json_encode($results, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
