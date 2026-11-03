import {LEGACY_PAGE_SCRIPTS} from '../generated/legacy-page-scripts';
import {LEGACY_TEMPLATES} from '../generated/legacy-templates';
import {LEGACY_HELP_MODULE_TEMPLATES} from '../generated/legacy-help-module-templates';
import {createLegacyModuleRuntime} from '../legacy/php/compiled-modules';
import {parseModuleFile} from '../legacy/php/parser';
import type {LegacyPageRequest} from '../legacy/php/runtime';
import type {LegacyDatabase} from '../legacy/php/database';
import type {LegacyVirtualFilesystem} from '../legacy/php/virtual-filesystem';
import {PhpArray,toStringValue,type PhpValue} from '../legacy/template/values';
import {LegacyHttpResponse} from './legacy-http-response';
import {TemplateError} from '../legacy/template/render';

// Expand this only after each real original page has transaction-level
// verification. Administrative and daemon-maintenance entry points stay out.
export const ORIGINAL_TRANSACTIONAL_PUBLIC_PAGES=new Set([
  '/login.php','/register.php','/recovery.php','/index.php','/map.php','/chat.php',
  '/cardbook.php','/donate.php','/error.php','/instance8_testing_intro.php','/itemhelp.php',
  '/kuji.php','/kujilist.php','/messages.php','/replay.php','/showcase.php','/updatelist.php','/user.php','/user_profile.php'
]);
const PREPARE=parseModuleFile("<?php $___MOD_SRV=1; require GAME_ROOT.'./include/roommng/roommng.config.php';");
export function createOriginalPublicPageEngine(input:{database:LegacyDatabase;filesystem:LegacyVirtualFilesystem;now:number}){
  const response=new LegacyHttpResponse();
  const scheduledRooms=new Set<number>();
  const runtime=createLegacyModuleRuntime({fullGame:true,curscript:null,database:input.database,filesystem:input.filesystem,
    functions:new Map([...response.functions(),['get_now',()=>input.now],['init_dbstuff',()=>input.database as unknown as PhpValue],
      ['curl_post',args=>{
        const post=args[1];
        if(!(post instanceof PhpArray)||post.get('command')!=='room_routine_single'||!toStringValue(args[0]??'').endsWith('command.php'))throw new Error('Unmapped original public HTTP operation.');
        const room=Number(post.get('game_roomid'));if(!Number.isSafeInteger(room)||room<0)throw new Error('Invalid original room routine target.');
        // This original fire-and-forget self-request is queued only after
        // its calling page commits, just as its separate PHP process was.
        scheduledRooms.add(room);return '';
      }]]),
    loadTemplate:name=>LEGACY_HELP_MODULE_TEMPLATES[name]??LEGACY_TEMPLATES[name]??LEGACY_TEMPLATES['./'+name.replace(/^\/+/, '')]
  });
  runtime.store.set('sys','gtablepre','acbra2_');runtime.store.set('sys','now',input.now);
  return {runtime,response,scheduledRooms,run(path:string,request:LegacyPageRequest):string{
    if(!ORIGINAL_TRANSACTIONAL_PUBLIC_PAGES.has(path)||!LEGACY_PAGE_SCRIPTS[path])throw new Error('Original transactional public page is not verified: '+path);
    runtime.runPageScript(PREPARE);
    try{
      const result=runtime.runPageScript(LEGACY_PAGE_SCRIPTS[path],request);
      return result.output+runtime.flushPageOutput();
    }catch(error){
      // Verified original PHP 8.2.35 behavior: direct error.php never defines
      // CURSCRIPT, and its shared header fatals after emitting 1,018 bytes.
      // Keep that original public response; never mask other runtime gaps.
      if(path==='/error.php'&&error instanceof TemplateError&&error.message==='Undefined constant CURSCRIPT'){
        response.status=500;return error.output+runtime.flushPageOutput();
      }
      throw error;
    }
  }};
}
