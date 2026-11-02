import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {parseModuleFile} from '../src/legacy/php/parser.ts';
const root=process.env.DTS_LEGACY_ROOT??'../legacy-dts';
const source=readFileSync(root+'/command.php','utf8');
const start=source.indexOf('//只有游戏内指令需要储存成录像');
const end=source.indexOf('__SOCKET_DEBUGLOG__("清空变量。")',start);
if(start<0||end<0)throw new Error('Original daemon record markers changed.');
const program=parseModuleFile('<?php '+source.slice(start,end));
const socket=readFileSync(root+'/include/socket.func.php','utf8');
const inputStart=socket.indexOf('//准备用户输入数据',socket.indexOf('function __SOCKET_SEND_TO_SERVER__'));
const inputEnd=socket.indexOf('//存储用户输入数据',inputStart);
if(inputStart<0||inputEnd<0)throw new Error('Original input preparation markers changed.');
const prepare=parseModuleFile('<?php '+socket.slice(inputStart,inputEnd));
const roomUpdate=readFileSync(root+'/roomupdate.php','utf8');
const roomWait=roomUpdate.indexOf('//创建socket');
const roomWake=roomUpdate.indexOf("if (!file_exists(GAME_ROOT.'./gamedata/tmp/rooms/'",roomWait);
const roomAuthEnd=roomUpdate.indexOf('$room_prefix = room_id2prefix');
if(roomWait<0||roomWake<0||roomAuthEnd<0)throw new Error('Original room polling transport markers changed.');
// Preserve the entire original authentication/validation/rendering legs.
// Only the socket creation and blocking wait are replaced by DO waiting.
const roomPrepare=parseModuleFile(roomUpdate.slice(0,roomWait)+'return $room_id_r;');
const roomAfterWake=parseModuleFile(roomUpdate.slice(0,roomAuthEnd)+'$room_id_r=$u_roomid; $room_id=$u_roomid;\n'+roomUpdate.slice(roomWake));
const coreList=readFileSync(root+'/include/modules/core/core.list.php','utf8');
const coreModules=coreList.trim().split(/\r?\n/).map(line=>line.trim().split(',')).filter(row=>row[2]?.trim()==='1').map(row=>row[0]);
const directStart=source.indexOf("if('area_timing_refresh' == $command)");
const directEnd=source.indexOf("}elseif('maintain' == $command)",directStart);
if(directStart<0||directEnd<0)throw new Error('Original direct command markers changed.');
const directCommands=parseModuleFile('<?php '+source.slice(directStart,directEnd)+'}');
const output='// Generated from original command.php replay recording leg. Transport only.\n'+
  'import type {Statement} from "../legacy/template/ast";\n'+
  'export const ORIGINAL_TRANSPORT_SOURCE_SHA256='+JSON.stringify(createHash('sha256').update(source).digest('hex'))+';\n'+
  'export const ORIGINAL_REPLAY_RECORD_STEP:readonly Statement[]='+JSON.stringify(program)+';\n'+
  'export const ORIGINAL_DAEMON_PREPARE_INPUT:readonly Statement[]='+JSON.stringify(prepare)+';\n'+
  'export const ORIGINAL_ROOM_UPDATE_SOURCE_SHA256='+JSON.stringify(createHash('sha256').update(roomUpdate).digest('hex'))+';\n'+
  'export const ORIGINAL_ROOM_UPDATE_PREPARE:readonly Statement[]='+JSON.stringify(roomPrepare)+';\n'+
  'export const ORIGINAL_ROOM_UPDATE_AFTER_WAKE:readonly Statement[]='+JSON.stringify(roomAfterWake)+';\n'+
  'export const ORIGINAL_CORE_MODULES:ReadonlySet<string>=new Set('+JSON.stringify(coreModules)+');\n'+
  'export const ORIGINAL_DAEMON_DIRECT_COMMANDS:readonly Statement[]='+JSON.stringify(directCommands)+';\n';
const path='src/generated/legacy-original-transport-steps.ts';
if(process.argv.includes('--check')){if(readFileSync(path,'utf8')!==output)throw new Error('Original transport steps changed.');}else writeFileSync(path,output);
