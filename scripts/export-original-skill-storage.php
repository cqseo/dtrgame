<?php
// Pure source functions only; no player/DB loads. Actual original magic and hooks.
if($argc!==3)throw new Exception('Usage: php oracle.php snapshot scratch-dir');
$root=realpath($argv[1]);$out=realpath($argv[2]);if(!$root||!$out||strpos($out,$root)===0)throw new Exception('Unsafe output');
define('GAME_ROOT',$out.'/');@mkdir($out.'/include/modulemng',0700,true);
file_put_contents($out.'/include/modulemng/modulemng.config.php','<?php $___MOD_CODE_ADV2=0; $___MOD_CODE_ADV1=0;');
require $root.'/include/modules/modules.func.php';require $root.'/include/modules/base/skillbase/main.php';
$functions=array('b64_conv_to_value','value_conv_to_b64','parse_skill_parameter_data','skillbase_load_process','skillbase_save_process');foreach($functions as $f)hook_register('skillbase',$f);
$cases=array();
foreach(array(array(),array(0=>1,4095=>1,63=>1,64=>1,1=>0),array(714=>1,4=>1,1003=>1,2=>1)) as $skills){
 foreach(array(array(),array('714_lv'=>1,'4_time'=>0,'中文键'=>'中文🌙,字串','empty'=>'','false'=>false,'null'=>null),array('1003_nowcard_blink'=>'3','2_tsk_expire'=>'1793232000')) as $params){
  $saved=\skillbase\skillbase_save_process($skills,$params);$loaded=\skillbase\skillbase_load_process($saved[0],$saved[1]);
  $cases[]=array('skills'=>array_map(null,array_keys($skills),array_values($skills)),'parameters'=>array_map(null,array_keys($params),array_values($params)),'saved'=>$saved,'loadedSkills'=>array_map(null,array_keys($loaded[0]),array_values($loaded[0])),'loadedParameters'=>array_map(null,array_keys($loaded[1]),array_values($loaded[1])));
 }
}
file_put_contents($out.'/skill-storage.json',json_encode(array('sourceSha256'=>hash_file('sha256',$root.'/include/modules/base/skillbase/main.php'),'cases'=>$cases),JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));echo count($cases).' original skill serialization cases'.PHP_EOL;
