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
const output='// Generated from original command.php replay recording leg. Transport only.\n'+
  'import type {Statement} from "../legacy/template/ast";\n'+
  'export const ORIGINAL_TRANSPORT_SOURCE_SHA256='+JSON.stringify(createHash('sha256').update(source).digest('hex'))+';\n'+
  'export const ORIGINAL_REPLAY_RECORD_STEP:readonly Statement[]='+JSON.stringify(program)+';\n'+
  'export const ORIGINAL_DAEMON_PREPARE_INPUT:readonly Statement[]='+JSON.stringify(prepare)+';\n';
const path='src/generated/legacy-original-transport-steps.ts';
if(process.argv.includes('--check')){if(readFileSync(path,'utf8')!==output)throw new Error('Original transport steps changed.');}else writeFileSync(path,output);
