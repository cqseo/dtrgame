// Generated from actual source callbacks; see coverage manifest for missing syntax.
import {callbackGet,callbackSet,callbackImport,callbackGlobal,callbackBuiltin,callbackArray,callbackAppend,callbackEnsure,callbackEntries,callbackMethod,phpBinary,phpTruthy,phpNumber,phpString}from "../original-skill-callback-runtime";
import type {OriginalModuleDispatcher}from "../original-module-dispatch";
export function registerOriginalSkillCallbacks(dispatcher:OriginalModuleDispatcher):void {
// include/modules/base/skills/skill4/main.php d63a626e41c662b3c4bd921d85a3fdf8135b5c4d5ffb9ac9e6ca9174855b25cd
dispatcher.register("skill4","acquire4",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/base/skills/skill4/main.php c3d55e251a6e4608a0c53b825605d86980f9943d31082a168f43fe403a599dd7
dispatcher.register("skill4","lost4",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/base/skills/skill2/main.php 59d2eed797466ad6a6d66cd2edde3a7af1bc3a747206423e5afda97391fc2a06
dispatcher.register("skill2","acquire2",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/base/skills/skill2/main.php b1c1dd487005bb9046a2edbc7f74046f3b9e45b3111840c701546d1aaa65cd13
dispatcher.register("skill2","lost2",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/base/skills/skill3/main.php e3f8ba6f4ab07f2b84c8aaff13b44495478d21cdba4eb7e6119776b154e4eb91
dispatcher.register("skill3","acquire3",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/base/skills/skill3/main.php e0f90c6a6a1500ae5bc4932dacf8984f9431be9bb3fb75306428d7a1a64231b7
dispatcher.register("skill3","lost3",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill21/main.php 4dd383c218e09da4be9cd9ab41180fc37e53a064893f5f15a4887bc969221596
dispatcher.register("skill21","acquire21",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill21/main.php 1e5b91c594e7337f710749d0d436795e3264defff1a1a004e5d1d7a3b5b32319
dispatcher.register("skill21","lost21",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill533/main.php 8dcc195da8f04ced94612c5ed57485d3b207375a4f6a113c13f7a88cf2d3b101
dispatcher.register("skill533","acquire533",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill533/main.php 36fa1f189256a9d2ab4f3f458c498a4fcae15a7bb1abdb799bcc686f26d4c818
dispatcher.register("skill533","lost533",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill11/main.php 451a87cdecfd986d8b7531d962d6a74c8a4d2d3b24aed74c07f24b124b37bb16
dispatcher.register("skill11","acquire11",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill11/main.php 12f8f5f7bc48cc35d0fa6fa5dcdec1e2c5f28ebc46d3cf15f4b21d18ae89fc28
dispatcher.register("skill11","lost11",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill10/main.php dcfa74ed8aecf93487b719ddc07aacca13e2159c4c0d7471318b845b13de8053
dispatcher.register("skill10","acquire10",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill10/main.php 8a931d11ab812f67c9b72f43e4136c26108333e105c71756d9e27b2598f3bfc5
dispatcher.register("skill10","lost10",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill305/main.php aafe203abca822ac3b5ecc801fdd39e3211fe8aaa6d4ba940575827d4f1d50b0
dispatcher.register("skill305","acquire305",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",305,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill305/main.php 71233b6649e6e4ca020ef370683dba1c68f035ab8a5dc54861e96514de927b45
dispatcher.register("skill305","lost305",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill306/main.php c04cdcdd24d0008bdc0d98486c9c9a02c05c80ba8c24b2feb35d9cfb5a457b75
dispatcher.register("skill306","acquire306",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",306,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill306/main.php b49cdd3c7d52303f5bb6af78000bfac93ba75444789208dd8dbec34d4b50a06e
dispatcher.register("skill306","lost306",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill324/main.php 7100ce3978b52a8e11142aea1845333dc0cf1f2b453fe59417c88ab25a310e98
dispatcher.register("skill324","acquire324",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill324/main.php c9929966b125057147dd79d55917c055bef4d13a47a3d865e4523e746553ad8f
dispatcher.register("skill324","lost324",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/activities/nationalday2017/skill328/main.php d874f90b095656491705aaa16a3956bd41256ab94472b8b2b4edef76e956b36c
dispatcher.register("skill328","acquire328",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",328,"cnt","0",v["pa"]));});
// include/modules/extra/activities/nationalday2017/skill328/main.php da792ab2300d69542e5c6223cc883cee6feee7ccf2be3caeb8b50a9674e3fa37
dispatcher.register("skill328","lost328",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",328,"cnt",v["pa"]));});
// include/modules/extra/activities/halloween2017/skill330/main.php 6e3fc94fbdd20fd3f692e2e41b7dccbcb89d48a9a53d51391190cf3d14b35e0e
dispatcher.register("skill330","acquire330",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",330,"cnt","0",v["pa"]));});
// include/modules/extra/activities/halloween2017/skill330/main.php ecef70b8158c123039858ee599f063d31fe40512c1daa3fecbe0a1d1d33259cf
dispatcher.register("skill330","lost330",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",330,"cnt",v["pa"]));});
// include/modules/extra/card/skills/skill411/main.php 94410e903545fc92f9507367286700cfbbf71a34b82dd8ae9382e8299029b7a8
dispatcher.register("skill411","acquire411",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill411/main.php 8a4d64152e74a0ae703bc6eee094042c50e478b8dbece373bc5d4b283f7891b8
dispatcher.register("skill411","lost411",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill413/main.php b0808b8abab7b38f6d7eac9da81869acebf74814c0b53d0f91ee09fb31e242fb
dispatcher.register("skill413","acquire413",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill413/main.php 5523d999903a9a33bc4d704f0396002f5334cfb4b799dbd22276ea5d5bd13f8b
dispatcher.register("skill413","lost413",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill308/main.php 1acf5324726e153e1a9c8eca1fb9665113beb4350c5a87a3cb6f2451230b5890
dispatcher.register("skill308","acquire308",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",308,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill308/main.php 4bc45f2cc484a6a2ce4657c82ce30d824910a8eff43da87a2850abeec9fafcc2
dispatcher.register("skill308","lost308",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill309/main.php 36941cd2dc6111ac8daef7197239d17ba013b6d78c2eef728f8f8487c7f5df60
dispatcher.register("skill309","acquire309",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",309,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill309/main.php eb47792ab84d05a3b103b2498d8beaeeab8f91e6fd033c3b1e4bf527e4393e4b
dispatcher.register("skill309","lost309",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill317/main.php c357195174fe70164f13be7a9557c6ca3f90f1c9f7eceaa2e4b8883143ca6fe9
dispatcher.register("skill317","acquire317",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",317,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill317/main.php 82c785dc28501dbb5c3b5932343ca6698eed94f663d8125095cd607fc6dc985c
dispatcher.register("skill317","lost317",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill319/main.php 7ec288c7f92c8461c84231f421c70fcd9763f0b8c63aed1486868f46ca44ae7a
dispatcher.register("skill319","acquire319",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",319,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill319/main.php d656a62bc5cc7d14db0128c9fe4694682926010c6650c1c144dbfa03b57cda97
dispatcher.register("skill319","lost319",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill320/main.php 9b6eafb61d26d3b6b63924b4c8928f39ec40d2537821b9663edd69708902085b
dispatcher.register("skill320","acquire320",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",320,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill320/main.php 53f984e9e43d94027e4627a1289c5467b8ab769320529829fc126fd199f59cd5
dispatcher.register("skill320","lost320",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill431/main.php 3726160d14345064c3b7d2842b83804605ee0d8bd7bee47e251ef936caf96b45
dispatcher.register("skill431","acquire431",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill431/main.php ebc62615ebc94171d3713dfc4f8929b557f4732ab9ca0ecd639eb7fd142241ba
dispatcher.register("skill431","lost431",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill22/main.php 71371013e5a9071aeebe847974d9350aa9c81e7683185d1719ed3939eae9218d
dispatcher.register("skill22","acquire22",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill22/main.php a20cfc5e37b5604e1792734406a5c8bd68059904a7c1cd7a2771522f6181807a
dispatcher.register("skill22","lost22",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill316/main.php b6a9ba07e9c202be07a7e1057f3eece2228a8b3e2a68fb07829b7c8e9f1bd5f4
dispatcher.register("skill316","acquire316",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",316,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill316/main.php 187472233e7c8d4c7aedddf3ee655d54059e52c4e5978e3f2e3adc01628a8217
dispatcher.register("skill316","lost316",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill321/main.php 4f45f3a1d62cab1e7c4ec51d0bfd4e9a57c2cf28d6e9a1d461e414ef6328496a
dispatcher.register("skill321","acquire321",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",321,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill321/main.php 1096170dd0fe31d94cda0158f3b1e280c4b6ce8ecb2c82f37b1c557b83221cc1
dispatcher.register("skill321","lost321",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill310/main.php 81a1a2acbe4a77ac019bbd508474800bc8c06e2944539eb6a6b1ac18d5744344
dispatcher.register("skill310","acquire310",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",310,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill310/main.php a735ce1da44afb63c69aa2dee24aabe7738a360505bbe6c135df39bd553b63d9
dispatcher.register("skill310","lost310",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill311/main.php bd895ec25322ef42d85e20fd5cedf89d0a164335ac0ca33233dc4b4c01f6badc
dispatcher.register("skill311","acquire311",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",311,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill311/main.php 0accaacca61018221e2bd26c11ce87ed66c8bf200195d6db1a25f32b3ad28b55
dispatcher.register("skill311","lost311",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill312/main.php 306be2e63e199a277aa7b513ab51b55626bb2628cb9320fc52ac6e1c37fae2de
dispatcher.register("skill312","acquire312",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",312,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill312/main.php 6c088b3d98f6f5ffe76db598d3fc9a88ff20934186002040b205590e686029e1
dispatcher.register("skill312","lost312",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill314/main.php 57ec82a50b100238612ead4a6831adc0f7dd4da1c15e3e0ee7913d676cca8482
dispatcher.register("skill314","acquire314",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",314,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill314/main.php 147cd9e62c8d3d7febd8d384fb47b9f8bfcb186aa2c44fbd9f7bdf79596d4e92
dispatcher.register("skill314","lost314",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill443/main.php 6ee3fce34666e22d376335f398133e11a7f5968a85f5f3b86d6decf3935dbebb
dispatcher.register("skill443","acquire443",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill443/main.php c54427e73a1da9991f79f838b414b0ef1bf979fe7019a9f0004765039cb85e20
dispatcher.register("skill443","lost443",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill477/main.php f0dc889f95fc028e5e13febee48074470c5fe8a2b978ada169f8f0f98fe842ce
dispatcher.register("skill477","acquire477",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill477/main.php 013696b15bfd55a7ed6ac3b76682c2b141700f9d649c02d8229415b32536df36
dispatcher.register("skill477","lost477",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill479/main.php 01adbd83321a5405805861f8f59c3e7316f07e4927dfc1b0b7b4de5121f2da09
dispatcher.register("skill479","acquire479",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill479/main.php 1353827d4782bba1486e149114bc2586395bd763aa04bec2907b7182c3610dc6
dispatcher.register("skill479","lost479",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/activities/nationalday2017/skill327/main.php 0a3c5f29264915facbbceeb6b2d01b4ae0d1d1d96502fa47436dc845bd4c7550
dispatcher.register("skill327","acquire327",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",327,"cnt","0",v["pa"]));});
// include/modules/extra/activities/nationalday2017/skill327/main.php 44a66026ee6010496eee5f54c6de0089e65c49e4cfb87401d323876347df5c8a
dispatcher.register("skill327","lost327",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",327,"cnt",v["pa"]));});
// include/modules/extra/card/skills/skill437/main.php 37ac129c0568c9963a1b4f0c53706287699df85a4c20017bcd941bd67d391c99
dispatcher.register("skill437","acquire437",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill437/main.php 8de909ae144a44ca9ccfbb1f8f5dd14b96d7a4bcadb338efe909d17f6f3599d0
dispatcher.register("skill437","lost437",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill442/main.php dfef7ea0a41219a7a1c9c9344906251b0c4fefa5e4fa142f8f3a92f6b3346976
dispatcher.register("skill442","acquire442",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill442/main.php d83d8d0b85e6e3711452b101b5614de3f2f206fa32bfe925f96ba5c04261fc28
dispatcher.register("skill442","lost442",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill452/main.php dcfd6da071e082c8eed162ac7c91a55d123c234af28848827302ca1e10d48380
dispatcher.register("skill452","acquire452",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill452/main.php b0fe9a67def151e2aff130d0544307a7c65be95e9cbb96fd97f9b39915153130
dispatcher.register("skill452","lost452",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill459/main.php 25740b5bf805b59cb4457b75664ed4caa57d359228e846cf153f4f2dc4c572fd
dispatcher.register("skill459","acquire459",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill459/main.php ef98596fa25d35ce0007358abc8f7e14d4f5dc354e3dcda2a1bc7609a5d54d62
dispatcher.register("skill459","lost459",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/skill1001/main.php 51a150d384215b27760888d22441495017abd067724ea223c3bf6044bf673921
dispatcher.register("skill1001","acquire1001",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys"]);
(v["t"]=phpBinary("-",v["now"],v["starttime"]));
(v["skillup"]=0);
for((v["i"]=0);phpTruthy(phpBinary("<",v["i"],v["t"]));(v["i"]=phpNumber(v["i"])+1)){if(phpTruthy(phpBinary("<",v["i"],300))){(v["skillup"]=phpBinary("+",v["skillup"],phpBinary("/",10,60)));}else{if(phpTruthy(phpBinary("<",v["i"],1800))){(v["skillup"]=phpBinary("+",v["skillup"],phpBinary("/",3,60)));}else{if(phpTruthy(phpBinary("<",v["i"],3600))){(v["skillup"]=phpBinary("+",v["skillup"],phpBinary("/",1,60)));}}}}
(v["skillup"]=callbackBuiltin("round",[v["skillup"]],ctx));
if(phpTruthy(phpBinary("==",19,v["gametype"]))){(v["skillup"]=phpBinary("*",v["skillup"],2));}
(await ctx.call("skillbase","skill_setvalue",1001,"skillup",v["skillup"],v["pa"]));});
// include/modules/extra/instance/skill1001/main.php 9b9e5f7853200538d33d8ad6defde3dba24270eb32a0f8f4af6f797fa4f523b2
dispatcher.register("skill1001","lost1001",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill204/main.php eca8c71f44d09c27fde58a566988930aa83014b8c022c312fa46a88e5f763653
dispatcher.register("skill204","acquire204",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill204/main.php a8d9e344655ba597d02f25e0e87f1e2460042143f487fe7460a21d828eaf827c
dispatcher.register("skill204","lost204",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill485/main.php e67a2bcded2c7e0694efec18c0150c9f588024a63dc422f7b1b9647cdf3a1d6e
dispatcher.register("skill485","acquire485",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",485,"lvl","0",v["pa"]));});
// include/modules/extra/card/skills/skill485/main.php 23e023f903d3c19bf03e7e11317a3ffdc57e1d631ae609f368c239562b7a5674
dispatcher.register("skill485","lost485",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",485,"lvl",v["pa"]));});
// include/modules/extra/card/skills/skill486/main.php a9c041af1887d7c5fe143e9583d9c72ec5c0408e512102c434247d98899bb0f0
dispatcher.register("skill486","acquire486",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",486,"lvl","2",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",486,"rtime","0",v["pa"]));});
// include/modules/extra/card/skills/skill486/main.php 383abbd99bca7d1edfc72e56813de93fb8868026261960a33e1fa71025ecce4e
dispatcher.register("skill486","lost486",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",486,"lvl",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",486,"rtime",v["pa"]));});
// include/modules/extra/card/skills/skill488/main.php 5b1dacc731c5b8ec46b3aacecf178c57984ec3611886be685a72bc2091e0463d
dispatcher.register("skill488","acquire488",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill488/main.php 87c235323e538773962b890d35bc8a81590f14e439e7ec7e83de1679a272733b
dispatcher.register("skill488","lost488",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill52/main.php c4202dc649d2822733556221c4dc616cec5241bdb73f8a53c97d48dcf21aea02
dispatcher.register("skill52","acquire52",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",52,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill52/main.php 392d01d3d7ea96118b8e0cc9b403ac21b9aa491422a6795670416bf499751eba
dispatcher.register("skill52","lost52",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",52,"lvl",v["pa"]));});
// include/modules/extra/club/skills/skill71/main.php a75fd68aba37b69737ff8db16db0288bc4077d5a0d571a9f7c1b5cc679d0771b
dispatcher.register("skill71","acquire71",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill71/main.php 5e3ef48f621a43d76c658d420bb6e1267eceeeb1eed746672b9f76525e0c7efd
dispatcher.register("skill71","lost71",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill414/main.php 3e28696255f514e4ef9ff9078f5c774ebb86b95fb0d6e839f4c4178bd46588e1
dispatcher.register("skill414","acquire414",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill414"]);
(await ctx.call("skillbase","skill_setvalue",414,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",414,"cd_ts",0,v["pa"]));});
// include/modules/extra/card/skills/skill414/main.php 72d6d7d89bb030b97275b43e3f4d4a64731f817127600cdc10ca3259e9510621
dispatcher.register("skill414","lost414",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill519/main.php 4f8588ebd458e6f3ad6414fbd15d36ff8a91433f9dcd10f6214124882b156caa
dispatcher.register("skill519","acquire519",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill519"]);
(await ctx.call("skillbase","skill_setvalue",519,"start_ts",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",519,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",519,"cd_ts",0,v["pa"]));});
// include/modules/extra/card/skills/skill519/main.php 3540d43e74af5099f76889c7e0e8c46cb9e5f13494a5fc687b25b56188982696
dispatcher.register("skill519","lost519",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",519,"lastrev",v["pa"]));});
// include/modules/extra/card/skills/skill520/main.php cd26b9e98fbc30e1ab6b66b827d3db23f31f9b7d3c8060ed0546c8d9b3f8c8a1
dispatcher.register("skill520","acquire520",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill520/main.php d3dc8dc220512ae9b2cbc3295a249b3d0de1fa0211ec5150f9ea9ae0ec171ba3
dispatcher.register("skill520","lost520",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill446/main.php dc85070e9c7cd82221dc91ef3bbf601c16e71289f845e60afd7f527827141109
dispatcher.register("skill446","acquire446",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill446"]);
(await ctx.call("skillbase","skill_setvalue",446,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",446,"cd_ts",0,v["pa"]));});
// include/modules/extra/card/skills/skill446/main.php 8f5bc3a35ce4c6619cb9fdd32be67fc94b3cd3dd3f45cd4ed7ba73b33dfe9b6d
dispatcher.register("skill446","lost446",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill447/main.php 8b16592bfdec5fdb4f6c15156b6cc8700a202bb21392b32a6e409948d964a324
dispatcher.register("skill447","acquire447",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill447/main.php ce09ca2a5f8ebab5c6c6b3b59bb48bb90def4c516f665d0a1126066249465ddf
dispatcher.register("skill447","lost447",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill453/main.php ec7f0402eee5e5496974b53cee7a2c4e466531b4cea5f1c1fe03ef627a5ffe9e
dispatcher.register("skill453","acquire453",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill453"]);
(await ctx.call("skillbase","skill_setvalue",453,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",453,"cd_ts",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",453,"target","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",453,"tarpid",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",453,"cnt",0,v["pa"]));});
// include/modules/extra/card/skills/skill453/main.php 58c18c98ea57fe5ec8cccadb66066a96f45f790b68cc27768e26710475261562
dispatcher.register("skill453","lost453",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill455/main.php a81e5784a0d1b07439f87857529755a3276227c415d2babe0fd1347b3e944907
dispatcher.register("skill455","acquire455",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill455"]);
if(phpTruthy(phpBinary("<",v["now"],phpBinary("+",v["starttime"],v["skill455_act_time"])))){(await ctx.call("skillbase","skill_setvalue",455,"start_ts",v["starttime"],v["pa"]));
(await ctx.call("skillbase","skill_setvalue",455,"end_ts",phpBinary("+",v["starttime"],v["skill455_act_time"]),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",455,"cd_ts",0,v["pa"]));}else{(await ctx.call("skillbase","skill_lost",455,v["pa"]));}});
// include/modules/extra/card/skills/skill455/main.php 591d052b25052a3d5c36d90a842884a3fb05fd4e66eae46a76d014b3dcb6953e
dispatcher.register("skill455","lost455",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill456/main.php e622005975dbef2517419efde5c76f68f06b20211c28e973bc427b16bc1be5db
dispatcher.register("skill456","acquire456",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill456"]);
if(phpTruthy(phpBinary("<",v["now"],phpBinary("+",v["starttime"],v["skill456_act_time"])))){(await ctx.call("skillbase","skill_setvalue",456,"start_ts",v["starttime"],v["pa"]));
(await ctx.call("skillbase","skill_setvalue",456,"end_ts",phpBinary("+",v["starttime"],v["skill456_act_time"]),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",456,"cd_ts",0,v["pa"]));}else{(await ctx.call("skillbase","skill_lost",456,v["pa"]));}});
// include/modules/extra/card/skills/skill456/main.php 1f6a35763d16ffdf3bc00257b86fb54cfe1e6576a3676b0c6c4409f52a028c28
dispatcher.register("skill456","lost456",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill253/main.php 9c2045eec79b7b30c57f18613598dd67c854a8ea02d656e9df26cd58d2f043e3
dispatcher.register("skill253","acquire253",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill253/main.php 0366edc0c30da1205bb40ef8724d3233e605975300096eb44e16d97686195426
dispatcher.register("skill253","lost253",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill483/main.php 6553a4ec025014e4ddbef1c01a10e38d6d9ef1eacf4bc6b7784d78a20c77c3fd
dispatcher.register("skill483","acquire483",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill483"]);
(await ctx.call("skillbase","skill_setvalue",483,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",483,"cd_ts",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",483,"cost",500,v["pa"]));});
// include/modules/extra/card/skills/skill483/main.php ab2a9f34eebe6fa81f883c836c39defb16248ad4b7875c2ad021ac1312e24dd6
dispatcher.register("skill483","lost483",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/skill1002/main.php 0f40a76961b8386997890191a3e1a366bbfa25656ebac10d69e1870ea55caa91
dispatcher.register("skill1002","acquire1002",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill1002"]);
(await ctx.call("skillbase","skill_setvalue",1002,"start_ts",v["now"],v["pa"]));
(await ctx.call("skillbase","skill_setvalue",1002,"end_ts",phpBinary("+",v["now"],v["skill1002_act_time"]),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",1002,"cd_ts",phpBinary("+",v["now"],v["skill1002_act_time"]),v["pa"]));});
// include/modules/extra/instance/skill1002/main.php 981b3e171c1357d794fbcfbd09ad84c9186e05a1ce08e162c4a16107825f1f85
dispatcher.register("skill1002","lost1002",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill499/main.php 90ee67efa0e8bd476cc48fca570767971e043fcacb42ed7ffb930275fa5a4e83
dispatcher.register("skill499","acquire499",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill499"]);
(await ctx.call("skillbase","skill_setvalue",499,"start_ts",v["now"],v["pa"]));
(await ctx.call("skillbase","skill_setvalue",499,"end_ts",phpBinary("+",v["now"],v["skill499_act_time"]),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",499,"cd_ts",phpBinary("+",v["now"],v["skill499_act_time"]),v["pa"]));});
// include/modules/extra/card/skills/skill499/main.php fffe1a3c3977b8978bdafb6bf8d0a57378d83c0f68a3240cb8912197a6a50301
dispatcher.register("skill499","lost499",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill69/main.php 191442d9878b7f082e1c5ced04450823a8b39358226f15f335498bf94912c7aa
dispatcher.register("skill69","acquire69",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackSet(v["pa"],"money",phpBinary("+",callbackGet(v["pa"],"money"),480));});
// include/modules/extra/club/skills/skill69/main.php d45ac455dd8d248a5c4068f71864b863355008c50fe4fc4d74b95b771caeab26
dispatcher.register("skill69","lost69",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill18/main.php e25c3b8456a499959f0a741d8baf10812c1a1de317e34058e3710dd9cf05f64e
dispatcher.register("skill18","acquire18",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackSet(v["pa"],"wf",phpBinary("+",callbackGet(v["pa"],"wf"),20));});
// include/modules/extra/club/skills/skill18/main.php 8fc6219c967634341ff93160b621865ee89bb3ea1e2f4ca3bb46f8d3b75d2910
dispatcher.register("skill18","lost18",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill15/main.php 84b71e02fc5756b69345f7e9cb3364178d99880b49d71fc626031ea9f192fc25
dispatcher.register("skill15","acquire15",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackSet(v["pa"],"wg",phpBinary("+",callbackGet(v["pa"],"wg"),25));});
// include/modules/extra/club/skills/skill15/main.php 7b99d2b9ba7bdbe659aac0d9fe299d34062876839f5dfed3ec4f31175aea035d
dispatcher.register("skill15","lost15",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill16/main.php 92807848bb8b1e34d69aa2d3e5d3c70fbfd7570c580ded8e4ce36371cb9e3d05
dispatcher.register("skill16","acquire16",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackSet(v["pa"],"wc",phpBinary("+",callbackGet(v["pa"],"wc"),25));});
// include/modules/extra/club/skills/skill16/main.php 57585cc6703709be923a8f56ac45b0c5f3c1a210d45ea388538ccdc9302068f3
dispatcher.register("skill16","lost16",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill17/main.php f2f252084311f5396b646c3794f04cca68cdbec80e3b4d7d0989b59ada9d20e7
dispatcher.register("skill17","acquire17",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackSet(v["pa"],"wd",phpBinary("+",callbackGet(v["pa"],"wd"),25));});
// include/modules/extra/club/skills/skill17/main.php 2886f634a1a8e256a2bb1cb9afa314924ddadebf01d8c56c55aa2d5ffabe1a41
dispatcher.register("skill17","lost17",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill13/main.php a610f38ddcef467d24f31d264b9c363258d280ee234e37acfee3465d9888bad6
dispatcher.register("skill13","acquire13",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackSet(v["pa"],"wp",phpBinary("+",callbackGet(v["pa"],"wp"),25));});
// include/modules/extra/club/skills/skill13/main.php d53c85819f0cbb74d616ab4dfb6ebd31fd4d06bb911339016f017bb8a7de65bc
dispatcher.register("skill13","lost13",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill14/main.php d5ea96f5ddee3051a3e25d716944effac26dc1cec45f8c0da069f1eb0f09a31a
dispatcher.register("skill14","acquire14",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackSet(v["pa"],"wk",phpBinary("+",callbackGet(v["pa"],"wk"),25));});
// include/modules/extra/club/skills/skill14/main.php 19d90c4f5db928858434e03d5ad3d5bdf3da77c6fce1cf575aff054436097a55
dispatcher.register("skill14","lost14",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill480/main.php 2c71e31345d869db1c6487687e26436422bfe5f1da6bb4f4b7a9b16a8b1220eb
dispatcher.register("skill480","acquire480",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",480,"activated",0,v["pa"]));});
// include/modules/extra/card/skills/skill480/main.php fe47a92494744d6a66b7073e42fc52c04d5d7411017aeb09769db0b31d5fb41e
dispatcher.register("skill480","lost480",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/gmskills/skill1011/main.php 916775f4d6ccfdbb31bb3b659716e76f3c6d26d366065555e7c53a8f26baf6c4
dispatcher.register("skill1011","acquire1011",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/gmskills/skill1011/main.php 4c5a82ad65fa9ec67c73479a5325c74c754b8647a05a4fa2746b2d3b96b03d0e
dispatcher.register("skill1011","lost1011",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/gmskills/skill1010/main.php bc7dd273ecbd68e9de054abfca4223d731c40bb6724e502a831bde4f1f7f018d
dispatcher.register("skill1010","acquire1010",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/gmskills/skill1010/main.php 831b8859faf16ddc9853bb619876c464af65968d98a85b890de0dddee4b02ada
dispatcher.register("skill1010","lost1010",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill39/main.php 8cec7c3525a94fdf476794452f65077fbc2ff2208cdac0a5be7e2d1cc740f49d
dispatcher.register("skill39","acquire39",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackSet(v["pa"],"att",phpBinary("+",callbackGet(v["pa"],"att"),200));
callbackSet(v["pa"],"def",phpBinary("+",callbackGet(v["pa"],"def"),200));});
// include/modules/extra/club/skills/skill39/main.php 8a1a88751398335a3abeff484156e25c3c1eefb7be88f4b5b254aa61da7352df
dispatcher.register("skill39","lost39",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill29/main.php eba2d988688cab9fa28874fc095e6369cd0b059334f7cda0a24c86b9f33cc22f
dispatcher.register("skill29","acquire29",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackSet(v["pa"],"hp",phpBinary("+",callbackGet(v["pa"],"hp"),200));
callbackSet(v["pa"],"mhp",phpBinary("+",callbackGet(v["pa"],"mhp"),200));});
// include/modules/extra/club/skills/skill29/main.php 0373823ace5626afba2ea66e6187c5a61096bc569f35a16409e2021a76a48a55
dispatcher.register("skill29","lost29",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill421/main.php b4d9e32f9214865bda21f0e7f8ddb5345ed37f8a6a73f60e0a595689f67c2047
dispatcher.register("skill421","acquire421",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill421/main.php 8ac1451628c57a28e2818a1aa5f108f2dd7d385fa426d5c6cbec4f26c41a18fb
dispatcher.register("skill421","lost421",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill40/main.php ffae2f1f9dd41a855632e3b987b2c5a751b53c74af0513b1cc853e0856f1284e
dispatcher.register("skill40","acquire40",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill40/main.php d340db5a03c8f87f53c8fd4ebd42d0b628790ff9ee971b891098a24f76c3dd77
dispatcher.register("skill40","lost40",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill58/main.php 9d538e0623d6be1b8173875fa2c574f6f2a1f4ebbb9744133b58f39e9345b6f6
dispatcher.register("skill58","acquire58",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",58,"r","0",v["pa"]));});
// include/modules/extra/club/skills/skill58/main.php 5a0adf42b92e45d6ff997b089c2b34ea3d642f80946c717db05f37709edd0f5c
dispatcher.register("skill58","lost58",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",58,"r",v["pa"]));});
// include/modules/extra/club/skills/skill211/main.php 56d3433e8a73a3a794f53e1ebb47d31e6811ebbe866d1036cdbd9cb73502ce08
dispatcher.register("skill211","acquire211",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",211,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill211/main.php 811e9b4bddfba6867ffa00edefc13a356d2cd5cff73e688f8f12e8966604d9f4
dispatcher.register("skill211","lost211",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill212/main.php 9b4c70e00248ef170bf319bbfda506abf52543c0247bfdd07b61ac9c34b74b91
dispatcher.register("skill212","acquire212",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",212,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill212/main.php 4fe73c5e6a8f7e7e3001ed2c2a9a2d3d6e687d043fa6c7eefda5c4928b07620d
dispatcher.register("skill212","lost212",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill214/main.php bd7082775d4566c6a5d0a52641024b2c0ba183ae52b14e7b5ec4b4bdf43fd8d6
dispatcher.register("skill214","acquire214",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",214,"choice","2",v["pa"]));});
// include/modules/extra/club/skills/skill214/main.php 866f59a0a2a24f192b5a1d80531d55fb5de304531cf16a585c3c82f9d0919cb7
dispatcher.register("skill214","lost214",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",214,"choice",v["pa"]));});
// include/modules/extra/club/skills/skill234/main.php f93f35e8177bae2f1e6a2d9434cf104286929d4495ea42fd00ea263133cb9a1e
dispatcher.register("skill234","acquire234",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",234,"lvl",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",234,"cur1",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",234,"cur2",1,v["pa"]));});
// include/modules/extra/club/skills/skill234/main.php c5c1dc299b24131f17794398b97101dca1e9c80b6db3074f4f2cf1cfe48acf5d
dispatcher.register("skill234","lost234",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",234,"lvl",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",234,"cur1",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",234,"cur2",v["pa"]));});
// include/modules/extra/club/skills/skill235/main.php 5da289a7811a0e9ba92872c747440ac0465c0b8b9db857c783c3c40a0decacff
dispatcher.register("skill235","acquire235",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill235/main.php c66ebd75b6dfef0863e3164d9d6770cb7dcb569fd99d951a9f52b6a0c37298fd
dispatcher.register("skill235","lost235",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill420/main.php 47880b507976fdd44c28236725d4064d314af8b7e0337a7a5b05759ba4d58de1
dispatcher.register("skill420","acquire420",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill420"]);
(await ctx.call("skillbase","skill_setvalue",420,"end_ts",phpBinary("-",v["now"],1),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",420,"cd_ts",phpBinary("+",v["now"],v["skill420_cd"]),v["pa"]));});
// include/modules/extra/card/skills/skill420/main.php bc3c0119521e1a820f04ec52d4ee570d2dd6858b0f62ddc478047b111e04b5b8
dispatcher.register("skill420","lost420",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/gtype1/skill424/main.php bc3b1d13901421c8aec05bc890733865c5f208e12fbacec5ebb6d6ca2893b91c
dispatcher.register("skill424","acquire424",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",424,"lvl",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",424,"cur1","电池",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",424,"cur2","探测器电池",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",424,"cur3","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",424,"cur4","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",424,"npclvlsum","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",424,"maxlvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",424,"rank","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",424,"prize","0",v["pa"]));});
// include/modules/extra/instance/gtype1/skill424/main.php 904b051eca8fcbceb08572266df9cd7202f5b42e642aa8bc23da01314269b4df
dispatcher.register("skill424","lost424",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",424,"lvl",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",424,"cur1",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",424,"cur2",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",424,"cur3",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",424,"cur4",v["pa"]));});
// include/modules/extra/instance/gtype1/skill428/main.php 918bc18000d1ff0fc84a16e5c0fc8de1fee735e474c2f829fda9a1d67cbd0309
dispatcher.register("skill428","acquire428",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",428,"lvl","0",v["pa"]));});
// include/modules/extra/instance/gtype1/skill428/main.php 972c64f07b6482e0d78e0d05a18a853cdbbe686b13c5340b224184a54a30825c
dispatcher.register("skill428","lost428",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill240/main.php 01ae6bb6d0adb9408dadf70c42f1d4cc383089ee8fe53025a2b584340eef4645
dispatcher.register("skill240","acquire240",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill240/main.php e8cc2d90cb01ff0ed812f2df80b66b892ca523207c41d5247a4fb785609ef941
dispatcher.register("skill240","lost240",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill241/main.php 6ee495fcea67753cf6d04b45f3d66aff095e6b16fa7ae5e94598d90770fb3728
dispatcher.register("skill241","acquire241",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill241/main.php aaed3d3521b7864543354fc465b268029341e8fe58710e8fe6a6306119404e48
dispatcher.register("skill241","lost241",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill247/main.php 9437a1e1864cf083e4d120dcd17040bf8a4c528676e1a2994626b623a5520abc
dispatcher.register("skill247","acquire247",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill247"]);
(await ctx.call("skillbase","skill_setvalue",247,"end_ts",phpBinary("-",v["now"],1),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",247,"cd_ts",phpBinary("+",v["now"],v["skill247_cd"]),v["pa"]));});
// include/modules/extra/club/skills/skill247/main.php b220a531777703abb66c29e833e11cddd380cce385603e0269806292a11e98cd
dispatcher.register("skill247","lost247",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill454/main.php 473a313e3cad8bba07b20b667ab6af834b961e2e9b6d2316e6f7820fcd7a4492
dispatcher.register("skill454","acquire454",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill454/main.php 5483702eae61f053fd4795c5c3b22ead1d18d004b65ba16b5cc8f315cf57d148
dispatcher.register("skill454","lost454",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill457/main.php 169230cfe3efe19e42cacb239604347ecf7137dadc862ecdc4dcc0f3a7e766ea
dispatcher.register("skill457","acquire457",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill457/main.php dfb18ab46a5592ccc048c26590a557ecf00df6a5bbde5c0f5eaf463f943d913e
dispatcher.register("skill457","lost457",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill249/main.php 6abd4c0d0ba3316c4c8055776bf2b822d4582753f6cdb96077ade6f03f736d7d
dispatcher.register("skill249","acquire249",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill249/main.php c86bec63dad4b76fcb3c1a2475419420d5b5221b50e5ece82b22ae29774d39d9
dispatcher.register("skill249","lost249",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill250/main.php 4be462424143805e6321092d01b56a598fcedf47e0a467363fbd89f75c30c616
dispatcher.register("skill250","acquire250",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill250/main.php ae1a65abfa868715dc0213ff5812bf938929a83dccbb70e55458895fe4d42747
dispatcher.register("skill250","lost250",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill460/main.php 9c3699437ae5be24f59f9412b8c2f4610aa3a3638b15506891275834f465e82b
dispatcher.register("skill460","acquire460",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill460/main.php bf15be725d768ab2a5e238a085acdfa3df13c5e9aac06e0ee29c035da29208f1
dispatcher.register("skill460","lost460",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill461/main.php 5116913cb4ab89355f735b3089bfb00d97be926accf967c4ed7f7829dbefa326
dispatcher.register("skill461","acquire461",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill461/main.php 6417fce65701c2b40da2238e85e68fb48661acc8635ffff3373c1d60226ca033
dispatcher.register("skill461","lost461",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill251/main.php 20e80fff5a686e463f52960013d887eed3dc1afa499f08df5b05a13f22eb92a7
dispatcher.register("skill251","acquire251",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",251,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",251,"cd_ts",0,v["pa"]));});
// include/modules/extra/club/skills/skill251/main.php 7a57434149c8e51c349984cf4a94224c5daf20bdc4948753456c7f104f36e721
dispatcher.register("skill251","lost251",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill255/main.php 2522464a11ccf05f964f72fd3186c53fe334c681b93be93fb45c3bf787489791
dispatcher.register("skill255","acquire255",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill255/main.php 67923b21547e94426cb70d56a67f273b20c06b0f500bf48326d7b3f08d2222cd
dispatcher.register("skill255","lost255",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill462/main.php 5e9bec4dd511297a630d795367cef37045d5787c7617c514cecdddeb253b1966
dispatcher.register("skill462","acquire462",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill462/main.php 159e868e524be66d53b41c90ab4215fe3d8378e516f0601245e25ca1f8eb051a
dispatcher.register("skill462","lost462",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill257/main.php ea3864704e8cd989419401dc66da642f046e62b2b009c05f4b2bb073934752bc
dispatcher.register("skill257","acquire257",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill257/main.php 837b18efea0c68fd67d746f06f986a3da882f5133ec28e5990abaf4e10cdcb1e
dispatcher.register("skill257","lost257",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill474/main.php e50ec223288c661ea5655e027034fbf0dabe04a228a9b1f464a0c0dd80d41dcc
dispatcher.register("skill474","acquire474",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill474/main.php 00bd8dfa1010bf6f5265431896de0485638d9980c86caee51ef577fe95c50db1
dispatcher.register("skill474","lost474",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill484/main.php 069e8def7b77cd3c73989260963f6c040161326318c4ae240d1a260500267634
dispatcher.register("skill484","acquire484",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill484/main.php 3820827f1aff5c5f1b6307fdc2d143e6dc77e2ba50d7503866cb3b856340245c
dispatcher.register("skill484","lost484",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill491/main.php ff43f454956aba8884404dfbbb23eccb0c8d594a03049058dc3ed33b9184ebd7
dispatcher.register("skill491","acquire491",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill491/main.php 785e0e51ada9589a4d6ab1424b704f136e4098d1998effe4a6c049cf8e5db340
dispatcher.register("skill491","lost491",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill267/main.php db7138a2b1c8ed4de0243daa8385ee51b57dcff86b9615f3c73e95c7bf8c60e1
dispatcher.register("skill267","acquire267",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",267,"lvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",267,"gotmhp","0",v["pa"]));});
// include/modules/extra/club/skills/skill267/main.php a242213ae4135c04eb15504658b46722b8ae7509d62944738b11cdf990126618
dispatcher.register("skill267","lost267",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",267,"lvl",v["pa"]));
(v["gotmhp"]=(await ctx.call("skillbase","skill_getvalue",267,"gotmhp",v["pa"])));
callbackSet(v["pa"],"mhp",phpBinary("-",callbackGet(v["pa"],"mhp"),v["gotmhp"]));
if(phpTruthy(phpBinary("<=",callbackGet(v["pa"],"mhp"),0))){callbackSet(v["pa"],"mhp",1);}
if(phpTruthy(phpBinary(">",callbackGet(v["pa"],"hp"),callbackGet(v["pa"],"mhp")))){callbackSet(v["pa"],"hp",callbackGet(v["pa"],"mhp"));}
(await ctx.call("skillbase","skill_delvalue",267,"gotmhp",v["pa"]));});
// include/modules/extra/club/skills/skill268/main.php df91097c07a92b0ae678d0406887bbe0541cdf5ad244f493de4bbc91f0d2a162
dispatcher.register("skill268","acquire268",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",268,"rmt",2,v["pa"]));});
// include/modules/extra/club/skills/skill268/main.php c714c7f47124ebb7977372681ed80db076ccccbb486af9136bc61851f9f9a957
dispatcher.register("skill268","lost268",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",268,"rmt",v["pa"]));});
// include/modules/extra/instance/gtype1/skill494/main.php 380c267e09be10844d4598ba0da4891d4ddf71dedccf31906a63100f77e279d8
dispatcher.register("skill494","acquire494",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",494,"lvl","0",v["pa"]));});
// include/modules/extra/instance/gtype1/skill494/main.php 9d97713cdb0930145baf9e9c421a0daa29a8effd6f9384cb11730314293032b5
dispatcher.register("skill494","lost494",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/gtype1/skill495/main.php 2b89596b0d564aaa10418534a9e511f1da68b15224e73cc28f22e13ceb7a4892
dispatcher.register("skill495","acquire495",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",495,"lvl","0",v["pa"]));});
// include/modules/extra/instance/gtype1/skill495/main.php 711c3e9fd135469c5d5a821d8e031365eff77814bdef7e2af710675db85429b0
dispatcher.register("skill495","lost495",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill501/main.php 9aecb5480247b0f8c3358528366e8c6746d245469f343d0455bea7e75c33fe33
dispatcher.register("skill501","acquire501",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill501/main.php a35120fca62ba1489f760b96bcac196e8591434d0e0ce10b92e3e85c5c13d28d
dispatcher.register("skill501","lost501",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill83/main.php 949d641c412cfab8526a6f66c68a693f15ccce2b5e739c8127ec7b1e267db6af
dispatcher.register("skill83","acquire83",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill83/main.php 341967afafca4a0f82b89d4815f91074c4462ab948901d8da333209227ee7034
dispatcher.register("skill83","lost83",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill256/main.php 47ea6851e0ecb14165e72b930bf54c1c6f37d8effc1bf4ea34838f84ab3b1399
dispatcher.register("skill256","acquire256",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackSet(v["pa"],"wp",phpBinary("+",callbackGet(v["pa"],"wp"),50));});
// include/modules/extra/club/skills/skill256/main.php a81f2be64a5007dd37b1d7c78fa14d1242144ee7d986b6fa8934efd55f97d044
dispatcher.register("skill256","lost256",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill433/main.php 817ca6e71ec7da0367cd9240923d2dc6a0520f9eb29a87152a3a25400debbbc0
dispatcher.register("skill433","acquire433",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill433/main.php f2bd011bf00c80298bdcdab81b4980c7b9eaa5719b088f70eb3b333adf861ca5
dispatcher.register("skill433","lost433",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill221/main.php 6e3874ef026ed8273aabad888c3b4751296ff1ee6ecfe1e814b547cb3c2d8098
dispatcher.register("skill221","acquire221",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill221/main.php 7f37ff9bedb0ed1690c75cb13556b119eeaba873371de90f613b2df50b9011ae
dispatcher.register("skill221","lost221",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill41/main.php 59d34f44f3e4650b7d474fecf05845a35ef82a2180504e1dac9bf79b5588b249
dispatcher.register("skill41","acquire41",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill41/main.php ec051841d5985d460cdd0000aa70f917e6fbb7d4a23cefe4a65119dc67d4130e
dispatcher.register("skill41","lost41",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",41,"u",v["pa"]));});
// include/modules/extra/club/skills/skill45/main.php 28f03190ed4198db6b99df1cd2a8ad1d54bdcb657f55b3bb832fe93a88fbbd6b
dispatcher.register("skill45","acquire45",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill45/main.php 23d3abfa7bc71993e1220b0e6a1a04184bceb170de6ebdc5e87d67d3ef62b496
dispatcher.register("skill45","lost45",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill46/main.php 45c4bf564ed0b12cefbc1cb318fd7fb6c322064cf95359abae6645c57386fd26
dispatcher.register("skill46","acquire46",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",46,"rmtime","2",v["pa"]));});
// include/modules/extra/club/skills/skill46/main.php d7ce94b364b2ebe27391246b84d8f12e2ff7807ccb5f534129bee2aac437dfe4
dispatcher.register("skill46","lost46",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill60/main.php 0a3757254a3c5748505f9ca34196257a0d3f7714c3977d72031f99cda19c98b9
dispatcher.register("skill60","acquire60",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill60/main.php bb71c55653d1340c28637db88b85f29b2a58f396981478bf980908d26e7457c5
dispatcher.register("skill60","lost60",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill61/main.php a5da414114c481128338f0250a4284bc526baee2cfb76a6ebfdbe127fa37f58c
dispatcher.register("skill61","acquire61",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill61/main.php ed6c36c80b679a15059d7bb3944f696f96bcda438e12ed1c79a11573377be906
dispatcher.register("skill61","lost61",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill62/main.php 8fd556be59979b4f57c6ab5bc1fcc150a27b338d95898e163b7dc3fa04e97fcc
dispatcher.register("skill62","acquire62",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["skill62"]);
(await ctx.call("skillbase","skill_setvalue",62,"t",v["numlim62"],v["pa"]));});
// include/modules/extra/club/skills/skill62/main.php 591f6e72d6053f4cbee8d63903dac98cb57bd713af5b093f2d64f4a42935d822
dispatcher.register("skill62","lost62",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["skill62"]);
(v["clv"]=phpBinary("-",v["numlim62"],Math.trunc(phpNumber((await ctx.call("skillbase","skill_getvalue",62,"t",v["pa"]))))));
callbackSet(v["pa"],"mhp",phpBinary("-",callbackGet(v["pa"],"mhp"),phpBinary("*",v["clv"],100)));
callbackSet(v["pa"],"hp",phpBinary("-",callbackGet(v["pa"],"hp"),phpBinary("*",v["clv"],100)));
if(phpTruthy(phpBinary("<=",callbackGet(v["pa"],"mhp"),0))){callbackSet(v["pa"],"mhp",1);}
if(phpTruthy(phpBinary("<=",callbackGet(v["pa"],"hp"),0))){callbackSet(v["pa"],"hp",1);}
(await ctx.call("skillbase","skill_delvalue",62,"t",v["pa"]));});
// include/modules/extra/club/skills/skill63/main.php a08ddde53ee94ff9cee04818f3116fee31c063581dba8012285df384e797b67a
dispatcher.register("skill63","acquire63",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",63,"t","1",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",63,"p","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",63,"n","0",v["pa"]));});
// include/modules/extra/club/skills/skill63/main.php 34d616911c465114cac5abd8bd48eb1a17cd44135b4dc016ad3488ef87914965
dispatcher.register("skill63","lost63",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",63,"t",v["pa"]));});
// include/modules/extra/club/skills/skill64/main.php 05417099392d23170581e46f9a553063f3538613c7bd7a386798707eb0894336
dispatcher.register("skill64","acquire64",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill64/main.php fd07fed51f30971745b59080f84d8724e00b9f04ce2fbc0ec318cf0369c90ddb
dispatcher.register("skill64","lost64",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill66/main.php c1359aa9ba31fb680a316ca4e4de26da56d2e4e116fe1ed68847a8885bd1babb
dispatcher.register("skill66","acquire66",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill66/main.php 5b0beea8db41659473421c6395ca7c4ca7aac15f2209c175daf4f0352483e5f7
dispatcher.register("skill66","lost66",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill74/main.php b8e2d9e133659cfb2c4129bd5a21147bc469f0af4a197868de51af77355491d5
dispatcher.register("skill74","acquire74",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill74/main.php 06e41aaa13ca30384c33f1f6a2b54cd01a1a3a8cd27c264909cb0a7a9cf24ced
dispatcher.register("skill74","lost74",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill213/main.php dfd08b7d599a958c83223c097d15c50862ed5f27d5291562414331c26db29b86
dispatcher.register("skill213","acquire213",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill213/main.php 6c20fb4252199fc6140ae52a605637cd6837e4196d14cea2c4b2f995175b872a
dispatcher.register("skill213","lost213",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill216/main.php 6dc1439356632640dd75bca1f46b0ce46f462e170bb1fd376d0d1e70ac616261
dispatcher.register("skill216","acquire216",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",216,"rmtime","2",v["pa"]));});
// include/modules/extra/club/skills/skill216/main.php ba44269fd0aabf89d4cd0c1b7ea5a52bcbe6416f66e61317f83da1296396e589
dispatcher.register("skill216","lost216",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill404/main.php b55169d029785472af0e8de74ac08b420f0411b52b78308c5f6e7d1bc9877316
dispatcher.register("skill404","acquire404",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",404,"lvl","0",v["pa"]));});
// include/modules/extra/card/skills/skill404/main.php 17c12cad48d936ca295933b4b8f7375640446df48b1ad7457426f32c17f9374f
dispatcher.register("skill404","lost404",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",404,"lvl",v["pa"]));});
// include/modules/extra/card/skills/skill405/main.php 77655962fdba5d15efa50eea73d3ff15e0d95024416f664a5bd8efe0a94babcb
dispatcher.register("skill405","acquire405",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill405/main.php 85a05732959a14dddbd6a52c777225809d00a397756c0a0aba2a322590162e1e
dispatcher.register("skill405","lost405",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill406/main.php 5e24227e929ae67a4911e9b85d06ccacd2642b5140456b6c1c259987531ce71b
dispatcher.register("skill406","acquire406",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill406/main.php d492e2ef8c4c2c3240f3c3f390cec8743c9fb3f42ed4d285013fbdde1ebfa712
dispatcher.register("skill406","lost406",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill400/main.php f10d61f0202184087322323dcf8f108fcde4c8d5914b3bde4e604ef526c6c96a
dispatcher.register("skill400","acquire400",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",400,"lvl","0",v["pa"]));});
// include/modules/extra/card/skills/skill400/main.php 99eb69affe1e7a24fb3890b6981accfe0a544a7e566f06e250ddd3161d9ed7ff
dispatcher.register("skill400","lost400",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",400,"lvl",v["pa"]));});
// include/modules/extra/card/skills/skill402/main.php f6ad3dee8363b9fc9573b097a162af117437c7517a448f04e9a805566d8696ac
dispatcher.register("skill402","acquire402",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",402,"lvl","0",v["pa"]));});
// include/modules/extra/card/skills/skill402/main.php c8a8e0e50808e95d9e2548f751c09fb3208ed0b7d00e84029bc43485f922dfec
dispatcher.register("skill402","lost402",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",402,"lvl",v["pa"]));});
// include/modules/extra/card/skills/skill401/main.php 7ba5cd8b799c64501366d14e9a95ca45ced0a9acae0352f7fef20671ccebef98
dispatcher.register("skill401","acquire401",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",401,"lvl","0",v["pa"]));});
// include/modules/extra/card/skills/skill401/main.php 8d915572f3bffc9f4a1efe3f33824c6ce0e082177d317238a2929a8fc475a382
dispatcher.register("skill401","lost401",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",401,"lvl",v["pa"]));});
// include/modules/extra/club/skills/skill225/main.php 2f197a73e0dc2d3afa610ccb1a9c30d9925f02fda729b8793de8a296e18365a6
dispatcher.register("skill225","acquire225",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill225/main.php 624eefb07bc9417d15e03e94ff991ee1ebe8720b3209a76818ecce0ede906a6e
dispatcher.register("skill225","lost225",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill226/main.php 57a918fce6e821d61e84c3e978a15bacc67242bc364d942203a5e4652dc28147
dispatcher.register("skill226","acquire226",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",226,"unlocked","0",v["pa"]));});
// include/modules/extra/club/skills/skill226/main.php 8990aeb053e90d9336ae389c7f351b4bd4c3580c2c136b5968f0114403f27aba
dispatcher.register("skill226","lost226",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",226,"unlocked",v["pa"]));});
// include/modules/extra/club/skills/skill229/main.php 20971c367ddf1b969c1be82b1a2b8e3ec5c80d8de3d9e368a193d1d7be72fcbf
dispatcher.register("skill229","acquire229",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",229,"unlocked","0",v["pa"]));});
// include/modules/extra/club/skills/skill229/main.php aa7c29cf1288ee47a1737a0fdf0e2f6c0f6754267bf08debeb80f84bcba6de98
dispatcher.register("skill229","lost229",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",229,"unlocked",v["pa"]));});
// include/modules/extra/card/skills/skill408/main.php b6abfb6ffde439508e72cd9550a2e63e07c16dec2a80dacfefd994c68b548e47
dispatcher.register("skill408","acquire408",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",408,"lvl","0",v["pa"]));});
// include/modules/extra/card/skills/skill408/main.php 73a7732967f809a65ff33308ab7902fbc4f249beaa70bcb4018331d5e1aeee5a
dispatcher.register("skill408","lost408",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill409/main.php c124243016d721b9ff4a1642c726b66dc5b76cb2703640517a52b7ed2d1eacd4
dispatcher.register("skill409","acquire409",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill409/main.php e94e6d5d1078f53ba5614ff108a246b47417a59126ec7c8f0f51237fb3c187b5
dispatcher.register("skill409","lost409",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill415/main.php b5624d44f209862a6de0d70b005016cc84fda8b5ce6d72d22cd86bbed18a353b
dispatcher.register("skill415","acquire415",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",415,"lvl","0",v["pa"]));});
// include/modules/extra/card/skills/skill415/main.php c4c57832bbd619788ae18a75979f1f510aab5ed00eb8eb68d99904c94a40b6af
dispatcher.register("skill415","lost415",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",415,"lvl",v["pa"]));});
// include/modules/extra/card/skills/skill412/main.php b6862d163b554797b19bc3991172ec0c3c1256da42be7d1c6f910952ef8a1045
dispatcher.register("skill412","acquire412",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill412/main.php 25ec6fe531d441026190a4bccdf8bded5f6590224a5ff5d3cac7ea074787a8e8
dispatcher.register("skill412","lost412",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill416/main.php d48424ac2a67d7af072f2455e4225937f0b9116bcb84cf686de27e8b585d42af
dispatcher.register("skill416","acquire416",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",416,"lvl","0",v["pa"]));});
// include/modules/extra/card/skills/skill416/main.php 2d67255095fcef6eb8362c6eec4a41dbc25709181d059e022825f3b834c84b9a
dispatcher.register("skill416","lost416",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill419/main.php 65b6c35d37bf955a05306d2b6cfd75fb924772e8857dae1788900ca9888d5572
dispatcher.register("skill419","acquire419",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill419/main.php 018b901349c13f6bd7b535b91df6407bbdcac8ccb9e57f4017fa4f5fd0859c61
dispatcher.register("skill419","lost419",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill423/main.php 5156bd55f0d2b9d81a932ec99245492a0828a6bec7c4c31973dfc0d327478978
dispatcher.register("skill423","acquire423",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",423,"lvl","0",v["pa"]));});
// include/modules/extra/card/skills/skill423/main.php 629a92ec710d906a95a2c5638a97663aa84f7ab9385158e21bb50d8ad2f93b50
dispatcher.register("skill423","lost423",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",423,"lvl",v["pa"]));});
// include/modules/extra/club/skills/skill239/main.php 57fc171763b25301d551c7f4c994ac96d068dd8c5abd169918fac5ac929752ae
dispatcher.register("skill239","acquire239",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",239,"lvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",239,"spent","0",v["pa"]));});
// include/modules/extra/club/skills/skill239/main.php c0c62fc9956d5289bb7584371c3d5ef2379691182ec2c43d33c215fd47541f1a
dispatcher.register("skill239","lost239",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill438/main.php 66cc2f8e63127f8e7a33a5ca4442dbce4abe8361fe94f2b07474133e06cf979f
dispatcher.register("skill438","acquire438",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill438"]);
(v["t438"]=phpBinary("-",v["now"],v["starttime"]));
(v["r438"]=115);
if(phpTruthy(phpBinary(">",v["t438"],300))){(v["r438"]=125);}
if(phpTruthy(phpBinary(">",v["t438"],600))){(v["r438"]=150);}
if(phpTruthy(phpBinary(">",v["t438"],900))){(v["r438"]=175);}
if(phpTruthy(phpBinary(">",v["t438"],1200))){(v["r438"]=200);}
(await ctx.call("skillbase","skill_setvalue",438,"rate",v["r438"],v["pa"]));});
// include/modules/extra/card/skills/skill438/main.php 0d696bc9a7c6a93f5c562dcb6d92bd304de40eb6c192996bb4075bc9868d8f7c
dispatcher.register("skill438","lost438",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill439/main.php d03137e86803d755a89f757ace584df9e66292cfd74278381b423da7b0d5f0c2
dispatcher.register("skill439","acquire439",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",439,"type","X",v["pa"]));});
// include/modules/extra/card/skills/skill439/main.php 5b17519c554a1107acd8a62f75df8f42ffed62316085e88e4fbaaa614675e896
dispatcher.register("skill439","lost439",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",439,"type",v["pa"]));});
// include/modules/extra/card/skills/skill440/main.php 072342d45b6a77a025343f2c11b84e4eca5f879fff9a54fd695aa62071464548
dispatcher.register("skill440","acquire440",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill440"]);
(await ctx.call("skillbase","skill_setvalue",440,"end_ts",phpBinary("-",v["now"],1),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",440,"cd_ts",phpBinary("+",v["now"],v["skill440_cd"]),v["pa"]));});
// include/modules/extra/card/skills/skill440/main.php 746cc20a1967621b42fcbf5f8d94fea623a196880458badf31f04856721a071b
dispatcher.register("skill440","lost440",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill449/main.php 9fce450b94994915dd2b427f29666bfe6d1387ace46cc5159b52156e0b228d35
dispatcher.register("skill449","acquire449",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill449/main.php e34da2dd627ca337d8cfea1ba3e839a69a9a3489a89efb3c03a1b9503e510eb1
dispatcher.register("skill449","lost449",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill450/main.php dff66b6f2d7b2c14406dc5dae7b821e90235458d4a44ef300e82a3aa4d28803e
dispatcher.register("skill450","acquire450",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill450/main.php b10c669a3480b92a562ca9c2f568ba28144e00ad28c694361cb7bbd33f2c63e4
dispatcher.register("skill450","lost450",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill464/main.php 968c5ad244f8717e618137925414e255e193075d145084951cfc97272efd009e
dispatcher.register("skill464","acquire464",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill464/main.php c725a821bf99fc9765fd4221ea8c121eeb76bf5010df2b399287d0d8c5493623
dispatcher.register("skill464","lost464",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill466/main.php 56b6532b5145209610cf15cdb6ff6e28972c8c0fe2f5dc72617edcfc48ae2c9c
dispatcher.register("skill466","acquire466",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill466/main.php c4f76fc10722d403b01c675e7c965105133c5bc1e1914503d6f4643cf52a7e18
dispatcher.register("skill466","lost466",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill469/main.php 25d527707bdca80013574cea879f099d5a409adf6e3aadc2ba63c6fcec33b91d
dispatcher.register("skill469","acquire469",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill469/main.php 5356654a270832b88181d90f9decaadd683322b9452ec36274a571dd8828bbb6
dispatcher.register("skill469","lost469",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill470/main.php b7f3145638b3127c84247672f7441ff3dc2c76dba6f62b7678fd45dab5aba0f1
dispatcher.register("skill470","acquire470",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill470/main.php adc2984ffc5a0884fa51776cb2c90767731ea3939f2c71fc627fdc7304b9f09f
dispatcher.register("skill470","lost470",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill471/main.php 9dad5ad1254ca3341f1379ccf49b9422e775a116dde120877aefae069b9c76fb
dispatcher.register("skill471","acquire471",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill471/main.php a171e5faa3da15268d4c41be2c62022aba60eb8e35645010bf3d2a303b845b62
dispatcher.register("skill471","lost471",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill473/main.php a78a3f35a80181f5a902a8146a4995994fd5a1d254c0df282830bd4a7521a83e
dispatcher.register("skill473","acquire473",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill473/main.php 4b3ef9a659df3621ca71e4dd2f777214a9cbb997006f1b1d382b8d0b3f27c94c
dispatcher.register("skill473","lost473",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill262/main.php 87a424b528e611d88939f6197abc8228bc7e5cb23db7a3da7287354c96e5513d
dispatcher.register("skill262","acquire262",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys"]);
(await ctx.call("skillbase","skill_setvalue",262,"ct",0,v["pa"]));});
// include/modules/extra/club/skills/skill262/main.php 8545cc874d6092897bf01a5908d6e4ce31c8f74a6d6231f43b36dc7499897baa
dispatcher.register("skill262","lost262",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill263/main.php 5356d6973740c040adda3583c0a7b51fba5539d5df8bf97dae22b11025fcb85c
dispatcher.register("skill263","acquire263",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill263/main.php bf639fb12c277cab40ce373d24994609f0ad24c97469ce89237f3e480979f9ac
dispatcher.register("skill263","lost263",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill264/main.php de908099aa7d3f3eee287324959b9ce0fd65f1de158a41435d1f0b73d016dcf3
dispatcher.register("skill264","acquire264",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill264/main.php 1d3c5e044a50eac4809fc98b994ff6f8b65808245a41c0404f5b9746bc67b1a2
dispatcher.register("skill264","lost264",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/gtype3/skill476/main.php 57cbecca6a935b761d2831a60fab418ca71d4922b682a721fe4fce8c35b5d068
dispatcher.register("skill476","acquire476",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/gtype3/skill476/main.php e1b5cc8c070815502f7c5980414edd770bd3d34ed54eb19cb92973e9de195ca4
dispatcher.register("skill476","lost476",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill269/main.php 7447f284259cdded3a49c3f7356ec98f9e661ccd640c52aecde053b5e80f4a3e
dispatcher.register("skill269","acquire269",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill269/main.php c751f96932253660c86e04a323bcef92d3e363434299f84e317f4be11311f585
dispatcher.register("skill269","lost269",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill78/main.php ac722dd3e5b2c6ebfce876bccbcbdde09d27936a6f97664827c145f3a2e06905
dispatcher.register("skill78","acquire78",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill78/main.php 8f3b8f60212cd9ed5d54b856f7534ef6f3a42ee85d4a808d6cbcbffbc1ce15f5
dispatcher.register("skill78","lost78",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill496/main.php b39628966f7ec7bf5d06f4d77583d4c929e3a5cbfa4e721baabd75164d63e418
dispatcher.register("skill496","acquire496",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill496/main.php f1b9f0597d12dcab89d966cd744eed97e7315568027e5face59fb12e29739377
dispatcher.register("skill496","lost496",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill506/main.php 2fac6a87bfc42e1ef9bf93d21c2ae202d94cd6ab3b571989bcd2870129b62827
dispatcher.register("skill506","acquire506",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skill506","loadhp506",v["pa"]));
callbackImport(v,ctx,["sys"]);
if(phpTruthy(callbackGet(v["pa"],"type"))){callbackAppend(callbackEnsure(v["gamevars"],"skill506name"),callbackGet(v["pa"],"name"));}});
// include/modules/extra/card/skills/skill506/main.php 76bacd2dd039f5f593613d5bffdf9f22960918daaa2c611b2061b27bab6f0360
dispatcher.register("skill506","lost506",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skill506","savehp506",v["pa"]));});
// include/modules/extra/card/skills/skill515/main.php c5766b8d7137aef2f1017b3362b9eac7613819c23c08762530e7ae64c8f08824
dispatcher.register("skill515","acquire515",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill515/main.php f404a892edbf0fc553624ab1d1d44981fb03e5fc9661e8700ae617bf4afc8179
dispatcher.register("skill515","lost515",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill516/main.php 447eed96a3ba0ff5cf4e15e34b152740a8289b7c046dc674c7fb453193fe61a6
dispatcher.register("skill516","acquire516",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",516,"lastdmg","0",v["pa"]));});
// include/modules/extra/card/skills/skill516/main.php caa47817b399d32b6e0ac511780b816df38837caf5ba6eb95c436489ea8575b6
dispatcher.register("skill516","lost516",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill518/main.php 12a622cb3e4f0c31d49a60664e98738fde984a102d9b8059c3b97e39fe8c4163
dispatcher.register("skill518","acquire518",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",518,"rmtime","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",518,"areanum","0",v["pa"]));});
// include/modules/extra/card/skills/skill518/main.php 4a51316e38c4517f879f506dabd093482231f10dbb4daa20e4f3d3f5a716aabc
dispatcher.register("skill518","lost518",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill84/main.php 7a48437e1e3f38cd34cfbc946cc391f93dd938def3bc91e6ca9b5678fabcdfe4
dispatcher.register("skill84","acquire84",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys"]);
(await ctx.call("skillbase","skill_setvalue",84,"start_ts",v["now"],v["pa"]));
(v["skill84_time"]=(await ctx.call("skill84","get_skill84_time",v["pa"])));
(await ctx.call("skillbase","skill_setvalue",84,"end_ts",phpBinary("+",v["now"],v["skill84_time"]),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",84,"cd_ts",phpBinary("+",v["now"],v["skill84_time"]),v["pa"]));});
// include/modules/extra/club/skills/skill84/main.php daebc0f9cfd41bdd1c1ab3f127df634b7e2ed04b10c40757cfdf8482b307a520
dispatcher.register("skill84","lost84",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill527/main.php df45a5cf0933fc0bf60979a27b2b94a23c8fbac71e22fb8426cad5541f791d0a
dispatcher.register("skill527","acquire527",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",527,"rmt",4,v["pa"]));});
// include/modules/extra/card/skills/skill527/main.php 0b36015872ce9d969700445c5aa03d1ee9608ca5c5e28add6169c3409cb5afb9
dispatcher.register("skill527","lost527",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill528/main.php 7bc4f39edab42f9f7d1c632de3057d273184186ddb6e981dfe83772a62423a21
dispatcher.register("skill528","acquire528",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",528,"flag","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",528,"rmt","77",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",528,"cmd","",v["pa"]));});
// include/modules/extra/card/skills/skill528/main.php 20b83f04cc9e36f81d4dbe1efe292e8ec7affe4e998c5a4a823ccf9ea007c93c
dispatcher.register("skill528","lost528",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill529/main.php f0ef0f130273d9fd5475ad04100fbb964043ad1dd5e2d1f00e7c158f502302a9
dispatcher.register("skill529","acquire529",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",529,"activated",0,v["pa"]));});
// include/modules/extra/card/skills/skill529/main.php 81b1105a82b350a44096aa0880ccfa170108b3b598a0761228c7a352151293cf
dispatcher.register("skill529","lost529",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill531/main.php 98ea568b3ce67f467b311a46abd5ca133deb5fa1f69b4c2c32613cf430b5994e
dispatcher.register("skill531","acquire531",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill531/main.php e9e658002698542c8353e2f5b7cb28a0f1af4938cbba5a753d17cf09bd826d2c
dispatcher.register("skill531","lost531",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill532/main.php 5851660b7bce703f7fd67d8e0b4c7b71ef8dcca3ad7c383503a2b5c129ee6167
dispatcher.register("skill532","acquire532",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill532/main.php 0405e221fdb11799af4aac3798a51f632aff0181cf9323121886957071733ed9
dispatcher.register("skill532","lost532",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill552/main.php f6aea8f689d78daebaa18df348c2ee8b1ddac1ae0de10fff0fb91e30bf624865
dispatcher.register("skill552","acquire552",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill552/main.php 7ba2e328d0814576cf3a3ce26b74ca4b74eafb940d9ee5fdb4dca265665dbfbf
dispatcher.register("skill552","lost552",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/gmskills/skill1012/main.php efaff2b6c2044d5ac4f83ea6464f2e77274ba8f5923d40ad7f3ef59e241f2fad
dispatcher.register("skill1012","acquire1012",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/gmskills/skill1012/main.php 4d9917cea76f1a5131eb33f98c36d40670ba2af2b897c1c6493792b6963650df
dispatcher.register("skill1012","lost1012",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill553/main.php 535ab0b09d2f773dcf69a05df310e93d4331869b06aff179b603ecaeec715f5a
dispatcher.register("skill553","acquire553",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","player"]);
(await(async()=>{const ___list=callbackBuiltin("explode",[",",callbackBuiltin("date",["s,i,H,j,n,Y,w",v["now"]],ctx)],ctx);v["sec"]=callbackGet(___list,0);v["min"]=callbackGet(___list,1);v["hour"]=callbackGet(___list,2);v["day"]=callbackGet(___list,3);v["month"]=callbackGet(___list,4);v["year"]=callbackGet(___list,5);v["wday"]=callbackGet(___list,6);return ___list;})());
if(phpTruthy(phpBinary("==",4,v["wday"]))){callbackSet(v["pa"],"itm1","黄久鸡块");
callbackSet(v["pa"],"itmk1","HH");
callbackSet(v["pa"],"itme1",144);
callbackSet(v["pa"],"itms1",30);
callbackSet(v["pa"],"itm2","百世可乐");
callbackSet(v["pa"],"itmk2","HS");
callbackSet(v["pa"],"itme2",144);
callbackSet(v["pa"],"itms2",30);
callbackSet(v["pa"],"itm3","碎骨肉相连");
callbackSet(v["pa"],"itmk3","HB");
callbackSet(v["pa"],"itme3",100);
callbackSet(v["pa"],"itms3",10);
callbackSet(v["pa"],"itmsk3","");
callbackSet(v["pa"],"itm4","新奥尔良烤乌翅");
callbackSet(v["pa"],"itmk4","HB");
callbackSet(v["pa"],"itme4",100);
callbackSet(v["pa"],"itms4",10);
callbackSet(v["pa"],"itmsk4","");
callbackSet(v["pa"],"itm5","深海皇鱼堡");
callbackSet(v["pa"],"itmk5","HB");
callbackSet(v["pa"],"itme5",100);
callbackSet(v["pa"],"itms5",10);
callbackSet(v["pa"],"itmsk5","");
callbackSet(v["pa"],"itm6","葡式蛋挞");
callbackSet(v["pa"],"itmk6","HB");
callbackSet(v["pa"],"itme6",100);
callbackSet(v["pa"],"itms6",10);
callbackSet(v["pa"],"itmsk6","");
if(phpTruthy(phpBinary(">=",callbackGet(v["pa"],"money"),50))){callbackSet(v["pa"],"money",phpBinary("-",callbackGet(v["pa"],"money"),50));
(await ctx.call("skillbase","skill_lost",553,v["pa"]));}else{(await ctx.call("skillbase","skill_setvalue",553,"debt",phpBinary("-",50,callbackGet(v["pa"],"money")),v["pa"]));
callbackSet(v["pa"],"money",0);}}else{(await ctx.call("skillbase","skill_lost",553,v["pa"]));}});
// include/modules/extra/card/skills/skill553/main.php 8e4069a0a72ba5e7713ddeface033962fb390e0f8ec7ea756e766d7316f165f9
dispatcher.register("skill553","lost553",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill555/main.php e0d9644acb353320ff47b0b4d2a4d97c286f2eda6a0cc17eaaba247d19953fe0
dispatcher.register("skill555","acquire555",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill555"]);
(await ctx.call("skillbase","skill_setvalue",555,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",555,"cd_ts",0,v["pa"]));});
// include/modules/extra/card/skills/skill555/main.php 675c743bed009269365a4c97fe8fb027ef20f2d748dd9c2ff3d86b02b626c113
dispatcher.register("skill555","lost555",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill560/main.php 302fb2fbd886e1caa346f2cbb152efcb184efc634d8794110de71c5acd3b4c0b
dispatcher.register("skill560","acquire560",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",560,"affected_list","",v["pa"]));});
// include/modules/extra/card/skills/skill560/main.php 8fe106fc0dbe2f1d8deaa5cb4853905295a6e5628ea4483be2bff885d162c0ff
dispatcher.register("skill560","lost560",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",560,"affected_list",v["pa"]));});
// include/modules/extra/card/skills/skill534/main.php 11b97cadb2b35206be2f1a3e28988f4ea26a975be968d3fdd15f66d6531d7186
dispatcher.register("skill534","acquire534",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["skill534"]);
(await ctx.call("skillbase","skill_setvalue",534,"itmarr","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",534,"lvl",v["skill534_size"],v["pa"]));});
// include/modules/extra/card/skills/skill534/main.php 6d3a122977261e7b98fee389241bcffd05ed3356ed6b39a55c79512337ed8e50
dispatcher.register("skill534","lost534",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",534,"itmarr",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",534,"lvl",v["pa"]));});
// include/modules/extra/card/skills/skill561/main.php 9e2a1c49b82983ee60cecabe8433022382d09b9dc264ee3afcf28cfbfb74c05b
dispatcher.register("skill561","acquire561",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill561/main.php 9f82ffe3cda85679875df9819e16f3c2d232dcda6cc059b433daa2c8c71460be
dispatcher.register("skill561","lost561",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill556/main.php cffb9ab8c402ee9b8b63dd788a930fe0d57eda2c181dfe4cea30fb33a58e1143
dispatcher.register("skill556","acquire556",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",556,"choice",2,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",556,"targetpid",0,v["pa"]));});
// include/modules/extra/card/skills/skill556/main.php 36ac3f132c5441dd29b3d35e418edf6b9c1576a3b8ed05a2283c84be46a91924
dispatcher.register("skill556","lost556",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",556,"choice",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",556,"targetpid",v["pa"]));});
// include/modules/extra/club/skills/skill275/main.php 4400bd049222a77539f4580a43417b063bc884400542a14937d850d1c3a31529
dispatcher.register("skill275","acquire275",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill275/main.php fabeaf22ced1917262a1c2286072558b97c1029e8f2cabefa704fb7f5bd8f40e
dispatcher.register("skill275","lost275",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill276/main.php 29e2a898b159e2eea785e166eded54bffd143d431aae7c90cac775fbdf4d1e8e
dispatcher.register("skill276","acquire276",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",276,"activated",0,v["pa"]));});
// include/modules/extra/club/skills/skill276/main.php 3ea68e43ff234699b37baaed6765cc1148b306ca27b0e2fc212d55969ec75821
dispatcher.register("skill276","lost276",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill536/main.php 2bd65bea4eb82a2907ed2aad3996627eaa9e51d7a6c457198e31182545b19d60
dispatcher.register("skill536","acquire536",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",536,"activated","0",v["pa"]));});
// include/modules/extra/card/skills/skill536/main.php e7ff402f9efbbb0961bc7707c73d7601457901c81c7713330edc17fa4a741a56
dispatcher.register("skill536","lost536",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",536,"activated",v["pa"]));});
// include/modules/extra/card/skills/skill565/main.php 243551d8b1576cb6b7c4d7e2a66f14057ec69b04ccd6c35291b09097511a18b5
dispatcher.register("skill565","acquire565",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skill565","get_rand_skill",v["pa"],"feature",1));
(await ctx.call("skill565","get_rand_skill",v["pa"],"battle",2));
(await ctx.call("skill565","get_rand_skill",v["pa"],"upgrade",2));
(await ctx.call("skill565","get_rand_skill",v["pa"],"nonbattle",2));
(await ctx.call("skillbase","skill_lost",565,v["pa"]));});
// include/modules/extra/card/skills/skill565/main.php f63ee2fd4ee72bc8ce5759cfe6ed80e603f1e7536c7d5af9ac1dd499b5322555
dispatcher.register("skill565","lost565",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill537/main.php 848e3f402425261dc325ca69fbfe21cd55687f4b5bd6b0367e506b6e11bb4eda
dispatcher.register("skill537","acquire537",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",537,"activated","0",v["pa"]));});
// include/modules/extra/card/skills/skill537/main.php bdedd1ac0aef74e726813f7cd3f45d24f145f30f4bd04ef174bee5eb73e12e85
dispatcher.register("skill537","lost537",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",537,"activated",v["pa"]));});
// include/modules/extra/card/skills/skill569/main.php 226e01d766cc3765167891934e330d21fc4d194140bf71d9b1f46adfeffe2d78
dispatcher.register("skill569","acquire569",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill569/main.php db32318bd738847de8cf299e150bb83f5da5ed3f9800e48e6e3ee46d606c8961
dispatcher.register("skill569","lost569",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill571/main.php d2b186bdaeb7e93bc0ebc829d51f0da5e3adec09367191969fdeb5a108b8ac55
dispatcher.register("skill571","acquire571",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill571/main.php 006eaabfc6a3c2cbc666d906bcb0f1dbb3398be7be32d574de8c15f20a1819cb
dispatcher.register("skill571","lost571",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill572/main.php d92bd2197ca5c242c8bd206c78a416d993423f4515083cc807648e083e3d6ad4
dispatcher.register("skill572","acquire572",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skill572","add_skill572_mapitem"));
(await ctx.call("skillbase","skill_lost",572));});
// include/modules/extra/card/skills/skill572/main.php 9139bd5e7d8d596b7f1e46b3f43d18a26dbe61b4dc918bf1e4b1f3b5762d74a2
dispatcher.register("skill572","lost572",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill577/main.php 2553a11d1c54f02c6c88e494dfa1473a3c24278cf6836407b145fc4f220ac98f
dispatcher.register("skill577","acquire577",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill577/main.php 0f715f591f4987583975a4e753eeba740ded308b78d7b3fc648fd154889c5d7c
dispatcher.register("skill577","lost577",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill581/main.php 341be8ccbb7e2ceab344fe0b83c18f5b5240fd2fab50b2a7d7c4aabb0d684fa8
dispatcher.register("skill581","acquire581",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill581/main.php 5a1a26032cdc6c53382bc2679ae1585546461fcf1b1ca229a03b26f854df3e56
dispatcher.register("skill581","lost581",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill582/main.php 54e866e9953788813f5b86e54c5ce7d1e30bae8c330874e067019d79b85b202a
dispatcher.register("skill582","acquire582",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",582,"choice","2",v["pa"]));});
// include/modules/extra/card/skills/skill582/main.php aac626b705eaa805306f67efff2740864e241b11e29efec3156b54e7754d8ff6
dispatcher.register("skill582","lost582",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",582,"choice",v["pa"]));});
// include/modules/extra/card/skills/skill583/main.php 2945a99c10f09b64ec6b2afe2c8b3c8e320a5a78e2412853a64a9d4bd03a0fec
dispatcher.register("skill583","acquire583",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",583,"activated","0",v["pa"]));});
// include/modules/extra/card/skills/skill583/main.php 7ef9d60ab41b044d675518bf587aca1732d7d28714268a2edf2fc99588a5823a
dispatcher.register("skill583","lost583",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",583,"activated",v["pa"]));});
// include/modules/extra/card/skills/skill589/main.php f4784b859af62ba169f4fdaa2504671e30f5ae18ec52242f665c9826ddf0159b
dispatcher.register("skill589","acquire589",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill589/main.php 31e44fab05935299615c6ee6e8dd541e6fdc901abd4cb8ac83c8bf1ff6c1e312
dispatcher.register("skill589","lost589",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill590/main.php 23aec48c291578c5af98d858130fff5e09ae59e77c27e652f136962d5a6c1111
dispatcher.register("skill590","acquire590",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",590,"dmgreduce",(await ctx.call("skill590","get_sk590_dmgreduce",v["pa"])),v["pa"]));});
// include/modules/extra/card/skills/skill590/main.php 015383e934a3bef8a7d1304fef2db79a838323eedfa6cc2b52a7f59c5a91164b
dispatcher.register("skill590","lost590",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",590,"dmgreduce",v["pa"]));});
// include/modules/extra/card/skills/skill539/main.php f88d8583191be24efcac56a28b2197d7f8457e31a174dc329d4a95df6b1795b3
dispatcher.register("skill539","acquire539",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",539,"activated_num","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",539,"lastdeath","0",v["pa"]));});
// include/modules/extra/card/skills/skill539/main.php 4d97c1dd3790d3b48e355f9ea67b8e007dfe41db3b9d09b8ba0cce48405e237b
dispatcher.register("skill539","lost539",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill591/main.php 7bf1d0ec48e58235047a782c3bd1d3ad807289a1b32eb809c4d8abc77d816d63
dispatcher.register("skill591","acquire591",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill591/main.php 63546643f904ee6a01d479a8f6e2b1581f703d8abd5cc8f3418ed0a2460230af
dispatcher.register("skill591","lost591",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill594/main.php 90702a114fb20c1886ecc4579af0941bf105eaaf7d0b18c107b02ea6a1eb7a02
dispatcher.register("skill594","acquire594",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(v["usecount"]=(await ctx.call("skillbase","skill_getvalue",594,"usecount",v["pa"])));
callbackImport(v,ctx,["logger"]);
if(phpTruthy(phpBinary(">=",v["usecount"],3))){(v["log"]=phpBinary(".",v["log"],"<span class=\"yellow b\">看起来你的身体无法承受药剂的能量……<br>果然这一点都不值得……<br></span>"));
callbackSet(v["pa"],"state",34);
(await ctx.call("player","update_sdata"));
callbackSet(v["pa"],"sourceless",1);
(await ctx.call("player","kill",v["pa"],v["pa"]));
(await ctx.call("player","player_save",v["pa"]));
(await ctx.call("player","load_playerdata",v["pa"]));}else{(await ctx.call("skillbase","skill_setvalue",594,"usecount",phpBinary("+",Math.trunc(phpNumber(v["usecount"])),1),v["pa"]));
(v["log"]=phpBinary(".",v["log"],"<span class=\"yellow b\">你感到力量充满了全身！你的生命上限、体力上限、攻击力和防御力暂时增加了。</span><br>"));
callbackSet(v["pa"],"mhp",phpBinary("+",callbackGet(v["pa"],"mhp"),300));
callbackSet(v["pa"],"hp",phpBinary("+",callbackGet(v["pa"],"hp"),300));
callbackSet(v["pa"],"msp",phpBinary("+",callbackGet(v["pa"],"msp"),300));
callbackSet(v["pa"],"sp",phpBinary("+",callbackGet(v["pa"],"sp"),300));
callbackSet(v["pa"],"att",phpBinary("+",callbackGet(v["pa"],"att"),888));
callbackSet(v["pa"],"def",phpBinary("+",callbackGet(v["pa"],"def"),888));}});
// include/modules/extra/card/skills/skill594/main.php 90e0dbad8d2008fe63a11aae4850de83408eeadea6c4ef56680d50f7efe34625
dispatcher.register("skill594","lost594",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackSet(v["pa"],"mhp",phpBinary("-",callbackGet(v["pa"],"mhp"),200));
if(phpTruthy(phpBinary("<=",callbackGet(v["pa"],"mhp"),0))){callbackSet(v["pa"],"mhp",1);}
callbackSet(v["pa"],"hp",(await ctx.call("skill594","min",callbackGet(v["pa"],"hp"),callbackGet(v["pa"],"mhp"))));
callbackSet(v["pa"],"msp",phpBinary("-",callbackGet(v["pa"],"msp"),200));
if(phpTruthy(phpBinary("<=",callbackGet(v["pa"],"msp"),0))){callbackSet(v["pa"],"msp",1);}
callbackSet(v["pa"],"sp",(await ctx.call("skill594","min",callbackGet(v["pa"],"sp"),callbackGet(v["pa"],"msp"))));
callbackSet(v["pa"],"att",phpBinary("-",callbackGet(v["pa"],"att"),666));
callbackSet(v["pa"],"def",phpBinary("-",callbackGet(v["pa"],"def"),666));});
// include/modules/extra/card/skills/skill574/main.php a428f9613f46de200b9952117feb0a00d4d02193e8abdf2c472830efdf1f690f
dispatcher.register("skill574","acquire574",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill574/main.php ac2e0d1160f4b35ad2a8d2bd1ca47119f95e5a948a029808dae3c7416a5876ba
dispatcher.register("skill574","lost574",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill702/main.php e9daab201f97285acee08a08344c3670a2ddc26b16aba66e30783bad689ede42
dispatcher.register("skill702","acquire702",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill702/main.php 7bee4f603705d788193e05a22f15bc4b261d9f04f8b2576370fd1e0818b8d5a8
dispatcher.register("skill702","lost702",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill704/main.php abe6549ca1820226daf691beb12a3020903510917c18f1dc0e9acf9568b05c6e
dispatcher.register("skill704","acquire704",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill704/main.php 64bbe135401cd3dd5142c57bfc461f5596da24c0590e347e6289247d9bf75f16
dispatcher.register("skill704","lost704",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill703/main.php 7098b2a17b17f3b716881afbdb78ac805058298fa44dbe012f3d592469a536a8
dispatcher.register("skill703","acquire703",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill703/main.php 1de14a1f6327ba7edf5110ef0956176f46af1a6e9b2c953cd1f735a8227b339b
dispatcher.register("skill703","lost703",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill706/main.php 2509e4da2050f0b033a12d58faba555efc74bff4382ede258a8752f2f67a5930
dispatcher.register("skill706","acquire706",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill706/main.php d9aa12bf67e8019a613c671e4b20656b0aa82df32df687ec5867b6bcdacc0afa
dispatcher.register("skill706","lost706",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill708/main.php 1efeca484d95ee0b576452f1fbad1a44ba1de02c06b673c89eb70bd465a87a12
dispatcher.register("skill708","acquire708",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill708/main.php cb73012309cc40e3d7d82ca48c9a7ae219a2a967e4f98d40d712854e93ba039b
dispatcher.register("skill708","lost708",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill301/main.php 8fa467ad83505d7cfcdbeecba246883d9bb4af8ab60a72d2a84039cd8bbb3375
dispatcher.register("skill301","acquire301",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",301,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill301/main.php 2171f60376e2ef0193423be1583cfc11b5ba81f45b78d5280cee005153765220
dispatcher.register("skill301","lost301",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill307/main.php 6a83c57826faa88d901adafec0cfe98b7e572da07378120b27c9b99321d27a35
dispatcher.register("skill307","acquire307",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",307,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill307/main.php 8e2dacf07d14e15f2bf979a68f59a86d5ed964a702b6018733541cca3156ea45
dispatcher.register("skill307","lost307",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill318/main.php 1421b50811b9e02927b514a4bf52f5f3baf068f449cb3d847b76a0761c413deb
dispatcher.register("skill318","acquire318",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",318,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill318/main.php 25a25741573a2ae722389027cf15d45eb31e7f518f153a1364f3af8ad07b2a8f
dispatcher.register("skill318","lost318",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill322/main.php aee028e29b0030fa5086fae6b6e3e0fb743f8e0c178d320b955e71f2f7e86598
dispatcher.register("skill322","acquire322",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",322,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill322/main.php afd32d0b62d7b2c65d8d917e92c0bf63dbf6e127864434c6fd082a06ad62511e
dispatcher.register("skill322","lost322",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill323/main.php b335086f9f741a241014c4ee23439b27612b2b2edccf2fb6e43d53a51570abf5
dispatcher.register("skill323","acquire323",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",323,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill323/main.php f47e91e707bc1184de000a49cbe17bd22a4730233e8072f948dea3f930fddf8c
dispatcher.register("skill323","lost323",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill715/main.php 680bece88dbdc1bbf9c22983e670017161c774cfe5f1ae291eae31b209532336
dispatcher.register("skill715","acquire715",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill715"]);
(await ctx.call("skillbase","skill_setvalue",715,"expire",phpBinary("+",v["now"],v["skill715_act_time"]),v["pa"]));});
// include/modules/extra/card/skills/skill715/main.php d405b9850aed5631e1aa16c228e1272fa15b0761b3ff665ead8bc323a70d37f0
dispatcher.register("skill715","lost715",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill586/main.php 439cf0168afb2fbfb30906fdedeac0e746e0a760ed1d3663f9dded0bb8c2bd8b
dispatcher.register("skill586","acquire586",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",586,"itmarr","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",586,"npcarr","",v["pa"]));});
// include/modules/extra/card/skills/skill586/main.php a5ec1e0fbf6112d541a21b59c8dc3f05e2efc7c06be43a26c0e7320ceceebdf0
dispatcher.register("skill586","lost586",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",586,"itmarr",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",586,"npcarr",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",586,"lvl",v["pa"]));});
// include/modules/extra/instance/instance3_ascension/skill902/main.php c49be405325805de9014d550e9de7cc74375a6696d25c936e44d99980e0c0b98
dispatcher.register("skill902","acquire902",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",902,"lvl","0",v["pa"]));});
// include/modules/extra/instance/instance3_ascension/skill902/main.php d0eb92877c35aaf13b8d3cb96a48654b3609b56a322e414dd09a7deea3e1813a
dispatcher.register("skill902","lost902",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/instance3_ascension/skill907/main.php fa50c694db9fa0e903bea1cfce2bb6a79aaa7a6073acb97d0239081f4cb4ac16
dispatcher.register("skill907","acquire907",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/instance3_ascension/skill907/main.php 4b942907e7e63b0ba782a82d61fda879e4933880077b541b65fec5db70327b88
dispatcher.register("skill907","lost907",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/instance3_ascension/skill904/main.php 6728cb5dc43b9007699ad9d2b5bc3d4b4a4ee317c7e37d157a5c35c791c89b7e
dispatcher.register("skill904","acquire904",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",904,"lvl","0",v["pa"]));});
// include/modules/extra/instance/instance3_ascension/skill904/main.php dc7a7b477ad9b423d73c55fea020280062900489d492752b3bf179dbd7abb6ba
dispatcher.register("skill904","lost904",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill801/main.php 56cbe610771c5ea2540df472cd27fb32228740d7a0ed2385a463b369f750651f
dispatcher.register("skill801","acquire801",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",801,"pidlist","",v["pa"]));});
// include/modules/extra/card/skills/skill801/main.php 1065cffe2d761cc40c4011b7fd419f0d4c1b4bda1432dee23a10a58a11f770d8
dispatcher.register("skill801","lost801",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",801,"pidlist",v["pa"]));});
// include/modules/extra/card/skills/skill802/main.php ddb88b410eb6303dfde99bc24a30da2fc3c81da54a5d47fe370842cac63ac8b5
dispatcher.register("skill802","acquire802",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",802,"lvl","0",v["pa"]));});
// include/modules/extra/card/skills/skill802/main.php 1ec6258201786ade256f81c75be8ded07b6a121e305a60a5c3f1ba3147606969
dispatcher.register("skill802","lost802",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",802,"lvl",v["pa"]));});
// include/modules/extra/card/skills/skill716/main.php cbcc007294ee131acafa9f38897d447631fd1523813d3ac7b7bb00b8ef18603b
dispatcher.register("skill716","acquire716",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill716/main.php 18329e4df813fbec47f84a7727f33eefdfba922c7f1c9fce11a9aa81a07a9285
dispatcher.register("skill716","lost716",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill718/main.php 62f6ae0fab8ad4ed6a6d31ca60a393d6428d72453d6a51604d96c2a9c2892268
dispatcher.register("skill718","acquire718",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
if(phpTruthy(callbackBuiltin("rand",[0,1],ctx))){(await ctx.call("skillbase","skill_lost",718,v["pa"]));}});
// include/modules/extra/card/skills/skill718/main.php 2e68afd8cd6552cb26f13c0a7965f7bf72166fa8a1642f2dbe0f90a1cb6fc518
dispatcher.register("skill718","lost718",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill717/main.php 2e3c191959b9058183fec32fa3f063dec2d87a93314460be3190a7ee944e4c3e
dispatcher.register("skill717","acquire717",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill717/main.php fbf6f0bf88b17556a90605034ef55255e3ee22e147add35da78c7c78026a9fab
dispatcher.register("skill717","lost717",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill719/main.php 013af6833c0c6bcd93951bba17aaddc44e04226f97dbc59baa3a609e40f7bd9d
dispatcher.register("skill719","acquire719",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",719,"acount",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",719,"lastkillnum",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",719,"release",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",719,"warned",0,v["pa"]));});
// include/modules/extra/card/skills/skill719/main.php 803c7de8e1cc1131ee599757eb6c2e931d578660d27b44c4999c489c21adefd3
dispatcher.register("skill719","lost719",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",719,"acount",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",719,"lastkillnum",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",719,"release",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",719,"warned",v["pa"]));});
// include/modules/extra/club/skills/skill85/main.php 68c001c09f0f75d2cb9460a535e1f57a2d3b76898226ee5dd591ef6668243f1f
dispatcher.register("skill85","acquire85",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",85,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill85/main.php 3e7a9b866d05ed8e086aca00106f4a3fbd9f4da3612bce2cfc4d75d5c2f1674b
dispatcher.register("skill85","lost85",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",85,"lvl",v["pa"]));});
// include/modules/extra/instance/instance10_rogue/skill952/main.php 43e0c6916e3c938b30bb167137881a406484d3ab1dfae8aae8024db638fa312d
dispatcher.register("skill952","acquire952",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",952,"itmarr","",v["pa"]));});
// include/modules/extra/instance/instance10_rogue/skill952/main.php 1e3240186f0a5fa56fc6da518b389df75ca44a98e65b0560dc6c053ad9814723
dispatcher.register("skill952","lost952",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",952,"itmarr",v["pa"]));});
// include/modules/extra/instance/instance10_rogue/skill951/main.php 3268d663af2899e8d4b33928279311f59a3527151ec404b4ba0be9bea95ab2fd
dispatcher.register("skill951","acquire951",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/instance10_rogue/skill951/main.php 090688c329ad37a1b4e9b887af9aa37335dc6cddd51ee6ddb9769ed2eed335a7
dispatcher.register("skill951","lost951",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill724/main.php 502d8191b28085c899bb2e014c805be3c80f7e90151aadb072e97ecacfc9d184
dispatcher.register("skill724","acquire724",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill724/main.php a13d7ec7ca471361d6c31895d1800a519a1ee441142f7a4df705abd2134099b1
dispatcher.register("skill724","lost724",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill95/main.php 61fc728a2b30745e3e55b58425635910af30ec182819f29c16f011859d9ef621
dispatcher.register("skill95","acquire95",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",95,"spid","0",v["pa"]));});
// include/modules/extra/club/skills/skill95/main.php ce831529f4fae89dddc45cc2e906331101e0e68bee3b208e5b09761b9f66979a
dispatcher.register("skill95","lost95",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",95,"spid",v["pa"]));});
// include/modules/extra/card/skills/skill725/main.php 150ca97a12880d61fec2e889e55140c7e4f24cdba3a10b0eba85a74bc7d44b68
dispatcher.register("skill725","acquire725",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",725,"choice",2,v["pa"]));});
// include/modules/extra/card/skills/skill725/main.php 5f0667c931244c9726937e520623829451524f8189a98a0965c0aa7553f11a8f
dispatcher.register("skill725","lost725",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",725,"choice",v["pa"]));});
// include/modules/extra/card/skills/skill804/main.php fdb941582ba4484f0661aa95a5c5b0181330ff98dcb68274c23999ba16d0b379
dispatcher.register("skill804","acquire804",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill804/main.php 581a1f3da10572f9fabbb0a447ea9090e4534269dd872a0f7a91ad6633d86836
dispatcher.register("skill804","lost804",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill728/main.php 7c554448f36aaa2c9a23c6a8f05b806f49724fd45cf1032da71165b66030ac92
dispatcher.register("skill728","acquire728",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill728/main.php 2e226c97f8e46dc430078228c388324b837baa622bb8cebdee000ebbfbc51985
dispatcher.register("skill728","lost728",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill735/main.php f3d91d33bf29eb4631e4cbf533909590db8cc7a159119d49a81be1e4d788d63f
dispatcher.register("skill735","acquire735",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill735/main.php ba666e1c5f6612452adefc73d69f65a30a00ed0f88b13928a06d99a6e5d91312
dispatcher.register("skill735","lost735",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill736/main.php 8798eecf004071c21f00eb2c8ec233ed1d397efb407862e4ae913842b9a03d4c
dispatcher.register("skill736","acquire736",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",736,"lvl",0,v["pa"]));});
// include/modules/extra/card/skills/skill736/main.php e73b4314b73f36dfee1f3c2b241c9d98be3d7565a1ee86c53dfc661413634451
dispatcher.register("skill736","lost736",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",736,"lvl",v["pa"]));});
// include/modules/extra/club/skills/skill110/main.php cce531cd1a209668040dfdc79ab0907d1cbd609d49125914b21210425c7eb0f5
dispatcher.register("skill110","acquire110",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",110,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",110,"cd_ts",0,v["pa"]));});
// include/modules/extra/club/skills/skill110/main.php f6fbbcabb3587efb2986061ab4b220c2599488e41260b52c8b88d2cdc66da735
dispatcher.register("skill110","lost110",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/gmskills/skill1013/main.php d4ae72ecd3ead75348c110d34ef3b00d05e7863f289dedcc3d6ff1c5f9c00d99
dispatcher.register("skill1013","acquire1013",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/gmskills/skill1013/main.php 7b8aaaaa75f09b8382f24fb474bdc35cf098198df219349441ae972ea08e9198
dispatcher.register("skill1013","lost1013",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill743/main.php b207a2fbae68195968320a783cafe5b7610cfb21697ea05c604587f477114d81
dispatcher.register("skill743","acquire743",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",743,"trapnames","",v["pa"]));});
// include/modules/extra/card/skills/skill743/main.php 596b1940d3d9fcf5efa04e4af0f63fd8cd674dc519d54e2886b1f3fc88255041
dispatcher.register("skill743","lost743",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",743,"trapnames",v["pa"]));});
// include/modules/extra/card/skills/skill744/main.php 012891aca00141d47e9cf162d1d71ce3d85079a7ed729d1a9e7df0e46f37da68
dispatcher.register("skill744","acquire744",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",744,"lvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",744,"exflag","0",v["pa"]));});
// include/modules/extra/card/skills/skill744/main.php 39213687f6c395a96ef8b5fc85873766c0ca6004576a449e18559f9396dad821
dispatcher.register("skill744","lost744",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",744,"lvl",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",744,"exflag",v["pa"]));});
// include/modules/extra/club/skills/skill606/main.php 64690efbccfa8e567a934feda69aaa6be2c9ca03183c5d27a1c9b4f3aeaf2237
dispatcher.register("skill606","acquire606",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill606/main.php 71390b852a8b85710453f4b92de9ad71d3de1eaf767648315c9870d011f93844
dispatcher.register("skill606","lost606",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(v["uip"]=callbackBuiltin("get_var_in_module",["uip","sys"],ctx));
callbackSet(callbackGet(v["uip"],"effect"),"class_changeto",callbackArray([[0,"rotater_2"],[1,"rotater"]]));});
// include/modules/extra/club/skills/skill273/main.php 061890d1ee10755ac62c7634d8d8b7504f7aa03366b79e95ed34ca89c05a80c8
dispatcher.register("skill273","acquire273",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",273,"choice","1",v["pa"]));});
// include/modules/extra/club/skills/skill273/main.php c0ea2c73521f21e755c583d623bf583ba4bbdb73f61dc87fc67c299b306b3ef7
dispatcher.register("skill273","lost273",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",273,"choice",v["pa"]));});
// include/modules/extra/club/skills/skill209/main.php 09aa903941a52fc4eefccf33926e8a24fdcc83b9960e4ae785e86b4c1e8ceb2a
dispatcher.register("skill209","acquire209",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill209/main.php d77437a4419026c514f476065da600b87190af0a0c21ea3952b436416db42412
dispatcher.register("skill209","lost209",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/attr/skills/skill5/main.php b553f7932e90aa8b91eb9081cb868e795523b0b888ba161b6e603b40ef964fa4
dispatcher.register("skill5","acquire5",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/attr/skills/skill5/main.php 3117948a28a6a9456bef4f84b261f8cac05f984af8f054935b7471f27b2f3858
dispatcher.register("skill5","lost5",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/attr/skills/skill6/main.php 7213c98b819541069f20b1e4bab1b95b92c9277c2e82409f1905f25b4a407e0d
dispatcher.register("skill6","acquire6",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/attr/skills/skill6/main.php ecb822bb73ad3adac6f5606d26b0573d132f6b0eccacfa72744a4745211cae3a
dispatcher.register("skill6","lost6",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/attr/skills/skill7/main.php 86a3b3c712f8a551e15d15347ab9374306fb32db1bba76cf1989c395642c2bda
dispatcher.register("skill7","acquire7",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/attr/skills/skill7/main.php 3a05e74f1f709556066e8f3c13dec2a2a5a4af38711b54835fa306304b478a63
dispatcher.register("skill7","lost7",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/attr/skills/skill8/main.php e40ed0f004d093e0270b2d61e9f2a87edfd0a10623e2ddf0fef53ba1a5ade1da
dispatcher.register("skill8","acquire8",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/attr/skills/skill8/main.php da98e2f562462b4c86e8bc38da2fbff95a7f4864a17cb8335b09c2cf39c376cb
dispatcher.register("skill8","lost8",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/attr/skills/skill9/main.php 181e6ac2770a3ac1e5c3c576b63de38bc2302e30f90fff856e95fe9a170ad0e8
dispatcher.register("skill9","acquire9",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/attr/skills/skill9/main.php 4b06b27f5db147fcd46874bc35dc16bf164d6f723bd852ff4780dff2ae3297af
dispatcher.register("skill9","lost9",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill12/main.php 9784a68c675e7be93f16ff17881dd8affd03f439df86578854219e54d761bf66
dispatcher.register("skill12","acquire12",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill12/main.php 34ec54a4ac7012cd2b8dce6d084cc3d2438dc2bef7313d0d7e90e805ce4c5d7a
dispatcher.register("skill12","lost12",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill223/main.php 314e2ccb799999495f3ab3006e0ed47ec32acb52d0889cb652129267a35d5e58
dispatcher.register("skill223","acquire223",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",223,"rmtime","2",v["pa"]));});
// include/modules/extra/club/skills/skill223/main.php 6ac7de96cf60e4c23054b6ad7b484ae6877a0c46e6f94434a6fccadc39056047
dispatcher.register("skill223","lost223",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill710/main.php e63db285e5d42bbcb5ad3ce503feea995180db30d26cf48fe2657b786f06ff45
dispatcher.register("skill710","acquire710",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill710/main.php 0593ac96a386b40b73039c8fbb6192337971be455109977a34a8375ac576e0a3
dispatcher.register("skill710","lost710",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill745/main.php 9f08560dbe75c436aa6e6667c995ce1907e6c3d907b63c0c7339ebcc92c18542
dispatcher.register("skill745","acquire745",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill745/main.php ef3c7d22c3ca4acfb9fc4b78fee31a0f32b5e791be8da7e79350ba88ba993b05
dispatcher.register("skill745","lost745",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/activities/halloween2017/skill331/main.php 3c5a5083277db34c970a0f043299e2feb4a7553f344d121761956fe02c04efdd
dispatcher.register("skill331","acquire331",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",331,"cnt","0",v["pa"]));});
// include/modules/extra/activities/halloween2017/skill331/main.php eb26d9378c69bafd42f0df169a077a5c6d0e276fce8ab9d511bcdaa619d5beb6
dispatcher.register("skill331","lost331",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",331,"cnt",v["pa"]));});
// include/modules/extra/club/skills/skill19/main.php bcbcc1f917cff0374f6dd926fd5501d7a54b3485c356508001e074492f12dc55
dispatcher.register("skill19","acquire19",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill19/main.php 211960da321d8399bc99844c2079e6ac9ca6f2d91bf640a472772be3e98bcce3
dispatcher.register("skill19","lost19",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill79/main.php 666265f00f148c76b9497899818a03b7157ade91a603935c6e8ebf2b7d79073e
dispatcher.register("skill79","acquire79",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill79/main.php 78149e1f68a64f48b342448a6811c04ef74ec53b0b5bb681f5d50303a063e105
dispatcher.register("skill79","lost79",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill31/main.php 63b6e2fc90cd54d51620b09652d5aca086fcb17e1d4a0175e2e4c947fbebf616
dispatcher.register("skill31","acquire31",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill31/main.php 85d06863c656adea0c9bf397ef7a6351588b10470422d04269a98834e7f6a5ca
dispatcher.register("skill31","lost31",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill242/main.php 2b52f902ae501f58725aea0c7b8f2b3ce9b9fd7232ba5909965d0da84e086ad8
dispatcher.register("skill242","acquire242",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",242,"c",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",242,"i",0,v["pa"]));});
// include/modules/extra/club/skills/skill242/main.php 35bd0e74b6df8280d80840ed24b725ae627b1651b17051084c238ecae4ccfd20
dispatcher.register("skill242","lost242",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",242,"c",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",242,"i",v["pa"]));});
// include/modules/extra/club/skills/skill53/main.php 7a5f37a5313564bddfeef02f3458e1542bb4b8cfc2bb9bbcb7e29c10ddbbdf47
dispatcher.register("skill53","acquire53",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",53,"l","0",v["pa"]));});
// include/modules/extra/club/skills/skill53/main.php c4dae5b57a38e36adead35ff10f01bede053ec0eccfa11b19ee696078a989dc2
dispatcher.register("skill53","lost53",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill55/main.php f82549a3086d0d2abb79ce87ba16f23b6a4b343302f2c4d9e5c519f4f009e0b7
dispatcher.register("skill55","acquire55",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",55,"l","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",55,"at","0",v["pa"]));});
// include/modules/extra/club/skills/skill55/main.php a07efdc5cf18c5c0e2d02baff805e9872cf345fc4597aedbbcf7161c96c0e5f9
dispatcher.register("skill55","lost55",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill72/main.php d85822e2ced73c88aa9c390f30a6aec3bad8d6124381e45434b8e7a30ea52772
dispatcher.register("skill72","acquire72",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",72,"t","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",72,"b","0",v["pa"]));});
// include/modules/extra/club/skills/skill72/main.php 0792045c274649fdc09edc6a88f0b3b51655e2c5f9b26ff5e2fd1561b7a0c274
dispatcher.register("skill72","lost72",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill227/main.php db23eee15063e5482600c2ec6c8b547f7d80f55b8bc2e0ddcd73707bdc8000fd
dispatcher.register("skill227","acquire227",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",227,"l","0",v["pa"]));});
// include/modules/extra/club/skills/skill227/main.php f582a458787c6e8dde119a7a2e5903564c1c11e75f9990899f80a5b993d1baef
dispatcher.register("skill227","lost227",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill472/main.php 25a40dc806401a0e18c63cf010289711069e85d9747cae148323df21e18bb173
dispatcher.register("skill472","acquire472",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",472,"l","0",v["pa"]));});
// include/modules/extra/card/skills/skill472/main.php 7c27a38074dfc87a8ce1bd4dcb9605a36eae1f5cd6020e04e1a4d534eb91cdc9
dispatcher.register("skill472","lost472",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill564/main.php 6b460a83237a6c60a262b9bb6bbd4b43765bbd7fe73166e3e8258ee794d267af
dispatcher.register("skill564","acquire564",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["skill564"]);
(await ctx.call("skillbase","skill_setvalue",564,"lastlvl",callbackGet(v["pa"],"lvl"),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",564,"chance",3,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",564,"limit",phpBinary("-",v["sk564_chance_limit"],3),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",564,"choices","0",v["pa"]));});
// include/modules/extra/card/skills/skill564/main.php 4647eb7e3d0f02292f06057114b7685c8c3323139c368dbb51303f6cccd93d8c
dispatcher.register("skill564","lost564",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",564,"lastlvl",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",564,"chance",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",564,"limit",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",564,"choices",v["pa"]));});
// include/modules/extra/instance/gtype2/skill475/main.php 1c8c6b5175e336af81a5fbbfd907222f299d08a35cd52d2f4f7d453eaab18b9e
dispatcher.register("skill475","acquire475",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",475,"wpt",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",475,"bounty",100,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",475,"dc",0,v["pa"]));});
// include/modules/extra/instance/gtype2/skill475/main.php 8fbd5b51a2d5528f4573d32e5e9b1f9663839930584db56246ae5d6852845aa9
dispatcher.register("skill475","lost475",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",475,"wpt",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",475,"bounty",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",475,"dc",v["pa"]));});
// include/modules/extra/club/skills/skill59/main.php e8ff0cd5892cc349505ff9ac6b6254054718bbe34229a0e4cd98b01fbd83266b
dispatcher.register("skill59","acquire59",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill59/main.php 0778ed3d2cee28eed98d6d9d9e3bf941e7853efd9828e3a036ed910220ff2f77
dispatcher.register("skill59","lost59",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/gtype1/skill425/main.php 28db5d6e7f7a0f7a6f3d0397c8f64337659367933b2436b3debc5f0f137f8e1b
dispatcher.register("skill425","acquire425",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill425"]);
(await ctx.call("skillbase","skill_setvalue",425,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",425,"cd_ts",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",425,"bribe_times","0",v["pa"]));});
// include/modules/extra/instance/gtype1/skill425/main.php 248254607443cd9a3ab16e476354e195e98163a9d619de9a0cc4d2c783795e0a
dispatcher.register("skill425","lost425",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/gtype1/skill427/main.php 0e54ecf6b53143163dca53ddeff2a8e9000819b28c89882d7efb9b162a984cbe
dispatcher.register("skill427","acquire427",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/gtype1/skill427/main.php ecf53ce752c557085ec31fbad8ffc103eb3073ec06b009f92ce7afa5a457a52a
dispatcher.register("skill427","lost427",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill260/main.php cae85b798d0b881aff21e6ded3103d0bf3b5d81a22cad0ee3eb551fec463a87d
dispatcher.register("skill260","acquire260",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill260/main.php 35534ec9d852b350ea3aecf4dc004c40e1a3f690bf1e8a4000b3e6c72e7a8b26
dispatcher.register("skill260","lost260",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill261/main.php 658a7be0d7c3cc8c1a41f4d7ae30f28764b64ffddd46c44f8b4b05b120cad7d1
dispatcher.register("skill261","acquire261",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill261"]);
(await ctx.call("skillbase","skill_setvalue",261,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",261,"cd_ts",0,v["pa"]));});
// include/modules/extra/club/skills/skill261/main.php 2e194defa283a575ab869d35cf825e5e76675244f1bd9985698e6f225fbcd564
dispatcher.register("skill261","lost261",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
if(phpTruthy(phpBinary(">",(await ctx.call("skillbase","skill_getvalue",261,"end_ts",v["pa"])),1))){callbackSet(v["pa"],"wp",(await ctx.call("skill261","floor",phpBinary("/",callbackGet(v["pa"],"wp"),2))));}});
// include/modules/extra/club/skills/skill274/main.php f3657c0f82f913406c7a17fb10b63b1d153ca67d10de35bf0a2aad4b5b548918
dispatcher.register("skill274","acquire274",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",274,"lvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",274,"unlocked","0",v["pa"]));});
// include/modules/extra/club/skills/skill274/main.php 0e67b164cdab340d8c029fc62637397fbb830eaf34791a51d3de03ff2845d030
dispatcher.register("skill274","lost274",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",274,"lvl",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",274,"unlocked",v["pa"]));});
// include/modules/extra/card/skills/skill511/main.php 6c68ebe59b4ca8532b9e43e62bbc0ef8fa42ec5bb9a66c4aa783f32604340f31
dispatcher.register("skill511","acquire511",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill511/main.php 02026f69e4a52da49e10928548a4fad94eb928ea2dbf46c87c6b2a1a5c4892cc
dispatcher.register("skill511","lost511",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill545/main.php 5896f04d31f9fc461ee19f39ab49830abcfe5b3e45c2d6878e6e2e45c24e7ea4
dispatcher.register("skill545","acquire545",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",545,"lastdeath","0",v["pa"]));});
// include/modules/extra/card/skills/skill545/main.php 82e495c0d4c15ff2acda09d1e83775699e8f4e4ee77a14dc67b727135f1553c6
dispatcher.register("skill545","lost545",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill403/main.php f18d940422ed86b283d34b6f938bf6463cdc07decf22216ab1e885778f53edd9
dispatcher.register("skill403","acquire403",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",403,"lvl","0",v["pa"]));});
// include/modules/extra/card/skills/skill403/main.php 87949eb8304587d8ebb80b234c1104aace078a3a6e26c61398d024acbb14c854
dispatcher.register("skill403","lost403",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",403,"lvl",v["pa"]));});
// include/modules/extra/club/skills/skill203/main.php f7792d436751843c02bf6c3941aa95950a1672f69e5a1ef6401f342dc9d5d469
dispatcher.register("skill203","acquire203",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill203/main.php c316a5c07f5604bfe8ba3292abbda2a9b4a51e875ec7407602eae347ec670717
dispatcher.register("skill203","lost203",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/instance3_ascension/skill901/main.php 4d3cc9660affe37791f8215268e0171dee3351daeb79600cc3aadffccd9f932b
dispatcher.register("skill901","acquire901",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",901,"lvl","0",v["pa"]));});
// include/modules/extra/instance/instance3_ascension/skill901/main.php 23b01568549b32c97ab7f0c9c66eef9609f0f2b38588ad17a0e16c213e818798
dispatcher.register("skill901","lost901",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill23/main.php 6633fa1ac19ca1da20cbde3b609f3fb5953790efd2cf75f8cea5ebbe41fd16d2
dispatcher.register("skill23","acquire23",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",23,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill23/main.php 4d46ae3e54e7ea479447d1b720b97f89a44f7ce55d592eb524d311f6ea2ba50c
dispatcher.register("skill23","lost23",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",23,"lvl",v["pa"]));});
// include/modules/extra/card/skills/skill517/main.php a1c2aa7384415bddff3dbe9ff8d53d7f9ac63b517304ce3023b9ca684ae25b7e
dispatcher.register("skill517","acquire517",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",517,"rmtime","2",v["pa"]));});
// include/modules/extra/card/skills/skill517/main.php ff0333aa79f7fe208463d3b763b5b1666794cb784b7e336e0504331f8f71349d
dispatcher.register("skill517","lost517",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",517,"rmtime",v["pa"]));});
// include/modules/extra/card/skills/skill407/main.php dbc2e23f61b720ca8c56cabb61cf0ea07b298456b6c836c9c741341e7c6c1fce
dispatcher.register("skill407","acquire407",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill407/main.php 10b9007facb70f29c619e362713982a09a9e5959f519ca30b5dffb8d5fe30836
dispatcher.register("skill407","lost407",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill32/main.php 67517d9d69d39ebd727171b0f02a671f750c5f02bb7d8b12f80bf82ec400846c
dispatcher.register("skill32","acquire32",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",32,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill32/main.php 2b124820cd30c80df60d310b4574b78c3a6a6ec5ab19043cf123831df33b2093
dispatcher.register("skill32","lost32",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",32,"lvl",v["pa"]));});
// include/modules/extra/club/skills/skill202/main.php 2a160967fa8965b1d5542c1d579772927a550743ae7eaea3d3ca2ea3124d3779
dispatcher.register("skill202","acquire202",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",202,"lvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",202,"spent","0",v["pa"]));});
// include/modules/extra/club/skills/skill202/main.php fdab4e03e292ef98bb717bede52c77a3a26036f1cb453ff190a05094d2824c77
dispatcher.register("skill202","lost202",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill445/main.php de6d9018c8b430b7f89651909ba86d8ca2e23dc2bca7fd257c26e8ea4b37076a
dispatcher.register("skill445","acquire445",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill445/main.php e4239f05a74b9ce2c3e0239fe69e6a51c0b8d767857ec19fabea61a2492fa42c
dispatcher.register("skill445","lost445",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill557/main.php 9b5b8e43011e76d395ed3ca38eea6223315a5ec7d3f89095b785ad4cc18ef401
dispatcher.register("skill557","acquire557",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill557/main.php 96c5cde5519536e0868a2229a2525bbc35127798ec61c31cf0528c415ffb9e00
dispatcher.register("skill557","lost557",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/base/skills/skill1/main.php a6544d2d2205c01204f9ad0ebf7082f0c9890affce95ece1bfbdc11e0da6666f
dispatcher.register("skill1","acquire1",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/base/skills/skill1/main.php 7f41080e476ac02700a57f570bcd2f90efd1c8b6315b9ae89344c40a43609354
dispatcher.register("skill1","lost1",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill562/main.php bdc7988a1b30e3541472f36ee10cfcf0f25560bf3bca70f84116589ccb18d99a
dispatcher.register("skill562","acquire562",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackSet(v["pa"],"state",1);
callbackSet(v["pa"],"mode","rest");
if(phpTruthy(phpBinary("<",callbackBuiltin("rand",[0,99],ctx),30))){callbackSet(v["pa"],"money",phpBinary("+",callbackGet(v["pa"],"money"),callbackBuiltin("rand",[10,300],ctx)));}});
// include/modules/extra/card/skills/skill562/main.php 31489063252a19c9d9dc5a602a6b711f1adcb36ff9cc37abb14c75f9245f335e
dispatcher.register("skill562","lost562",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill600/main.php 7b4bc582019ac49adada9fcc6562f0988e4aefb1eeced6b96dfe59dccaacf46a
dispatcher.register("skill600","acquire600",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill600/main.php f39085f47662290dcbaee8954f57f2b1129d71b2b438ccf26efc30f1db6084e7
dispatcher.register("skill600","lost600",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill487/main.php 303c419bfa4ebfa86df2b82ac16636e3e4ce745518c870216846a752d4bec43b
dispatcher.register("skill487","acquire487",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",487,"hlist","",v["pa"]));});
// include/modules/extra/card/skills/skill487/main.php ffd58a90a1e6929ea4d360c292ad6edcc50bd17f523ebad7bb74c8911c3d726f
dispatcher.register("skill487","lost487",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",487,"hlist",v["pa"]));});
// include/modules/extra/club/skills/skill20/main.php 1d831d43dc3cfc8667f807bd401ca6b7416950a96dd9f2dbb3bad0158b769b3f
dispatcher.register("skill20","acquire20",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill20/main.php bfd5337a84ddd35e760ca9f0ba3156eade7b7444f651aec6662112d16149b33d
dispatcher.register("skill20","lost20",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/gtype1/skill426/main.php e0710926e098049eec1c7af6d3ca01a9d4df19731f4ec639c5b204f9547668c5
dispatcher.register("skill426","acquire426",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",426,"lvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",426,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",426,"cd_ts",0,v["pa"]));});
// include/modules/extra/instance/gtype1/skill426/main.php 474cfe227e8bd873929dc67b5c985ae9e910de47c42f1c634427ea810ac17662
dispatcher.register("skill426","lost426",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill492/main.php 1f03cb59b512d14d08d54bad837c745cdbaba939afc0330e5922305e6ba0fa55
dispatcher.register("skill492","acquire492",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill492/main.php f88729b4632b686c3dc0b2d1dc2128e2dfdb18be115cb237eeff7f017d91969b
dispatcher.register("skill492","lost492",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill723/main.php 5d877f85033bcb5be5bbb250f72ada41114e6ea4a7a89461267930e7aa760135
dispatcher.register("skill723","acquire723",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill723/main.php f5e8a6fcef44a59b2c01f273f1821eba550d38699a8f7c073f23116c77d18656
dispatcher.register("skill723","lost723",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill24/main.php 1b672ec53f09e880a2a24c905623d33ada1f6944b65b5f18ea1c4c6c91a2d8db
dispatcher.register("skill24","acquire24",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill24/main.php c35a97a3eeed10c2a13e65b97fa3552ff868aebc0f9235acd0260250044ead76
dispatcher.register("skill24","lost24",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill33/main.php 033ceb22e3052758a1a7b1e88f33d6ecb235b04affa974a3afd487f1a6b0b547
dispatcher.register("skill33","acquire33",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",33,"choice","2",v["pa"]));});
// include/modules/extra/club/skills/skill33/main.php 58b465d0168547aae6149983f28b0fe319761b28f2106ef299902f5197459351
dispatcher.register("skill33","lost33",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",33,"choice",v["pa"]));});
// include/modules/extra/card/skills/skill579/main.php 91932e3b2c1550439139571816a11551873b0eb5922b173fdc8fc1725fad5c27
dispatcher.register("skill579","acquire579",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill579/main.php cad09716230e8e3c2142940c5cced2b896af75b85725f035a1986274acf39f2e
dispatcher.register("skill579","lost579",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/instance3_ascension/skill906/main.php b5e83c03da75ecd66646ef8cfd3e0a1b21e390ff980c1a7da0b04f16b9b167e3
dispatcher.register("skill906","acquire906",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",906,"lvl","0",v["pa"]));});
// include/modules/extra/instance/instance3_ascension/skill906/main.php 9db855984f25a756bb473e62d2859e509901237a1aecdf31381d70e8a4b52dda
dispatcher.register("skill906","lost906",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill502/main.php 0b67502624aecb97bf0a750120454d40788c1e991248baad750db58484ae8e1d
dispatcher.register("skill502","acquire502",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill502/main.php e06a4157f39e245ed45a46e0b5045ebbc641be3584fee54f2adc3ed60905bae7
dispatcher.register("skill502","lost502",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill599/main.php a99dadb763ddc37e83c9e48d467c522a0da7129e6787ed394ae33bab17855cc4
dispatcher.register("skill599","acquire599",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill599/main.php 7b5a1671b63d6cc1c7ad05b53dfd67f8d94fc1dcd6707283ccb69e98cbbb8b16
dispatcher.register("skill599","lost599",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill42/main.php a1d98722f7e29fe63b9c0cc5561586f871eecf412208d72e68c9fc2d48e590a5
dispatcher.register("skill42","acquire42",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill42/main.php 98d3b15b053885fabe1b9d1786faa132ab1f65722aea26208802d4392af6c32a
dispatcher.register("skill42","lost42",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",42,"u",v["pa"]));});
// include/modules/extra/club/skills/skill245/main.php d3832f9fa60e4f92aed79c2d9d13ce08e049dc75d9e9c7c8193f449fff8cde92
dispatcher.register("skill245","acquire245",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill245/main.php d0f447d7f409b465bd5a749ae4694b96238cf7d322cf43f98d0ae27ee991f642
dispatcher.register("skill245","lost245",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill252/main.php 71792803962c90883b07fb686b3e46da9409efc935a056f9d4b632532acde3ce
dispatcher.register("skill252","acquire252",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill252/main.php 4a004069357b0e39cdacb81c969462b661847103c9c126b470cf2a54b35ab0b9
dispatcher.register("skill252","lost252",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill270/main.php 7bb64678e6b59890393f74c69b6a2c7a36e4a1b8b374873c7d7911473eed1238
dispatcher.register("skill270","acquire270",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill270/main.php 1c1d2efd4c12ea9fec27005084ac83dca4bf721ba53403a7d97148da06202a3d
dispatcher.register("skill270","lost270",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill588/main.php 0c3c3501a04d775823fcd613e216cbd20586b6b32c42e5d561cd62c0a155dd64
dispatcher.register("skill588","acquire588",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill588/main.php 37ac42bc5517f890472c12fa3f0b351fbfe5ee5fb50109a2ba76211e3fb79f93
dispatcher.register("skill588","lost588",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill67/main.php 55782472aae95f05fc3c2925afec7f9cdb984be9438561db94398db4456fa41f
dispatcher.register("skill67","acquire67",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill67/main.php 4fbc50f8849fdb2d7d3d4c31ced75a0e102eed0daa3b3f7b220047f26fc66de6
dispatcher.register("skill67","lost67",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill584/main.php 4ea2dc668e187bb551ccbc7e93267c2d8f55a481db404dd4908bcadb0c884e02
dispatcher.register("skill584","acquire584",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill584/main.php 428b7874ef1e90a3a6ea5741dc942b79a1d5ca01c3c6056773f414cd70ec4545
dispatcher.register("skill584","lost584",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill592/main.php 067eb0d3062d7cbb1f01c6efc7a71ea3b1faed15766b76873496f976465aa051
dispatcher.register("skill592","acquire592",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill592/main.php 5d8555e71f5a6c68564c334b075c4b5cf9f124652219a3a1cad5c8927754fa2f
dispatcher.register("skill592","lost592",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill541/main.php ec6c26a33e480d4a2aa95609cebdaff6146ae786832d5f107ec26462a1d20ea6
dispatcher.register("skill541","acquire541",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill541/main.php 003e890e7b8878747619bab4daedbdf03be796855affb14d32c5538fa6225b2b
dispatcher.register("skill541","lost541",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill720/main.php d21203668c7f8a26e881eb737ad4e97607c5cf0098b634653851de20565f79d5
dispatcher.register("skill720","acquire720",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill720/main.php 333e1f44858ae09a1adf329f26da29a028073a7f9bfd50f394a08f136f6b1f1a
dispatcher.register("skill720","lost720",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill734/main.php c6649d9b5c0a21e808bace4ab027b1406310f5b4840ea2f2dd38a68048f5ce33
dispatcher.register("skill734","acquire734",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill734/main.php f45242b865a37d417d253abb7377c55d953e578f0d0281c58b352186091f6399
dispatcher.register("skill734","lost734",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill749/main.php 3eccee38a0af0f0bce15e6567d2aac37b8ee54730e6dca64a5c5dd34fd1ef4bf
dispatcher.register("skill749","acquire749",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill749/main.php d73c1a02290564754a4c9c5b889a9e311a6179fcaca5f2f18110f166e92d9539
dispatcher.register("skill749","lost749",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill43/main.php d4a5361f2aba230a1addafdf060b94e682efaada010043af5af1873274e76d35
dispatcher.register("skill43","acquire43",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill43/main.php 4cd6b6ab9a644fd66b0825230ec30cdb489331a33ee1dabf19a954d17bbc41e2
dispatcher.register("skill43","lost43",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill56/main.php a8870407e4ded44d4a9acbb7ada3ca7134bc115c13a954681e161974da90dc02
dispatcher.register("skill56","acquire56",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackGlobal(v,ctx,["skill56_lim"]);
(await ctx.call("skillbase","skill_setvalue",56,"t","0",v["pa"]));
for((v["i"]=1);phpTruthy(phpBinary("<=",v["i"],v["skill56_lim"]));(v["i"]=phpNumber(v["i"])+1)){(await ctx.call("skillbase","skill_setvalue",56,phpBinary(".","p",v["i"]),"0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",56,phpBinary(".","l",v["i"]),"0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",56,phpBinary(".","s",v["i"]),"0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",56,phpBinary(".","h",v["i"]),"0",v["pa"]));}});
// include/modules/extra/club/skills/skill56/main.php 952a23d54c690b2c0efbc1d515643713ce0c446c7abe08841f52c71681162341
dispatcher.register("skill56","lost56",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["skill56","sys","player"]);
(v["x"]=Math.trunc(phpNumber((await ctx.call("skillbase","skill_getvalue",56,"t")))));
for((v["i"]=1);phpTruthy(phpBinary("<=",v["i"],v["x"]));(v["i"]=phpNumber(v["i"])+1)){(v["is_hired"]=Math.trunc(phpNumber((await ctx.call("skillbase","skill_getvalue",56,phpBinary(".","h",v["i"]))))));
if(phpTruthy(phpBinary("==",v["is_hired"],1))){(v["spid"]=Math.trunc(phpNumber((await ctx.call("skillbase","skill_getvalue",56,phpBinary(".","p",v["i"]))))));
(v["ty"]=Math.trunc(phpNumber((await ctx.call("skillbase","skill_getvalue",56,phpBinary(".","s",v["i"]))))));
if(phpTruthy(phpBinary(">",v["spid"],0))){(v["employee"]=(await ctx.call("player","fetch_playerdata_by_pid",v["spid"])));
if(phpTruthy(phpBinary(">",callbackGet(v["employee"],"hp"),0))){(v["lastsal"]=Math.trunc(phpNumber((await ctx.call("skillbase","skill_getvalue",56,phpBinary(".","l",v["i"]))))));
if(phpTruthy(phpBinary(">=",phpBinary("-",v["now"],v["lastsal"]),60))){callbackSet(v["employee"],"money",phpBinary("+",callbackGet(v["employee"],"money"),v["money"]));
(v["money"]=0);}
if(phpTruthy(phpBinary("==",callbackGet(callbackGet(callbackGet(v["skill56_npc"],"sub"),v["ty"]),"mercfireaction"),1))){callbackSet(v["employee"],"pls",999);}
(await ctx.call("skillbase","skill_setvalue",56,phpBinary(".","h",v["i"]),0));
(await ctx.call("player","player_save",v["employee"]));}}}}});
// include/modules/extra/card/skills/skill435/main.php 0b05318dea97409b6ced45b7cb4eace5da16f2c516f11e90eab8a83b2bc484e0
dispatcher.register("skill435","acquire435",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackGlobal(v,ctx,["skill435_lim"]);
(await ctx.call("skillbase","skill_setvalue",435,"t","0",v["pa"]));
for((v["i"]=1);phpTruthy(phpBinary("<=",v["i"],v["skill435_lim"]));(v["i"]=phpNumber(v["i"])+1)){(await ctx.call("skillbase","skill_setvalue",435,phpBinary(".","p",v["i"]),"0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",435,phpBinary(".","l",v["i"]),"0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",435,phpBinary(".","s",v["i"]),"0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",435,phpBinary(".","h",v["i"]),"0",v["pa"]));}});
// include/modules/extra/card/skills/skill435/main.php 492ef05fc3cf1e8f4d77023bdbfa78ec98990d2b7b54529e5a5d9e76bdfd559d
dispatcher.register("skill435","lost435",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["skill435","sys","player"]);
(v["x"]=Math.trunc(phpNumber((await ctx.call("skillbase","skill_getvalue",435,"t")))));
for((v["i"]=1);phpTruthy(phpBinary("<=",v["i"],v["x"]));(v["i"]=phpNumber(v["i"])+1)){(v["is_hired"]=Math.trunc(phpNumber((await ctx.call("skillbase","skill_getvalue",435,phpBinary(".","h",v["i"]))))));
if(phpTruthy(phpBinary("==",v["is_hired"],1))){(v["spid"]=Math.trunc(phpNumber((await ctx.call("skillbase","skill_getvalue",435,phpBinary(".","p",v["i"]))))));
(v["ty"]=Math.trunc(phpNumber((await ctx.call("skillbase","skill_getvalue",435,phpBinary(".","s",v["i"]))))));
if(phpTruthy(phpBinary(">",v["spid"],0))){(v["employee"]=(await ctx.call("player","fetch_playerdata_by_pid",v["spid"])));
if(phpTruthy(phpBinary(">",callbackGet(v["employee"],"hp"),0))){(v["lastsal"]=Math.trunc(phpNumber((await ctx.call("skillbase","skill_getvalue",435,phpBinary(".","l",v["i"]))))));
if(phpTruthy(phpBinary(">=",phpBinary("-",v["now"],v["lastsal"]),60))){callbackSet(v["employee"],"money",phpBinary("+",callbackGet(v["employee"],"money"),v["money"]));
(v["money"]=0);}
if(phpTruthy(phpBinary("==",callbackGet(callbackGet(callbackGet(v["skill435_npc"],"sub"),v["ty"]),"mercfireaction"),1))){callbackSet(v["employee"],"pls",999);}
(await ctx.call("skillbase","skill_setvalue",435,phpBinary(".","h",v["i"]),0));
(await ctx.call("player","player_save",v["employee"]));}}}}});
// include/modules/extra/activities/nationalday2017/skill329/main.php 3b7feed602c163915a4f9206149b43fe005078fdb49a4c8b475caff8893415d2
dispatcher.register("skill329","acquire329",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",329,"cnt","0",v["pa"]));});
// include/modules/extra/activities/nationalday2017/skill329/main.php 71dc0674a6c3288fde58254d7ae81f01dc4f8143ae94f277318feab2ef8859a8
dispatcher.register("skill329","lost329",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",329,"cnt",v["pa"]));});
// include/modules/extra/card/skills/skill512/main.php 51af26bacb8b901e9c390f31c380c06b6e3597fb5a7a92ecdea1073329634128
dispatcher.register("skill512","acquire512",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",512,"type","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",512,"sub","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",512,"num","1",v["pa"]));});
// include/modules/extra/card/skills/skill512/main.php 69f8cc5464af8636b407457806081ecd502f79a4ce653769e09dfa8a17272a5a
dispatcher.register("skill512","lost512",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/instance10_rogue/skill961/main.php b972291e3b60180cb85d88bc6f7548648c0e6d5b673797ba025fa7b7bdbf14e4
dispatcher.register("skill961","acquire961",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys"]);
(v["vippid"]=(await ctx.call("addnpc","addnpc",61,0,1,callbackGet(v["pa"],"pls"))));
if(phpTruthy(!phpTruthy(callbackGet(v["pa"],"teamID")))){do{(v["tID"]=phpBinary(".","ST",callbackBuiltin("rand",[1000,9999],ctx)));
(v["tPass"]=callbackBuiltin("rand",[1000,9999],ctx));
(v["result"]=(await callbackMethod(v["db"],"query",[(phpString("SELECT pid FROM ") + phpString(v["tablepre"]) + phpString("players WHERE teamID='") + phpString(v["tID"]) + phpString("'"))])));}while(phpTruthy((await callbackMethod(v["db"],"num_rows",[v["result"]]))));
(await ctx.call("team","teammake",v["tID"],v["tPass"]));}
(v["vip"]=(await ctx.call("player","fetch_playerdata_by_pid",callbackGet(v["vippid"],0))));
callbackSet(v["vip"],"teamID",callbackGet(v["pa"],"teamID"));
callbackSet(v["vip"],"teamPass",callbackGet(v["pa"],"teamPass"));
(await ctx.call("player","player_save",v["vip"]));
(await ctx.call("skillbase","skill_setvalue",961,"vippid",callbackGet(v["vippid"],0),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",961,"dest",callbackBuiltin("end",[v["arealist"]],ctx),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",961,"lvl","0",v["pa"]));});
// include/modules/extra/instance/instance10_rogue/skill961/main.php ceff59b55ae3ec9e0e804bb2cfe68674b93a372037d75114acc81bd6b3b5a1b9
dispatcher.register("skill961","lost961",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",961,"vippid",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",961,"dest",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",961,"lvl",v["pa"]));});
// include/modules/extra/card/skills/skill593/main.php 3b2d0aa4970de58448b525e1b625d1327f4a0b7fc239088c05c3d24981e203b4
dispatcher.register("skill593","acquire593",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill593"]);
(await ctx.call("skillbase","skill_setvalue",593,"end_ts",phpBinary("-",v["now"],1),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",593,"cd_ts",phpBinary("+",v["now"],v["skill593_cd"]),v["pa"]));});
// include/modules/extra/card/skills/skill593/main.php a48a321d93b3bf5cec20fbca14f273d8185ba13909fd19bd6875e36e8f748340
dispatcher.register("skill593","lost593",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill731/main.php 03fce00d0a5916fd191b9aa35d157a25d3ac152a27e6eae2aa570bca089d1763
dispatcher.register("skill731","acquire731",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",731,"updtime","0",v["pa"]));});
// include/modules/extra/card/skills/skill731/main.php 8e7cc9aacb54b1917476d8a39a58544337ca933948befb3de497822bb5fe3e99
dispatcher.register("skill731","lost731",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",731,"updtime",v["pa"]));});
// include/modules/extra/card/skills/skill490/main.php 1bafad1be23136b298c13fb8fa0be2528ac7feff39c2dd0e685e7b936b438746
dispatcher.register("skill490","acquire490",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill490"]);
(await ctx.call("skillbase","skill_setvalue",490,"end_ts",phpBinary("-",v["now"],1),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",490,"cd_ts",phpBinary("+",v["now"],v["skill490_cd"]),v["pa"]));});
// include/modules/extra/card/skills/skill490/main.php fa1f7a987718607353564eb58593c2a5590569c7eb3a21f31ceaa760059e8de1
dispatcher.register("skill490","lost490",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",490,"nextuse",v["pa"]));});
// include/modules/extra/card/skills/skill430/main.php de5b9a368fd5905b68663a3364104d1f769bd4959c804fbb88fad307b6a4fc17
dispatcher.register("skill430","acquire430",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill430"]);
(await ctx.call("skillbase","skill_setvalue",430,"end_ts",phpBinary("-",v["now"],1),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",430,"cd_ts",phpBinary("+",v["now"],v["skill430_cd"]),v["pa"]));});
// include/modules/extra/card/skills/skill430/main.php 984f0eb058eb5a7032d3663c05a156a1e8b27c6342d287e5cf3edc1c4ffcc72f
dispatcher.register("skill430","lost430",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill30/main.php 9ec133b853dc81b43597434d823be92953844545b16b029471fd7720bb50086b
dispatcher.register("skill30","acquire30",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill30/main.php 5ad717e86d5120723543b971bdf2100a5d2610966d6874a12aad34871ccff70a
dispatcher.register("skill30","lost30",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill441/main.php 663c5d3945a13bae6835c8996277b890eefc53a788b9b5ab8fa34bb1d11786b9
dispatcher.register("skill441","acquire441",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill441/main.php d2ab2193b1fcd36905ee7822ec88f32d52e1a83678d9b1458798b0e9ee62fa59
dispatcher.register("skill441","lost441",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill259/main.php 8ae1db04db75c80f23685cee20c640ef7bf9a5d841f581f4d51c63df6b8762ce
dispatcher.register("skill259","acquire259",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",259,"lvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",259,"unlocked","0",v["pa"]));});
// include/modules/extra/club/skills/skill259/main.php aa09597d4b752818a65d5535b3bf0825bd010485d0697b6b60f572e8db01bb69
dispatcher.register("skill259","lost259",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",259,"lvl",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",259,"unlocked",v["pa"]));});
// include/modules/extra/card/skills/skill568/main.php 464cbe327a6913b3674ae4bff2be3106f95a4d929822a7df72a2a07928485788
dispatcher.register("skill568","acquire568",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill568/main.php 7095c4e8f6aeb9600b4d920d3b9abb42877fca6468fa820d1bf5192f616b7cd0
dispatcher.register("skill568","lost568",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill585/main.php 2233bfa3669cd38d13e79aed3c0455733bf55e8f256030ad71c00004c6468928
dispatcher.register("skill585","acquire585",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill585/main.php b0b91127df2455d07a5aa669fe0bb172a1437cd539b22c74531e9970dd7a8b7e
dispatcher.register("skill585","lost585",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill705/main.php 516d2631fe1b0b16cbe6b8445ddbff3fd6bb5fedc6a24413a44b7a9722aaedca
dispatcher.register("skill705","acquire705",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill705/main.php c8dfaf8616811eb8ecabf72b6aa6bebaf7ba2413310750253fd89e5be8c8ee71
dispatcher.register("skill705","lost705",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill89/main.php 8237fefef7ed6a43872a56a9de16354045589a06dd7fd3213f0ad47c888c85e4
dispatcher.register("skill89","acquire89",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",89,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill89/main.php 6c28366a6436dfe142fbc3330d268a88b22870b82f14d196ee5fb9b061a3bb49
dispatcher.register("skill89","lost89",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill96/main.php a45a97240b0d2b2eec39ff06c90b2a90fde4e5b30c78e41d1a9af667f0b7ef15
dispatcher.register("skill96","acquire96",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill96/main.php f63fa81ff81adb7f03100c2c9c4d5ce55612ed4c2a55f1bdcf8ce756f4ba8c29
dispatcher.register("skill96","lost96",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill102/main.php da758154a310064ab19d3f9c0a827fb221dd392c5a126f8c58ef492d26eb0825
dispatcher.register("skill102","acquire102",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill102/main.php 19897d852361b013e6e122b80d29f1b79ca77d5a65ba45f69f7821f8f32f2807
dispatcher.register("skill102","lost102",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill103/main.php 422a288b6cc7ef961f5faacdbe5f2cc741dd153264a202eccb660abfde137743
dispatcher.register("skill103","acquire103",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",103,"soulwep","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",103,"exatt",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",103,"exsk","",v["pa"]));});
// include/modules/extra/club/skills/skill103/main.php 35a91d1efc79bb2ed4c2d74275b34e3d71a14020278fc9624c78b64e51a0e0f5
dispatcher.register("skill103","lost103",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",103,"soulwep",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",103,"exatt",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",103,"exsk",v["pa"]));});
// include/modules/extra/club/skills/skill104/main.php de564b242159ee51195bdff9791929d9dcc5caa92322509c15330373c2f74bb0
dispatcher.register("skill104","acquire104",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",104,"lvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",104,"itmarr","",v["pa"]));});
// include/modules/extra/club/skills/skill104/main.php 14865e3d10f8fa1ee96c5e940b3e477874b08445e0f9255774a7900fd6bd68ea
dispatcher.register("skill104","lost104",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",104,"lvl",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",104,"itmarr",v["pa"]));});
// include/modules/extra/card/skills/skill732/main.php 6efce37be4729238c770d262e897b41b6db5682c527bef3472cae3cdd838a794
dispatcher.register("skill732","acquire732",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill732/main.php 29902ba53c49aa96266e679f180e005b92f6dc135a5345a32608ec75584507ed
dispatcher.register("skill732","lost732",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/instance7_tutorial/skill1000/main.php 61efbbf84f2648fb8be1de371470255b06671648e2fbc58574124e05defc4803
dispatcher.register("skill1000","acquire1000",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",1000,"tno","1",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",1000,"step","10",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",1000,"prog","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",1000,"showtips","1",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",1000,"countdown","0",v["pa"]));});
// include/modules/extra/instance/instance7_tutorial/skill1000/main.php 07ad3dcc0fb1c0f3bdf5e2b39847e4b097b78d485222168cce472a72ac8ca559
dispatcher.register("skill1000","lost1000",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill711/main.php 75264dd2b42e7c7ea281c096f1c9b33989762f9dd688ed871582f25d057b6248
dispatcher.register("skill711","acquire711",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill711/main.php 4f4640d4b2f31af17332cd17725ac544033c6cd6a5a41c5c462efe508e285173
dispatcher.register("skill711","lost711",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/npc_action/skill1007/main.php 0158e9e2cbb240fa1316caba19f6bad27631a600035f862869aacda26138a103
dispatcher.register("skill1007","acquire1007",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/npc_action/skill1007/main.php 32937fbc8edce62635bcce4af651e68f12a9187c4ad38ac96bf1d398302906b5
dispatcher.register("skill1007","lost1007",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill418/main.php 3b0cc1562d7999dd50014a210958e27cc23740d13fece13da7bfb5c5a2cc2376
dispatcher.register("skill418","acquire418",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill418/main.php 7c351b335d147608ff3e72310659b090421331a00c32045ae8d908a07c43b7be
dispatcher.register("skill418","lost418",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill1003/main.php 7ec3dfb8ae75eb03f37917e39bb325d4e7e54483f5a74f59f7dc247d85982070
dispatcher.register("skill1003","acquire1003",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",1003,"money_got",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",1003,"qiegao_got",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",1003,"killed_vip","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",1003,"attacked_vip","",v["pa"]));});
// include/modules/extra/club/skills/skill1003/main.php 2dd541d9880c390c9b67e8550235afe777250ef931f7e448f3e708b6c15d3b3d
dispatcher.register("skill1003","lost1003",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill57/main.php 49e9ab0ba26709637c2eff108ef2a5dc67e303280ef58375df5552cc5930e00a
dispatcher.register("skill57","acquire57",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",57,"p","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",57,"l","0",v["pa"]));});
// include/modules/extra/club/skills/skill57/main.php 9873ace6bdc196f7c56ddc8a4fc1bc15950b6f4e82b9934bb419f2c73c107dae
dispatcher.register("skill57","lost57",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill436/main.php cb81fca0ab3159ea11f087304ecd2c81d669f31e8168eb5a1325ea6fb61be400
dispatcher.register("skill436","acquire436",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",436,"p","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",436,"l","0",v["pa"]));});
// include/modules/extra/card/skills/skill436/main.php f319d76ff27b60182b821e40d669aaac171179a1c2e9cc4b97734a3e587fcdf1
dispatcher.register("skill436","lost436",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill729/main.php f9c3040989f0f5fc2265074c1ed9d6873cbe6e1777c14c135adf8a873145830d
dispatcher.register("skill729","acquire729",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill729/main.php 62202ec022640f74e717ac54c51a15dc5f39301374d349c742fa645ec68294a2
dispatcher.register("skill729","lost729",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill107/main.php f27172a600da9961d1deed950c271933e92a31aa05943c22d0e55e81ea0a3797
dispatcher.register("skill107","acquire107",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",107,"sanity","7",v["pa"]));});
// include/modules/extra/club/skills/skill107/main.php 74117f07e8f58903f200d967c2533c5889b96a91b50ed399b5b98176ead8aeb6
dispatcher.register("skill107","lost107",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",107,"sanity",v["pa"]));});
// include/modules/extra/club/skills/skill28/main.php 4c693240506cbe4047c9a95eb8dd0683a255046c68a255a4a669352bc6fb056b
dispatcher.register("skill28","acquire28",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",28,"choice","1",v["pa"]));});
// include/modules/extra/club/skills/skill28/main.php 8eb6f4d2a4dc357cb9b361af8f1abf52fca94c3203e4cd6619a4ed30fb655a00
dispatcher.register("skill28","lost28",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",28,"choice",v["pa"]));});
// include/modules/extra/club/skills/skill254/main.php 342323b7f31b0691916cea8b03a30b1e0648b9102d8ba346dad26dd73e0e7d1e
dispatcher.register("skill254","acquire254",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill254/main.php 39ce77883afd8b99fd7ce1210ca480f87f9364c273a064948ab1f3935f7486fa
dispatcher.register("skill254","lost254",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill535/main.php f2d325f0532784acb0c9e5273d5718524a02a882a901bc2c89796561edc1fe56
dispatcher.register("skill535","acquire535",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill535/main.php 921402ea2b40db16bee885dcaa40d16c0856a64ee9bf13ce640bb70d270267b8
dispatcher.register("skill535","lost535",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill37/main.php 4bb2539e4151ac8bebf0cc405c428d2b1b988a46322cc6cf1ac806d71122e0c4
dispatcher.register("skill37","acquire37",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill37/main.php 0ac434d6bc1a96cc6f1b5d12c5c65186d8f4d7c1cc4714fc9eabb05a353ca86b
dispatcher.register("skill37","lost37",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill73/main.php 36b956339e8d5e33e682a2528b300a0edf8fd31c701920ead6ac74b17a87329b
dispatcher.register("skill73","acquire73",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill73/main.php 1da10cc23982f2731819b1e0fcd96d6945fb7f7f774a42f5157fbd815049a866
dispatcher.register("skill73","lost73",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill410/main.php 1d2b94e1c07d3b1aac415f1c548bfa254126833c532d726a6415e6b3695b6a97
dispatcher.register("skill410","acquire410",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill410/main.php aa14fa7460f27849873a0773f8ab26ea407b0be8f20f23f7ec57ffb5d53b3af2
dispatcher.register("skill410","lost410",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill570/main.php 0025bcdab10e7fa31033f11cb24e6511ba4030eadb85f5a2b2b9907ca29dde26
dispatcher.register("skill570","acquire570",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill570/main.php f88c6bec7757b7fe13b023fbc05957cbb6a31a7c36783ae1da72e23cac7934d3
dispatcher.register("skill570","lost570",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill258/main.php fea255cb48fbd1743ee8ebef59cb84825340801dafc1cd9e05a6cdb56cbd7826
dispatcher.register("skill258","acquire258",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",258,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill258/main.php a6e4685cfbe1ebef0164b2cea942bc3f84988514368b13c9298618a0b7e584f5
dispatcher.register("skill258","lost258",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",258,"lvl",v["pa"]));});
// include/modules/extra/card/skills/skill444/main.php b7bacce7802b823f0ca95bb1dc7a5972b353bdaac1752f33102a171655455a17
dispatcher.register("skill444","acquire444",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill444/main.php ec62fc77e53a6a0b118f5dc49b412fca8fb16380a23a692f690f818f30af9da8
dispatcher.register("skill444","lost444",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill207/main.php cc0f09a60aaf525ce86ec76795ecd3f62c822c94171df00f3a1fbd4eeb1623d2
dispatcher.register("skill207","acquire207",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",207,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill207/main.php e123020c968899a8364a156b4a09125ebd1fd691450557a1d934d43fb814042d
dispatcher.register("skill207","lost207",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill65/main.php f7db96d226c1db1809f6c79a612f87af409a10aa0180a6ac212cceaa871e4c65
dispatcher.register("skill65","acquire65",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",65,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill65/main.php b7e64272e5b5c6b17d2e0afad009ec030b55b2a6acc154b7a12be962e96e66bf
dispatcher.register("skill65","lost65",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",65,"lvl",v["pa"]));});
// include/modules/extra/club/skills/skill49/main.php 1fdf3f38dbd1124f98fb9b11b0fc32d8c1ccb1fdc14b8d86b498fd6afad46d62
dispatcher.register("skill49","acquire49",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",49,"u","0",v["pa"]));});
// include/modules/extra/club/skills/skill49/main.php d32eb711a18c4c68b497ea379f77afcc2dce9ac3b54fe6622f340d32348b62c0
dispatcher.register("skill49","lost49",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill201/main.php 27bc1b3188341bd36772267251c9347bee3e505137655d69ce931c04f1501bc5
dispatcher.register("skill201","acquire201",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",201,"lvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",201,"spent","0",v["pa"]));});
// include/modules/extra/club/skills/skill201/main.php 7ad4b6713d0343382bf91d6d319ba6af5fbab24268ada4958acb925e304aa714
dispatcher.register("skill201","lost201",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill248/main.php 2951a54f48bb08a4f5096c2c90672872c9775a3ced1251cdef3844c6ddf60218
dispatcher.register("skill248","acquire248",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",248,"lvl1","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",248,"lvl2","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",248,"lvl3","0",v["pa"]));});
// include/modules/extra/club/skills/skill248/main.php 7c9fa2201f13c186adfa4f8dedb7743cde5ff61ece96a13157cb155f404a43d3
dispatcher.register("skill248","lost248",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill82/main.php f529189df706372540693fb8097869c33c9c1505fc181920630f3f2132e87051
dispatcher.register("skill82","acquire82",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill82/main.php 15433dd9a5fed404b1a91734844ed0e6cd4ade62afa6349b6617f8c16947159d
dispatcher.register("skill82","lost82",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill50/main.php 6a05d9f1fd89a70686c62a3126fb33a7168d4401eb093a7ce9bcc9d4497e1ff3
dispatcher.register("skill50","acquire50",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill50/main.php 61baaeb954489a4cc030c0e94af2b573dc69a0744405bb2852bb9878b125a602
dispatcher.register("skill50","lost50",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill741/main.php ea43166c88b06f66fb8c24b0865c69c689f5c85fea9328a97cc694c1f5179574
dispatcher.register("skill741","acquire741",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill741/main.php 2d7eb75bb316ce495f6eb69e4e8a791e258d91c23a9d687c972a742895d2ac0e
dispatcher.register("skill741","lost741",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill578/main.php d5ceda738b61b6c749f76a8f86d0962ab9ec1555d8f02e734992c89147cfb87f
dispatcher.register("skill578","acquire578",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill578/main.php a48845257536ad207b99167257ce5cbbe74e4eb72a7e6ca64b03cbe5e5c3b109
dispatcher.register("skill578","lost578",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill422/main.php 8151291dde592c57aa8066b7544652da168a848139c207c10f2ffaf2e91796f0
dispatcher.register("skill422","acquire422",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill422/main.php 8f46d3b2e7f9419a42c4a84321bf99d73d5226a9ef8fbd78b840f2f5ea02838b
dispatcher.register("skill422","lost422",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill230/main.php 148dba0faec60f85e18e88a176b76557caa346c1655900e3b300b90ea9cf05fb
dispatcher.register("skill230","acquire230",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill230/main.php 24e6b1e64bceb15aa91244fcb552b27da2bebbb3da6899c21d931a66eaacac2d
dispatcher.register("skill230","lost230",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill222/main.php 986dd755f9d36459755e04bfd8b61b017509fa95a5578d012d919bb9fb68910a
dispatcher.register("skill222","acquire222",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill222/main.php 788002196e1a1f3da4208915b237098a74de39bc4b511c83851c9d5bd56a7989
dispatcher.register("skill222","lost222",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill218/main.php dfd8368bf8d5f1c83d620eefbbbea7f3ccc78cd6f45b071d3c82b51a76255f2c
dispatcher.register("skill218","acquire218",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",218,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill218/main.php 484ba68b676d20b268dea4eb54d4ce57ca1460ed9b5fa01c417d4eb36f0bc117
dispatcher.register("skill218","lost218",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill217/main.php f178bf2d0fbc5dd512b73e8e4b79c29170b9bc15776c97688f8e789e7e87d414
dispatcher.register("skill217","acquire217",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",217,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill217/main.php e3bbc3740d5aa1ddc68f0a8db1f7146f0c911808803d3b0e4d48f15915b0df5a
dispatcher.register("skill217","lost217",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill219/main.php d3bd186bb16608092ac3715348c9a853ce778d0f1dbf929353a2f50c8cdeffad
dispatcher.register("skill219","acquire219",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill219/main.php f8255d0b66788f8d8bdb11394010a5e896a1268bf8640e87b67fd80b41ee18e4
dispatcher.register("skill219","lost219",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill25/main.php 09f22683f138a4742734d3cb077ad0ed83f3a486b2c59e375f17bf573b7ea698
dispatcher.register("skill25","acquire25",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill25/main.php 7f70defcdd6bb90f6d8a2777a477057e994123a70f2c661be61faa1eb0418c2a
dispatcher.register("skill25","lost25",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill44/main.php f7576e099e0d3d093a185a2e1a452d71b91659d73c5a4a1b4ce486959a4471e2
dispatcher.register("skill44","acquire44",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",44,"lvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",44,"choice","0",v["pa"]));});
// include/modules/extra/club/skills/skill44/main.php 22e22e360fce6082632ff07aaa0829622a9bbf2a9eb5501e2c692f3765927874
dispatcher.register("skill44","lost44",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",44,"lvl",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",44,"choice",v["pa"]));});
// include/modules/extra/club/skills/skill47/main.php beea141d672db7a873a1602c50e67c7b2551925fe0b77a00b091d90932166bb6
dispatcher.register("skill47","acquire47",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill47/main.php d8028814d89abee0dca3e28bee027bd22cf4bd7e429a18a111b74cb96f2d47ea
dispatcher.register("skill47","lost47",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill48/main.php 47131f84e7bfa4af80a8a0e58a96a2d0480431641b4132c4fd4608db576dbf0c
dispatcher.register("skill48","acquire48",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["skill48"]);
(await ctx.call("skillbase","skill_setvalue",48,"tot","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",48,"choice","1",v["pa"]));
for(const [___key,___value]of callbackEntries(v["skill48_ex_kind_list"])){v["key"]=___key;v["value"]=___value;(await ctx.call("skillbase","skill_setvalue",48,v["key"],"0",v["pa"]));}});
// include/modules/extra/club/skills/skill48/main.php cf951f436ea26c390a03203bc509590af96d86d246466ab8b9774d274b4c500c
dispatcher.register("skill48","lost48",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["skill48"]);
(await ctx.call("skillbase","skill_delvalue",48,"tot",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",48,"choice",v["pa"]));
for(const [___key,___value]of callbackEntries(v["skill48_ex_kind_list"])){v["key"]=___key;v["value"]=___value;(await ctx.call("skillbase","skill_delvalue",48,v["key"],v["pa"]));}});
// include/modules/extra/club/skills/skill54/main.php 52bbd35477d2daa7d11831c776b083a2c43e3f2e2b9c2f0c48099fedcb22364b
dispatcher.register("skill54","acquire54",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",54,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill54/main.php e5efe86a4a2230f2c0c139a994c5a29503d6179b5a0977c611e19edc83703785
dispatcher.register("skill54","lost54",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",54,"lvl",v["pa"]));});
// include/modules/extra/club/skills/skill205/main.php 9777ae70e40e25cf4763f509ca3f2e502d2583de965f890f938a14d7d2159f65
dispatcher.register("skill205","acquire205",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",205,"unlocked","0",v["pa"]));});
// include/modules/extra/club/skills/skill205/main.php 6bedb850902d07c429835dbfb023b634f5c99946f0ade30b0373ddae20cff2ac
dispatcher.register("skill205","lost205",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill75/main.php bb62832964c11f3671387936e110e75996c7a3b9f9fdc6bc664ec833ca474bf6
dispatcher.register("skill75","acquire75",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill75"]);
if(phpTruthy(phpBinary("==",callbackGet(v["pa"],"club"),2))){(v["t"]=phpBinary("-",v["now"],v["skill75_cd"]));}else{(v["t"]=v["now"]);}
(await ctx.call("skillbase","skill_setvalue",75,"end_ts",phpBinary("-",v["t"],1),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",75,"cd_ts",phpBinary("+",v["t"],v["skill75_cd"]),v["pa"]));});
// include/modules/extra/club/skills/skill75/main.php 38be3c7bc4d2f3079a191754ca1b7ecbdb85e71aec23d8331c9dc6d3cb4e2c7c
dispatcher.register("skill75","lost75",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill76/main.php 8a7c3cb6de884e79f8ba681435b92e7478223ebc4459a8ce7bd9ff7d6da7fb35
dispatcher.register("skill76","acquire76",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill76"]);
(await ctx.call("skillbase","skill_setvalue",76,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",76,"cd_ts",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",76,"rmt",2,v["pa"]));});
// include/modules/extra/club/skills/skill76/main.php 7683c5aa6103626da7fb59b703f8a501b850f49770345ce658eb9b2d1ac7640f
dispatcher.register("skill76","lost76",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill210/main.php 62770563b4b1615c1882de1c58e6641e67400b331c7bb8de9d3f6a9ff623b1f2
dispatcher.register("skill210","acquire210",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",210,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",210,"cd_ts",0,v["pa"]));});
// include/modules/extra/club/skills/skill210/main.php 48fd8eb2559eb9de4f52143d9c180c8bcfb44d2d95bef3dc33a115156890f46f
dispatcher.register("skill210","lost210",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill238/main.php 4bd9474c67925fb5650abdb6b64e3f9ad48b998699a9dc87b53b0b13ceb62866
dispatcher.register("skill238","acquire238",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill238/main.php 3444567f2ca8439117995d0bdd3abe37fb89a08f3876797215a42effcf60fff9
dispatcher.register("skill238","lost238",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill434/main.php 1655ef0bc3fff82c292cdcc80f949ef3b22dfe1936a32500c3e39d2fbf12ecea
dispatcher.register("skill434","acquire434",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill434/main.php 4b63772367ba9b30a6277fbe32801885a1c77f46f67d8e674afae8731075ba34
dispatcher.register("skill434","lost434",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill448/main.php 31ea92fdec51e7e19006ed69bc9a8f40ad448364f3cfcc575fb5fada83c01905
dispatcher.register("skill448","acquire448",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill448/main.php f9eb032771b3890882394899557183a690c3d489cb909ad526587fb811a59e5f
dispatcher.register("skill448","lost448",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill463/main.php 8f378bf16f1c0b219bdf3a02ce2c457bcf069d4093c5598681ea4e59ae3059b3
dispatcher.register("skill463","acquire463",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill463/main.php a377bb19ba4de74bb4c1a5bd44d68d78e52cda7066d12eb4815cb76e991f6f43
dispatcher.register("skill463","lost463",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill465/main.php 4d712c10ce63caa318c8cc451e7a9c9097568e0c36ea408955015aab325067b4
dispatcher.register("skill465","acquire465",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill465/main.php a4968e6d0906714d21834d9036ceb3d614c51ec92beebb5558de87189c2898b8
dispatcher.register("skill465","lost465",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill478/main.php 44830383d6dff68a26f2c3c2a8b0a8380326d751350851747c98b28330cb96f1
dispatcher.register("skill478","acquire478",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill478/main.php 4f353cfac3b4de39d6ea5ec7fa1d92a18d950b5698f1c5a51253fe21d6b8e6c1
dispatcher.register("skill478","lost478",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill521/main.php ce87dfaf7f85d6be26393865f91daa48cec5adc6b79bdb1d1553fd2a3f339faa
dispatcher.register("skill521","acquire521",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill521/main.php 8ceb13286de11c0b9cb411f7ab5ef8666581e329f3989e018788ea8ffad65587
dispatcher.register("skill521","lost521",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill522/main.php a5d4485eb1566aa81e27a51ca8786a583cd0b1bda840f17aa62b02ec9f4a75ad
dispatcher.register("skill522","acquire522",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill522/main.php ead8baf781cecb37623d766107ed14b183a7f7b5c34cbc1c0ba4f44bee9fc34d
dispatcher.register("skill522","lost522",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill523/main.php f1887743d92b416bc981a90f2e0e3c28f92fecebb254fae9fefe2279cd6473d8
dispatcher.register("skill523","acquire523",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill523/main.php 14ebfa4263237bb2c6ebdf49c13421250774e5a4642d9ab2c668b54313e2f1b4
dispatcher.register("skill523","lost523",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill524/main.php 195b7b00ae9c7334961b4527e126cae61c33806d35751de1d80fe478cb548d2f
dispatcher.register("skill524","acquire524",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill524/main.php aeedb29b7d48a74070c4eec275677814b41b8e65d165779339ab8506a70e8e67
dispatcher.register("skill524","lost524",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill525/main.php 2c2be929f17bf806f4a6637874ad4a43b185dd55641714664d9351853a993ed0
dispatcher.register("skill525","acquire525",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill525/main.php 531443dea214a6bea4bc4fd8834e126cb6de80e78ac73a7d7e668dd9316b39fa
dispatcher.register("skill525","lost525",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill526/main.php 3e5131178dd812e90c0ece99891ced2bf5794df9c96586686fb0f340df40aebe
dispatcher.register("skill526","acquire526",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill526/main.php f1fd291dea0a50016a227b728a25239c4988a2f05fa5d7e3b2228a84113e6420
dispatcher.register("skill526","lost526",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill90/main.php 9d598cd8c77dbdff531338b82f7127e10f5715acc41d1a7632f63be11e344def
dispatcher.register("skill90","acquire90",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill90/main.php 4c74e09b1e76ae9db8422e7ab3ff49dc7067b18448dbe89c639f3bcde6cf522c
dispatcher.register("skill90","lost90",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill93/main.php f37e03416979a57aaab1740cc620203ff4b6ccdef9a6e23db7bced003f730fec
dispatcher.register("skill93","acquire93",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill93/main.php a76d5de48709912b6cc965fe10f123d163c28f42aa085268b09a5bb5692e1e03
dispatcher.register("skill93","lost93",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill803/main.php 4623c0ee866b3c3517d0723d97b9848d15a7a7a1d6aea4424629490ab673f6f9
dispatcher.register("skill803","acquire803",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill803/main.php e22de98e66de5fac683760b82cb1b4c1c90d0472e095b4ab2abf6c9726b08400
dispatcher.register("skill803","lost803",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill232/main.php afefc25eba252dfdbc223ea4928094d433fe5473121d5d4e274e614dbfaa1dbc
dispatcher.register("skill232","acquire232",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",232,"lvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",232,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",232,"cd_ts",0,v["pa"]));});
// include/modules/extra/club/skills/skill232/main.php 08497fccf63651d8de460a9f9f7a3cde685d0f187e59bdbacf6b3d1b8c89a833
dispatcher.register("skill232","lost232",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill432/main.php 14eca608029c811aa8aca18a900c5824c1a40328b8263aa4c637f49da7617caf
dispatcher.register("skill432","acquire432",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill432/main.php 3be07a7c401dbba16890250fe5526f3e7561b6f98571d9483c3506edec7fc427
dispatcher.register("skill432","lost432",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill558/main.php ed38be9d2cf45e4f039b497a7614aa796811f47ea5f49ecd05f075da1198bd57
dispatcher.register("skill558","acquire558",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill558/main.php 2c3b470f32e698b441ca1f62e7f0fc6e389f0d891bdc48fb101073fe729253bf
dispatcher.register("skill558","lost558",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill513/main.php 93acae820dd89873c3e735cc87354f8089772827eaa2e4e170f6d490a95f343f
dispatcher.register("skill513","acquire513",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill513/main.php b8e6e75353f5a42a1ce2bd51883c26eb937548a7cadb3ca0c6ba4e377f14e6f7
dispatcher.register("skill513","lost513",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill726/main.php 40f8bf1308f61c2990d4d416f274caa9a568e174d5947e35479f22714887e2e3
dispatcher.register("skill726","acquire726",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill726/main.php a2819141862165dfa6f0a4fd96cad5dfe550597f5ea4b8251a65a6c961e3c15c
dispatcher.register("skill726","lost726",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill105/main.php 57f7f7e5942b93f2013b9259cc1e3605eb8c4532ae7baf66f965bc305d2221ec
dispatcher.register("skill105","acquire105",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill105/main.php bc8bf4dd75a380fa3b73a0ce5a2ec383551fee6e63e1b88db2aac85a876d647e
dispatcher.register("skill105","lost105",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill727/main.php cf437729bb9a192df41f67545d938cd782184c79778430dfb1960c5b1f26177b
dispatcher.register("skill727","acquire727",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",727,"acount","0",v["pa"]));});
// include/modules/extra/card/skills/skill727/main.php a58f500f41259c78b3950252bd7fa1898c8db7272758677e21ca2a72dcf32366
dispatcher.register("skill727","lost727",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",727,"acount",v["pa"]));});
// include/modules/extra/card/skills/skill580/main.php 0540678857e48e820b1fa8714fd00344fc77c0fde5e552d587ee37eb4d5505b5
dispatcher.register("skill580","acquire580",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill580/main.php e5e7740b98a9fb4d616b9f9018ecbc93b2de74b730c9054c34521b71d9618306
dispatcher.register("skill580","lost580",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/gtype1/skill429/main.php 04dbbaa0a6e7538e26c76f18bb7ba9010e89ffcf820ddfbe1b971bc8b19fc16a
dispatcher.register("skill429","acquire429",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",429,"lvl","0",v["pa"]));});
// include/modules/extra/instance/gtype1/skill429/main.php d3441602f34b12a41ec8437c2134809b76ded5f24841ada9161908d5f7a0f7c4
dispatcher.register("skill429","lost429",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill108/main.php feb37341e756d13921cd744749871b3acd14aee0a24369ac4f57a1b88abc9cf7
dispatcher.register("skill108","acquire108",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill108/main.php 6c7f5261e914b60c8767153e0920f6bccf9d95cf5bcf8fcccb7af8b2bcbfb94d
dispatcher.register("skill108","lost108",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill109/main.php a306416d21e3a04177645c8f10e8e807664347ba76e852608515ca66c469cff2
dispatcher.register("skill109","acquire109",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",109,"rmtime","30",v["pa"]));});
// include/modules/extra/club/skills/skill109/main.php 960956cdf66c28ca681d45c82caf9ebf779358197cda3ac53106136848ac97af
dispatcher.register("skill109","lost109",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",109,"rmtime",v["pa"]));});
// include/modules/extra/club/skills/skill111/main.php a2209ae1741c7ff00ab6b95a6785a0946f9acf98b0e442ffe1fc8c036871fc95
dispatcher.register("skill111","acquire111",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill111/main.php c31a69e8f3f0ed961f7676de2095fd8ca9b5874729134e4961f5012d106872dd
dispatcher.register("skill111","lost111",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill70/main.php a44cb884abfae8eaafa6112d9393468a5f00fef38093a459aedff4e6cbf57aac
dispatcher.register("skill70","acquire70",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackSet(v["pa"],"skillpoint",phpBinary("+",callbackGet(v["pa"],"skillpoint"),5));
callbackImport(v,ctx,["weapon"]);
for(const [___key,___value]of callbackEntries(callbackBuiltin("array_unique",[callbackBuiltin("array_values",[v["skillinfo"]],ctx)],ctx))){v["key"]=___value;callbackSet(v["pa"],v["key"],phpBinary("+",callbackGet(v["pa"],v["key"]),5));}});
// include/modules/extra/club/skills/skill70/main.php aae117f1f346a241621fd661c76e398332ba75b48c99944b2f3cd28071c97d1d
dispatcher.register("skill70","lost70",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill246/main.php 0bb48327f8c4b311cf250430efa7eff00b23863be9735854c76dd8ecabeb49d9
dispatcher.register("skill246","acquire246",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill246"]);
(await ctx.call("skillbase","skill_setvalue",246,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",246,"cd_ts",0,v["pa"]));});
// include/modules/extra/club/skills/skill246/main.php dd06cdbf723789b98740a211ba6ed31223127b435dd694254242b6e72833952a
dispatcher.register("skill246","lost246",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill598/main.php 7ea50e5d336c7451dba5a03c879f8fae338080dc20544fa51ced8c7d12ce1cec
dispatcher.register("skill598","acquire598",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill598/main.php d987266fde5bcffd928b2498a333c16c52978f99d1f1d540f8b36989270e41fc
dispatcher.register("skill598","lost598",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill514/main.php d4f04b8f75e0473c8d89a17fa2b8361ce04eff5b5f0459fe1d65b8580b33e8c4
dispatcher.register("skill514","acquire514",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",514,"var","10",v["pa"]));});
// include/modules/extra/card/skills/skill514/main.php f32a744b2f3d8ea58053c07078533584d5f6550b0fdc6c866d74e6f69bdb20f4
dispatcher.register("skill514","lost514",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",514,"var",v["pa"]));});
// include/modules/extra/club/skills/skill206/main.php e00e1399d6da72f671f49fc42b5ecc3a16003f3dea5ea0ae6d2bd920110948be
dispatcher.register("skill206","acquire206",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",206,"forced",0,v["pa"]));});
// include/modules/extra/club/skills/skill206/main.php 968c76fcdfb51b4769d3ecfd3ca6c3120be64679b213b37b72f8aac32a8d05ea
dispatcher.register("skill206","lost206",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill231/main.php 788e5f0bfb38fa88a76b63d363a264c5a5da2924094382052ea8bf98f258cacf
dispatcher.register("skill231","acquire231",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill231/main.php 230d7d7c670b7ea787ab3e6fd82d890d77d2bea934c6b176bee8722f34ece7fa
dispatcher.register("skill231","lost231",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill742/main.php a9f2e11e2e8825966ed1189c74e5a6d625f954e3b978e8dfc9c25a4a35009160
dispatcher.register("skill742","acquire742",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",742,"lvl","0",v["pa"]));});
// include/modules/extra/card/skills/skill742/main.php b0b10f65019b2be2e9dc2a5bd57aed3a6ece1679e85d699aa7da6bef02be3a67
dispatcher.register("skill742","lost742",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",742,"lvl",v["pa"]));});
// include/modules/extra/club/skills/skill220/main.php aa40a485baef22575bd3953aaa6e25e6baab0ca0eaf9d130445a98894a29e672
dispatcher.register("skill220","acquire220",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill220/main.php ad84fa2d4edb55babaebc4105c21df0e49ad7ca2627c3702bf1eab34df880f0e
dispatcher.register("skill220","lost220",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill224/main.php 4d3501b6e6f6ab1c07b021119b95b3f19d74ad86466b71a2c53c26c46deaddbf
dispatcher.register("skill224","acquire224",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill224/main.php 53f35e005d57cc66b79110269c049428d9b0a66abbf2347572cb14b0c792e9ae
dispatcher.register("skill224","lost224",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill243/main.php e6a11a03e5b880d403a1fd523ca9ff4e9243ca2bc0d5e126cb6e02fc69e2557a
dispatcher.register("skill243","acquire243",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",243,"l","",v["pa"]));});
// include/modules/extra/club/skills/skill243/main.php 3ada68c7ba63f2cabc75832a13b6ae3c7441a6309ae1f72178ab9007a77a6495
dispatcher.register("skill243","lost243",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",243,"l",v["pa"]));});
// include/modules/extra/club/skills/skill208/main.php 8f88666b2f36156db920b7b1e4870e3b7346792137713140453813d2f68f6aca
dispatcher.register("skill208","acquire208",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill208/main.php ec7d923c17288847b1d9e76f1260a278a2f3f1971ebd945fb22b55a2aaa9c0df
dispatcher.register("skill208","lost208",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill215/main.php 79138b2ea27293c06ebb50ec520b292af2695d4f5faa205a77eb4a1b1218491f
dispatcher.register("skill215","acquire215",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill215/main.php 7d569a0923021d84a2f6a791f7585f1714ab26bb4ecac70f683e0b952f4362ad
dispatcher.register("skill215","lost215",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill271/main.php 55fdc09f536c76a549ad7b8cc0359f837bf1df3b0b7426d8ec2fddbb53fae0da
dispatcher.register("skill271","acquire271",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill271/main.php 9bdb5e84acc15ec13acd53cbf5af65a3445f61ab483ace0c7ccea79174cb214a
dispatcher.register("skill271","lost271",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill112/main.php cf7924c163b46d44745aaf08e3bff344cbbd7a0fde1219d12a8202cfd00d844f
dispatcher.register("skill112","acquire112",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill112/main.php 7d50e2899560815b791e843aa5a152f1fcc05dc8907d793b0e79c639bfde9fcf
dispatcher.register("skill112","lost112",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill51/main.php 07ee8cfe0cc2f239c41f0685909dc90890b18006c0f942af56450071941aa5ce
dispatcher.register("skill51","acquire51",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill51/main.php d62ec2a976709d9dde38a65f148afad6ad6fe65d71296ef63a830a9dc2d59a08
dispatcher.register("skill51","lost51",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill493/main.php 466223310672ecc2b0b3ab1e29f89186ca9f3aac942c799543175a6324b5ce5f
dispatcher.register("skill493","acquire493",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",493,"choice","1",v["pa"]));});
// include/modules/extra/card/skills/skill493/main.php ef32f915a87a7b62fb1a0773982bb2cb3b43861bf783c26504d4b72c6cfce1aa
dispatcher.register("skill493","lost493",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",493,"choice",v["pa"]));});
// include/modules/extra/club/skills/skill100/main.php e3e524f3ecf59714a75b65990c1415459bc3760b80d4268dcd17bdb4ecdbcd7e
dispatcher.register("skill100","acquire100",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",100,"rageused",0,v["pa"]));});
// include/modules/extra/club/skills/skill100/main.php a6b930acae85f657be0a89ad527438be1f1ef206c9feb0126fe0f99a48121494
dispatcher.register("skill100","lost100",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",100,"rageused",v["pa"]));});
// include/modules/extra/club/skills/skill101/main.php b25b4fcfe88c2dfdbb16f43c5b3ecc3a20def41f2390d3c1287fa4420e97f824
dispatcher.register("skill101","acquire101",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",101,"activated",0,v["pa"]));});
// include/modules/extra/club/skills/skill101/main.php a46732d12e72aa362f6784a854fda8cecbfcd861c337da8fc768ffb48c56a342
dispatcher.register("skill101","lost101",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",101,"activated",v["pa"]));});
// include/modules/extra/club/skills/skill98/main.php 59b033877503ded0eda64e3b61e01207b6520574c22797e11ad134e99ba119f3
dispatcher.register("skill98","acquire98",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill98/main.php b79f3462939a661e7f8adf87e6d9610aa61bf8f5dcaf31e6265ae56b869a9b41
dispatcher.register("skill98","lost98",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill99/main.php a91bb0ff718f21b9241e192cd586de7f90a47036a13ead00c2b8607590c969ff
dispatcher.register("skill99","acquire99",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",99,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill99/main.php 80f34f751bd8149faa97bc0eae5078d8e5bc906ef731d8b1d384dac98823fbfd
dispatcher.register("skill99","lost99",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill97/main.php 5040f8d47812c4ae3a0f0fc462b3de2ce9f7f99ba8d78d32080caf54cd227740
dispatcher.register("skill97","acquire97",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",97,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill97/main.php a3708cbe271a1e91e511625edbf55cb66db8113c066eae2d243dd14c96e5c674
dispatcher.register("skill97","lost97",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",97,"lvl",v["pa"]));});
// include/modules/extra/achievement/skills/skill302/main.php 15b1d116e593876b4add8e70c866e6f78eb7f5b580a6b0500794128a633c7f16
dispatcher.register("skill302","acquire302",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",302,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill302/main.php bab1edfa52276cc6dffeff87c525906ba26302d7de72ee6a52320b604659dc0e
dispatcher.register("skill302","lost302",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill303/main.php b46e249f2b50a36bb97b5b19f33b1f777d66cd6431e525663a6adbe2efafa7c3
dispatcher.register("skill303","acquire303",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",303,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill303/main.php 3b2accd8eb6927566bdfe119efb0281b1bf5750f327870f2e6efe67a1aeaab22
dispatcher.register("skill303","lost303",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill304/main.php b44d645f680e0628de0ee31364781123dad05475941fcf6b974c223b73557cd1
dispatcher.register("skill304","acquire304",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",304,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill304/main.php bfd71ead3e6973452cff2047906cfac2d5fdb24a7037e47bc7d280ef23aea3bc
dispatcher.register("skill304","lost304",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill325/main.php 7a0b20be206bc894bf311c5ca4d5d5239b5dab465fcc015cae7c19711db1c5a7
dispatcher.register("skill325","acquire325",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",325,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill325/main.php 4c7726452ca2ecc6cfb663b094ac1646a844bfa06ac1de57761a4648dcd5f859
dispatcher.register("skill325","lost325",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill326/main.php 09b0456811ccb36d840bc482a06c16afc60be63903afe3d314a765ab9b9d3d76
dispatcher.register("skill326","acquire326",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill326/main.php 6db5973a4e943fabd24e3bc9bab0e535345f03018a75bab6e86fb5d35a78950f
dispatcher.register("skill326","lost326",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill315/main.php 622a359396765d931a1fbfc1aa0ff324b8fa7348beb726e6da37194d30e587f7
dispatcher.register("skill315","acquire315",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",315,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill315/main.php 17aad5fbe8c0efad152163be6d35f2262572ab7657de748614dca3ba5dbc04bd
dispatcher.register("skill315","lost315",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill313/main.php 3716a2e553e1b42ae38945be4d5849b91a3ab4f0d37bd95a103acca57075ec54
dispatcher.register("skill313","acquire313",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",313,"max_money",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill313/main.php 333ff5c05b03bd4afe7147f790f712c8003e386bb76ddbcf2cda4b668245d2c1
dispatcher.register("skill313","lost313",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill300/main.php cd36ff46cf060d1f575e626f652514c108a799aeefb28c1a1b78b015c00606f4
dispatcher.register("skill300","acquire300",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",300,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill300/main.php 0368d0891fbb0f63123039bf713e9f0377023ce12ec3b94aaed1b3c08cde7b22
dispatcher.register("skill300","lost300",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill332/main.php a94f3ea7ba08cbfd07406cac4ccf293bf1e704efc3f63e9837925187ff4b4ad1
dispatcher.register("skill332","acquire332",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",332,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill332/main.php 9f4104b799ca98ef25369498b04de745ceb5211a1efd603b493f973dd72621b3
dispatcher.register("skill332","lost332",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill333/main.php b787cfa82c525ab06d66fb82fdd48e682a9f4db886647e689b3ca9a4bab436e2
dispatcher.register("skill333","acquire333",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",333,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill333/main.php db7928c3ef7a086283029b1f765f8154b449632d15ebdd19ffe5f05515ac4fe1
dispatcher.register("skill333","lost333",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill334/main.php e6df1ff1e088ec213029f8c310fe95e1055242be763636450a08e2b24e2215c6
dispatcher.register("skill334","acquire334",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",334,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill334/main.php b63e5f0391219fe1c53b41509e6d324c465b62162340a031f971d58e401a401f
dispatcher.register("skill334","lost334",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill335/main.php 0596dc3052af3e322774fb01b03a8bf5d11c4d9af13c7d60ad293d9a9860e0fd
dispatcher.register("skill335","acquire335",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",335,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill335/main.php 53ff4ef3aa8e4a95502156d322b02b849e56a927ee77e9121193a0ad3a72883c
dispatcher.register("skill335","lost335",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill336/main.php fcca22033462d979a3e2e610b15612e575edb16aff3d5e4f4f924151f789c0df
dispatcher.register("skill336","acquire336",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",336,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill336/main.php e228e7f4ca6bdabb40736c6c49051a0d98ca9224fe9cb9864a2f3f779e41254a
dispatcher.register("skill336","lost336",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill337/main.php 69bdb1c7e04b87cf19a5c8c00c98003692b069926a3315b2dbe10c265a9f7dae
dispatcher.register("skill337","acquire337",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",337,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill337/main.php 1b7fc7c724e6887938e5c951bea008ee6d77eb96436729744ba7a654678c7efb
dispatcher.register("skill337","lost337",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill338/main.php 660926f7edce33d697d6c034190c55d16f3d596d7dc897d3add45f328d569574
dispatcher.register("skill338","acquire338",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",338,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill338/main.php 844c03289acd712fed488a70c4b40f17c45d1360157bcd2c794ad53b03af879b
dispatcher.register("skill338","lost338",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill339/main.php 32c75862ce034eecb103b741342bf7628fa18df73765f11520a8872cde5f0e24
dispatcher.register("skill339","acquire339",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",339,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill339/main.php 35b02a7ad557cfe32c3322a7f6a90a948b8564957d2e92e249121b0f50bc0490
dispatcher.register("skill339","lost339",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill340/main.php 291f14933e51365787fd15df62df5380d4c2208a777a1482b226eb45b47c685d
dispatcher.register("skill340","acquire340",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",340,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill340/main.php 3023fd385b09a3e80b9fa5ae5a920f0009f51de0d8f882d971adae4c8aea5732
dispatcher.register("skill340","lost340",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill341/main.php f5726fe76086ba66030628c0e3fc7ed69267b4a53c41ff5620a9c1ad356c7378
dispatcher.register("skill341","acquire341",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",341,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill341/main.php f3361013dddc3152897f449c0ec6ec2a78c43d8b4188d6d31ab882bcef409f48
dispatcher.register("skill341","lost341",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill342/main.php 7b100b5ee229c627bc4c080b7c037b5988279a82a04c241433df9ded4c6cf26b
dispatcher.register("skill342","acquire342",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",342,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill342/main.php b68193d9639e995082dd3b2b8b594bc4c62e7f53b23c54130f14f0b2a5c752fe
dispatcher.register("skill342","lost342",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill343/main.php cd14a310be05a67856d808bfc9ffc50960246154c9a16054be8615fa8fd5bdb6
dispatcher.register("skill343","acquire343",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",343,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill343/main.php 5330a7025681ef83155a7553cda2d4352a112075988703b800c4f8d663940582
dispatcher.register("skill343","lost343",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill344/main.php 6afbaf63a4481b742e9828aa79cad84a1d9a99cc25f39d2b16bbb218640cc674
dispatcher.register("skill344","acquire344",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",344,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill344/main.php abbde8f3b589a6f4b34a75d5d4d27f02344db496381e4045036df90c787927ed
dispatcher.register("skill344","lost344",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill345/main.php 1d3e8dcd23390d9ce7f4d2b50a497d650d13d014592dfe33eb4ad6fbe498aad7
dispatcher.register("skill345","acquire345",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",345,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill345/main.php bde84befc94b0fea48f042ce200b0adede8043147838a31e27a6541b37a5dbb6
dispatcher.register("skill345","lost345",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill346/main.php 9cb95414cd780ba6ca179642133ecce8fdf94db92a52af4a41291c1d2fdcd989
dispatcher.register("skill346","acquire346",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",346,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill346/main.php fa87fc4526b13c621506db4970452468b9cb16a74a10c03ca5183d24dec36ee6
dispatcher.register("skill346","lost346",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill347/main.php 2089ae230f4491c33627f030bc42ea841d861f9a364364982c8c4718792adcf8
dispatcher.register("skill347","acquire347",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys"]);
(v["valid"]=0);
if(phpTruthy((phpTruthy(phpBinary(">=",phpBinary("-",v["now"],v["starttime"]),600)) && phpTruthy(phpBinary(">",v["alivenum"],1))))){(v["valid"]=1);}
(await ctx.call("skillbase","skill_setvalue",347,"valid",v["valid"],v["pa"]));});
// include/modules/extra/achievement/skills/skill347/main.php 2e95345d55a1d43d78de543f958d619203c34cf1dc541731a644aa5361fe6a49
dispatcher.register("skill347","lost347",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill348/main.php d50dbfc6bd11a2fb3974db6a45cb83287e2e6a84616db50d9d0154264cb53d00
dispatcher.register("skill348","acquire348",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",348,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill348/main.php 3aab07cc9fea32b1b5dbde30e12ba887c54b321d8e661957dd1b9a2b2445be88
dispatcher.register("skill348","lost348",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill349/main.php c8338018665da5da2ba1d051990690b93b39c39b26b9e5b18f6fda31a0d21448
dispatcher.register("skill349","acquire349",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",349,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill349/main.php f8ed8c3c77f3521b4bbec7b0f8320b2e64c1264b589d7633436d9379575966ea
dispatcher.register("skill349","lost349",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill350/main.php a622e575752a5a49844fe2ac38190418ba72af936184cfce99b9aa65c13d1e55
dispatcher.register("skill350","acquire350",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",350,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill350/main.php 55796228ea79006ed2e5b09ca3802376332c3365a352658c2615136cb3ac89c5
dispatcher.register("skill350","lost350",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill353/main.php c46d65f89eb433d5e58dee93ec4652b5cbec37c13c30a3a8e154b42a05dcbb2f
dispatcher.register("skill353","acquire353",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",353,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill353/main.php b89e193663372c2870deb88d2a449d146f628c16bbb7f15160b115509f060640
dispatcher.register("skill353","lost353",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill354/main.php 9bbae58a8b9d2c6566eefae3831d74b675e15f8cbf283b1e519509174315082d
dispatcher.register("skill354","acquire354",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",354,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill354/main.php 32adf73059707384ea97f11d40a3a643c2fde65cf163910b0ff85f7493cb5a6b
dispatcher.register("skill354","lost354",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill355/main.php 19e2589fdf8d3ac00222f9f4d2d575f6c94f675f1c25dbe4e22fa68a1ff157ef
dispatcher.register("skill355","acquire355",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",355,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill355/main.php 12b714495d22ed1626accaf6f072ea1ef052ebdc870addd8ec0733e4e1629285
dispatcher.register("skill355","lost355",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill356/main.php 070e010a5b5dd5bf61a8c849584d38ce1f9931e49c8f698a8ffbebf99f2395f7
dispatcher.register("skill356","acquire356",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",356,"cnt",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",356,"method","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill356/main.php 73d6841ec3ced3ec1e810d3581dce10beaadae58aa0678f76325f84827c9d04c
dispatcher.register("skill356","lost356",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill357/main.php 2e7926c2abdda19197d306c72874bb78ccbd7f4bb4cbf30a0a1ad5c93c9d6905
dispatcher.register("skill357","acquire357",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",357,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill357/main.php 214478c4a1fa3798bd1b2f81dd612ab134a754a547b59bffd0ecbeccda4d69f7
dispatcher.register("skill357","lost357",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill358/main.php 1b2de068ed6c2d8725c9626cb96367cf346adf0b61310420752d36b2aee0bec0
dispatcher.register("skill358","acquire358",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",358,"cnt","0",v["pa"]));});
// include/modules/extra/achievement/skills/skill358/main.php a4a584f6b20bcb3b7f32143511e0bbc6500f46d43207fd74509346dc0a131549
dispatcher.register("skill358","lost358",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill359/main.php 090e1ef2abd521686466a8f5e95dfaac412285ba1ec7af327c40fe16160793b5
dispatcher.register("skill359","acquire359",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill359/main.php cdcda0b8d74ab9a97e6918f64942efd4eed4b03fb91f32d42f886bcccc8450f9
dispatcher.register("skill359","lost359",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/activities/lunany2018/skill360/main.php 0ab3e766c76fadaaf6d6b13b320f785c71935e8d9d5797862e799e6bbefa8c29
dispatcher.register("skill360","acquire360",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",360,"cnt","0",v["pa"]));});
// include/modules/extra/activities/lunany2018/skill360/main.php f4e6d19f313963db3d62fa32ba1f0ef3c3b25fe4fd04effcf177a95b358afba7
dispatcher.register("skill360","lost360",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill364/main.php 4acefb1906353c8d15ec2cc8cfeaf8a1f4871231c43fa6ab0b512ff62e932878
dispatcher.register("skill364","acquire364",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill364/main.php a574b708fdc90e5aaf3984708bde68230c30f677a39f3c8faa57108a6c77c7ad
dispatcher.register("skill364","lost364",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill367/main.php df9705851cd4b0652a4c568d6b64692658296df2f12d3a7010aec8176a03816d
dispatcher.register("skill367","acquire367",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",367,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill367/main.php a48a4bf87227ca1a7f9c6a81df8c15474d9a7e5e06c17df2059b38cb2b1a297c
dispatcher.register("skill367","lost367",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill368/main.php efaf359066ade932f357eee750a940224a006386f909835a0a06d40112751acd
dispatcher.register("skill368","acquire368",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",368,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill368/main.php d6b0f43d58bcc700ecd9415e6cb2c47d6647f6a29304b0e38852355a6ee1bc10
dispatcher.register("skill368","lost368",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill369/main.php 88ffe9ea16c98aed578385a0eb40ebb3e29492a3a21e907caa220f450e898753
dispatcher.register("skill369","acquire369",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",369,"cnt","",v["pa"]));});
// include/modules/extra/achievement/skills/skill369/main.php e4930005a80b4903969269122b16ae3209e5a090d3bd43a2b66c4617c2fb4d6c
dispatcher.register("skill369","lost369",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill370/main.php 05d340079c9350f1ecb89a9b7676c32f768c2e7e2145fbe9124509af5b156303
dispatcher.register("skill370","acquire370",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill370/main.php 8779e723de12a0a6b31a6f3b9bf08bf976dd30fbd225b5ae766211bb66dad304
dispatcher.register("skill370","lost370",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill530/main.php 5d913cbcc505926658e80157a8bf5a4b920d9e1cc7649cb904270d69b106426f
dispatcher.register("skill530","acquire530",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill530/main.php 508faf62f17495875d1292500ca463b396b2f3159d1bf89001e53750e1eb38a5
dispatcher.register("skill530","lost530",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill372/main.php 8aa3eb441153a3cc6bdd769f75963fd452c1797d52d1096c58a6218109dd0167
dispatcher.register("skill372","acquire372",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",372,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill372/main.php 8c6cb679a165387667e10e047b3ff2fb6b6182165b2ab9d3bf96eb5b17af31ab
dispatcher.register("skill372","lost372",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill373/main.php e708dca31e387073bb97158e6f383662cfe80147205c381d32a45fca102f8bff
dispatcher.register("skill373","acquire373",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",373,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill373/main.php cd26d209cd9f1d279bd18c1eabde743b65f9576e3be5d91266b7db3919bb437c
dispatcher.register("skill373","lost373",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill374/main.php df1b0c2ecc668523f368c160e366226391c19077c6c252ec49e0108e7224bf40
dispatcher.register("skill374","acquire374",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill374/main.php dd4ad0870751c0ef4f578ec30c7a5db33a81d5ce8f34ccf3d3ab4ec2b2b06223
dispatcher.register("skill374","lost374",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill377/main.php 6ced35e472a951c6febc0c32aea721e09ecd86af6abe437954809810f91a79c0
dispatcher.register("skill377","acquire377",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",377,"killed_list","",v["pa"]));});
// include/modules/extra/achievement/skills/skill377/main.php e75590d6088956db3fe7b317b0c42d83e383de5e0ed593ee8259da750757ab38
dispatcher.register("skill377","lost377",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill378/main.php 671cc5d4f88d3cdf992ece3f6ff7e0bdd8753b5210ddf4df0b880c3b062103c6
dispatcher.register("skill378","acquire378",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill378/main.php cdb6cdb82ee2c9b003fdd927c3764144d3c72697f32ae2dafeb1f0c006e00044
dispatcher.register("skill378","lost378",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill380/main.php 4eedee82e5c619c1b6a8c11fe297df6c33370d3d6cd90441d7895d61b3e4a51d
dispatcher.register("skill380","acquire380",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill380/main.php 0cdef0b8abe4fdc9a34148d9da2c3e9aa58198b60c9d5af9c6b30010b97da145
dispatcher.register("skill380","lost380",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill375/main.php 34b972945cf311b3c7e5ebee5ba535d0a86678ec2cfff85b5cc81a0df1871867
dispatcher.register("skill375","acquire375",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill375/main.php 77dd5e62e29d519005abec770e1fe94720b7d327f8e3f879112bb92112cf3cdf
dispatcher.register("skill375","lost375",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill382/main.php b0105b7d978b289e3007ffd3d377100cf1da373031e70b33cac407f2b416c97a
dispatcher.register("skill382","acquire382",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",382,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill382/main.php 98a35fdcf3709186208d6032e86c86017dedc4f4231d78ce799f0476c19d2622
dispatcher.register("skill382","lost382",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill351/main.php 85aae5e3dca3cabfd142c5ef5b9105825c95e9bbce16c4511513d9b976a1c51e
dispatcher.register("skill351","acquire351",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",351,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill351/main.php 354d84f3b22f0ea4b9a1c5fdf570912b0047ef87ef7b0ca235ffd36eac1faabb
dispatcher.register("skill351","lost351",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill352/main.php d57786f505b6c46afc9c0762930e34c3f0acceefb13a871c55d6342ec815809a
dispatcher.register("skill352","acquire352",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",352,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill352/main.php 84770124a9dcbe3fa4e6d936fe8e14a8dd59b23914bc45ae54136348f790d6ba
dispatcher.register("skill352","lost352",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill504/main.php 3f41fe117030a0684dfd2aa137edb2d29910477bd0c21cc88d5b6c4219c2344a
dispatcher.register("skill504","acquire504",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",504,"done","0",v["pa"]));});
// include/modules/extra/card/skills/skill504/main.php 242c9206fc1f7407732609514e4771438af60a1d316ebd0ded7e22bdabb3e96a
dispatcher.register("skill504","lost504",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill740/main.php 367d7db008ec8954c6badf5113998721604390aafbeda99a0ff4768d28487a7a
dispatcher.register("skill740","acquire740",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill740/main.php 1364b006d4bcd34520f02b7104f04df5bd013c62b60cec0d2a24997d6accfbbe
dispatcher.register("skill740","lost740",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill182/main.php 5dce0fd10d2a132a51cf688f66b4ad809cd79f5f52f8994d2307a0794fe825d1
dispatcher.register("skill182","acquire182",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",182,"skey","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",182,"svalue","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",182,"stime","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",182,"sstart",0,v["pa"]));});
// include/modules/extra/club/skills/skill182/main.php 410bae41bbb5ce52c231b0f8328a8f48ada4dda9a2cad6c3e22cb93af52b2bca
dispatcher.register("skill182","lost182",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill458/main.php fb715bd779c7ff18f14cb62bf5427b4bfd08b6e28f4d1cf95c2b67f6e4c6465e
dispatcher.register("skill458","acquire458",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill458/main.php 5631832d11fb26721fcd79a54fcc8844a36a210f0f88800d2277efad013970db
dispatcher.register("skill458","lost458",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill498/main.php 027e09041a7916414ad61556081dff612de7884debbd5c7f0721e73c8fac2910
dispatcher.register("skill498","acquire498",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",498,"fv",0,v["pa"]));});
// include/modules/extra/card/skills/skill498/main.php 152175ae3075089eb35257ee9a1b4b88efbae15fc0e7daa49b7786b940fa1103
dispatcher.register("skill498","lost498",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",498,"fv",v["pa"]));});
// include/modules/extra/club/skills/skill181/main.php c29af50ab982ea3645378134052751b969a58b9095ccf66208fbf2b99b80861d
dispatcher.register("skill181","acquire181",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["skill181"]);
callbackSet(v["pa"],"mss",phpBinary("+",callbackGet(v["pa"],"mss"),v["skill181_init_mss"]));
callbackSet(v["pa"],"ss",phpBinary("+",callbackGet(v["pa"],"ss"),v["skill181_init_ss"]));});
// include/modules/extra/club/skills/skill181/main.php 109e6978177e497617041e2bef04ddac00e64126320b8b4d408020395ac84fb9
dispatcher.register("skill181","lost181",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill376/main.php 589c4d1595185f0552fe058a6d280e3c996414969030158b4720d8ca8c300f59
dispatcher.register("skill376","acquire376",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill376/main.php 57aa0938e4a6fd43e11990b75be322fb24f53ad09ebd6b9b288619dce904888b
dispatcher.register("skill376","lost376",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill381/main.php dc7fedc876d3b7d6f8d7591ff5a8563e5d4a10163723a2a5f77417409bff54a9
dispatcher.register("skill381","acquire381",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",381,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill381/main.php d4b4fc54d08e7b8779e51ce67971df6426d1e7e87fabed6187933ef40f8fa16e
dispatcher.register("skill381","lost381",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill88/main.php 567c6f068df40c1c45a0e5216be5ad1cb7f62301a44600c1dd8d18f46e800d28
dispatcher.register("skill88","acquire88",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill88/main.php 49ac456b023f475aa9c8c40b7c630db3aea8ceaf140c2c74399a426b20b7451c
dispatcher.register("skill88","lost88",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill91/main.php 9578ffe265055bcb9ce91c78dccf96c53e280858a6838f813c4080da9e68792e
dispatcher.register("skill91","acquire91",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",91,"pls","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",91,"uss","0",v["pa"]));});
// include/modules/extra/club/skills/skill91/main.php 7e4187285eff2eae951b8506f5434e77396136278186e76a9be3d2fe878f11cd
dispatcher.register("skill91","lost91",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",91,"pls",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",91,"uss",v["pa"]));});
// include/modules/extra/club/skills/skill92/main.php 37dc6cd6f38130d353aec2213c5aca5e8f8055044327ed3358e15198f5a07d61
dispatcher.register("skill92","acquire92",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",92,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill92/main.php 418b95775af5df3c7b17bb304b1e5a0940b5b536af8069221f7e7c7ef743a832
dispatcher.register("skill92","lost92",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill739/main.php bdd69ec6e648018927597fb97ca8f793f2f97bde3c225992ed61a5fe297d3354
dispatcher.register("skill739","acquire739",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill739/main.php f91ba1fe78e245e3b30b3e155c6307833a100b5dabbb82447ef1b89209a70965
dispatcher.register("skill739","lost739",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill747/main.php a06a3bbd760a5eac2f75837d3dcdeeb822e4340728739e10ace12d4c437bc51b
dispatcher.register("skill747","acquire747",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill747/main.php 7494fc3ad57806295abb23da112a934376dd328cd78195adb728d4ced27e485c
dispatcher.register("skill747","lost747",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill77/main.php 51cf67a55cbb423be58462444157eb605886b8bdda3877b39fafa767298d024d
dispatcher.register("skill77","acquire77",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill77/main.php a3c784f8975e1bb6a19335208c0bdda003fd90483cbe9b61aab48c80a373a75f
dispatcher.register("skill77","lost77",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill379/main.php 445962bd9eb74ed7f87f4264cfe56dff088bc979fd5087ee9472f8b470fb536b
dispatcher.register("skill379","acquire379",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",379,"allowed",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",379,"haga","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",379,"num",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill379/main.php 83a0f6ee20ceca7d302604753adaf3b40c91e4a22f2f2dc640eeaaad8790654a
dispatcher.register("skill379","lost379",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill244/main.php 091678d1c360e14ae067c7756412e9107ba1edfa93b400fd752811eb5bfd0df7
dispatcher.register("skill244","acquire244",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill244/main.php ea6ba520e9bb43bf20d54613251f92f276c45193cec46ab0053c416063a48ac4
dispatcher.register("skill244","lost244",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill508/main.php 585de0d94ba95535dec23a3de7aa66e4d95ae87de9cbcf54c930fec7757e986f
dispatcher.register("skill508","acquire508",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill508/main.php 172b8e333076637ab4267728f2fc948948f3da3e26b1555da8477e0152c53c34
dispatcher.register("skill508","lost508",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill233/main.php d70de6a7134be95c4e9f157e607b11817d47013aa030123fbb6e1dd8253438fe
dispatcher.register("skill233","acquire233",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill233/main.php ade63c2b49348674d403565991795bebe78e2ad0e20359adc7372b13af0b3d88
dispatcher.register("skill233","lost233",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill371/main.php e0daabb8d5559b266264c6b30a4043868b81228af240ace9a84f96bab1fa4e4e
dispatcher.register("skill371","acquire371",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",371,"cnt",0,v["pa"]));});
// include/modules/extra/achievement/skills/skill371/main.php 17a8fc9ec4a333e4e81f777faeda49389a4f7f787edef06a9c10b6cb17ccd50b
dispatcher.register("skill371","lost371",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill363/main.php c03378e8d1fe3205ede23a3b485a784f35cf1b9dcb4ca9ac1561fbaa797c2327
dispatcher.register("skill363","acquire363",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/achievement/skills/skill363/main.php ea02ddb52fa210c3e2f18a685897d9e23b33d24419912f34360f36c97183d070
dispatcher.register("skill363","lost363",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/activities/lunany2018/skill361/main.php f24100cfd8e0909cd5346ddfd277a6a259b246723221574ad9188f7429fad40d
dispatcher.register("skill361","acquire361",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/activities/lunany2018/skill361/main.php a90869e29ff569111db9484ee26c4244e70ad248a379164287227c305c40fa53
dispatcher.register("skill361","lost361",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/activities/lunany2018/skill362/main.php 06229eb4a8ac36fc87235a2980a6a1da9f364b1c2e66b192d593feb2d493cc49
dispatcher.register("skill362","acquire362",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",362,"cnt","0",v["pa"]));});
// include/modules/extra/activities/lunany2018/skill362/main.php ad7e1067baaf362e89b5c9f70f5ca4cc8542f03735e19165dc8d65f717c2f37b
dispatcher.register("skill362","lost362",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/activities/aprilfool2018/skill365/main.php 272d063811b3ea2bf9ec9f9a8b3b6ba90c3e590a6df5b9bebdd6ddfcb7972880
dispatcher.register("skill365","acquire365",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",365,"cnt","0",v["pa"]));});
// include/modules/extra/activities/aprilfool2018/skill365/main.php 60ee380ae20a61b5d9751bc2f6b046e9245253a5d2134f8e1a982a44b869252c
dispatcher.register("skill365","lost365",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill601/main.php c4a382fb16e9b551a39655a69651d2d3431d4574bac193ce1e3670b79de76e3f
dispatcher.register("skill601","acquire601",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill601/main.php 6acbfd80af3bcb1f76e8c0339fdc20b419a61c8e431e4e1666e2888a3048ad8e
dispatcher.register("skill601","lost601",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill602/main.php d7af1c257351098a8f751551f841deb97f9cd008c32ec0f3349306f3436d4ee4
dispatcher.register("skill602","acquire602",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill602/main.php b0fe8c64d46c0e308f8c833705cc33cada6939fabbf5f11216f1ed5633d0b4b1
dispatcher.register("skill602","lost602",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill603/main.php 9a1307ed07fe68398e007298ba76bde20c7fbf27805cc67cf07bd56c6e125aaa
dispatcher.register("skill603","acquire603",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill603/main.php 1130b66117f1a3b89368b2f696908b6492ab0c1c60b3b478d00d09efaa6e6fd0
dispatcher.register("skill603","lost603",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill738/main.php f048de86d703bc376430f4502a96314f78bad26de8a98ba311201939031d9b3b
dispatcher.register("skill738","acquire738",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",738,"choice","2",v["pa"]));});
// include/modules/extra/card/skills/skill738/main.php a54aee962959b2fdacf85c5ead265f51603c49c6470ff77953da0e76e88c93e4
dispatcher.register("skill738","lost738",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",738,"choice",v["pa"]));});
// include/modules/extra/club/skills/skill87/main.php e3dfe1a1462270393a21b6f437df19b7ac98cfdc97140fa00a49fc036d79c777
dispatcher.register("skill87","acquire87",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["skill87"]);
callbackSet(v["pa"],"mss",phpBinary("+",callbackGet(v["pa"],"mss"),v["skill87_init_ss"]));
callbackSet(v["pa"],"ss",phpBinary("+",callbackGet(v["pa"],"ss"),v["skill87_init_ss"]));
(await ctx.call("song","learn_song_process","Alicemagic"));
(await ctx.call("song","learn_song_process","Crow Song"));});
// include/modules/extra/club/skills/skill87/main.php b8bffd0b7fbd62c6002fcc0e8f784c41a28d6ea2f288c22d02feeb5a9dddbd94
dispatcher.register("skill87","lost87",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill94/main.php bb7d8a04b36ba2ea834518145791e99c0aed16d99e3d09ecb8c73c318a1265e1
dispatcher.register("skill94","acquire94",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",94,"schoice","111",v["pa"]));});
// include/modules/extra/club/skills/skill94/main.php 5bba7e8d4e19c61d07114882eb07c0bbea29f88433d2d04b8afae45b3618339c
dispatcher.register("skill94","lost94",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",94,"schoice",v["pa"]));});
// include/modules/extra/club/skills/skill68/main.php 63fd0eee743433910f0d0bba96039f0ca1f4bc18e2a34e49b7c0e7c155b8df5c
dispatcher.register("skill68","acquire68",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill68/main.php 13e20f57246c699f8db3da6c155d7f50a868d96ce97ae23e0d378db36c690e59
dispatcher.register("skill68","lost68",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill497/main.php 42305e119209273e4719a1aa5428c03959bfebdc0a9d2a2d5ec0ea5b44d92fab
dispatcher.register("skill497","acquire497",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill497/main.php edef8274c5a0fab4461bb22ef41f639b86b941724053b88e61cbc44e8d1cc128
dispatcher.register("skill497","lost497",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill503/main.php e41ad8dbbdd4a865dea45e8ec1f21d831e849a6c5f9924b6992a2ca3fdd6e375
dispatcher.register("skill503","acquire503",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
if(phpTruthy((phpTruthy(!phpTruthy(callbackGet(v["pa"],"type"))) && phpTruthy(phpBinary(">",callbackGet(v["pa"],"hp"),0))))){callbackImport(v,ctx,["sys"]);
if(phpTruthy(!phpTruthy(callbackGet(v["gamevars"],"skill503_pnlist")))){(v["pnlist"]=callbackArray([]));}else{(v["pnlist"]=(await ctx.call("skill503","decode_pnlist503",callbackGet(v["gamevars"],"skill503_pnlist"))));}
callbackAppend((v["pnlist"]??=callbackArray([])),callbackGet(v["pa"],"name"));
callbackSet(v["gamevars"],"skill503_pnlist",(await ctx.call("skill503","encode_pnlist503",v["pnlist"])));
(await ctx.call("sys","save_gameinfo"));}
(await ctx.call("skillbase","skill_setvalue",503,"hack2_r","2",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",503,"hack3_r","2",v["pa"]));});
// include/modules/extra/card/skills/skill503/main.php f484817625cb169ad7141bac23edf7041079c2f1fa3422b1642c6ffebb5569a0
dispatcher.register("skill503","lost503",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys"]);
if(phpTruthy(!phpTruthy(callbackGet(v["gamevars"],"skill503_pnlist")))){return;}else{(v["pnlist"]=(await ctx.call("skill503","decode_pnlist503",callbackGet(v["gamevars"],"skill503_pnlist"))));}
(v["pnlist"]=callbackBuiltin("array_diff",[v["pnlist"],callbackArray([[0,callbackGet(v["pa"],"name")]])],ctx));
callbackSet(v["gamevars"],"skill503_pnlist",(await ctx.call("skill503","encode_pnlist503",v["pnlist"])));
(await ctx.call("sys","save_gameinfo"));});
// include/modules/extra/card/skills/skill559/main.php 4ac28af6af37afb922ff511c7753377ef312503feb356201a0d8ea43548a016b
dispatcher.register("skill559","acquire559",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",559,"classes","",v["pa"]));});
// include/modules/extra/card/skills/skill559/main.php cd971c90dd031a0f33eeb1a126682d22994e5b83b61244f9ed285ab4ffc79884
dispatcher.register("skill559","lost559",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",559,"classes",v["pa"]));});
// include/modules/extra/card/skills/skill544/main.php 509cb024a84e0b3a51c30909ce5ec3357f695eb9de6ef20834a3cffd63a8f2df
dispatcher.register("skill544","acquire544",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",544,"lvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",544,"activated","0",v["pa"]));});
// include/modules/extra/card/skills/skill544/main.php f4f8c3ad298c8d099777b77923ed4167c26afacfd5c01a5dfb82d8a5fbf97116
dispatcher.register("skill544","lost544",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",544,"lvl",v["pa"]));});
// include/modules/extra/activities/aprilfool2018/skill366/main.php 614c89802621a27c098a8efc90926fc742310bf77bb37b8d0e696ca9618d42a6
dispatcher.register("skill366","acquire366",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",366,"cnt","0",v["pa"]));});
// include/modules/extra/activities/aprilfool2018/skill366/main.php 8836b9779bd175e8b5f4882dd77009ac2a86347c9b934503a3520f27a79785f5
dispatcher.register("skill366","lost366",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill721/main.php 7dbf2567db89f1b25900173348f4e2e073a9a4b4df60c76352f1034a2e0cde24
dispatcher.register("skill721","acquire721",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill721/main.php d02ca20eb02a2be8acacdd232e300861ccd3ea41b01ce4f0c175c3859cae0fa0
dispatcher.register("skill721","lost721",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill228/main.php 908aa7c4aa73a1e0af7ff3db561b9911bb2f809d8352d872d626a0cbbb7e3c97
dispatcher.register("skill228","acquire228",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill228/main.php efee80e08fff2103bd29a8d28bec9a16030783173dc49f17b0c6e9aa50b9fe8b
dispatcher.register("skill228","lost228",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill236/main.php c4e2e41573b1eb8541fb7812719f3482b9d477c96fc8b314de95dec8a4e4fa7c
dispatcher.register("skill236","acquire236",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill236/main.php c195fa701e3d5f5947e3c021e029c886903437939bfb5f35b4271ecf5476dde7
dispatcher.register("skill236","lost236",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill237/main.php ebf791fb83501720794902408699431f0d4bcee526c1c010f40f32101786c937
dispatcher.register("skill237","acquire237",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill237/main.php 62e44773c1e98713c748c2f2f7855ed6c6dfbca8025f37cd9a808e83a2dd9e47
dispatcher.register("skill237","lost237",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill35/main.php 15454278d9c3e6a797a3a6a6936eb09f0fa254957812406574b2f0a295105fb3
dispatcher.register("skill35","acquire35",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",35,"lvl","0",v["pa"]));});
// include/modules/extra/club/skills/skill35/main.php 2e00176f0c6427dd351b9c436a52ea5c0758160caba8aa06cbed3df91bc231ce
dispatcher.register("skill35","lost35",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",35,"lvl",v["pa"]));});
// include/modules/extra/card/skills/skill467/main.php e2e3f5b0561749b690f5279227d8837486450b37d1a371fe1ae78461b1a0e968
dispatcher.register("skill467","acquire467",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill467/main.php 248792ebf5493520a967dcb2be6ab58858fdb65726f96579210901fbf7e6b798
dispatcher.register("skill467","lost467",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill468/main.php b9064ad9be48c714093c60d2b596db01e398873ec99e64af08562b7312db029f
dispatcher.register("skill468","acquire468",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill468/main.php 52b4f9872048c9d02d2024db97aeadfde68d16d72a7b88cd2affde8f629b0b15
dispatcher.register("skill468","lost468",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill481/main.php e317566dab811aec9c544db1138f304125132b608ee0c3e78d736e215668499c
dispatcher.register("skill481","acquire481",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill481/main.php 8151fb6834b9d891ea01fa11f343c3dc096e37cce44f0ff41a509752394ff396
dispatcher.register("skill481","lost481",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill482/main.php f68c7c57879ebb394626e06bea0899eeff3bebff355453f671b97ab62d5e6e59
dispatcher.register("skill482","acquire482",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill482/main.php 873a2f6928b492728235d21d12ba325c013ac2d3eb1f9d2ec4aa70bf2564b747
dispatcher.register("skill482","lost482",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill596/main.php 781f79cb81afcd5d11eda90ce611fc712823b478f9a5eae973df5e26a666723d
dispatcher.register("skill596","acquire596",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill596/main.php 6cf7ee5f934503b19b300f93b5f8b3d111aaa5d8e803305cfeff9dc670c4eef5
dispatcher.register("skill596","lost596",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill595/main.php 2b3ead815a143228e3f0dad3b4ddf06c6267e5295cf5eee77b7c16794d68f21e
dispatcher.register("skill595","acquire595",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill595/main.php d25ce3e4476fb3238535362facf8c8d9b8914d11e6716b1027e5469d5dd42351
dispatcher.register("skill595","lost595",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill500/main.php 9f3cea873490752690f4820f4eaf2d7b2f2d469697baa678af924b892cb970f7
dispatcher.register("skill500","acquire500",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",500,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",500,"cd_ts",0,v["pa"]));});
// include/modules/extra/card/skills/skill500/main.php 6a5018c76b4871350b4827bd195c8fd0eeb17b373fd66a44360348743433c805
dispatcher.register("skill500","lost500",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill500/main.php e2ea814e70760c724f1f4610355e06ec17616f3ea0f8adf603ee91bf0db06fc4
dispatcher.register("skill500","lost603",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.parent(v["pa"]));
callbackImport(v,ctx,["sys"]);
if(phpTruthy(!phpTruthy(!phpTruthy(callbackGet(v["gamevars"],"timestopped"))))){callbackSet(v["gamevars"],"timestopped",0);
(await ctx.call('sys','save_gameinfo'));
(await ctx.call('sys','addnews',0,"bskill500_end"));}});
// include/modules/extra/card/skills/skill701/main.php 881f0d34acde0b97b41926e729f1a0be5ad9b1109fdc267f88d9bb911eb2db76
dispatcher.register("skill701","acquire701",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill701/main.php 5d5cc761da35069324dffc1186fa9fab952d5b6995164bbb3f7761f27b1bf7a8
dispatcher.register("skill701","lost701",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill567/main.php 75d7267ff77ba8286587379f789bd0488ea76faa640fa30f24bf5e16cc30b18e
dispatcher.register("skill567","acquire567",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill567/main.php 0700f8a064060c43a00e41ad4af6fb13a40b2ee9bcdbe6aa82a1a35a1c55dabe
dispatcher.register("skill567","lost567",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill80/main.php c1f13cdc448c55a5c5f5f6e3cd80ada8384f187ac89192468656226c5ad3a0a8
dispatcher.register("skill80","acquire80",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill80/main.php 22e360545c7244425274ea7378be664606db56d95db2c38473add685401f7589
dispatcher.register("skill80","lost80",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill551/main.php a45ff1d45c2acdcd4867cd1684d96fcaacd5722ba28bdcf6465d3a56a9dd3d77
dispatcher.register("skill551","acquire551",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill551/main.php 008921770e08c712953dd90722fa56f53227e1f28550b9acf214b920594886f5
dispatcher.register("skill551","lost551",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill554/main.php 35b3adfe44a9d7bb633634009280584b9daead1be0d81775d87117f3fd534077
dispatcher.register("skill554","acquire554",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill554/main.php abe6601e756348854891f1e7ef012aab86574d8f817395680866e7a875975246
dispatcher.register("skill554","lost554",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill1006/main.php 70a84cc18afc3f75172aafc1208c8d36c83b11e940747247cd7762035dabd0ee
dispatcher.register("skill1006","acquire1006",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",1006,"beacons","",v["pa"]));});
// include/modules/extra/club/skills/skill1006/main.php bea67b7f244e4798e29939437f3da4165f84e7ef2ace2cd2f0df8d56b9e8160b
dispatcher.register("skill1006","lost1006",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill542/main.php a1618437eb211082a6350d12c5f6dc954d384bcf4b9488a99270012d84288af2
dispatcher.register("skill542","acquire542",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",542,"lvl",3,v["pa"]));});
// include/modules/extra/card/skills/skill542/main.php 7d3ea8bd6089484cfcd05fe4145487477c5fe72c2ee898b896a0d9b4c56de0da
dispatcher.register("skill542","lost542",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/instance3_ascension/skill905/main.php 85b6eb08b1b48345a443bf4365278ca0cb1ad862a68dc6cb07a93fb401993b4a
dispatcher.register("skill905","acquire905",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",905,"lvl","0",v["pa"]));});
// include/modules/extra/instance/instance3_ascension/skill905/main.php 368daf6a2cd4c798d93f413d53a369a71b1fcd8055cf8d401a067a73ed9d5dbf
dispatcher.register("skill905","lost905",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill605/main.php ad1c3a586c927a4debc04218b5b5bacf544a7b7561fa70fbf4c384b1a5869dda
dispatcher.register("skill605","acquire605",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill605/main.php ca15ff538375ab23a9e3e2e082d65ba4e686d46b56ca977efd926d9908a7dccd
dispatcher.register("skill605","lost605",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill563/main.php a6c3547931c07077be5f8179ada7e36e925c656a9081bb93f5867ed0d50fca29
dispatcher.register("skill563","acquire563",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
if(phpTruthy(phpBinary("!==",0,callbackGet(v["pa"],"club")))){(await ctx.call("skill559","sk559_getnewclass",v["pa"],phpBinary(".","club",callbackGet(v["pa"],"club"))));}});
// include/modules/extra/card/skills/skill563/main.php c4460f6aeddc25356a57f6c18d0f9b7091158a22adb9a0c798b90fa9f0fe632a
dispatcher.register("skill563","lost563",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill36/main.php cccac1ec7a1dd444ed599a97d4c057923d8581628aea4f4d313011a07e9af10d
dispatcher.register("skill36","acquire36",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill36/main.php 455999f5b3649eaa1113db0dfa7bf40d235acfc701784a63efc83766bea262ee
dispatcher.register("skill36","lost36",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill38/main.php c14e529a5ce2be45bc78f25ec65a102a837f63cca7e0ad0d2a5f6fd235dfa5fa
dispatcher.register("skill38","acquire38",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill38/main.php a8dd832c55dde556cacaa91d56ab76d65f3c0d1ba357e6d41673356f8744d01a
dispatcher.register("skill38","lost38",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill34/main.php 46a44bf90b12ed5eb1ed87c53d85d34401fbac306e2971998b20c022056a601d
dispatcher.register("skill34","acquire34",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",34,"choice","",v["pa"]));});
// include/modules/extra/club/skills/skill34/main.php 74c0dd53085eb7a14b6b639edc2640ca9e519b7df2f49a1fd847389c3ba740af
dispatcher.register("skill34","lost34",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",34,"choice",v["pa"]));});
// include/modules/extra/card/skills/skill538/main.php 928f2230709f3a0d4bdbc9adef23772e437870b5b974e6cfd9726121102d33f5
dispatcher.register("skill538","acquire538",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",538,"maxlvl","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",538,"revive_unlocked","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",538,"revive_activated","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",538,"curse_unlocked","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",538,"reboot_unlocked","0",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",538,"mask_unlocked","0",v["pa"]));});
// include/modules/extra/card/skills/skill538/main.php 99bef89fa3561631edd98a2b1ee628d6f8e4602d6605171ee07c4d55fa0fd905
dispatcher.register("skill538","lost538",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill272/main.php c507c9894437110ea06964dee91fac7feb9dcea063d5837067866cffaa56e005
dispatcher.register("skill272","acquire272",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",272,"end_ts",1,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",272,"cd_ts",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",272,"unlockcount",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",272,"lvl",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",272,"num",0,v["pa"]));});
// include/modules/extra/club/skills/skill272/main.php 541cf5108800339a92f507bc1ce061899d76ade2c0ed7ccc522570a25c3c3d5f
dispatcher.register("skill272","lost272",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",272,"unlockcount",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",272,"lvl",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",272,"num",v["pa"]));});
// include/modules/extra/card/skills/skill707/main.php ae0442ff1aa54f3977f7dad39a4e4debde3902cbbf32d82b0efb6d8100786e10
dispatcher.register("skill707","acquire707",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill707/main.php 0c8d83827878365c8c508b2b2b9208eccd6528b03b0101bae2d0452db19dc2fb
dispatcher.register("skill707","lost707",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill576/main.php ef40c17f06f38511c7b5d9efadc278383f8312952f14676e106ca3d7c93e9730
dispatcher.register("skill576","acquire576",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",576,"recipeid","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",576,"mpid",0,v["pa"]));
(await ctx.call("skillbase","skill_setvalue",576,"completeflag",0,v["pa"]));});
// include/modules/extra/card/skills/skill576/main.php 3d4e1fd8991d4993c8c8e92326569b6e8f1bdd05a575b518c614c9c156d8465c
dispatcher.register("skill576","lost576",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",576,"recipeid",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",576,"mpid",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",576,"completeflag",v["pa"]));});
// include/modules/extra/card/skills/skill575/main.php 2ac156d3379cf7dbf8bea209efdc85206f4561114075a10c049558dc8a6ce7b9
dispatcher.register("skill575","acquire575",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",575,"tpidlist","",v["pa"]));});
// include/modules/extra/card/skills/skill575/main.php 1440dbc89ad7d13e2ecf5bec24f979b16d98cb34f888f20289b4fe459f3a2417
dispatcher.register("skill575","lost575",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",575,"tpidlist",v["pa"]));});
// include/modules/extra/card/skills/skill597/main.php 065011b8856f4c199baea43efaa2f46932dc80504854d6c3d2a6a43f13f8d6d7
dispatcher.register("skill597","acquire597",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["skill597"]);
(await ctx.call("skillbase","skill_setvalue",597,"itmarr","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",597,"lvl",v["skill597_size"],v["pa"]));});
// include/modules/extra/card/skills/skill597/main.php 4bf43619f711cdef2394305cb3fa4468d85407a223d067fa5b5df63c7e5dd985
dispatcher.register("skill597","lost597",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",597,"itmarr",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",597,"lvl",v["pa"]));});
// include/modules/extra/card/skills/skill713/main.php cc7da99ac6f0673f864163cb66c9641f7aac1aad993dadb2181d8197327bb2d4
dispatcher.register("skill713","acquire713",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(v["sk713_lvl"]=(await ctx.call("skillbase","skill_getvalue",713,"lvl",v["pa"])));
if(phpTruthy(!phpTruthy(v["sk713_lvl"]))){(await ctx.call("skillbase","skill_setvalue",713,"lvl","3",v["pa"]));}else{(await ctx.call("skillbase","skill_setvalue",713,"lvl",callbackBuiltin("strval",[phpBinary("+",v["sk713_lvl"],3)],ctx),v["pa"]));}});
// include/modules/extra/card/skills/skill713/main.php 3b57e07693a98527583ec079ef5060de024567ae01031294926aff69f2695b6f
dispatcher.register("skill713","lost713",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill712/main.php 61be6c7aafb0d5cb9b05035b6f6f9e247901ce6eb1e7d8ff565df650f2e25cb6
dispatcher.register("skill712","acquire712",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["skill712"]);
(await ctx.call("skillbase","skill_setvalue",712,"end_ts",phpBinary("-",v["now"],1),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",712,"cd_ts",phpBinary("+",v["now"],v["skill712_cd"]),v["pa"]));});
// include/modules/extra/card/skills/skill712/main.php 5b37216c7cb6b74dfd004369a0f3c30fa11c884cc1609c6d558db96133bdd663
dispatcher.register("skill712","lost712",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill587/main.php 0cf52b9f3370fbaa60f3bff6a4fe079abf96ca7beaef4adcd278ef70ca8cc400
dispatcher.register("skill587","acquire587",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill587/main.php 2a18dcaeb2d5b50b5771d85eee33dc56f83894a23a55763b31e59e0eb8230b8a
dispatcher.register("skill587","lost587",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill543/main.php b3103dcc6f1afc45c6f228e238df8fb479f80b666683c89c03a2e333716e5612
dispatcher.register("skill543","acquire543",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill543/main.php bca93e4702cdc358f7bbf4f3d9971e4a8163d7e44fec043d53058e0c4dd35856
dispatcher.register("skill543","lost543",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill733/main.php b6684cd24c64419a1f13a820a2e3daf4bbb51d2367b4b1a4f486048876861c66
dispatcher.register("skill733","acquire733",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill733/main.php 9370b622c2ba6527e2edd92736d6c87b8bab778bd8a642acceaef50fee12882a
dispatcher.register("skill733","lost733",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill183/main.php 6408f24d7a4c19b2ee1aed07931c566dad93179909b4aad092b8c084254138fc
dispatcher.register("skill183","acquire183",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill183/main.php c73081d5d5aeddbd7cc2d879938f176a48ffd2985c0e6c88a3e813b8e27c719e
dispatcher.register("skill183","lost183",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill566/main.php 745f0544ea7807058f351dc4196a9ace5aa20984f3d6045da2a8e009a5eb9d3a
dispatcher.register("skill566","acquire566",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill566/main.php c51904f0656c9c1f8bd1d264d4b1a132dd70cb61684633cd8c0b032b61ceed5e
dispatcher.register("skill566","lost566",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill604/main.php 3dc262748adaa7d553a8133b3d833caa10d8ad4df7ced23dcb706479907c8382
dispatcher.register("skill604","acquire604",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill604/main.php a88ccfb53a996692edbc5657c8b7cf89960a7db99c1d49aae2925080ffd470e7
dispatcher.register("skill604","lost604",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/instance3_ascension/skill903/main.php d87e05ceeab8c7db6c4393e2fabfaa49bead1faf0d1bda638f054367b537bc56
dispatcher.register("skill903","acquire903",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",903,"lvl","0",v["pa"]));});
// include/modules/extra/instance/instance3_ascension/skill903/main.php 43159fdd5c518dfdd8cdec98f3d0eedc875bf9433d0553c4c0117edb2423d805
dispatcher.register("skill903","lost903",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill730/main.php dbdd4334e55a03b6df8f8292fc3972b08021e92d221cadc0208bfd68c7a0cb29
dispatcher.register("skill730","acquire730",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill730/main.php 2ce5a855b5494648bfb957b9f81b1ca4394949659a26d9f9d10260ab49bdc97e
dispatcher.register("skill730","lost730",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill746/main.php 74161ad757cb13064dd9c386921531689b50df30e74a7cb7b40ce69ecc9fe4f4
dispatcher.register("skill746","acquire746",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill746/main.php 6ebd29c8e1ee9658a0673fb355a6e47b75de71b3c202ab8771e68f5a5a925cb1
dispatcher.register("skill746","lost746",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill505/main.php 4ad2b77646c0457b9452d8a332957a89c133996dc0aa658b1cdcd7f0c3ffc476
dispatcher.register("skill505","acquire505",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill505"]);
(await ctx.call("skillbase","skill_setvalue",505,"u","0",v["pa"]));
(v["rpls"]=callbackBuiltin("array_randompick",[v["skill505_plslist"]],ctx));
(await ctx.call("skillbase","skill_setvalue",505,"rpls",v["rpls"],v["pa"]));
(v["itm"]=v["skill505_keyitm"]);
(v["itmk"]="DA");
(v["itme"]=100);
(v["itms"]=2);
(v["itmsk"]="Hh");
(await callbackMethod(v["db"],"query",[(phpString("INSERT INTO ") + phpString(v["tablepre"]) + phpString("mapitem (itm, itmk, itme, itms, itmsk ,pls) VALUES ('") + phpString(v["itm"]) + phpString("', '") + phpString(v["itmk"]) + phpString("', '") + phpString(v["itme"]) + phpString("', '") + phpString(v["itms"]) + phpString("', '") + phpString(v["itmsk"]) + phpString("', '") + phpString(v["rpls"]) + phpString("')"))]));});
// include/modules/extra/card/skills/skill505/main.php 236afd3ecc0a98f5760ea35315e20beba292d00963490ea7bf3e9c7d67078219
dispatcher.register("skill505","lost505",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",505,"u",v["pa"]));});
// include/modules/extra/instance/instance10_rogue/skill960/main.php 9a5f655445623becc42e922f1df90456975ebcbd7228ea2d8341a5df30f05522
dispatcher.register("skill960","acquire960",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",960,"taskarr","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",960,"taskprog","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",960,"invscore","0",v["pa"]));});
// include/modules/extra/instance/instance10_rogue/skill960/main.php 9c49193ccc23f811ace9d45dbd81aef3306e501f4ecb8d79f76b2a99afd2edfc
dispatcher.register("skill960","lost960",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",960,"taskarr",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",960,"taskprog",v["pa"]));
(await ctx.call("skillbase","skill_delvalue",960,"invscore",v["pa"]));});
// include/modules/extra/instance/instance10_rogue/skill964/main.php 91613ed6dd7528eb3b4bf4f59ab8c456b1971d82d5ea8c8d24ab2abeea24d5b5
dispatcher.register("skill964","acquire964",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",964,"packcount","",v["pa"]));
(await ctx.call("skillbase","skill_setvalue",964,"combo","",v["pa"]));});
// include/modules/extra/instance/instance10_rogue/skill964/main.php 5d5b066dd4ad4a620dce9e857c97d2a578b55fe1614f0588fc9b8b7a6ce34718
dispatcher.register("skill964","lost964",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill106/main.php 7c4bb52289fccac68db2c7eeacc24e1b8204ca5ec1d7228bda2d9159e9f3c7b5
dispatcher.register("skill106","acquire106",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill106/main.php b97c6a174ec23de549aaf140e760fce94c0b06c31bbcd5da0ccdec1d8380bb79
dispatcher.register("skill106","lost106",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill709/main.php 75af6fd35d668280acdbc8ff700458de10134597e30785e85c728a3d0db63b96
dispatcher.register("skill709","acquire709",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill709/main.php f790fd4895b160eb7b97bcba7ddf874ef2283f0c649ddf07dd6f9e86b6c3c7af
dispatcher.register("skill709","lost709",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill722/main.php 7984656b25c8fa6b4c92f0be8ea4b8d43f5f42d682fabe65e598558db7d3f736
dispatcher.register("skill722","acquire722",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill722/main.php 7e1a30815ca813918562dbedb9d722cfa255fd9b343c952d0327bf5f8aed2e2c
dispatcher.register("skill722","lost722",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill737/main.php 364fa5d9f2e189ae45fd257cdf09fd82dddb65838ceed0cb698de9f832f11e5d
dispatcher.register("skill737","acquire737",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill737/main.php 3bd16e5ec89b59d597871dd61551cb3212206385ac8bb5e69d42e5b8113309e6
dispatcher.register("skill737","lost737",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill714/main.php 514668530a34f781343ce758774538c11a098a9efb95cb7995651dc7a89998fc
dispatcher.register("skill714","acquire714",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill714/main.php 02736c6aeadc5ca5ed6f32c810f54a8708cc26111e471c4b9a3c32727ea35f2a
dispatcher.register("skill714","lost714",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill26/main.php 117f10c9b40012950b62d7c4b54bece59a63c35f672c9cc337a95f86ff3b0f6a
dispatcher.register("skill26","acquire26",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",26,"lvl","1",v["pa"]));});
// include/modules/extra/club/skills/skill26/main.php 85dc5aa18ab0fdbd30be01fbdb0f3d60774766e392baee39c770af1d5cf5b4dd
dispatcher.register("skill26","lost26",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_delvalue",26,"lvl",v["pa"]));});
// include/modules/extra/club/skills/skill265/main.php 6c24cacdca56cafa13f9197017142d2bfea593cc4f08c4be7fdafff8bb182fd2
dispatcher.register("skill265","acquire265",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",265,"unlocked","0",v["pa"]));});
// include/modules/extra/club/skills/skill265/main.php cd0789778e16c1d54c92ad2ea562a905aac548049d0e9c37e58b22debacedb9a
dispatcher.register("skill265","lost265",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill507/main.php 645e95feef4f68dceff9d01fdf7f16a841588230276e97a336514bc2d7c482ae
dispatcher.register("skill507","acquire507",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skill507","init_countdown507",v["pa"]));});
// include/modules/extra/card/skills/skill507/main.php 3713f69f16b5de227a852d801f35775f41d851e2b83ae01d13a894d2833623a7
dispatcher.register("skill507","lost507",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill113/main.php f733cf492da90a412d6829a2ebd19a41afbe251610f2c309692f8660d85970e4
dispatcher.register("skill113","acquire113",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill113/main.php e20337f091ff8cf5ae99013874b4c102b134598ee7285762dd6fc76ad95fc245
dispatcher.register("skill113","lost113",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill748/main.php 74892da84ce5f86523b3edea040d465c9744c98e7fcb646b2e73a0006c7225ec
dispatcher.register("skill748","acquire748",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill748/main.php 0e54aed486e28f51df9ebe176bf22964d36a5b738813bd06d0ef8828c20496bd
dispatcher.register("skill748","lost748",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill27/main.php e734da1cb7b378db5cd799a651fb29d170cda55481d1d0e6132c0c1579b61596
dispatcher.register("skill27","acquire27",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill27/main.php bd551bdecca6c838ef679c549d396e9846f952ce0c582c218494a75f6719ece9
dispatcher.register("skill27","lost27",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill489/main.php cb74bcf698948f9ef1280d4d92cbfc21a4d87fdb0e1f7dfa4e99a0a18c705d40
dispatcher.register("skill489","acquire489",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill489/main.php a8e63a8b5c620b39d60626e24b211cd67b6488ac8cf2db1f0a7e2edf389d3ba2
dispatcher.register("skill489","lost489",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill266/main.php ad6af5e326a6d9edf98beb60bee2e66f19269eff57603d98a127c67dc93c619a
dispatcher.register("skill266","acquire266",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill266/main.php 724bb73d418b7491efc4978a731ba0f5a5fe5783464e8b0896159e6bea5e0f75
dispatcher.register("skill266","lost266",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill81/main.php d045473f08ef42405f525b076b450600652165240147d1d4db3432bdb56defa9
dispatcher.register("skill81","acquire81",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/club/skills/skill81/main.php fa0db5995241ef4e889333a8f2184b9142d0363023c04d6f3515aa546bb5b769
dispatcher.register("skill81","lost81",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill509/main.php 2aaaa46798aa7818ea51b588e2de45de0b099e955f3d332bddc17f4dc311f7ac
dispatcher.register("skill509","acquire509",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill509/main.php b89d6487925d08b37f0f52226d9cf901ee6106bc9eaa4b4f92fa5a630fd00281
dispatcher.register("skill509","lost509",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/card/skills/skill510/main.php a27e52710ebe98454b3efb0e60352844e317ab2f0a21c806026332dfd9af6908
dispatcher.register("skill510","acquire510",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
(await ctx.call("skillbase","skill_setvalue",510,"lvl","0",v["pa"]));});
// include/modules/extra/card/skills/skill510/main.php 62922543b4bfbcdb9c2b8347c306f3ca93af78ab4fa6bcfcf2e7aac5b5b737b7
dispatcher.register("skill510","lost510",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
// include/modules/extra/instance/instance10_rogue/skill962/main.php 876f2719b17a009e5cb1d924bf3dd99aea573f4de1af763a25cb8be9f0a667ba
dispatcher.register("skill962","acquire962",async(ctx,pa)=>{const v:Record<string,unknown>={pa};
callbackImport(v,ctx,["sys","skill962"]);
(await ctx.call("skillbase","skill_setvalue",962,"end_ts",phpBinary("-",v["now"],1),v["pa"]));
(await ctx.call("skillbase","skill_setvalue",962,"cd_ts",phpBinary("+",v["now"],v["skill962_cd"]),v["pa"]));});
// include/modules/extra/instance/instance10_rogue/skill962/main.php ff370d22a981d5a122132f6b2e3cdf35f40db21937dabdf283e4c1f49bbdf3be
dispatcher.register("skill962","lost962",async(ctx,pa)=>{const v:Record<string,unknown>={pa};});
}
