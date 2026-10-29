<?php
// Source acquire/lost bodies + original skillbase parameter functions.
// Synthetic module globals/players only, no SQL, no live module init.
if($argc!==4)throw new Exception('Usage: php oracle.php snapshot selected.json output.json');
$root=realpath($argv[1]);$selected=json_decode(file_get_contents($argv[2]),true);
define('__MAGIC__','return 0;');
require $root.'/include/modules/base/skillbase/main.php';
function import_module(){global $contextKeys;return 'global $'.implode(',$',$contextKeys).';';}
function ordered_pack($v){if(!is_array($v))return $v;$out=array();foreach($v as $k=>$x)$out[]=array($k,ordered_pack($x));return array('array'=>$out);}
function get_var_in_module($key,$module){return null;}
$cases=array();
foreach($selected as $r){
 eval('namespace '.$r['module'].' {'.$r['source'].'}');
 $tokens=token_get_all('<?php '.$r['source']);$names=array();
 foreach($tokens as $t)if(is_array($t)&&$t[0]===T_VARIABLE){$n=substr($t[1],1);if(!in_array($n,array('pa','___RET_VALUE','chprocess'))) $names[$n]=true;}
 foreach(array(0,400)as $elapsed){
  $variables=array();foreach($names as $n=>$unused)$variables[$n]=30;
  $variables['now']=1793232000+$elapsed;$variables['starttime']=1793232000;$variables['gametype']=19;
  $variables['pid']=0;$variables['ppid']=0;$variables['acquired_list']=array();$variables['parameter_list']=array();
  $contextKeys=array_keys($variables);foreach($variables as $n=>$v)$GLOBALS[$n]=$v;
  $pa=array('pid'=>77,'type'=>0,'hp'=>300,'mhp'=>400,'sp'=>250,'msp'=>400,'att'=>100,'def'=>100,'lvl'=>8,'money'=>250,'name'=>'QA_CALLBACK','acquired_list'=>array(),'parameter_list'=>array());$input=$pa;
  mt_srand(42);$call=$r['module'].'\\'.$r['name'];$returned=$call($pa);$next=mt_rand();
  $cases[]=array('module'=>$r['module'],'name'=>$r['name'],'variables'=>ordered_pack($variables),'input'=>ordered_pack($input),'result'=>ordered_pack($pa),'returned'=>ordered_pack($returned),'nextRandom'=>$next);
 }
}
file_put_contents($argv[3],json_encode(array('cases'=>$cases),JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));echo count($cases).' original skill callback cases'.PHP_EOL;
