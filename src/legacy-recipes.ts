/**
 * Imported from the upstream ACFUN DTS PHP itemmix rule configuration.
 * Source: sillycross/dts/include/modules/base/itemmix/itemmix/config/itemmix.config.php
 * All 373 active syntactic rules preserved in source order, including hidden and event-specific rules.
 * This is a rule DATA migration, not a full behavior implementation: class gates, item attributes,
 * event flags, status requirements, and specialized effects still need source-level porting and testing.
 */
export interface LegacyCraftRule {
  id: string;
  group: string;
  ingredients: string[];
  name: string;
  kind: string;
  rawResult: string;
}
export const LEGACY_CRAFT_RULES: readonly LegacyCraftRule[] = [
  {
    "id": "recipe_001",
    "group": "h",
    "ingredients": [
      "杂炊",
      "松茸"
    ],
    "name": "松茸御饭",
    "kind": "HS",
    "rawResult": "'松茸御饭','HS',120,10,"
  },
  {
    "id": "recipe_002",
    "group": "h",
    "ingredients": [
      "咖喱",
      "面包"
    ],
    "name": "咖喱面包",
    "kind": "HH",
    "rawResult": "'咖喱面包','HH',140,2,"
  },
  {
    "id": "recipe_003",
    "group": "h",
    "ingredients": [
      "牛奶",
      "立顿茶包",
      "糯米丸子"
    ],
    "name": "珍珠奶茶",
    "kind": "HB",
    "rawResult": "'珍珠奶茶','HB',270,9,"
  },
  {
    "id": "recipe_004",
    "group": "h",
    "ingredients": [
      "早苗面包",
      "像围棋子一样的饼干",
      "浓厚粘稠果汁",
      "桔黄色的果酱"
    ],
    "name": "KEY系儿童套餐",
    "kind": "HB",
    "rawResult": "'KEY系儿童套餐','HB',333,33,"
  },
  {
    "id": "recipe_005",
    "group": "h",
    "ingredients": [
      "针筒",
      "疗伤药"
    ],
    "name": "治疗针",
    "kind": "HH",
    "rawResult": "'治疗针','HH',200,5,"
  },
  {
    "id": "recipe_006",
    "group": "h",
    "ingredients": [
      "精神制剂",
      "解毒剂"
    ],
    "name": "体力回复药",
    "kind": "HS",
    "rawResult": "'体力回复药','HS',200,5,"
  },
  {
    "id": "recipe_007",
    "group": "h",
    "ingredients": [
      "治疗针",
      "体力回复药",
      "蒸馏水"
    ],
    "name": "特级恢复药",
    "kind": "HB",
    "rawResult": "'特级恢复药','HB',240,3,"
  },
  {
    "id": "recipe_008",
    "group": "h",
    "ingredients": [
      "甜生姜",
      "地雷酥糖"
    ],
    "name": "曾经的荣光-橙黄",
    "kind": "HB",
    "rawResult": "'曾经的荣光-橙黄','HB',50,1,"
  },
  {
    "id": "recipe_009",
    "group": "h",
    "ingredients": [
      "曾经的荣光-橙黄",
      "面包"
    ],
    "name": "更改菜谱后的不甜酱包",
    "kind": "HB",
    "rawResult": "'更改菜谱后的不甜酱包','HB',300,4,'Z'"
  },
  {
    "id": "recipe_010",
    "group": "h",
    "ingredients": [
      "早苗面包",
      "仙贝面包",
      "海星面包",
      "彩虹光芒的面包"
    ],
    "name": "禁忌「Four of a Bread」",
    "kind": "HB",
    "rawResult": "'禁忌「Four of a Bread」','HB',444,4,'z'"
  },
  {
    "id": "recipe_011",
    "group": "h",
    "ingredients": [
      "寂寞",
      "脸",
      "杯子"
    ],
    "name": "淡定红茶",
    "kind": "HB",
    "rawResult": "'淡定红茶','HB',200,20,"
  },
  {
    "id": "recipe_012",
    "group": "h",
    "ingredients": [
      "凸眼鱼",
      "面包",
      "锅"
    ],
    "name": "仰望星空派",
    "kind": "HR",
    "rawResult": "'仰望星空派','HR',30,3,"
  },
  {
    "id": "recipe_013",
    "group": "h",
    "ingredients": [
      "河豚鱼",
      "氯化氢",
      "大夭使的气息"
    ],
    "name": "鲱鱼罐头",
    "kind": "PR9",
    "rawResult": "'鲱鱼罐头','PR9',90,10,"
  },
  {
    "id": "recipe_014",
    "group": "h",
    "ingredients": [
      "矿泉水",
      "杏仁豆腐",
      "SCP-294的饮料"
    ],
    "name": "【社系摧泪弹】",
    "kind": "PB",
    "rawResult": "'【社系摧泪弹】','PB',3600,5,'zd'"
  },
  {
    "id": "recipe_015",
    "group": "wc",
    "ingredients": [
      "汽油",
      "空瓶"
    ],
    "name": "☆火焰瓶☆",
    "kind": "WC",
    "rawResult": "'☆火焰瓶☆','WC',80,50,'ud'"
  },
  {
    "id": "recipe_016",
    "group": "wc",
    "ingredients": [
      "幻之使魔",
      "永恒之桶"
    ],
    "name": "灵魂的结晶",
    "kind": "WC",
    "rawResult": "'灵魂的结晶','WC',180,240,'rn'"
  },
  {
    "id": "recipe_017",
    "group": "wc",
    "ingredients": [
      "幻符【杀人玩偶】",
      "★时停怀表★",
      "永恒飞刃"
    ],
    "name": "幻葬『夜雾幻影杀人鬼』",
    "kind": "WC",
    "rawResult": "'幻葬『夜雾幻影杀人鬼』','WC',400,'∞','krnyN'"
  },
  {
    "id": "recipe_018",
    "group": "wk",
    "ingredients": [
      "西瓜",
      "水果刀",
      "磨刀石"
    ],
    "name": "西瓜刀",
    "kind": "WK",
    "rawResult": "'西瓜刀','WK',99,'∞','c'"
  },
  {
    "id": "recipe_019",
    "group": "wk",
    "ingredients": [
      "针筒",
      "毒药"
    ],
    "name": "毒针",
    "kind": "WK",
    "rawResult": "'毒针','WK',32,20,'p'"
  },
  {
    "id": "recipe_020",
    "group": "wk",
    "ingredients": [
      "毒针",
      "毒针"
    ],
    "name": "D.毒针",
    "kind": "WK",
    "rawResult": "'D.毒针','WK',48,20,'p'"
  },
  {
    "id": "recipe_021",
    "group": "wk",
    "ingredients": [
      "D.毒针",
      "D.毒针",
      "D.毒针"
    ],
    "name": "D.D.D",
    "kind": "WK",
    "rawResult": "'D.D.D','WK',80,20,'pN'"
  },
  {
    "id": "recipe_022",
    "group": "wk",
    "ingredients": [
      "D.D.D",
      "D.毒针",
      "实验饰品A",
      "提示纸条C",
      "原型武器D",
      "原型武器C"
    ],
    "name": "D.D.D.D.C",
    "kind": "WK",
    "rawResult": "'D.D.D.D.C','WK',1976,9,'tNy'"
  },
  {
    "id": "recipe_023",
    "group": "wk",
    "ingredients": [
      "白色的羽毛",
      "金色方块"
    ],
    "name": "凤凰之羽",
    "kind": "WK",
    "rawResult": "'凤凰之羽','WK',20,200,'u'"
  },
  {
    "id": "recipe_024",
    "group": "wk",
    "ingredients": [
      "白色的羽毛",
      "银色方块"
    ],
    "name": "露琪亚之羽",
    "kind": "WK",
    "rawResult": "'露琪亚之羽','WK',50,200,'i'"
  },
  {
    "id": "recipe_025",
    "group": "wk",
    "ingredients": [
      "白色的羽毛",
      "白色的羽毛",
      "白色的羽毛",
      "白色的羽毛",
      "白色的羽毛"
    ],
    "name": "纯白片翼",
    "kind": "WK",
    "rawResult": "'纯白片翼','WK',150,200,'iay'"
  },
  {
    "id": "recipe_026",
    "group": "wk",
    "ingredients": [
      "纯白片翼",
      "纯白片翼"
    ],
    "name": "纯白双翼",
    "kind": "WK",
    "rawResult": "'纯白双翼','WK',150,200,'kby'"
  },
  {
    "id": "recipe_027",
    "group": "wk",
    "ingredients": [
      "白色的羽毛",
      "闪耀的羽毛",
      "彩虹光芒的羽毛",
      "翼人的羽毛"
    ],
    "name": "悲叹片翼",
    "kind": "WK",
    "rawResult": "'悲叹片翼','WK',3200,200,'aiy'"
  },
  {
    "id": "recipe_028",
    "group": "wk",
    "ingredients": [
      "白色的羽毛",
      "凤凰之羽",
      "露琪亚之羽",
      "绿宝石方块"
    ],
    "name": "精灵片翼",
    "kind": "WK",
    "rawResult": "'精灵片翼','WK',300,200,'uidy'"
  },
  {
    "id": "recipe_029",
    "group": "wk",
    "ingredients": [
      "『祝福宝石』",
      "『风魔激光刃』"
    ],
    "name": "Azurewrath",
    "kind": "WK",
    "rawResult": "'Azurewrath','WK',82,122,'rci'"
  },
  {
    "id": "recipe_030",
    "group": "wk",
    "ingredients": [
      "悲叹之种",
      "Azurewrath"
    ],
    "name": "憎恨裂片",
    "kind": "WK",
    "rawResult": "'憎恨裂片','WK',840,76,'rNce'"
  },
  {
    "id": "recipe_031",
    "group": "wk",
    "ingredients": [
      "悲叹之种",
      "☆碧藍怒火☆"
    ],
    "name": "★憎恨裂片★",
    "kind": "WK",
    "rawResult": "'★憎恨裂片★','WK',1240,94,'ripe'"
  },
  {
    "id": "recipe_032",
    "group": "wk",
    "ingredients": [
      "绿色方块",
      "绿色方块"
    ],
    "name": "沾满绿锈的铜刀",
    "kind": "WK",
    "rawResult": "'沾满绿锈的铜刀','WK',52,52,'pc'"
  },
  {
    "id": "recipe_033",
    "group": "hidden",
    "ingredients": [
      "沾满绿锈的铜刀",
      "『祝福宝石』"
    ],
    "name": "妖刀【飞叶】",
    "kind": "WK",
    "rawResult": "'妖刀【飞叶】','WK',5,2,'rpc'"
  },
  {
    "id": "recipe_034",
    "group": "hidden",
    "ingredients": [
      "妖刀【飞叶】",
      "★全地图唯一的野生高伤阔剑地雷★"
    ],
    "name": "影刀【秋岚】",
    "kind": "WK",
    "rawResult": "'影刀【秋岚】','WK',522,522,'Zrpdc'"
  },
  {
    "id": "recipe_035",
    "group": "wk",
    "ingredients": [
      "■DarthNote■",
      "☆七星认证☆"
    ],
    "name": "夜刀【月影】",
    "kind": "WK",
    "rawResult": "'夜刀【月影】','WK',130,170,'pc'"
  },
  {
    "id": "recipe_036",
    "group": "wk",
    "ingredients": [
      "夜刀【月影】",
      "悲叹之种"
    ],
    "name": "疾风刀【里月影】",
    "kind": "WK",
    "rawResult": "'疾风刀【里月影】','WK',570,240,'rdc'"
  },
  {
    "id": "recipe_037",
    "group": "wk",
    "ingredients": [
      "夜刀【月影】",
      "《魔女的魔导书》"
    ],
    "name": "破岩刀【焰】",
    "kind": "WK",
    "rawResult": "'破岩刀【焰】','WK',660,120,'Hudc'"
  },
  {
    "id": "recipe_038",
    "group": "wk",
    "ingredients": [
      "破岩刀【焰】",
      "☆爆裂模式☆"
    ],
    "name": "碎光之晓刀",
    "kind": "WK",
    "rawResult": "'碎光之晓刀','WK',2400,14,'Hdc'"
  },
  {
    "id": "recipe_039",
    "group": "wk",
    "ingredients": [
      "夜刀【月影】",
      "《曾伽·宗博尔特自传》"
    ],
    "name": "七星刀【天权】",
    "kind": "WK",
    "rawResult": "'七星刀【天权】','WK',777,777,'Nnrp'"
  },
  {
    "id": "recipe_040",
    "group": "wk",
    "ingredients": [
      "曾经的荣光-深蓝",
      "蓝宝石方块"
    ],
    "name": "奥义『冰华⑨咲』",
    "kind": "WKF",
    "rawResult": "'奥义『冰华⑨咲』','WKF',299,'∞','crkN'"
  },
  {
    "id": "recipe_041",
    "group": "wk",
    "ingredients": [
      "奥义『冰华⑨咲』",
      "《曾伽·宗博尔特自传》"
    ],
    "name": "奥义『超⑨武神霸斩』",
    "kind": "WKF",
    "rawResult": "'奥义『超⑨武神霸斩』','WKF',999,'∞','rkNaH'"
  },
  {
    "id": "recipe_042",
    "group": "wk",
    "ingredients": [
      "原型武器K",
      "食堂的盒饭"
    ],
    "name": "骨刃",
    "kind": "WK",
    "rawResult": "'骨刃','WK',130,80,'',"
  },
  {
    "id": "recipe_043",
    "group": "wk",
    "ingredients": [
      "骨刃",
      "水群之枪",
      "丢人之摸",
      "雪碧之罐",
      "捧杀之钩"
    ],
    "name": "轰剑【虎眼】",
    "kind": "WK",
    "rawResult": "'轰剑【虎眼】','WK',360,200,'',"
  },
  {
    "id": "recipe_044",
    "group": "wk",
    "ingredients": [
      "轰剑【虎眼】",
      "磨刀石",
      "沉默磨刀石",
      "传说的白磨刀石"
    ],
    "name": "吼剑【地咬】",
    "kind": "WK",
    "rawResult": "'吼剑【地咬】','WK',840,120,'',"
  },
  {
    "id": "recipe_045",
    "group": "wk",
    "ingredients": [
      "轰剑【虎眼】",
      "磨刀石",
      "沉默磨刀石",
      "赛路尔之磨刀石"
    ],
    "name": "吼剑【地咬】",
    "kind": "WK",
    "rawResult": "'吼剑【地咬】','WK',840,120,'',"
  },
  {
    "id": "recipe_046",
    "group": "wk",
    "ingredients": [
      "吼剑【地咬】",
      "大型闹钟",
      "GS【伪Hand_Sonic】",
      "【逆转的女神】",
      "触手的力量"
    ],
    "name": "冲剑【虎啸】",
    "kind": "WK",
    "rawResult": "'冲剑【虎啸】','WK',3170,250,'',"
  },
  {
    "id": "recipe_047",
    "group": "wk",
    "ingredients": [
      "吼剑【地咬】",
      "爪拳 Haab",
      "破魔镰·断月",
      "『雷米尔之冲击』",
      "5.45mm 无声手枪",
      "空想爆弹 ~ 出乎意料"
    ],
    "name": "冲剑【虎啸】",
    "kind": "WK",
    "rawResult": "'冲剑【虎啸】','WK',4320,250,'',"
  },
  {
    "id": "recipe_048",
    "group": "wk",
    "ingredients": [
      "冲剑【虎啸】",
      "世灭之愿",
      "强袭之愿",
      "CAVE社特典CD『胎慟』"
    ],
    "name": "绝冲剑【虎王】",
    "kind": "WK",
    "rawResult": "'绝冲剑【虎王】','WK',7290,2350,'Nrd'"
  },
  {
    "id": "recipe_049",
    "group": "wk",
    "ingredients": [
      "绝冲剑【虎王】",
      "最终战术『蝎尾』"
    ],
    "name": "绝冲大剑【神威】",
    "kind": "WK",
    "rawResult": "'绝冲大剑【神威】','WK',80000,'∞','ZNnyrdf'"
  },
  {
    "id": "recipe_050",
    "group": "wk",
    "ingredients": [
      "冰封的『Oathkeeper』",
      "火把"
    ],
    "name": "『Oathkeeper』",
    "kind": "WK",
    "rawResult": "'『Oathkeeper』','WK',300,10,'u'"
  },
  {
    "id": "recipe_051",
    "group": "wk",
    "ingredients": [
      "冰封的『Oathkeeper』",
      "解冻药水"
    ],
    "name": "『Oathkeeper』",
    "kind": "WK",
    "rawResult": "'『Oathkeeper』','WK',300,10,'u'"
  },
  {
    "id": "recipe_052",
    "group": "wk",
    "ingredients": [
      "冰封的『Oblivion』",
      "火把"
    ],
    "name": "『Oblivion』",
    "kind": "WK",
    "rawResult": "'『Oblivion』','WK',300,10,'i'"
  },
  {
    "id": "recipe_053",
    "group": "wk",
    "ingredients": [
      "冰封的『Oblivion』",
      "解冻药水"
    ],
    "name": "『Oblivion』",
    "kind": "WK",
    "rawResult": "'『Oblivion』','WK',300,10,'i'"
  },
  {
    "id": "recipe_054",
    "group": "wk",
    "ingredients": [
      "『Oathkeeper』",
      "『Oblivion』"
    ],
    "name": "『Two Become One』",
    "kind": "WK",
    "rawResult": "'『Two Become One』','WK',450,20,'ui'"
  },
  {
    "id": "recipe_055",
    "group": "wp",
    "ingredients": [
      "电击鞭",
      "原型武器P",
      "实验装甲A"
    ],
    "name": "『T-LINK念动冲拳』",
    "kind": "WP",
    "rawResult": "'『T-LINK念动冲拳』','WP',180,'∞','e'"
  },
  {
    "id": "recipe_056",
    "group": "wp",
    "ingredients": [
      "☆电击器☆",
      "原型武器P",
      "实验装甲A"
    ],
    "name": "『T-LINK念动冲拳』",
    "kind": "WP",
    "rawResult": "'『T-LINK念动冲拳』','WP',240,'∞','e'"
  },
  {
    "id": "recipe_057",
    "group": "wp",
    "ingredients": [
      "『T-LINK念动冲拳』",
      "增幅设备"
    ],
    "name": "『T-LINK天上天下念动连击拳』",
    "kind": "WP",
    "rawResult": "'『T-LINK天上天下念动连击拳』','WP',240,'∞','erN'"
  },
  {
    "id": "recipe_058",
    "group": "wp",
    "ingredients": [
      "冰沙",
      "小棍棒",
      "御神签"
    ],
    "name": "冰棍棒",
    "kind": "WP",
    "rawResult": "'冰棍棒','WP',19,39,'ir'"
  },
  {
    "id": "recipe_059",
    "group": "wp",
    "ingredients": [
      "【北斗百裂拳】",
      "《北斗神拳》"
    ],
    "name": "【北斗有情破颜拳】",
    "kind": "WP",
    "rawResult": "'【北斗有情破颜拳】','WP',390,100,'drny'"
  },
  {
    "id": "recipe_060",
    "group": "wp",
    "ingredients": [
      "☆金属拳套☆",
      "压缩气罐"
    ],
    "name": "☆简易火箭飞拳☆",
    "kind": "WP",
    "rawResult": "'☆简易火箭飞拳☆','WP',160,'∞','cd'"
  },
  {
    "id": "recipe_061",
    "group": "wp",
    "ingredients": [
      "☆简易火箭飞拳☆",
      "电磁发射装置"
    ],
    "name": "★火箭飞拳★",
    "kind": "WP",
    "rawResult": "'★火箭飞拳★','WP',400,'∞','cdN'"
  },
  {
    "id": "recipe_062",
    "group": "wp",
    "ingredients": [
      "《哲♂学》",
      "小棍棒",
      "增幅设备"
    ],
    "name": "森之妖精的棍棒",
    "kind": "WP",
    "rawResult": "'森之妖精的棍棒','WP',200,60,'re'"
  },
  {
    "id": "recipe_063",
    "group": "wp",
    "ingredients": [
      "『祝福宝石』",
      "『心灵激光鞭』"
    ],
    "name": "萨卡兰姆神圣棍棒",
    "kind": "WP",
    "rawResult": "'萨卡兰姆神圣棍棒','WP',150,140,'Nwcy'"
  },
  {
    "id": "recipe_064",
    "group": "wp",
    "ingredients": [
      "悲叹之种",
      "萨卡兰姆神圣棍棒"
    ],
    "name": "妖邪必败",
    "kind": "WP",
    "rawResult": "'妖邪必败','WP',1540,200,'Nfcy'"
  },
  {
    "id": "recipe_065",
    "group": "wp",
    "ingredients": [
      "『延展御柱』",
      "驱云弹",
      "弹幕符札"
    ],
    "name": "御柱「Meteoric Onbashira」",
    "kind": "WP",
    "rawResult": "'御柱「Meteoric Onbashira」','WP',200,50,'Nir'"
  },
  {
    "id": "recipe_066",
    "group": "wp",
    "ingredients": [
      "手机",
      "手枪子弹"
    ],
    "name": "『诺基亚』",
    "kind": "WP",
    "rawResult": "'『诺基亚』','WP',50,9999,'N'"
  },
  {
    "id": "recipe_067",
    "group": "wp",
    "ingredients": [
      "『诺基亚』",
      "曾经的荣光-巨盾",
      "防弹背心",
      "防弹背心",
      "防弹背心",
      "防弹背心"
    ],
    "name": "『曾经的荣光-诺基亚』",
    "kind": "WP",
    "rawResult": "'『曾经的荣光-诺基亚』','WP',255,9999,'NAZ'"
  },
  {
    "id": "recipe_068",
    "group": "wp",
    "ingredients": [
      "葱娘の葱",
      "葱娘肉包"
    ],
    "name": "葱娘V4X的合成器",
    "kind": "WP",
    "rawResult": "'葱娘V4X的合成器','WP',200,50,'tr'"
  },
  {
    "id": "recipe_069",
    "group": "wp",
    "ingredients": [
      "MIKU的原味内裤",
      "MIKU的小葱"
    ],
    "name": "MIKU V4X的双马尾",
    "kind": "WP",
    "rawResult": "'MIKU V4X的双马尾','WP',600,100,'miku'"
  },
  {
    "id": "recipe_070",
    "group": "wp_mrm",
    "ingredients": [
      "雏人形",
      "☆博丽护符☆",
      "原型武器P"
    ],
    "name": "【人形降临】",
    "kind": "WP",
    "rawResult": "'【人形降临】','WP',66,666,'t'"
  },
  {
    "id": "recipe_071",
    "group": "wp_mrm",
    "ingredients": [
      "【人形降临】",
      "触手的力量",
      "☆十星认证☆"
    ],
    "name": "【人形降临·白恶魔】",
    "kind": "WP",
    "rawResult": "'【人形降临·白恶魔】','WP',666,666,'etAj'"
  },
  {
    "id": "recipe_072",
    "group": "wp_mrm",
    "ingredients": [
      "【人形降临·白恶魔】",
      "触手的潜能",
      "《东方灵异传》"
    ],
    "name": "【人形降临·光魔】",
    "kind": "WP",
    "rawResult": "'【人形降临·光魔】','WP',666,666,'trdj'"
  },
  {
    "id": "recipe_073",
    "group": "wp_mrm",
    "ingredients": [
      "【人形降临·光魔】",
      "简称为UCW的杏仁豆腐",
      "悲叹之种"
    ],
    "name": "【人形降临·神忌】",
    "kind": "WP",
    "rawResult": "'【人形降临·神忌】','WP',6666,666,'tbrdj'"
  },
  {
    "id": "recipe_074",
    "group": "wp_mrm",
    "ingredients": [
      "【人形降临·忌影】",
      "深生态杏仁豆腐",
      "悲叹之种"
    ],
    "name": "【人形降临·皇祸】",
    "kind": "WP",
    "rawResult": "'【人形降临·皇祸】','WP',6666,666,'kBrdj'"
  },
  {
    "id": "recipe_075",
    "group": "wp_mrm",
    "ingredients": [
      "【人形降临·血鬼】",
      "【全屏幕弹幕发射】",
      "悲叹之种"
    ],
    "name": "【人形降临·终堕天】",
    "kind": "WP",
    "rawResult": "'【人形降临·终堕天】','WP',6666,666,'fyrdj'"
  },
  {
    "id": "recipe_076",
    "group": "wp_mrm",
    "ingredients": [
      "【人形降临·终堕天】",
      "『410Gauge重型左轮』",
      "【HP制御系统】"
    ],
    "name": "【死神降临】",
    "kind": "WP",
    "rawResult": "'【死神降临】','WP',6666,666,'nyNdrv'"
  },
  {
    "id": "recipe_077",
    "group": "wp_mrm",
    "ingredients": [
      "【人形降临·终堕天】",
      "格林多管激光炮",
      "【HP制御系统】"
    ],
    "name": "【死神降临】",
    "kind": "WP",
    "rawResult": "'【死神降临】','WP',6666,666,'ByNdrv'"
  },
  {
    "id": "recipe_078",
    "group": "wp_mrm",
    "ingredients": [
      "【人形降临·终堕天】",
      "小型高威力试作性防身设备『绯蜂』",
      "【HP制御系统】"
    ],
    "name": "【死神降临】",
    "kind": "WP",
    "rawResult": "'【死神降临】','WP',6666,666,'bBNdrv'"
  },
  {
    "id": "recipe_079",
    "group": "wp_mrm",
    "ingredients": [
      "【死神降临】",
      "【死神降临】",
      "【死神降临】"
    ],
    "name": "【死神绝界】",
    "kind": "WP",
    "rawResult": "'【死神绝界】','WP',6666,666,'ZBbdrV'"
  },
  {
    "id": "recipe_080",
    "group": "wg",
    "ingredients": [
      "『环形激光』",
      "红宝石方块",
      "原型武器G"
    ],
    "name": "『红石光束炮』",
    "kind": "WG",
    "rawResult": "'『红石光束炮』','WG',240,360,'ud'"
  },
  {
    "id": "recipe_081",
    "group": "hidden",
    "ingredients": [
      "红宝石方块",
      "蓝宝石方块",
      "绿宝石方块",
      "非法枪械部件"
    ],
    "name": "『宝石光束炮-试作型』",
    "kind": "WG",
    "rawResult": "'『宝石光束炮-试作型』','WG',1800,144,'ndo'"
  },
  {
    "id": "recipe_082",
    "group": "wg",
    "ingredients": [
      "老式火枪",
      "原型武器G",
      "某种电子零件"
    ],
    "name": "★发条式突击步枪★",
    "kind": "WG",
    "rawResult": "'★发条式突击步枪★','WG',150,100,'r'"
  },
  {
    "id": "recipe_083",
    "group": "wg",
    "ingredients": [
      "『60mm火神炮』",
      "鲨鱼鳍",
      "原型武器G"
    ],
    "name": "『迷你鲨』",
    "kind": "WG",
    "rawResult": "'『迷你鲨』','WG',20,12,'r'"
  },
  {
    "id": "recipe_084",
    "group": "wg",
    "ingredients": [
      "『120mm火神炮』",
      "鲨鱼鳍",
      "原型武器G"
    ],
    "name": "『迷你鲨』",
    "kind": "WG",
    "rawResult": "'『迷你鲨』','WG',30,12,'r'"
  },
  {
    "id": "recipe_085",
    "group": "wg",
    "ingredients": [
      "『迷你鲨』",
      "奇异甜食",
      "某种电子零件"
    ],
    "name": "『巨兽鲨』",
    "kind": "WG",
    "rawResult": "'『巨兽鲨』','WG',180,240,'rc'"
  },
  {
    "id": "recipe_086",
    "group": "wg",
    "ingredients": [
      "『巨兽鲨』",
      "游戏王四星素材",
      "游戏王四星素材"
    ],
    "name": "『No.101 寂静荣誉方舟骑士鲨』",
    "kind": "WG",
    "rawResult": "'『No.101 寂静荣誉方舟骑士鲨』','WG',404,101,'rkc'"
  },
  {
    "id": "recipe_087",
    "group": "wg",
    "ingredients": [
      "喷雾器罐",
      "打火机",
      "汽油"
    ],
    "name": "★简易火焰放射器★",
    "kind": "WG",
    "rawResult": "'★简易火焰放射器★','WG',150,160,'uo'"
  },
  {
    "id": "recipe_088",
    "group": "wg",
    "ingredients": [
      "★阔剑地雷★",
      "电磁发射装置",
      "某种电子零件"
    ],
    "name": "【定向阔剑发射器】",
    "kind": "WG",
    "rawResult": "'【定向阔剑发射器】','WG',810,3,'dNoy'"
  },
  {
    "id": "recipe_089",
    "group": "wg",
    "ingredients": [
      "★阔剑地雷★",
      "【定向阔剑发射器】"
    ],
    "name": "【定向阔剑发射器】",
    "kind": "WG",
    "rawResult": "'【定向阔剑发射器】','WG',810,3,'dNoy'"
  },
  {
    "id": "recipe_090",
    "group": "wg",
    "ingredients": [
      "★M-200狙击步枪★",
      "电磁发射装置"
    ],
    "name": "【磁轨狙击步枪】",
    "kind": "WJ",
    "rawResult": "'【磁轨狙击步枪】','WJ',240,12,'eno'"
  },
  {
    "id": "recipe_091",
    "group": "wg",
    "ingredients": [
      "『高性能双重激光』",
      "『高性能双重激光』",
      "『高性能双重激光』"
    ],
    "name": "☆金色闪光☆",
    "kind": "WJ",
    "rawResult": "'☆金色闪光☆','WJ',700,1,'NS'"
  },
  {
    "id": "recipe_092",
    "group": "wg",
    "ingredients": [
      "恐龙玩偶",
      "天使玩偶",
      "团子玩偶"
    ],
    "name": "观铃的嘎哦嘎哦恐龙喷火分队",
    "kind": "WG",
    "rawResult": "'观铃的嘎哦嘎哦恐龙喷火分队','WG',333,10,'ufr'"
  },
  {
    "id": "recipe_093",
    "group": "wg",
    "ingredients": [
      "水濑 名雪的半身像",
      "立华 奏的半身像",
      "冷冻光束枪"
    ],
    "name": "佐佑理学姐的塑料水枪",
    "kind": "WG",
    "rawResult": "'佐佑理学姐的塑料水枪','WG',333,10,'ikr'"
  },
  {
    "id": "recipe_094",
    "group": "wg",
    "ingredients": [
      "『高性能环形激光』",
      "增幅设备",
      "巨大透镜"
    ],
    "name": "【质子撞击炮】",
    "kind": "WG",
    "rawResult": "'【质子撞击炮】','WG',450,300,'ud'"
  },
  {
    "id": "recipe_095",
    "group": "wg",
    "ingredients": [
      "『高性能黑洞激光』",
      "增幅设备",
      "巨大透镜"
    ],
    "name": "【重力冲击炮】",
    "kind": "WG",
    "rawResult": "'【重力冲击炮】','WG',450,300,'Nd'"
  },
  {
    "id": "recipe_096",
    "group": "wg",
    "ingredients": [
      "『高性能双重激光』",
      "增幅设备",
      "巨大透镜"
    ],
    "name": "【最终鬼畜兵器】",
    "kind": "WG",
    "rawResult": "'【最终鬼畜兵器】','WG',640,300,'uNd'"
  },
  {
    "id": "recipe_097",
    "group": "wg",
    "ingredients": [
      "【最终鬼畜兵器】",
      "『奥丁巨核装备』",
      "非法枪械部件"
    ],
    "name": "【霜火协奏曲】",
    "kind": "WG",
    "rawResult": "'【霜火协奏曲】','WG',1024,256,'rNuwde'"
  },
  {
    "id": "recipe_098",
    "group": "hidden",
    "ingredients": [
      "诚实与魔法",
      "忠诚与慷慨",
      "善良与欢笑"
    ],
    "name": "我剥光了小马才做出来的【彩虹光束炮】",
    "kind": "WG",
    "rawResult": "'我剥光了小马才做出来的【彩虹光束炮】','WG',777,777,'uiwepd'"
  },
  {
    "id": "recipe_099",
    "group": "wd",
    "ingredients": [
      "轻油",
      "肥料"
    ],
    "name": "火药",
    "kind": "X",
    "rawResult": "'火药','X',1,1,"
  },
  {
    "id": "recipe_100",
    "group": "wd",
    "ingredients": [
      "信管",
      "火药"
    ],
    "name": "★炸药★",
    "kind": "WD",
    "rawResult": "'★炸药★','WD',160,60,'d'"
  },
  {
    "id": "recipe_101",
    "group": "wd",
    "ingredients": [
      "导火线",
      "火药"
    ],
    "name": "★炸药★",
    "kind": "WD",
    "rawResult": "'★炸药★','WD',160,60,'d'"
  },
  {
    "id": "recipe_102",
    "group": "wd",
    "ingredients": [
      "水",
      "地雷"
    ],
    "name": "水鸳鸯",
    "kind": "WD",
    "rawResult": "'水鸳鸯','WD',50,36,'d'"
  },
  {
    "id": "recipe_103",
    "group": "wd",
    "ingredients": [
      "★炸药★",
      "水鸳鸯"
    ],
    "name": "★C4★",
    "kind": "WD",
    "rawResult": "'★C4★','WD',250,20,'d'"
  },
  {
    "id": "recipe_104",
    "group": "wd",
    "ingredients": [
      "探测器电池",
      "打火机"
    ],
    "name": "☆自爆电池☆",
    "kind": "WD",
    "rawResult": "'☆自爆电池☆','WD',140,32,'d'"
  },
  {
    "id": "recipe_105",
    "group": "wd",
    "ingredients": [
      "☆自爆电池☆",
      "电磁IED",
      "脉冲防线"
    ],
    "name": "脉冲蓄电池",
    "kind": "WD",
    "rawResult": "'脉冲蓄电池','WD',140,60,'ed'"
  },
  {
    "id": "recipe_106",
    "group": "wd",
    "ingredients": [
      "☆自爆电池☆",
      "辐射IED",
      "★阔剑地雷★"
    ],
    "name": "镭射蓄电池",
    "kind": "WD",
    "rawResult": "'镭射蓄电池','WD',150,96,'yed'"
  },
  {
    "id": "recipe_107",
    "group": "wd",
    "ingredients": [
      "伏特加",
      "一杯八分满的啤酒"
    ],
    "name": "深水炸弹『depth charge』",
    "kind": "WD",
    "rawResult": "'深水炸弹『depth charge』','WD',133,45,'d'"
  },
  {
    "id": "recipe_108",
    "group": "wd",
    "ingredients": [
      "深水炸弹『depth charge』",
      "火药"
    ],
    "name": "莫洛托夫鸡尾酒",
    "kind": "WD",
    "rawResult": "'莫洛托夫鸡尾酒','WD',150,40,'ud'"
  },
  {
    "id": "recipe_109",
    "group": "wd",
    "ingredients": [
      "咖啡酒",
      "百利甜",
      "伏特加"
    ],
    "name": "奇怪的三色饮料",
    "kind": "HB",
    "rawResult": "'奇怪的三色饮料','HB',133,2"
  },
  {
    "id": "recipe_110",
    "group": "wd",
    "ingredients": [
      "奇怪的三色饮料",
      "打火机",
      "杯子"
    ],
    "name": "B-52轰炸机",
    "kind": "WD",
    "rawResult": "'B-52轰炸机','WD',160,35,'ud'"
  },
  {
    "id": "recipe_111",
    "group": "wd",
    "ingredients": [
      "密封的酒瓶",
      "★阔剑地雷★",
      "莫洛托夫鸡尾酒"
    ],
    "name": "烈焰风暴",
    "kind": "WD",
    "rawResult": "'烈焰风暴','WD',92,300,'urdZ'"
  },
  {
    "id": "recipe_112",
    "group": "wd",
    "ingredients": [
      "密封的酒瓶",
      "★阔剑地雷★",
      "B-52轰炸机"
    ],
    "name": "烈焰风暴",
    "kind": "WD",
    "rawResult": "'烈焰风暴','WD',92,250,'urdZ'"
  },
  {
    "id": "recipe_113",
    "group": "wd",
    "ingredients": [
      "伏特加",
      "柠檬汁",
      "红石榴汁"
    ],
    "name": "【烈焰红唇】",
    "kind": "HB",
    "rawResult": "'【烈焰红唇】','HB',233,2"
  },
  {
    "id": "recipe_114",
    "group": "wd",
    "ingredients": [
      "【烈焰红唇】",
      "密封的酒瓶"
    ],
    "name": "★血腥玛丽★Bloody Mary",
    "kind": "WD",
    "rawResult": "'★血腥玛丽★Bloody Mary','WD',310,150,'dw'"
  },
  {
    "id": "recipe_115",
    "group": "wd",
    "ingredients": [
      "伏特加",
      "牛肉汤",
      "バカ⑨制冰块"
    ],
    "name": "【燃烧的鸡尾酒】",
    "kind": "HB",
    "rawResult": "'【燃烧的鸡尾酒】','HB',233,2"
  },
  {
    "id": "recipe_116",
    "group": "wd",
    "ingredients": [
      "【燃烧的鸡尾酒】",
      "密封的酒瓶"
    ],
    "name": "★公牛子弹★Bull Shot",
    "kind": "WD",
    "rawResult": "'★公牛子弹★Bull Shot','WD',210,300,'dr'"
  },
  {
    "id": "recipe_117",
    "group": "wd",
    "ingredients": [
      "★血腥玛丽★Bloody Mary",
      "★公牛子弹★Bull Shot",
      "密封的酒瓶"
    ],
    "name": "★血腥公牛★Bloody Bull",
    "kind": "WD",
    "rawResult": "'★血腥公牛★Bloody Bull','WD',520,450,'dwry'"
  },
  {
    "id": "recipe_118",
    "group": "wd",
    "ingredients": [
      "焦臭的哑弹",
      "微温的哑弹",
      "开孔的哑弹",
      "泥泞的哑弹"
    ],
    "name": "☆主体思想的光芒☆",
    "kind": "WD",
    "rawResult": "'☆主体思想的光芒☆','WD',166,66,'dN'"
  },
  {
    "id": "recipe_119",
    "group": "wd",
    "ingredients": [
      "变形的哑弹",
      "裂缝的哑弹",
      "潮湿的哑弹",
      "原型武器D"
    ],
    "name": "☆天降伟人的指示☆",
    "kind": "WD",
    "rawResult": "'☆天降伟人的指示☆','WD',166,66,'dc'"
  },
  {
    "id": "recipe_120",
    "group": "wd",
    "ingredients": [
      "☆主体思想的光芒☆",
      "☆天降伟人的指示☆"
    ],
    "name": "★核弹袭击★",
    "kind": "WD",
    "rawResult": "'★核弹袭击★','WD',2333,3,'dry'"
  },
  {
    "id": "recipe_121",
    "group": "wd",
    "ingredients": [
      "☆自爆电池☆",
      "★时停怀表★"
    ],
    "name": "寒冰炸弹",
    "kind": "WD",
    "rawResult": "'寒冰炸弹','WD',260,45,'i'"
  },
  {
    "id": "recipe_122",
    "group": "wd",
    "ingredients": [
      "『祝福宝石』",
      "★瓶装幽灵★",
      "某种电子零件"
    ],
    "name": "★幽灵冲击★",
    "kind": "WD",
    "rawResult": "'★幽灵冲击★','WD',320,200,'Nn'"
  },
  {
    "id": "recipe_123",
    "group": "wd",
    "ingredients": [
      "★幽灵冲击★",
      "《魔女的魔导书》",
      "笔记本电脑"
    ],
    "name": "奥术飞弹",
    "kind": "WD",
    "rawResult": "'奥术飞弹','WD',400,300,'Nnr'"
  },
  {
    "id": "recipe_124",
    "group": "wd",
    "ingredients": [
      "寒冰炸弹",
      "奥术飞弹",
      "烈焰风暴"
    ],
    "name": "★BIUBIUBIU★",
    "kind": "WD",
    "rawResult": "'★BIUBIUBIU★','WD',600,400,'ZnyNdr'"
  },
  {
    "id": "recipe_125",
    "group": "d",
    "ingredients": [
      "数据……碎片",
      "电子马克笔",
      "天然属性也是很可怕的！"
    ],
    "name": "黑色夺魂曲",
    "kind": "DB",
    "rawResult": "'黑色夺魂曲','DB',57,77,'ZBb'"
  },
  {
    "id": "recipe_126",
    "group": "d",
    "ingredients": [
      "『午夜钟声』",
      "『午夜钟声』",
      "『午夜钟声』"
    ],
    "name": "电子马克笔",
    "kind": "DA",
    "rawResult": "'电子马克笔','DA',53,75,'Z'"
  },
  {
    "id": "recipe_127",
    "group": "d",
    "ingredients": [
      "探测器电池",
      "实验装甲A"
    ],
    "name": "电磁充能手套",
    "kind": "DA",
    "rawResult": "'电磁充能手套','DA',45,15,'E'"
  },
  {
    "id": "recipe_128",
    "group": "item",
    "ingredients": [
      "生命探测器",
      "增幅设备"
    ],
    "name": "广域生命探测器",
    "kind": "ER",
    "rawResult": "'广域生命探测器','ER',1,1,2"
  },
  {
    "id": "recipe_129",
    "group": "item",
    "ingredients": [
      "安雅人体冰雕",
      "火把"
    ],
    "name": "武器师安雅的奖赏",
    "kind": "Y",
    "rawResult": "'武器师安雅的奖赏','Y',1,1,"
  },
  {
    "id": "recipe_130",
    "group": "item",
    "ingredients": [
      "安雅人体冰雕",
      "解冻药水"
    ],
    "name": "武器师安雅的奖赏",
    "kind": "Y",
    "rawResult": "'武器师安雅的奖赏','Y',1,1,"
  },
  {
    "id": "recipe_131",
    "group": "item",
    "ingredients": [
      "手机",
      "笔记本电脑"
    ],
    "name": "移动PC",
    "kind": "EE",
    "rawResult": "'移动PC','EE',1,1,"
  },
  {
    "id": "recipe_132",
    "group": "item",
    "ingredients": [
      "原型武器G",
      "原型武器C"
    ],
    "name": "电磁发射装置",
    "kind": "X",
    "rawResult": "'电磁发射装置','X',1,1,''"
  },
  {
    "id": "recipe_133",
    "group": "item",
    "ingredients": [
      "社员专用的ID卡",
      "社员专用的ID卡",
      "社员专用的ID卡"
    ],
    "name": "游戏解除钥匙",
    "kind": "Y",
    "rawResult": "'游戏解除钥匙','Y',1,1,"
  },
  {
    "id": "recipe_134",
    "group": "item",
    "ingredients": [
      "★荆棘式电子地雷★",
      "★阔剑地雷★",
      "★全图不唯一的野生巨大香蕉★"
    ],
    "name": "★一发逆转神话★",
    "kind": "TNc",
    "rawResult": "'★一发逆转神话★','TNc',1,1,'x'"
  },
  {
    "id": "recipe_135",
    "group": "item",
    "ingredients": [
      "水",
      "黑色雏菊",
      "白色方块"
    ],
    "name": "风祭河水",
    "kind": "Y",
    "rawResult": "'风祭河水','Y',1,1,'x'"
  },
  {
    "id": "recipe_136",
    "group": "item",
    "ingredients": [
      "水",
      "黑色方块",
      "白色雏菊"
    ],
    "name": "仪水镜",
    "kind": "Y",
    "rawResult": "'仪水镜','Y',1,1,'x'"
  },
  {
    "id": "recipe_137",
    "group": "item",
    "ingredients": [
      "风祭河水",
      "仪水镜",
      "白色雏菊",
      "黑色雏菊"
    ],
    "name": "八咫镜",
    "kind": "DH",
    "rawResult": "'八咫镜','DH',1,1,'bx'"
  },
  {
    "id": "recipe_138",
    "group": "item",
    "ingredients": [
      "《チト的日记》",
      "鱼罐头",
      "【雨だれの歌】"
    ],
    "name": "【More One Night】",
    "kind": "ss",
    "rawResult": "'【More One Night】','ss',200,1,'h'"
  },
  {
    "id": "recipe_139",
    "group": "pokemon",
    "ingredients": [
      "《小黄的草帽》",
      "《小黄的钓鱼竿》",
      "《小黄的行军靴》"
    ],
    "name": "《小黄的精灵球》",
    "kind": "WC",
    "rawResult": "'《小黄的精灵球》','WC',233,'∞','ce',"
  },
  {
    "id": "recipe_140",
    "group": "pokemon",
    "ingredients": [
      "《小黄的精灵球》",
      "《小黄的收服特训》"
    ],
    "name": "《小黄的超级球》",
    "kind": "WC",
    "rawResult": "'《小黄的超级球》','WC',233,'∞','Zrce'"
  },
  {
    "id": "recipe_141",
    "group": "pokemon",
    "ingredients": [
      "《小黄的精灵球》",
      "《小黄的收服特训》",
      "露琪亚之羽"
    ],
    "name": "《小黄的超级球》",
    "kind": "WC",
    "rawResult": "'《小黄的超级球》','WC',233,'∞','Zrice'"
  },
  {
    "id": "recipe_142",
    "group": "pokemon",
    "ingredients": [
      "《小黄的精灵球》",
      "《小黄的收服特训》",
      "凤凰之羽"
    ],
    "name": "《小黄的超级球》",
    "kind": "WC",
    "rawResult": "'《小黄的超级球》','WC',233,'∞','Zruce'"
  },
  {
    "id": "recipe_143",
    "group": "pokemon",
    "ingredients": [
      "《小黄的精灵球》",
      "《小黄的收服特训》",
      "露琪亚之羽",
      "凤凰之羽"
    ],
    "name": "《小黄的超级球》",
    "kind": "WC",
    "rawResult": "'《小黄的超级球》','WC',233,'∞','Zriuce'"
  },
  {
    "id": "recipe_144",
    "group": "pokemon",
    "ingredients": [
      "《小黄的超级球》",
      "《小黄的常磐之力》",
      "《小黄的收服特训》"
    ],
    "name": "《小黄的大师球》",
    "kind": "WC",
    "rawResult": "'《小黄的大师球》','WC',386,'∞','ZcrdNe'"
  },
  {
    "id": "recipe_145",
    "group": "pokemon",
    "ingredients": [
      "《小黄的超级球》",
      "《小黄的常磐之力》",
      "露琪亚之羽",
      "凤凰之羽"
    ],
    "name": "《小黄的大师球》",
    "kind": "WC",
    "rawResult": "'《小黄的大师球》','WC',493,'∞','ZcrdNeiu'"
  },
  {
    "id": "recipe_146",
    "group": "pokemon",
    "ingredients": [
      "《小黄的精灵球》",
      "治愈之叶"
    ],
    "name": "小黄的『十万伏特』",
    "kind": "WC",
    "rawResult": "'小黄的『十万伏特』','WC',251,'∞','cewH'"
  },
  {
    "id": "recipe_147",
    "group": "pokemon",
    "ingredients": [
      "小黄的『十万伏特』",
      "红色方块",
      "绿色方块",
      "蓝色方块"
    ],
    "name": "小黄的『百万伏特』",
    "kind": "WC",
    "rawResult": "'小黄的『百万伏特』','WC',493,'∞','cewrnj'"
  },
  {
    "id": "recipe_148",
    "group": "pokemon",
    "ingredients": [
      "小黄的『百万伏特』",
      "金色方块",
      "银色方块",
      "水晶方块"
    ],
    "name": "小黄的『伏特攻击』",
    "kind": "WC",
    "rawResult": "'小黄的『伏特攻击』','WC',649,'∞','cedrnZ'"
  },
  {
    "id": "recipe_149",
    "group": "pokemon",
    "ingredients": [
      "小黄的『伏特攻击』",
      "《小黄的常磐之力》",
      "《小黄的收服特训》",
      "黄色方块"
    ],
    "name": "小黄的『皮卡必杀击』",
    "kind": "WC",
    "rawResult": "'小黄的『皮卡必杀击』','WC',721,'∞','cetdHrnZ'"
  },
  {
    "id": "recipe_150",
    "group": "key",
    "ingredients": [
      "月宫 亚由的半身像",
      "神尾 观铃的半身像",
      "古河 渚的半身像"
    ],
    "name": "四季流转的咏叹调",
    "kind": "WP",
    "rawResult": "'四季流转的咏叹调','WP',750,1,'N'"
  },
  {
    "id": "recipe_151",
    "group": "key",
    "ingredients": [
      "天泽 郁末的半身像",
      "长森 瑞佳的半身像",
      "枣 铃的半身像"
    ],
    "name": "旁观轮回的覆唱诗",
    "kind": "WK",
    "rawResult": "'旁观轮回的覆唱诗','WK',750,1,'n'"
  },
  {
    "id": "recipe_152",
    "group": "key",
    "ingredients": [
      "神北 小毬的半身像",
      "一之濑 琴美的半身像",
      "SSS团长的半身像"
    ],
    "name": "天然属性也是很可怕的！",
    "kind": "WD",
    "rawResult": "'天然属性也是很可怕的！','WD',160,46,'zd'"
  },
  {
    "id": "recipe_153",
    "group": "key",
    "ingredients": [
      "四季流转的咏叹调",
      "旁观轮回的覆唱诗"
    ],
    "name": "【KEY系催泪弹】",
    "kind": "WD",
    "rawResult": "'【KEY系催泪弹】','WD',3600,5,'zd'"
  },
  {
    "id": "recipe_154",
    "group": "key",
    "ingredients": [
      "手机",
      "二重战斗匕首",
      "《ACFUN大逃杀攻略》",
      "『寻星勇者』"
    ],
    "name": "【KEY系未来弹】",
    "kind": "WP",
    "rawResult": "'【KEY系未来弹】','WP',860,5,'zdy'"
  },
  {
    "id": "recipe_155",
    "group": "key",
    "ingredients": [
      "提示纸条K",
      "提示纸条E",
      "提示纸条Y",
      "提示纸条D"
    ],
    "name": "【KEY系生命弹】",
    "kind": "WG",
    "rawResult": "'【KEY系生命弹】','WG',860,5,'zdry'"
  },
  {
    "id": "recipe_156",
    "group": "key",
    "ingredients": [
      "水",
      "黑色雏菊",
      "白色雏菊",
      "治愈之叶"
    ],
    "name": "生命之源",
    "kind": "Z",
    "rawResult": "'生命之源','Z',1200,1,'z'"
  },
  {
    "id": "recipe_157",
    "group": "key",
    "ingredients": [
      "生命之源",
      "黑色方块",
      "白色雏菊"
    ],
    "name": "红色的丝带",
    "kind": "DB",
    "rawResult": "'红色的丝带','DB',1200,1,'Aa'"
  },
  {
    "id": "recipe_158",
    "group": "key",
    "ingredients": [
      "生命之源",
      "黑色雏菊",
      "白色方块"
    ],
    "name": "红色的丝带",
    "kind": "DA",
    "rawResult": "'红色的丝带','DA',1200,1,'Aa'"
  },
  {
    "id": "recipe_159",
    "group": "key",
    "ingredients": [
      "生命之源",
      "黑色方块",
      "白色方块"
    ],
    "name": "红色的丝带",
    "kind": "WP",
    "rawResult": "'红色的丝带','WP',1200,1,'u'"
  },
  {
    "id": "recipe_160",
    "group": "key",
    "ingredients": [
      "生命之源",
      "黑色雏菊",
      "白色雏菊"
    ],
    "name": "红色的丝带",
    "kind": "WK",
    "rawResult": "'红色的丝带','WK',1200,1,'N'"
  },
  {
    "id": "recipe_161",
    "group": "key",
    "ingredients": [
      "红色的丝带",
      "红色的丝带",
      "生命之源"
    ],
    "name": "【KEY系燃烧弹】",
    "kind": "WF",
    "rawResult": "'【KEY系燃烧弹】','WF',4800,2,'Nuzy'"
  },
  {
    "id": "recipe_162",
    "group": "key",
    "ingredients": [
      "生命之源",
      "对魔物用卵石"
    ],
    "name": "舍身成就之羁绊",
    "kind": "WCF",
    "rawResult": "'舍身成就之羁绊','WCF',233,20,'Z'"
  },
  {
    "id": "recipe_163",
    "group": "key",
    "ingredients": [
      "生命之源",
      "二重战斗匕首"
    ],
    "name": "微小日常之爱恋",
    "kind": "WKG",
    "rawResult": "'微小日常之爱恋','WKG',233,20,'Z'"
  },
  {
    "id": "recipe_164",
    "group": "key",
    "ingredients": [
      "生命之源",
      "巨大路灯柱"
    ],
    "name": "无尽散花之涅磐",
    "kind": "WKP",
    "rawResult": "'无尽散花之涅磐','WKP',233,20,'Z'"
  },
  {
    "id": "recipe_165",
    "group": "key",
    "ingredients": [
      "生命之源",
      "黑魔法-权利"
    ],
    "name": "无法推卸的命运",
    "kind": "WDG",
    "rawResult": "'无法推卸的命运','WDG',233,20,'Z'"
  },
  {
    "id": "recipe_166",
    "group": "key",
    "ingredients": [
      "生命之源",
      "『9mm鲁格枪』"
    ],
    "name": "破灭未来的残光",
    "kind": "WKF",
    "rawResult": "'破灭未来的残光','WKF',233,20,'Z'"
  },
  {
    "id": "recipe_167",
    "group": "key",
    "ingredients": [
      "生命之源",
      "红色的丝带"
    ],
    "name": "来自未来的奇迹",
    "kind": "WCP",
    "rawResult": "'来自未来的奇迹','WCP',233,20,'Z'"
  },
  {
    "id": "recipe_168",
    "group": "key",
    "ingredients": [
      "生命之源",
      "微小日常之爱恋"
    ],
    "name": "该物品不存在！",
    "kind": "ss",
    "rawResult": "'该物品不存在！','ss',98,98,'Z'"
  },
  {
    "id": "recipe_169",
    "group": "key",
    "ingredients": [
      "红色的丝带",
      "红色的丝带",
      "红色的丝带",
      "红色的丝带",
      "红色的丝带"
    ],
    "name": "篝酱的奇迹☆丝带～刃",
    "kind": "WK",
    "rawResult": "'篝酱的奇迹☆丝带～刃','WK',4200,100,'cjN'"
  },
  {
    "id": "recipe_170",
    "group": "cube",
    "ingredients": [
      "绿色方块",
      "银色方块"
    ],
    "name": "炙热的绶带",
    "kind": "DH",
    "rawResult": "'炙热的绶带','DH',180,80,"
  },
  {
    "id": "recipe_171",
    "group": "cube",
    "ingredients": [
      "红色方块",
      "黄色方块"
    ],
    "name": "坚强戒指",
    "kind": "DA",
    "rawResult": "'坚强戒指','DA',180,80,"
  },
  {
    "id": "recipe_172",
    "group": "cube",
    "ingredients": [
      "金色方块",
      "水晶方块"
    ],
    "name": "活力之靴",
    "kind": "DF",
    "rawResult": "'活力之靴','DF',180,80,"
  },
  {
    "id": "recipe_173",
    "group": "cube",
    "ingredients": [
      "红色方块",
      "银色方块"
    ],
    "name": "红宝石方块",
    "kind": "X",
    "rawResult": "'红宝石方块','X',1,1,"
  },
  {
    "id": "recipe_174",
    "group": "cube",
    "ingredients": [
      "金色方块",
      "绿色方块"
    ],
    "name": "蓝宝石方块",
    "kind": "X",
    "rawResult": "'蓝宝石方块','X',1,1,"
  },
  {
    "id": "recipe_175",
    "group": "cube",
    "ingredients": [
      "蓝色方块",
      "黄色方块"
    ],
    "name": "绿宝石方块",
    "kind": "X",
    "rawResult": "'绿宝石方块','X',1,1,"
  },
  {
    "id": "recipe_176",
    "group": "cube",
    "ingredients": [
      "金色方块",
      "白色方块"
    ],
    "name": "心金方块",
    "kind": "X",
    "rawResult": "'心金方块','X',1,1,"
  },
  {
    "id": "recipe_177",
    "group": "cube",
    "ingredients": [
      "银色方块",
      "黑色方块"
    ],
    "name": "魂银方块",
    "kind": "X",
    "rawResult": "'魂银方块','X',1,1,"
  },
  {
    "id": "recipe_178",
    "group": "cube",
    "ingredients": [
      "黄色方块",
      "水晶方块"
    ],
    "name": "翡翠方块",
    "kind": "X",
    "rawResult": "'翡翠方块','X',1,1,"
  },
  {
    "id": "recipe_179",
    "group": "cube",
    "ingredients": [
      "红宝石方块",
      "蓝宝石方块"
    ],
    "name": "绿宝石方块",
    "kind": "X",
    "rawResult": "'绿宝石方块','X',1,2,"
  },
  {
    "id": "recipe_180",
    "group": "cube",
    "ingredients": [
      "绿宝石方块",
      "黄色方块"
    ],
    "name": "黄色的宝石枪",
    "kind": "WG",
    "rawResult": "'黄色的宝石枪','WG',240,180,'e'"
  },
  {
    "id": "recipe_181",
    "group": "cube",
    "ingredients": [
      "绿宝石方块",
      "红色方块"
    ],
    "name": "红色的宝石刀",
    "kind": "WK",
    "rawResult": "'红色的宝石刀','WK',240,180,'u'"
  },
  {
    "id": "recipe_182",
    "group": "cube",
    "ingredients": [
      "绿宝石方块",
      "蓝色方块"
    ],
    "name": "蓝色的宝石锤",
    "kind": "WP",
    "rawResult": "'蓝色的宝石锤','WP',240,180,'i'"
  },
  {
    "id": "recipe_183",
    "group": "cube",
    "ingredients": [
      "绿宝石方块",
      "绿色方块"
    ],
    "name": "绿色的宝石镖",
    "kind": "WC",
    "rawResult": "'绿色的宝石镖','WC',240,180,'p'"
  },
  {
    "id": "recipe_184",
    "group": "cube",
    "ingredients": [
      "绿宝石方块",
      "金色方块"
    ],
    "name": "金色的宝石炸弹",
    "kind": "WD",
    "rawResult": "'金色的宝石炸弹','WD',240,180,'d'"
  },
  {
    "id": "recipe_185",
    "group": "cube",
    "ingredients": [
      "绿宝石方块",
      "银色方块"
    ],
    "name": "银色的宝石符卡",
    "kind": "WF",
    "rawResult": "'银色的宝石符卡','WF',240,180,'w'"
  },
  {
    "id": "recipe_186",
    "group": "cube",
    "ingredients": [
      "绿宝石方块",
      "心金方块"
    ],
    "name": "心金色的宝石弓",
    "kind": "WB",
    "rawResult": "'心金色的宝石弓','WB',240,'∞','c'"
  },
  {
    "id": "recipe_187",
    "group": "cube",
    "ingredients": [
      "绿宝石方块",
      "魂银方块"
    ],
    "name": "魂银色的宝石重炮",
    "kind": "WJ",
    "rawResult": "'魂银色的宝石重炮','WJ',240,'∞','c'"
  },
  {
    "id": "recipe_188",
    "group": "hidden",
    "ingredients": [
      "绿宝石方块",
      "黄鸡方块"
    ],
    "name": "黄鸡的宝石大炮",
    "kind": "WJ",
    "rawResult": "'黄鸡的宝石大炮','WJ',1,1,'uiwepo'"
  },
  {
    "id": "recipe_189",
    "group": "cube",
    "ingredients": [
      "红色的宝石刀",
      "悲叹之种"
    ],
    "name": "★恐惧的黑色安息日★",
    "kind": "WK",
    "rawResult": "'★恐惧的黑色安息日★','WK',240,320,'rudy'"
  },
  {
    "id": "recipe_190",
    "group": "cube",
    "ingredients": [
      "银色的宝石符卡",
      "悲叹之种"
    ],
    "name": "★失落的银色镇魂歌★",
    "kind": "WF",
    "rawResult": "'★失落的银色镇魂歌★','WF',240,320,'rwdy'"
  },
  {
    "id": "recipe_191",
    "group": "cube",
    "ingredients": [
      "绿宝石方块",
      "水晶方块"
    ],
    "name": "水晶宝石盾",
    "kind": "DA",
    "rawResult": "'水晶宝石盾','DA',240,180,'PC'"
  },
  {
    "id": "recipe_192",
    "group": "cube",
    "ingredients": [
      "绿宝石方块",
      "红宝石方块"
    ],
    "name": "珍珠头盔",
    "kind": "DH",
    "rawResult": "'珍珠头盔','DH',360,180,'KDa'"
  },
  {
    "id": "recipe_193",
    "group": "cube",
    "ingredients": [
      "绿宝石方块",
      "蓝宝石方块"
    ],
    "name": "钻石靴子",
    "kind": "DF",
    "rawResult": "'钻石靴子','DF',360,180,'GFa'"
  },
  {
    "id": "recipe_194",
    "group": "cube",
    "ingredients": [
      "绿宝石方块",
      "翡翠方块"
    ],
    "name": "翡翠色的假宝石",
    "kind": "A",
    "rawResult": "'翡翠色的假宝石','A',240,180,'mL'"
  },
  {
    "id": "recipe_195",
    "group": "cube",
    "ingredients": [
      "红宝石方块",
      "红色方块"
    ],
    "name": "深红色的项链",
    "kind": "A",
    "rawResult": "'深红色的项链','A',240,180,'aM'"
  },
  {
    "id": "recipe_196",
    "group": "cube",
    "ingredients": [
      "蓝宝石方块",
      "蓝色方块"
    ],
    "name": "蔚蓝色的项链",
    "kind": "A",
    "rawResult": "'蔚蓝色的项链','A',240,180,'Hc'"
  },
  {
    "id": "recipe_197",
    "group": "cube",
    "ingredients": [
      "红宝石方块",
      "黑色方块"
    ],
    "name": "终极红宝石之秘药",
    "kind": "HB",
    "rawResult": "'终极红宝石之秘药','HB',386,76,'z'"
  },
  {
    "id": "recipe_198",
    "group": "cube",
    "ingredients": [
      "蓝宝石方块",
      "白色方块"
    ],
    "name": "始源蓝宝石之秘药",
    "kind": "MV",
    "rawResult": "'始源蓝宝石之秘药','MV',76,2,'z'"
  },
  {
    "id": "recipe_199",
    "group": "cube",
    "ingredients": [
      "黄色方块",
      "黄色方块",
      "黄色方块"
    ],
    "name": "★高压电击★",
    "kind": "WD",
    "rawResult": "'★高压电击★','WD',152,251,'red'"
  },
  {
    "id": "recipe_200",
    "group": "cube",
    "ingredients": [
      "红色方块",
      "红色方块",
      "红色方块"
    ],
    "name": "★烈焰冲撞★",
    "kind": "WP",
    "rawResult": "'★烈焰冲撞★','WP',152,76,'ru'"
  },
  {
    "id": "recipe_201",
    "group": "cube",
    "ingredients": [
      "绿色方块",
      "绿色方块",
      "绿色方块"
    ],
    "name": "★飞叶快刀★",
    "kind": "WK",
    "rawResult": "'★飞叶快刀★','WK',152,76,'Zrp'"
  },
  {
    "id": "recipe_202",
    "group": "cube",
    "ingredients": [
      "蓝色方块",
      "蓝色方块",
      "蓝色方块"
    ],
    "name": "★急冻光线★",
    "kind": "WG",
    "rawResult": "'★急冻光线★','WG',152,251,'ric'"
  },
  {
    "id": "recipe_203",
    "group": "cube",
    "ingredients": [
      "金色方块",
      "金色方块",
      "金色方块"
    ],
    "name": "★齿轮飞碟★",
    "kind": "WC",
    "rawResult": "'★齿轮飞碟★','WC',152,386,'rd'"
  },
  {
    "id": "recipe_204",
    "group": "cube",
    "ingredients": [
      "银色方块",
      "银色方块",
      "银色方块"
    ],
    "name": "★精神破坏★",
    "kind": "WF",
    "rawResult": "'★精神破坏★','WF',152,251,'rw'"
  },
  {
    "id": "recipe_205",
    "group": "cube",
    "ingredients": [
      "水晶方块",
      "水晶方块",
      "水晶方块"
    ],
    "name": "★灭亡之歌★",
    "kind": "TN",
    "rawResult": "'★灭亡之歌★','TN',960,2,"
  },
  {
    "id": "recipe_206",
    "group": "cube",
    "ingredients": [
      "白色方块",
      "白色方块",
      "白色方块"
    ],
    "name": "★交织火焰★",
    "kind": "WJ",
    "rawResult": "'★交织火焰★','WJ',76,1,'ui'"
  },
  {
    "id": "recipe_207",
    "group": "cube",
    "ingredients": [
      "黑色方块",
      "黑色方块",
      "黑色方块"
    ],
    "name": "★交织闪电★",
    "kind": "WJ",
    "rawResult": "'★交织闪电★','WJ',76,1,'ew'"
  },
  {
    "id": "recipe_208",
    "group": "hidden",
    "ingredients": [
      "黄鸡方块",
      "黄鸡方块",
      "黄鸡方块"
    ],
    "name": "★黄鸡风暴★",
    "kind": "WK",
    "rawResult": "'★黄鸡风暴★','WK',90,35,'rpd'"
  },
  {
    "id": "recipe_209",
    "group": "cube",
    "ingredients": [
      "X方块",
      "Y方块"
    ],
    "name": "MEGA宝石方块",
    "kind": "X",
    "rawResult": "'MEGA宝石方块','X',1,1,''"
  },
  {
    "id": "recipe_210",
    "group": "cube",
    "ingredients": [
      "MEGA宝石方块",
      "红色方块"
    ],
    "name": "火精灵之焰",
    "kind": "WG",
    "rawResult": "'火精灵之焰','WG',386,'∞','u'"
  },
  {
    "id": "recipe_211",
    "group": "cube",
    "ingredients": [
      "MEGA宝石方块",
      "绿色方块"
    ],
    "name": "叶精灵之刃",
    "kind": "WK",
    "rawResult": "'叶精灵之刃','WK',386,'∞','p'"
  },
  {
    "id": "recipe_212",
    "group": "cube",
    "ingredients": [
      "MEGA宝石方块",
      "蓝色方块"
    ],
    "name": "水精灵之波",
    "kind": "WC",
    "rawResult": "'水精灵之波','WC',386,'∞','i'"
  },
  {
    "id": "recipe_213",
    "group": "cube",
    "ingredients": [
      "MEGA宝石方块",
      "黄色方块"
    ],
    "name": "雷精灵之闪",
    "kind": "WP",
    "rawResult": "'雷精灵之闪','WP',386,'∞','e'"
  },
  {
    "id": "recipe_214",
    "group": "cube",
    "ingredients": [
      "MEGA宝石方块",
      "水晶方块"
    ],
    "name": "冰精灵之镜",
    "kind": "DB",
    "rawResult": "'冰精灵之镜','DB',386,493,'AI'"
  },
  {
    "id": "recipe_215",
    "group": "cube",
    "ingredients": [
      "MEGA宝石方块",
      "白色方块"
    ],
    "name": "太阳精灵之光",
    "kind": "WD",
    "rawResult": "'太阳精灵之光','WD',386,'∞','d'"
  },
  {
    "id": "recipe_216",
    "group": "cube",
    "ingredients": [
      "MEGA宝石方块",
      "黑色方块"
    ],
    "name": "月亮精灵之影",
    "kind": "WF",
    "rawResult": "'月亮精灵之影','WF',386,'∞','w'"
  },
  {
    "id": "recipe_217",
    "group": "cube",
    "ingredients": [
      "MEGA宝石方块",
      "MEGA宝石方块"
    ],
    "name": "仙子精灵之吻",
    "kind": "WJ",
    "rawResult": "'仙子精灵之吻','WJ',251,'∞','n'"
  },
  {
    "id": "recipe_218",
    "group": "wf",
    "ingredients": [
      "空白符卡",
      "☆博丽护符☆"
    ],
    "name": "霊符「夢想妙珠」",
    "kind": "WF",
    "rawResult": "'霊符「夢想妙珠」','WF',40,'∞','r'"
  },
  {
    "id": "recipe_219",
    "group": "wf",
    "ingredients": [
      "空白符卡",
      "红色方块",
      "白色方块"
    ],
    "name": "阴阳玉",
    "kind": "WFC",
    "rawResult": "'阴阳玉','WFC',90,'∞','d'"
  },
  {
    "id": "recipe_220",
    "group": "wf",
    "ingredients": [
      "霊符「夢想妙珠」",
      "阴阳玉"
    ],
    "name": "宝符「陰陽宝玉」",
    "kind": "WFC",
    "rawResult": "'宝符「陰陽宝玉」','WFC',150,'∞','cd'"
  },
  {
    "id": "recipe_221",
    "group": "wf",
    "ingredients": [
      "宝符「陰陽宝玉」",
      "『祝福宝石』"
    ],
    "name": "霊符「夢想封印」",
    "kind": "WF",
    "rawResult": "'霊符「夢想封印」','WF',150,'∞','cnd'"
  },
  {
    "id": "recipe_222",
    "group": "wf",
    "ingredients": [
      "霊符「夢想封印」",
      "《东方灵异传》"
    ],
    "name": "神技「八方鬼縛陣」",
    "kind": "WFD",
    "rawResult": "'神技「八方鬼縛陣」','WFD',240,'∞','crd'"
  },
  {
    "id": "recipe_223",
    "group": "wf",
    "ingredients": [
      "霊符「夢想封印」",
      "《东方灵异传》",
      "☆★☆大打击☆★☆"
    ],
    "name": "神技「八方龍殺陣」",
    "kind": "WFD",
    "rawResult": "'神技「八方龍殺陣」','WFD',320,'∞','crd'"
  },
  {
    "id": "recipe_224",
    "group": "wf",
    "ingredients": [
      "神技「八方鬼縛陣」",
      "原型武器F",
      "原型武器D",
      "CAVE社特典CD『胎慟』"
    ],
    "name": "神霊「夢想封印 瞬」",
    "kind": "WFD",
    "rawResult": "'神霊「夢想封印 瞬」','WFD',300,'∞','cnrdZ'"
  },
  {
    "id": "recipe_225",
    "group": "wf",
    "ingredients": [
      "神技「八方龍殺陣」",
      "原型武器F",
      "原型武器D",
      "CAVE社特典CD『胎慟』"
    ],
    "name": "神霊「夢想封印 瞬」",
    "kind": "WFD",
    "rawResult": "'神霊「夢想封印 瞬」','WFD',450,'∞','cnrdZ'"
  },
  {
    "id": "recipe_226",
    "group": "wf",
    "ingredients": [
      "神霊「夢想封印 瞬」",
      "最终战术『心火』"
    ],
    "name": "「夢想天生」",
    "kind": "WFD",
    "rawResult": "'「夢想天生」','WFD',32767,'∞','cnrtdZ'"
  },
  {
    "id": "recipe_227",
    "group": "wf",
    "ingredients": [
      "空白符卡",
      "☆山蘑菇粉☆"
    ],
    "name": "星符『星尘狂欢』",
    "kind": "WF",
    "rawResult": "'星符『星尘狂欢』','WF',60,'∞','u'"
  },
  {
    "id": "recipe_228",
    "group": "wf",
    "ingredients": [
      "空白符卡",
      "黑色方块",
      "白色方块"
    ],
    "name": "迷你八卦炉",
    "kind": "WFG",
    "rawResult": "'迷你八卦炉','WFG',90,'∞','u'"
  },
  {
    "id": "recipe_229",
    "group": "wf",
    "ingredients": [
      "星符『星尘狂欢』",
      "迷你八卦炉"
    ],
    "name": "恋符「非定向光线」",
    "kind": "WFG",
    "rawResult": "'恋符「非定向光线」','WFG',150,'∞','cf'"
  },
  {
    "id": "recipe_230",
    "group": "wf",
    "ingredients": [
      "恋符「非定向光线」",
      "《占星术导论》"
    ],
    "name": "恋符「极限火花」",
    "kind": "WF",
    "rawResult": "'恋符「极限火花」','WF',150,'∞','cNf'"
  },
  {
    "id": "recipe_231",
    "group": "wf",
    "ingredients": [
      "恋符「极限火花」",
      "《蘑菇种植指南》"
    ],
    "name": "光符「地球光」",
    "kind": "WFJ",
    "rawResult": "'光符「地球光」','WFJ',360,'∞','cfd'"
  },
  {
    "id": "recipe_232",
    "group": "wf",
    "ingredients": [
      "恋符「极限火花」",
      "《蘑菇种植指南》",
      "《魔女的魔导书》"
    ],
    "name": "光击「击月」",
    "kind": "WFJ",
    "rawResult": "'光击「击月」','WFJ',480,'∞','cfd'"
  },
  {
    "id": "recipe_233",
    "group": "wf",
    "ingredients": [
      "光符「地球光」",
      "原型武器F",
      "原型武器G",
      "CAVE社特典CD『胎慟』"
    ],
    "name": "星符「龙陨星」",
    "kind": "WFJ",
    "rawResult": "'星符「龙陨星」','WFJ',400,'∞','cNfdZ'"
  },
  {
    "id": "recipe_234",
    "group": "wf",
    "ingredients": [
      "光击「击月」",
      "原型武器F",
      "原型武器G",
      "CAVE社特典CD『胎慟』"
    ],
    "name": "星符「龙陨星」",
    "kind": "WFJ",
    "rawResult": "'星符「龙陨星」','WFJ',600,'∞','cNfdZ'"
  },
  {
    "id": "recipe_235",
    "group": "wf",
    "ingredients": [
      "星符「龙陨星」",
      "最终战术『银花』"
    ],
    "name": "「掠日彗星」",
    "kind": "WFJ",
    "rawResult": "'「掠日彗星」','WFJ',77000,'∞','cNyfdZ'"
  },
  {
    "id": "recipe_236",
    "group": "wf",
    "ingredients": [
      "空白符卡",
      "☆守矢神签☆"
    ],
    "name": "秘术『一子单传的弹幕』",
    "kind": "WF",
    "rawResult": "'秘术『一子单传的弹幕』','WF',70,'∞','d'"
  },
  {
    "id": "recipe_237",
    "group": "wf",
    "ingredients": [
      "空白符卡",
      "★时停怀表★"
    ],
    "name": "时符『Private Square』",
    "kind": "WF",
    "rawResult": "'时符『Private Square』','WF',150,'∞','I'"
  },
  {
    "id": "recipe_238",
    "group": "wf",
    "ingredients": [
      "空白符卡",
      "★瓶装幽灵★"
    ],
    "name": "幽鬼剑『妖童饿鬼之断食』",
    "kind": "WF",
    "rawResult": "'幽鬼剑『妖童饿鬼之断食』','WF',150,'∞','c'"
  },
  {
    "id": "recipe_239",
    "group": "wf",
    "ingredients": [
      "空白符卡",
      "★伊吹瓢★"
    ],
    "name": "鬼火『超高密度燐祸术』",
    "kind": "WF",
    "rawResult": "'鬼火『超高密度燐祸术』','WF',170,'∞','u'"
  },
  {
    "id": "recipe_240",
    "group": "wf",
    "ingredients": [
      "空白符卡",
      "《文文。新闻》"
    ],
    "name": "风符『风神一扇』",
    "kind": "WF",
    "rawResult": "'风符『风神一扇』','WF',250,'∞','d'"
  },
  {
    "id": "recipe_241",
    "group": "wf",
    "ingredients": [
      "空白符卡",
      "冰冻青蛙",
      "バカ⑨制冰块"
    ],
    "name": "冰符『Icicle Fall』",
    "kind": "WF",
    "rawResult": "'冰符『Icicle Fall』','WF',9,'∞','ir'"
  },
  {
    "id": "recipe_242",
    "group": "wf",
    "ingredients": [
      "冰符『Icicle Fall』",
      "西瓜刀",
      "冰棍棒"
    ],
    "name": "曾经的荣光-深蓝",
    "kind": "WF",
    "rawResult": "'曾经的荣光-深蓝','WF',99,'∞','cri'"
  },
  {
    "id": "recipe_243",
    "group": "wf",
    "ingredients": [
      "空白符卡",
      "【触手的萃取液】",
      "《东方永夜抄》"
    ],
    "name": "紫奥义『弹幕结界』",
    "kind": "WF",
    "rawResult": "'紫奥义『弹幕结界』','WF',320,'∞','rd'"
  },
  {
    "id": "recipe_244",
    "group": "wf",
    "ingredients": [
      "时符『Private Square』",
      "幻之刃",
      "永恒飞刃"
    ],
    "name": "『咲夜的世界』",
    "kind": "WF",
    "rawResult": "'『咲夜的世界』','WF',120,'∞','ir'"
  },
  {
    "id": "recipe_245",
    "group": "wf",
    "ingredients": [
      "『咲夜的世界』",
      "鲜红的生血",
      "灵魂的结晶"
    ],
    "name": "『收缩的世界』",
    "kind": "WF",
    "rawResult": "'『收缩的世界』','WF',450,'∞','ircy'"
  },
  {
    "id": "recipe_246",
    "group": "wf",
    "ingredients": [
      "幽鬼剑『妖童饿鬼之断食』",
      "☆楼观剑☆",
      "☆白楼剑☆"
    ],
    "name": "空观剑『六根清净斩』",
    "kind": "WF",
    "rawResult": "'空观剑『六根清净斩』','WF',360,'∞','rc'"
  },
  {
    "id": "recipe_247",
    "group": "wf",
    "ingredients": [
      "鲜红的生血",
      "长矛",
      "造雾设备"
    ],
    "name": "神枪『Spear The Gungnir』",
    "kind": "WF",
    "rawResult": "'神枪『Spear The Gungnir』','WF',5500,'1','c'"
  },
  {
    "id": "recipe_248",
    "group": "wf",
    "ingredients": [
      "《东方幻想乡》",
      "触手的力量",
      "【触手的萃取液】"
    ],
    "name": "梦幻『幻月』",
    "kind": "WF",
    "rawResult": "'梦幻『幻月』','WF',900,'∞','rdcm'"
  },
  {
    "id": "recipe_249",
    "group": "wf",
    "ingredients": [
      "空白符卡",
      "《魔女的魔导书》"
    ],
    "name": "《魔导师速成攻略》",
    "kind": "VF",
    "rawResult": "'《魔导师速成攻略》','VF',233,'1',''"
  },
  {
    "id": "recipe_250",
    "group": "wf",
    "ingredients": [
      "空白符卡",
      "★制御棒★",
      "日符「Royal Flare」"
    ],
    "name": "『地狱的人造太阳』",
    "kind": "WF",
    "rawResult": "'『地狱的人造太阳』','WF',666,'∞',"
  },
  {
    "id": "recipe_251",
    "group": "wf",
    "ingredients": [
      "日&月符『Royal Diamond Ring』",
      "梦幻『幻月』",
      "神枪『Spear The Gungnir』",
      "紫奥义『弹幕结界』"
    ],
    "name": "模式『EX』",
    "kind": "WF",
    "rawResult": "'模式『EX』','WF',72000,'∞','crdyZB'"
  },
  {
    "id": "recipe_252",
    "group": "wf_pn",
    "ingredients": [
      "红色方块",
      "打火机",
      "空白符卡"
    ],
    "name": "火符「Agni Shine」",
    "kind": "WF",
    "rawResult": "'火符「Agni Shine」','WF',60,'∞','uU'"
  },
  {
    "id": "recipe_253",
    "group": "wf_pn",
    "ingredients": [
      "蓝色方块",
      "水",
      "空白符卡"
    ],
    "name": "水符「Princess Undine」",
    "kind": "WF",
    "rawResult": "'水符「Princess Undine」','WF',70,'∞','iI'"
  },
  {
    "id": "recipe_254",
    "group": "wf_pn",
    "ingredients": [
      "绿色方块",
      "治愈之叶",
      "空白符卡"
    ],
    "name": "木符「Sylphy Horn」",
    "kind": "WF",
    "rawResult": "'木符「Sylphy Horn」','WF',80,'∞','wW'"
  },
  {
    "id": "recipe_255",
    "group": "wf_pn",
    "ingredients": [
      "心金方块",
      "电池",
      "空白符卡"
    ],
    "name": "金符「Metal Fatigue」",
    "kind": "WF",
    "rawResult": "'金符「Metal Fatigue」','WF',130,'∞','eE'"
  },
  {
    "id": "recipe_256",
    "group": "wf_pn",
    "ingredients": [
      "翡翠方块",
      "岩石",
      "空白符卡"
    ],
    "name": "土符「Lazy Trilithon」",
    "kind": "WF",
    "rawResult": "'土符「Lazy Trilithon」','WF',150,'∞','Nc'"
  },
  {
    "id": "recipe_257",
    "group": "wf_pn",
    "ingredients": [
      "火符「Agni Shine」",
      "水符「Princess Undine」",
      "木符「Sylphy Horn」",
      "金符「Metal Fatigue」",
      "土符「Lazy Trilithon」"
    ],
    "name": "火水木金土符『贤者之石』",
    "kind": "WF",
    "rawResult": "'火水木金土符『贤者之石』','WF',5000,'∞','uipwe'"
  },
  {
    "id": "recipe_258",
    "group": "wf_pn",
    "ingredients": [
      "火符「Agni Shine」",
      "『环形激光』",
      "☆残页的魔导书☆"
    ],
    "name": "火符『Akiba Summer』",
    "kind": "WF",
    "rawResult": "'火符『Akiba Summer』','WF',220,'∞','uUf'"
  },
  {
    "id": "recipe_259",
    "group": "wf_pn",
    "ingredients": [
      "水符「Princess Undine」",
      "对魔物用卵石",
      "☆残页的魔导书☆"
    ],
    "name": "水符『Jerry Fish Princess』",
    "kind": "WF",
    "rawResult": "'水符『Jerry Fish Princess』','WF',90,'∞','riI'"
  },
  {
    "id": "recipe_260",
    "group": "wf_pn",
    "ingredients": [
      "木符「Sylphy Horn」",
      "『午夜钟声』",
      "☆残页的魔导书☆"
    ],
    "name": "木符『Green Storm』",
    "kind": "WF",
    "rawResult": "'木符『Green Storm』','WF',230,'∞','wWtN'"
  },
  {
    "id": "recipe_261",
    "group": "wf_pn",
    "ingredients": [
      "金符「Metal Fatigue」",
      "☆电击器☆",
      "☆残页的魔导书☆"
    ],
    "name": "金符『Silver Dragon』",
    "kind": "WF",
    "rawResult": "'金符『Silver Dragon』','WF',200,'∞','eEn'"
  },
  {
    "id": "recipe_262",
    "group": "wf_pn",
    "ingredients": [
      "土符「Lazy Trilithon」",
      "☆三村式爆彈☆",
      "☆残页的魔导书☆"
    ],
    "name": "土符『Trilithon Shake』",
    "kind": "WF",
    "rawResult": "'土符『Trilithon Shake』','WF',180,'∞','dc'"
  },
  {
    "id": "recipe_263",
    "group": "wf_pn",
    "ingredients": [
      "火符『Akiba Summer』",
      "水符『Jerry Fish Princess』",
      "木符『Green Storm』",
      "金符『Silver Dragon』",
      "土符『Trilithon Shake』"
    ],
    "name": "火水木金土符『贤者之石-上级』",
    "kind": "WF",
    "rawResult": "'火水木金土符『贤者之石-上级』','WF',5000,'∞','uipwerd'"
  },
  {
    "id": "recipe_264",
    "group": "wf_pn",
    "ingredients": [
      "土符「Lazy Trilithon」",
      "水符「Princess Undine」",
      "空白符卡"
    ],
    "name": "土&水符『Noachian Deluge』",
    "kind": "WF",
    "rawResult": "'土&水符『Noachian Deluge』','WF',220,'50','ic'"
  },
  {
    "id": "recipe_265",
    "group": "wf_pn",
    "ingredients": [
      "土符「Lazy Trilithon」",
      "火符「Agni Shine」",
      "岩石"
    ],
    "name": "火&土符『Lava Cromlech』",
    "kind": "WF",
    "rawResult": "'火&土符『Lava Cromlech』','WF',240,180,'d'"
  },
  {
    "id": "recipe_266",
    "group": "wf_pn",
    "ingredients": [
      "水符「Princess Undine」",
      "金符「Metal Fatigue」"
    ],
    "name": "金&水符『Mercury Poison』",
    "kind": "WF",
    "rawResult": "'金&水符『Mercury Poison』','WF',94,'∞','paZ'"
  },
  {
    "id": "recipe_267",
    "group": "wf_pn",
    "ingredients": [
      "金符「Metal Fatigue」",
      "火符「Agni Shine」",
      "《魔女的魔导书》"
    ],
    "name": "火&金符『St. Elmo Pillar』",
    "kind": "WF",
    "rawResult": "'火&金符『St. Elmo Pillar』','WF',330,'∞','ndfc'"
  },
  {
    "id": "recipe_268",
    "group": "wf_pn",
    "ingredients": [
      "水符『Jerry Fish Princess』",
      "月符「Silent Serena」",
      "消音器",
      "天然水"
    ],
    "name": "水&月符『Silent Deluge』",
    "kind": "WF",
    "rawResult": "'水&月符『Silent Deluge』','WF',233,'∞','kZz'"
  },
  {
    "id": "recipe_269",
    "group": "wf_pn",
    "ingredients": [
      "向日葵",
      "☆残页的魔导书☆",
      "空白符卡"
    ],
    "name": "日符「Royal Flare」-劣",
    "kind": "WF",
    "rawResult": "'日符「Royal Flare」-劣','WF',80,'∞','dc'"
  },
  {
    "id": "recipe_270",
    "group": "wf_pn",
    "ingredients": [
      "月光碎片",
      "☆残页的魔导书☆",
      "空白符卡"
    ],
    "name": "月符「Silent Serena」-劣",
    "kind": "WF",
    "rawResult": "'月符「Silent Serena」-劣','WF',40,'∞','rc'"
  },
  {
    "id": "recipe_271",
    "group": "wf_pn",
    "ingredients": [
      "日符「Royal Flare」-劣",
      "《魔女的魔导书》"
    ],
    "name": "日符「Royal Flare」",
    "kind": "WF",
    "rawResult": "'日符「Royal Flare」','WF',270,'∞','udc'"
  },
  {
    "id": "recipe_272",
    "group": "wf_pn",
    "ingredients": [
      "月符「Silent Serena」-劣",
      "《魔女的魔导书》"
    ],
    "name": "月符「Silent Serena」",
    "kind": "WF",
    "rawResult": "'月符「Silent Serena」','WF',120,'∞','irc'"
  },
  {
    "id": "recipe_273",
    "group": "wf_pn",
    "ingredients": [
      "月符「Silent Serena」",
      "日符「Royal Flare」"
    ],
    "name": "日&月符『Royal Diamond Ring』",
    "kind": "WF",
    "rawResult": "'日&月符『Royal Diamond Ring』','WF',432,'∞','riud'"
  },
  {
    "id": "recipe_274",
    "group": "wf_pn",
    "ingredients": [
      "月符「Silent Serena」-劣",
      "日符「Royal Flare」-劣"
    ],
    "name": "日&月符『Royal Diamond Ring』-劣",
    "kind": "WF",
    "rawResult": "'日&月符『Royal Diamond Ring』-劣','WF',99,999,'zzzzz'"
  },
  {
    "id": "recipe_275",
    "group": "wf_pn",
    "ingredients": [
      "月符「Silent Serena」",
      "月符「Silent Serena」",
      "火水木金土符『贤者之石』",
      "金符「Metal Fatigue」"
    ],
    "name": "月月火水木金金符『年中无休』（笑）",
    "kind": "WF",
    "rawResult": "'月月火水木金金符『年中无休』（笑）','WF',65500,'∞','rdnNc'"
  },
  {
    "id": "recipe_276",
    "group": "wf_pn",
    "ingredients": [
      "月符「Silent Serena」",
      "月符「Silent Serena」",
      "火水木金土符『贤者之石-上级』",
      "金符「Metal Fatigue」"
    ],
    "name": "月月火水木金金符『年中无休』",
    "kind": "WF",
    "rawResult": "'月月火水木金金符『年中无休』','WF',65500,'∞','rdnyNcZ'"
  },
  {
    "id": "recipe_277",
    "group": "wf_ks",
    "ingredients": [
      "空白符卡",
      "生命探测器",
      "精神制剂"
    ],
    "name": "想起「恐怖催眠术」",
    "kind": "WF",
    "rawResult": "'想起「恐怖催眠术」','WF',65,100,'cd'"
  },
  {
    "id": "recipe_278",
    "group": "wf_ks",
    "ingredients": [
      "空白符卡",
      "广域生命探测器",
      "精神制剂"
    ],
    "name": "想起「恐怖催眠术」",
    "kind": "WF",
    "rawResult": "'想起「恐怖催眠术」','WF',80,100,'cd'"
  },
  {
    "id": "recipe_279",
    "group": "wf_ks",
    "ingredients": [
      "空白符卡",
      "小五拖鞋"
    ],
    "name": "想起「恐怖催眠术」",
    "kind": "WF",
    "rawResult": "'想起「恐怖催眠术」','WF',90,'∞','cd'"
  },
  {
    "id": "recipe_280",
    "group": "wf_ks",
    "ingredients": [
      "想起「恐怖催眠术」",
      "鬼火『超高密度燐祸术』"
    ],
    "name": "想起「户隐山之投」",
    "kind": "WF",
    "rawResult": "'想起「户隐山之投」','WF',150,'∞','cf'"
  },
  {
    "id": "recipe_281",
    "group": "wf_ks",
    "ingredients": [
      "想起「户隐山之投」",
      "☆博丽护符☆",
      "造雾设备"
    ],
    "name": "想起「蒙蒙迷雾」",
    "kind": "WF",
    "rawResult": "'想起「蒙蒙迷雾」','WF',400,'∞','cfa'"
  },
  {
    "id": "recipe_282",
    "group": "wf_ks",
    "ingredients": [
      "想起「恐怖催眠术」",
      "风符『风神一扇』"
    ],
    "name": "想起「风神木叶隐身术」",
    "kind": "WF",
    "rawResult": "'想起「风神木叶隐身术」','WF',230,'∞','cd'"
  },
  {
    "id": "recipe_283",
    "group": "wf_ks",
    "ingredients": [
      "想起「风神木叶隐身术」",
      "☆守矢神签☆",
      "『延展御柱』",
      "蛙符【操控群蛙】"
    ],
    "name": "想起「鸟居旋风」",
    "kind": "WF",
    "rawResult": "'想起「鸟居旋风」','WF',230,'∞','ctr'"
  },
  {
    "id": "recipe_284",
    "group": "wf_ks",
    "ingredients": [
      "想起「恐怖催眠术」",
      "蓝色方块",
      "金色方块"
    ],
    "name": "想起「Mercury Poison」",
    "kind": "WF",
    "rawResult": "'想起「Mercury Poison」','WF',94,'∞','cpa'"
  },
  {
    "id": "recipe_285",
    "group": "wf_ks",
    "ingredients": [
      "想起「Mercury Poison」",
      "红色方块",
      "绿色方块",
      "黄色方块"
    ],
    "name": "想起「贤者之石」",
    "kind": "WF",
    "rawResult": "'想起「贤者之石」','WF',500,'∞','cuipwe'"
  },
  {
    "id": "recipe_286",
    "group": "wf_ks",
    "ingredients": [
      "想起「蒙蒙迷雾」",
      "想起「鸟居旋风」",
      "想起「贤者之石」"
    ],
    "name": "想起「朦胧记忆中的金阁寺」",
    "kind": "WF",
    "rawResult": "'想起「朦胧记忆中的金阁寺」','WF',55555,'∞','cyfkt'"
  },
  {
    "id": "recipe_287",
    "group": "madoka",
    "ingredients": [
      "最终战术『剑海』",
      "悲叹之种"
    ],
    "name": "魔导迷城『恋沫』",
    "kind": "WK",
    "rawResult": "'魔导迷城『恋沫』','WK',70000,'∞','Zkcrd'"
  },
  {
    "id": "recipe_288",
    "group": "madoka",
    "ingredients": [
      "最终战术『心火』",
      "悲叹之种"
    ],
    "name": "魔导迷城『愚刑』",
    "kind": "WD",
    "rawResult": "'魔导迷城『愚刑』','WD',70000,'∞','Lcrd'"
  },
  {
    "id": "recipe_289",
    "group": "madoka",
    "ingredients": [
      "最终战术『心火』[+8]",
      "最终战术『光矢』"
    ],
    "name": "概念武装『破则』",
    "kind": "WF",
    "rawResult": "'概念武装『破则』','WF',20110424,'∞','EnkaNxhyLd'"
  },
  {
    "id": "recipe_290",
    "group": "madoka",
    "ingredients": [
      "魔导迷城『愚刑』",
      "魔导迷城『恋沫』[+5]",
      "魔导迷城『糖风』[+5]",
      "最终战术『蝎尾』[+5]",
      "最终战术『银花』[+5]",
      "最终战术『光矢』[+5]"
    ],
    "name": "狱魇之都『泷庭』",
    "kind": "WFJ",
    "rawResult": "'狱魇之都『泷庭』','WFJ',20131026,'∞','LOVxMad'"
  },
  {
    "id": "recipe_291",
    "group": "ocg",
    "ingredients": [
      "「被封印的艾克佐迪亚」",
      "「被封印者的左腕」",
      "「被封印者的右腕」",
      "「被封印者的左足」",
      "「被封印者的右足」"
    ],
    "name": "「被封印的黑暗大法师」",
    "kind": "WC",
    "rawResult": "'「被封印的黑暗大法师」','WC',8192,1,"
  },
  {
    "id": "recipe_292",
    "group": "ocg",
    "ingredients": [
      "「被封印的黑暗大法师」",
      "★神卡认证★"
    ],
    "name": "『黑暗大法师』",
    "kind": "WC12",
    "rawResult": "'『黑暗大法师』','WC12',8192,'∞','AaZ'"
  },
  {
    "id": "recipe_293",
    "group": "ocg",
    "ingredients": [
      "「隼骑士」-仮",
      "☆四星认证☆"
    ],
    "name": "「隼骑士」 ★3",
    "kind": "WC03",
    "rawResult": "'「隼骑士」 ★3','WC03',100,'∞','rj'"
  },
  {
    "id": "recipe_294",
    "group": "ocg",
    "ingredients": [
      "「V-喷气虎」-仮",
      "☆四星认证☆"
    ],
    "name": "「V-喷气虎」 ★4",
    "kind": "WC04",
    "rawResult": "'「V-喷气虎」 ★4','WC04',160,'180','p'"
  },
  {
    "id": "recipe_295",
    "group": "ocg",
    "ingredients": [
      "「W-弹射飞翼」-仮",
      "☆四星认证☆"
    ],
    "name": "「W-弹射飞翼」 ★4",
    "kind": "WC04",
    "rawResult": "'「W-弹射飞翼」 ★4','WC04',130,'150','u'"
  },
  {
    "id": "recipe_296",
    "group": "ocg",
    "ingredients": [
      "「X-首领加农」-仮",
      "☆四星认证☆"
    ],
    "name": "「X-首领加农」 ★4",
    "kind": "WC04",
    "rawResult": "'「X-首领加农」 ★4','WC04',180,'150','i'"
  },
  {
    "id": "recipe_297",
    "group": "ocg",
    "ingredients": [
      "「Y-龙头」-仮",
      "☆四星认证☆"
    ],
    "name": "「Y-龙头」 ★4",
    "kind": "WC04",
    "rawResult": "'「Y-龙头」 ★4','WC04',150,'160','e'"
  },
  {
    "id": "recipe_298",
    "group": "ocg",
    "ingredients": [
      "「Z-金属履带」-仮",
      "☆四星认证☆"
    ],
    "name": "「Z-金属履带」 ★4",
    "kind": "WC04",
    "rawResult": "'「Z-金属履带」 ★4','WC04',150,'130','w'"
  },
  {
    "id": "recipe_299",
    "group": "ocg",
    "ingredients": [
      "「V-喷气虎」 ★4",
      "「W-弹射飞翼」 ★4"
    ],
    "name": "「VW-强击虎」 ★6",
    "kind": "WC06",
    "rawResult": "'「VW-强击虎」 ★6','WC06',200,'∞','pu'"
  },
  {
    "id": "recipe_300",
    "group": "ocg",
    "ingredients": [
      "「X-首领加农」 ★4",
      "「Y-龙头」 ★4",
      "「Z-金属履带」 ★4"
    ],
    "name": "「XYZ-神龙炮」 ★8",
    "kind": "WC08",
    "rawResult": "'「XYZ-神龙炮」 ★8','WC08',280,'∞','iew'"
  },
  {
    "id": "recipe_301",
    "group": "ocg",
    "ingredients": [
      "「VW-强击虎」 ★6",
      "「XYZ-神龙炮」 ★8"
    ],
    "name": "「VWXYZ-神龙强击炮」 ★8",
    "kind": "WC08",
    "rawResult": "'「VWXYZ-神龙强击炮」 ★8','WC08',320,'∞','puiewy'"
  },
  {
    "id": "recipe_302",
    "group": "ocg",
    "ingredients": [
      "「V-喷气虎」 ★4",
      "「W-弹射飞翼」 ★4",
      "「X-首领加农」 ★4",
      "「Y-龙头」 ★4",
      "「Z-金属履带」 ★4"
    ],
    "name": "「VWXYZ-神龙强击炮」 ★8",
    "kind": "WC08",
    "rawResult": "'「VWXYZ-神龙强击炮」 ★8','WC08',450,'∞','puiewy'"
  },
  {
    "id": "recipe_303",
    "group": "ocg",
    "ingredients": [
      "「绝对防御将军」-仮",
      "☆六星认证☆"
    ],
    "name": "「绝对防御将军」 ★6",
    "kind": "WC06",
    "rawResult": "'「绝对防御将军」 ★6','WC06',250,'∞','A'"
  },
  {
    "id": "recipe_304",
    "group": "ocg",
    "ingredients": [
      "「人造人-念力震慑者」-仮",
      "☆六星认证☆"
    ],
    "name": "「人造人-念力震慑者」 ★6",
    "kind": "WC06",
    "rawResult": "'「人造人-念力震慑者」 ★6','WC06',240,'∞','NM'"
  },
  {
    "id": "recipe_305",
    "group": "ocg",
    "ingredients": [
      "「恶魔召唤」-仮",
      "☆六星认证☆"
    ],
    "name": "「恶魔召唤」 ★6",
    "kind": "WC06",
    "rawResult": "'「恶魔召唤」 ★6','WC06',250,'∞','c'"
  },
  {
    "id": "recipe_306",
    "group": "ocg",
    "ingredients": [
      "「真紅眼黑龍」-仮",
      "☆七星认证☆"
    ],
    "name": "「真紅眼黑龍」 ★7",
    "kind": "WC07",
    "rawResult": "'「真紅眼黑龍」 ★7','WC07',240,'∞','u'"
  },
  {
    "id": "recipe_307",
    "group": "ocg",
    "ingredients": [
      "「真紅眼黑龍」 ★7",
      "★神卡认证★"
    ],
    "name": "「真紅眼闇龍」 ★9",
    "kind": "WC09",
    "rawResult": "'「真紅眼闇龍」 ★9','WC09',2400,'∞','cruZ'"
  },
  {
    "id": "recipe_308",
    "group": "ocg",
    "ingredients": [
      "「真紅眼黑龍」 ★7",
      "「金属化·魔法反射装甲」"
    ],
    "name": "「真紅眼黑龍鐵龍」 ★9",
    "kind": "WC08",
    "rawResult": "'「真紅眼黑龍鐵龍」 ★9','WC08',280,'∞','uA'"
  },
  {
    "id": "recipe_309",
    "group": "ocg",
    "ingredients": [
      "「恶魔召唤」 ★6",
      "「真紅眼黑龍」 ★7"
    ],
    "name": "「暗黑魔龙」 ★9",
    "kind": "WC09",
    "rawResult": "'「暗黑魔龙」 ★9','WC09',320,'∞','cru'"
  },
  {
    "id": "recipe_310",
    "group": "ocg",
    "ingredients": [
      "「左轮手枪龙」-仮",
      "☆七星认证☆"
    ],
    "name": "「左轮手枪龙」 ★7",
    "kind": "WC07",
    "rawResult": "'「左轮手枪龙」 ★7','WC07',260,'∞','r'"
  },
  {
    "id": "recipe_311",
    "group": "ocg",
    "ingredients": [
      "「破龙剑士」-仮",
      "☆七星认证☆"
    ],
    "name": "「破龙剑士」 ★7",
    "kind": "WC07",
    "rawResult": "'「破龙剑士」 ★7','WC07',260,'∞','cC'"
  },
  {
    "id": "recipe_312",
    "group": "ocg",
    "ingredients": [
      "「黑魔术师」-仮",
      "☆七星认证☆"
    ],
    "name": "「黑魔术师」 ★7",
    "kind": "WC07",
    "rawResult": "'「黑魔术师」 ★7','WC07',250,'∞','cC'"
  },
  {
    "id": "recipe_313",
    "group": "ocg",
    "ingredients": [
      "「黑魔术师」 ★7",
      "「破龙剑士」 ★7"
    ],
    "name": "「超魔导剑士-黑暗帕拉丁」 ★8",
    "kind": "WC08",
    "rawResult": "'「超魔导剑士-黑暗帕拉丁」 ★8','WC08',300,'∞','crdZy'"
  },
  {
    "id": "recipe_314",
    "group": "ocg",
    "ingredients": [
      "「青眼白龙」-仮",
      "☆八星认证☆"
    ],
    "name": "「青眼白龙」 ★8",
    "kind": "WC08",
    "rawResult": "'「青眼白龙」 ★8','WC08',300,'∞','d'"
  },
  {
    "id": "recipe_315",
    "group": "ocg",
    "ingredients": [
      "「青眼白龙」 ★8",
      "「青眼白龙」 ★8",
      "「青眼白龙」 ★8"
    ],
    "name": "「青眼究极龙」 ★10",
    "kind": "WC10",
    "rawResult": "'「青眼究极龙」 ★10','WC10',450,'∞','rdZ'"
  },
  {
    "id": "recipe_316",
    "group": "ocg",
    "ingredients": [
      "「奥西里斯之天空龙」-仮",
      "★神卡认证★"
    ],
    "name": "『奥西里斯之天空龙』 ★10",
    "kind": "WC10",
    "rawResult": "'『奥西里斯之天空龙』 ★10','WC10',4000,'∞','ncrtZ'"
  },
  {
    "id": "recipe_317",
    "group": "ocg",
    "ingredients": [
      "「欧贝利斯克之巨神兵」-仮",
      "★神卡认证★"
    ],
    "name": "『欧贝利斯克之巨神兵』 ★10",
    "kind": "WC10",
    "rawResult": "'『欧贝利斯克之巨神兵』 ★10','WC10',4000,'∞','NcrkZ'"
  },
  {
    "id": "recipe_318",
    "group": "ocg",
    "ingredients": [
      "「太阳神之翼神龙」-仮",
      "★神卡认证★"
    ],
    "name": "『太阳神之翼神龙』 ★10",
    "kind": "WC10",
    "rawResult": "'『太阳神之翼神龙』 ★10','WC10',4000,'∞','ycrfZ'"
  },
  {
    "id": "recipe_319",
    "group": "ocg",
    "ingredients": [
      "『奥西里斯之天空龙』 ★10",
      "『欧贝利斯克之巨神兵』 ★10",
      "『太阳神之翼神龙』 ★10"
    ],
    "name": "◎光之创造神 哈拉克提◎",
    "kind": "WC",
    "rawResult": "'◎光之创造神 哈拉克提◎','WC',111210,'∞','nyNrfktZ'"
  },
  {
    "id": "recipe_320",
    "group": "ocg",
    "ingredients": [
      "「电子龙」-仮",
      "☆五星认证☆"
    ],
    "name": "「电子龙」 ★5",
    "kind": "WC05",
    "rawResult": "'「电子龙」 ★5','WC05',200,'∞','ej'"
  },
  {
    "id": "recipe_321",
    "group": "ocg",
    "ingredients": [
      "「电子龙」 ★5",
      "「电子龙」 ★5",
      "「电子龙」 ★5"
    ],
    "name": "「电子终结龙」 ★10",
    "kind": "WC10",
    "rawResult": "'「电子终结龙」 ★10','WC10',240,'∞','Nnrc'"
  },
  {
    "id": "recipe_322",
    "group": "ocg",
    "ingredients": [
      "「电子终结龙」 ★10",
      "「电子终结龙」 ★10",
      "「电子终结龙」 ★10"
    ],
    "name": "「电子天龙头」 ★10",
    "kind": "WC10",
    "rawResult": "'「电子天龙头」 ★10','WC10',1200,'∞','ZNnrc'"
  },
  {
    "id": "recipe_323",
    "group": "ocg",
    "ingredients": [
      "「骷髅指挥」-仮",
      "☆四星认证☆"
    ],
    "name": "「骷髅指挥」 ★4",
    "kind": "WC04",
    "rawResult": "'「骷髅指挥」 ★4','WC04',100,'∞','rj'"
  },
  {
    "id": "recipe_324",
    "group": "ocg",
    "ingredients": [
      "「僵尸之主」-仮",
      "☆四星认证☆"
    ],
    "name": "「僵尸之主」 ★4",
    "kind": "WC04",
    "rawResult": "'「僵尸之主」 ★4','WC04',170,'90','pj'"
  },
  {
    "id": "recipe_325",
    "group": "ocg",
    "ingredients": [
      "「死灵之颜」-仮",
      "☆四星认证☆"
    ],
    "name": "「死灵之颜」 ★4",
    "kind": "WC04",
    "rawResult": "'「死灵之颜」 ★4','WC04',170,'∞','ej'"
  },
  {
    "id": "recipe_326",
    "group": "ocg",
    "ingredients": [
      "「吸血鬼领主」-仮",
      "☆五星认证☆"
    ],
    "name": "「吸血鬼领主」 ★5",
    "kind": "WC05",
    "rawResult": "'「吸血鬼领主」 ★5','WC05',200,'∞','Aaj'"
  },
  {
    "id": "recipe_327",
    "group": "ocg",
    "ingredients": [
      "水灵使-艾莉娅 ★3",
      "☆四星认证☆"
    ],
    "name": "凭依装着-艾莉娅 ★4",
    "kind": "WC04",
    "rawResult": "'凭依装着-艾莉娅 ★4','WC04',160,'130','ij'"
  },
  {
    "id": "recipe_328",
    "group": "ocg",
    "ingredients": [
      "火灵使-希塔 ★3",
      "☆四星认证☆"
    ],
    "name": "凭依装着-希塔 ★4",
    "kind": "WC04",
    "rawResult": "'凭依装着-希塔 ★4','WC04',160,'160','uj'"
  },
  {
    "id": "recipe_329",
    "group": "ocg",
    "ingredients": [
      "风灵使-薇茵 ★3",
      "☆四星认证☆"
    ],
    "name": "凭依装着-薇茵 ★4",
    "kind": "WC04",
    "rawResult": "'凭依装着-薇茵 ★4','WC04',160,'160','cj'"
  },
  {
    "id": "recipe_330",
    "group": "ocg",
    "ingredients": [
      "暗灵使-达克 ★3",
      "☆四星认证☆"
    ],
    "name": "凭依装着-达克 ★4",
    "kind": "WC04",
    "rawResult": "'凭依装着-达克 ★4','WC04',160,'160','pj'"
  },
  {
    "id": "recipe_331",
    "group": "ocg",
    "ingredients": [
      "地灵使-奥丝 ★3",
      "☆四星认证☆"
    ],
    "name": "凭依装着-奥丝 ★4",
    "kind": "WC04",
    "rawResult": "'凭依装着-奥丝 ★4','WC04',160,'160','wj'"
  },
  {
    "id": "recipe_332",
    "group": "ocg",
    "ingredients": [
      "光灵使-莱娜 ★3",
      "☆四星认证☆"
    ],
    "name": "凭依装着-莱娜 ★4",
    "kind": "WC04",
    "rawResult": "'凭依装着-莱娜 ★4','WC04',160,'160','ej'"
  },
  {
    "id": "recipe_333",
    "group": "ocg",
    "ingredients": [
      "凭依装着-达克 ★4",
      "凭依装着-奥丝 ★4",
      "凭依装着-莱娜 ★4"
    ],
    "name": "友谊天使 ★4",
    "kind": "WC04",
    "rawResult": "'友谊天使 ★4','WC04',100,'∞','pwe'"
  },
  {
    "id": "recipe_334",
    "group": "ocg",
    "ingredients": [
      "凭依装着-艾莉娅 ★4",
      "凭依装着-希塔 ★4",
      "凭依装着-薇茵 ★4"
    ],
    "name": "魔法幽灵 ★4",
    "kind": "WC04",
    "rawResult": "'魔法幽灵 ★4','WC04',100,'∞','iuc'"
  },
  {
    "id": "recipe_335",
    "group": "hidden",
    "ingredients": [
      "凭依装着-艾莉娅 ★4",
      "凭依装着-希塔 ★4",
      "凭依装着-薇茵 ★4",
      "凭依装着-达克 ★4",
      "凭依装着-奥丝 ★4",
      "凭依装着-莱娜 ★4"
    ],
    "name": "买力头破你~卖力头破你~",
    "kind": "WC",
    "rawResult": "'买力头破你~卖力头破你~','WC',450,'∞','uiewp'"
  },
  {
    "id": "recipe_336",
    "group": "ocg",
    "ingredients": [
      "友谊天使 ★4",
      "魔法幽灵 ★4"
    ],
    "name": "卖力头破你",
    "kind": "WC",
    "rawResult": "'卖力头破你','WC',233,'∞','uiewp'"
  },
  {
    "id": "recipe_337",
    "group": "ocg",
    "ingredients": [
      "武器手套 ★4 -仮",
      "☆四星认证☆"
    ],
    "name": "武器手套 ★4",
    "kind": "DA04",
    "rawResult": "'武器手套 ★4','DA04',180,120,'c^001'"
  },
  {
    "id": "recipe_338",
    "group": "ocg",
    "ingredients": [
      "甲化铠骨骼 ★6 -仮",
      "☆六星认证☆"
    ],
    "name": "甲化铠骨骼 ★6",
    "kind": "DB06",
    "rawResult": "'甲化铠骨骼 ★6','DB06',250,160,'GD^001'"
  },
  {
    "id": "recipe_339",
    "group": "ocg",
    "ingredients": [
      "英豪冠军 草雉剑王",
      "《曾伽·宗博尔特自传》"
    ],
    "name": "英♂豪冠军 断♂肛♂剑♂王 ☆4",
    "kind": "WK",
    "rawResult": "'英♂豪冠军 断♂肛♂剑♂王 ☆4','WK',444,'∞','Znd'"
  },
  {
    "id": "recipe_340",
    "group": "ocg",
    "ingredients": [
      "始祖守护者 提拉斯 ☆5 -仮",
      "☆五星认证☆"
    ],
    "name": "始祖守护者 提拉斯 ☆5",
    "kind": "WC",
    "rawResult": "'始祖守护者 提拉斯 ☆5','WC',222,'∞','fwi'"
  },
  {
    "id": "recipe_341",
    "group": "ocg",
    "ingredients": [
      "流星龙 ★10 -仮",
      "☆十星认证☆"
    ],
    "name": "流星龙 ★10",
    "kind": "WC10",
    "rawResult": "'流星龙 ★10','WC10',500,'∞','rjt^001'"
  },
  {
    "id": "recipe_342",
    "group": "ocg",
    "ingredients": [
      "红莲魔龙 ★8 -仮",
      "☆八星认证☆"
    ],
    "name": "红莲魔龙 ★8",
    "kind": "WC08",
    "rawResult": "'红莲魔龙 ★8','WC08',500,'25','du^001'"
  },
  {
    "id": "recipe_343",
    "group": "ocg",
    "ingredients": [
      "红莲魔龙 ★8",
      "☆爆裂模式☆"
    ],
    "name": "真红魔龙/爆裂体 ★10",
    "kind": "WC10",
    "rawResult": "'真红魔龙/爆裂体 ★10','WC10',250,'∞','dZ'"
  },
  {
    "id": "recipe_344",
    "group": "ocg",
    "ingredients": [
      "星尘龙 ★8",
      "☆爆裂模式☆"
    ],
    "name": "星尘龙/爆裂体 ★10",
    "kind": "WC10",
    "rawResult": "'星尘龙/爆裂体 ★10','WC10',627,'∞','mr'"
  },
  {
    "id": "recipe_345",
    "group": "ocg",
    "ingredients": [
      "机巧将军 无零 ★7 -仮",
      "☆七星认证☆"
    ],
    "name": "机巧将军 无零 ★7",
    "kind": "WC07",
    "rawResult": "'机巧将军 无零 ★7','WC07',400,'∞','ZA^001'"
  },
  {
    "id": "recipe_346",
    "group": "ocg",
    "ingredients": [
      "生命激流龙 ★8-仮",
      "☆八星认证☆"
    ],
    "name": "生命激流龙 ★8",
    "kind": "WC08",
    "rawResult": "'生命激流龙 ★8','WC08',290,'∞','cZs^001^002'"
  },
  {
    "id": "recipe_347",
    "group": "ocg",
    "ingredients": [
      "正义盟军 光明守望者 ★8 -仮",
      "☆八星认证☆"
    ],
    "name": "正义盟军 光明守望者 ★8",
    "kind": "WC08",
    "rawResult": "'正义盟军 光明守望者 ★8','WC08',260,'∞','rZ^001'"
  },
  {
    "id": "recipe_348",
    "group": "ocg",
    "ingredients": [
      "救世魔龙 ★10-仮",
      "☆十星认证☆"
    ],
    "name": "「救世魔龙」 ★10",
    "kind": "WC10",
    "rawResult": "'「救世魔龙」 ★10','WC10',1200,'∞','cuf^001'"
  },
  {
    "id": "recipe_349",
    "group": "ocg",
    "ingredients": [
      "救世星龙 ★10-仮",
      "☆十星认证☆"
    ],
    "name": "「救世星龙」 ★10",
    "kind": "WC10",
    "rawResult": "'「救世星龙」 ★10','WC10',900,'∞','cwt^001'"
  },
  {
    "id": "recipe_350",
    "group": "ocg",
    "ingredients": [
      "『流天类星龙』 ★12(OCG)-仮",
      "★神卡认证★"
    ],
    "name": "『流天类星龙』 ★12",
    "kind": "WC12",
    "rawResult": "'『流天类星龙』 ★12','WC12',4000,'∞','mcrtZy^001'"
  },
  {
    "id": "recipe_351",
    "group": "ocg",
    "ingredients": [
      "『流天类星龙』 ★12 -仮",
      "★神卡认证★"
    ],
    "name": "『流天类星龙』 ★12",
    "kind": "WC12",
    "rawResult": "'『流天类星龙』 ★12','WC12',16000,'∞','crtZny^001'"
  },
  {
    "id": "recipe_352",
    "group": "ocg",
    "ingredients": [
      "No39.希望皇 霍普 ☆4",
      "CNo.39 希望皇 霍普雷 ☆4"
    ],
    "name": "闪光No.39 希望皇 霍普·电光皇 ☆5",
    "kind": "WC",
    "rawResult": "'闪光No.39 希望皇 霍普·电光皇 ☆5','WC',600,'∞','be'"
  },
  {
    "id": "recipe_353",
    "group": "ocg",
    "ingredients": [
      "☆五星认证☆",
      "☆七星认证☆",
      "游戏王三星素材"
    ],
    "name": "「调整中」",
    "kind": "WC",
    "rawResult": "'「调整中」','WC',573,573,'z'"
  },
  {
    "id": "recipe_354",
    "group": "ocg",
    "ingredients": [
      "「调整中」",
      "☆十星认证☆"
    ],
    "name": "「禁卡表」",
    "kind": "WC",
    "rawResult": "'「禁卡表」','WC',573,'∞','konami'"
  },
  {
    "id": "recipe_355",
    "group": "ocg",
    "ingredients": [
      "「效果遮蒙者」-仮",
      "☆手坑认证☆"
    ],
    "name": "「效果遮蒙者」 ★1",
    "kind": "WC01",
    "rawResult": "'「效果遮蒙者」 ★1','WC01',0,'∞','Bs'"
  },
  {
    "id": "recipe_356",
    "group": "ocg",
    "ingredients": [
      "「幽鬼兔」-仮",
      "☆手坑认证☆"
    ],
    "name": "「幽鬼兔」 ★3",
    "kind": "WC03",
    "rawResult": "'「幽鬼兔」 ★3','WC03',50,'∞','dbs'"
  },
  {
    "id": "recipe_357",
    "group": "ocg",
    "ingredients": [
      "「浮幽樱」-仮",
      "☆手坑认证☆"
    ],
    "name": "「浮幽樱」 ★3",
    "kind": "WC03",
    "rawResult": "'「浮幽樱」 ★3','WC03',50,'∞','pnys'"
  },
  {
    "id": "recipe_358",
    "group": "ocg",
    "ingredients": [
      "「灰流呜啦啦」",
      "☆手坑认证☆"
    ],
    "name": "「灰流丽」 ★3",
    "kind": "WC03",
    "rawResult": "'「灰流丽」 ★3','WC03',50,'∞','fkts'"
  },
  {
    "id": "recipe_359",
    "group": "ocg",
    "ingredients": [
      "彼岸的旅人 但丁 ☆3",
      "☆四星认证☆"
    ],
    "name": "彼岸的旅人 但丁 ☆3（攻表）",
    "kind": "WC",
    "rawResult": "'彼岸的旅人 但丁 ☆3（攻表）','WC',250,'∞','uR'"
  },
  {
    "id": "recipe_360",
    "group": "ocg",
    "ingredients": [
      "彼岸的旅人 但丁 ☆3（攻表）",
      "☆叠♂放☆",
      "☆六星认证☆"
    ],
    "name": "永远的淑女 贝阿特丽切 ☆6",
    "kind": "WC",
    "rawResult": "'永远的淑女 贝阿特丽切 ☆6','WC',320,'∞','urR'"
  },
  {
    "id": "recipe_361",
    "group": "ocg",
    "ingredients": [
      "电子龙·新星 ☆5",
      "☆叠♂放☆",
      "☆五星认证☆"
    ],
    "name": "电子龙·无限 ☆5",
    "kind": "WC",
    "rawResult": "'电子龙·无限 ☆5','WC',250,'∞','rdnya'"
  },
  {
    "id": "recipe_362",
    "group": "hidden",
    "ingredients": [
      "歌词卡片【海洋】",
      "歌词卡片【大地】",
      "歌词卡片【星空】"
    ],
    "name": "破灭之诗",
    "kind": "Y",
    "rawResult": "'破灭之诗','Y',1,1,95"
  },
  {
    "id": "recipe_363",
    "group": "hidden",
    "ingredients": [
      "矿泉水",
      "面包",
      "女生校服"
    ],
    "name": "Untainted Glory",
    "kind": "A",
    "rawResult": "'Untainted Glory','A',1,1,'Z'"
  },
  {
    "id": "recipe_364",
    "group": "hidden",
    "ingredients": [
      "矿泉水",
      "面包",
      "男生校服"
    ],
    "name": "Untainted Glory",
    "kind": "A",
    "rawResult": "'Untainted Glory','A',1,1,'Z'"
  },
  {
    "id": "recipe_365",
    "group": "hidden",
    "ingredients": [
      "COCO☆酱",
      "YES♂SIR",
      "鼓舞士气的头带"
    ],
    "name": "FFF团集体出动",
    "kind": "WG",
    "rawResult": "'FFF团集体出动','WG',100000,998,'BbdcN'"
  },
  {
    "id": "recipe_366",
    "group": "hidden",
    "ingredients": [
      "武神之魂",
      "琉璃血"
    ],
    "name": "『C.H.A.O.S』",
    "kind": "Y",
    "rawResult": "'『C.H.A.O.S』','Y',1,1,"
  },
  {
    "id": "recipe_367",
    "group": "hidden",
    "ingredients": [
      "《黑熊语录》",
      "琉璃血"
    ],
    "name": "『C.H.A.O.S』",
    "kind": "Y",
    "rawResult": "'『C.H.A.O.S』','Y',1,1,"
  },
  {
    "id": "recipe_368",
    "group": "hidden",
    "ingredients": [
      "《董子语录》",
      "琉璃血"
    ],
    "name": "『C.H.A.O.S』",
    "kind": "Y",
    "rawResult": "'『C.H.A.O.S』','Y',1,1,"
  },
  {
    "id": "recipe_369",
    "group": "hidden",
    "ingredients": [
      "圣光啊!你有看到那个敌人吗！",
      "琉璃血"
    ],
    "name": "『C.H.A.O.S』",
    "kind": "Y",
    "rawResult": "'『C.H.A.O.S』','Y',1,1,"
  },
  {
    "id": "recipe_370",
    "group": "hidden",
    "ingredients": [
      "黑色碎片",
      "十字发卡"
    ],
    "name": "黑色发卡",
    "kind": "X",
    "rawResult": "'黑色发卡','X',1,1,"
  },
  {
    "id": "recipe_371",
    "group": "hidden",
    "ingredients": [
      "『T.E.R.R.A』",
      "『A.Q.U.A』",
      "『V.E.N.T.U.S』"
    ],
    "name": "『G.A.M.E.O.V.E.R』",
    "kind": "Y",
    "rawResult": "'『G.A.M.E.O.V.E.R』','Y',1,1,"
  },
  {
    "id": "recipe_372",
    "group": "hidden",
    "ingredients": [
      "提示纸条K",
      "提示纸条E"
    ],
    "name": "提示纸条Y",
    "kind": "WC",
    "rawResult": "'提示纸条Y','WC',1,1,'zd'"
  },
  {
    "id": "recipe_373",
    "group": "hidden",
    "ingredients": [
      "【红杀铁剑】",
      "电磁充能手套"
    ],
    "name": "【红杀铁剑·雷击】",
    "kind": "WK",
    "rawResult": "'【红杀铁剑·雷击】','WK',300,45,'ned'"
  }
];

export function findLegacyCraftMatches(itemNames: readonly string[], includeHidden = false): LegacyCraftRule[] {
  return LEGACY_CRAFT_RULES.filter(rule => {
    if(!includeHidden && rule.group === "hidden") return false;
    const remaining = [...itemNames];
    for (const material of rule.ingredients) {
      const index = remaining.indexOf(material);
      if (index === -1) return false;
      remaining.splice(index,1);
    }
    return true;
  });
}
