#!/usr/bin/env node
// One-time, lossless representation migration of already captured ASTs.
// Does not read/modify PHP or reconstruct any original game function.
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {renderCompiledFunction} from './lib/render-compiled-function.mjs';
const root=resolve(import.meta.dirname,'..'),changes=[],manifest=[];
const used=new Set([...readFileSync(resolve(root,'src/generated/legacy-compiled-index.ts'),'utf8').matchAll(/from "\.\/(legacy-compiled-[A-Za-z0-9_]+)"/g)].map(match=>match[1]+'.ts'));
used.add('legacy-compiled-globals.ts');
for(const name of readdirSync(resolve(root,'src/generated')).sort()){
  if(!used.has(name))continue;
  const path=resolve(root,'src/generated',name),source=readFileSync(path,'utf8');
  if(source.includes('lazyOriginalFunction('))throw new Error('Already repacked; do not overwrite the original manifest: '+name);
  const declaration=/export const \w+: Record<string, CompiledPhpFunction> = \{([\s\S]*)\};\s*$/.exec(source);
  if(!declaration)throw new Error('Unrecognized original function table: '+name);
  const table=JSON.parse('{'+declaration[1].replace(/,\s*$/,'')+'}');
  const functions=Object.entries(table);
  for(const [key,fn]of functions){
    if(fn.name!==key||typeof fn.namespace!=='string'||!Array.isArray(fn.parameters)||!Array.isArray(fn.program))throw new Error('Invalid captured function: '+name+'/'+key);
    const restored={...fn,program:JSON.parse(JSON.stringify(fn.program))};
    if(JSON.stringify(restored)!==JSON.stringify(fn))throw new Error('Non-JSON original syntax: '+name+'/'+key);
  }
  manifest.push({file:name,functions:functions.length,sha256:createHash('sha256').update(JSON.stringify(table)).digest('hex')});
  const header=source.slice(0,declaration.index).replace(/\n\s*$/,'\n')+'import {lazyOriginalFunction} from "../legacy/php/lazy-original-function";\n\n';
  changes.push({path,text:header+declaration[0].slice(0,declaration[0].indexOf('{')+1)+'\n'+functions.map(([key,fn])=>'  '+JSON.stringify(key)+': '+renderCompiledFunction(fn)+',').join('\n')+'\n};\n'});
}
if(changes.length!==736)throw new Error('Expected 735 original module tables and the global function table, got '+changes.length);
const file=resolve(root,'docs/original-function-ast-digests.json');
writeFileSync(file,JSON.stringify({baseline:'cf0f27185fdad0ce58b6d6a7509f64403e715913',tables:manifest},null,2)+'\n');
for(const change of changes)writeFileSync(change.path,change.text);
console.log(JSON.stringify({tables:changes.length,functions:manifest.reduce((sum,t)=>sum+t.functions,0),manifest:file}));
