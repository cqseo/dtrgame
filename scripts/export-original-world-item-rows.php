<?php
if($argc!==5)throw new Exception('Usage: php oracle.php snapshot inventory.json configs.json scratch-dir');
$root=realpath($argv[1]);$inventory=json_decode(file_get_contents($argv[2]),true);$configs=json_decode(file_get_contents($argv[3]),true);$out=realpath($argv[4]);if(!$root||!$out||strpos($out,$root)===0)throw new Exception('Unsafe output');
define('GAME_ROOT',$out.'/');@mkdir($out.'/include/modulemng',0700,true);file_put_contents($out.'/include/modulemng/modulemng.config.php','<?php $___MOD_CODE_ADV2=0; $___MOD_CODE_ADV1=0;');require $root.'/include/modules/modules.func.php';define('MOD_POISON',true);define('MOD_EX_ATTR_DIGIT',true);
foreach(array('sys','itemshop','itemmain','attrbase')as $m)define('IMPORT_MODULE_'.strtoupper($m).'_GLOBALS','global $gametype,$gamevars,$db,$tablepre;');
function openfile($file){global $configs,$root;return $configs['files'][substr($file,strlen($root)+1)];}
class TestDB{function query($sql){return strpos($sql,"name='owner'")!==false?array(array('pid'=>88)):array();}function num_rows($a){return count($a);}function fetch_array(&$a){return array_shift($a);}}
eval('namespace poison {function poison_record_pid(&$str,$id){$str="^psr".$id;}}');
eval('namespace achievement_base {function check_achtype_available($type){global $eventOn;return $eventOn?1:0;}}');
function extract_source_function($path,$wanted){
 $tokens=token_get_all(file_get_contents($path));$n=count($tokens);
 for($i=0;$i<$n;$i++)if(is_array($tokens[$i])&&$tokens[$i][0]===T_FUNCTION){
  $name=null;for($j=$i+1;$j<$n;$j++){if(is_array($tokens[$j])&&$tokens[$j][0]===T_STRING){$name=strtolower($tokens[$j][1]);break;}if($tokens[$j]==='(')break;}
  if($name!==$wanted)continue;$body='';$depth=0;$opened=false;
  for($j=$i;$j<$n;$j++){$t=$tokens[$j];$body.=is_array($t)?($t[0]===T_DIR?var_export(dirname($path),true):$t[1]):$t;if($t==='{'){$depth++;$opened=true;}elseif(is_array($t)&&in_array($t[0],array(T_CURLY_OPEN,T_DOLLAR_OPEN_CURLY_BRACES)))$depth++;elseif($t==='}'){$depth--;if($opened&&$depth===0)break;}}
  return $body;
 }
 throw new Exception('Function not found: '.$wanted);
}
$names=array('mapitem_row_data_seperate','mapitem_row_data_process','shopitem_row_data_seperate','shopitem_row_data_process','get_shopitem_list','get_shopitem_list_by_kind','config_process_encode_comp_itmsk','config_process_encode_comp_itmsk_callback','config_process_encode_comp_itmsk_sepr_transfer','config_process_encode_comp_itmsk_sepr_transfer_callback','base64_encode_comp_itmsk');
foreach($inventory['modules']as $m)foreach($m['functions']as $f){if(!in_array($f['name'],$names,true))continue;eval('namespace '.$f['module'].' {'.extract_source_function($root.'/'.$f['path'],$f['name']).'}');hook_register($f['module'],$f['name']);}
$cases=array();$db=new TestDB();$tablepre='isolated_';
foreach(array(0,4,19,20)as $gametype)foreach(array(false,true)as $eventOn){$gamevars=array('instance10_stage'=>2);
 foreach($configs['files']as $path=>$lines){if(strpos($path,'/mapitem.config.php')!==false){$rows=array();foreach($lines as $i=>$line)if($i>0&&strpos($line,',')!==false&&substr($line,0,1)!=='='){file_put_contents($out.'/progress.txt',$gametype.' '.$path.' row '.$i);$rows[]=array('line'=>$line,'index'=>$i,'result'=>\itemmain\mapitem_row_data_seperate($line,$i));}$cases[]=array('gametype'=>$gametype,'eventOn'=>$eventOn,'kind'=>'map','rows'=>$rows);}
 elseif(strpos($path,'/shopitem.config.php')!==false){file_put_contents($out.'/progress.txt',$gametype.' '.$path.' shop');$cases[]=array('gametype'=>$gametype,'eventOn'=>$eventOn,'kind'=>'shop','lines'=>$lines,'result'=>\itemshop\get_shopitem_list($lines));}
 }
 $cases[]=array('gametype'=>$gametype,'eventOn'=>$eventOn,'kind'=>'map','rows'=>array(array('line'=>'0,1,1,带毒,PH,20,1,=owner','index'=>1,'result'=>\itemmain\mapitem_row_data_seperate('0,1,1,带毒,PH,20,1,=owner',1)),array('line'=>'0,1,1,未知,PH,20,1,=missing','index'=>2,'result'=>\itemmain\mapitem_row_data_seperate('0,1,1,未知,PH,20,1,=missing',2))));
}
file_put_contents($out.'/rows.json',json_encode(array('cases'=>$cases),JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));echo count($cases).' original complete world-row groups'.PHP_EOL;
