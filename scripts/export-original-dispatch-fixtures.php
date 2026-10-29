<?php
// Actual module dispatcher, synthetic callbacks, no module initialization or DB.
if($argc!==3)throw new Exception('Usage: php oracle.php snapshot scratch-dir');
$root=realpath($argv[1]);$out=realpath($argv[2]);
if(!$root||!$out||strpos($out,$root)===0)throw new Exception('Unsafe oracle scratch directory');
define('GAME_ROOT',$out.'/');@mkdir($out.'/include/modulemng',0700,true);
file_put_contents($out.'/include/modulemng/modulemng.config.php','<?php $___MOD_CODE_ADV2=0; $___MOD_CODE_ADV1=0;');
require $root.'/include/modules/modules.func.php';
eval('namespace oracle_base {function calculate(&$x) {if(eval(__MAGIC__)) return $___RET_VALUE;global $trace;$trace[]="base";$x["value"]+=1;return $x["value"];}}');
eval('namespace oracle_mid {function calculate(&$x) {if(eval(__MAGIC__)) return $___RET_VALUE;global $trace;$trace[]="mid:before";$r=$chprocess($x);$trace[]="mid:after";$x["value"]*=2;return $r+10;} function helper(&$x){global $trace;$trace[]="helper";return \\oracle_base\\calculate($x);}}');
eval('namespace oracle_top {function calculate(&$x) {if(eval(__MAGIC__)) return $___RET_VALUE;global $trace;$trace[]="top:before";$r=$chprocess($x);$trace[]="top:after";$x["value"]+=100;return $r+1000;}}');
foreach(array('oracle_base','oracle_mid','oracle_top') as $module)hook_register($module,'calculate');
$cases=array();
foreach(array('oracle_base','oracle_mid','oracle_top') as $module)foreach(array(-2,0,7) as $value){$trace=array();$x=array('value'=>$value);$f=$module.'\\calculate';$r=$f($x);$cases[]=array('module'=>$module,'function'=>'calculate','input'=>$value,'result'=>$r,'state'=>$x,'trace'=>$trace);}
$trace=array();$x=array('value'=>5);$r=\oracle_mid\helper($x);$cases[]=array('module'=>'oracle_mid','function'=>'helper','input'=>5,'result'=>$r,'state'=>$x,'trace'=>$trace);
file_put_contents($out.'/dispatch.json',json_encode(array('sourceSha256'=>hash_file('sha256',$root.'/include/modules/modules.func.php'),'cases'=>$cases),JSON_PRETTY_PRINT));
echo count($cases).' actual __MAGIC__ dispatcher cases'.PHP_EOL;
