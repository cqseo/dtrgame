import {OriginalModuleDispatcher} from './original-module-dispatch';
import {phpTruthy,phpNumber,phpString} from './original-template-runtime';
export type OriginalAdmissionPlayer=Record<string,string|number|null>;
export interface OriginalStartingItemPorts {
  gametype:number;level:number;eloratedModes:readonly number[];
  randomInt(min:number,max:number):number;
  readPool(module:string,file:'stitem'|'stwep'):readonly string[];
}
export function originalCompoundAttribute(str:string):string {
  const pattern=/<:comp_itmsk:>\{([^\{]+?)\}/gs;
  while(/<:comp_itmsk:>\{([^\{]+?)\}/s.test(str))str=str.replace(pattern,(_match,inner:string)=>{
    const bytes=new TextEncoder().encode(inner.replaceAll('<:sepr:>',','));let text='';for(const b of bytes)text+=String.fromCharCode(b);
    const dict=')!@#$%-~*(';return btoa(text).replace(/[0-9]/g,c=>dict[Number(c)]!);
  });
  return str;
}
function player(data:unknown):OriginalAdmissionPlayer{
  if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Invalid admission player');return data as OriginalAdmissionPlayer;
}
function setItem(p:OriginalAdmissionPlayer,slot:number,name:string,kind:string,power:number,durability:number,attributes=''):void{
  p['itm'+slot]=name;p['itmk'+slot]=kind;p['itme'+slot]=power;p['itms'+slot]=durability;p['itmsk'+slot]=attributes;
}
/** Register every enabled source override for initial inventory, in catalog order. */
export function registerOriginalStartingItems(d:OriginalModuleDispatcher,ports:OriginalStartingItemPorts):void{
  const poolOverrides:Record<string,number>={instance8:18,instance7:17,instance9:19,instance11:21,instance10:20};
  for(const file of ['stitem','stwep'] as const){
    const hook=file==='stitem'?'get_startingitemfilecont':'get_startingwepfilecont';
    d.register('itemmain',hook,()=>ports.readPool('itemmain',file));
    for(const [module,gametype]of Object.entries(poolOverrides)){
      if(module==='instance7'&&file==='stwep')continue;
      d.register(module,hook,(ctx)=>ports.gametype===gametype?ports.readPool(module,file):ctx.parent());
    }
  }
  d.register('itemmain','startingitem_row_data_process',(_ctx,data)=>data);
  d.register('itemmain','startingitem_row_data_seperate',(ctx,data)=>ctx.call('itemmain','startingitem_row_data_process',phpString(data).split(',')));
  d.register('attrbase','startingitem_row_data_seperate',(ctx,data)=>{
    let text=phpString(data);if(text.includes('{')&&text.includes('}')&&text.includes(','))text=text.replace(/<:comp_itmsk:>\{(.+)\}/gs,(_m,inner:string)=>'<:comp_itmsk:>{'+inner.replaceAll(',','<:sepr:>')+'}');
    return ctx.parent(text);
  });
  d.register('itemmain','init_enter_battlefield_items',async(ctx,data)=>{
    const p={...player(data)};p.arb=p.gd==='m'?'男生校服':'女生校服';p.arbk='DB';p.arbe=5;p.arbs=15;
    // Source does not overwrite pre-existing attribute slots for bread/water.
    Object.assign(p,{itm1:'面包',itmk1:'HH',itme1:100,itms1:30,itm2:'矿泉水',itmk2:'HS',itme2:100,itms2:30});
    async function draw(file:'stwep'|'stitem',validIndex:number):Promise<(string|null)[]>{
      const lines=await ctx.call('itemmain',file==='stwep'?'get_startingwepfilecont':'get_startingitemfilecont') as readonly string[];
      if(lines.length<2)throw new Error('Missing original starting pool');
      for(let attempts=0;attempts<10000;attempts++){
        const index=ports.randomInt(1,lines.length-1);if(!Number.isInteger(index)||index<1||index>=lines.length)throw new Error('Original RNG outside source interval');
        const cells=await ctx.call('itemmain','startingitem_row_data_seperate',lines[index]) as string[];
        const result=Array.from({length:5},(_,i)=>cells[i]??null);if(phpTruthy(result[validIndex]))return result;
      }
      throw new Error('Original starting-item rejection sampling did not terminate');
    }
    const weapon=await draw('stwep',1);for(const [i,key]of ['wep','wepk','wepe','weps','wepsk'].entries())p[key]=weapon[i]!;
    for(const slot of [3,4]){const item=await draw('stitem',3);for(const [i,key]of ['itm','itmk','itme','itms','itmsk'].entries())p[key+slot]=item[i]!;}
    return p;
  });
  d.register('elorating','init_enter_battlefield_items',async(ctx,data)=>{const p=player(await ctx.parent(data));if(ports.eloratedModes.includes(ports.gametype)){p.itms1=p.itms2=50;setItem(p,5,'生命探测器','ER',5,1);}return p;});
  d.register('attrbase','init_enter_battlefield_items',async(ctx,data)=>{
    const p=player(await ctx.parent(data));for(const slot of ['wep','arb','arh','ara','arf','art','itm0','itm1','itm2','itm3','itm4','itm5','itm6']){const key=slot.startsWith('itm')?'itmsk'+slot.slice(3):slot+'sk';if(phpTruthy(p[key]))p[key]=originalCompoundAttribute(phpString(p[key]));}return p;
  });
  d.register('instance8','init_enter_battlefield_items',async(ctx,data)=>{const p=player(await ctx.parent(data));if(ports.gametype===18){setItem(p,4,'生命探测器','ER',3,1);setItem(p,5,'全恢复药剂','Ca',1,3);}return p;});
  d.register('instance9','init_enter_battlefield_items',async(ctx,data)=>{const p=player(await ctx.parent(data));if(ports.gametype===19){for(const [slot,name,kind,power,durability]of [['arb','挑战者战斗服','DB',60,10],['arh','挑战者头盔','DH',37,5],['ara','挑战者护手','DA',37,5],['arf','挑战者靴子','DF',37,5]] as const){p[slot]=name;p[slot+'k']=kind;p[slot+'e']=power;p[slot+'s']=durability;p[slot+'sk']='';}setItem(p,5,'全恢复药剂','Ca',1,3);}return p;});
  d.register('instance3','init_enter_battlefield_items',async(ctx,data)=>{
    const p=player(await ctx.parent(data));if(ports.gametype===13){Object.assign(p,{art:'Untainted Glory',artk:'A',arte:1,arts:1,artsk:'Z'});setItem(p,4,'生命探测器','ER',5,1);setItem(p,5,'全恢复药剂','Ca',1,3);if(ports.level>=14){setItem(p,6,'闪回的心伤','Z',1,1,'O');if(ports.level>=22){setItem(p,5,'难抑的焦虑','Z',1,1,'O');if(ports.level>=26)Object.assign(p,{arb:'躯体化的恐惧',arbk:'DB',arbe:10,arbs:9999,arbsk:'O'});}}}return p;
  });
  d.register('instance11','init_enter_battlefield_items',async(ctx,data)=>{const p=player(await ctx.parent(data));if(ports.gametype===21){p.money=phpNumber(p.money)+980;setItem(p,6,'窥屏用头戴式显示器','DH',76,5);setItem(p,0,'蓝凝的便签','Z',1,1);}return p;});
  d.register('instance10','init_enter_battlefield_items',async(ctx,data)=>{const p=player(await ctx.parent(data));if(ports.gametype===20)setItem(p,5,'全恢复药剂','Ca',1,3);return p;});
}
