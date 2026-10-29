import {describe,it,expect} from 'vitest';
import fs from 'node:fs';import {gunzipSync} from 'node:zlib';
import {originalRoomTemplates} from '../src/generated/original-room-templates';
import type {OriginalTemplateContext,OriginalTemplateConstants} from '../src/original-room-template-runtime';
const fixture=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync(new URL('./fixtures/original-room-templates-php.json.gz.base64',import.meta.url),'utf8'),'base64')).toString()) as {constants:OriginalTemplateConstants;cases:{name:string;context:OriginalTemplateContext;html:string;before:number;after:number}[]};
describe('Original room template PHP byte parity',()=>{
  for(const [i,c] of fixture.cases.entries())it(`source render ${i}: ${c.name}`,()=>{
    const actual=originalRoomTemplates[c.name]!({...structuredClone(c.context),__renderNow:c.before},fixture.constants,()=>{throw Error('Unexpected file read');},originalRoomTemplates);
    // Source time() can move only within the measured oracle invocation.
    if(c.before===c.after)expect(actual).toBe(c.html);
    else expect(Array.from({length:c.after-c.before+1},(_,d)=>originalRoomTemplates[c.name]!({...structuredClone(c.context),__renderNow:c.before+d},fixture.constants,()=>'',originalRoomTemplates))).toContain(c.html);
  });
});
