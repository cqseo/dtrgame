<?php
// Executes unchanged enter_battlefield with explicit synthetic effect/DB ports.
// Tests orchestration, not the effects themselves. Does not load production data.
if($argc!==3)throw new Exception('Usage: php oracle.php snapshot scratch-dir');
$root=realpath($argv[1]);$out=realpath($argv[2]);if(!$root||!$out||strpos($out,$root)===0)throw new Exception('Unsafe output');
define('GAME_ROOT',$out.'/');define('MOD_CARDBASE',true);@mkdir($out.'/include',0700,true);file_put_contents($out.'/include/user.func.php','<?php // Account helpers supplied by the test port.');
require $root.'/include/valid.func.php';
function import_module(){return 'global $validnum,$alivenum,$hplimit,$splimit,$now,$gametype,$gamestate,$gamenum,$validlimit,$room_prefix,$roomvars,$cuser,$cudata,$db,$tablepre;';}
function create_storedpass($u,$p){return md5($u.$p);}
function gexit($message){throw new Exception($message);}
function array_randompick($array){global $trace;$trace[]='chooseSpawn';return $array[array_rand($array)];}
function fetch_udata_by_username($name,$columns=''){global $trace,$cudata;$trace[]='account';return $cudata;}
function update_udata_by_username($changes,$user){global $trace,$updates;$trace[]='updateAccount';$updates=$changes;}
function addnews($time,$type,$name,$identity){global $trace,$news;$trace[]='news';$news=array($time,$type,$name,$identity);}
function save_gameinfo(){global $trace;$trace[]='saveGame';}
class AdmissionDb {function array_insert($table,$data){global $trace,$inserted;$trace[]='insertPlayer';$inserted=$data;}}
eval('namespace sys {function load_gameinfo(){global $trace;$trace[]="loadGame";}function get_valid_disp_user_info($p){global $trace;$trace[]="displayIdentity";return array($p["name"],"synthetic identity");}}');
eval('namespace map {function get_safe_plslist(){global $trace;$trace[]="safeSpawn";return array(1,2,3);}function get_area_wavenum(){global $trace;$trace[]="areaWave";return 2;}function check_in_forbidden_area($place){global $trace;$trace[]="forbidden:".$place;return $place===0;}function get_all_plsno(){global $trace;$trace[]="allPlaces";return array(0,1,2,3);}}');
eval('namespace player {function get_icon_num_random($gd){global $trace;$trace[]="randomIcon";return rand(1,5);}function fetch_playerdata($name){global $trace,$inserted;$trace[]="fetchPlayer";return array_merge($inserted,array("pid"=>77));}function post_enterbattlefield_events(&$p){global $trace,$postPlace;$trace[]="postEnter";$p["pls"]=$postPlace;$p["hp"]-=7;}function player_save($p){global $trace,$saved;$trace[]="savePlayer";$saved=$p;}}');
eval('namespace itemmain {function init_enter_battlefield_items($p){global $trace;$trace[]="initialItems";$p["itm1"]="synthetic item";return $p;}}');
eval('namespace cardbase {function get_enter_battlefield_card($card){global $trace;$trace[]="chooseCard";return $card;}function enter_battlefield_cardproc($p,$card){global $trace,$cardPlace;$trace[]="applyCard:".$card;$p["card"]=$card;$p["pls"]=$cardPlace;$p["gamevars"]=array("test"=>1);if($card===2){$p["o_card"]=2;$p["cardchange"]=1;}return array($p,array(4=>1),"synthetic prefix");}function get_cardlist_energy_from_udata($u){return array(array(1,2,154),array(),array());}function check_card_in_ownlist($c,$cards){global $trace;$trace[]="cardOwned:".$c;return in_array($c,$cards);}}');
$cases=array();
foreach(array(1,42)as $seed)foreach(array(1,6)as $group)foreach(array(0,2,99)as $cardPlace)foreach(array(0,3,99)as $postPlace){
 $trace=array();$updates=array();$saved=$inserted=null;$news=array();$db=new AdmissionDb();$tablepre='isolated_';$now=1793232000;$validnum=1;$alivenum=1;$hplimit=400;$splimit=400;$gametype=10;$gamestate=$group===6?30:20;$gamenum=27;$validlimit=2;$room_prefix='s9';$roomvars=array('current_game_option'=>array());$gamefounder='';$cuser='QA_OWNER';
 $cudata=array('username'=>'QA_OWNER','password'=>'synthetic-digest','groupid'=>$group,'motto'=>'motto','killmsg'=>'killmsg','lastword'=>'lastword','cardlist'=>'','card_data'=>'');
 $input=array('username'=>'QA_OWNER','password'=>'synthetic-digest','gender'=>'m','icon'=>0,'card'=>2,'ip'=>'192.0.2.1');
 mt_srand($seed);enter_battlefield($input['username'],$input['password'],$input['gender'],$input['icon'],$input['card'],$input['ip']);
 $cases[]=array('seed'=>$seed,'group'=>$group,'cardPlace'=>$cardPlace,'postPlace'=>$postPlace,'input'=>$input,'inserted'=>$inserted,'saved'=>$saved,'updates'=>$updates,'news'=>$news,'trace'=>$trace,'validnum'=>$validnum,'alivenum'=>$alivenum,'gamestate'=>$gamestate);
}
file_put_contents($out.'/admission.json',json_encode(array('sourceSha256'=>hash_file('sha256',$root.'/include/valid.func.php'),'cases'=>$cases),JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));echo count($cases).' source admission orchestration cases'.PHP_EOL;
