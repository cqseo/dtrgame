<?php
if (getenv('DTR_PHP_QA') !== 'disposable-local-only' || getenv('MARIADB_DATABASE') !== 'dtr_isolated') {
    fwrite(STDERR, "Refusing to run outside the disposable test environment.\n");
    exit(2);
}
// Isolated HTTP smoke test. Must only target the disposable local Docker network.
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
$db=new mysqli('dtr-cf-php-db-20261103',getenv('MARIADB_USER'),getenv('MARIADB_PASSWORD'),getenv('MARIADB_DATABASE'));
function rewards($db){return $db->query("SELECT username,gold,validgames,wingames FROM acbra2_users ORDER BY username")->fetch_all(MYSQLI_ASSOC);}
$before=rewards($db);
foreach(array_keys($jars) as $user){[$s,$b]=req($user,'/login.php',['username'=>$user,'password'=>'isolated-test-password']);check($s===302,$user.' login after restart');[$s,$b]=req($user,'/roomcmd.php?command=enterroom&para1=1');check($s===302,$user.' enter completed room');for($i=0;$i<2;$i++){[$s,$b]=req($user,'/end.php');check($s===200 && strpos($b,'ACFUN')!==false,$user.' end page '.($i+1));}}
check($before===rewards($db),'repeated end pages do not repeat awards');
