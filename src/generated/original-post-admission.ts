// Generated from actual source callbacks; see coverage manifest for missing syntax.
import {callbackGet,callbackSet,callbackImport,callbackGlobal,callbackBuiltin,callbackArray,callbackAppend,callbackEnsure,callbackEntries,callbackMethod,phpBinary,phpTruthy,phpNumber,phpString}from "../original-skill-callback-runtime";
import type {OriginalModuleDispatcher}from "../original-module-dispatch";
export function registerOriginalPostAdmission(dispatcher:OriginalModuleDispatcher):void {
// include/modules/core/player/main.php ec5269d6b0a6550f2dcb0cfc30f5e0b31c9929944dfb5505ac2bdbfe7db72f9a
dispatcher.register("player","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/base/skillbase/main.php 6629e8466cc8eddaca4c6575890749e859061c4f8ec21085d5f3f12d36265257
dispatcher.register("skillbase","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skillbase"]);
(await ctx.parent(v["pa"]));
if(phpTruthy(!phpTruthy(!phpTruthy(callbackGet(v["pa"],"skills"))))){for(const [___key,___value]of callbackEntries(callbackGet(v["pa"],"skills"))){v["key"]=___key;v["value"]=___value;if(phpTruthy(callbackBuiltin("defined",[phpBinary(".","MOD_SKILL",v["key"])],ctx))){(await ctx.call("skillbase","skill_acquire",v["key"],v["pa"]));
if(phpTruthy(callbackBuiltin("is_array",[v["value"]],ctx))){for(const [___key,___value]of callbackEntries(v["value"])){v["vk"]=___key;v["vv"]=___value;(await ctx.call("skillbase","skill_setvalue",v["key"],v["vk"],v["vv"],v["pa"]));}}else{if(phpTruthy(phpBinary(">",v["value"],0))){(await ctx.call("skillbase","skill_setvalue",v["key"],"lvl",v["value"],v["pa"]));}}}}}
if(phpTruthy(!phpTruthy(!phpTruthy(callbackGet(v["pa"],"o_card"))))){callbackSet(v["pa"],"card",callbackGet(v["pa"],"o_card"));}
if(phpTruthy(!phpTruthy(!phpTruthy(callbackGet(v["valid_skills"],v["gametype"]))))){for(const [___key,___value]of callbackEntries(callbackGet(v["valid_skills"],v["gametype"]))){v["vsv"]=___value;if(phpTruthy(callbackBuiltin("defined",[phpBinary(".","MOD_SKILL",v["vsv"])],ctx))){(await ctx.call("skillbase","skill_acquire",v["vsv"],v["pa"]));}}}});
// include/modules/extra/card/skills/skill569/main.php 99819fa26de1c34efaca96eb40c36f28e18d005079d404fe32bb46f8292fd087
dispatcher.register("skill569","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.parent(v["pa"]));
callbackImport(v,ctx,["sys","player"]);
if(phpTruthy((await ctx.call("skillbase","skill_query",569,v["pa"])))){if(phpTruthy(phpBinary("<",5,v["validnum"]))){callbackImport(v,ctx,["sys"]);
(v["apid"]=callbackGet(v["pa"],"pid"));
(v["result"]=(await callbackMethod(v["db"],"query",[(phpString("SELECT pid FROM ") + phpString(v["tablepre"]) + phpString("players WHERE type=0 AND hp>0 AND pid != '") + phpString(v["apid"]) + phpString("'"))])));
if(phpTruthy((await callbackMethod(v["db"],"num_rows",[v["result"]])))){(v["list"]=callbackArray([]));
while(phpTruthy((v["r"]=(await callbackMethod(v["db"],"fetch_array",[v["result"]]))))){callbackAppend((v["list"]??=callbackArray([])),callbackGet(v["r"],"pid"));}
for(const [___key,___value]of callbackEntries(v["list"])){v["pdid"]=___value;(v["pdata"]=(await ctx.call("player","fetch_playerdata_by_pid",v["pdid"])));
callbackSet(v["pdata"],"pls",(await ctx.call("map","check_pls",9)));
(v["mvpls_log"]="在你毫无察觉的时候，你的深层无意识似乎被解放了！<br>……<br>等你清醒过来的时候，你发现自己身处于墓地。<br>这是怎么回事呢？<br>");
(await ctx.call("logger","logsave",callbackGet(v["pdata"],"pid"),v["now"],v["mvpls_log"],"s"));
(await ctx.call("player","player_save",v["pdata"]));}
(await ctx.call('sys','addnews',v["now"],"signal_569",callbackGet(v["pa"],"name")));}}
(await ctx.call("skill569","lost569",v["pa"]));}});
// include/modules/extra/card/skills/skill577/main.php 32c61619c3f9ca3a30a5bcc220ad8d66f7a82dd7de68b5fcfa33d2638e8f8c26
dispatcher.register("skill577","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.parent(v["pa"]));
callbackImport(v,ctx,["sys","player"]);
if(phpTruthy((await ctx.call("skillbase","skill_query",577,v["pa"])))){(v["apid"]=callbackGet(v["pa"],"pid"));
(v["result"]=(await callbackMethod(v["db"],"query",[(phpString("SELECT pid FROM ") + phpString(v["tablepre"]) + phpString("players WHERE type=0 AND hp>0 AND pid != '") + phpString(v["apid"]) + phpString("'"))])));
if(phpTruthy((await callbackMethod(v["db"],"num_rows",[v["result"]])))){(v["list"]=callbackArray([]));
while(phpTruthy((v["r"]=(await callbackMethod(v["db"],"fetch_array",[v["result"]]))))){callbackAppend((v["list"]??=callbackArray([])),callbackGet(v["r"],"pid"));}
(v["pdlist"]=callbackArray([]));
for(const [___key,___value]of callbackEntries(v["list"])){v["pdid"]=___value;(v["pdata"]=(await ctx.call("player","fetch_playerdata_by_pid",v["pdid"])));
(await ctx.call("skillbase","skill_acquire",578,v["pdata"]));
(v["bless_log"]="你感到自己受到了来自一位贤者的祝福！<br>");
(await ctx.call("logger","logsave",callbackGet(v["pdata"],"pid"),v["now"],v["bless_log"],"s"));
(await ctx.call("player","player_save",v["pdata"]));}}
(await ctx.call("skill577","lost577",v["pa"]));}});
// include/modules/extra/instance/instance10_rogue/skill952/main.php fbdf7dc509d0c19dbc2dfd6289524c47fecd584cbcfbdb00960da2fe135e9b19
dispatcher.register("skill952","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.parent(v["pa"]));
if(phpTruthy((await ctx.call("skillbase","skill_query",952,v["pa"])))){(await ctx.call("skill952","skill952_sendin_core",callbackArray([["itm","深紫色的技能核心"],["itmk","SC01"],["itme",1],["itms",3],["itmsk",""]]),v["pa"]));
(await ctx.call("skill952","skill952_sendin_core",callbackArray([["itm","橙色的技能核心"],["itmk","SCB2"],["itme",1],["itms",1],["itmsk",""]]),v["pa"]));}});
// include/modules/extra/card/cardbase/main.php 356f4cc1f12e926318c59395c545021adc3ee3d8e6b993bdbb0be30320cf914c
dispatcher.register("cardbase","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","cardbase"]);
(await ctx.parent(v["pa"]));
(v["card"]=callbackGet(v["pa"],"card"));
if(phpTruthy(!phpTruthy(!phpTruthy(callbackGet(callbackGet(callbackGet(v["cards"],v["card"]),"valid"),"gamevars"))))){(v["cgarr"]=callbackGet(callbackGet(callbackGet(v["cards"],v["card"]),"valid"),"gamevars"));
for(const [___key,___value]of callbackEntries(v["cgarr"])){v["cgk"]=___key;v["cgv"]=___value;callbackSet(v["gamevars"],v["cgk"],v["cgv"]);}}
(v["card_data"]=callbackGet((await ctx.call("cardbase","get_cardlist_energy_from_udata",v["cudata"])),2));
if(phpTruthy((phpTruthy(!phpTruthy(!phpTruthy(callbackGet(callbackGet(v["card_data"],v["card"]),"blink")))) && phpTruthy(callbackBuiltin("defined",["MOD_SKILL1003"],ctx))))){(await ctx.call("skillbase","skill_setvalue",1003,"nowcard_blink",callbackGet(callbackGet(v["card_data"],v["card"]),"blink"),v["pa"]));}});
// include/modules/extra/card/skills/skill584/main.php e0071272eca8a1425127a8873bb36211983a100ccda67d18070d2b62c45bf7d6
dispatcher.register("skill584","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.parent(v["pa"]));
callbackImport(v,ctx,["sys","player"]);
if(phpTruthy((await ctx.call("skillbase","skill_query",584,v["pa"])))){callbackSet(v["pa"],"club",17);
(v["arr"]=(await ctx.call("skillbase","get_acquired_skill_array",v["pa"])));
for(const [___key,___value]of callbackEntries(v["arr"])){v["key"]=___value;if(phpTruthy((phpTruthy(callbackBuiltin("defined",[phpBinary(".",phpBinary(".","MOD_SKILL",v["key"]),"_INFO")],ctx)) && phpTruthy((phpTruthy(phpBinary("!==",callbackBuiltin("strpos",[callbackBuiltin("constant",[phpBinary(".",phpBinary(".","MOD_SKILL",v["key"]),"_INFO")],ctx),"club;"],ctx),false)) || phpTruthy(phpBinary("!==",callbackBuiltin("strpos",[callbackBuiltin("constant",[phpBinary(".",phpBinary(".","MOD_SKILL",v["key"]),"_INFO")],ctx),"card;"],ctx),false))))))){(await ctx.call("skillbase","skill_lost",v["key"],v["pa"]));}
(await ctx.call("skillbase","skill_acquire",12,v["pa"]));}}});
// include/modules/extra/club/skills/skill1003/main.php 19ccd41d5d5ae04a3ad04b7ee42a1ee567653d57d7383ef4f5c0a9251aa50dcc
dispatcher.register("skill1003","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_acquire",1003,v["pa"]));
(await ctx.parent(v["pa"]));});
// include/modules/extra/achievement/achievement_base/main.php 4ac7d7a4011ccc608b3df4d303f72a5d1d3e273e0af75d6f5a35948b99297229
dispatcher.register("achievement_base","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.parent(v["pa"]));
callbackImport(v,ctx,["sys","achievement_base"]);
(v["alist"]=callbackArray([]));
for(const [___key,___value]of callbackEntries(v["achlist"])){v["atk"]=___key;v["atv"]=___value;if(phpTruthy(phpBinary("==",1,(await ctx.call("achievement_base","check_achtype_available",v["atk"]))))){(v["alist"]=callbackBuiltin("array_merge",[v["alist"],v["atv"]],ctx));}}
for(const [___key,___value]of callbackEntries(v["alist"])){v["av"]=___value;if(phpTruthy((phpTruthy((phpTruthy((phpTruthy((phpTruthy(!phpTruthy(callbackGet(v["pa"],"type"))) && phpTruthy(!phpTruthy((await ctx.call("skillbase","check_skill_info",v["av"],"global")))))) && phpTruthy((phpTruthy((phpTruthy(!phpTruthy((callbackGet(v["ach_allow_mode"],v["av"])!=null))) && phpTruthy(callbackBuiltin("in_array",[v["gametype"],callbackGet(v["ach_allow_mode"],0)],ctx)))) || phpTruthy((phpTruthy((callbackGet(v["ach_allow_mode"],v["av"])!=null)) && phpTruthy(callbackBuiltin("in_array",[v["gametype"],callbackGet(v["ach_allow_mode"],v["av"])],ctx)))))))) && phpTruthy(!phpTruthy(callbackBuiltin("defined",[phpBinary(".",phpBinary(".","MOD_SKILL",v["av"]),"_ABANDONED")],ctx))))) && phpTruthy(!phpTruthy((await ctx.call("skillbase","skill_query",v["av"],v["pa"]))))))){(await ctx.call("skillbase","skill_acquire",v["av"],v["pa"]));}}});
// include/modules/extra/instance/instance3_ascension/main.php e5e942d2fe1c28841fec4c5c2d5aebb56bbc66e3c1db7e274d4aa96605977dd9
dispatcher.register("instance3","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.parent(v["pa"]));
callbackImport(v,ctx,["sys"]);
if(phpTruthy(phpBinary("==",13,v["gametype"]))){(v["option"]=callbackGet(v["roomvars"],"current_game_option"));
if(phpTruthy((callbackGet(v["option"],"lvl")!=null))){(v["alvl"]=Math.trunc(phpNumber(callbackGet(v["option"],"lvl"))));
if(phpTruthy((await ctx.call("skillbase","skill_query",1003,v["pa"])))){(await ctx.call("skillbase","skill_setvalue",1003,"instance3_lvl",v["alvl"],v["pa"]));}}}});
// include/modules/extra/instance/instance11_observe/main.php 118ef2cc462373db0b4f742bb6e3cd21146e6926d383c762d8e85f27bb1bd7ca
dispatcher.register("instance11","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys"]);
if(phpTruthy(phpBinary("==",21,v["gametype"]))){callbackSet(v["pa"],"pls",101);}
(await ctx.parent(v["pa"]));});
// include/modules/extra/club/skills/skill1006/main.php a2cb7ccc65583e9acc59cd87507e5b37d4817632035b2b7fbd8f2d4d95803991
dispatcher.register("skill1006","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_acquire",1006,v["pa"]));
(await ctx.parent(v["pa"]));});
// include/modules/extra/card/skills/skill714/main.php 1cea0f46c2ddb99a078a5c7a1cce3c56c343cd2a7b07133fd06a3129ceb33d46
dispatcher.register("skill714","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.parent(v["pa"]));
callbackImport(v,ctx,["sys"]);
if(phpTruthy((await ctx.call("skillbase","skill_query",714,v["pa"])))){if(phpTruthy(!phpTruthy(callbackGet(v["gamevars"],"sk714_flag")))){callbackSet(v["gamevars"],"sk714_flag",1);
(await ctx.call('sys','save_gameinfo'));}
(await ctx.call('sys','addnews',0,"skill714",callbackGet(v["pa"],"name")));}});
// include/modules/extra/instance/instance10_rogue/main.php c7951093052626a5cf19d6414d133f2d64fbc0786860bf73ccfa594baa6d2223
dispatcher.register("instance10","post_enterbattlefield_events",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.parent(v["pa"]));
callbackImport(v,ctx,["sys"]);
if(phpTruthy(phpBinary("==",20,v["gametype"]))){(await ctx.call("skill960","get_rand_task",v["pa"],1,3));}});
}
