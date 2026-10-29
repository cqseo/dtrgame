<?php
// Static source inspection only. Do not execute any module or config file.
if($argc!==3)throw new Exception('Usage: php inventory.php snapshot output.json');
$root=realpath($argv[1]);$modules=array();$hooks=array();$missing=array();$disabled=array();
foreach(file($root.'/gamedata/modules.list.php',FILE_IGNORE_NEW_LINES) as $line){
 $p=explode(',',$line);if(count($p)!==3)continue;
 list($name,$rel,$enabled)=$p;if((int)$enabled!==1){$disabled[]=$name;continue;}
 $dir=$root.'/include/modules/'.$rel;$header=$dir.'module.inc.php';
 if(!is_file($header))throw new Exception('Module header missing: '.$name);
 $content=file_get_contents($header);
 if(!preg_match('/\$___MODULE_codelist\s*=\s*\x27([^\x27]*)\x27/',$content,$match))throw new Exception('Cannot resolve code list: '.$name);
 $files=array();$functions=array();
 foreach(preg_split('/\s+/',trim($match[1])) as $file){
  if($file==='')continue;$path=$dir.$file;
  if(!is_file($path)){$missing[]='include/modules/'.$rel.$file;continue;}
  $code=file_get_contents($path);$files[]=array('path'=>'include/modules/'.$rel.$file,'sha256'=>hash('sha256',$code));
  $tokens=token_get_all($code);$n=count($tokens);
  for($i=0;$i<$n;$i++)if(is_array($tokens[$i])&&$tokens[$i][0]===T_FUNCTION){
   $function=null;$lineNo=$tokens[$i][2];
   for($j=$i+1;$j<$n;$j++){if(is_array($tokens[$j])&&$tokens[$j][0]===T_STRING){$function=strtolower($tokens[$j][1]);break;}if($tokens[$j]==='(')break;}
   if($function===null)continue;
   $body='';$depth=0;$opened=false;
   for($j=$i;$j<$n;$j++){$t=$tokens[$j];$body.=is_array($t)?$t[1]:$t;if($t==='{'){$depth++;$opened=true;}elseif(is_array($t)&&in_array($t[0],array(T_CURLY_OPEN,T_DOLLAR_OPEN_CURLY_BRACES)))$depth++;elseif($t==='}'){$depth--;if($opened&&$depth===0)break;}}
   $entry=array('name'=>$function,'module'=>$name,'path'=>'include/modules/'.$rel.$file,'line'=>$lineNo,'magic'=>strpos($body,'eval(__MAGIC__)')!==false,'sourceSha256'=>hash('sha256',$body));
   $functions[]=$entry;
   if(!in_array($function,array('init','___pre_init','___post_init'))) {$hooks[$function][]=$entry;}
  }
 }
 $modules[]=array('name'=>$name,'path'=>$rel,'files'=>$files,'functions'=>$functions);
}
file_put_contents($argv[2],json_encode(array('moduleListSha256'=>hash_file('sha256',$root.'/gamedata/modules.list.php'),'modules'=>$modules,'disabled'=>$disabled,'missingFiles'=>$missing,'hooks'=>$hooks),JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE));
echo count($modules).' enabled modules; '.count($hooks).' hook names; '.count($missing).' unavailable snapshot files'.PHP_EOL;
