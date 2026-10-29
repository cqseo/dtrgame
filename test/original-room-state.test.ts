import { describe,it,expect } from 'vitest';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { originalRoomTypes } from '../src/generated/original-room-types';
import {
  originalRoomInit, originalUpdateRoomState, originalRoomAutoKick, originalRoomChat,
  originalRoomParticipants, originalRoomPosition, originalRoomTakeover, originalRoomOptionValid,
  type OriginalRoomTypes, type OriginalWaitingRoom,
} from '../src/original-room-state';
interface Case {
  operation: string; type: number; state: OriginalWaitingRoom; result: unknown;
  running: number; changed: number|boolean; before: number; after: number;
  messages: number; message: string; user: string; position: number; key: string; value: unknown;
}
const fixture=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync(new URL('./fixtures/original-room-state-php.json.gz.base64',import.meta.url),'utf8'),'base64')).toString('utf8')) as {types:OriginalRoomTypes;cases:Case[]};
describe('Original waiting-room state against actual PHP functions',()=>{
  it('ships the actual installed type definitions, including additive timed duel mode',()=>{
    expect(originalRoomTypes).toEqual(fixture.types);
    expect(originalRoomTypes[14]?.['ready-expire-time']).toBe(90);
  });
  for(const [index,test] of fixture.cases.entries()) it(`PHP case ${index}: ${test.operation} type ${test.type??test.state?.roomtype}`,()=>{
    const state=structuredClone(test.state);
    switch(test.operation) {
      case 'init': expect(originalRoomInit(test.type,'QA_OWNER',fixture.types)).toEqual(test.result);break;
      case 'update': {
        expect(originalUpdateRoomState(state,!!test.running,test.before,fixture.types)).toBe(test.changed);
        const expected=structuredClone(test.result) as OriginalWaitingRoom;
        if(expected.kicktime>0 && test.state.kicktime===0) {
          expect(state.kicktime).toBeGreaterThanOrEqual(expected.kicktime-(test.after-test.before));
          expect(state.kicktime).toBeLessThanOrEqual(expected.kicktime);
          expected.kicktime=state.kicktime;
        }
        expect(state).toEqual(expected);break;
      }
      case 'kick': expect(originalRoomAutoKick(state,2,fixture.types)).toBe(test.changed);expect(state).toEqual(test.result);break;
      case 'chat': for(let i=0;i<test.messages;i++)originalRoomChat(state,'synthetic message '+i);expect(state).toEqual(test.result);break;
      case 'empty_chat': originalRoomChat(state,test.message);expect(state).toEqual(test.result);break;
      case 'participants': expect(originalRoomParticipants(state,fixture.types)).toEqual(test.result);break;
      case 'position': expect(originalRoomPosition(state,test.user,fixture.types)).toBe(test.result);break;
      case 'takeover': expect(originalRoomTakeover(state,test.user,test.position)).toBe(test.changed);expect(state).toEqual(test.result);break;
      case 'option': expect(originalRoomOptionValid(test.type,test.key,test.value,fixture.types)).toBe(test.result);break;
      default: throw new Error('Unrecognized oracle operation');
    }
  });
});
