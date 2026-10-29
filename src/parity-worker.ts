/**
 * Isolated Cloudflare runtime parity probe. NO game actions, database bindings,
 * account data, production routes, or gameplay. Does not claim playability.
 */
import { LEGACY_VQ_POOL } from "./generated/legacy-vq-pool";
import { legacyFatenumCreate, legacyRegisterFatenumCreate, legacyRegisterRandomCreate, legacyRegisterVerificationQuestionGet } from "./original-verification";
import { legacyRegisterPost, legacyRegisterAjaxResponse, type LegacyRegistrationAccount } from "./original-register";
import { legacyDecode } from "./original-protocol";
import {
 originalMapCanEnter,originalMapForbidden,originalMove,originalSearch
} from "./original-explore-map";
import {originalMeetmanRate,originalTrapRealOdds,originalDiscover} from "./original-discovery-chain";
import {originalExploreWithCooldown} from "./original-explore-cooldown";

import {
 originalPlayerPreAct,originalPlayerAct,originalPlayerPostAct,
 originalPlanPlayerSave,originalPlayerSaveSql,originalCommandActDecision,
 type OriginalPlayerActionState
} from "./original-player-action";
import {executeOriginalCommandAct} from "./original-command-pipeline";

import {
  originalTacticAct,originalAttackMultipliers,originalDefenseMultipliers,
  originalTrapDamage,originalCanCounter,originalCanAvoidKillArea,
  originalFindManOdds,originalHideOdds
} from "./original-tactic";
import {
  originalCooldownBegin,originalCooldownBeforeAction,
  originalCooldownPostAct,originalCooldownResponse
} from "./original-cooldown";
const entropyGolden = {"source":"installed original PHP implementation","now":1793242800,"gameUrl":"https://dts.example.invalid/","calendar":"29,10,2026,4","fixtures":[{"kind":"fatenum","seed":"","expected":"41898988427"},{"kind":"fatenum","seed":"abc","expected":"9001509837281772"},{"kind":"fatenum","seed":"中文玩家","expected":"691429653296"},{"kind":"fatenum","seed":"123456789","expected":"25979432116240"},{"kind":"fatenum","seed":"0000","expected":"47141486539"},{"kind":"fatenum","seed":"αβγ123","expected":"329624469674"},{"kind":"fatenum","seed":"  ","expected":"2358110251586"},{"kind":"fatenum","seed":"0000000000","expected":"17081947092"},{"kind":"register","seed":"abc","expected":"2250356479699"},{"kind":"random","min":0,"max":5,"seed":"abc","expected":1},{"kind":"random","min":3,"max":7,"seed":"abc","expected":7},{"kind":"random","min":5,"max":5,"seed":"abc","expected":5},{"kind":"random","min":1,"max":2147483647,"seed":"abc","expected":1941101291},{"kind":"register","seed":"12345","expected":"85611867388399"},{"kind":"random","min":0,"max":5,"seed":"12345","expected":1},{"kind":"random","min":3,"max":7,"seed":"12345","expected":7},{"kind":"random","min":5,"max":5,"seed":"12345","expected":5},{"kind":"random","min":1,"max":2147483647,"seed":"12345","expected":284317098},{"kind":"register","seed":"9876543211234567890","expected":"258987252223"},{"kind":"random","min":0,"max":5,"seed":"9876543211234567890","expected":1},{"kind":"random","min":3,"max":7,"seed":"9876543211234567890","expected":6},{"kind":"random","min":5,"max":5,"seed":"9876543211234567890","expected":5},{"kind":"random","min":1,"max":2147483647,"seed":"9876543211234567890","expected":1289214584}]};
const questionGolden = {"source":"live installed PHP user.func.php and vqpool.php","poolSha256":"da25d7732cd5a6fa6ffb01550fdbdfac3349ee6655142eb31968cc63f9a92899","now":1793242800,"gameUrl":"https://dts.example.invalid/","calendar":"29,10,2026,4","fixtures":[{"seed":"abc","expected":{"question":"如果对方没有发现你，▁▁▁▁以酌情点击","answers":["那么你可","为0时不","复合武器","攻击属性","的“熟练","机未禁地"],"correct_i":0}},{"seed":"12345","expected":{"question":"可以切换到进▁▁▁▁示。","answers":["此两大部","行状况显","戏进行中","后30%","“幻境解","治疗姿态"],"correct_i":1}},{"seed":"9876543211234567890","expected":{"question":"比如，【解牛】技能附加30+对方等级伤害，就是在这个阶▁▁▁▁基础值上。","answers":["后结束本次","段加到终伤","消）生效，","中途离开游","能再任意加"],"correct_i":1}},{"seed":"9","expected":{"question":"如果名字▁▁▁▁正确则无效","answers":["或者头像不","-道具发现","熟练度；使","度，以及对","能通过这个"],"correct_i":0}},{"seed":"hello","expected":{"question":"作为▁▁▁▁文本为主要表现形式的webgame","answers":["：场上","见下方","合成。","一款以","乘到基"],"correct_i":3}},{"seed":"QA-a","expected":{"question":"战斗中，角色每次攻击都可能对敌人某个身体部▁▁▁▁致伤攻击”。","answers":["”和“特","位发出“","行中的画","消音”属","书”或者"],"correct_i":1}},{"seed":"0","expected":{"question":"这里只列出最常▁▁▁▁路线，其他路线或者其他游戏模式的打法也请玩家自行探索。","answers":["再组建或","装备以后","弹”会将","发起方有","见的游戏"],"correct_i":4}},{"seed":"test-registered","expected":{"question":"干扰▁▁▁▁暂时解除禁","answers":["，自己可以","耗1个技能","若干陷阱，","能发现物品","因此请利用","：游戏目标","幻境，用以"],"correct_i":6}}]};
function context(golden: { calendar: string; now: number; gameUrl: string }) {
 const [day,month,year,weekday]=golden.calendar.split(",").map(Number);
 return {nowSeconds:golden.now,gameUrl:golden.gameUrl,day:day!,month:month!,year:year!,weekday:weekday!};
}
function runSelftest() {
 const ctx=context(entropyGolden),qctx=context(questionGolden);
 const errors: string[]=[];
 for(const row of entropyGolden.fixtures) {
   const actual = row.kind==="fatenum"?legacyFatenumCreate(row.seed,10)
    : row.kind==="register"?legacyRegisterFatenumCreate(row.seed,ctx)
    : legacyRegisterRandomCreate(row.min!,row.max!,row.seed,ctx);
   if(actual!==row.expected) errors.push("entropy:"+row.kind+":"+row.seed);
 }
 for(const row of questionGolden.fixtures) {
   const actual=legacyRegisterVerificationQuestionGet(row.seed,LEGACY_VQ_POOL,qctx);
   if(JSON.stringify(actual)!==JSON.stringify(row.expected))errors.push("question:"+row.seed);
 }
 if(LEGACY_VQ_POOL.length!==497)errors.push("pool_size");
 return {pass:errors.length===0,phpSourceFixtureChecks:31,corpusCount:LEGACY_VQ_POOL.length,errors,gamePlayable:false,productionDataAccess:false};
}

/**
 * Execute one self-contained synthetic registration and duplicate request in
 * Cloudflare's real runtime. No D1 binding and no production player data.
 */
async function runRegistrationSelftest() {
 const ctx=context(questionGolden), token="12345";
 const challenge=legacyRegisterVerificationQuestionGet(token,LEGACY_VQ_POOL,ctx);
 const testRecord=new Map<string,LegacyRegistrationAccount>();
 const store={
   async exists(username:string){return testRecord.has(username);},
   async insert(record:LegacyRegistrationAccount){
     if(testRecord.has(record.username))return false;
     testRecord.set(record.username,record);return true;
   }
 };
 const input=new URLSearchParams({
   cmd:"post_register",username:"QA_parity_1029",
   npass:"TestOnlyPass123",rnpass:"TestOnlyPass123",
   register_token:token,vq_answer:String(challenge.correct_i),
   gender:"m",icon:"0",motto:"Testing",
   killmsg:"Fight",lastword:"Bye",
 });
 const env={
   clock:ctx,sourceIp:"127.0.0.1",cookiePrefix:"acbra2_",
   cookiePath:"/",secureCookies:true,bannedNames:null,bannedIp:null,
   authenticated:false
 };
 const first=await legacyRegisterPost(input,env,store);
 const second=await legacyRegisterPost(input,env,store);
 const response=await legacyRegisterAjaxResponse(first);
 const decoded=await legacyDecode<{innerHTML:{info:string};value:{register_token:string}}>(await response.text());
 const original=testRecord.get("QA_parity_1029");
 const pass=first.kind==="ajax"&&first.created&&first.cookies.length===2&&
   second.kind==="ajax"&&!second.created&&second.cookies.length===0&&
   testRecord.size===1&&original?.groupid===1&&original?.gold===100&&
   decoded.innerHTML.info==="注册成功！请返回首页登陆游戏。"&&
   decoded.value.register_token.length>0&&response.status===200;
 return {pass,backend:"TypeScript",runtime:"Cloudflare Workers",
   syntheticAccountOnly:true,productionDataAccess:false,
   registrationPost:pass?"passed":"failed",
   encodedLegacyClientResponse:decoded.innerHTML.info==="注册成功！请返回首页登陆游戏。",
   atomicDuplicateCheck:second.kind==="ajax"&&!second.created,
   originalInitialGold:original?.gold??null,
   noDatabaseBinding:true};
}

/** Source-checked game mechanics running directly on isolated Cloudflare Workers. */
function runGameplaySelftest() {
  const errors:string[]=[];
  function check(condition:boolean,label:string){if(!condition)errors.push(label);}
  const tac=originalTacticAct({mode:"special",command:"tac3",tactic:2,log:""});
  check(tac.handled && tac.state.tactic===3 && tac.state.mode==="command","tactic_switch");
  check(tac.state.log==='应战策略变为<span class="yellow b">重视反击</span>。<br> ',"tactic_original_html");
  check(JSON.stringify(originalAttackMultipliers([1.1,0.7],3))===JSON.stringify([1.25,1.1,0.7]),"attack_multipliers");
  check(JSON.stringify(originalDefenseMultipliers([0.9,1.7],2))===JSON.stringify([1.5,0.9,1.7]),"defense_multipliers");
  check(!originalCanCounter(4,true),"avoid_tactic_no_counter");
  check(originalCanAvoidKillArea(39,4,false) && !originalCanAvoidKillArea(40,4,false),"avoid_killarea_threshold");
  check(originalFindManOdds(21,4)===6 && originalHideOdds(21,4)===46,"encounter_hide");
  check(originalTrapDamage(10,2,74)===8 && originalTrapDamage(10,2,75)===10,"trap_75_percent");
  const initial=originalCooldownBegin(0,0);
  const prepared=originalCooldownBeforeAction(initial,"move",2000);
  check(!prepared.blocked && prepared.state.cmdcdtime===650,"move_cd_650ms");
  const posted=originalCooldownPostAct(prepared.state,1500.9,1777.4);
  check(posted.cdsec===2 && posted.cdmsec===150 && posted.rmcdtime===373,"cooldown_page_start_anchoring");
  const response=originalCooldownResponse(posted,1777.4,100);
  check(response.timer===373 && response.log.includes('demiSecTimerStarter(373)'),"original_cooldown_response");
  const blocked=originalCooldownBeforeAction(posted,"search",1777.4);
  check(blocked.blocked && blocked.state.mode==="command","blocked_action_cannot_execute");
  return {
    pass:errors.length===0,source:"installed original PHP tactic + cooldown",
    runtime:"Cloudflare Workers",mechanics:"tactic/cooldown",
    syntheticOnly:true,productionDataAccess:false,
    gamePlayable:false,checks:12,errors
  };
}

async function runPlayerPipelineSelftest() {
 const errors:string[]=[];
 const phases:string[]=[];
 const expect=(ok:boolean,label:string)=>{if(!ok)errors.push(label);};
 type SyntheticPlayer=OriginalPlayerActionState & {pid:number;name:string;type:number};
 const player:SyntheticPlayer={
   pid:7,name:"QaPlayerA",type:0,hp:80,state:2,playerDeadFlag:0,
   mode:"command",command:"special",spCmd:"special",
   motto:"old",killmsg:"old",lastword:"old"
 };
 const result=await executeOriginalCommandAct(20,player,{
  initPlayerData(s){phases.push("init");return s;},
  preAct(s){phases.push("pre");return originalPlayerPreAct(s);},
  getActionFields(s){return {hp:s.hp,state:s.state};},
  act(s){phases.push("act");return originalPlayerAct(s);},
  postAct(s){phases.push("post");return originalPlayerPostAct(s,{motto:"签名",killmsg:"击败",lastword:"遗言"});},
  prepareResponse(s){phases.push("prepare");return {mode:s.mode,log:"原版测试"};},
  parseProfile(_s,r){phases.push("profile");return r;},
  parseGameInfo(_s,r){phases.push("gameinfo");return r;},
  encodeResponse(r){phases.push("encode");return JSON.stringify(r);},
  emitResponse(_r){phases.push("emit");},
  updateSdata(s){phases.push("update");return s;},
  beforeLastSave(s){phases.push("before_save");return s;},
  savePlayer(_s){phases.push("save");},
 });
 const expectedPhases=["init","pre","act","post","prepare","profile","gameinfo",
  "encode","emit","update","before_save","save"];
 expect(JSON.stringify(phases)===JSON.stringify(expectedPhases),"source_phase_order");
 expect(result.acted&&result.state.mode==="special","command_special");
 expect(result.state.motto==="签名"&&result.state.killmsg==="击败"&&result.state.lastword==="遗言","postact_account_words");
 expect(result.encoded===JSON.stringify({mode:"special",log:"原版测试"}),"response_serialization_phase");
 const planned=originalPlanPlayerSave(
  {pid:7,type:0,name:"QaPlayerA",hp:0,player_dead_flag:0,motto:"签名"},
  ["pid","type","name","hp","player_dead_flag","motto"],
  {pid:7,type:0,name:"QaPlayerA",hp:80,player_dead_flag:0,motto:"old"}
 );
 const update=originalPlayerSaveSql("s8_players",planned,
   ["pid","type","name","hp","player_dead_flag","motto"]);
 expect(planned.changes.player_dead_flag===1&&planned.nextPool?.player_dead_flag===1,"dead_flag_one_way");
 expect(Boolean(update?.sql.includes('acfun_legacy.mysql_username_weight_key("name")')),"legacy_name_guard");
 expect(update?.args.at(-1)==="005100410050004c00410059004500520041","source_collation_parameter");
 const dead=originalPlayerPreAct({...player,hp:100,playerDeadFlag:1});
 expect(!originalCommandActDecision("Qa","hash",true,20,dead.hp,dead.state).kind.includes("redirect")&&dead.hp===0,"death_pre_act");
 expect(originalCommandActDecision(null,null,false,20,100,2).kind==="no_login","no_login_gate");
 return {pass:errors.length===0,syntheticOnly:true,productionDataAccess:false,
  gamePlayable:false,verifiedStages:expectedPhases.length,checks:9,
  backend:"TypeScript",runtime:"Cloudflare Workers",errors};
}

async function runExploreSourceSelftest(){
 const errors:string[]=[];
 const ok=(test:boolean,label:string)=>{if(!test)errors.push(label);};
 const map={arealist:[2,0,1,3,4],areanum:1,areaadd:2,hack:false,
   plsinfo:{"0":"校门","1":"公园","2":"学园","3":"废墟","4":"码头"},
   areainfo:{"0":"起点区域","1":"庭园区域","2":"学园区域","3":"废墟区域","4":"港口区域"}};
 ok(originalMapForbidden(map,"2"),"forbidden_src_order");
 ok(!originalMapCanEnter(map,"2"),"forbid_check");
 ok(originalMapCanEnter({...map,hack:true},"2"),"hack_override");
 const person={pls:0,sp:40,hp:100,pose:0,command:"move",mode:"command",log:""};
 const move=await originalExploreWithCooldown({
  player:person,cooldown:originalCooldownBegin(0,0),map,
  action:"move",destination:"3",pageStartMs:1500.9,nowMs:1777.4,
  discovery:{random99:()=>99}
 });
 ok(move.accepted && move.player.sp===25 && String(move.player.pls)==="3","move_sp_and_destination");
 ok(move.discovery?.stage==="empty" && move.player.log.includes("但是什么都没有发现。"),"discover_empty_original_log");
 ok(move.cooldown.cdsec===2&&move.cooldown.cdmsec===150&&move.cooldown.rmcdtime===373,"move_650ms_cooldown");
 const noSp=await originalExploreWithCooldown({
  player:{...person,sp:15,command:"search"},cooldown:originalCooldownBegin(0,0),
  map,action:"search",pageStartMs:1500.9,nowMs:1777.4,
  discovery:{random99:()=>{throw new Error("No discovery when SP insufficient")}}
 });
 ok(!noSp.accepted && noSp.player.sp===15 && noSp.cooldown.cmdcdtime===650,"search_sp_boundary_and_cooldown");
 ok(originalMeetmanRate("search",0)===50&&originalMeetmanRate("move",2)===46,"meetman_source_rates");
 ok(originalTrapRealOdds(10)===4,"trap_source_025_per_count");
 const event=await originalDiscover(
  {...person,mode:"search"},"search",{
   random99:()=>0,
   eventMain:s=>({state:{...s,log:"EVENT"},occurred:true})
  });
 ok(event.stoppedAt==="event"&&event.state.mode==="command","event_interrupts");
 const trap=await originalDiscover(
  {...person,mode:"search"},"search",{
   random99:(()=>{const vals=[99,0];return ()=>vals.shift()??99})(),
   trapCheck:s=>({state:{...s,log:"TRAP"},triggered:true})
  });
 ok(trap.stoppedAt==="trap"&&trap.invokedStages.length===2,"trap_interrupts");
 const item=await originalDiscover(
  {...person,mode:"search"},"search",{
   random99:(()=>{const vals=[99,99,99,0];return ()=>vals.shift()??99})(),
   discoverItem:s=>({state:{...s,log:"ITEM"},found:true})
  });
 ok(item.stoppedAt==="itemmain"&&item.discovered,"item_stage");
 return {pass:errors.length===0,backend:"TypeScript",runtime:"Cloudflare Workers",
  source:"original PHP explore/map/event/trap/metman/itemmain base order",
  checks:12,syntheticOnly:true,productionDataAccess:false,gamePlayable:false,errors};
}

addEventListener("fetch",(event: FetchEvent)=>{
 const u=new URL(event.request.url);
 if(event.request.method==="GET" && u.pathname==="/__explore_selftest") {
  event.respondWith(runExploreSourceSelftest().then(r=>new Response(JSON.stringify(r),{
   status:r.pass?200:500,headers:{"content-type":"application/json;charset=utf-8","cache-control":"no-store"}
  })));
  return;
 }
 if(event.request.method==="GET" && u.pathname==="/__player_pipeline_selftest") {
   event.respondWith(runPlayerPipelineSelftest().then(r=>
    new Response(JSON.stringify(r),{status:r.pass?200:500,headers:{"content-type":"application/json;charset=utf-8","cache-control":"no-store"}})));
   return;
 }
 if(event.request.method==="GET" && u.pathname==="/__gameplay_selftest") {
   const r=runGameplaySelftest();
   event.respondWith(new Response(JSON.stringify(r),{status:r.pass?200:500,headers:{"content-type":"application/json;charset=utf-8","cache-control":"no-store"}}));
   return;
 }
 if(event.request.method==="GET" && u.pathname==="/__register_selftest") {
   event.respondWith(runRegistrationSelftest().then(r=>new Response(JSON.stringify(r),{status:r.pass?200:500,headers:{"content-type":"application/json;charset=utf-8","cache-control":"no-store"}})));
   return;
 }
 if(event.request.method!=="GET" || u.pathname!=="/__selftest") {
   event.respondWith(new Response("ACFUN DTS isolated parity QA only; not a playable game.",{status:404,headers:{"content-type":"text/plain;charset=utf-8"}}));
   return;
 }
 const result=runSelftest();
 event.respondWith(new Response(JSON.stringify(result),{status:result.pass?200:500,headers:{"content-type":"application/json;charset=utf-8","cache-control":"no-store"}}));
});