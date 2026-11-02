import {describe,expect,it,vi} from 'vitest';
import {handleOriginalEngineHttp} from '../src/runtime/http-original-engine';
import {legacyEncode} from '../src/original-protocol';
function namespace(body:string,status=200,headers:HeadersInit={}){
  const calls:Array<{roomId:number;page:string;request:{post:Array<[string,string]>;cookies:Array<[string,string]>}}> = [];
  const fetch=vi.fn(async(request:Request)=>{calls.push(await request.json() as never);return new Response(body,{status,headers});});
  return {calls,fetch,namespace:{idFromName:(name:string)=>name,get:()=>({fetch})} as unknown as DurableObjectNamespace};
}
describe('original public PHP wrappers over actor transport',()=>{
  it('routes original login, registration and recovery through canonical account transactions',async()=>{
    const fixture=namespace('',302,{'location':'index.php','set-cookie':'acbra2_user=Alpha; Path=/'});
    for(const path of ['/login.php','/register.php','/recovery.php']){
      const response=await handleOriginalEngineHttp(new Request('https://game.test'+path+'?mode=quit',{method:'POST',body:'username=Alpha&password=test-only'}),fixture.namespace);
      expect(response?.status).toBe(302);expect(response?.headers.getSetCookie()).toHaveLength(1);
      expect(fixture.calls.at(-1)?.page).toBe('public:'+path);
    }
  });
  it('forwards room polling timestamps and original cookie credentials to the room actor',async()=>{
    const fixture=namespace('original-room-update');
    const response=await handleOriginalEngineHttp(new Request('https://game.test/roomupdate.php',{method:'POST',body:'timestamp=27',headers:{cookie:'acbra2_user=Alpha; acbra2_pass=token; acbra2_roomid=3'}}),fixture.namespace);
    expect(await response?.text()).toBe('original-room-update');
    expect(fixture.calls[0]).toMatchObject({page:'roomupdate',roomId:3,request:{post:[['timestamp','27']]}});
  });
  it('executes original logout before forwarding and deletes original account cookies',async()=>{
    const fixture=namespace('unused');
    const response=await handleOriginalEngineHttp(new Request('https://game.test/game.php',{method:'POST',body:'mode=quit'}),fixture.namespace);
    expect(response?.status).toBe(302);expect(response?.headers.get('location')).toBe('index.php');
    expect(response?.headers.getSetCookie().map(c=>c.split('=',1)[0])).toEqual(['acbra2_user','acbra2_pass']);
    expect(fixture.fetch).not.toHaveBeenCalled();
  });
  it('keeps original GET room commands, extra context and cookie filtering',async()=>{
    const fixture=namespace('redirect:game.php');
    const response=await handleOriginalEngineHttp(new Request('https://game.test/roomcmd.php?command=enterroom&para1=3',{
      headers:{cookie:'acbra2_user=Alpha; acbra2_pass=token; acbra2_roomid=0; irrelevant=value'}
    }),fixture.namespace);
    expect(response?.status).toBe(302);expect(response?.headers.get('location')).toBe('game.php');
    expect(fixture.calls[0]?.page).toBe('command_roomcmd');
    expect(Object.fromEntries(fixture.calls[0]!.request.post)).toMatchObject({page:'command_roomcmd',command:'enterroom',para1:'3',not_ajax:'1'});
    expect(Object.fromEntries(fixture.calls[0]!.request.cookies)).toEqual({acbra2_user:'Alpha',acbra2_pass:'token',acbra2_roomid:'0'});
  });
  it('adds valid_ip using the original public valid.php script',async()=>{
    const fixture=namespace('redirect:game.php');
    const response=await handleOriginalEngineHttp(new Request('https://game.test/valid.php',{method:'POST',body:'mode=enter&card=0',headers:{'cf-connecting-ip':'192.0.2.12'}}),fixture.namespace);
    expect(response?.status).toBe(302);
    expect(Object.fromEntries(fixture.calls[0]!.request.post)).toMatchObject({page:'command_valid',mode:'enter',card:'0',valid_ip:'192.0.2.12'});
  });
  it('renders original error HTML when a wrapper receives an original encoded gexit',async()=>{
    const fixture=namespace(await legacyEncode({url:'error.php',errormsg:'original failure <&>'}));
    const response=await handleOriginalEngineHttp(new Request('https://game.test/game.php'),fixture.namespace);
    expect(response?.status).toBe(200);
    expect(await response?.text()).toContain('original failure <&>');
  });
  it('forwards original command bytes and selects the posted room',async()=>{
    const fixture=namespace('original-wire-data');
    const response=await handleOriginalEngineHttp(new Request('https://game.test/command.php',{method:'POST',body:'mode=command&command=move&game_roomid=3&moveto=2',headers:{cookie:'acbra2_user=Alpha; acbra2_pass=token'}}),fixture.namespace);
    expect(await response?.text()).toBe('original-wire-data');expect(fixture.calls[0]?.roomId).toBe(3);expect(fixture.calls[0]?.page).toBe('command_act');
  });
  it('never forwards public maintenance or daemon start commands',async()=>{
    const fixture=namespace('unused');
    for(const body of ['command=maintain','conn_passwd=guess&command=start']){
      expect((await handleOriginalEngineHttp(new Request('https://game.test/command.php',{method:'POST',body}),fixture.namespace))?.status).toBe(403);
    }
    expect(fixture.fetch).not.toHaveBeenCalled();
    for(const page of ['roomupdate','roomupdate_wake']){
      expect((await handleOriginalEngineHttp(new Request('https://game.test/command.php',{method:'POST',body:'page='+page}),fixture.namespace))?.status).toBe(400);
    }
  });
});
