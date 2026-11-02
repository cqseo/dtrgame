import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const file='node_modules/sql.js/dist/sql-wasm-browser.js';
const source=readFileSync(file,'utf8');
const expected='17e880ef4c40827f93ead7766ab960937259368a8341b9d231984a7d8f9fbd41';
if(createHash('sha256').update(source).digest('hex')!==expected)throw new Error('sql.js 1.15.2 source changed; review Worker adapter before regenerating.');
const needle='ca&&(sa=self.location.href);';
if(source.split(needle).length!==2)throw new Error('sql.js Worker environment marker changed.');
const patched='// Generated from sql.js 1.15.2 by scripts/generate-sqljs-worker.mjs.\n'+
  '// Cloudflare WorkerGlobalScope has no self.location; no network/file loader is used.\n'+
  source.replace(needle,'ca&&(sa=self.location?.href??"");');
const output='src/vendor/sqljs-worker.cjs';mkdirSync('src/vendor',{recursive:true});
if(process.argv.includes('--check')){if(readFileSync(output,'utf8')!==patched)throw new Error('sql.js Worker adapter is stale.');}
else{writeFileSync(output,patched);writeFileSync('src/vendor/sqljs-LICENSE',readFileSync('node_modules/sql.js/LICENSE'));}
