<?php
// Actual installed item initialization hooks and __MAGIC__, synthetic players.
// Source code/config are read only; no DB or player data is loaded.
if($argc!==4)throw new Exception('Usage: php oracle.php snapshot inventory.json scratch-dir');
$root=realpath($argv[1]);$inventory=json_decode(file_get_contents($argv[2]),true);$out=realpath($argv[3]);
if(!$root||!$out||strpos($out,$root)===0)throw new Exception('Unsafe oracle output');
define('GAME_ROOT',$out.'/');@mkdir($out.'/include/modulemng',0700,true);
file_put_contents($out.'/include/modulemng/modulemng.config.php','<?php $___MOD_CODE_ADV2=0; $___MOD_CODE_ADV1=0;');
require $root.'/include/modules/modules.func.php';
define('IMPORT_MODULE_SYS_GLOBALS','global $gametype,$elorated_mode,$roomvars;');
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
$needed=array('init_enter_battlefield_items','get_startingitemfilecont','get_startingwepfilecont','startingitem_row_data_seperate','startingitem_row_data_process','config_process_encode_comp_itmsk','config_process_encode_comp_itmsk_callback','config_process_encode_comp_itmsk_sepr_transfer','config_process_encode_comp_itmsk_sepr_transfer_callback','base64_encode_comp_itmsk');
$bodies=array();
foreach($inventory['modules'] as $module)foreach($module['functions'] as $f){
 if(!in_array($f['name'],$needed,true))continue;
 $body=extract_source_function($root.'/'.$f['path'],$f['name']);
 eval('namespace '.$f['module'].' {'.$body.'}');hook_register($f['module'],$f['name']);$bodies[]=$f;
}
eval('namespace itemmain { function rand($min,$max){global $rolls;$value=\\mt_rand($min,$max);$rolls[]=array($min,$max,$value);return $value;} }');
$files=array();
function openfile($path){global $files,$root;$data=file_get_contents($path);$lines=explode('<:game:>',str_replace("\n","\n<:game:>",$data));$last=count($lines)-1;if($lines[$last]===''||$lines[$last]==="\r")unset($lines[$last]);if(empty($lines))$lines=array('');$files[substr($path,strlen($root)+1)]=$lines;return $lines;}
require $root.'/include/modules/core/sys/config/gamemode.config.php';
$cases=array();
foreach(array(0,1,10,13,14,17,18,19,20,21) as $gametype)foreach(array(0,14,22,26,30) as $level)foreach(array('m','f') as $gender)foreach(array(1,42,99) as $seed){
 $roomvars=array('current_game_option'=>array('lvl'=>$level));$input=array('gd'=>$gender,'money'=>20,'artsk'=>'^res_<:comp_itmsk:>{中文,PB2}1');$rolls=array();mt_srand($seed);$result=\itemmain\init_enter_battlefield_items($input);
 $cases[]=array('gametype'=>$gametype,'level'=>$level,'input'=>$input,'rolls'=>$rolls,'result'=>$result);
}
file_put_contents($out.'/starting-items.json',json_encode(array('functions'=>$bodies,'files'=>$files,'eloratedModes'=>$elorated_mode,'cases'=>$cases),JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE));
echo count($cases).' starting-item cases; '.count($files).' exact raw source pools'.PHP_EOL;
