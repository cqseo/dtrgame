import {describe,it,expect}from 'vitest';import fs from 'node:fs';import {gunzipSync}from 'node:zlib';import {OriginalPhpRandom}from '../src/original-random';
const f=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync(new URL('./fixtures/original-random-php.json.gz.base64',import.meta.url),'utf8'),'base64')).toString())as{cases:{seed:number;raw:number[];ranges:[number,number,number][];shuffles:number[][];picks:{buckets:(string|null)[];count:number;result:string|string[]}[]}[]};
describe('PHP 7.4 random stream and rejection sampling',()=>{
 for(const c of f.cases){
  it(`raw MT sequence across reloads for seed ${c.seed}`,()=>{const r=new OriginalPhpRandom(c.seed);expect(c.raw.map(()=>r.raw31())).toEqual(c.raw);});
  it(`inclusive 32/64 bit ranges for seed ${c.seed}`,()=>{const r=new OriginalPhpRandom(c.seed);for(const [min,max,n]of c.ranges)expect(r.int(min,max)).toBe(n);});
  it(`original shuffle order for seed ${c.seed}`,()=>{const r=new OriginalPhpRandom(c.seed);expect([0,1,2,16,45].map(n=>r.shuffle(Array.from({length:n},(_,i)=>i)))).toEqual(c.shuffles);});
  it(`original array_rand bucket sampling for seed ${c.seed}`,()=>{const r=new OriginalPhpRandom(c.seed);for(const p of c.picks)expect(r.arrayKeys(p.buckets,p.count)).toEqual(p.result);});
 }
 it('restores RNG state without skipping or repeating a draw',()=>{const r=new OriginalPhpRandom(42);for(let i=0;i<630;i++)r.int(0,100);const copy=OriginalPhpRandom.restore(r.snapshot());expect(Array.from({length:100},()=>copy.int(-100,200))).toEqual(Array.from({length:100},()=>r.int(-100,200)));});
});
