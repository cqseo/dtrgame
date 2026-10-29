<?php
/**
 * Synthetic golden vectors from actual ORIGINAL PHP config; no production
 * player records, no live game writes, no global game module loading.
 * Formulas copied literally from original tactic/main.php + cooldown/main.php.
 */
declare(strict_types=1);
require '/www/wwwroot/dts-game-test/include/modules/base/tactic/config/tactic.config.php';
require '/www/wwwroot/dts-game-test/include/modules/base/cooldown/config/cooldown.config.php';
$tacticCases=[];
foreach(range(0,4) as $t){
  foreach([0,21,85] as $base){
    $ret=array(1.1,0.7);
    $def=array(0.9,1.7);
    $tacticCases[]=[
      'tactic'=>$t,'base'=>$base,
      'findman'=>$base + $tactic_meetman_obbs[$t],
      'hide'=>$base + $tactic_hide_obbs[$t],
      'counter'=>$base + ($t===3?30:0),
      'counterAllowed'=>$t!==4,
      'attack'=>array_merge(array(1+$tactic_attack_modifier[$t]/100),$ret),
      'defense'=>array_merge(array(1+$tactic_defend_modifier[$t]/100),$def),
      'trapEscape'=>$base + ($t===4?20:0),
      'avoidAt39'=>$t===4,
      'avoidAt40'=>false
    ];
  }
}
$trapCases=[];
foreach([0,2,3,4] as $t)foreach([0,74,75,99] as $rng)
  foreach([1,2,3,10,77,100] as $damage)
    $trapCases[]=['tactic'=>$t,'random'=>$rng,'damage'=>$damage,
      'result'=>($t===2 && $rng<75 ? round($damage*.75):$damage)];
$changeCases=[];
foreach(['tac2','tac3','tac4','tac0','tac1','tac5','tac','tac4more','move','tac-2'] as $command){
  $tactic=2;$mode='special';$log='';
  if($mode=='special' && strpos($command,'tac')===0){
    $ntactic=(int)substr($command,3,1);
    if(isset($tactic_player_usable[$ntactic]) && $tactic_player_usable[$ntactic]){
      $log.="应战策略变为<span class=\"yellow b\">{$tacinfo[$ntactic]}</span>。<br> ";
      $tactic=$ntactic;
    }else $log.="这是什么奇怪的应战策略啦！<br> ";
    $mode='command';
  }
  $changeCases[]=['command'=>$command,'tactic'=>$tactic,'mode'=>$mode,'log'=>$log];
}
$cooldown=[];
foreach([0,1] as $enabled)foreach([0,1000,1200,1560,1880,2000,2500,3333.9] as $now)
 foreach([0,650,1250] as $cdover)foreach(['move','search','itemUse'] as $act) {
  $cdsec=floor($cdover/1000);$cdmsec=(int)fmod($cdover,1000);
  $cmdcdtime=0; $rmcdtime=0;$mode='special';$log='';
  $blocked=false;
  if($enabled){
    $cdover2=$cdsec*1000+$cdmsec;
    $nowmtime=floor($now);
    $rmcdtime = $nowmtime >= $cdover2 ? 0 : $cdover2-$nowmtime;
    if($rmcdtime>0){
      $log.='<span class="yellow b">冷却时间尚未结束！</span><br>';
      $mode='command';$blocked=true;
    }
  }
  if(!$blocked && $enabled){
    $cd=$act==='move'?$movecoldtime:($act==='search'?$searchcoldtime:$itemusecoldtime);
    if($cmdcdtime<$cd)$cmdcdtime=$cd;
  }
  $postStart=1500.9;$postNow=1777.4;
  if($enabled){
    if($cmdcdtime!=0){
      $end=floor($postStart)+$cmdcdtime;
      $cdsec=floor($end/1000);
      $cdmsec=(int)fmod($end,1000);
      $cdover2=$cdsec*1000+$cdmsec;
      $rmcdtime=floor($postNow)>=$cdover2?0:$cdover2-floor($postNow);
    }else {
      $cdover2=$cdsec*1000+$cdmsec;
      $rmcdtime=floor($postNow)>=$cdover2?0:$cdover2-floor($postNow);
    }
  }
  $cooldown[]=['enabled'=>(bool)$enabled,'now'=>$now,'startEnd'=>$cdover,'action'=>$act,
    'blocked'=>$blocked,'afterBefore'=>['cdsec'=>floor($cdover/1000),'cdmsec'=>(int)fmod($cdover,1000),
      'cmdcdtime'=>$cmdcdtime,'mode'=>$mode,'log'=>$log],
    'afterPost'=>['cdsec'=>$cdsec,'cdmsec'=>$cdmsec,'remaining'=>$rmcdtime]];
}
$data=['sourceConfig'=>'Live original include/modules/base/{tactic,cooldown}/config/*.php',
  'tacticConfig'=>['names'=>$tacinfo,'usable'=>$tactic_player_usable,
    'hide'=>$tactic_hide_obbs,'meet'=>$tactic_meetman_obbs,
    'attack'=>$tactic_attack_modifier,'defense'=>$tactic_defend_modifier],
  'cooldownConfig'=>['on'=>$coldtimeon,'show'=>$showcoldtimer,
    'move'=>$movecoldtime,'search'=>$searchcoldtime,'itemUse'=>$itemusecoldtime],
  'tactic'=>$tacticCases,'trap'=>$trapCases,'changes'=>$changeCases,'cooldown'=>$cooldown];
$out='/opt/dts-port-workbench-20261029/test/fixtures/original-tactic-cooldown-php.json';
if(!is_dir(dirname($out)))mkdir(dirname($out),0700,true);
file_put_contents($out,json_encode($data,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_THROW_ON_ERROR));
echo json_encode(['tactic'=>count($tacticCases),'trap'=>count($trapCases),
 'changes'=>count($changeCases),'cooldown'=>count($cooldown),
 'size'=>filesize($out),'fixture_sha256'=>hash_file('sha256',$out)],JSON_UNESCAPED_UNICODE)."\n";