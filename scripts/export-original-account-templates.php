<?php
// Build/test tool only. Reads the immutable PHP snapshot; writes only argv[2].
// Never includes common.inc.php, connects to MySQL, or touches the source cache.
if ($argc !== 3) throw new Exception('Usage: php script.php source-root output-dir');
$root = realpath($argv[1]);
$out = $argv[2];
if (!$root || !is_dir($out) || realpath($out) === $root || strpos(realpath($out), $root.'/') === 0)
    throw new Exception('Output must exist outside the source tree');
define('IN_GAME', true);
define('GAME_ROOT', $root.'/');
define('CURSCRIPT', 'login');
require $root.'/include/template.func.php';
require $root.'/templates/default/templates.lang.php';
require $root.'/include/modules/core/sys/config/resources.config.php';
require $root.'/include/modules/core/sys/config/version.config.php';
require $root.'/gamedata/banlist.list';
function language($name, $id=1, $dir='') { return GAME_ROOT.'templates/default/'.$name.'.lang.php'; }
function template($name) { global $out; return $out.'/'.$name.'.php'; }
$names = array('header', 'footer', 'login_page', 'error');
$compiled = array(); $sources = array();
foreach ($names as $name) {
    $path = $root.'/templates/default/'.$name.'.htm';
    parse_template($path, $out.'/'.$name.'.php', 1, 'templates/default');
    $compiled[$name] = file_get_contents($out.'/'.$name.'.php');
    $sources[$name] = array('path'=>'templates/default/'.$name.'.htm', 'sha256'=>hash_file('sha256',$path));
}
$defaults = array('charset'=>'utf-8', 'gtitle'=>'ACFUN 大 逃 杀', 'bbsurl'=>'https://bbs.brdts.online/',
    'homepage'=>'http://amarillonmc.github.io/', 'gamecredits'=>$gamecredits,
    'error'=>'', 'errorinfo'=>0, 'u_templateid'=>1, '___MOD_CODE_ADV3'=>false);
$cases = array();
foreach (array(1,2) as $style) {
    foreach (array('login_page','error') as $name) {
        foreach (array(false,true) as $loggedIn) {
            $context = $defaults;
            $context['u_templateid']=$style;
            if ($loggedIn) { $context['cuser']='QA_USER'; $context['cpass']='synthetic-cookie'; }
            $context['message']=$_ERROR['wrong_pw'];
            $context['GLOBALS']=array('_ERROR'=>$_ERROR);
            // All fixtures use synthetic context and original template/compiler bytes.
            $render = function($name,$context) {
                extract($context, EXTR_SKIP);
                ob_start(); include template($name); return ob_get_clean();
            };
            $cases[]=array('name'=>$name,'context'=>$context,'html'=>$render($name,$context));
        }
    }
}
file_put_contents($out.'/account-templates.json', json_encode(array(
    'sourceCompilerSha256'=>hash_file('sha256',$root.'/include/template.func.php'),
    'sources'=>$sources, 'compiled'=>$compiled, 'defaults'=>$defaults,
    'errors'=>$_ERROR, 'cases'=>$cases,
    'accountPolicy'=>array('names'=>$nmlimit, 'ips'=>$iplimit)
), JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT));
echo 'Exported '.count($names).' original templates and '.count($cases).' PHP render fixtures'.PHP_EOL;
