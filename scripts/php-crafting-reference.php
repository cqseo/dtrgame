<?php
/**
 * Read-only differential oracle. Runs functions from the captured PHP source;
 * it does not load the web bootstrap, connect to a database, or write game data.
 * stdin: JSON { root, cases: [{ action, items, ... }] }. stdout: JSON results.
 * Storage, itemget and news are intercepted as captured effects. This composes
 * only the explicitly loaded itemmix, attrbase and residue hooks, not all skills.
 */
namespace itemmain {
    function itemget() { /* The test observes itm0 before inventory placement. */ }
    function check_in_itmsk(...$args) { return \reference_with_parent('reference_base_itemmain\\check_in_itmsk', 'attrbase\\check_in_itmsk', $args); }
    function replace_in_itmsk(...$args) { return \reference_with_parent('reference_base_itemmain\\replace_in_itmsk', 'attrbase\\replace_in_itmsk', $args); }
    function itemdrop_query($itm,$itmk,$itme,$itms,$itmsk,$pls) {
        $GLOBALS['reference_drops'][] = \reference_item([$itm,$itmk,$itme,$itms,$itmsk]);
        return count($GLOBALS['reference_drops']);
    }
}
namespace reference_base_itemmain {
    function get_itmsk_array(...$args) { return \itemmain\get_itmsk_array(...$args); }
}
namespace reference_itemmix {
    function itemmix_reduce($item) { return \reference_with_parent('itemmix\\itemmix_reduce', 'ex_residue\\itemmix_reduce', [$item]); }
    function itemmix_success() { return \reference_with_parent('itemmix\\itemmix_success', 'attrbase\\itemmix_success', []); }
}
namespace searchmemory {
    function searchmemory_available() { return $GLOBALS['gametype'] !== 1; }
}
namespace skill1006 {
    function add_beacon($beacon, &$state) { $GLOBALS['reference_beacons'][] = $beacon; }
}
namespace player {
    function player_save($state) { /* In-memory reference only. */ }
}
namespace {
    ini_set('display_errors', 'stderr');
    define('__MAGIC__', '$chprocess = $GLOBALS["reference_chprocess"] ?? null; return false;');
    define('MOD_SEARCHMEMORY', true);
    define('MOD_SKILL1006', true);
    function reference_with_parent($parent, $function, $args) {
        $previous = $GLOBALS['reference_chprocess'] ?? null;
        $GLOBALS['reference_chprocess'] = $parent;
        try { return $function(...$args); }
        finally { $GLOBALS['reference_chprocess'] = $previous; }
    }
    function import_module(...$modules) {
        $names = ['mixinfo', 'itmname_ignore', 'mix_type', 'nosta', 'log', 'mode', 'uip', 'name', 'now', 'wd', 'club', 'tmp_itmsk_arr_pool', 'pls', 'sdata'];
        for ($i = 0; $i <= 6; $i++) foreach (['itm','itmk','itme','itms','itmsk'] as $key) $names[] = $key.$i;
        return 'global $'.implode(', $', $names).';';
    }
    function readover($path) { return file_get_contents($path); }
    function addnews(...$args) { $GLOBALS['reference_news'][] = $args; }

    // Extract original function tokens verbatim; unlike translating an oracle,
    // this keeps the implementation under test independent of TypeScript.
    function load_reference_functions($path, $namespace, $wanted) {
        $tokens = token_get_all(file_get_contents($path));
        $definitions = [];
        for ($i = 0; $i < count($tokens); $i++) {
            if (!is_array($tokens[$i]) || $tokens[$i][0] !== T_FUNCTION) continue;
            $start = $i;
            $j = $i + 1;
            while (isset($tokens[$j]) && is_array($tokens[$j]) && $tokens[$j][0] === T_WHITESPACE) $j++;
            if (!isset($tokens[$j]) || !is_array($tokens[$j]) || $tokens[$j][0] !== T_STRING) continue;
            $name = $tokens[$j][1];
            if (!in_array($name, $wanted, true)) continue;
            while ($j < count($tokens) && $tokens[$j] !== '{') $j++;
            $depth = 1;
            for ($j++; $j < count($tokens) && $depth > 0; $j++) {
                $token = $tokens[$j];
                if ($token === '{' || (is_array($token) && in_array($token[0], [T_CURLY_OPEN, T_DOLLAR_OPEN_CURLY_BRACES], true))) $depth++;
                elseif ($token === '}') $depth--;
            }
            $definitions[$name] = implode('', array_map(fn($token) => is_array($token) ? $token[1] : $token, array_slice($tokens, $start, $j - $start)));
            $i = $j - 1;
        }
        if (count($definitions) !== count($wanted)) throw new \RuntimeException('Missing original functions: '.implode(',', array_diff($wanted, array_keys($definitions))));
        eval(($namespace ? "namespace $namespace;" : '').implode("\n", $definitions));
    }

    function reference_item($raw) {
        return ['itm' => $raw[0], 'itmk' => $raw[1], 'itme' => 0 + $raw[2], 'itms' => $raw[3] === '∞' ? '∞' : 0 + $raw[3], 'itmsk' => isset($raw[4]) ? (string)$raw[4] : ''];
    }
    function reference_options($items) {
        $slots = count($items) ? range(1, count($items)) : [];
        $normal = reference_with_parent('itemmix\\itemmix_recipe_check', 'ex_residue\\itemmix_recipe_check', [$items]);
        $sync = \itemmix_sync\itemmix_sync_check($slots);
        $overlay = \itemmix_overlay\itemmix_overlay_check($slots);
        $options = $normal;
        foreach ($sync as $group) foreach ($group as $option) $options[] = $option;
        foreach ($overlay as $group) foreach ($group as $option) $options[] = $option;
        return $options;
    }
    function reset_reference_player($case) {
        $GLOBALS['log'] = '';
        $GLOBALS['mode'] = 'itemmain';
        $GLOBALS['wd'] = 0;
        $GLOBALS['club'] = $case['club'] ?? 0;
        $GLOBALS['uip'] = [];
        $GLOBALS['reference_news'] = [];
        $GLOBALS['reference_drops'] = [];
        $GLOBALS['reference_beacons'] = [];
        $GLOBALS['gametype'] = $case['gameType'] ?? 0;
        $GLOBALS['pls'] = 9;
        $GLOBALS['sdata'] = [];
        for ($i = 0; $i <= 6; $i++) {
            $item = $case['items'][$i - 1] ?? ['itm'=>'','itmk'=>'','itme'=>0,'itms'=>0,'itmsk'=>''];
            foreach ($item as $key => $value) $GLOBALS[$key.$i] = $value;
        }
    }
    $input = json_decode(stream_get_contents(STDIN), true, 512, JSON_THROW_ON_ERROR);
    $root = realpath($input['root']);
    if (!$root || !is_file($root.'/gamedata/modules.list.php')) throw new \RuntimeException('Captured source root not found');
    $base = $root.'/include/modules/base/';
    require $base.'itemmix/itemmix/config/itemmix.config.php';
    require $base.'itemmix/itemmix/main.php';
    require $base.'itemmix/itemmix_sync/main.php';
    require $base.'itemmix/itemmix_overlay/main.php';
    load_reference_functions($base.'itemmain/main.php', 'itemmain', ['get_itmsk_array']);
    load_reference_functions($base.'itemmain/main.php', 'reference_base_itemmain', ['check_in_itmsk', 'replace_in_itmsk']);
    load_reference_functions($base.'itemmix/itemmix/main.php', 'reference_itemmix', ['itemmix_proc']);
    load_reference_functions($root.'/include/modules/extra/attr/attrbase/main.php', 'attrbase', ['get_comp_itmsk_info', 'check_in_itmsk', 'check_single_sk_head_equal', 'replace_in_itmsk', 'base64_encode_comp_itmsk', 'base64_decode_comp_itmsk', 'config_process_encode_comp_itmsk', 'config_process_encode_comp_itmsk_callback', 'itemmix_success']);
    require $root.'/include/modules/extra/attr/ex_residue/main.php';
    load_reference_functions($root.'/include/global.func.php', '', ['openfile']);
    $nosta = '∞'; $name = 'reference'; $now = 100; $tmp_itmsk_arr_pool = [];
    $mix_type['sync'] = '同调'; $mix_type['overlay'] = '超量';
    if (!empty($input['full_suite'])) {
        $input['cases'] = [['action'=>'recipes']];
        foreach ($mixinfo as $recipe) {
            $items = [];
            foreach ($recipe['stuff'] as $i => $ingredient) $items[] = ['itm'=>$ingredient,'itmk'=>$i%2 ? 'WK' : 'X','itme'=>1,'itms'=>$i%3 ? 2 : '∞','itmsk'=>''];
            $entry = ['action'=>'options','items'=>$items];
            $input['cases'][] = $entry;
            reset_reference_player($entry);
            foreach (reference_options($items) as $selection => $option) foreach ([0,7,16] as $clubNumber) $input['cases'][] = ['action'=>'craft','items'=>$items,'selection'=>$selection,'club'=>$clubNumber];
        }
        for ($star=1; $star<=12; $star++) for ($count=2; $count<=6; $count++) foreach (['','s','s^001','s^002','J','sJ^001^002'] as $attributes) {
            $items=[];
            for ($i=0; $i<$count; $i++) $items[]=['itm'=>'素材'.$i.($i===0 ? '-仮' : ''),'itmk'=>'WC'.$star,'itme'=>1,'itms'=>$i===1 && $count===6 ? 0 : '∞','itmsk'=>$i===0 ? $attributes : '^001'];
            $input['cases'][] = ['action'=>'options','items'=>$items];
        }
        $input['cases'][] = ['action'=>'attribute-config', 'values'=>array_map(fn($recipe)=>(string)($recipe['result'][4]??''),$mixinfo)];
    }
    $results = [];
    foreach ($input['cases'] as $case) {
        reset_reference_player($case);
        if ($case['action'] === 'recipes') {
            $results[] = array_map(fn($recipe) => ['ingredients'=>$recipe['stuff'], 'group'=>$recipe['class'], 'result'=>reference_item($recipe['result']), 'tips'=>$recipe['tips'] ?? ''], $mixinfo);
        } elseif ($case['action'] === 'normalize') {
            $results[] = array_map('\itemmix\itemmix_name_proc', $case['names']);
        } elseif ($case['action'] === 'options') {
            $results[] = array_map(fn($option) => ['type'=>$option['type'], 'group'=>$option['class'] ?? '', 'result'=>reference_item($option['result'])], reference_options($case['items']));
        } elseif ($case['action'] === 'reduce') {
            \itemmix\itemmix_reduce('itm1');
            $results[] = ['item'=>['itm'=>$itm1,'itmk'=>$itmk1,'itme'=>$itme1,'itms'=>$itms1,'itmsk'=>$itmsk1], 'logHtml'=>$log];
        } elseif ($case['action'] === 'craft') {
            $options = reference_options($case['items']);
            $option = $options[$case['selection'] ?? 0];
            $uip['itmstr'] = implode(' ', array_column($case['items'], 'itm'));
            \reference_itemmix\itemmix_proc(range(1, count($case['items'])), $option);
            $materials = [];
            for ($i=1; $i<=count($case['items']); $i++) $materials[] = ['itm'=>${'itm'.$i},'itmk'=>${'itmk'.$i},'itme'=>${'itme'.$i},'itms'=>${'itms'.$i},'itmsk'=>${'itmsk'.$i}];
            $entry = ['materials'=>$materials,'result'=>reference_item([$itm0,$itmk0,$itme0,$itms0,$itmsk0]),'workDelta'=>$wd,'logHtml'=>$log];
            if (count($reference_drops)) $entry['drops'] = $reference_drops;
            $results[] = $entry;
        } elseif ($case['action'] === 'residue') {
            \reference_itemmix\itemmix_reduce('itm1');
            $results[] = ['item'=>reference_item([$itm1,$itmk1,$itme1,$itms1,$itmsk1]),'logHtml'=>$log,'drops'=>$reference_drops];
        } elseif ($case['action'] === 'attribute-read') {
            $results[] = \itemmain\check_in_itmsk($case['mark'], $case['value'], $case['count'] ?? 0);
        } elseif ($case['action'] === 'attribute-replace') {
            $results[] = \itemmain\replace_in_itmsk($case['mark'], $case['replacement'], $case['value'], $case['strict'] ?? 0);
        } elseif ($case['action'] === 'attribute-config') {
            $results[] = array_map('\attrbase\config_process_encode_comp_itmsk', $case['values']);
        } elseif ($case['action'] === 'attribute-encode') {
            $results[] = array_map('\attrbase\base64_encode_comp_itmsk', $case['values']);
        } elseif ($case['action'] === 'attribute-decode') {
            $results[] = array_map('\attrbase\base64_decode_comp_itmsk', $case['values']);
        } elseif ($case['action'] === 'attribute-parts') {
            $results[] = array_map('\attrbase\get_comp_itmsk_info', $case['values']);
        } elseif ($case['action'] === 'validate') {
            $ok = \itemmix\itemmix_place_check($case['slots']);
            $results[] = ['ok'=>$ok,'logHtml'=>$log,'mode'=>$mode,'mixMask'=>\itemmix\calc_mixmask($case['slots'])];
        } else throw new \RuntimeException('Unknown action');
    }
    $serialized = json_encode($results, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    echo empty($input['digest']) ? $serialized : json_encode(['php'=>PHP_VERSION,'cases'=>count($results),'sha256'=>hash('sha256',$serialized)]);
}
