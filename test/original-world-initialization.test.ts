import{it,expect}from'vitest';import fs from'node:fs';import{gunzipSync}from'node:zlib';
import{OriginalPhpArray as A,type PackedPhpValue}from'../src/original-php-array';import{OriginalPhpRandom}from'../src/original-random';import{OriginalModuleDispatcher}from'../src/original-module-dispatch';import{originalHookCatalog}from'../src/generated/original-hook-catalog';
import{registerOriginalWorldInitialization,type OriginalWorldState,type OriginalWorldConfig}from'../src/original-world-initialization';import{originalPopulateNpcs,originalPopulateMapItems,originalPopulateTraps,originalPopulateShop,type OriginalWorldStorage}from'../src/original-world-population';
const f=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync(new URL('./fixtures/original-world-initialization-php.json.gz.base64',import.meta.url),'utf8'),'base64')).toString())as{cases:{gametype:number;mask:number;seed:number;result:PackedPhpValue;trace:PackedPhpValue;nextRandom:number}[]};
const a=(entries:readonly(readonly[number|string,unknown])[])=>new A(entries);
for(const[i,c]of f.cases.entries())it(`original world init ${i}: mode ${c.gametype}, mask ${c.mask}, seed ${c.seed}`,async()=>{
 const trace:unknown[]=[],random=new OriginalPhpRandom(c.seed),places=[0,1,2,3,4,5,21,26,33,34];
 const s:OriginalWorldState={gametype:c.gametype,starttime:1793232123,now:1793232123,arealist:places,areanum:1,areatime:0,hack:7,areawarn:7,weather:99,validnum:7,alivenum:6,deathnum:5,gamevars:new A(),roomvars:a([['current_game_option',a([['area-mode','extreme']])]])};
 const config:OriginalWorldConfig={places:a(places.map(p=>[p,'place'+p])),observerPlaces:a([[101,'a'],[102,'b'],[103,'c'],[104,'d']]),initialForbidden:[0],dangerousPlaces:[0,34],areaAdd:4,areaIntervals:new Map([[0,30],[19,10]]),tutorialAreaAugment:22075200,tutorialWeather:[0,2],randomRecipeModes:[20]};
 const storage:OriginalWorldStorage={deleteNpcs:async()=>{trace.push('deleteNpcs');},insertNpc:async p=>{trace.push(['insertNpc',p]);},insertItems:async rows=>{trace.push(['mapitem',rows.map(row=>Object.values(row).map(String))]);},insertTraps:async rows=>{trace.push(['maptrap',rows.map(row=>Object.values(row).map(String))]);},resetShop:async()=>{trace.push('RESET_SHOP');},insertShop:async rows=>{trace.push(['shopitem',rows.map(row=>Object.values(row).map(String))]);},npcOwner:async name=>{trace.push('npcOwner');return name==='owner'?88:null;}};
 // Keep actual rs_game and map hook chains; capture unimplemented downstream
 // effects at the same explicit endpoints as the source PHP oracle.
 const catalog={...originalHookCatalog};
 for(const[name,module]of Object.entries({get_npclist:'npc',check_initnpcadd:'npc',init_npcdata:'npc',player_format_with_db_structure:'player',get_itemfilecont:'itemmain',itemlist_data_process:'itemmain',mapitem_row_data_seperate:'itemmain',mapitem_single_data_attr_process:'itemmain',get_shopconfig:'itemshop',get_shopitem_list:'itemshop',get_trapfilecont:'trap',lay_mapitem:'itemmain',create_randrecipe_config:'randrecipe'}))catalog[name]=[{name,module,magic:false}];
 const d=new OriginalModuleDispatcher(catalog);
 registerOriginalWorldInitialization(d,s,config,random,{resetPlayers:async()=>{trace.push('RESET_PLAYERS');},initializeNpcs:ctx=>originalPopulateNpcs(ctx,storage,a([['mhp',50],['type',0],['name','default']]),random),initializeShop:ctx=>originalPopulateShop(ctx,storage),initializeTraps:ctx=>originalPopulateTraps(ctx,storage,[0,34],random)});
 d.register('npc','get_npclist',()=>a([[1,a([['num',2],['mhp',100],['sub',a([[1,a([['name','A']])],[3,a([['name','B']])],[8,a([['name','C']])]])]])],[2,a([['num',3],['sub',a([[2,a([['name','D']])],[5,a([['name','E']])]])]])],[14,a([['num',1],['sub',a([[1,a([['name','VIP']])]])]])]]));
 d.register('npc','check_initnpcadd',()=>1);
 d.register('npc','init_npcdata',(_ctx,value,safe)=>{const npc=value as A,options=safe as A;npc.set('pls',options.size?options.get(random.arrayKeys(options.bucketKeys())as number):0);return npc;});
 d.register('player','player_format_with_db_structure',(_ctx,p)=>{(p as A).delete('num');return p;});
 d.register('itemmain','get_itemfilecont',()=>['HEADER','0,99,2,随机面包,HH,100,3,,','99,2,1,固定药,HS,50,1,,','98,1,1,后续,HH,1,1,,','=ignored,comment','0,1,1,空物品,HH,1,0,,']);
 d.register('itemmain','itemlist_data_process',(_ctx,p)=>p);d.register('itemmain','mapitem_row_data_seperate',(_ctx,p)=>String(p).split(','));
 d.register('itemmain','mapitem_single_data_attr_process',(_ctx,name,kind,power,durability,attributes,place,count)=>[name,kind,power,count===1?0:durability,attributes,place]);
 d.register('itemmain','lay_mapitem',ctx=>originalPopulateMapItems(ctx,storage,[0,34],random));
 d.register('itemshop','get_shopconfig',()=>[]);d.register('itemshop','get_shopitem_list',()=>[['1','2','50','0','测试商品','HH','10','1','']]);
 d.register('trap','get_trapfilecont',()=>['HEADER','0,99,2,地雷,TN,20,1,=owner','99,2,1,固定陷阱,TN,10,1,=missing','98,1,1,不刷,TN,1,1,']);
 d.register('randrecipe','create_randrecipe_config',(_ctx,n)=>{trace.push(['recipe',n,random.int(0,99)]);});
 await d.call('sys','rs_game',c.mask);
 expect(A.pack({arealist:s.arealist,areanum:s.areanum,areatime:s.areatime,hack:s.hack,areawarn:s.areawarn,weather:s.weather,validnum:s.validnum,alivenum:s.alivenum,deathnum:s.deathnum,gamevars:s.gamevars,area_on_start:config.initialForbidden})).toEqual(c.result);
 expect(A.pack(trace)).toEqual(c.trace);expect(random.raw31()).toBe(c.nextRandom);
});
