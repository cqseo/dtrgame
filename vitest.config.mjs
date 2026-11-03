import {defineConfig} from 'vitest/config';

// Wrangler imports Wasm as a precompiled WebAssembly.Module. Mirror that
// contract in Node tests; Vite otherwise treats .wasm as JavaScript ESM.
export default defineConfig({test:{server:{deps:{inline:[/sql\.js/]}}},plugins:[{
  name:'cloudflare-precompiled-wasm',enforce:'pre',
  load(id){
    if(!id.endsWith('.wasm'))return null;
    return `import {readFileSync} from 'node:fs'; export default new WebAssembly.Module(readFileSync(${JSON.stringify(id)}));`;
  }
}]});
