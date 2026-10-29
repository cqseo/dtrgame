import{OriginalModuleDispatcher}from'./original-module-dispatch';
import{originalCompoundAttribute}from'./original-starting-items';
import{OriginalPhpArray as A}from'./original-php-array';
import{phpNumber,phpString,phpTruthy}from'./original-template-runtime';
export interface OriginalWorldRowPorts {
 gametype:number;gamevars:A;baseShop:readonly string[];
 npcOwner(name:string):Promise<number|null>;
 poisonEnabled:boolean;digitAttributesEnabled:boolean;
}
const separate=(text:string)=>text.includes('{')&&text.includes('}')&&text.includes(',')?text.replace(/<:comp_itmsk:>\{(.+)\}/gs,(_m,body:string)=>'<:comp_itmsk:>{'+body.replaceAll(',','<:sepr:>')+'}'):text;
function row(value:unknown):unknown[]{if(!Array.isArray(value))throw new Error('Expected source data row');return value;}
// Source retains null/numeric attributes when preg_match finds no marker.
const compound=(value:unknown):unknown=>typeof value==='string'?originalCompoundAttribute(value):value??null;
export function registerOriginalWorldItemRows(d:OriginalModuleDispatcher,p:OriginalWorldRowPorts):void{
 d.register('itemmain','mapitem_row_data_seperate',(ctx,line,no=-1)=>ctx.call('itemmain','mapitem_row_data_process',phpString(line).split(','),no));
 d.register('attrbase','mapitem_row_data_seperate',(ctx,line,no=-1)=>ctx.parent(separate(phpString(line)),no));
 d.register('itemmain','mapitem_row_data_process',async(_ctx,value)=>{
  const data=[...row(value)];if(phpTruthy(data[7])&&phpString(data[7]).startsWith('=')){
   const id=await p.npcOwner(phpString(data[7]).slice(1));data[7]='';
   if(id)data[7]=p.poisonEnabled&&p.digitAttributesEnabled?'^psr'+id:id;
  }return data;
 });
 d.register('attrbase','mapitem_row_data_process',async(ctx,value,no=-1)=>{const data=row(await ctx.parent(value,no));data[7]=compound(data[7]);return data;});
 d.register('instance9','mapitem_row_data_process',async(ctx,value,no=-1)=>{const data=row(await ctx.parent(value,no));if(p.gametype===19){const kind=phpString(data[4]),name=phpString(data[3]);if(kind.startsWith('D'))data[5]=phpNumber(data[5])*2;else if((name.includes('钉')||name.includes('磨刀石'))&&kind.startsWith('Y'))data[5]=phpNumber(data[5])*5;}return data;});
 d.register('itemshop','shopitem_row_data_seperate',(ctx,line)=>ctx.call('itemshop','shopitem_row_data_process',phpString(line).split(',')));
 d.register('attrbase','shopitem_row_data_seperate',(ctx,line)=>ctx.parent(separate(phpString(line))));
 d.register('itemshop','shopitem_row_data_process',(_ctx,data)=>[...row(data)]);
 d.register('attrbase','shopitem_row_data_process',async(ctx,value)=>{const data=row(await ctx.parent(value));data[8]=compound(data[8]);return data;});
 d.register('instance9','shopitem_row_data_process',async(ctx,value)=>{const data=row(await ctx.parent(value));if(p.gametype===19){const kind=phpString(data[5]),name=phpString(data[4]);if(!kind.startsWith('D')&&(name.includes('钉')||name.includes('磨刀石'))&&kind.startsWith('Y')){data[6]=phpNumber(data[6])*5;data[2]=phpNumber(data[2])*5;}}return data;});
 d.register('aprilfool2018','shopitem_row_data_process',async(ctx,value)=>{const data=row(await ctx.parent(value));if([0,4].includes(p.gametype)&&Number(await ctx.call('achievement_base','check_achtype_available',34))===1&&data[4]==='安雅人体冰雕')data[1]=phpNumber(data[1])*10;return data;});
 d.register('instance10','shopitem_row_data_process',async(ctx,value)=>{const data=row(await ctx.parent(value));if(p.gametype===20&&p.gamevars.get('instance10_stage')!=null&&Math.trunc(phpNumber(data[3]))+1>=phpNumber(p.gamevars.get('instance10_stage')))data[3]=0;return data;});
 d.register('itemshop','get_shopitem_list_by_kind',async(ctx,value)=>{
  const lines=row(value),groups=new A();for(const line of lines)if(phpTruthy(line)&&phpString(line).includes(',')){const data=row(await ctx.call('itemshop','shopitem_row_data_seperate',line));if(phpTruthy(data[0])){const key=phpString(data[0]),items=(groups.get(key)as unknown[][]|undefined)??[];items.push(data);groups.set(key,items);}}return groups;
 });
 d.register('itemshop','get_shopitem_list',async(ctx,custom=[])=>{
  const groups=await ctx.call('itemshop','get_shopitem_list_by_kind',[...p.baseShop])as A;
  if(phpTruthy(custom)&&JSON.stringify(custom)!==JSON.stringify(p.baseShop)){const overrides=await ctx.call('itemshop','get_shopitem_list_by_kind',custom)as A;for(const[k,v]of overrides)groups.set(k,v);}
  return [...groups].sort(([a],[b])=>phpNumber(a)-phpNumber(b)).flatMap(([,items])=>items as unknown[][]);
 });
}
