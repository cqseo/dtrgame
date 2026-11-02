<?php
// Isolated PHP language oracle: only checked-in synthetic snippets, no game
// bootstrap, filesystem state, database credentials or player information.
$cases=json_decode(stream_get_contents(STDIN),true,512,JSON_THROW_ON_ERROR);
$results=[];
foreach($cases as $case){
  if(!empty($case['definitions']))eval(substr($case['definitions'],5));
  ob_start();
  try{$value=eval($case['source']);$output=ob_get_clean();$results[]=['name'=>$case['name'],'value'=>$value,'output'=>$output];}
  catch(Throwable $error){ob_end_clean();throw $error;}
}
echo json_encode(['php'=>PHP_VERSION,'results'=>$results],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
