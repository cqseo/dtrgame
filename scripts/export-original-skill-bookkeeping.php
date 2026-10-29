<?php
// Original skillbase bookkeeping with synthetic skills only, no DB or modules.
if($argc!==3)throw new Exception('Usage: php oracle.php snapshot output.json');
$root=realpath($argv[1]);define('__MAGIC__','return 0;');define('MOD_SKILL4',true);
require $root.'/include/modules/base/skillbase/main.php';
function import_module(){return 'global $pid,$ppid,$acquired_list,$parameter_list,$sdata;';}
function get_var_in_module($name,$module){global $pid;return $pid;}
eval('namespace player {function update_sdata(){global $trace;$trace[]="update_sdata";}}');
eval('namespace skill4 {function acquire4(&$pa){global $trace;$trace[]="acquire";$pa["hp"]+=10;\\skillbase\\skill_setvalue(4,"count",1,$pa);}function lost4(&$pa){global $trace;$trace[]="lost";$pa["hp"]-=5;}}');
function packed($v){if(!is_array($v))return $v;$a=array();foreach($v as $k=>$x)$a[]=array($k,packed($x));return array('array'=>$a);}
$cases=array();
foreach(array(false,true)as $isCurrent)foreach(array(0,1)as $acquired)foreach(array(0,1)as $noCover)foreach(array('acquire','lost','query')as $operation){
 $pid=88;$ppid=-1;$acquired_list=array(4=>$acquired);$parameter_list=array('4_tsk_expire'=>'123','4_eqpsk_flag'=>1);$trace=array();
 $pa=array('pid'=>$isCurrent?88:77,'hp'=>200,'acquired_list'=>array(4=>$acquired),'parameter_list'=>array('4_tsk_expire'=>'123','4_eqpsk_flag'=>1));$sdata=$pa;$before=$pa;
 if($operation==='acquire')$returned=\skillbase\skill_acquire(4,$pa,$noCover);elseif($operation==='lost')$returned=\skillbase\skill_lost(4,$pa);else $returned=\skillbase\skill_query(4,$pa);
 $cases[]=array('isCurrent'=>$isCurrent,'acquired'=>$acquired,'noCover'=>$noCover,'operation'=>$operation,'input'=>packed($before),'player'=>packed($pa),'globalAcquired'=>packed($acquired_list),'globalParameters'=>packed($parameter_list),'returned'=>$returned,'trace'=>$trace,'ppid'=>$ppid);
}
file_put_contents($argv[2],json_encode(array('cases'=>$cases),JSON_UNESCAPED_UNICODE));echo count($cases).' original skill bookkeeping cases'.PHP_EOL;
