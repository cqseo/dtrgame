// AOT translate outputs of the original PHP template compiler. Every template
// AST node must be explicitly implemented; unknown PHP aborts the build.
import fs from 'node:fs';import zlib from 'node:zlib';import Engine from 'php-parser';
const packed=fs.readFileSync(new URL('../test/fixtures/original-room-templates-php.json.gz.base64',import.meta.url),'utf8');
const fixture=JSON.parse(zlib.gunzipSync(Buffer.from(packed,'base64')));
const parser=new Engine({parser:{php7:true}}), q=JSON.stringify, supported=new Set(Object.keys(fixture.compiled));
function expr(n){
 switch(n.kind){
  case 'string':return q(n.value);
  case 'number':return String(Number(n.value));
  case 'nullkeyword':return 'null';
  case 'variable':if(typeof n.name!=='string')break;return `v[${q(n.name)}]`;
  case 'name':return `constants[${q(n.name)}]`;
  case 'isset':return '('+n.variables.map(x=>`${expr(x)} != null`).join(' && ')+')';
  case 'empty':return `!phpTruthy(${expr(n.expression)})`;
  case 'unary':if(n.type==='!')return `!phpTruthy(${expr(n.what)})`;if(n.type==='-')return `-phpNumber(${expr(n.what)})`;if(n.type==='+')return `phpNumber(${expr(n.what)})`;break;
  case 'bin':if(n.type==='&&'||n.type==='||')return `(phpTruthy(${expr(n.left)}) ${n.type} phpTruthy(${expr(n.right)}))`;return `phpBinary(${q(n.type)},${expr(n.left)},${expr(n.right)})`;
  case 'retif':return `(phpTruthy(${expr(n.test)})?${expr(n.trueExpr)}:${expr(n.falseExpr)})`;
  case 'offsetlookup':return `phpOffset(${expr(n.what)},${expr(n.offset)})`;
  case 'cast':if(n.type==='int')return `Math.trunc(phpNumber(${expr(n.expr)}))`;break;
  case 'encapsed':return '('+n.value.map(x=>x.kind==='encapsedpart'?`phpString(${expr(x.expression)})`:q(x.value)).join(' + ')+')';
  case 'array':return n.items.every(x=>x.key==null)?`[${n.items.map(x=>expr(x.value)).join(',')}]`:`({${n.items.map(x=>`${q(String(x.key?.kind==='string'?x.key.value:x.key?.value))}:${expr(x.value)}`).join(',')}})`;
  case 'assign':if(n.operator==='='&&n.left.kind==='variable')return `(${expr(n.left)}=${expr(n.right)})`;break;
  case 'call':{
   const args=n.arguments.map(expr);
   if(n.what.kind==='name')return `roomTemplateCall(${q(n.what.name)},[${args.join(',')}],v,constants,readAssetText,templates)`;
   if(n.what.kind==='offsetlookup')return `roomTemplateDynamicCall(${expr(n.what)},[${args.join(',')}],v,constants,readAssetText,templates)`;
   break;
  }
 }
 throw Error('Unported room-template expression: '+JSON.stringify(n));
}
function statement(n){
 switch(n.kind){
  case 'block':return n.children.map(statement).join('\n');
  case 'inline':return `out+=${q(n.value)};`;
  case 'echo':return n.expressions.map(x=>`out+=phpString(${expr(x)});`).join('\n');
  case 'global':return '';
  case 'if':return `if(phpTruthy(${expr(n.test)})){\n${statement(n.body)}\n}`+(n.alternate?`else{\n${statement(n.alternate)}\n}`:'');
  case 'foreach':{
   const src=`phpIterable(${expr(n.source)})`,key=n.key?.name,value=n.value?.name;
   if(!value)break;
   const target=n.key?`for(const [___key,___value] of ${src}){v[${q(key)}]=___key;v[${q(value)}]=___value;`:`for(const [,___value] of ${src}){v[${q(value)}]=___value;`;
   return target+'\n'+statement(n.body)+'\n}';
  }
  case 'expressionstatement':
   if(n.expression.kind==='exit')return `throw new Error(phpString(${expr(n.expression.expression)}));`;
   if(n.expression.kind==='include'){
    const c=n.expression.target;if(c.kind!=='call'||c.what.name!=='template'||c.arguments[0]?.kind!=='string')break;
    const name=c.arguments[0].value;if(!supported.has(name))throw Error('Uncaptured source template '+name);
    return `out+=templates[${q(name)}]!(v,constants,readAssetText,templates);`;
   }
   // Most PHP helpers return a value; output-bearing bubblebox templates are
   // returned as strings in this native renderer, preserving source markup.
   if(n.expression.kind==='call'&&n.expression.what.kind==='name'&&['bubblebox_start','bubblebox_end'].includes(n.expression.what.name))return `out+=phpString(${expr(n.expression)});`;
   return `void (${expr(n.expression)});`;
 }
 throw Error('Unported room-template statement: '+JSON.stringify(n));
}
let out='// Generated from PHP template compiler output.\nimport { phpTruthy,phpString,phpBinary,phpOffset,phpNumber,phpIterable,roomTemplateCall,roomTemplateDynamicCall } from "../original-room-template-runtime";\nimport type { OriginalTemplateContext,OriginalTemplateConstants,OriginalTemplateReadAsset,OriginalTemplateSet } from "../original-room-template-runtime";\n';
for(const [name,php] of Object.entries(fixture.compiled)){
 out+=`\n// ${fixture.sources[name].path} SHA256 ${fixture.sources[name].sha256}\n`;
 out+=`function render_${name}(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{\nlet out="";\n`;
 out+=parser.parseCode(php).children.map(statement).join('\n')+'\nreturn out;\n}\n';
}
out+='\nexport const originalRoomTemplates:OriginalTemplateSet={\n'+Object.keys(fixture.compiled).map(n=>`${q(n)}:render_${n}`).join(',\n')+'\n};\n';
out+='\nexport const originalRoomTemplateConstants:OriginalTemplateConstants='+q(fixture.constants)+';\n';
out+='\nexport const originalLobbyDefaults:OriginalTemplateContext='+q(fixture.defaults)+';\n';
fs.writeFileSync(new URL('../src/generated/original-room-templates.ts',import.meta.url),out);
console.log(`${Object.keys(fixture.compiled).length} original room templates compiled; all AST nodes supported`);
