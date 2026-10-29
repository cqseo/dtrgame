import {it,expect} from 'vitest';import fs from 'node:fs';import {gunzipSync}from 'node:zlib';
import {originalEnterBattlefield,type OriginalAdmissionGame,type OriginalAdmissionData,type OriginalAdmissionPorts}from '../src/original-player-admission';
import {OriginalPhpRandom}from '../src/original-random';
const f=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync(new URL('./fixtures/original-admission-php.json.gz.base64',import.meta.url),'utf8'),'base64')).toString())as{cases:{seed:number;group:number;cardPlace:number;postPlace:number;input:{username:string;password:string;gender:string;icon:number;card:number;ip:string};inserted:OriginalAdmissionData;saved:OriginalAdmissionData;updates:OriginalAdmissionData;news:unknown[];trace:string[];validnum:number;alivenum:number;gamestate:number}[]};
for(const [i,c]of f.cases.entries())it(`original admission order ${i}: group ${c.group}, card place ${c.cardPlace}, hook place ${c.postPlace}`,async()=>{
 const trace:string[]=[],random=new OriginalPhpRandom(c.seed);let inserted:OriginalAdmissionData={},saved:OriginalAdmissionData={},updates:OriginalAdmissionData={},news:unknown[]=[];
 const game:OriginalAdmissionGame={now:1793232000,validnum:1,alivenum:1,hplimit:400,splimit:400,gamestate:c.group===6?30:20,gamenum:27,validlimit:2,roomPrefix:'s9',gamefounder:'',currentUsername:'QA_OWNER',currentAccount:{username:'QA_OWNER',password:'synthetic-digest',groupid:c.group,motto:'motto',killmsg:'killmsg',lastword:'lastword'},roomvars:{current_game_option:{}}};
 const ports:OriginalAdmissionPorts={
  loadGame:async()=>{trace.push('loadGame');},safeSpawnPlaces:async()=>{trace.push('safeSpawn');return[1,2,3];},chooseSpawn:places=>{trace.push('chooseSpawn');return places[random.int(0,places.length-1)]!;},
  randomIcon:async()=>{trace.push('randomIcon');return random.int(1,5);},randomInt:(a,b)=>random.int(a,b),areaWave:async()=>{trace.push('areaWave');return 2;},
  initialItems:async p=>{trace.push('initialItems');return{...p,itm1:'synthetic item'};},account:async()=>{trace.push('account');return game.currentAccount;},
  cardModuleEnabled:true,chooseCard:async card=>{trace.push('chooseCard');return card;},applyCard:async(p,card)=>{trace.push('applyCard:'+card);return[{...p,card,pls:c.cardPlace,gamevars:{test:1},...(card===2?{o_card:2,cardchange:1}:{})},{4:1},'synthetic prefix'];},
  forbidden:async p=>{trace.push('forbidden:'+p);return p===0;},allPlaces:async()=>{trace.push('allPlaces');return[0,1,2,3];},
  insertPlayer:async p=>{trace.push('insertPlayer');inserted=structuredClone(p);},cardOwned:async card=>{trace.push('cardOwned:'+card);return[1,2,154].includes(card);},
  updateAccount:async(_name,p)=>{trace.push('updateAccount');updates=structuredClone(p);},fetchPlayer:async()=>{trace.push('fetchPlayer');return{...structuredClone(inserted),pid:77};},
  postEnter:async p=>{trace.push('postEnter');p.pls=c.postPlace;p.hp=Number(p.hp)-7;},savePlayer:async p=>{trace.push('savePlayer');saved=structuredClone(p);},
  displayIdentity:async p=>{trace.push('displayIdentity');return[String(p.name),'synthetic identity'];},news:async(...args)=>{trace.push('news');news=args;},saveGame:async()=>{trace.push('saveGame');}
 };
 await originalEnterBattlefield(game,ports,c.input);
 expect({inserted,saved,updates,news,trace,validnum:game.validnum,alivenum:game.alivenum,gamestate:game.gamestate}).toEqual({inserted:c.inserted,saved:c.saved,updates:c.updates,news:c.news,trace:c.trace,validnum:c.validnum,alivenum:c.alivenum,gamestate:c.gamestate});
});
