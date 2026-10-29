<?php
// Actual 14-layer admission hook chain with explicit synthetic effect adapters.
if($argc!==4)throw new Exception('Usage: php oracle.php snapshot inventory.json scratch-dir');
$root=realpath($argv[1]);$inventory=json_decode(file_get_contents($argv[2]),true);$out=realpath($argv[3]);
if(!$root||!$out||strpos($out,$root)===0)throw new Exception('Unsafe output');
define('GAME_ROOT',$out.'/');@mkdir($out.'/include/modulemng',0700,true);file_put_contents($out.'/include/modulemng/modulemng.config.php','<?php $___MOD_CODE_ADV2=0; $___MOD_CODE_ADV1=0;');
require $root.'/include/modules/modules.func.php';
foreach(array('sys','player','skillbase','cardbase','achievement_base')as $module)define('IMPORT_MODULE_'.strtoupper($module).'_GLOBALS','global $gametype,$now,$starttime,$validnum,$gamevars,$roomvars,$cards,$valid_skills,$achlist,$ach_allow_mode,$cudata,$db,$tablepre;');
foreach(array(4,12,569,577,584,714,952,1003,1006,1001,901)as $id)define('MOD_SKILL'.$id,true);
define('MOD_SKILL4_INFO','club;');define('MOD_SKILL12_INFO','club;');define('MOD_SKILL584_INFO','card;');
function packed($v){if(!is_array($v))return $v;$a=array();foreach($v as $k=>$x)$a[]=array($k,packed($x));return array('array'=>$a);}
function save_gameinfo(){global $trace;$trace[]='saveGame';}
function addnews(...$args){global $trace;$trace[]=array('news',$args);}
class TestDb {function query($sql){global $trace;$trace[]='query';return array();}function num_rows($result){return 0;}}
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
foreach($inventory['hooks']['post_enterbattlefield_events']as $f){eval('namespace '.$f['module'].' {'.extract_source_function($root.'/'.$f['path'],$f['name']).'}');hook_register($f['module'],$f['name']);}
eval('namespace skillbase {function skill_query($id,&$p){return !empty($p["acquired_list"][$id]);}function skill_acquire($id,&$p){global $trace;$trace[]=array("acquire",$id);$p["acquired_list"][$id]=1;}function skill_lost($id,&$p){global $trace;$trace[]=array("lost",$id);$p["acquired_list"][$id]=0;}function skill_setvalue($id,$key,$value,&$p){global $trace;$trace[]=array("set",$id,$key,$value);$p["parameter_list"][$id."_".$key]=$value;}function get_acquired_skill_array(&$p){return array_keys(array_filter($p["acquired_list"]));}function check_skill_info($id,$tag){return false;}}');
eval('namespace skill569 {function lost569(&$p){global $trace;$trace[]="lost569";}}');
eval('namespace skill577 {function lost577(&$p){global $trace;$trace[]="lost577";}}');
eval('namespace skill952 {function skill952_sendin_core($item,&$p){global $trace;$trace[]=array("senditem",$item);}}');
eval('namespace cardbase {function get_cardlist_energy_from_udata($u){return array(array(),array(),array(0=>array("blink"=>2)));}}');
eval('namespace achievement_base {function check_achtype_available($type){return 1;}}');
eval('namespace skill960 {function get_rand_task(&$p,$a,$b){global $trace;$trace[]=array("task",$a,$b);}}');
$cases=array();foreach(array(0,10,13,17,19,20,21)as $gametype)foreach(array(false,true)as $active){
 $trace=array();$now=1793232000;$starttime=$now-100;$validnum=7;$gamevars=array();$roomvars=array('current_game_option'=>array('lvl'=>15));$cards=array(0=>array('valid'=>array('gamevars'=>array('from_card'=>3))));$valid_skills=array($gametype=>array(1001));$achlist=array('normal'=>array(901));$ach_allow_mode=array(0=>array(0,10,13,17,19,20,21));$cudata=array();$db=new TestDb();$tablepre='isolated_';
 $pa=array('pid'=>77,'type'=>0,'name'=>'QA_POST','hp'=>400,'pls'=>1,'card'=>0,'skills'=>array(4=>array('lvl'=>2),12=>1),'acquired_list'=>$active?array(569=>1,577=>1,584=>1,714=>1,952=>1):array(),'parameter_list'=>array());
 $input=$pa;\player\post_enterbattlefield_events($pa);
 $cases[]=array('gametype'=>$gametype,'input'=>packed($input),'result'=>packed($pa),'trace'=>packed($trace),'gamevars'=>packed($gamevars));
}
file_put_contents($out.'/post-admission.json',json_encode(array('cases'=>$cases),JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE));echo count($cases).' full source admission hook-chain cases'.PHP_EOL;
