import {it,expect} from 'vitest';import fs from 'node:fs';import {gunzipSync} from 'node:zlib';
import {originalRoomCommand,type RoomCommandEffects} from '../src/original-room-commands';
import type {OriginalWaitingRoom} from '../src/original-room-state';
const f=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync(new URL('./fixtures/original-room-commands-php.json.gz.base64',import.meta.url),'utf8'),'base64')).toString()) as {cases:{state:OriginalWaitingRoom;command:string;p1:string;p2:string;user:string;inactive:boolean;result:OriginalWaitingRoom;effects:RoomCommandEffects;error:string|null;before:number;after:number}[]};
for(const [i,c]of f.cases.entries())it(`source room command ${i}: ${c.command} (${c.state.roomtype}, ${c.user})`,()=>{
  const state=structuredClone(c.state);let effects:RoomCommandEffects|undefined,error:string|null=null;
  try{effects=originalRoomCommand(state,c.command,c.p1,c.p2,c.user,c.before,10,0,c.inactive);}catch(e){error=(e as Error).message;}
  expect(error).toBe(c.error);
  if(!error)expect(effects).toEqual(c.effects);
  const expected=structuredClone(c.result);
  if(expected.kicktime!==c.state.kicktime&&c.before!==c.after){expect(state.kicktime).toBeGreaterThanOrEqual(expected.kicktime-(c.after-c.before));expect(state.kicktime).toBeLessThanOrEqual(expected.kicktime);expected.kicktime=state.kicktime;}
  expect(state).toEqual(expected);
});
