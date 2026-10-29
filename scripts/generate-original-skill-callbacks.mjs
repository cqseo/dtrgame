// Compile actual acquire/lost PHP callbacks to static TS. No eval at runtime.
// Unsupported syntax is recorded explicitly and never becomes a no-op.
import fs from 'node:fs';import zlib from 'node:zlib';import Engine from 'php-parser';import crypto from 'node:crypto';
const admission=process.argv.includes('--admission');
const records=JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync(new URL(admission?'../test/fixtures/original-post-admission-source.json.gz.base64':'../test/fixtures/original-skill-callback-source.json.gz.base64',import.meta.url),'utf8'),'base64')));
const parser=new Engine({parser:{php7:true}}),q=JSON.stringify;let current;
function variable(n){if(n.kind!=='variable'||typeof n.name!=='string')throw Error('dynamic variable');return `v[${q(n.name)}]`;}
function expr(n){
 switch(n.kind){
  case 'number':return String(Number(n.value));case 'string':return q(n.value);case 'boolean':return String(n.value);case 'nullkeyword':return 'null';
  case 'variable':return variable(n);
  case 'array':return `callbackArray([${n.items.map((x,i)=>`[${x.key?expr(x.key):i},${expr(x.value)}]`).join(',')}])`;
  case 'encapsed':return '('+n.value.map(x=>x.kind==='encapsedpart'?`phpString(${expr(x.expression)})`:q(x.value)).join(' + ')+')';
  case 'offsetlookup':if(!n.offset)throw Error('array append');return `callbackGet(${expr(n.what)},${expr(n.offset)})`;
  case 'bin':if(['&&','||'].includes(n.type))return `(phpTruthy(${expr(n.left)}) ${n.type} phpTruthy(${expr(n.right)}))`;return `phpBinary(${q(n.type)},${expr(n.left)},${expr(n.right)})`;
  case 'unary':if(n.type==='!')return `!phpTruthy(${expr(n.what)})`;if(n.type==='-')return `-phpNumber(${expr(n.what)})`;throw Error('unary '+n.type);
  case 'cast':if(n.type==='int')return `Math.trunc(phpNumber(${expr(n.expr)}))`;throw Error('cast '+n.type);
  case 'empty':return `!phpTruthy(${expr(n.expression)})`;
  case 'isset':return '('+n.variables.map(x=>`${expr(x)}!=null`).join('&&')+')';
  case 'assign':{
   const right=n.operator==='='?expr(n.right):`phpBinary(${q(n.operator.slice(0,-1))},${expr(n.left)},${expr(n.right)})`;
   if(n.left.kind==='variable')return `(${variable(n.left)}=${right})`;
   if(n.left.kind==='offsetlookup'&&n.left.offset)return `callbackSet(${expr(n.left.what)},${expr(n.left.offset)},${right})`;
   if(n.left.kind==='offsetlookup'&&!n.left.offset){
    const parent=n.left.what;
    if(parent.kind==='variable')return `callbackAppend((${variable(parent)}??=callbackArray([])),${right})`;
    if(parent.kind==='offsetlookup')return `callbackAppend(callbackEnsure(${expr(parent.what)},${expr(parent.offset)}),${right})`;
   }
   if(n.left.kind==='list'){const assignments=n.left.items.map((x,i)=>x?`${variable(x.value)}=callbackGet(___list,${i});`:'').join('');return `(await(async()=>{const ___list=${expr(n.right)};${assignments}return ___list;})())`;}
   throw Error('assignment '+n.left.kind);
  }
  case 'assignref':if(n.left.kind==='variable'&&n.right.kind==='call'&&n.right.what.name==='get_var_in_module')return `(${variable(n.left)}=${expr(n.right)})`;throw Error('reference assignment');
  case 'post':if(n.type==='+'&&n.what.kind==='variable')return `(${variable(n.what)}=phpNumber(${variable(n.what)})+1)`;throw Error('post '+n.type);
  case 'call':{
   const args=n.arguments.map(expr).join(',');
   if(n.what.kind==='variable'&&n.what.name==='chprocess')return `(await ctx.parent(${args}))`;
   if(n.what.kind==='propertylookup'&&n.what.offset.kind==='identifier')return `(await callbackMethod(${expr(n.what.what)},${q(n.what.offset.name)},[${args}]))`;
   if(n.what.kind!=='name')throw Error('dynamic call');const name=n.what.name;
   if(['round','rand','strval','explode','date','array_values','array_unique','array_diff','array_randompick','end','get_var_in_module','defined','is_array','in_array','constant','array_merge','strpos'].includes(name))return `callbackBuiltin(${q(name)},[${args}],ctx)`;
   if(name==='save_gameinfo')return `(await ctx.call('sys','save_gameinfo'${args?','+args:''}))`;
   if(name==='addnews')return `(await ctx.call('sys','addnews'${args?','+args:''}))`;
   // Other functions are resolved through the complete original module catalog.
   const segments=name.replace(/^\\/,'').split('\\'),module=segments.length>1?segments[0]:current.module,fn=segments.at(-1);
   return `(await ctx.call(${q(module)},${q(fn)}${args?','+args:''}))`;
  }
 }
 throw Error('expression '+n.kind);
}
function stmt(n){
 switch(n.kind){
  case 'block':return n.children.map(stmt).join('\n');
  case 'if':
   if(n.test.kind==='eval'&&n.test.source.kind==='name'&&n.test.source.name==='__MAGIC__')return '';
   return `if(phpTruthy(${expr(n.test)})){${stmt(n.body)}}`+(n.alternate?`else{${stmt(n.alternate)}}`:'');
  case 'return':return n.expr?'return '+expr(n.expr)+';':'return;';
  case 'global':return `callbackGlobal(v,ctx,${q(n.items.map(x=>x.name))});`;
  case 'expressionstatement':
   if(n.expression.kind==='eval'){
    const call=n.expression.source;if(call.kind!=='call'||call.what.name!=='import_module'||call.arguments.some(x=>x.kind!=='string'))throw Error('dynamic eval');
    return `callbackImport(v,ctx,${q(call.arguments.map(x=>x.value))});`;
   }
   return expr(n.expression)+';';
  case 'for':return `for(${n.init.map(expr).join(',')};${n.test.map(x=>'phpTruthy('+expr(x)+')').join(',')};${n.increment.map(expr).join(',')}){${stmt(n.body)}}`;
  case 'do':return `do{${stmt(n.body)}}while(phpTruthy(${expr(n.test)}));`;
  case 'while':return `while(phpTruthy(${expr(n.test)})){${stmt(n.body)}}`;
  case 'foreach':return `for(const [___key,___value]of callbackEntries(${expr(n.source)})){${n.key?variable(n.key)+'=___key;':''}${variable(n.value)}=___value;${stmt(n.body)}}`;
 }
 throw Error('statement '+n.kind);
}
let source='// Generated from actual source callbacks; see coverage manifest for missing syntax.\nimport {callbackGet,callbackSet,callbackImport,callbackGlobal,callbackBuiltin,callbackArray,callbackAppend,callbackEnsure,callbackEntries,callbackMethod,phpBinary,phpTruthy,phpNumber,phpString}from "../original-skill-callback-runtime";\nimport type {OriginalModuleDispatcher}from "../original-module-dispatch";\nexport function registerOriginalSkillCallbacks(dispatcher:OriginalModuleDispatcher):void {\n';
const compiled=[],pending=[];
for(const r of records){current=r;try{
 const fn=parser.parseEval(r.source).children[0];if(fn.arguments.length!==1||fn.arguments[0].name.name!=='pa'||!fn.arguments[0].byref)throw Error('signature');
 const code=stmt(fn.body);source+=`// ${r.path} ${crypto.createHash('sha256').update(r.source).digest('hex')}\n`;
 source+=`dispatcher.register(${q(r.module)},${q(r.name)},async(ctx,pa)=>{const v:Record<string,unknown>={pa};${code}});\n`;compiled.push({module:r.module,name:r.name,path:r.path});
 }catch(error){pending.push({module:r.module,name:r.name,path:r.path,reason:error.message});}}
source+='}\n';if(admission)source=source.replace('registerOriginalSkillCallbacks','registerOriginalPostAdmission');
fs.writeFileSync(new URL(admission?'../src/generated/original-post-admission.ts':'../src/generated/original-skill-callbacks.ts',import.meta.url),source);
fs.writeFileSync(new URL(admission?'../docs/original-post-admission-coverage.json':'../docs/original-skill-callback-coverage.json',import.meta.url),JSON.stringify({compiled,pending},null,2)+'\n');console.log({compiled:compiled.length,pending:pending.length,reasons:[...new Set(pending.map(x=>x.reason))]});
