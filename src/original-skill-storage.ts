import {phpTruthy,phpString,phpBinary} from './original-template-runtime';
const alphabet='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-';
export interface OriginalSkillState { acquired:Map<number,number>; parameters:Map<string,string|number|boolean|null>; }
function base64(value:string):string {const bytes=new TextEncoder().encode(value);let str='';for(const b of bytes)str+=String.fromCharCode(b);return btoa(str);}
function decode(value:string):string{
  // PHP base64_decode defaults to non-strict and ignores non-alphabet bytes.
  const cleaned=value.replace(/[^A-Za-z0-9+/]/g,'');
  const usable=cleaned.length%4===1?cleaned.slice(0,-1):cleaned;
  return new TextDecoder().decode(Uint8Array.from(atob(usable),c=>c.charCodeAt(0)));
}
export function originalSkillLoad(nskill:string,nskillpara:string):OriginalSkillState{
  if(nskill.length%2)throw new Error('bad nskill value '+nskill);
  const acquired=new Map<number,number>(),parameters=new Map<string,string|number|boolean|null>();
  for(let i=0;i<nskill.length;i+=2){const a=alphabet.indexOf(nskill[i]!),b=alphabet.indexOf(nskill[i+1]!);if(a<0||b<0)throw new Error('bad nskill value');acquired.set(a*64+b,1);}
  if(phpTruthy(nskillpara)){
    const fields=nskillpara.split(',');if(fields.length%2!==1)throw new Error('bad nskillpara value');
    for(let i=0;i<(fields.length-1)/2;i++)parameters.set(decode(fields[i*2]!),decode(fields[i*2+1]!));
  }
  return {acquired,parameters};
}
export function originalSkillSave(state:OriginalSkillState):[string,string]{
  let nskill='',parameters='';
  for(const [id,enabled]of state.acquired)if(phpBinary('==',enabled,1)){
    if(!Number.isInteger(id)||id<0||id>4095)throw new RangeError('Skill outside original two-character range');
    nskill+=alphabet[Math.trunc(id/64)]!+alphabet[id%64]!;
  }
  for(const [key,value]of state.parameters)parameters+=base64(key)+','+base64(phpString(value))+',';
  return [nskill,parameters];
}
/** Insertion-ordered maps preserve PHP foreach order and duplicate-key writes. */
export function originalSkillSet(state:OriginalSkillState,id:number,key:string,value:string|number|boolean|null):void {state.parameters.set(id+'_'+key,value);}
export function originalSkillGet(state:OriginalSkillState,id:number,key:string):unknown{return state.parameters.get(id+'_'+key)??null;}
export function originalSkillDelete(state:OriginalSkillState,id:number,key:string):void{state.parameters.delete(id+'_'+key);}
