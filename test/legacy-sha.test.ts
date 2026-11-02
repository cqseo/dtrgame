import {expect,it} from 'vitest';
// @ts-expect-error test-only Node builtin
import {createHash} from 'node:crypto';
import {shaDigest} from '../src/legacy/template/hash';
it.each(['sha1','sha256'] as const)('matches independent native %s digests at padding boundaries and arbitrary binary bytes',algorithm=>{
  for(const size of [0,1,55,56,63,64,65,127,128,8193,1_000_000]){
    const bytes=Uint8Array.from({length:size},(_,i)=>i%256);
    expect([...shaDigest(algorithm,bytes)]).toEqual([...createHash(algorithm).update(bytes).digest()]);
  }
});
