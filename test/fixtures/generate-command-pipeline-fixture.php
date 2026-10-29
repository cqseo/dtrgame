<?php
/** Exact phase order from the installed command_act.php, read-only. */
declare(strict_types=1);
$source=file_get_contents('/www/wwwroot/dts-game-test/include/pages/command_act.php');
$steps=[
  'initPlayerData'=>'\player\init_playerdata();',
  'preAct'=>'\player\pre_act();',
  'act'=>'\player\act();',
  'postAct'=>'\player\post_act();',
  'prepareResponse'=>'\player\prepare_response_content();',
  'parseProfile'=>'\player\parse_interface_profile();',
  'parseGameInfo'=>'\player\parse_interface_gameinfo();',
  'encodeResponse'=>'$jgamedata=gencode($gamedata);',
  'emitResponse'=>'echo $jgamedata;',
  'updateSdata'=>'\player\update_sdata();',
  'beforeLastSave'=>'\player\before_last_player_save_event();',
  'savePlayer'=>'\player\player_save($sdata);'
];
$result=[];
foreach($steps as $name=>$needle){
  $pos=$name==='emitResponse'?strrpos($source,$needle):strpos($source,$needle);
  if($pos===false)throw new RuntimeException("Could not find original phase '$name'");
  $result[$name]=$pos;
}
$last=-1;
foreach($result as $name=>$pos)if($pos<$last)throw new RuntimeException("Source order not monotonic at $name");else $last=$pos;
$fixture=['source'=>'installed original include/pages/command_act.php',
 'orderedSteps'=>array_keys($result),
 'actionGuard'=>'$gamestate >= 20 && $hp > 0 && $state <= 3',
 'responseBeforeSave'=>true];
$out='/opt/dts-port-workbench-20261029/test/fixtures/original-command-pipeline-php.json';
file_put_contents($out,json_encode($fixture,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR));
echo json_encode(['phases'=>count($result),'orderSourceValid'=>true,'fixture_sha256'=>hash_file('sha256',$out)])."\n";