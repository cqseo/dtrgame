<?php
/**
 * Reports which PHP constructs the original's modules actually use.
 *
 * Hand-porting is running at a handful of functions per commit against 5,235
 * hook implementations, which does not converge. The alternative is a
 * build-time PHP-to-TypeScript compiler, the way the template compiler
 * already handles all 845 templates byte-identically. That is only worth
 * building if the module code is stylistically narrow, so this measures it
 * before anyone commits to it.
 *
 * PHP's own tokenizer does the reading, so the census cannot disagree with
 * the language about what is in the files.
 *
 * stdin:  {"root": "/path/to/instance"}
 * stdout: {"files": n, "functions": n, "tokens": {"<name>": count},
 *          "rare": {"<name>": ["file:line", ...]}}
 *
 * `rare` lists where the uncommon constructs are, because the cost of a
 * compiler is set by its long tail, not by its common case.
 */
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_DEPRECATED);

$input = json_decode(stream_get_contents(STDIN), true);
$root = rtrim($input['root'] ?? '', '/');
if (!is_dir($root)) {
    fwrite(STDERR, "root not found: $root\n");
    exit(1);
}

$files = [];
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($root . '/include/modules', FilesystemIterator::SKIP_DOTS)
);
foreach ($iterator as $file) {
    if ($file->isFile() && $file->getExtension() === 'php') $files[] = $file->getPathname();
}
sort($files);

// Counted separately from the token census: these are the constructs that
// decide whether a compiler is a weekend or a month.
$INTERESTING = [
    T_CLASS, T_INTERFACE, T_TRAIT, T_NEW, T_CLONE, T_INSTANCEOF,
    T_TRY, T_CATCH, T_FINALLY, T_THROW,
    T_FUNCTION, T_FN, T_STATIC, T_GLOBAL, T_LIST, T_UNSET, T_ISSET, T_EMPTY, T_EVAL,
    T_FOREACH, T_FOR, T_WHILE, T_DO, T_SWITCH, T_GOTO, T_MATCH,
    T_START_HEREDOC, T_END_HEREDOC, T_CURLY_OPEN, T_DOLLAR_OPEN_CURLY_BRACES,
    T_VARIABLE, T_STRING_VARNAME, T_YIELD, T_YIELD_FROM,
    T_NAMESPACE, T_USE, T_CONST, T_DECLARE, T_INCLUDE, T_INCLUDE_ONCE,
    T_REQUIRE, T_REQUIRE_ONCE, T_PRINT, T_EXIT, T_ELLIPSIS,
    T_DOUBLE_ARROW, T_OBJECT_OPERATOR, T_NULLSAFE_OBJECT_OPERATOR,
    T_DOUBLE_COLON, T_ATTRIBUTE, T_ENUM, T_READONLY,
];
$INTERESTING = array_flip($INTERESTING);

$RARE_THRESHOLD = 60;

$counts = [];
$sites = [];
$functionCount = 0;
$byRefParams = 0;
$variableVariables = 0;
$interpolations = 0;

foreach ($files as $path) {
    $source = file_get_contents($path);
    $tokens = token_get_all($source);
    $relative = substr($path, strlen($root) + 1);

    foreach ($tokens as $index => $token) {
        if (!is_array($token)) {
            // Punctuation worth knowing about: & for references, $$ for
            // variable variables, backtick for shell_exec.
            if ($token === '`') {
                $counts['backtick'] = ($counts['backtick'] ?? 0) + 1;
            }
            continue;
        }
        [$id, $text, $line] = $token;
        if (!isset($INTERESTING[$id])) continue;

        $name = token_name($id);
        $counts[$name] = ($counts[$name] ?? 0) + 1;
        if (!isset($sites[$name])) $sites[$name] = [];
        if (count($sites[$name]) < 12) $sites[$name][] = "$relative:$line";

        if ($id === T_FUNCTION) $functionCount++;
    }

    // Reference parameters and variable variables need their own pass: the
    // tokenizer reports them as plain punctuation, and both change what a
    // compiler has to emit for every call.
    $byRefParams += preg_match_all('/function\s+\w+\s*\([^)]*&\s*\$/', $source);
    $variableVariables += preg_match_all('/\$\{?\$/', $source);
    // "$name" and "{$a[\'b\']}" inside double quotes.
    $interpolations += preg_match_all('/"[^"\n]*\$[a-zA-Z_{]/', $source);
}

arsort($counts);
$rare = [];
foreach ($counts as $name => $count) {
    if ($count <= $RARE_THRESHOLD) $rare[$name] = $sites[$name];
}

echo json_encode([
    'files' => count($files),
    'functions' => $functionCount,
    'byRefParams' => $byRefParams,
    'variableVariables' => $variableVariables,
    'interpolations' => $interpolations,
    'tokens' => $counts,
    'rare' => $rare,
], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
