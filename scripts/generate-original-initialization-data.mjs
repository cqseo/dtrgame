import fs from 'node:fs';import zlib from 'node:zlib';
const inventory=JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync(new URL('../docs/original-hook-source-inventory.json.gz.base64',import.meta.url),'utf8'),'base64')));
const hooks=Object.fromEntries(Object.entries(inventory.hooks).map(([name,chain])=>[name,chain.map(({module,name,magic})=>({module,name,magic}))]));
fs.writeFileSync(new URL('../src/generated/original-hook-catalog.ts',import.meta.url),'// Derived from original modules.list.php order, never alphabetized.\nimport type { OriginalHookCatalog } from "../original-module-dispatch";\nexport const originalHookCatalog:OriginalHookCatalog='+JSON.stringify(hooks)+';\n');
const starting=JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync(new URL('../test/fixtures/original-starting-items-php.json.gz.base64',import.meta.url),'utf8'),'base64')));
fs.writeFileSync(new URL('../src/generated/original-starting-pools.ts',import.meta.url),'// Exact openfile() rows including header, duplicates, line endings and blank rows.\nexport const originalStartingPools:Readonly<Record<string,readonly string[]>>='+JSON.stringify(starting.files)+';\nexport const originalEloratedModes:readonly number[]='+JSON.stringify(starting.eloratedModes)+';\n');
console.log('Generated original ordered hook catalog and exact starting pools');
