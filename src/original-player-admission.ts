import {legacyStoredPassword} from './original-auth';
import {phpTruthy,phpNumber,phpString} from './original-template-runtime';
export type OriginalAdmissionData=Record<string,unknown>;
export interface OriginalAdmissionAccount extends OriginalAdmissionData {
 username:string;password:string;groupid:number;motto:string;killmsg:string;lastword:string;
}
export interface OriginalAdmissionGame {
 now:number;validnum:number;alivenum:number;hplimit:number;splimit:number;
 gamestate:number;gamenum:number;validlimit:number;roomPrefix:string;gamefounder:string;
 currentUsername:string;currentAccount:OriginalAdmissionAccount;
 roomvars:Record<string,unknown>;
}
export interface OriginalAdmissionPorts {
 loadGame():Promise<void>;
 safeSpawnPlaces():Promise<number[]>;
 chooseSpawn(places:readonly number[]):number;
 randomIcon(gender:'m'|'f'):Promise<number>;
 randomInt(min:number,max:number):number;
 areaWave():Promise<number>;
 initialItems(player:OriginalAdmissionData):Promise<OriginalAdmissionData>;
 account(username:string):Promise<OriginalAdmissionAccount|null>;
 cardModuleEnabled:boolean;
 chooseCard(card:number):Promise<number>;
 applyCard(player:OriginalAdmissionData,card:number):Promise<[OriginalAdmissionData,Record<string,unknown>,string]>;
 forbidden(place:number):Promise<boolean>;
 allPlaces():Promise<number[]>;
 insertPlayer(player:OriginalAdmissionData):Promise<void>;
 cardOwned(card:number,account:OriginalAdmissionAccount):Promise<boolean>;
 updateAccount(username:string,changes:OriginalAdmissionData):Promise<void>;
 fetchPlayer(username:string):Promise<OriginalAdmissionData>;
 postEnter(player:OriginalAdmissionData):Promise<void>;
 savePlayer(player:OriginalAdmissionData):Promise<void>;
 displayIdentity(player:OriginalAdmissionData):Promise<[string,string]>;
 news(now:number,type:'newgm'|'newpc',name:string,identity:string):Promise<void>;
 saveGame():Promise<void>;
}
/** Full source enter_battlefield orchestration; caller owns the room transaction.
 * Every inherited effect is mandatory. No default identity/stub implementation.
 */
export async function originalEnterBattlefield(game:OriginalAdmissionGame,ports:OriginalAdmissionPorts,input:{username:string;password:string;gender:string;icon:number;card:number;ip:string}):Promise<OriginalAdmissionData|null>{
 await ports.loadGame();
 const safe=await ports.safeSpawnPlaces();if(!safe.length)throw new Error('当前地图暂无安全出生地点，请稍后再试。');
 const chosen=ports.chooseSpawn(safe);if(!safe.includes(chosen))throw new Error('Spawn RNG returned a non-source location');
 const gender=input.gender==='f'?'f':'m';game.validnum++;game.alivenum++;
 let p:OriginalAdmissionData={name:input.username,pass:legacyStoredPassword(input.username,input.password),gd:gender,
   icon:input.icon||await ports.randomIcon(gender),type:0,endtime:game.now,validtime:game.now,sNo:game.validnum,ip:input.ip,
   hp:game.hplimit,mhp:game.hplimit,sp:game.splimit,msp:game.splimit,ss:0,mss:0};
 const roll=ports.randomInt(0,15);if(!Number.isInteger(roll)||roll<0||roll>15)throw new Error('Source admission RNG range violated');
 Object.assign(p,{att:95+roll,def:105-roll,pls:chosen,killnum:0,npckillnum:0,lvl:0,exp:0,skillpoint:0,money:20,rage:0,pose:3,tactic:2,club:0,state:0,wp:0,wk:0,wc:0,wg:0,wd:0,wf:0,inf:'',teamID:'',teamPass:''});
 for(const slot of ['wep','arb','arh','ara','arf','art']){p[slot]=p[slot+'k']=p[slot+'sk']='';p[slot+'e']=p[slot+'s']=0;}
 // Source's itm0..itm6 loop initializes local variables, not eb_pdata. Preserve
 // database-default semantics; inventory hooks explicitly populate used slots.
 p.exp=await ports.areaWave()*80;p=await ports.initialItems(p);
 const account=input.username===game.currentUsername?game.currentAccount:await ports.account(input.username);
 if(!account)return null;
 Object.assign(p,{motto:account.motto,killmsg:account.killmsg,lastword:account.lastword});
 if(input.username===game.gamefounder||account.groupid>=5)Object.assign(p,{arf:'权限狗的ID卡',arfk:'Z',arfe:1,arfs:1,arfsk:''});
 else if(input.username==='霜火协奏曲')Object.assign(p,{art:'击败思念的纹章',artk:'A',arte:1,arts:1,artsk:'zZ'});
 else if(input.username==='时期')Object.assign(p,{art:'击败鬼畜级思念的纹章',artk:'A',arte:1,arts:1,artsk:'zZ'});
 else if(['枪毙的某神','精灵们的手指舞'].includes(input.username))Object.assign(p,{art:'TDG地雷的证明',artk:'A',arte:1,arts:1,artsk:'zZ'});
 let card=input.card,skills:Record<string,unknown>={},prefix='',originalCard:unknown;
 if(ports.cardModuleEnabled){
   card=await ports.chooseCard(card);
   const options=game.roomvars.current_game_option as Record<string,unknown>|undefined;if(options?.['special-rule']==='4000lp')card=154;
   [p,skills,prefix]=await ports.applyCard(p,card);
   if(phpTruthy(p.o_card)){originalCard=p.o_card;delete p.o_card;delete p.cardchange;}
 }
 delete p.gamevars;
 async function repairSpawn(target:OriginalAdmissionData):Promise<void>{const place=phpNumber(target.pls);if(await ports.forbidden(place)||!(await ports.allPlaces()).includes(place))target.pls=chosen;}
 await repairSpawn(p);await ports.insertPlayer(p);
 const changes:OriginalAdmissionData={lastgame:game.roomPrefix?game.roomPrefix.slice(0,1)+game.gamenum:game.gamenum};
 const updateCard=phpTruthy(originalCard)?phpNumber(originalCard):card;
 if(updateCard&&await ports.cardOwned(updateCard,account))changes.card=updateCard;
 await ports.updateAccount(input.username,changes);
 const saved=await ports.fetchPlayer(input.username);if(phpTruthy(skills))saved.skills=skills;if(phpTruthy(originalCard))saved.o_card=originalCard;
 await ports.postEnter(saved);await repairSpawn(saved);await ports.savePlayer(saved);
 const [name,identity]=await ports.displayIdentity(saved);
 const gm=game.gamestate>=30&&(account.groupid>=6||input.username===game.gamefounder);
 await ports.news(game.now,gm?'newgm':'newpc',prefix+' '+name,identity);
 if(game.validnum>=game.validlimit&&game.gamestate===20)game.gamestate=30;
 await ports.saveGame();return saved;
}
