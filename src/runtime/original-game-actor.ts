import {SupabaseLegacyRest} from './supabase';
import {executeOriginalCommand,originalRequestStore,type OriginalPendingRequest} from './original-request-transaction';
import type {LegacyPageRequest} from '../legacy/php/runtime';
import {createSqliteShadow} from './sqlite-shadow';
import {OriginalRoomSubscribers} from './original-room-subscribers';
import type {LegacyRowMutation} from '../legacy/php/database';
import {ORIGINAL_ROOM_ID_LIMIT} from '../generated/legacy-sqlite-shadow-schema';

interface OriginalActorEnv {
  DTS_ORIGINAL_ENGINE?:string;
  SUPABASE_URL?:string;
  SUPABASE_SECRET_KEY?:string;
  ORIGINAL?:DurableObjectNamespace;
}
export interface OriginalActorCommand {roomId:number;page:string;request:LegacyPageRequest}

/** One serialized original room. PostgreSQL also validates all shared inputs
 * and serializes cross-room account, ranking, history and cache commits. */
export class OriginalGameActor {
  #queue:Promise<unknown>=Promise.resolve();
  #ready:Promise<unknown>;
  #pending:OriginalPendingRequest|undefined;
  readonly #subscribers=new OriginalRoomSubscribers();
  constructor(readonly ctx:DurableObjectState,readonly env:OriginalActorEnv){
    this.#ready=ctx.blockConcurrencyWhile(async()=>{this.#pending=await ctx.storage.get<OriginalPendingRequest>('original-pending');});
  }
  async fetch(request:Request):Promise<Response>{
    await this.#ready;
    if(this.env.DTS_ORIGINAL_ENGINE==='enabled'&&request.method==='POST'&&new URL(request.url).pathname==='/notify'){
      this.#subscribers.notify();return new Response(null,{status:204});
    }
    const saved=request.clone(),version=this.#subscribers.version;
    const next=this.#queue.then(()=>this.#fetch(request));this.#queue=next.catch(()=>undefined);
    const response=await next;
    if(!response.headers.has('x-original-room-wait'))return response;
    // Waiting happens after the queued command has committed and resolved.
    // Commands and notifications remain free to enter this same actor.
    if(!await this.#subscribers.wait(version,request.signal))return new Response('',{headers:{'cache-control':'no-store'}});
    const body=await saved.json<OriginalActorCommand>();body.page='roomupdate_wake';
    return this.fetch(new Request('https://original.internal/execute',{method:'POST',body:JSON.stringify(body),headers:{'content-type':'application/json'},signal:request.signal}));
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
      if(!Number.isSafeInteger(body.roomId)||body.roomId<0||body.roomId>ORIGINAL_ROOM_ID_LIMIT||typeof body.page!=='string'||!body.request||typeof body.request!=='object')return new Response('Invalid original command.',{status:400});
      const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(body)));
      const requestDigest=[...new Uint8Array(digest)].map(v=>v.toString(16).padStart(2,'0')).join('');
      const response=await executeOriginalCommand({store,createShadow:createSqliteShadow,
        roomId:body.roomId,page:body.page,request:body.request,now:Math.floor(Date.now()/1000),requestId:crypto.randomUUID(),requestDigest,
        beforeCommit:async pending=>{await this.ctx.storage.put('original-pending',pending);this.#pending=pending;},
        afterResolved:()=>this.#clearPending(),
        afterCommitted:changes=>this.#notifyRooms(changes)
      });
      if(response.scheduledRooms?.length&&this.env.ORIGINAL){
        const namespace=this.env.ORIGINAL;
        this.ctx.waitUntil(Promise.allSettled(response.scheduledRooms.map(roomId=>{
          const command:OriginalActorCommand={roomId,page:'command_transport',request:{method:'POST',post:[['command','room_routine_single'],['game_roomid',String(roomId)]]}};
          return namespace.get(namespace.idFromName('original-room:'+roomId)).fetch('https://original.internal/execute',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(command)});
        })));
      }
      return new Response([204,205,304].includes(response.status)?null:response.body,{status:response.status,headers:response.headers});
    }catch(error){
      console.error('Original command did not complete.',error instanceof Error?error.message:'unknown failure');
      return new Response('Original game state is temporarily unavailable.',{status:503,headers:{'cache-control':'no-store'}});
    }
  }
  async #clearPending(){await this.ctx.storage.delete('original-pending');this.#pending=undefined;}
  #notifyRooms(changes:readonly LegacyRowMutation[]){
    const rooms=new Set<number>();
    for(const change of changes)if(change.table==='acbra2_game'){
      const row=change.operation==='delete'?change.key:change.row;
      const id=Number(row.groomid);if(Number.isSafeInteger(id)&&id>0)rooms.add(id);
    }
    if(!rooms.size)return;
    // A command may create/join another room while running through room 0.
    // Notify the actor for every changed room, after the canonical commit.
    const namespace=this.env.ORIGINAL;
    if(namespace)this.ctx.waitUntil(Promise.allSettled([...rooms].map(id=>namespace.get(namespace.idFromName('original-room:'+id)).fetch('https://original.internal/notify',{method:'POST'}))));
    // Also close the race for subscribers already waiting in this actor.
    this.#subscribers.notify();
  }
}
