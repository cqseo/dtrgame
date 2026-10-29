<?php
/**
 * READ-ONLY ORIGINAL DTS MYSQL TABLE SNAPSHOT (no destination SQL writes).
 * One streaming gzip JSONL per table, source values preserved as strings.
 * MyISAM + MEMORY mean this is not one globally atomic transaction.
 * Snapshot files MUST stay on authorized private server.
 */
declare(strict_types=1);
umask(0077);
require '/www/wwwroot/dts-game-test/include/modules/core/sys/config/server.config.php';
$schema = json_decode(file_get_contents(getenv('DTS_SOURCE_SCHEMA_FILE') ?: '/opt/dts-port-workbench-20261029/all-tables-schema-metadata.json'),true,512,JSON_THROW_ON_ERROR);
if (($schema['table_count'] ?? 0) !== 66) throw new RuntimeException('Unexpected schema, abort');
$sourceTables = $schema['tables'];
$root='/opt/dts-sandbox/backups/mysql-original-20261029';
if (!is_dir($root) && !mkdir($root,0700,true)) throw new RuntimeException('Could not create private backup directory');
chmod($root,0700);
$run=gmdate('Ymd-His') . '-' . getmypid();
$dest="$root/$run";
if (!mkdir($dest,0700))throw new RuntimeException('Could not create isolated snapshot directory');
$mysqli = new mysqli($dbhost,$dbuser,$dbpw,$dbname);
if($mysqli->connect_errno)throw new RuntimeException('Original MySQL unavailable');
if(!$mysqli->set_charset('utf8mb4'))throw new RuntimeException('Could not select utf8mb4');
$result=[];
foreach($sourceTables as $table=>$cols){
  if (!preg_match('/^acbra2_[a-zA-Z0-9_]+$/D',$table))throw new RuntimeException('Unexpected table identifier');
  $file="$dest/$table.jsonl.gz";
  $handle=gzopen($file,'wb6');
  if(!$handle)throw new RuntimeException('Could not open private gzip file');
  $digest=hash_init('sha256');
  $rows=0;$plainBytes=0;
  $start=microtime(true);
  // Unbuffered read-only MySQL query, no SELECT data is printed to tool output.
  $q=$mysqli->query("SELECT * FROM ".$table,MYSQLI_USE_RESULT);
  if(!$q){gzclose($handle);throw new RuntimeException('Could not read source table ' . $table);}
  try{
    while($row=$q->fetch_assoc()){
      $text=json_encode($row, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR) . "\n";
      if(gzwrite($handle,$text)!==strlen($text))throw new RuntimeException("Write failure $table");
      hash_update($digest,$text);
      $plainBytes+=strlen($text);$rows++;
    }
  }finally{$q->free();gzclose($handle);}
  chmod($file,0600);
  $result[]=[
    'table'=>$table, 'rows'=>$rows, 'uncompressed_bytes'=>$plainBytes,
    'compressed_bytes'=>filesize($file), 'sha256_jsonl'=>hash_final($digest),
    'fields'=>count($cols), 'duration_seconds'=>round(microtime(true)-$start,3)
  ];
  echo "$table rows=$rows compressed=".filesize($file)."\n";
}
$manifest=['snapshot'=>$run,'source_database_table_count'=>count($result),
 'source_warning'=>'Non-atomic per-table snapshot: original MyISAM/MEMORY; not a cutover-safe global transaction',
 'source_rows_total'=>array_sum(array_column($result,'rows')),
 'tables'=>$result];
file_put_contents("$dest/manifest.json",json_encode($manifest,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_THROW_ON_ERROR));
chmod("$dest/manifest.json",0600);
echo 'SNAPSHOT_COMPLETED='.json_encode(['id'=>$run,'tables'=>count($result),
 'rows'=>array_sum(array_column($result,'rows')),'destination'=>$dest],JSON_UNESCAPED_SLASHES)."\n";