<?php
// Actual card hooks with original dispatcher, original config and seeded RNG.
// Writes cache only beneath a dedicated oracle directory; no database access.
if($argc!==4)throw new Exception('Usage: php oracle.php snapshot inventory.json scratch-dir');
$root=realpath($argv[1]);$inventory=json_decode(file_get_contents($argv[2]),true);$out=realpath($argv[3]);
if(!$root||!$out||strpos($out,$root)===0)throw new Exception('Unsafe output');
define('GAME_ROOT',$out.'/');define('IN_GAME',true);define('IN_GAME_CHECK_STR',"<?php if(!defined('IN_GAME')) exit('Access Denied'); ?>\r\n");
@mkdir($out.'/include/modulemng',0700,true);@mkdir($out.'/gamedata/cache',0700,true);
file_put_contents($out.'/include/modulemng/modulemng.config.php','<?php $___MOD_CODE_ADV2=0; $___MOD_CODE_ADV1=0;');
require $root.'/include/modules/modules.func.php';
define('IMPORT_MODULE_SYS_GLOBALS','global $gametype,$roomvars,$now;');
define('IMPORT_MODULE_CARDBASE_GLOBALS','global $cards,$cardindex,$cardindex_reverse,$card_rarecolor,$packstart,$pack_ignore_kuji,$card_index_file,$card_main_file,$card_config_file;');
function array_randompick($array,$num=1){$key=array_rand($array,$num);if(!is_array($key))return $array[$key];$out=array();foreach($key as $k)$out[$k]=$array[$k];return $out;}
function md5sub($str,$n){return substr(md5($str),0,$n);}
function ordered_pack($v){if(!is_array($v))return $v;$out=array();foreach($v as $k=>$x)$out[]=array($k,ordered_pack($x));return array('array'=>$out);}
eval('namespace map {function check_pls($p){return in_array($p,array(0,1,2,3))?$p:0;}}');
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
$needed=array('get_enter_battlefield_card','enter_battlefield_cardproc','card_valid_info_process','cardchange','enter_battlefield_cardproc_valueproc','skill584_add_flag','skill720_proc','instance3_add_skills','config_process_encode_comp_itmsk','config_process_encode_comp_itmsk_callback','base64_encode_comp_itmsk','parse_card_index','check_pack_availble');
foreach($inventory['modules'] as $module)foreach($module['functions'] as $f){if(!in_array($f['name'],$needed,true))continue;eval('namespace '.$f['module'].' {'.extract_source_function($root.'/'.$f['path'],$f['name']).'}');hook_register($f['module'],$f['name']);}
require $root.'/include/modules/extra/card/cardbase/config/card.config.php';
$card_main_file=$root.'/include/modules/extra/card/cardbase/main.php';$card_config_file=$root.'/include/modules/extra/card/cardbase/config/card.config.php';
$now=1793232000;\cardbase\parse_card_index();require $card_index_file;
$cases=array();$selection=array();
foreach(array(0,1,6,10,13,14,17,18,19,20,21)as $gametype)foreach(array(null,0,4,10,20,30)as $level){$roomvars=array('current_game_option'=>array());if($level!==null)$roomvars['current_game_option']['lvl']=$level;$selection[]=array('gametype'=>$gametype,'level'=>$level,'input'=>344,'result'=>\cardbase\get_enter_battlefield_card(344));}
foreach($cards as $id=>$definition)foreach(array(1,42)as $seed){
 $gametype=10;$roomvars=array('current_game_option'=>array());$player=array('hp'=>400,'mhp'=>400,'sp'=>400,'msp'=>400,'att'=>100,'def'=>100,'money'=>20,'pls'=>1);
 mt_srand($seed);$result=\cardbase\enter_battlefield_cardproc($player,$id);$next=mt_rand();
 $cases[]=array('id'=>$id,'seed'=>$seed,'gametype'=>$gametype,'level'=>null,'input'=>$player,'result'=>ordered_pack($result),'nextRandom'=>$next);
}
foreach(array(0,4,5,8,9,13,22,26,30)as $level){$gametype=13;$roomvars=array('current_game_option'=>array('lvl'=>$level));$player=array('hp'=>400,'mhp'=>400,'sp'=>400,'msp'=>400,'att'=>100,'def'=>100,'money'=>20,'pls'=>1);mt_srand(42);$result=\cardbase\enter_battlefield_cardproc($player,303);$cases[]=array('id'=>303,'seed'=>42,'gametype'=>13,'level'=>$level,'input'=>$player,'result'=>ordered_pack($result),'nextRandom'=>mt_rand());}
file_put_contents($out.'/cards.json',json_encode(array('cards'=>ordered_pack($cards),'index'=>$cardindex,'rareColors'=>$card_rarecolor,'cases'=>$cases,'selection'=>$selection),JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
echo count($cards).' original cards; '.count($cases).' effect cases'.PHP_EOL;
