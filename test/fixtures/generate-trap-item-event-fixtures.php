<?php
/** Synthetic-only golden source calculations:
 * base/items/trap/main.php, base/itemmain/main.php, base/event/main.php.
 * No source DB row query or modification.
 */
declare(strict_types=1);
require '/www/wwwroot/dts-game-test/include/modules/base/items/trap/config/trap.config.php';
$traps=[];
foreach([0,1,2,8,20,100,160] as $count)
 foreach([0,39,40,99] as $outer)
 foreach([0,1,2,20,39] as $inner) {
  $passedOuter=$outer<$trap_max_obbs;
  $real=$trap_min_obbs+$count/4;
  $passedInner=$passedOuter&&$inner<$real;
  $traps[]=[
   'count'=>$count,'outer'=>$outer,'inner'=>$inner,'real'=>$real,
   'passedOuter'=>$passedOuter,'passedInner'=>$passedInner,
   'triggered'=>$passedInner&&$count>0,
   'rolls'=>$passedOuter?2:1
  ];
 }
$level=[];
foreach([0,1,3,5,10,27,60,150] as $lvl)foreach([false,true] as $self) {
 $base=8+$lvl/3+($self?50:0);
 $level[]=['level'=>$lvl,'self'=>$self,
   'escape'=>min(90,$base),'reuse'=>5+$lvl/3+($self?50:0)];
}
$items=[];
foreach([0,1,2] as $itemcount)
 foreach([0,1] as $filtered)
 foreach([0,'0','1',1,3,10] as $itms) {
  $chosen=$itemcount>0&&!$filtered;
  $found=$chosen&&boolval($itms);
  $items[]=[
   'count'=>$itemcount,'filtered'=>$filtered===1,
   'durability'=>$itms,'found'=>$found,
   'log'=>$itemcount===0?'<span class="yellow b">周围找不到任何物品。</span><br>':
     ($found?'':'但是什么都没有发现。<br>'),
   'mode'=>$found?'itemfind':'command'
  ];
 }
$special=[];
foreach(['Untainted Glory','Pilot','Other'] as $art)
 foreach([0,34,35] as $pls)
 foreach([false,true] as $duel){
  $special[]=['art'=>$art,'pls'=>$pls,'duel'=>$duel,
    'trigger'=>$art!='Untainted Glory' && $pls==34 && !$duel];
 }
$output=[
 'source'=>'installed original PHP config/trap/event/itemmain; synthetic arithmetic fixtures',
 'defaults'=>['trapMinOdds'=>$trap_min_obbs,'trapMaxOdds'=>$trap_max_obbs],
 'traps'=>$traps,'levels'=>$level,'items'=>$items,'eventSpecial'=>$special
];
$path='/opt/dts-port-workbench-20261029/test/fixtures/original-trap-item-event-php.json';
file_put_contents($path,json_encode($output,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR));
echo json_encode(['traps'=>count($traps),'levels'=>count($level),'items'=>count($items),
 'eventSpecial'=>count($special),'bytes'=>filesize($path)],JSON_UNESCAPED_UNICODE)."\n";
