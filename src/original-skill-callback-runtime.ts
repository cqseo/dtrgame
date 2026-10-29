import {phpBinary,phpNumber,phpString,phpTruthy}from './original-template-runtime';
import {OriginalPhpArray,type PhpKey}from './original-php-array';
import type {OriginalModuleContext}from './original-module-dispatch';
export {phpBinary,phpNumber,phpString,phpTruthy};
export function callbackEntries(value:unknown):[PhpKey,unknown][]{return value instanceof Map?[...value]:value&&typeof value==='object'?Object.entries(value):[];}
export function callbackArray(entries:[PhpKey,unknown][]):OriginalPhpArray{const result=new OriginalPhpArray();for(const [k,v]of entries)result.set(k,v);return result;}
export function callbackEnsure(value:unknown,key:unknown):unknown{const old=callbackGet(value,key);if(old!=null)return old;const result=callbackArray([]);callbackSet(value,key,result);return result;}
export function callbackAppend(value:unknown,next:unknown):unknown{
  if(value instanceof Map){const keys=[...value.keys()].filter(x=>typeof x==='number')as number[];value.set(Math.max(-1,...keys)+1,next);return next;}
  if(Array.isArray(value)){value.push(next);return next;}throw new Error('Append to non-array');
}
export async function callbackMethod(target:unknown,name:string,args:unknown[]):Promise<unknown>{
  // Database adapter must be explicitly supplied by the room transaction owner.
  if(!['query','num_rows','fetch_array'].includes(name))throw new Error('Unported callback method');
  if(!target||typeof target!=='object')throw new Error('Missing callback effect adapter: '+name);
  const method=(target as Record<string,unknown>)[name];if(typeof method!=='function')throw new Error('Missing callback method '+name);
  return method.apply(target,args);
}
export function callbackGet(value:unknown,key:unknown):unknown{
  if(value instanceof Map)return value.get(key as PhpKey);
  if(value===null||typeof value!=='object')return undefined;
  const k=String(key);return Object.hasOwn(value,k)?(value as Record<string,unknown>)[k]:undefined;
}
export function callbackSet(value:unknown,key:unknown,next:unknown):unknown{
  if(value instanceof Map){value.set(key as PhpKey,next);return next;}
  if(value===null||typeof value!=='object')throw new Error('Assignment to non-array source value');
  const k=String(key);Object.defineProperty(value,k,{value:next,writable:true,enumerable:true,configurable:true});return next;
}
export function callbackImport(v:Record<string,unknown>,ctx:OriginalModuleContext,names:readonly string[]):void{
  const modules=ctx.state.modules as Record<string,Record<string,unknown>>|undefined;
  for(const name of names){
    const variables=modules?.[name];if(!variables)throw new Error('Uninitialized source module variables: '+name);
    for(const key of Object.keys(variables))Object.defineProperty(v,key,{get:()=>variables[key],set:(value:unknown)=>{variables[key]=value;},enumerable:true,configurable:true});
  }
}
export function callbackGlobal(v:Record<string,unknown>,ctx:OriginalModuleContext,names:readonly string[]):void{
  const globals=ctx.state.globals as Record<string,unknown>|undefined;if(!globals)throw new Error('Missing source globals');
  for(const key of names)Object.defineProperty(v,key,{get:()=>globals[key],set:(value:unknown)=>{globals[key]=value;},enumerable:true,configurable:true});
}
export function callbackBuiltin(name:string,args:unknown[],ctx:OriginalModuleContext):unknown{
  switch(name){
    case 'defined':{const constants=ctx.state.constants as Record<string,unknown>|undefined;if(!constants)throw new Error('Missing source constants');return Object.hasOwn(constants,phpString(args[0]));}
    case 'constant':{const constants=ctx.state.constants as Record<string,unknown>|undefined;if(!constants||!Object.hasOwn(constants,phpString(args[0])))throw new Error('Undefined source constant');return constants[phpString(args[0])];}
    case 'is_array':return args[0]!==null&&typeof args[0]==='object';
    case 'in_array':return callbackEntries(args[1]).some(([,v])=>phpBinary('==',args[0],v));
    case 'array_merge':{const result=new OriginalPhpArray();let next=0;for(const arg of args)for(const [k,v]of callbackEntries(arg)){if(typeof k==='number'||/^(0|[1-9]\d*)$/.test(k))result.set(next++,v);else result.set(k,v);}return result;}
    case 'round':{const n=phpNumber(args[0]);return Math.sign(n)*Math.round(Math.abs(n));}
    case 'strval':return phpString(args[0]);
    case 'strpos':{const str=phpString(args[0]),index=str.indexOf(phpString(args[1]),phpNumber(args[2]));return index<0?false:new TextEncoder().encode(str.slice(0,index)).length;}
    case 'explode':return callbackArray(phpString(args[1]).split(phpString(args[0])).map((v,i)=>[i,v]));
    case 'date':{
      const d=new Date(phpNumber(args[1])*1000),pad=(n:number)=>String(n).padStart(2,'0');const parts:Record<string,string>={s:pad(d.getUTCSeconds()),i:pad(d.getUTCMinutes()),H:pad(d.getUTCHours()),j:String(d.getUTCDate()),n:String(d.getUTCMonth()+1),Y:String(d.getUTCFullYear()),w:String(d.getUTCDay())};
      return [...phpString(args[0])].map(c=>parts[c]??c).join('');
    }
    case 'array_values':return callbackArray(callbackEntries(args[0]).map(([,v],i)=>[i,v]));
    case 'array_unique':{const seen=new Set<string>(),result=callbackArray(callbackEntries(args[0]));for(const [k,v]of result){const text=phpString(v);if(seen.has(text))result.delete(k);else seen.add(text);}return result;}
    case 'array_diff':{const ignore=new Set(callbackEntries(args[1]).map(([,v])=>phpString(v)));return callbackArray(callbackEntries(args[0]).filter(([,v])=>!ignore.has(phpString(v))));}
    case 'end':return callbackEntries(args[0]).at(-1)?.[1]??false;
    case 'array_randompick':{const a=args[0],random=ctx.state.random as {arrayKeys(keys:readonly(PhpKey|null)[]):PhpKey}|undefined;if(!random)throw new Error('Missing source RNG');const keys=a instanceof OriginalPhpArray?a.bucketKeys():callbackEntries(a).map(([k])=>k);return callbackGet(a,random.arrayKeys(keys));}
    case 'get_var_in_module':{const modules=ctx.state.modules as Record<string,Record<string,unknown>>|undefined;const m=modules?.[phpString(args[1])];if(!m)throw new Error('Missing source globals');return m[phpString(args[0])];}
    case 'rand':{const random=ctx.state.random as {int(a:number,b:number):number}|undefined;if(!random)throw new Error('Missing original RNG');return random.int(phpNumber(args[0]),phpNumber(args[1]));}
  }
  throw new Error('Unported callback builtin: '+name);
}
