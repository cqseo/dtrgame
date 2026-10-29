import type {OriginalModuleContext}from './original-module-dispatch';
import {OriginalPhpArray as A,type PhpKey}from './original-php-array';
import {OriginalPhpRandom}from './original-random';
import {phpNumber,phpString,phpTruthy,phpBinary}from './original-template-runtime';
export interface WorldItemRow {itm:unknown;itmk:unknown;itme:unknown;itms:unknown;itmsk:unknown;pls:unknown;}
export interface WorldShopRow {kind:unknown;num:unknown;price:unknown;area:unknown;item:unknown;itmk:unknown;itme:unknown;itms:unknown;itmsk:unknown;}
export interface OriginalWorldStorage {
 deleteNpcs():Promise<void>;insertNpc(player:A):Promise<void>;
 insertItems(rows:readonly WorldItemRow[]):Promise<void>;insertTraps(rows:readonly WorldItemRow[]):Promise<void>;
 resetShop():Promise<void>;insertShop(rows:readonly WorldShopRow[]):Promise<void>;
 npcOwner(name:string):Promise<number|null>;
}
function entries(value:unknown):[PhpKey,unknown][]{if(value instanceof Map)return [...value];if(Array.isArray(value))return value.map((v,i)=>[i,v]);throw new Error('World hook did not return a PHP array');}
function values(value:unknown):unknown[]{return entries(value).map(([,v])=>v);}
function at(value:unknown,key:PhpKey):unknown{return value instanceof Map?value.get(key):(value as Record<string|number,unknown>)?.[key];}
function clone(value:unknown):unknown{return value instanceof Map?new A([...value].map(([k,v])=>[k,clone(v)])):Array.isArray(value)?value.map(clone):value;}
function merge(...sources:unknown[]):A{const result=new A();let index=0;for(const source of sources)for(const [k,v]of entries(source))result.set(typeof k==='number'?index++:k,clone(v));return result;}
function pick(source:unknown,random:OriginalPhpRandom,count=1):unknown {
 const a=source instanceof A?source:new A(entries(source)),key=random.arrayKeys(a.bucketKeys(),count);
 return Array.isArray(key)?new A(key.map(k=>[k,a.get(k)])):a.get(key);
}
export async function originalPopulateNpcs(ctx:OriginalModuleContext,storage:OriginalWorldStorage,npcDefaults:A,random:OriginalPhpRandom):Promise<void>{
 await storage.deleteNpcs();
 const info=await ctx.call('npc','get_npclist'),safe=await ctx.call('map','get_safe_plslist'),importantSafe=await ctx.call('map','get_safe_plslist',1,1);
 for(const [type,raw]of entries(info)){
  const npc=clone(raw)as A;if(!phpTruthy(npc))continue;
  if(!await ctx.call('npc','check_initnpcadd',type))continue;
  let sub:A=new A();if(phpTruthy(npc.get('sub'))){sub=npc.get('sub')as A;npc.delete('sub');}
  const base=[...sub.keys()],count=phpNumber(npc.get('num'));let choices:unknown=base;
  if(!base.length||!count)choices=[];
  else if(base.length>count)choices=pick(base,random,count);
  else if(base.length<count){const repeated=[...base];while(repeated.length<count)repeated.push(...base);choices=repeated;}
  // The source's count=1 array_randompick returns a scalar; sort/foreach then
  // generate no NPCs in PHP 7.4. Preserve this quirk, not an invented singleton.
  if(!(choices instanceof Map)&&!Array.isArray(choices))continue;
  const sorted=values(choices).sort((a,b)=>phpNumber(a)-phpNumber(b));
  for(const choice of sorted){
    const data=merge(npcDefaults,npc,sub.size?sub.get(choice as PhpKey):new A());data.set('type',type);data.set('sNo',choice);
    const initialized=await ctx.call('npc','init_npcdata',data,Number(type)===14?importantSafe:safe);
    const formatted=await ctx.call('player','player_format_with_db_structure',initialized);
    if(!(formatted instanceof A))throw new Error('NPC formatter did not return original fields');
    await storage.insertNpc(formatted);
  }
 }
}
export async function originalPopulateMapItems(ctx:OriginalModuleContext,storage:OriginalWorldStorage,noItemPlaces:readonly number[],random:OriginalPhpRandom,limitPlace=-1):Promise<void>{
 const places=await ctx.call('map','get_all_plsno'),source=await ctx.call('itemmain','get_itemfilecont'),lines=await ctx.call('itemmain','itemlist_data_process',source),wave=await ctx.call('map','get_area_wavenum');
 const rows:WorldItemRow[]=[];let count=0;
 for(let i=1;i<entries(lines).length;i++){
  const line=phpString(at(lines,i));if(!phpTruthy(line)||line.startsWith('=')||!line.includes(','))continue;
  const data=await ctx.call('itemmain','mapitem_row_data_seperate',line,i),[area,map,num,name,kind,power,durability,attributes]=Array.from({length:8},(_,n)=>at(data,n)??null);
  if(!phpTruthy(durability)||!(phpBinary('==',area,wave)||phpBinary('==',area,99)||(phpBinary('==',area,98)&&phpNumber(wave)>0)))continue;
  if(limitPlace!==-1&&!phpBinary('==',limitPlace,map))continue;
  for(let j=phpNumber(num);j>0;j--){
    let place=map;if(phpBinary('==',map,99)){do{place=pick(places,random);}while(noItemPlaces.includes(Number(place)));}
    const processed=await ctx.call('itemmain','mapitem_single_data_attr_process',name,kind,power,durability,attributes,place,count++);
    // Original checks the row durability again, not the overridden durability.
    if(phpTruthy(durability))rows.push({itm:at(processed,0),itmk:at(processed,1),itme:at(processed,2),itms:at(processed,3),itmsk:at(processed,4),pls:at(processed,5)});
  }
 }
 if(rows.length)await storage.insertItems(rows);
}
export async function originalPopulateTraps(ctx:OriginalModuleContext,storage:OriginalWorldStorage,noItemPlaces:readonly number[],random:OriginalPhpRandom):Promise<void>{
 const places=await ctx.call('map','get_all_plsno'),lines=await ctx.call('trap','get_trapfilecont'),wave=await ctx.call('map','get_area_wavenum'),rows:WorldItemRow[]=[];
 for(let i=1;i<entries(lines).length;i++){
  const line=phpString(at(lines,i));if(!phpTruthy(line)||!line.includes(','))continue;
  const [area,map,num,name,kind,power,durability,raw]=line.split(',');let attributes:unknown=raw??null;
  if(phpString(attributes).startsWith('='))attributes=await storage.npcOwner(phpString(attributes).slice(1))??'';
  if(!phpBinary('==',area,wave)&&!phpBinary('==',area,99))continue;
  for(let j=phpNumber(num);j>0;j--){let place:unknown=map;if(phpBinary('==',map,99)){do{place=pick(places,random);}while(noItemPlaces.includes(Number(place)));}
    rows.push({itm:name??null,itmk:kind??null,itme:power??null,itms:durability??null,itmsk:attributes,pls:place??null});}
 }
 if(rows.length)await storage.insertTraps(rows);
}
export async function originalPopulateShop(ctx:OriginalModuleContext,storage:OriginalWorldStorage):Promise<void>{
 await storage.resetShop();const config=await ctx.call('itemshop','get_shopconfig'),list=await ctx.call('itemshop','get_shopitem_list',config);
 const rows=values(list).map(row=>({kind:at(row,0),num:at(row,1),price:at(row,2),area:at(row,3),item:at(row,4),itmk:at(row,5),itme:at(row,6),itms:at(row,7),itmsk:at(row,8)}));
 // Source executes an empty query when list empty; storage must treat it as an
 // invalid population rather than falsely reporting an initialized shop.
 if(!rows.length)throw new Error('Original empty shop initialization query');await storage.insertShop(rows);
}
