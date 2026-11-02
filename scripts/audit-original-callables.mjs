import {createLegacyModuleRuntime} from '../src/legacy/php/compiled-modules.ts';
import {COMPILED_MODULE_TABLES} from '../src/generated/legacy-compiled-index.ts';
import {LEGACY_COMPILED_GLOBALS} from '../src/generated/legacy-compiled-globals.ts';
import {PHP_BUILTINS} from '../src/legacy/template/builtins.ts';
import {LegacyVirtualFilesystem} from '../src/legacy/php/virtual-filesystem.ts';
const runtime=createLegacyModuleRuntime({filesystem:new LegacyVirtualFilesystem({})});
const host=runtime.hostFunctions(new Map());
const intrinsic=new Set(['template','defined','function_exists','extract','eval','constant','preg_replace_callback',
  'ob_start','ob_get_contents','ob_get_length','ob_clean','ob_end_clean','ob_end_flush','ob_flush','flush','ob_get_clean','ob_implicit_flush','ob_get_level']);
const missing=new Map();
function walk(value,fn){
 if(!value||typeof value!=='object')return;
 if(value.kind==='call'&&typeof value.callee==='string'){
   const name=value.callee.replace(/^\\+/,'').toLowerCase();
   if(!intrinsic.has(name)&&!PHP_BUILTINS[name]&&!host.has(name)&&!runtime.has(value.callee,fn.namespace)){
     const callers=missing.get(name)??new Set();callers.add(fn.namespace+'\\'+fn.name);missing.set(name,callers);
   }
 }
 for(const item of Array.isArray(value)?value:Object.values(value))walk(item,fn);
}
const functions=[...COMPILED_MODULE_TABLES.flatMap(table=>Object.values(table)),...Object.values(LEGACY_COMPILED_GLOBALS)];
for(const fn of functions)walk(fn.program,fn);
console.log(JSON.stringify({functions:functions.length,missing:[...missing].sort(([a],[b])=>a.localeCompare(b)).map(([name,callers])=>({name,callers:[...callers]}))},null,2));
