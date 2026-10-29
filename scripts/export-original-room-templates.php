<?php
// Reads original presentation only; writes compiled oracle output outside source.
if($argc!==4) throw new Exception('Usage: php script.php snapshot output-dir installed-presentation-root');
$root=realpath($argv[1]);$out=realpath($argv[2]);$installed=realpath($argv[3]);
if(!$root||!$out||!$installed||strpos($out,$root)===0||strpos($out,$installed)===0)throw new Exception('Invalid output directory');
define('IN_GAME',true);define('GAME_ROOT',$root.'/');define('CURSCRIPT','index');
function import_module($name){return 'global $now;';}
require $root.'/include/template.func.php';
require $root.'/include/roommng/roommng.config.php';
require $installed.'/include/roommng/quickmatch.config.php';
require $root.'/include/roommng/roommng.func.php';
require $root.'/include/roommng/room.func.php';
require $root.'/include/bubblebox.func.php';
require $root.'/templates/default/templates.lang.php';
require $root.'/include/modules/core/sys/config/resources.config.php';
require $root.'/include/modules/core/sys/config/version.config.php';
require $root.'/include/modules/core/map/config/map.config.php';
require $root.'/include/modules/core/sys/config/gamemode.config.php';
function language($name,$id=1,$dir=''){return GAME_ROOT.'templates/default/'.$name.'.lang.php';}
function template($name){global $out;return $out.'/'.$name.'.php';}
$modules=file($root.'/gamedata/modules.list.php',FILE_IGNORE_NEW_LINES);
foreach($modules as $line){$parts=explode(',',$line);if(count($parts)>=3 && (int)$parts[2]===1)define('MOD_'.strtoupper($parts[0]),true);}
$names=array('header','footer','index','room','roomlist','roommain','roomteam','roomslot','roomslot_s','room_newroom','room_setmode','bubblebox_start','bubblebox_end');
$compiled=array();$sources=array();
foreach($names as $name){
  // The site adds type 14 to one roomteam condition; other templates match snapshot.
  $path=($name==='roomteam'?$installed:$root).'/templates/default/'.$name.'.htm';
  parse_template($path,$out.'/'.$name.'.php',1,'templates/default');
  $compiled[$name]=file_get_contents($out.'/'.$name.'.php');
  $sources[$name]=array('path'=>'templates/default/'.$name.'.htm','sha256'=>hash_file('sha256',$path));
}
$cuser='QA_OWNER';$now=time();$cases=array();
foreach($roomtypelist as $type=>$settings){
  $roomdata=room_init($type);$roomdata['player'][0]['name']=$cuser;
  foreach(array(-1,0,1) as $position) foreach(array(0,1,2) as $readystat){
    if($position>=count($roomdata['player']))continue;
    $roomdata['readystat']=$readystat;$roomdata['kicktime']=$now+90;
    $context=array('roomdata'=>$roomdata,'room_id'=>9,'room_prefix'=>'s9','upos'=>$position,'roomtypelist'=>$roomtypelist,'max_private_room_num'=>$max_private_room_num);
    $render=function($name,$context){extract($context);ob_start();include template($name);return ob_get_clean();};
    $before=time();$html=$render('roommain',$context);$after=time();
    $cases[]=array('name'=>'roommain','context'=>$context,'html'=>$html,'before'=>$before,'after'=>$after);
  }
}
foreach(array('room','room_newroom','room_setmode') as $name){
  $roomdata=room_init(14);$roomdata['player'][0]['name']=$cuser;
  $context=array('roomdata'=>$roomdata,'room_id'=>9,'room_prefix'=>'s9','upos'=>0,'roomtypelist'=>$roomtypelist,'max_private_room_num'=>$max_private_room_num);
  $before=time();$html=$render($name,$context);$after=time();
  $cases[]=array('name'=>$name,'context'=>$context,'html'=>$html,'before'=>$before,'after'=>$after);
}
$publicDefaults=array_intersect_key(get_defined_vars(),array_flip(array('gameversion','gamecredits','gtinfo','gstate','gwin','areainterval','areaadd','arealimit','areaesc','max_private_room_num')));
foreach(array(false,true) as $signedIn)foreach(array(false,true) as $inside){
  $roomdata=room_init(14);$roomdata['player'][0]['name']='QA_OWNER';
  $entry=array('id'=>9,'gamestate'=>0,'status'=>10,'nowplayer'=>1,'maxplayer'=>2,'roomtype'=>14,'roomdata'=>$roomdata,'soleroom'=>false,'runningtime'=>0);
  $context=array_merge($publicDefaults,array('charset'=>'utf-8','gtitle'=>'ACFUN 大 逃 杀','bbsurl'=>'https://bbs.brdts.online/','homepage'=>'http://amarillonmc.github.io/',
    'error'=>'','errorinfo'=>0,'u_templateid'=>1,'___MOD_CODE_ADV3'=>false,'cuser'=>$signedIn?'QA_OWNER':'','cpass'=>$signedIn?'synthetic-cookie':'',
    'roomdata'=>$roomdata,'room_id'=>$inside?9:0,'room_prefix'=>$inside?'s9':'','upos'=>0,'roomtypelist'=>$roomtypelist,'roomlist'=>array(9=>$entry),'shroomlist'=>array($entry),
    'gamestate'=>0,'gametype'=>10,'gamenum'=>1,'starttime'=>0,'now'=>$now,'year'=>2026,'month'=>10,'day'=>29,'hour'=>'08','min'=>'00','sec'=>'00','wday'=>4,
    'hplayer'=>'','hdamage'=>0,'winmode'=>0,'winner'=>'','areaintv'=>30,'areanum'=>0,'deathnum'=>0,'alivenum'=>0,'validnum'=>0,'adminmsg'=>'','systemmsg'=>'','timing'=>0));
  $before=time();$html=$render('index',$context);$after=time();$cases[]=array('name'=>'index','context'=>$context,'html'=>$html,'before'=>$before,'after'=>$after);
}
$data=array('sources'=>$sources,'compiled'=>$compiled,'cases'=>$cases,'defaults'=>$publicDefaults,'constants'=>get_defined_constants(true)['user']);
unset($data['constants']['GAME_ROOT']);
file_put_contents($out.'/room-templates.json',json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
echo count($compiled).' templates, '.count($cases).' original PHP rendering cases'.PHP_EOL;
