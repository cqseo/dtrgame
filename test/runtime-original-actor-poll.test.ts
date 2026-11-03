import {afterEach,expect,it,vi} from 'vitest';
const execute=vi.hoisted(()=>vi.fn());
vi.mock('../src/runtime/original-request-transaction',()=>({
  executeOriginalCommand:execute,originalRequestStore:()=>({reconcile:vi.fn()})
}));
import {OriginalGameActor} from '../src/runtime/original-game-actor';
afterEach(()=>{execute.mockReset();vi.useRealTimers();});
const request=(page:string,signal?:AbortSignal)=>new Request('https://original.internal/execute',{method:'POST',body:JSON.stringify({roomId:1,page,request:{method:'POST'}}),signal:signal??null});
function actor(){
  return new OriginalGameActor({blockConcurrencyWhile:async(fn:()=>unknown)=>fn(),storage:{get:async()=>undefined},waitUntil:()=>{}} as unknown as DurableObjectState,
    {DTS_ORIGINAL_ENGINE:'enabled',SUPABASE_URL:'https://isolated.invalid',SUPABASE_SECRET_KEY:'test-only'});
}
it('releases the room queue before waiting, then renders the original wake leg after a broadcast',async()=>{
  execute.mockImplementation(async(input:{page:string})=>({status:200,headers:input.page==='roomupdate'?[['x-original-room-wait','1']]:[],body:input.page==='roomupdate'?'':input.page}));
  const room=actor(),poll=room.fetch(request('roomupdate'));
  await vi.waitFor(()=>expect(execute).toHaveBeenCalledTimes(1));
  // A waiting player must never hold the queue that the other player needs.
  expect(await (await room.fetch(request('command_roomcmd'))).text()).toBe('command_roomcmd');
  await room.fetch(new Request('https://original.internal/notify',{method:'POST'}));
  const result=await poll;
  expect(await result.text()).toBe('roomupdate_wake');
  expect(result.headers.has('x-original-room-wait')).toBe(false);
});
it('returns the original empty response after a client disconnect without executing a wake command',async()=>{
  execute.mockResolvedValue({status:200,headers:[['x-original-room-wait','1']],body:''});
  const room=actor(),controller=new AbortController(),poll=room.fetch(request('roomupdate',controller.signal));
  await vi.waitFor(()=>expect(execute).toHaveBeenCalledTimes(1));
  controller.abort();expect(await (await poll).text()).toBe('');
  expect(execute).toHaveBeenCalledTimes(1);
});
