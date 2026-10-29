<?php
// Reads only allowlisted public gameplay configs, never server/account files.
if($argc!==4)throw new Exception('Usage: php oracle.php snapshot inventory.json scratch-dir');
$root=realpath($argv[1]);$inventory=json_decode(file_get_contents($argv[2]),true);$out=realpath($argv[3]);if(!$root||!$out||strpos($out,$root)===0)throw new Exception('Unsafe output');
define('GAME_ROOT',$out.'/');@mkdir($out.'/include/modulemng',0700,true);file_put_contents($out.'/include/modulemng/modulemng.config.php','<?php $___MOD_CODE_ADV2=0; $___MOD_CODE_ADV1=0;');require $root.'/include/modules/modules.func.php';
function packed($v){if(!is_array($v))return $v;$a=array();foreach($v as $k=>$x)$a[]=array($k,packed($x));return array('array'=>$a);}
$files=array();function openfile($file){global $files,$root;$s=file_get_contents($file);$rows=explode('<:game:>',str_replace("\n","\n<:game:>",$s));$last=count($rows)-1;if($rows[$last]===''||$rows[$last]==="\r")unset($rows[$last]);if(!$rows)$rows=array('');$files[substr($file,strlen($root)+1)]=$rows;return $rows;}
eval('namespace achievement_base {function check_achtype_available($type){global $eventOn;return $eventOn?1:0;}}');
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
$needed=array('get_npclist','get_itemfilecont','get_shopconfig','get_trapfilecont');$modulePaths=array();$data=array();$hashes=array();
foreach($inventory['modules']as $m){
 $modulePaths[$m['name']]=$m['path'];
 foreach($m['files']as $file){
  if(!preg_match('#/config/(npc.data.config.php|specialnpc.config.php)$#',$file['path']))continue;
  $before=array_keys(get_defined_vars());require $root.'/'.$file['path'];$after=get_defined_vars();
  foreach(array_diff(array_keys($after),$before)as $key){if(strpos($key,'npc')===0||$key==='snpcinfo')$data[$m['name']][$key]=$after[$key];}
  $hashes[$file['path']]=hash_file('sha256',$root.'/'.$file['path']);
 }
 foreach($m['functions']as $f){if(!in_array($f['name'],$needed,true))continue;eval('namespace '.$f['module'].' {'.extract_source_function($root.'/'.$f['path'],$f['name']).'}');hook_register($f['module'],$f['name']);}
}
$globals=array('gametype','roomvars','eventOn');foreach($data as $m=>$vars)foreach($vars as $k=>$value)$globals[]=$k;
foreach(array_merge(array_keys($data),array('sys','map','itemmain','itemshop','trap'))as $m)if(!defined('IMPORT_MODULE_'.strtoupper($m).'_GLOBALS'))define('IMPORT_MODULE_'.strtoupper($m).'_GLOBALS','global $'.implode(',$',$globals).';');
$cases=array();foreach(array(0,1,4,10,13,15,16,17,18,19,20,21)as $gametype)foreach(array(0,11)as $level)foreach(array(false,true)as $eventOn){
 $roomvars=array('current_game_option'=>array('lvl'=>$level));$npc=\npc\get_npclist();$map=\itemmain\get_itemfilecont();$shop=\itemshop\get_shopconfig();$trap=\trap\get_trapfilecont();
 $cases[]=array('gametype'=>$gametype,'level'=>$level,'eventOn'=>$eventOn,'npc'=>packed($npc),'map'=>$map,'shop'=>$shop,'trap'=>$trap);
}
foreach($files as $path=>$rows)$hashes[$path]=hash_file('sha256',$root.'/'.$path);
file_put_contents($out.'/world-configs.json',json_encode(array('sourceHashes'=>$hashes,'modulePaths'=>$modulePaths,'npcConfigs'=>packed($data),'files'=>$files,'cases'=>$cases),JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));echo count($cases).' source world configuration cases; '.count($files).' raw table files'.PHP_EOL;
