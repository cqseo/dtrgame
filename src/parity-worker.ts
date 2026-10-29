/**
 * Isolated Cloudflare runtime parity probe. NO game actions, database bindings,
 * account data, production routes, or gameplay. Does not claim playability.
 */
import { LEGACY_VQ_POOL } from "./generated/legacy-vq-pool";
import { legacyFatenumCreate, legacyRegisterFatenumCreate, legacyRegisterRandomCreate, legacyRegisterVerificationQuestionGet } from "./original-verification";
const entropyGolden = {"source":"installed original PHP implementation","now":1793242800,"gameUrl":"https://dts.example.invalid/","calendar":"29,10,2026,4","fixtures":[{"kind":"fatenum","seed":"","expected":"41898988427"},{"kind":"fatenum","seed":"abc","expected":"9001509837281772"},{"kind":"fatenum","seed":"中文玩家","expected":"691429653296"},{"kind":"fatenum","seed":"123456789","expected":"25979432116240"},{"kind":"fatenum","seed":"0000","expected":"47141486539"},{"kind":"fatenum","seed":"αβγ123","expected":"329624469674"},{"kind":"fatenum","seed":"  ","expected":"2358110251586"},{"kind":"fatenum","seed":"0000000000","expected":"17081947092"},{"kind":"register","seed":"abc","expected":"2250356479699"},{"kind":"random","min":0,"max":5,"seed":"abc","expected":1},{"kind":"random","min":3,"max":7,"seed":"abc","expected":7},{"kind":"random","min":5,"max":5,"seed":"abc","expected":5},{"kind":"random","min":1,"max":2147483647,"seed":"abc","expected":1941101291},{"kind":"register","seed":"12345","expected":"85611867388399"},{"kind":"random","min":0,"max":5,"seed":"12345","expected":1},{"kind":"random","min":3,"max":7,"seed":"12345","expected":7},{"kind":"random","min":5,"max":5,"seed":"12345","expected":5},{"kind":"random","min":1,"max":2147483647,"seed":"12345","expected":284317098},{"kind":"register","seed":"9876543211234567890","expected":"258987252223"},{"kind":"random","min":0,"max":5,"seed":"9876543211234567890","expected":1},{"kind":"random","min":3,"max":7,"seed":"9876543211234567890","expected":6},{"kind":"random","min":5,"max":5,"seed":"9876543211234567890","expected":5},{"kind":"random","min":1,"max":2147483647,"seed":"9876543211234567890","expected":1289214584}]};
const questionGolden = {"source":"live installed PHP user.func.php and vqpool.php","poolSha256":"da25d7732cd5a6fa6ffb01550fdbdfac3349ee6655142eb31968cc63f9a92899","now":1793242800,"gameUrl":"https://dts.example.invalid/","calendar":"29,10,2026,4","fixtures":[{"seed":"abc","expected":{"question":"如果对方没有发现你，▁▁▁▁以酌情点击","answers":["那么你可","为0时不","复合武器","攻击属性","的“熟练","机未禁地"],"correct_i":0}},{"seed":"12345","expected":{"question":"可以切换到进▁▁▁▁示。","answers":["此两大部","行状况显","戏进行中","后30%","“幻境解","治疗姿态"],"correct_i":1}},{"seed":"9876543211234567890","expected":{"question":"比如，【解牛】技能附加30+对方等级伤害，就是在这个阶▁▁▁▁基础值上。","answers":["后结束本次","段加到终伤","消）生效，","中途离开游","能再任意加"],"correct_i":1}},{"seed":"9","expected":{"question":"如果名字▁▁▁▁正确则无效","answers":["或者头像不","-道具发现","熟练度；使","度，以及对","能通过这个"],"correct_i":0}},{"seed":"hello","expected":{"question":"作为▁▁▁▁文本为主要表现形式的webgame","answers":["：场上","见下方","合成。","一款以","乘到基"],"correct_i":3}},{"seed":"QA-a","expected":{"question":"战斗中，角色每次攻击都可能对敌人某个身体部▁▁▁▁致伤攻击”。","answers":["”和“特","位发出“","行中的画","消音”属","书”或者"],"correct_i":1}},{"seed":"0","expected":{"question":"这里只列出最常▁▁▁▁路线，其他路线或者其他游戏模式的打法也请玩家自行探索。","answers":["再组建或","装备以后","弹”会将","发起方有","见的游戏"],"correct_i":4}},{"seed":"test-registered","expected":{"question":"干扰▁▁▁▁暂时解除禁","answers":["，自己可以","耗1个技能","若干陷阱，","能发现物品","因此请利用","：游戏目标","幻境，用以"],"correct_i":6}}]};
function context(golden: typeof entropyGolden) {
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
addEventListener("fetch",(event: FetchEvent)=>{
 const u=new URL(event.request.url);
 if(event.request.method!=="GET" || u.pathname!=="/__selftest") {
   event.respondWith(new Response("ACFUN DTS isolated parity QA only; not a playable game.",{status:404,headers:{"content-type":"text/plain;charset=utf-8"}}));
   return;
 }
 const result=runSelftest();
 event.respondWith(new Response(JSON.stringify(result),{status:result.pass?200:500,headers:{"content-type":"application/json;charset=utf-8","cache-control":"no-store"}}));
});
