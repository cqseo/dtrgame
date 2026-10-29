<?php
// Original base/items/trap/main.php arithmetic golden fixtures, synthetic only.
declare(strict_types=1);
$data=[];
foreach([0,1,3,30,99] as $lvl)
foreach([false,true] as $self)
foreach([5,30,100,1000] as $hp)
foreach([1,10,25,100] as $power)
foreach([0,7,50,89,90,99] as $first) {
 $esc=min(90,8+$lvl/3+($self?50:0));
 $hit=$first >= $esc;
 $reuse=5+$lvl/3+($self?50:0);
 foreach($hit?[0,(int)($power/2)]:[0,50,99] as $second) {
  $outcome=$hit?'hit':($second<$reuse?'miss_reuse':'miss_break');
  $base=$hit?round($second+$power/2):0;
  $factors=$hit&&$lvl===1?[0.75,1.5]:[];
  $damage=$base;
  if(count($factors)) {
    foreach($factors as $factor)$damage*=$factor;
    $damage=max(1,round($damage));
  }
  $data[]=['level'=>$lvl,'self'=>$self,'hp'=>$hp,'strength'=>$power,
    'first'=>$first,'second'=>$second,'factors'=>$factors,'hit'=>$hit,
    'escape'=>$esc,'reuse'=>$reuse,'outcome'=>$outcome,
    'baseDamage'=>$base,'damage'=>$damage,
    'afterHp'=>$hp-$damage,'lethal'=>$hit&&$hp-$damage<=0];
 }
}
$file='/opt/dts-port-workbench-20261029/test/fixtures/original-trap-damage-php.json';
file_put_contents($file,json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR));
echo json_encode(['vectors'=>count($data),'bytes'=>filesize($file)])."\n";
