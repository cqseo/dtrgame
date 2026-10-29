<?php
/** Synthetic golden cases copied from installed original
 * core/map/main.php + base/explore/main.php + source config. NO player data.
 */
declare(strict_types=1);
require '/www/wwwroot/dts-game-test/include/modules/base/event/config/event.config.php';
require '/www/wwwroot/dts-game-test/include/modules/base/items/trap/config/trap.config.php';
require '/www/wwwroot/dts-game-test/include/modules/base/itemmain/config/itemmain.config.php';
$plsinfo=['0'=>'校门','1'=>'公园','2'=>'学园','3'=>'废墟','4'=>'码头'];
$areainfo=['0'=>'起点区域','1'=>'庭园区域','2'=>'学园区域','3'=>'废墟区域','4'=>'港口区域'];
$arealist=[2,0,1,3,4];
$move=[];$search=[];$mapCases=[];
foreach([false,true] as $hack) foreach([0,1,3] as $areanum)
 foreach([0,2,3] as $pls)
 foreach(["main","0","2","3","4","99"] as $moveto)
 foreach([14,15,16,40] as $sp) {
   $cost=15;$log='';$pnew=$pls;$spnew=$sp;$moved=false;
   $forbidden=array_slice($arealist,0,$areanum);
   $canEnter=in_array($moveto,$arealist)&&(!in_array($moveto,$forbidden)||$hack);
   if($moveto=='main'||!in_array($moveto,$arealist)){
     $log.='请选择正确的移动地点。<br>';
   }elseif($pls==$moveto){
     $log.='相同地点，不需要移动。<br>';
   }elseif(!$canEnter){
     $log.=$plsinfo[$moveto].'是禁区，还是离远点吧！<br>';
   }elseif($sp<=$cost){
     $log.='体力不足，不能移动！<br><span class="yellow b">请选择行动菜单的「睡眠」恢复体力，或使用背包里的体力恢复物品，再尝试移动。</span><br>';
   }else{
     $spnew-=$cost;$moved=true;$pnew=$moveto;
     $log.='你消耗<span class="yellow b">'.$cost.'</span>点体力，移动到了'.$plsinfo[$moveto].'。<br>';
     $log.=$areainfo[$pnew].'<br>';
   }
   $move[]=['hack'=>$hack,'areanum'=>$areanum,'pls'=>$pls,'moveto'=>$moveto,
     'sp'=>$sp,'expected'=>['moved'=>$moved,'pls'=>(string)$pnew,'sp'=>$spnew,'log'=>$log]];
 }
foreach([false,true] as $hack) foreach([0,1,3] as $areanum)
 foreach([0,2,3] as $pls)foreach([14,15,16,40] as $sp){
  $forbidden=array_slice($arealist,0,$areanum);
  $allowed=in_array($pls,$arealist)&&(!in_array($pls,$forbidden)||$hack);
  $cost=15;$log='';$spnew=$sp;$searched=false;
  if(!$allowed)$log.=$plsinfo[$pls].'是禁区，还是赶快逃跑吧！<br>';
  elseif($sp<=$cost)$log.='体力不足，不能探索！<br><span class="yellow b">请选择行动菜单的「睡眠」恢复体力，或使用背包里的体力恢复物品，再尝试探索。</span><br>';
  else{$spnew-=$cost;$log.='消耗<span class="yellow b">'.$cost.'</span>点体力，你搜索着周围的一切……<br>';$searched=true;}
  $search[]=['hack'=>$hack,'areanum'=>$areanum,'pls'=>$pls,'sp'=>$sp,
    'expected'=>['searched'=>$searched,'sp'=>$spnew,'log'=>$log]];
}
foreach([false,true] as $hack) foreach([0,1,3,5] as $areanum)
 foreach(["main","0","1","2","3","4","99"] as $pno){
  $forbidden=array_slice($arealist,0,$areanum);
  $mapCases[]=['hack'=>$hack,'areanum'=>$areanum,'place'=>$pno,
   'available'=>in_array($pno,$arealist),
   'forbidden'=>in_array($pno,$forbidden),
   'canEnter'=>in_array($pno,$arealist)&&(!in_array($pno,$forbidden)||$hack)];
 }
$meet=[];
foreach(["search","move","search2","other"] as $mode)
 foreach([0,1,2,3,10,15,40] as $pcount){
  if(!$pcount) {
   if($mode==="search"||$mode==="move"||$mode==="search2"){$meet[]=['mode'=>$mode,'nearby'=>$pcount,'rate'=>50];continue;}
  }
  $erate=min(30,$pcount*3);
  $base=$mode==='search'?20+$erate:($mode==='move'?40+$erate:($mode==='search2'?100:0));
  $meet[]=['mode'=>$mode,'nearby'=>$pcount,'rate'=>$base,'floor'=>max(20,$base)];
 }
$trap=[];
foreach([0,1,2,7,15,40,200] as $cnt) {
  $trap[]=['count'=>$cnt,'min'=>$trap_min_obbs,'max'=>$trap_max_obbs,
           'real'=>$trap_min_obbs+$cnt/4];
}
$items=[];
foreach([0,.5,1,1.4] as $mult)foreach([-5,0,5,20] as $buff)
  $items[]=['base'=>$item_obbs,'multiplier'=>$mult,'buff'=>$buff,'findRate'=>$buff+$item_obbs*$mult];
$fixture=[
 'source'=>'original installed map/explore/metman/trap/event/itemmain PHP formulas',
 'map'=>['arealist'=>$arealist,'plsinfo'=>$plsinfo,'areainfo'=>$areainfo,'areaadd'=>2],
 'defaults'=>['baseMoveSP'=>15,'baseSearchSP'=>15,'eventOdds'=>$event_obbs,
 'trapMinOdds'=>$trap_min_obbs,'trapMaxOdds'=>$trap_max_obbs,'itemOdds'=>$item_obbs],
 'move'=>$move,'search'=>$search,'mapCases'=>$mapCases,
 'meet'=>$meet,'trap'=>$trap,'items'=>$items
];
$out='/opt/dts-port-workbench-20261029/test/fixtures/original-explore-map-php.json';
file_put_contents($out,json_encode($fixture,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR));
echo json_encode(['move'=>count($move),'search'=>count($search),'map'=>count($mapCases),'meet'=>count($meet),'trap'=>count($trap),'items'=>count($items),
 'bytes'=>filesize($out),'sha256'=>hash_file('sha256',$out)],JSON_UNESCAPED_UNICODE)."\n";