<?php
if($argc!==4)throw new Exception('Usage: php oracle.php snapshot inventory.json scratch-dir');
$root=realpath($argv[1]);$inventory=json_decode(file_get_contents($argv[2]),true);$out=realpath($argv[3]);if(!$root||!$out||strpos($out,$root)===0)throw new Exception('Unsafe output');
define('GAME_ROOT',$out.'/');@mkdir($out.'/include/modulemng',0700,true);file_put_contents($out.'/include/modulemng/modulemng.config.php','<?php $___MOD_CODE_ADV2=0; $___MOD_CODE_ADV1=0;');require $root.'/include/modules/modules.func.php';
foreach(array('skillbase','player','logger')as $m)define('IMPORT_MODULE_'.strtoupper($m).'_GLOBALS','global $pid,$ppid,$acquired_list,$parameter_list,$sdata,$log;');
function pack_value($v){if(!is_array($v))return $v;$a=array();foreach($v as $k=>$x)$a[]=array($k,pack_value($x));return array('array'=>$a);}
function extract_source_function($path,$wanted){
 $tokens=token_get_all(file_get_contents($path));$n=count($tokens);
 for($i=0;$i<$n;$i++)if(is_array($tokens[$i])&&$tokens[$i][0]===T_FUNCTION){
  $name=null;for($j=$i+1;$j<$n;$j++){if(is_array($tokens[$j])&&$tokens[$j][0]===T_STRING){$name=strtolower($tokens[$j][1]);break;}if($tokens[$j]==='(')break;}
  if($name!==$wanted)continue;$body='';$depth=0;$opened=false;
  for($j=$i;$j<$n;$j++){$t=$tokens[$j];$body.=is_array($t)?($t[0]===T_DIR?var_export(dirname($path),true):$t[1]):$t;if($t==='{'){$depth++;$opened=true;}elseif(is_array($t)&&in_array($t[0],array(T_CURLY_OPEN,T_DOLLAR_OPEN_CURLY_BRACES)))$depth++;elseif($t==='}'){$depth--;if($opened&&$depth===0)break;}}
  return $body;
 }
 throw new Exception('Function not found: '.$wanted);
}
$needed=array('skill_enabled','skill_enabled_core','skill_query','skill_acquire','check_skill_info','skillbase_set_ppid','skill_delvalue');
foreach($inventory['modules']as $m)foreach($m['functions']as $f){if(!in_array($f['name'],$needed,true))continue;eval('namespace '.$f['module'].' {'.extract_source_function($root.'/'.$f['path'],$f['name']).'}');hook_register($f['module'],$f['name']);}
$tags=array(777=>'club;',778=>'achievement;',779=>'hidden;',780=>'feature;',781=>'debuff;');foreach($tags as $id=>$tag){define('MOD_SKILL'.$id,true);define('MOD_SKILL'.$id.'_INFO',$tag);eval('namespace skill'.$id.' {function acquire'.$id.'(&$pa){$pa["applied"] = 1;}}');}
$cases=array();$flags=array('direct_ignore_skills','skill46_flag','skill575_flag','skill440_flag','skill433_flag');
foreach(range(0,31)as $mask)foreach(array(777,778,779,780)as $id)foreach(array(0,1)as $shield)foreach(array(0,1)as $evolved){
 $pid=0;$ppid=0;$log='';$pa=array('pid'=>77,'acquired_list'=>array($id=>1,513=>$shield),'npc_evolved'=>$evolved);foreach($flags as $i=>$flag)$pa[$flag]=($mask>>$i)&1;$input=$pa;
 $result=\skillbase\skill_query($id,$pa);$cases[]=array('kind'=>'query','id'=>$id,'input'=>pack_value($input),'result'=>$result,'player'=>pack_value($pa),'log'=>$log);
}
foreach(array(0,1)as $a)foreach(array(0,1)as $b)foreach(array(0,1)as $disable){$pid=$ppid=0;$log='';$pa=array('pid'=>77,'acquired_list'=>array(461=>$a,803=>$b),'parameter_list'=>array(),'direct_ignore_skills'=>$disable);$input=$pa;$result=\skillbase\skill_acquire(781,$pa);$cases[]=array('kind'=>'acquire','id'=>781,'input'=>pack_value($input),'result'=>$result,'player'=>pack_value($pa),'log'=>$log);}
file_put_contents($out.'/skill-rules.json',json_encode(array('tags'=>$tags,'cases'=>$cases),JSON_UNESCAPED_UNICODE));echo count($cases).' actual skill immunity/disable cases'.PHP_EOL;
