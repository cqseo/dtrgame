<?php
declare(strict_types=1);

$root = realpath($argv[1] ?? '');
if ($root === false) {
    fwrite(STDERR, "Legacy root does not exist.\n");
    exit(2);
}

$moduleList = $root . '/gamedata/modules.list.php';
$rows = file($moduleList, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
if ($rows === false) throw new RuntimeException("Cannot read {$moduleList}");

function token_text($token): string {
    return is_array($token) ? $token[1] : (string)$token;
}

function parameter_info(array $tokens): ?array {
    $name = null;
    $byReference = false;
    $variadic = false;
    $optional = false;
    foreach ($tokens as $token) {
        $text = token_text($token);
        if (is_array($token) && $token[0] === T_VARIABLE) $name = substr($token[1], 1);
        if ($text === '&') $byReference = true;
        if ((is_array($token) && defined('T_ELLIPSIS') && $token[0] === T_ELLIPSIS) || $text === '...') $variadic = true;
        if ($text === '=') $optional = true;
    }
    return $name === null ? null : ['name' => $name, 'byReference' => $byReference, 'variadic' => $variadic, 'optional' => $optional];
}

function function_parameters(array $tokens, int $open): array {
    $parameters = [];
    $current = [];
    $round = 1; $square = 0; $curly = 0;
    $count = count($tokens);
    for ($cursor = $open + 1; $cursor < $count; $cursor++) {
        $token = $tokens[$cursor];
        $text = token_text($token);
        if ($text === '(') $round++;
        elseif ($text === ')') {
            $round--;
            if ($round === 0) {
                $info = parameter_info($current);
                if ($info !== null) $parameters[] = $info;
                break;
            }
        } elseif ($text === '[') $square++;
        elseif ($text === ']') $square--;
        elseif ($text === '{') $curly++;
        elseif ($text === '}') $curly--;
        if ($text === ',' && $round === 1 && $square === 0 && $curly === 0) {
            $info = parameter_info($current);
            if ($info !== null) $parameters[] = $info;
            $current = [];
            continue;
        }
        $current[] = $token;
    }
    return $parameters;
}

function named_functions(string $source, string $relativeFile): array {
    $tokens = token_get_all($source);
    $functions = [];
    $namespace = '';
    $count = count($tokens);
    for ($index = 0; $index < $count; $index++) {
        $token = $tokens[$index];
        if (!is_array($token)) continue;
        if ($token[0] === T_NAMESPACE) {
            $parts = [];
            for ($cursor = $index + 1; $cursor < $count; $cursor++) {
                $part = $tokens[$cursor];
                if ($part === ';' || $part === '{') break;
                if (is_array($part) && in_array($part[0], [T_STRING, T_NS_SEPARATOR, defined('T_NAME_QUALIFIED') ? T_NAME_QUALIFIED : -1], true)) $parts[] = $part[1];
            }
            $namespace = strtolower(implode('', $parts));
            continue;
        }
        if ($token[0] !== T_FUNCTION) continue;
        for ($cursor = $index + 1; $cursor < $count; $cursor++) {
            $candidate = $tokens[$cursor];
            if (is_array($candidate) && in_array($candidate[0], [T_WHITESPACE, T_COMMENT, T_DOC_COMMENT], true)) continue;
            if ($candidate === '&' || (is_array($candidate) && defined('T_AMPERSAND_NOT_FOLLOWED_BY_VAR_OR_VARARG') && in_array($candidate[0], [T_AMPERSAND_NOT_FOLLOWED_BY_VAR_OR_VARARG, T_AMPERSAND_FOLLOWED_BY_VAR_OR_VARARG], true))) continue;
            if (is_array($candidate) && $candidate[0] === T_STRING) {
                $name = strtolower($candidate[1]);
                if (!in_array($name, ['init', '___pre_init', '___post_init'], true)) {
                    $open = $cursor + 1;
                    while ($open < $count && token_text($tokens[$open]) !== '(') $open++;
                    $functions[] = [
                        'name' => $name,
                        'namespace' => $namespace,
                        'source' => $relativeFile,
                        'line' => $token[2],
                        'parameters' => $open < $count ? function_parameters($tokens, $open) : []
                    ];
                }
            }
            break;
        }
    }
    return $functions;
}

$modules = [];
$missingSources = [];
foreach ($rows as $order => $row) {
    $parts = array_map('trim', explode(',', $row));
    if (count($parts) < 3) continue;
    [$name, $path, $enabledRaw] = $parts;
    $enabled = $enabledRaw === '1';
    $module = ['name' => $name, 'path' => $path, 'enabled' => $enabled, 'order' => $order, 'functions' => []];
    if ($enabled) {
        $moduleRoot = $root . '/include/modules/' . rtrim($path, '/');
        $header = @file_get_contents($moduleRoot . '/module.inc.php');
        if ($header === false) throw new RuntimeException("Missing module.inc.php for {$name}");
        if (!preg_match('/\$___MODULE_codelist\s*=\s*([\'\"])(.*?)\1\s*;/s', $header, $match)) {
            throw new RuntimeException("Missing codelist for {$name}");
        }
        foreach (preg_split('/\s+/', trim($match[2])) ?: [] as $file) {
            if ($file === '') continue;
            $absolute = $moduleRoot . '/' . $file;
            $source = @file_get_contents($absolute);
            if ($source === false) {
                $sample = preg_replace('/\.php$/', '.sample.php', $absolute);
                $source = is_string($sample) ? @file_get_contents($sample) : false;
                if ($source !== false && is_string($sample)) $absolute = $sample;
            }
            if ($source === false) {
                $missingSources[] = substr($absolute, strlen($root) + 1);
                continue;
            }
            $relative = substr($absolute, strlen($root) + 1);
            foreach (named_functions($source, $relative) as $function) {
                if ($function['namespace'] !== strtolower($name)) continue;
                $module['functions'][] = $function;
            }
        }
    }
    $modules[] = $module;
}

echo json_encode(['modules' => $modules, 'missingSources' => $missingSources], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
