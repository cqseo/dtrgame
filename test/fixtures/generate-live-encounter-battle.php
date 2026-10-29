<?php
/** Offline oracle: requires UNMODIFIED source functions, never common.inc.php,
 * database configuration, account records, or running game state. External
 * modules/storage/renderers are explicitly instrumented synthetic ports. */
namespace {
  error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
  define('__MAGIC__', <<<'MAGIC'
$__oracleFn = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS,2)[1]['function'];
if (isset($GLOBALS['pairHooks'][$__oracleFn])) {
  $___RET_VALUE = $GLOBALS['pairHooks'][$__oracleFn]($pa,$pd,$active); return true;
}
if ($__oracleFn === 'attack\\load_user_combat_command') { trace('user',$pdata['pid']); return true; }
if ($__oracleFn === 'attack\\load_auto_combat_command') { trace('auto',$pdata['pid']); return true; }
if ($__oracleFn === 'metman\\metman_load_playerdata') { $GLOBALS['enemyLoaded']=$pdata; trace('enemy',$pdata['pid']); return true; }
if ($__oracleFn === 'metman\\init_battle') { trace('init',1); return true; }
if ($__oracleFn === 'metman\\meetman_alternative') { trace('meet',$edata['pid'],$edata['hp']); return true; }
if ($__oracleFn === 'enemy\\findenemy') { trace('show',$edata['pid']); return true; }
$chprocess = function(){trace('next');};
return false;
MAGIC
  );
  function trace(...$args){$GLOBALS['trace'][]=$args;}
  function import_module(...$modules){
    $caller=debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS,2)[1]['function'];
    $code='global $log,$mode,$pid,$pls,$db,$tablepre,$hideflag,$hidelog,$metman_obbs,$action,$main,$cmd,$battle_title,$o_edata,$now,$sdata,$command,$plsinfo,$active_obbs_pc,$active_obbs_npc,$active_obbs_range;';
    // Capture battle-wrapper edata for assertions, without rebinding an enemy
    // function's edata parameter to a stale fixture global.
    if($caller==='battle\\battle_wrapper')$code.=' global $edata;';
    return $code;
  }
  function get_var_in_module($module,$key){return $GLOBALS['case']['message']??'';}
  function template($name){return __DIR__.'/oracle-result-template.php';}
  define('MOD_METMAN_MEETMAN','original-meetman-template');
  define('MOD_BATTLE_BATTLERESULT','original-result-template');
  class FakeDb {
    public $rows=[];
    function query($sql){trace('candidates');$this->rows=$GLOBALS['case']['candidates'];return true;}
    function fetch_array($result){return array_shift($this->rows);}
    function num_rows($result){return $GLOBALS['case']['count'];}
  }
  $root=$argv[1]??'';
  if(!is_dir($root.'/include/modules'))throw new \Exception('Pass read-only original source directory');
  $sourcePaths=[
    'include/modules/base/metman/main.php','include/modules/base/metman/config/metman.config.php',
    'include/modules/base/battle/main.php','include/modules/base/battle/battle.php',
    'include/modules/base/battle/battle_wrapper.php','include/modules/base/attack/attack_wrapper.php',
    'include/modules/base/attack/attack.php','include/modules/base/enemy/main.php',
    'include/modules/base/enemy/config/enemy.config.php'
  ];
  $hashes=[];
  foreach($sourcePaths as $path){$hashes[$path]=hash_file('sha256',$root.'/'.$path);require $root.'/'.$path;}
}
namespace player {
  function update_sdata(){\trace('update');}
  function fetch_playerdata_by_pid($pid){
    $i=$GLOBALS['fetches'][$pid]??0;$GLOBALS['fetches'][$pid]=$i+1;
    $seq=$GLOBALS['case']['fetched'][(string)$pid];
    $p=$seq[min($i,count($seq)-1)];\trace('fetch',$pid);return $p;
  }
  function player_save(&$p){\trace('save',$p['pid'],$p['hp'],$p['state'],$p['action']??'');}
  function load_playerdata($p){$GLOBALS['action']=$p['action'];\trace('current',$p['pid']);}
  function kill(&$a,&$d){
    \trace('kill',$a['pid'],$d['pid']);$d['hp']=0;
    if(in_array($d['pid'],$GLOBALS['case']['revive']??[],true)){$d['hp']=1;$d['state']=0;\trace('revive',$d['pid']);}
    return '原版击杀台词';
  }
}
namespace logger {function logsave($pid,$now,$text,$kind){\trace('enemylog',$pid,$text);}}
namespace sys {function addchat($channel,$text){\trace('chat',$channel,$text);}}
namespace corpse {
  function findcorpse(&$p){\trace('corpse',$p['pid']);$GLOBALS['cmd']='CORPSE';}
  function check_corpse_discover(&$p){\trace('checkcorpse',$p['pid']);return $GLOBALS['case']['corpse'];}
}
namespace enemy {function rand($lo,$hi){return \metman\rand($lo,$hi);}}
namespace metman {
  function shuffle(&$rows){$rows=array_reverse($rows);return true;}
  function rand($lo,$hi){$v=array_shift($GLOBALS['dice']);if($v===null||$v<$lo||$v>$hi)throw new \Exception('RNG exhausted');return $v;}
}
namespace {
  function p($id,$hp=100,$extra=[]){return array_merge([
    'pid'=>$id,'pls'=>3,'name'=>'角色'.$id,'type'=>0,'hp'=>$hp,'state'=>0,'action'=>'','wep'=>'原版武器',
    'bid'=>0,'battlelog'=>'old','corpse_clear_flag'=>0,'weps'=>'0','wepk'=>'WN','wepe'=>0,
    'arbs'=>0,'arbk'=>'DN','arbe'=>0,'money'=>0,'arhs'=>0,'aras'=>0,'arfs'=>0,'arts'=>0,
    'itms1'=>0,'itms2'=>0,'itms3'=>0,'itms4'=>0,'itms5'=>0,'itms6'=>0
  ],$extra);}
  function reset_case($c){
    $GLOBALS['case']=$c;$GLOBALS['trace']=[];$GLOBALS['fetches']=[];$GLOBALS['dice']=$c['dice']??[];
    foreach(['log','mode','action','cmd','main','battle_title'] as $k)$GLOBALS[$k]='';
    $GLOBALS['mode']='command';$GLOBALS['hideflag']=false;$GLOBALS['pid']=1;$GLOBALS['pls']=3;
    $GLOBALS['metman_obbs']=70;$GLOBALS['db']=new FakeDb();$GLOBALS['tablepre']='fixture_';$GLOBALS['now']=123;
  }
  $pairHooks=[
    'battle\\attack_wrapper'=>function(&$a,&$d,$active){\attack\attack_wrapper($a,$d,$active);},
    'battle\\check_can_counter'=>function(&$a,&$d,$active){trace('counter',$a['pid'],$active);if(isset($GLOBALS['case']['outOfRange']))$a['out_of_range']=$GLOBALS['case']['outOfRange'];return $GLOBALS['case']['counter'];},
    'battle\\assault_end'=>function(&$a,&$d,$active){trace('end',$a['pid'],$active);},
    'attack\\strike_prepare'=>function(&$a,&$d,$active){trace('prepare',$a['pid'],$active);$d['deathmark']=20;unset($a['seckill'],$d['seckill']);},
    'attack\\strike'=>function(&$a,&$d,$active){trace('strike',$a['pid'],$active);$a['dmg_dealt']=$GLOBALS['case']['damage'][(string)$a['pid']];$a['physical_dmg_dealt']=$a['dmg_dealt'];$a['battlelogflag_fixture']=1;},
    'attack\\strike_finish'=>function(&$a,&$d,$active){trace('finish',$a['pid'],$active);},
    'attack\\player_damaged_enemy'=>function(&$a,&$d,$active){trace('damage',$a['pid'],$active);$d['hp']-=$a['dmg_dealt'];},
    'attack\\post_player_damaged_enemy_event'=>function(&$a,&$d,$active){trace('post',$a['pid'],$active);if(!empty($GLOBALS['case']['reflect'])){$a['hp']=0;$a['deathmark']=21;}},
  ];
  $battles=[];
  foreach([0,1] as $active)foreach([
    ['id'=>'survive','damage'=>[1=>10,2=>15],'counter'=>true],
    ['id'=>'kill','damage'=>[1=>150,2=>10],'counter'=>true],
    ['id'=>'revive','damage'=>[1=>150,2=>10],'counter'=>true,'revive'=>[2]],
    ['id'=>'double-death','damage'=>[1=>150,2=>10],'counter'=>true,'reflect'=>true],
    ['id'=>'no-counter','damage'=>[1=>10,2=>15],'counter'=>false],
    ['id'=>'range-zero-isset','damage'=>[1=>10,2=>15],'counter'=>false,'outOfRange'=>0],
    ['id'=>'counter-kill','damage'=>[1=>10,2=>150],'counter'=>true],
    ['id'=>'npc-corpse','damage'=>[1=>150,2=>10],'counter'=>true,'type'=>1],
    ['id'=>'existing-action','damage'=>[1=>150,2=>10],'counter'=>true,'action'=>'attack99'],
    ['id'=>'shout','damage'=>[1=>10,2=>15],'counter'=>false,'message'=>'战斗开始'],
    ['id'=>'zero-shout','damage'=>[1=>10,2=>15],'counter'=>false,'message'=>'0'],
  ] as $c){
    $c['active']=$active;$a=p(1,100,['type'=>$c['type']??0,'action'=>$c['action']??'']);$d=p(2);
    $input=['a'=>$a,'d'=>$d];reset_case($c);
    ob_start();\battle\battle_wrapper($a,$d,$active);ob_end_clean();
    $battles[]=['case'=>$c,'input'=>$input,'expected'=>['a'=>$a,'d'=>$d,'trace'=>$GLOBALS['trace'],'context'=>[
      'log'=>$log,'originalEnemy'=>$o_edata,'enemy'=>$edata,'battleTitle'=>$battle_title,'main'=>$main,'cmd'=>$cmd]]];
  }
  $discoveries=[];
  $cases=[
    ['id'=>'empty','candidates'=>[],'fetched'=>[],'dice'=>[]],
    ['id'=>'clear-corpse','candidates'=>[p(2,0,['corpse_clear_flag'=>1,'money'=>9])],'fetched'=>[],'dice'=>[]],
    ['id'=>'empty-corpse','candidates'=>[p(2,0)],'fetched'=>[],'dice'=>[]],
    ['id'=>'found-live','candidates'=>[p(2)],'fetched'=>[2=>[p(2),p(2,90)]],'dice'=>[69]],
    ['id'=>'hidden-live','candidates'=>[p(2)],'fetched'=>[2=>[p(2)]],'dice'=>[70]],
    ['id'=>'moved','candidates'=>[p(2)],'fetched'=>[2=>[p(2,100,['pls'=>4])]],'dice'=>[]],
    ['id'=>'updated','candidates'=>[p(2)],'fetched'=>[2=>[p(2,100,['infochanged'=>1]),p(2)]],'dice'=>[0]],
    ['id'=>'corpse-loot','candidates'=>[p(2,0,['itms6'=>'∞'])],'fetched'=>[2=>[p(2,0,['itms6'=>'∞'])]],'dice'=>[]],
    ['id'=>'hidden-then-found','candidates'=>[p(2),p(3)],'fetched'=>[2=>[p(2)],3=>[p(3)]],'dice'=>[99,0]],
    ['id'=>'move-then-hidden','candidates'=>[p(2),p(3)],'fetched'=>[2=>[p(2)],3=>[p(3,100,['pls'=>4])]],'dice'=>[99]],
  ];
  foreach($cases as $c){reset_case($c);$found=\metman\discover_player();$discoveries[]=['case'=>$c,'expected'=>['found'=>$found,'log'=>$log,'mode'=>$mode,'hideflag'=>$hideflag,'trace'=>$GLOBALS['trace']]];}
  $filters=[];
  foreach([['money'=>'0'],['money'=>-1],['weps'=>'∞'],['weps'=>'∞','wepe'=>1],['arbs'=>2,'arbe'=>1],['weps'=>1,'wepk'=>'WK'],['itms6'=>1],['corpse_clear_flag'=>1,'money'=>2]] as $extra){$v=p(2,0,$extra);$filters[]=['input'=>$v,'expected'=>\metman\discover_player_filter($v)];}
  $rates=[];foreach([0,1,9,10,50] as $count)foreach(['search','move','search2','other'] as $m){reset_case(['count'=>$count]);$rates[]=['mode'=>$m,'count'=>$count,'expected'=>\metman\calculate_meetman_rate_by_mode($m)];}
  class CombatDb extends FakeDb {
    function query($sql){trace('exists');return true;}
    function num_rows($result){return $GLOBALS['case']['exists']?1:0;}
  }
  $pairHooks['enemy\\battle_wrapper']=function(&$a,&$d,$active){trace('battle',$a['pid'],$d['pid'],$active);};
  $commands=[];
  foreach([
    ['id'=>'attack'],['id'=>'back','command'=>'back'],['id'=>'no-enemy','action'=>''],
    ['id'=>'missing','exists'=>false],['id'=>'left','enemy'=>p(2,100,['pls'=>4])],
    ['id'=>'dead-loot','enemy'=>p(2,0),'corpse'=>true],['id'=>'dead-empty','enemy'=>p(2,0),'corpse'=>false],
    ['id'=>'enter','mode'=>'command','command'=>'enter'],['id'=>'other','mode'=>'command']
  ] as $extra){
    $c=array_merge(['command'=>'WK','mode'=>'combat','action'=>'enemy2','exists'=>true,'enemy'=>p(2),'corpse'=>true],$extra);
    $c['fetched']=[2=>[$c['enemy']]];reset_case($c);
    $db=new CombatDb();$command=$c['command'];$mode=$c['mode'];$sdata=p(1);$sdata['action']=$c['action'];$action=&$sdata['action'];$plsinfo=[3=>'原版地图'];
    \enemy\act();$commands[]=['case'=>$c,'expected'=>['player'=>$sdata,'log'=>$log,'mode'=>$mode,'trace'=>$GLOBALS['trace']]];
    unset($action);
  }
  $initiative=[];
  foreach([0,1] as $type)foreach([0,49,50,54,55,99] as $dice){
    $c=['dice'=>[$dice],'type'=>$type];reset_case($c);$sdata=p(1);$action=&$sdata['action'];$e=p(2,100,['type'=>$type]);
    \enemy\meetman_alternative($e);
    $initiative[]=['case'=>$c,'expected'=>['player'=>$sdata,'trace'=>$GLOBALS['trace']]];unset($action);
  }
  echo json_encode(['sourceHashes'=>$hashes,'battles'=>$battles,'discoveries'=>$discoveries,'filters'=>$filters,'rates'=>$rates,'commands'=>$commands,'initiative'=>$initiative],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
}
