// Feed the JSON written by export-original-room-fixtures.php on the source host.
import fs from 'node:fs';
import zlib from 'node:zlib';
if (!process.argv[2]) throw new Error('Usage: node scripts/generate-original-room-types.mjs /path/to/oracle.json');
const data=fs.readFileSync(process.argv[2]), oracle=JSON.parse(data);
if (!oracle.sourceHashes || !oracle.types?.[14] || !Array.isArray(oracle.cases)) throw new Error('Incomplete installed room oracle');
fs.writeFileSync(new URL('../test/fixtures/original-room-state-php.json.gz.base64',import.meta.url),zlib.gzipSync(data,{level:9}).toString('base64')+'\n');
fs.writeFileSync(new URL('../src/generated/original-room-types.ts',import.meta.url),
  '// Original installed roommng.config.php + quickmatch.config.php. No hand edits.\n'+
  'import type { OriginalRoomTypes } from "../original-room-state";\n'+
  'export const originalRoomSourceHashes = '+JSON.stringify(oracle.sourceHashes,null,2)+';\n'+
  'export const originalRoomTypes: OriginalRoomTypes = '+JSON.stringify(oracle.types,null,2)+';\n');
console.log(`${Object.keys(oracle.types).length} original room types and ${oracle.cases.length} oracle cases generated`);
