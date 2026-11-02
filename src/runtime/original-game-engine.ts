import { LEGACY_COMPILED_INCLUDES } from "../generated/legacy-compiled-includes";
import { LEGACY_TEMPLATES } from "../generated/legacy-templates";
import { LEGACY_HELP_MODULE_TEMPLATES } from "../generated/legacy-help-module-templates";
import { LEGACY_RUNTIME_DATA_FILES } from "../generated/legacy-runtime-source-metadata";
import { LEGACY_MODULE_VARS } from "../generated/legacy-module-vars";
import { ORIGINAL_REPLAY_RECORD_STEP,ORIGINAL_DAEMON_PREPARE_INPUT } from '../generated/legacy-original-transport-steps';
import { LEGACY_PUBLIC_STATIC_FILES } from '../generated/legacy-public-static-files';
import { phpJsonEncode } from "../legacy/php/codec";
import { createLegacyModuleRuntime } from "../legacy/php/compiled-modules";
import type { LegacyDatabase } from "../legacy/php/database";
import { parseModuleFile } from "../legacy/php/parser";
import type { LegacyPageRequest } from "../legacy/php/runtime";
import { LegacyVirtualFilesystem } from "../legacy/php/virtual-filesystem";
import { LegacyHttpResponse } from "./legacy-http-response";
import {PhpThrow} from '../legacy/php/module-store';

const BOOTSTRAP=parseModuleFile(`<?php
  $___MOD_SRV=1; $___MOD_CODE_ADV3=1; $___TEMP_WORKFLAG=1;
  $___LOCAL_INPUT__VARS__INPUT_VAR_LIST=$___TEMP_data;
  $___LOCAL_INPUT__VARS__INPUT_VAR_LIST['___GAME_ROOMID']=___TRANSPORT_ROOM_ID;
  unset($_COOKIE,$_POST,$_GET,$_REQUEST);
  require GAME_ROOT.'./include/common.inc.php';
`);
const PAGES = new Set(["command_act","command_game","command_roomcmd","command_valid","command_end","command_winner","command_rank","command_alive","command_help","command_news","command_aranking","command_logistics"]);

export function originalRuntimeFiles():Readonly<Record<string,string>>{
  // The original cache is only a serialized copy of the authoritative
  // captured player schema. A Worker need not create/drop a MySQL table to
  // discover those same 124 fields on every cold start.
  const vars=LEGACY_MODULE_VARS['player']!;
  const encoded=(key:string)=>phpJsonEncode(vars[key]??null).replaceAll('\\','\\\\').replaceAll("'","\\'");
  const schema=`<?php $db_player_structure=json_decode('${encoded('db_player_structure')}',true); $db_player_structure_types=json_decode('${encoded('db_player_structure_types')}',true);`;
  return {...LEGACY_RUNTIME_DATA_FILES,'gamedata/cache/db_player_structure.config.php':schema};
}

/** Original daemon's command execution leg. Only transport differs: there is
 * no PHP socket daemon on Workers. Every module, action and template is the
 * captured original; state remains a request working copy until committed. */
export function createOriginalGameEngine(input:{database:LegacyDatabase;roomId:number;now:number;filesystem?:LegacyVirtualFilesystem;requestId?:string}) {
  if(!Number.isSafeInteger(input.roomId)||input.roomId<0||input.roomId>12)throw new RangeError('Invalid original room.');
  const response=new LegacyHttpResponse();
  const filesystem=input.filesystem??new LegacyVirtualFilesystem(originalRuntimeFiles(),{},input.now,{readonlyPaths:LEGACY_PUBLIC_STATIC_FILES});
  const runtime=createLegacyModuleRuntime({fullGame:true,filesystem,database:input.database,
    curscript:'game',constants:new Map<string,import('../legacy/template/values').PhpValue>([['IN_COMMAND',true],['IN_DAEMON',true],['GEXIT_RETURN_JSON',true],['___TRANSPORT_ROOM_ID',input.roomId]]),
    functions:new Map([...response.functions(),['get_now',()=>input.now]]),
    loadTemplate:name=>LEGACY_HELP_MODULE_TEMPLATES[name]??LEGACY_TEMPLATES[name]??LEGACY_TEMPLATES['./'+name.replace(/^\/+/, '')]
  });
  runtime.store.set('sys','gtablepre','acbra2_');
  runtime.store.set('sys','room_id',String(input.roomId));
  const prefix=input.roomId?'acbra2_s'+input.roomId+'_':'acbra2_';
  for(const name of ['tablepre','ctablepre'])runtime.store.set('sys',name,prefix);
  runtime.store.set('sys','wtablepre',input.roomId?'acbra2_s':'acbra2_');
  runtime.store.set('sys','room_prefix',input.roomId?'s'+input.roomId:'');
  runtime.store.set('sys','now',input.now);
  return {
    runtime,filesystem,response,
    run(page:string,request:LegacyPageRequest,options:{tick?:boolean}={}) {
      if(!PAGES.has(page))throw new Error('Invalid original page.');
      const program=LEGACY_COMPILED_INCLUDES['./include/pages/'+page+'.php'];
      if(!program)throw new Error('Original page is not compiled: '+page);
      runtime.runPageScript(ORIGINAL_DAEMON_PREPARE_INPUT,request);
      runtime.runPageScript(BOOTSTRAP);
      if(options.tick!==false)runtime.call('sys\\routine');
      // The original uses this marker in page-specific interface hooks.
      runtime.runPageScript(parseModuleFile(`<?php $___CURSCRIPT='${page==='command_act'?'ACT':page.slice(8).toUpperCase()}';`));
      // sys.init() starts the original response buffer. Hooks share it
      // while capturing corpse/battle templates; transport reads it once.
      let output='';
      try{output=runtime.runPageScript(program).output;}
      catch(error){
        if(!(error instanceof PhpThrow))throw error;
        // The original daemon catches Exception around the included page
        // and prints getMessage(); gexit() uses this for original errors.
        const quoted=error.exception.message.replaceAll('\\','\\\\').replaceAll("'","\\'");
        output=runtime.runPageScript(parseModuleFile(`<?php echo '${quoted}';`)).output;
      }
      const buffered=runtime.runPageScript(parseModuleFile('<?php return ob_get_clean();')).value;
      if(typeof buffered!=='string')throw new Error('Original response buffer is missing.');
      const body=output+buffered;
      if(page==='command_act'){
        const uid=input.requestId??crypto.randomUUID();
        if(!/^[A-Za-z0-9_-]{1,100}$/.test(uid))throw new Error('Invalid original transport request id.');
        const responsePath=`gamedata/tmp/response/${input.roomId}_/${uid}`;
        filesystem.write(responsePath,body);
        // Original daemon logic stays original PHP AST. Only its socket
        // response locator and request start time come from this transport.
        runtime.runPageScript(parseModuleFile(`<?php
          $page='command'; $___PAGE_STARTTIME_VALUE=${input.now};
          $___MOD_TMP_FILE_DIRECTORY='gamedata/tmp/response/';
          $___TEMP_uid='${input.roomId}_/${uid}';
        `));
        runtime.runPageScript(ORIGINAL_REPLAY_RECORD_STEP);
      }
      return body;
    }
  };
}
