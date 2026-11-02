import {createLegacyModuleRuntime} from '../legacy/php/compiled-modules';
import type {LegacyDatabase} from '../legacy/php/database';
import type {LegacyPageRequest} from '../legacy/php/runtime';
import type {LegacyVirtualFilesystem} from '../legacy/php/virtual-filesystem';
import {PhpThrow} from '../legacy/php/module-store';
import type {PhpValue} from '../legacy/template/values';
import {parseModuleFile} from '../legacy/php/parser';
import {LEGACY_TEMPLATES} from '../generated/legacy-templates';
import {LEGACY_HELP_MODULE_TEMPLATES} from '../generated/legacy-help-module-templates';
import {ORIGINAL_ROOM_UPDATE_PREPARE,ORIGINAL_ROOM_UPDATE_AFTER_WAKE} from '../generated/legacy-original-transport-steps';
import {LegacyHttpResponse} from './legacy-http-response';

/** Original roomupdate.php on each side of its socket wait. The request
 * copy commits before the DO waits, so another player can change the room. */
export function createOriginalRoomUpdateEngine(input:{database:LegacyDatabase;filesystem:LegacyVirtualFilesystem;now:number}){
  const response=new LegacyHttpResponse();
  const runtime=createLegacyModuleRuntime({fullGame:true,curscript:null,database:input.database,filesystem:input.filesystem,
    functions:new Map([...response.functions(),['get_now',()=>input.now],
      // Database connection is a host operation; it returns this exact
      // transactional working copy rather than opening a MySQL socket.
      ['init_dbstuff',()=>input.database as unknown as PhpValue]]),
    loadTemplate:name=>LEGACY_HELP_MODULE_TEMPLATES[name]??LEGACY_TEMPLATES[name]??LEGACY_TEMPLATES['./'+name.replace(/^\/+/, '')]
  });
  runtime.store.set('sys','gtablepre','acbra2_');
  runtime.store.set('sys','now',input.now);
  return {response,run(request:LegacyPageRequest,wake=false):string{
    try{
      if(wake)return runtime.runPageScript(ORIGINAL_ROOM_UPDATE_AFTER_WAKE,request).output;
      const first=runtime.runPageScript(ORIGINAL_ROOM_UPDATE_PREPARE,request);
      const room=Number(first.value);
      if(!Number.isSafeInteger(room)||room<=0)return first.output;
      response.headers.set('x-original-room-wait',String(room));
      return '';
    }catch(error){
      if(!(error instanceof PhpThrow))throw error;
      return error.exception.message;
    }finally{
      // No PHP process or live buffers survive the waiting boundary.
      runtime.runPageScript(parseModuleFile('<?php while(ob_get_level()) ob_end_clean();'));
    }
  }};
}
