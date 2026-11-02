// Isolated Miniflare entry only. Uses the production actor and original HTTP
// handlers; its synthetic PostgREST service never contacts a real account.
import {handleOriginalEngineHttp} from '../src/runtime/http-original-engine';
import {applyOriginalRouting} from '../src/original-routing';
export {OriginalGameActor} from '../src/runtime/original-game-actor';
export default {async fetch(request:Request,env:{ORIGINAL:DurableObjectNamespace;ASSETS:Fetcher}){
  const url=new URL(request.url);
  if(!['localhost','127.0.0.1'].includes(url.hostname))return new Response('Isolated local QA only.',{status:403});
  const routed=applyOriginalRouting(url.pathname,request.method);if(routed)return routed;
  const response=await handleOriginalEngineHttp(request,env.ORIGINAL);
  return response??env.ASSETS.fetch(request);
}};
