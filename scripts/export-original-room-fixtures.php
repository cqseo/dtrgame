<?php
// Read-only source oracle. No common.inc.php, SQL, cache or live requests.
// Optional argv[3] is the actual site's additive quickmatch configuration.
if ($argc < 3) throw new Exception('Usage: php export.php snapshot output.json [quickmatch.config.php]');
$root=realpath($argv[1]);
function import_module($name) { return ''; }
require $root.'/include/roommng/roommng.config.php';
require $root.'/include/roommng/roommng.func.php';
$hashes=array('roommng.config.php'=>hash_file('sha256',$root.'/include/roommng/roommng.config.php'),
    'roommng.func.php'=>hash_file('sha256',$root.'/include/roommng/roommng.func.php'));
if(isset($argv[3])) { require $argv[3]; $hashes['quickmatch.config.php']=hash_file('sha256',$argv[3]); }
$cuser='QA_OWNER'; $cases=array();
foreach($roomtypelist as $type=>$config) {
    $initial=room_init($type);
    $cases[]=array('operation'=>'init','type'=>$type,'result'=>$initial);
    $full=$initial;
    foreach($full['player'] as $i=>&$seat) $seat['name']='QA_'.$i;
    unset($seat);
    $partial=$full; $partial['player'][0]['name']='';
    $forbidden=$full;
    foreach($forbidden['player'] as &$seat) { $seat['forbidden']=1; $seat['name']=''; }
    unset($seat);
    $oneTeam=$full;
    foreach($oneTeam['player'] as $i=>&$seat) if($seat['leader']!==0) { $seat['forbidden']=1; $seat['name']=''; }
    unset($seat);
    $states=array($initial,$full,$partial,$forbidden,$oneTeam);
    if(isset($config['game-option']['group-num'])) {
        $smaller=$full; $smaller['current_game_option']['group-num']='2'; $states[]=$smaller;
    }
    foreach($states as $state) foreach(array(0,1,2) as $ready) foreach(array(0,1) as $running) {
        $state['readystat']=$ready;
        $before=time(); $result=$state; $changed=update_roomstate($result,$running); $after=time();
        $cases[]=array('operation'=>'update','state'=>$state,'running'=>$running,'changed'=>$changed,'result'=>$result,'before'=>$before,'after'=>$after);
    }
    $state=$full; $state['readystat']=1; $state['kicktime']=1;
    $state['player'][0]['ready']=1;
    $result=$state; $changed=room_auto_kick_check($result);
    $cases[]=array('operation'=>'kick','state'=>$state,'changed'=>$changed,'result'=>$result);
    $state=$full;
    for($i=0;$i<12;$i++) room_new_chat($state,'synthetic message '.$i);
    $cases[]=array('operation'=>'chat','state'=>$full,'messages'=>12,'result'=>$state);
    foreach(array('','0') as $message) {
        $result=$full;room_new_chat($result,$message);
        $cases[]=array('operation'=>'empty_chat','state'=>$full,'message'=>$message,'result'=>$result);
    }
    $cases[]=array('operation'=>'participants','state'=>$full,'result'=>room_participant_get($full));
    foreach(array('QA_0','QA_1','absent') as $user)
        $cases[]=array('operation'=>'position','state'=>$full,'user'=>$user,'result'=>room_upos_check($full,$user));
    foreach(array(0,1,99) as $position) {
        $result=$full; $changed=room_owner_takeover_apply($result,'QA_1',$position);
        $cases[]=array('operation'=>'takeover','state'=>$full,'user'=>'QA_1','position'=>$position,'changed'=>$changed,'result'=>$result);
    }
    foreach(isset($config['game-option']) ? $config['game-option'] : array() as $key=>$option) {
        foreach(array('0','1','2','30','40','999','-1','1abc','',null) as $value)
            $cases[]=array('operation'=>'option','type'=>$type,'key'=>$key,'value'=>$value,'result'=>room_check_game_option($type,$key,$value));
    }
}
file_put_contents($argv[2],json_encode(array('sourceHashes'=>$hashes,'types'=>$roomtypelist,'cases'=>$cases),JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT));
echo count($roomtypelist).' room types; '.count($cases).' PHP oracle cases'.PHP_EOL;
