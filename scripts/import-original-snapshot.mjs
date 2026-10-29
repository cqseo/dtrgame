#!/usr/bin/env node
/**
 * Offline verifier and PRIVATE server-to-server Supabase staging importer.
 * Never prints account rows, username strings, cookies, passwords, hashes.
 * Default is --verify-only and does not require Postgres credentials.
 *
 * ORIGINAL MYSQL MyISAM + MEMORY tables are not an atomic snapshot; imported
 * records are STAGING ONLY and cannot by themselves authorize production cutover.
 */
import { createReadStream, readFileSync } from "node:fs";
import { createGunzip } from "node:zlib";
import { createInterface } from "node:readline";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import {
  assertSourceTable,assertSchemaColumns,assertDtsSupabaseUrl,
  buildInsertSql,safeSnapshotEntry
} from "./legacy-snapshot-core.mjs";

const DEFAULT_DIR="/opt/dts-sandbox/backups/mysql-original-20261029/20261029-021530-79131";
const DEFAULT_SCHEMA="/opt/dts-port-workbench-20261029/all-tables-schema-metadata.json";
const snapshotDir=resolve(process.env.DTS_SNAPSHOT_DIR||DEFAULT_DIR);
const schemaPath=resolve(process.env.DTS_SOURCE_SCHEMA_FILE||DEFAULT_SCHEMA);
const mode=process.argv[2]||"--verify-only";
if(!["--verify-only","--import"].includes(mode))throw new Error("Use --verify-only or --import");
const manifest=JSON.parse(readFileSync(join(snapshotDir,"manifest.json"),"utf8"));
const schemas=JSON.parse(readFileSync(schemaPath,"utf8")).tables;
if(manifest.source_database_table_count!==66||manifest.tables.length!==66)throw new Error("Unexpected original table manifest");
const summaries=[];
const staged=[];
async function verifyTable(entry,needRows) {
 safeSnapshotEntry(entry);
 const cols=schemas[entry.table];
 if(!cols || cols.length!==entry.fields)throw new Error("Source metadata mismatches snapshot "+entry.table);
 const names=cols.map(x=>x.COLUMN_NAME);
 assertSchemaColumns(names,entry.fields);
 const stream=createReadStream(join(snapshotDir,entry.table+".jsonl.gz"));
 const reader=createInterface({input:stream.pipe(createGunzip()),crlfDelay:Infinity});
 const sha=createHash("sha256");
 let count=0;
 const rows=needRows?[]:null;
 for await (const line of reader) {
  if(!line)throw new Error("Unexpected empty JSONL row in "+entry.table);
  sha.update(line+"\n");
  const row=JSON.parse(line);
  if(!row||typeof row!=="object"||Array.isArray(row))throw new Error("Non-object original row");
  const fields=Object.keys(row);
  if(fields.length!==entry.fields || names.some((x,i)=>x!==fields[i])) {
   throw new Error("Original record columns differ from metadata in "+entry.table);
  }
  // Reject unrepresentable zero bytes. JSONB/Postgres TEXT cannot store them.
  for (const val of Object.values(row)) {
   if(val!==null && typeof val!=="string")throw new Error("Source string coercion changed");
   if(typeof val==="string" && val.includes("\u0000"))throw new Error("NUL original value cannot fit Postgres");
  }
  count++;
  if(rows)rows.push(row);
 }
 if(count!==entry.rows||sha.digest("hex")!==entry.sha256_jsonl){
  throw new Error("Source archive checksum/row count verification failed: "+entry.table);
 }
 return {names,count,rows,hasKey:cols.some(x=>x.COLUMN_KEY==="PRI"||x.COLUMN_KEY==="UNI")};
}
for(const entry of manifest.tables) {
 const verified=await verifyTable(entry,mode==="--import");
 summaries.push({table:entry.table,rows:verified.count});
 if(mode==="--import")staged.push({entry,verified});
}
console.log("VERIFIED",JSON.stringify({
 snapshot:manifest.snapshot,tables:summaries.length,
 rows:summaries.reduce((n,x)=>n+x.rows,0),
 checksums:"66/66",consistentGlobalTransaction:false,
 destinationHasNotBeenWritten:mode==="--verify-only"
}));
if(mode!=="--import")process.exit(0);
if(process.env.DTS_IMPORT_CONFIRM!=="acfun_legacy_STAGING_ONLY")
 throw new Error("Explicit private staging guard not supplied");
const url=assertDtsSupabaseUrl(process.env.DTS_SUPABASE_PG_URL);
const {Client}=await import("pg");
const client=new Client({
  connectionString:url.toString(),ssl:{rejectUnauthorized:true},
  statement_timeout:120000,query_timeout:120000
});
try {
 await client.connect();
 const n=await client.query("SELECT to_regclass('acfun_legacy.users') AS has_users");
 if(!n.rows[0]?.has_users)throw new Error("Expected staging schema not installed");
 for (const {entry,verified} of staged) {
  const table=assertSourceTable(entry.table);
  if(!verified.hasKey&&verified.count>0)throw new Error("Non-idempotent unkeyed source table "+entry.table);
  await client.query("BEGIN");
  try {
   await client.query("SELECT pg_advisory_xact_lock(hashtext($1))",["DTS-STAGING-"+table]);
   const sql=buildInsertSql(entry.table,verified.names);
   let inserted=0;
   for(let i=0;i<verified.rows.length;i+=100){
    const result=await client.query(sql,[JSON.stringify(verified.rows.slice(i,i+100))]);
    inserted+=result.rowCount??0;
   }
   const countQuery='SELECT count(*)::integer AS n FROM acfun_legacy."'+table+'"';
   const existing=await client.query(countQuery);
   if(existing.rows[0].n!==verified.count)throw new Error("Postgres staging row count does not match snapshot");
   await client.query("COMMIT");
   console.log("STAGED",entry.table,"sourceRows",verified.count,"newInserts",inserted);
  }catch(e){await client.query("ROLLBACK");throw e;}
 }
 // Adjust identity sequences to imported source IDs for future staging inserts.
 for(const {entry,verified} of staged) {
  const identity=schemas[entry.table].find(x=>String(x.EXTRA).includes("auto_increment"));
  if(!identity)continue;
  const table=assertSourceTable(entry.table),col=identity.COLUMN_NAME;
  const q='SELECT setval(pg_get_serial_sequence($1,$2),'+
    'GREATEST(1,COALESCE(MAX("'+col+'"),0)),MAX("'+col+'") IS NOT NULL)'+
    ' FROM acfun_legacy."'+table+'"';
  await client.query(q,['acfun_legacy.'+table,col]);
 }
 console.log("STAGING_COMPLETE_NON_ATOMIC_SNAPSHOT","no_cutover");
}catch(err){
 // Never print SQL query text or database error detail: it may contain account data.
 console.error("PRIVATE_IMPORT_FAILED",String(err?.code||err?.name||"error"));
 process.exitCode=1;
}finally {
 await client.end();
}