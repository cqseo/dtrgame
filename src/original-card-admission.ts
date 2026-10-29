import {OriginalModuleDispatcher}from './original-module-dispatch';
import {OriginalPhpRandom}from './original-random';
import {OriginalPhpArray,type PhpKey}from './original-php-array';
import {originalCompoundAttribute}from './original-starting-items';
import {phpNumber,phpString,phpTruthy}from './original-template-runtime';
export interface OriginalCardDefinition {name:string;rare:string;title?:string;valid:OriginalPhpArray;pack:string;}
export interface OriginalCardPorts {gametype:number;level:number|null;cards:Map<number,OriginalCardDefinition>;index:Map<string,number[]>;rareColors:Map<string,string>;random:OriginalPhpRandom;checkPlace(value:unknown):Promise<unknown>;}
export type OriginalCardResult=[Record<string,unknown>,OriginalPhpArray,string];
function array(v:unknown):OriginalPhpArray{if(!(v instanceof OriginalPhpArray))throw new Error('Expected original ordered PHP card array');return v;}
function truth(v:unknown):boolean{return v instanceof Map?v.size>0:phpTruthy(v);}
export function registerOriginalCardAdmission(d:OriginalModuleDispatcher,p:OriginalCardPorts):void{
  const definition=(id:number)=>{const c=p.cards.get(id);if(!c)throw new Error('Original card definition missing: '+id);return c;};
  const pick=(a:OriginalPhpArray):unknown=>a.get(p.random.arrayKeys(a.bucketKeys()) as PhpKey);
  const chooseList=(list:readonly unknown[]):unknown=>list[p.random.int(0,list.length-1)];
  d.register('cardbase','get_enter_battlefield_card',(_ctx,card)=>p.gametype===0?0:card);
  for(const [module,mode,card]of [['instance7',17,1000],['gtype6',6,1001],['gtype1',1,93],['instance10',20,1002]]as const)d.register(module,'get_enter_battlefield_card',async(ctx,value)=>{const previous=await ctx.parent(value);return p.gametype===mode?card:previous;});
  d.register('instance3','get_enter_battlefield_card',(ctx,card)=>p.gametype===13?(p.level===null?303:[303,304,305][Math.floor(Math.max(p.level-1,0)/10)]??null):ctx.parent(card));
  d.register('cardbase','enter_battlefield_cardproc_valueproc',async(_ctx,key,value)=>{if(key==='pls')await p.checkPlace(value);return value;});
  d.register('attrbase','enter_battlefield_cardproc_valueproc',async(ctx,key,value)=>{
    const result=await ctx.parent(key,value),k=String(key);return ['wep','arb','arh','ara','arf','art','itm'].includes(k.slice(0,3))&&k.includes('sk')?originalCompoundAttribute(phpString(result)):result;
  });
  d.register('cardbase','cardchange',(_ctx,value)=>{
    const original=Number(value),cs=definition(original).valid.get('cardchange');if(!truth(cs))return original;
    const rules=array(cs),index=(key:string)=>p.index.get(key)??[];let candidates:unknown[]=[0];
    if(truth(rules.get('real_random')))candidates.push(...index('S'),...index('A'),...index('B'),...index('C'),...index('EB'));
    else{const roll=p.random.int(1,100),s=phpNumber(rules.get('S_odds')),a=phpNumber(rules.get('A_odds')),b=phpNumber(rules.get('B_odds'));const rarity=roll<=s?'S':roll-s<=a?'A':roll-s-a<=b?'B':'C';candidates=[...index(rarity)];if(truth(rules.get('allow_EB')))candidates.push(...index('EB_'+rarity));}
    if(truth(rules.get('packlimit')))candidates=candidates.filter(id=>truth(id)&&definition(Number(id)).pack===rules.get('packlimit'));
    const forced=rules.get('forced');if(forced instanceof Map)candidates.push(...forced.values());
    // array_unique keeps first entries; after array_merge the underlying buckets
    // retain holes for rejected duplicates, which affects array_rand draw count.
    const choices=new OriginalPhpArray();candidates.forEach((x,i)=>choices.set(i,x));const seen=new Set<string>();for(const [k,v]of choices){const key=phpString(v);if(seen.has(key))choices.delete(k);else seen.add(key);}
    const ignore=rules.get('ignore_cards'),ignored=ignore instanceof Map?[...ignore.values()]:[];
    for(let attempts=0;attempts<100000;attempts++){const next=Number(pick(choices));if(next!==original&&!truth(definition(next).valid.get('cardchange'))&&!ignored.some(x=>Number(x)===next))return next;}
    throw new Error('Original card rejection sampling did not terminate');
  });
  d.register('cardbase','card_valid_info_process',async(ctx,infoValue,playerValue,skillsValue)=>{
    const info=array(infoValue),player=playerValue as Record<string,unknown>,skills=array(skillsValue);
    for(const [key0,initial]of info){const key=String(key0);let value=initial;
      if(key==='skills'){for(const [id,level]of array(value))skills.set(id,level);continue;}
      if(key==='rand_skills'){
        for(const [,group]of array(value)){const g=new OriginalPhpArray();for(const [k,v]of array(group))g.set(k,v);const count=truth(g.get('rnum'))?phpNumber(g.get('rnum')):1;g.delete('rnum');const keys=p.random.shuffle([...g.keys()]);
          // Original loop starts at 1, skipping shuffled index zero.
          for(let i=1;i<=count;i++){const id=keys[i]??'';skills.set(id,g.get(id)??null);}}
        continue;
      }
      if(key==='rand_sets'){await ctx.call('cardbase','card_valid_info_process',pick(array(value)),player,skills);continue;}
      if(['wep','arb','arh','ara','arf','art','itm'].includes(key.slice(0,3))&&value instanceof OriginalPhpArray)value=pick(value);
      value=await ctx.call('cardbase','enter_battlefield_cardproc_valueproc',key,value);
      const str=value instanceof Map?'':phpString(value),prefix=str[0],suffix=str.slice(1);
      if(prefix&&['+','-','='].includes(prefix)&&/^[\s]*[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(suffix))player[key]=prefix==='='?suffix:phpNumber(player[key])+(prefix==='+'?1:-1)*Number(suffix);else player[key]=value;
    }
    return [player,skills];
  });
  d.register('cardbase','enter_battlefield_cardproc',async(ctx,playerValue,cardValue)=>{
    const player={...(playerValue as Record<string,unknown>)};let card=Number(cardValue);const original=definition(card),change=original.valid.get('cardchange');
    if(truth(change)){if(!truth(array(change).get('perm_change')))player.o_card=card;card=Number(await ctx.call('cardbase','cardchange',card));if(!p.cards.has(card))card=0;}
    const c=definition(card),newsCard=truth(player.o_card)?definition(Number(player.o_card)):c;
    const prefix='<span class="'+p.rareColors.get(newsCard.rare)+'">'+newsCard.name+'</span> ';
    const skills=new OriginalPhpArray();await ctx.call('cardbase','card_valid_info_process',c.valid,player,skills);player.card=card;player.cardname=truth(c.title)?c.title:c.name;
    return [player,skills,prefix] satisfies OriginalCardResult;
  });
  d.register('skill584','enter_battlefield_cardproc',async(ctx,player,card)=>{const result=await ctx.parent(player,card)as OriginalCardResult;if(Number(card)===344)result[1].set(584,'0');return result;});
  d.register('skill720','enter_battlefield_cardproc',async(ctx,playerValue,card)=>{
    const before={...(playerValue as Record<string,unknown>)};const result=await ctx.parent(playerValue,card)as OriginalCardResult;if(Number(card)!==381)return result;
    const id=Number(result[0].card),def=definition(id);Object.assign(before,{card:result[0].card,cardname:result[0].cardname,o_card:381,wep:'手榴弹',wepk:'WC',wepe:'40',weps:'1',wepsk:'',art:'毒物说明书',artk:'A',arte:'1',arts:'1',artsk:''});
    return [before,new OriginalPhpArray(),'<span class="'+p.rareColors.get(def.rare)+'">'+(truth(def.title)?def.title:def.name)+'</span> ']satisfies OriginalCardResult;
  });
  d.register('instance3','enter_battlefield_cardproc',async(ctx,player,card)=>{
    const result=await ctx.parent(player,card)as OriginalCardResult,level=p.level;if(p.gametype!==13||level===null)return result;
    const [data,skills]=result;if(level>=9)skills.set(474,'0');
    for(const [id,thresholds]of [[901,[1,7,12,13,26]],[902,[2,3,15,25]],[903,[6,27,28,29,30]],[904,[10,19,21]],[905,[11,17,24]],[906,[16,18]]]as const){const n=thresholds.filter(t=>level>=t).length;if(n)skills.set(id,String(n));}
    if(level>=23)skills.set(907,'0');if(level>=4){data.msp=phpNumber(data.msp)-200;data.sp=phpNumber(data.sp)-200;if(level>=5){const loss=level>=8?100:50;data.mhp=phpNumber(data.mhp)-loss;data.hp=phpNumber(data.hp)-loss;}}
    return result;
  });
}
