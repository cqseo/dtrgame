<?php
// Executes the original command page in a disposable oracle directory. All SQL,
// heartbeat, broadcasts and cookies are test ports; no database is connected.
if($argc!==4)throw new Exception('Usage: php oracle.php snapshot scratch-dir installed-root');
$root=realpath($argv[1]);$scratch=realpath($argv[2]);$installed=realpath($argv[3]);
if(!$root||!$scratch||!$installed||strpos($scratch,$root)===0||strpos($scratch,$installed)===0)throw new Exception('Unsafe oracle directory');
define('IN_GAME',true);define('GAME_ROOT',$scratch.'/');define('CURSCRIPT','roomcmd');
@mkdir($scratch.'/include/roommng',0700,true);@mkdir($scratch.'/gamedata/tmp/rooms',0700,true);
touch($scratch.'/gamedata/tmp/rooms/9.txt');
copy($root.'/include/roommng/roommng.config.php',$scratch.'/include/roommng/roommng.config.php');
copy($installed.'/include/roommng/quickmatch.config.php',$scratch.'/include/roommng/quickmatch.config.php');
file_put_contents($scratch.'/include/roommng/roommng.config.php',"\nrequire __DIR__.'/quickmatch.config.php';",FILE_APPEND);
file_put_contents($scratch.'/include/roommng/roommng.func.php','<?php // Functions are imported unmodified below.');
copy($root.'/include/pages/command_roomcmd.php',$scratch.'/command.php');
function source_function($file,$wanted){
  $tokens=token_get_all(file_get_contents($file));$n=count($tokens);
  for($i=0;$i<$n;$i++)if(is_array($tokens[$i])&&$tokens[$i][0]===T_FUNCTION){
    $name='';for($j=$i+1;$j<$n;$j++)if(is_array($tokens[$j])&&$tokens[$j][0]===T_STRING){$name=$tokens[$j][1];break;}
    if(!in_array($name,$wanted,true))continue;
    $code='';$depth=0;$opened=false;
    for($j=$i;$j<$n;$j++){$t=$tokens[$j];$s=is_array($t)?$t[1]:$t;$code.=$s;if($t==='{'){$depth++;$opened=true;}elseif(is_array($t)&&in_array($t[0],array(T_CURLY_OPEN,T_DOLLAR_OPEN_CURLY_BRACES)))$depth++;elseif($t==='}'){$depth--;if($opened&&$depth===0)break;}}
    eval($code);
  }
}
function import_module($names){return 'global $cuser,$now;';}
source_function($root.'/include/roommng/roommng.func.php',array('room_init','room_init_game_option','room_get_vars','room_participant_get','room_upos_check','room_auto_kick_check','room_refresh_team_pos','room_owner_takeover_apply','room_creater_check','room_team_leader_check','room_new_chat','room_timestamp_tick','update_roomstate','room_check_game_option','room_set_game_option'));
source_function($root.'/include/roommng/room.func.php',array('room_check_subroom','room_prefix_kind','room_prefix2id'));
class OracleStop extends Exception{}
function gexit($message,$file='',$line=0){throw new OracleStop($message);}
function gencode($data){return json_encode($data);}
function gdecode($data,$assoc=1){return json_decode($data,true);}
function fetch_roomdata($id){global $oracleRow;return $oracleRow;}
function room_owner_heartbeat_touch($id){global $oracleEffects;$oracleEffects['heartbeat']='touch';}
function room_owner_heartbeat_path($id){global $oracleEffects;$oracleEffects['heartbeat']='clear';return GAME_ROOT.'gamedata/tmp/rooms/test-only-heartbeat';}
function room_owner_is_inactive($id,$grace){global $oracleInactive;return $oracleInactive;}
function set_current_roomid($id){global $oracleEffects;$oracleEffects['leave']=$id===0;}
function room_save_broadcast($id,&$data){global $oracleEffects,$oracleRow;update_roomstate($data,$oracleRow['groomstatus']>=40);$oracleEffects['save']=true;if($data['readystat']===2){$oracleEffects['start']=true;throw new OracleStop('__start_boundary__');}}
class OracleDatabase{function query($sql){global $oracleEffects;if(strpos($sql,'groomstatus=0')!==false)$oracleEffects['close']=true;else throw new Exception('Unexpected SQL in room oracle');}}
require $scratch.'/include/roommng/roommng.config.php';chdir($scratch);
$cases=array();$cuser='QA_OWNER';
foreach($roomtypelist as $id=>$type){
 if(!empty($type['soleroom']))continue;
 $base=room_init($id);$base['player'][0]['name']='QA_OWNER';if(count($base['player'])>1)$base['player'][1]['name']='QA_OTHER';
 $commands=array(array('newchat','hello',''),array('pos_enter','1',''),array('pos_enter','2',''),array('pos_enter','0',''),array('pos_kick','1',''),array('pos_disable','all',''),array('pos_disable','1',''),array('pos_enable','1',''),array('game-option','card-select','1'),array('rmsetmode','14',''),array('leave','',''),array('takeover','',''),array('ready','',''));
 foreach($commands as $cmd)foreach(array('QA_OWNER','QA_OTHER','QA_GUEST') as $user)foreach(array(false,true) as $inactive){
  $state=$base;
  $run=function($state,$cmd,$user,$inactive)use($scratch){
    global $roomtypelist,$cuser,$now,$oracleEffects,$oracleRow,$oracleInactive;
    $cuser=$user;$now=time();$room_prefix='s9';$room_id=9;$gtablepre='acbra2_';$gamestate=0;$not_ajax=0;$not_ready_command_flag=0;$disable_newgame=$disable_newroom=false;
    list($command,$para1,$para2)=$cmd;$roomdata=$state;$oracleRow=array('groomid'=>9,'groomstatus'=>10,'groomtype'=>$state['roomtype'],'roomvars'=>json_encode($state));$oracleInactive=$inactive;
    $oracleEffects=array('heartbeat'=>null,'save'=>false,'leave'=>false,'close'=>false,'start'=>false);$db=new OracleDatabase();$error=null;
    ob_start();$before=time();try{include $scratch.'/command.php';}catch(OracleStop $e){if($e->getMessage()!=='__start_boundary__')$error=$e->getMessage();}$after=time();ob_end_clean();
    return array('result'=>$roomdata,'effects'=>$oracleEffects,'error'=>$error,'before'=>$before,'after'=>$after);
  };
  $result=$run($state,$cmd,$user,$inactive);$cases[]=array_merge(array('state'=>$state,'command'=>$cmd[0],'p1'=>$cmd[1],'p2'=>$cmd[2],'user'=>$user,'inactive'=>$inactive),$result);
 }
}
file_put_contents($scratch.'/commands.json',json_encode(array('sourceSha256'=>hash_file('sha256',$root.'/include/pages/command_roomcmd.php'),'cases'=>$cases),JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
echo count($cases).' command oracle cases'.PHP_EOL;
