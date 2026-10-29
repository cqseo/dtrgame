import {OriginalModuleDispatcher,type OriginalModuleContext}from './original-module-dispatch';
import {OriginalPhpArray as A}from './original-php-array';
import {OriginalPhpRandom}from './original-random';
import {phpNumber,phpTruthy}from './original-template-runtime';

export interface OriginalWorldState {
 gametype:number;starttime:number;now:number;arealist:number[];areanum:number;areatime:number;hack:number;areawarn:number;weather:number;
 validnum:number;alivenum:number;deathnum:number;gamevars:A;roomvars:A;
}
export interface OriginalWorldConfig {
 places:A;observerPlaces:A;initialForbidden:number[];dangerousPlaces:number[];areaAdd:number;areaIntervals:ReadonlyMap<number,number>;
 tutorialAreaAugment?:number;tutorialWeather?:readonly[number,number];randomRecipeModes:readonly number[];
}
export interface OriginalWorldEffects {
 resetPlayers():Promise<void>;initializeNpcs(ctx:OriginalModuleContext):Promise<void>;
 initializeShop(ctx:OriginalModuleContext):Promise<void>;initializeTraps(ctx:OriginalModuleContext):Promise<void>;
}
/** Registers the original 16-layer rs_game chain. Every database population
 * effect is required and awaited; missing dependencies never become empty data.
 * Call within the room transaction using one request-scoped RNG and config.
 */
export function registerOriginalWorldInitialization(d:OriginalModuleDispatcher,s:OriginalWorldState,c:OriginalWorldConfig,random:OriginalPhpRandom,effects:OriginalWorldEffects):void{
 d.register('sys','rs_game',()=>undefined);
 d.register('map','rs_game',async(ctx,value=0)=>{
  const mask=phpNumber(value);await ctx.parent(mask);
  if(mask&2){s.areatime=Number(await ctx.call('map','rs_areatime'));s.areanum=c.initialForbidden.length;
    const places=await ctx.call('map','get_all_plsno',1)as number[];
    s.arealist=[...c.initialForbidden,...random.shuffle(places.filter(p=>!c.initialForbidden.includes(p)))];s.hack=0;s.areawarn=0;}
 });
 d.register('player','rs_game',async(ctx,value)=>{const mask=phpNumber(value);await ctx.parent(mask);if(mask&4){await effects.resetPlayers();s.validnum=s.alivenum=s.deathnum=0;}});
 d.register('npc','rs_game',async(ctx,value=0)=>{const mask=phpNumber(value);await ctx.parent(mask);if(mask&8)await effects.initializeNpcs(ctx);});
 d.register('itemmain','rs_game',async(ctx,value)=>{const mask=phpNumber(value);await ctx.parent(mask);if(mask&16)await ctx.call('itemmain','lay_mapitem');});
 d.register('itemshop','rs_game',async(ctx,value)=>{const mask=phpNumber(value);await ctx.parent(mask);if(mask&32)await effects.initializeShop(ctx);});
 d.register('trap','rs_game',async(ctx,value)=>{const mask=phpNumber(value);await ctx.parent(mask);if(mask&16)await effects.initializeTraps(ctx);});
 d.register('weather','rs_game',async(ctx,value=0)=>{const mask=phpNumber(value);await ctx.parent(mask);if(mask&2)s.weather=[0,2,3,4,7][random.int(0,4)]!;});
 for(const [module,mode]of [['instance6',16],['instance3',13],['instance5',15]]as const)d.register(module,'rs_game',async(ctx,value=0)=>{const mask=phpNumber(value);await ctx.parent(mask);if(s.gametype===mode&&(mask&2))s.weather=1;});
 d.register('gtype1','rs_game',async(ctx,value=0)=>{const mask=phpNumber(value);await ctx.parent(mask);if(s.gametype===1&&(mask&2)){s.weather=1;s.hack=1;}});
 d.register('tutorial','rs_game',async(ctx,value=0)=>{const mask=phpNumber(value);await ctx.parent(mask);if((mask&2)&&s.gametype===17){if(c.tutorialAreaAugment!==undefined)s.areatime=s.starttime+c.tutorialAreaAugment;if(c.tutorialWeather!==undefined)s.weather=random.int(...c.tutorialWeather);}});
 d.register('randrecipe','rs_game',async(ctx,value=0)=>{const mask=phpNumber(value);await ctx.parent(mask);if(c.randomRecipeModes.includes(s.gametype)&&(mask&2))await ctx.call('randrecipe','create_randrecipe_config',30);});
 d.register('instance11','rs_game',async(ctx,value=0)=>{const mask=phpNumber(value);if(s.gametype===21&&(mask&2))c.initialForbidden=[];await ctx.parent(mask);if(s.gametype===21&&(mask&2)){s.weather=18;s.areatime=s.starttime+1919810;s.gamevars.set('map_display_group',1);s.gamevars.set('plsinfo',new A(c.observerPlaces));}});
 d.register('instance10','rs_game',async(ctx,value=0)=>{const mask=phpNumber(value);await ctx.parent(mask);if(s.gametype===20&&(mask&2)){s.weather=1;s.areanum+=s.arealist.length-8+1;}});
 d.register('map','get_area_interval',()=>c.areaIntervals.get(s.gametype)??c.areaIntervals.get(0));
 d.register('map','rs_areatime',async ctx=>Math.ceil((s.starttime+Number(await ctx.call('map','get_area_interval'))*60)/600)*600);
 d.register('instance9','rs_areatime',async ctx=>s.gametype===19?s.starttime+Number(await ctx.call('map','get_area_interval'))*60:ctx.parent());
 d.register('instance3','rs_areatime',ctx=>s.gametype===13?s.starttime+2400:ctx.parent());
 d.register('instance5','rs_areatime',ctx=>s.gametype===15&&(s.roomvars.get('current_game_option')as A|undefined)?.get('area-mode')==='extreme'?s.starttime+2400:ctx.parent());
 d.register('instance10','rs_areatime',ctx=>s.gametype===20?s.starttime+7200:ctx.parent());
 let placeCache:number[]=[];
 d.register('map','get_all_plsno',(_ctx,useConfig=0)=>{if(phpTruthy(useConfig))return [...c.places.keys()];if(!placeCache.length)placeCache=[...s.arealist].sort((a,b)=>a-b);return [...placeCache];});
 d.register('instance11','get_all_plsno',(ctx,useConfig=0)=>phpTruthy(useConfig)&&s.gametype===21?[...c.observerPlaces.keys()]:ctx.parent(useConfig));
 d.register('map','get_area_wavenum',()=>Math.max(0,Math.floor((s.areanum-c.initialForbidden.length)/c.areaAdd)));
 d.register('instance10','get_area_wavenum',ctx=>s.gametype===20?0:ctx.parent());
 d.register('map','get_current_area',(_ctx,wave=0)=>s.arealist.slice(0,s.areanum+phpNumber(wave)*c.areaAdd));
 d.register('map','get_current_not_area',(_ctx,wave=0)=>s.arealist.slice(s.areanum+phpNumber(wave)*c.areaAdd));
 d.register('map','get_safe_plslist',async(ctx,noDanger=true)=>{
  const places=await ctx.call('map','get_current_not_area')as number[],result=new A(places.map((p,i)=>[i,p]));
  if(places.length&&phpTruthy(noDanger))for(const [key,value]of result)if(c.dangerousPlaces.includes(Number(value)))result.delete(key);
  return result;
 });
 d.register('npc','get_safe_plslist',async(ctx,noDanger=true,type=0)=>{
  const result=await ctx.parent(noDanger,type)as A;if(phpTruthy(noDanger)&&phpNumber(type)===1)for(const [key,value]of result)if([21,26,33].includes(Number(value)))result.delete(key);return result;
 });
}
