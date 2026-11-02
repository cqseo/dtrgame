import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { LEGACY_MODULES } from '../src/generated/legacy-registry.ts';
import { compilePhpModuleFile } from '../src/legacy/module-compiler.ts';
const root=process.env.DTS_LEGACY_ROOT??'../legacy-dts';
const paths={};const files={};
function configurationRecords(directory,relative){
  if(!existsSync(directory))return;
  for(const item of readdirSync(directory,{withFileTypes:true})){
    if(item.isDirectory())configurationRecords(join(directory,item.name),relative+'/'+item.name);
    else if(!item.name.startsWith('.')&&/\.(php|txt|csv)$/.test(item.name))files[relative+'/'+item.name]=readFileSync(join(directory,item.name),'utf8');
  }
}
for(const module of LEGACY_MODULES.filter(m=>m.enabled)){
  // Raw drop/shop/event records are read with openfile(), and are not all
  // named in module.inc.php's PHP code list. Do not omit these records.
  // sys configs can hold connection credentials and are captured separately
  // through the explicit preinit value whitelist, never as raw files.
  if(module.name!=='sys')configurationRecords(join(root,'include/modules/'+module.path+'config'),'include/modules/'+module.path+'config');
  for(const file of module.codeFiles){
    const path='include/modules/'+module.path+file;
    if(file.startsWith('config/') && !existsSync(join(root,path))) continue;
    const source=readFileSync(join(root,path),'utf8');
    for(const fn of compilePhpModuleFile(source)) paths[(fn.namespace+'\\'+fn.name).toLowerCase()]=path;
    // These are immutable item/drop/recipe records read by openfile(), never
    // root configuration or server connection settings. Source code already
    // executes from generated ASTs; none of the raw files are public assets.
    if(file.startsWith('config/') && /(?:item|mix|recipe|npc|area|map|stwep|stitem|shop)/i.test(file)) files[path]=source;
  }
}
for(const name of ['datalib.current.txt']){
 const path='gamedata/javascript/'+name;
 try{files[path]=readFileSync(join(root,path),'utf8');}catch{}
}
// Original fixed-schema resets are state operations in the TS store. Keep
// the input scripts byte-for-byte so no mode's reset list is handwritten.
for(const name of readdirSync(join(root,'gamedata/sql')).filter(n=>n.endsWith('.sql'))){
  files['gamedata/sql/'+name]=readFileSync(join(root,'gamedata/sql',name),'utf8');
}
const text='// Generated from frozen original source; no root configuration or player data.\nexport const LEGACY_FUNCTION_SOURCE_PATHS: Readonly<Record<string,string>> = '+JSON.stringify(paths,null,2)+';\nexport const LEGACY_RUNTIME_DATA_FILES: Readonly<Record<string,string>> = '+JSON.stringify(files,null,2)+';\n';
const out='src/generated/legacy-runtime-source-metadata.ts';
if(process.argv.includes('--check')) { if(readFileSync(out,'utf8')!==text) throw new Error('Runtime source metadata is stale'); }
else writeFileSync(out,text);
console.log({functions:Object.keys(paths).length,readonlyDataFiles:Object.keys(files).length,bytes:text.length});
