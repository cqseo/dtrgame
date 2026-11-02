import {legacyRowFromJson,type LegacyRowMutation} from '../legacy/php/database';
import type {SqliteLegacyDatabase} from '../legacy/php/sqlite-database';
import {LegacyVirtualFilesystem,type LegacyVirtualFile} from '../legacy/php/virtual-filesystem';
import type {PhpArray} from '../legacy/template/values';
import {LEGACY_PUBLIC_STATIC_FILES} from '../generated/legacy-public-static-files';
import type {LegacyPageRequest} from '../legacy/php/runtime';
import {createOriginalGameEngine,originalRuntimeFiles} from './original-game-engine';
import type {SupabaseLegacyRest} from './supabase';
import {createOriginalRoomUpdateEngine} from './original-room-update';
import {createOriginalPublicPageEngine} from './original-public-page-engine';

export interface OriginalSnapshot {
  revision:number;signature:string;tables:Record<string,Array<Record<string,unknown>>>;
  files:Record<string,LegacyVirtualFile>;directories:string[];counters:Record<string,number>;
}
export interface OriginalResponse {status:number;headers:Array<[string,string]>;body:string;scheduledRooms?:number[]}
export type OriginalCommitReply={ok:true;revision:number;response:OriginalResponse;replayed:boolean}|{ok:false;conflict:true;revision:number};
export interface OriginalPendingRequest {requestId:string;requestDigest:string;expectedRevision:number}
export interface OriginalCommit extends OriginalPendingRequest {
  signature:string;changes:LegacyRowMutation[];files:Record<string,LegacyVirtualFile>;directories:string[];counters:Record<string,number>;response:OriginalResponse;
}
export interface OriginalRequestStore {
  load():Promise<OriginalSnapshot>;
  commit(input:OriginalCommit):Promise<OriginalCommitReply>;
  reconcile(input:OriginalPendingRequest):Promise<OriginalCommitReply>;
}
export function originalRequestStore(rest:SupabaseLegacyRest):OriginalRequestStore {
  return {
    load:()=>rest.rpc<OriginalSnapshot>('dtr_original_load',{}),
    commit:p=>rest.rpc<OriginalCommitReply>('dtr_original_commit',{
      p_request_id:p.requestId,p_request_digest:p.requestDigest,p_expected_revision:p.expectedRevision,p_signature:p.signature,
      p_changes:p.changes,p_files:p.files,p_directories:p.directories,p_counters:p.counters,p_response:p.response
    }),
    reconcile:p=>rest.rpc<OriginalCommitReply>('dtr_original_reconcile',{
      p_request_id:p.requestId,p_request_digest:p.requestDigest,p_expected_revision:p.expectedRevision
    })
  };
}

/** Runs one original command in a disposable SQL/FS working copy. No body is
 * released until all rows, files and the retry receipt commit together. */
export async function executeOriginalCommand(input:{
  store:OriginalRequestStore;
  createShadow:(tables:Record<string,PhpArray[]>,counters:Record<string,number>)=>Promise<SqliteLegacyDatabase>;
  requestId:string;requestDigest:string;roomId:number;now:number;page:string;request:LegacyPageRequest;
  beforeCommit:(pending:OriginalPendingRequest)=>Promise<void>;
  afterResolved:()=>Promise<void>;
  afterCommitted?:(changes:readonly LegacyRowMutation[])=>void;
}):Promise<OriginalResponse>{
  if(!/^[a-f0-9-]{36}$/.test(input.requestId)||!/^[a-f0-9]{64}$/.test(input.requestDigest))throw new Error('Invalid original request identity.');
  for(let attempt=0;attempt<3;attempt++){
    const snapshot=await input.store.load();
    if(!Number.isSafeInteger(snapshot.revision)||!snapshot.signature||!snapshot.tables)throw new Error('Invalid original snapshot.');
    const tables=Object.fromEntries(Object.entries(snapshot.tables).map(([name,rows])=>[name,rows.map(legacyRowFromJson)]));
    const database=await input.createShadow(tables,snapshot.counters);
    let commit:OriginalCommit;
    try{
      const filesystem=new LegacyVirtualFilesystem(originalRuntimeFiles(),snapshot.files,input.now,{directories:snapshot.directories,readonlyPaths:LEGACY_PUBLIC_STATIC_FILES});
      let response:import('./legacy-http-response').LegacyHttpResponse,body:string;
      let scheduledRooms:number[]=[];
      if(input.page==='roomupdate'||input.page==='roomupdate_wake'){
        const engine=createOriginalRoomUpdateEngine({database,filesystem,now:input.now});
        response=engine.response;body=engine.run(input.request,input.page==='roomupdate_wake');
      }else if(input.page.startsWith('public:')){
        const engine=createOriginalPublicPageEngine({database,filesystem,now:input.now});
        response=engine.response;body=engine.run(input.page.slice(7),input.request);
        scheduledRooms=[...engine.scheduledRooms];
      }else{
        const engine=createOriginalGameEngine({database,filesystem,roomId:input.roomId,now:input.now,requestId:input.requestId});
        response=engine.response;body=engine.run(input.page,input.request);
      }
      const headers:Array<[string,string]>=[...response.headers].filter(([name])=>name!=='set-cookie');
      for(const cookie of response.headers.getSetCookie())headers.push(['set-cookie',cookie]);
      commit={requestId:input.requestId,requestDigest:input.requestDigest,expectedRevision:snapshot.revision,signature:snapshot.signature,
        changes:database.mutations(),...filesystem.state(),counters:database.counters(),response:{status:response.status,headers,body,...(scheduledRooms.length?{scheduledRooms}:{})}};
    }finally{database.close();}
    const pending={requestId:input.requestId,requestDigest:input.requestDigest,expectedRevision:snapshot.revision};
    await input.beforeCommit(pending);
    let reply:OriginalCommitReply;
    try{reply=await input.store.commit(commit);}
    catch(error){
      // Acquiring the canonical lock either finds the committed receipt or
      // fences the uncertain old version. If recovery itself fails, retain
      // pending state and let the actor retry recovery before its next turn.
      try{reply=await input.store.reconcile(pending);}catch{throw new OriginalCommitUncertain(error);}
    }
    await input.afterResolved();
    if(reply.ok){input.afterCommitted?.(commit.changes);return reply.response;}
  }
  throw new Error('Original game state remained busy after three complete retries.');
}
export class OriginalCommitUncertain extends Error {
  constructor(readonly originalError:unknown){super('Original command commit requires recovery before another command.');}
}
