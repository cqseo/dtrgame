<?php
// Isolated HTTP smoke test. Must only target the disposable local Docker network.
if (getenv('DTR_PHP_QA') !== 'disposable-local-only' || getenv('MARIADB_DATABASE') !== 'dtr_isolated') {
    fwrite(STDERR, "Refusing to run outside the disposable test environment.\n");
    exit(2);
}
$base='http://127.0.0.1:8080'; $jars=['QaAlpha'=>[],'QaBeta'=>[]];
function req($who,$path,$post=null){
 global $base,$jars;
 $headers=[];if($jars[$who])$headers[]='Cookie: '.implode('; ',array_map(fn($k,$v)=>$k.'='.$v,array_keys($jars[$who]),$jars[$who]));
 if($post!==null)$headers[]='Content-Type: application/x-www-form-urlencoded';
 $opts=['method'=>$post===null?'GET':'POST','header'=>implode("\r\n",$headers),'follow_location'=>0,'ignore_errors'=>true,'timeout'=>90];
 if($post!==null)$opts['content']=http_build_query($post);
 $body=@file_get_contents($base.$path,false,stream_context_create(['http'=>$opts]));
 $response=$http_response_header??[];
 foreach($response as $h)if(stripos($h,'Set-Cookie: ')===0){$part=explode(';',substr($h,12),2)[0];$a=explode('=',$part,2);if(count($a)===2)$jars[$who][$a[0]]=$a[1];}
 preg_match('/^HTTP\/\S+\s+(\d+)/',$response[0]??'', $m);
 return [(int)($m[1]??0),$body?:''];
}
function check($ok,$label){echo ($ok?'PASS ':'FAIL ').$label."\n";if(!$ok)exit(1);}
foreach(array_keys($jars) as $user){[$s,$b]=req($user,'/login.php',['username'=>$user,'password'=>'isolated-test-password']);check($s===302&&count($jars[$user])>=2,$user.' original login');}
[$s,$b]=req('QaAlpha','/roomcmd.php?command=newroom&para1=0');echo 'create status='.$s.' body='.substr(trim(preg_replace('/\\s+/u',' ',strip_tags($b))),0,1200)."\n"; check($s===302,'create original room');
[$s,$b]=req('QaBeta','/roomcmd.php?command=enterroom&para1=1');check($s===302,'join original room');
[$s,$b]=req('QaBeta','/roomcmd.php',['command'=>'pos_enter','para1'=>'1']);check($s===200,'seat second player');
[$s,$b]=req('QaAlpha','/roomupdate.php',['timestamp'=>'0']);check($s===200&&strlen($b)>0,'room status response');
foreach(['QaAlpha','QaBeta'] as $user){[$s,$b]=req($user,'/roomcmd.php',['command'=>'ready']);check($s===200,$user.' ready request');}
foreach(['QaAlpha','QaBeta'] as $user){[$s,$b]=req($user,'/game.php');check($s===200&&strpos($b,'gamecmd')!==false,$user.' original game interface');}
foreach(['QaAlpha'=>5,'QaBeta'=>4] as $user=>$pose){[$s,$b]=req($user,'/command.php',['mode'=>'special','command'=>'pose'.$pose]);check($s===200,$user.' action response');}
$db=new mysqli('dtr-cf-php-db-20261103',getenv('MARIADB_USER'),getenv('MARIADB_PASSWORD'),getenv('MARIADB_DATABASE'));
$poses=$db->query("SELECT name,pose FROM acbra2_s1_players WHERE type=0 ORDER BY name")->fetch_all(MYSQLI_ASSOC);
check(count($poses)===2 && $poses[0]['name']==='QaAlpha' && (int)$poses[0]['pose']===5 && $poses[1]['name']==='QaBeta' && (int)$poses[1]['pose']===4,'both actions persisted');
if (getenv('DTR_STOP_AFTER_SETUP') === '1') {
    echo "Active synthetic match ready for restart test.\n";
    exit(0);
}
for($turn=0;$turn<120;$turn++){
 $result=$db->query("SELECT pid,name,hp,pls,action FROM acbra2_s1_players WHERE type=0 ORDER BY pid");
 $players=$result->fetch_all(MYSQLI_ASSOC);
 if(count($players)!==2){echo "FAIL expected two player rows\n";exit(1);}
 $living=array_values(array_filter($players,fn($p)=>(int)$p['hp']>0));
 if(count($living)<=1){$who=$living[0]['name']??'QaAlpha';req($who,'/command.php',['mode'=>'command','command'=>'menu']);echo "LETHAL_ENCOUNTER turn=$turn\n";break;}
 $p=$players[$turn%2];$enemy=$players[($turn+1)%2];
 if($p['action']==='enemy'.$enemy['pid'])$cmd=['mode'=>'combat','command'=>'attack'];
 elseif($p['action'])$cmd=['mode'=>'command','command'=>'menu'];
 elseif($p['pls']!==$enemy['pls'])$cmd=['mode'=>'command','command'=>'move','moveto'=>$enemy['pls']];
 else $cmd=['mode'=>'command','command'=>'search'];
 [$status,$body]=req($p['name'],'/command.php',$cmd);
 if($status!==200){echo "FAIL command status=$status turn=$turn\n";exit(1);}
 if($turn%10===0)echo "MATCH turn=$turn\n";
 usleep(750000);
}
$r=$db->query("SELECT gamestate FROM acbra2_game WHERE groomid=1");$g=$r->fetch_assoc();
echo "FINAL game_state=".($g['gamestate']??'missing')."\n";
if (!isset($g['gamestate']) || (int)$g['gamestate'] !== 0) {
    fwrite(STDERR, "Match did not finish within the test turn limit.\n");
    exit(1);
}
$history=$db->query("SELECT winner FROM acbra2_shistory ORDER BY gid DESC LIMIT 1")->fetch_assoc();
check(in_array($history['winner']??'', ['QaAlpha','QaBeta'], true),'winner recorded in history');
$deaths=$db->query("SELECT COUNT(*) AS n FROM acbra2_s1_newsinfo WHERE news LIKE 'death%' AND a IN ('QaAlpha','QaBeta')")->fetch_assoc();
check((int)$deaths['n']>0,'lethal encounter recorded');
