<?php
// Unmodified 16-layer rs_game + population loops, synthetic configuration and
// explicitly captured storage/effect endpoints. No SQL connection or live data.
if($argc!==4)throw new Exception('Usage: php oracle.php snapshot inventory.json scratch-dir');
$root=realpath($argv[1]);$inventory=json_decode(file_get_contents($argv[2]),true);$out=realpath($argv[3]);if(!$root||!$out||strpos($out,$root)===0)throw new Exception('Unsafe output');
define('GAME_ROOT',$out.'/');@mkdir($out.'/include/modulemng',0700,true);@mkdir($out.'/gamedata/sql',0700,true);
file_put_contents($out.'/include/modulemng/modulemng.config.php','<?php $___MOD_CODE_ADV2=0; $___MOD_CODE_ADV1=0;');
file_put_contents($out.'/gamedata/sql/players.sql','RESET_PLAYERS');file_put_contents($out.'/gamedata/sql/shopitem.sql','RESET_SHOP');
require $root.'/include/modules/modules.func.php';date_default_timezone_set('UTC');
$globalNames='gametype,starttime,now,arealist,areanum,areatime,hack,areawarn,weather,validnum,alivenum,deathnum,gamevars,roomvars,plsinfo,plsinfo11,area_on_start,dangerous_zone,areaadd,areainterval,all_plsno_cache,tutorial_areahour_augment,tutorial_allowed_weather,randrecipe_allow_mode,db,tablepre,npcinit,map_noitemdrop_arealist';
foreach(array('sys','map','player','npc','lvlctl','skillbase','itemmain','itemshop','trap','weather','instance11','tutorial','randrecipe')as $m)define('IMPORT_MODULE_'.strtoupper($m).'_GLOBALS','global $'.str_replace(',',',$',$globalNames).';');
foreach(array('sys','map','instance11')as $m){define('MOD_'.strtoupper($m),true);}
function array_randompick($a,$num=1){$key=array_rand($a,$num);if(!is_array($key))return $a[$key];$out=array();foreach($key as $k)$out[$k]=$a[$k];return $out;}
function packed($v){if(!is_array($v))return $v;$a=array();foreach($v as $k=>$x)$a[]=array($k,packed($x));return array('array'=>$a);}
class WorldDb {
 function queries($sql){global $trace;$trace[]=$sql;}
 function query($sql){global $trace;if(strpos($sql,'DELETE')===0){$trace[]='deleteNpcs';return array();}if(strpos($sql,'SELECT pid')===0){$trace[]='npcOwner';return strpos($sql,"name='owner'")!==false?array(array('pid'=>88)):array();}
  if(!preg_match('/INSERT INTO isolated_(mapitem|maptrap|shopitem).* VALUES (.*)/s',$sql,$m))throw new Exception('Unexpected test SQL');
  preg_match_all('/\((.*?)\)/s',$m[2],$rows);$values=array();foreach($rows[1]as $row)$values[]=array_map('trim',str_getcsv($row,',',"'",'\\'));$trace[]=array($m[1],$values);return array();
 }
 function num_rows($rows){return count($rows);}function fetch_array(&$rows){return array_shift($rows);}function array_insert($table,$npc){global $trace;$trace[]=array('insertNpc',$npc);}
}
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
$needed=array('rs_game','rs_areatime','get_area_interval','get_all_plsno','get_area_wavenum','get_current_area','get_current_not_area','get_safe_plslist','lay_mapitem');
foreach($inventory['modules']as $m)foreach($m['functions']as $f){if(!in_array($f['name'],$needed,true)||($f['name']==='lay_mapitem'&&$f['module']!=='itemmain'))continue;eval('namespace '.$f['module'].' {'.extract_source_function($root.'/'.$f['path'],$f['name']).'}');hook_register($f['module'],$f['name']);}
eval('namespace npc {function get_npclist(){return array(1=>array("num"=>2,"mhp"=>100,"sub"=>array(1=>array("name"=>"A"),3=>array("name"=>"B"),8=>array("name"=>"C"))),2=>array("num"=>3,"sub"=>array(2=>array("name"=>"D"),5=>array("name"=>"E"))),14=>array("num"=>1,"sub"=>array(1=>array("name"=>"VIP"))));}function check_initnpcadd($type){return 1;}function init_npcdata($npc,$safe){$npc["pls"]=empty($safe)?0:array_randompick($safe);return $npc;}}');
eval('namespace player {function player_format_with_db_structure($npc){unset($npc["num"]);return $npc;}}');
eval('namespace itemmain {function get_itemfilecont(){return array("HEADER","0,99,2,随机面包,HH,100,3,,","99,2,1,固定药,HS,50,1,,","98,1,1,后续,HH,1,1,,","=ignored,comment","0,1,1,空物品,HH,1,0,,");}function itemlist_data_process($data){return $data;}function mapitem_row_data_seperate($line,$i){return explode(",",$line);}function mapitem_single_data_attr_process($a,$b,$c,$d,$e,$place,$count){return array($a,$b,$c,$count===1?0:$d,$e,$place);}}');
eval('namespace itemshop {function get_shopconfig(){return array();}function get_shopitem_list($file){return array(array("1","2","50","0","测试商品","HH","10","1",""));}}');
eval('namespace trap {function get_trapfilecont(){return array("HEADER","0,99,2,地雷,TN,20,1,=owner","99,2,1,固定陷阱,TN,10,1,=missing","98,1,1,不刷,TN,1,1,");}}');
eval('namespace randrecipe {function create_randrecipe_config($n){global $trace;$trace[]=array("recipe",$n,rand(0,99));}}');
$cases=array();
foreach(array(0,1,10,13,15,16,17,19,20,21)as $gametype)foreach(array(0,2,4,8,16,32,63)as $mask)foreach(array(1,42)as $seed){
 $trace=array();$starttime=$now=1793232123;$arealist=array(0,1,2,3,4,5,21,26,33,34);$areanum=1;$areatime=0;$hack=$areawarn=7;$weather=99;$validnum=7;$alivenum=6;$deathnum=5;$gamevars=array();$roomvars=array('current_game_option'=>array('area-mode'=>'extreme'));
 $plsinfo=array();foreach($arealist as $n)$plsinfo[$n]='place'.$n;$plsinfo11=array(101=>'a',102=>'b',103=>'c',104=>'d');$area_on_start=array(0);$dangerous_zone=array(0,34);$areaadd=4;$areainterval=array(0=>30,19=>10);$all_plsno_cache=array();$tutorial_areahour_augment=22075200;$tutorial_allowed_weather=array(0,2);$randrecipe_allow_mode=array(20);$tablepre='isolated_';$db=new WorldDb();$npcinit=array('mhp'=>50,'type'=>0,'name'=>'default');$map_noitemdrop_arealist=array(0,34);
 foreach(array('gametype','arealist','areanum')as $key)$GLOBALS['___LOCAL_SYS__VARS__'.$key]=&$GLOBALS[$key];foreach(array('plsinfo','area_on_start','dangerous_zone','areaadd','areainterval','all_plsno_cache')as $key)$GLOBALS['___LOCAL_MAP__VARS__'.$key]=&$GLOBALS[$key];$GLOBALS['___LOCAL_INSTANCE11__VARS__plsinfo11']=&$plsinfo11;
 mt_srand($seed);\sys\rs_game($mask);$next=mt_rand();
 $state=array();foreach(array('arealist','areanum','areatime','hack','areawarn','weather','validnum','alivenum','deathnum','gamevars','area_on_start')as $key)$state[$key]=$GLOBALS[$key];
 $cases[]=array('gametype'=>$gametype,'mask'=>$mask,'seed'=>$seed,'result'=>packed($state),'trace'=>packed($trace),'nextRandom'=>$next);
}
file_put_contents($out.'/world.json',json_encode(array('cases'=>$cases),JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));echo count($cases).' full source world-init cases'.PHP_EOL;
