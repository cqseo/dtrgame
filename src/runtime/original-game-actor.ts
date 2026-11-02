import {SupabaseLegacyRest} from './supabase';
import {executeOriginalCommand,originalRequestStore,type OriginalPendingRequest} from './original-request-transaction';
import type {LegacyPageRequest} from '../legacy/php/runtime';
import {createSqliteShadow} from './sqlite-shadow';

interface OriginalActorEnv {
  DTS_ORIGINAL_ENGINE?:string;
  SUPABASE_URL?:string;
  SUPABASE_SECRET_KEY?:string;
}
export interface OriginalActorCommand {roomId:number;page:string;request:LegacyPageRequest}

/** One serialized original room. PostgreSQL also validates all shared inputs
 * and serializes cross-room account, ranking, history and cache commits. */
export class OriginalGameActor {
  #queue:Promise<unknown>=Promise.resolve();
  #ready:Promise<unknown>;
  #pending:OriginalPendingRequest|undefined;
  constructor(readonly ctx:DurableObjectState,readonly env:OriginalActorEnv){
    this.#ready=ctx.blockConcurrencyWhile(async()=>{this.#pending=await ctx.storage.get<OriginalPendingRequest>('original-pending');});
  }
  async fetch(request:Request):Promise<Response>{
    await this.#ready;
    const next=this.#queue.then(()=>this.#fetch(request));this.#queue=next.catch(()=>undefined);return next;
  }
  async #fetch(request:Request):Promise<Response>{
    if(this.env.DTS_ORIGINAL_ENGINE!=='enabled')return new Response('Original engine is disabled.',{status:503});
    if(request.method!=='POST'||new URL(request.url).pathname!=='/execute')return new Response('Not Found',{status:404});
    if(!this.env.SUPABASE_URL||!this.env.SUPABASE_SECRET_KEY)return new Response('Original persistence is unavailable.',{status:503});
    const store=originalRequestStore(new SupabaseLegacyRest({url:this.env.SUPABASE_URL,secretKey:this.env.SUPABASE_SECRET_KEY}));
    try{
      // No subsequent request may execute until a crashed/uncertain earlier
      // command either has a receipt or has been fenced at the SQL lock.
      if(this.#pending){await store.reconcile(this.#pending);await this.#clearPending();}
      const body=await request.json<OriginalActorCommand>();
      if(!Number.isSafeInteger(body.roomId)||body.roomId<0||body.roomId>12||typeof body.page!=='string'||!body.request||typeof body.request!=='object')return new Response('Invalid original command.',{status:400});
      const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(body)));
      const requestDigest=[...new Uint8Array(digest)].map(v=>v.toString(16).padStart(2,'0')).join('');
      const response=await executeOriginalCommand({store,createShadow:createSqliteShadow,
        roomId:body.roomId,page:body.page,request:body.request,now:Math.floor(Date.now()/1000),requestId:crypto.randomUUID(),requestDigest,
        beforeCommit:async pending=>{await this.ctx.storage.put('original-pending',pending);this.#pending=pending;},
        afterResolved:()=>this.#clearPending()
      });
      return new Response([204,205,304].includes(response.status)?null:response.body,{status:response.status,headers:response.headers});
    }catch(error){
      console.error('Original command did not complete.',error instanceof Error?error.message:'unknown failure');
      return new Response('Original game state is temporarily unavailable.',{status:503,headers:{'cache-control':'no-store'}});
    }
  }
  async #clearPending(){await this.ctx.storage.delete('original-pending');this.#pending=undefined;}
}
