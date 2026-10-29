<?php
// Source-formula fixtures for core/player/main.php revive_process().
declare(strict_types=1);
$rows=[];
foreach([0,1,2] as $type)
foreach([10,27,50] as $state)
foreach([0,1] as $veto)
foreach([-1,40,50,70,200] as $checked)
foreach([0,1,2] as $sequenceMode) {
 $sequence=$sequenceMode===0?[]:
  ($sequenceMode===1?[90=>200,10=>40,50=>50]:[250=>70,40=>200]);
 $ordered=$sequence;ksort($ordered);
 $target=['pid'=>5,'type'=>$type,'state'=>$state,'hp'=>0];
 $totals=['deathnum'=>11,'alivenum'=>18];
 $called=[];$triggered=null;
 if($sequence && !$veto){
  foreach($ordered as $key){
   $called[]=$key;
   if($key===$checked){
    $triggered=$key;
    $target['o_state']=$target['state'];
    $target['state']=0;$target['hp']=1;
    $totals['deathnum']--;
    if($target['type']==0)$totals['alivenum']++;
    else $target['npc_revived']=1;
    break;
   }
  }
 }
 $rows[]=['type'=>$type,'state'=>$state,'veto'=>(bool)$veto,
  'checkKey'=>$checked,'sequenceMode'=>$sequenceMode,
  'sequence'=>$sequence,'checked'=>$called,'triggered'=>$triggered,
  'target'=>$target,'counters'=>$totals];
}
$out='/opt/dts-port-workbench-20261029/test/fixtures/original-revive-php.json';
file_put_contents($out,json_encode($rows,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR));
echo json_encode(['fixtureRows'=>count($rows),'bytes'=>filesize($out)])."\n";
