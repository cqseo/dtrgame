<?php
/** Golden math/dispatch cases from read-only original player/main.php &
  * include/pages/command_act.php; synthetic examples, never user DB rows. */
declare(strict_types=1);
$pre=[];
foreach([0,1,2] as $flag)foreach([-1,0,1,50,100] as $hp){
 $newHp=$flag?0:$hp;
 $newFlag=$newHp<=0?1:$flag;
 $pre[]=['flag'=>$flag,'hp'=>$hp,'newHp'=>$newHp,'newFlag'=>$newFlag];
}
$act=[];
foreach(['menu','special','search','move','tac2','enter',''] as $command)
 foreach(['command','special','rest','death',''] as $mode){
  $newMode=$mode;
  if($command=='menu')$newMode='command';
  elseif($mode=='command'&&$command=='special')$newMode='special';
  $act[]=['command'=>$command,'mode'=>$mode,'newMode'=>$newMode];
}
$decisions=[];
foreach(['','abc'] as $user)foreach(['','pass'] as $pass)
 foreach([false,true] as $playerExists)foreach([0,1,19,20,39,40] as $gamestate)
  foreach([0,1] as $hp)foreach([0,3,4] as $state){
  if(!$user||!$pass)$kind='no_login';
  elseif(!$playerExists)$kind='valid.php';
  elseif($gamestate==0)$kind='end.php';
  else $kind=($gamestate>=20&&$hp>0&&$state<=3)?'run_act':'run_no_act';
  $decisions[]=['user'=>$user,'pass'=>$pass,'exists'=>$playerExists,
  'gamestate'=>$gamestate,'hp'=>$hp,'state'=>$state,'expect'=>$kind];
}
$saves=[];
$cases=[
 ['plain_diff',['pid'=>3,'name'=>'QA','type'=>0,'hp'=>80,'state'=>2],
                ['pid'=>3,'name'=>'QA','type'=>0,'hp'=>90,'state'=>2]],
 ['dead_flag_forced',['pid'=>3,'name'=>'QA','type'=>0,'hp'=>0,'state'=>8,'player_dead_flag'=>0],
                ['pid'=>3,'name'=>'QA','type'=>0,'hp'=>50,'state'=>3,'player_dead_flag'=>0]],
 ['dead_flag_oneway',['pid'=>5,'name'=>'QA','type'=>0,'hp'=>30,'player_dead_flag'=>0],
                ['pid'=>5,'name'=>'QA','type'=>0,'hp'=>30,'player_dead_flag'=>1]],
 ['npc_update',['pid'=>9,'name'=>'NPC','type'=>1,'hp'=>80,'state'=>2],
                ['pid'=>9,'name'=>'NPC','type'=>1,'hp'=>70,'state'=>2]],
 ['null_excluded',['pid'=>9,'name'=>'NPC','type'=>1,'hp'=>80,'motto'=>null],
                ['pid'=>9,'name'=>'NPC','type'=>1,'hp'=>80,'motto'=>'original']],
 ['strict_types',['pid'=>3,'name'=>'QA','type'=>0,'hp'=>80,'state'=>3],
                ['pid'=>'3','name'=>'QA','type'=>'0','hp'=>'80','state'=>'3']],
 ['ignore_extra',['pid'=>3,'name'=>'QA','type'=>0,'hp'=>80,'extra'=>'untrusted'],
                ['pid'=>3,'name'=>'QA','type'=>0,'hp'=>80]],
 ['all_unchanged',['pid'=>3,'name'=>'QA','type'=>0,'hp'=>80],
                ['pid'=>3,'name'=>'QA','type'=>0,'hp'=>80]],
 ['missing_pid',['name'=>'QA','type'=>0,'hp'=>80],null],
 ['missing_origin',['pid'=>21,'name'=>'QA','type'=>0,'hp'=>80],null],
 ['zero_hp_no_flag',['pid'=>13,'name'=>'QA','type'=>0,'hp'=>-2],null],
 ['origin_null',['pid'=>31,'name'=>'QA','type'=>0,'hp'=>80,'state'=>2],
                ['pid'=>31,'name'=>'QA','type'=>0,'hp'=>80,'state'=>null]]
];
$fields=['pid','type','name','hp','state','player_dead_flag','motto','killmsg','lastword'];
foreach($cases as [$label,$data,$origin]){
 $writes=[]; $poolsaved=null;$requireName=0;
 if(isset($data['pid'])){
  $spid=$data['pid'];
  $poolsaved=$data;
  $ndata=[];
  foreach($fields as $key) if(isset($data[$key]))$ndata[$key]=$data[$key];
  if(isset($origin)){
   $diff=[];
   foreach(array_keys($ndata) as $key){
    if(!isset($origin[$key]) || $ndata[$key] !== $origin[$key])$diff[$key]=$ndata[$key];
   }
   $ndata=$diff;
  }
  unset($ndata['pid']);
  if($data['hp']<=0){$ndata['player_dead_flag']=1;$poolsaved['player_dead_flag']=1;}
  if(isset($ndata['player_dead_flag'])&&!$ndata['player_dead_flag'])unset($ndata['player_dead_flag']);
  $writes=$ndata;
  $requireName=!$data['type'];
 }
 $saves[]=['name'=>$label,'row'=>$data,'origin'=>$origin,'columns'=>$fields,
   'changes'=>$writes,'shouldWrite'=>count($writes)>0,'requireHumanName'=>(bool)$requireName,
   'nextPool'=>$poolsaved];
}
$data=['source'=>'installed original player/main.php and pages/command_act.php',
 'preAct'=>$pre,'act'=>$act,'decision'=>$decisions,'saves'=>$saves];
$out='/opt/dts-port-workbench-20261029/test/fixtures/original-player-action-php.json';
file_put_contents($out,json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR));
echo json_encode(['pre'=>count($pre),'act'=>count($act),'decisions'=>count($decisions),
 'save'=>count($saves),'size'=>filesize($out),'sha256'=>hash_file('sha256',$out)])."\n";