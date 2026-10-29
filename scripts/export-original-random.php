<?php
if($argc!==2)throw new Exception('Usage: php oracle.php output.json');
$cases=array();
foreach(array(0,1,42,5489,2147483647,4294967295) as $seed){
 mt_srand($seed);$raw=array();for($i=0;$i<1300;$i++)$raw[]=mt_rand();
 mt_srand($seed);$bounds=array(array(0,0),array(0,15),array(1,100),array(-40,80),array(0,2147483648),array(0,4294967295),array(-5000000000,5000000000),array(20,3));$values=array();
 for($i=0;$i<150;$i++)foreach($bounds as $b)$values[]=array($b[0],$b[1],rand($b[0],$b[1]));
 mt_srand($seed);$arrays=array();foreach(array(0,1,2,16,45)as $size){$a=$size?range(0,$size-1):array();shuffle($a);$arrays[]=$a;}
 mt_srand($seed);$picks=array();
 foreach(array(array(),array(1,3),array(0,1,2,3,4,5,6)) as $deleted){
  $a=array();for($i=0;$i<10;$i++)$a['key'.$i]=$i;foreach($deleted as $i)unset($a['key'.$i]);
  $buckets=array();for($i=0;$i<10;$i++)$buckets[]=in_array($i,$deleted)?null:'key'.$i;
  foreach(array(1,2,count($a)) as $num)$picks[]=array('buckets'=>$buckets,'count'=>$num,'result'=>array_rand($a,$num));
 }
 $cases[]=array('seed'=>$seed,'raw'=>$raw,'ranges'=>$values,'shuffles'=>$arrays,'picks'=>$picks);
}
file_put_contents($argv[1],json_encode(array('phpVersion'=>PHP_VERSION,'cases'=>$cases)));
echo count($cases).' PHP MT19937 oracle sequences'.PHP_EOL;
