/** Generated from captured Baota sync/overlay configs. Do not hand edit. */
import type { LegacyItem } from "../legacy/item";
export interface LegacySyncRecipe { id: string; result: LegacyItem; star: number; requirements: readonly string[]; }
export interface LegacyOverlayRecipe { id: string; result: LegacyItem; star: number; materialCount: number; }
export const LEGACY_SPECIAL_RECIPE_SOURCE_SHA256 = {
  "sync": "5d03f89fb8cb30dba8de3c65e549cd4ec7270e4d8a1df83d415e4492c48ecb3b",
  "overlay": "b7118bdd6c9e8805a8a1bc1bc9c0b561710010c856e17fdfc52720b7aeec9c40"
} as const;
export const LEGACY_SYNC_RECIPES: readonly LegacySyncRecipe[] = [
  {
    "id": "sync_001",
    "result": {
      "itm": "方程式同调士 ★2",
      "itmk": "WC02",
      "itme": 20,
      "itms": "∞",
      "itmsk": "s^001"
    },
    "star": 2,
    "requirements": []
  },
  {
    "id": "sync_002",
    "result": {
      "itm": "武器手套 ★4 -仮",
      "itmk": "DA04",
      "itme": 100,
      "itms": 120,
      "itmsk": ""
    },
    "star": 4,
    "requirements": []
  },
  {
    "id": "sync_003",
    "result": {
      "itm": "科技属 超图书馆员 ★5",
      "itmk": "HB05",
      "itme": 50,
      "itms": "∞",
      "itmsk": "^001"
    },
    "star": 5,
    "requirements": []
  },
  {
    "id": "sync_004",
    "result": {
      "itm": "正义盟军 灾亡虫 ★5",
      "itmk": "WC05",
      "itme": 60,
      "itms": 40,
      "itmsk": "pd^001"
    },
    "star": 5,
    "requirements": []
  },
  {
    "id": "sync_005",
    "result": {
      "itm": "甲化铠骨骼 ★6 -仮",
      "itmk": "DB06",
      "itme": 100,
      "itms": 160,
      "itmsk": ""
    },
    "star": 6,
    "requirements": []
  },
  {
    "id": "sync_006",
    "result": {
      "itm": "黑蔷薇龙 ★7",
      "itmk": "WC07",
      "itme": 150,
      "itms": 70,
      "itmsk": "u^001"
    },
    "star": 7,
    "requirements": []
  },
  {
    "id": "sync_007",
    "result": {
      "itm": "动力工具龙 ★7",
      "itmk": "WC07",
      "itme": 130,
      "itms": "∞",
      "itmsk": "e^001"
    },
    "star": 7,
    "requirements": []
  },
  {
    "id": "sync_008",
    "result": {
      "itm": "机巧将军 无零 ★7 -仮",
      "itmk": "WC07",
      "itme": 180,
      "itms": "∞",
      "itmsk": "Z"
    },
    "star": 7,
    "requirements": []
  },
  {
    "id": "sync_009",
    "result": {
      "itm": "星尘龙 ★8",
      "itmk": "WC08",
      "itme": 100,
      "itms": 100,
      "itmsk": "tMc^001"
    },
    "star": 8,
    "requirements": []
  },
  {
    "id": "sync_010",
    "result": {
      "itm": "红莲魔龙 ★8 -仮",
      "itmk": "WC08",
      "itme": 90,
      "itms": "∞",
      "itmsk": "u"
    },
    "star": 8,
    "requirements": []
  },
  {
    "id": "sync_011",
    "result": {
      "itm": "生命激流龙 ★8-仮",
      "itmk": "WC08",
      "itme": 160,
      "itms": "∞",
      "itmsk": "H"
    },
    "star": 8,
    "requirements": [
      "动力工具龙 ★7"
    ]
  },
  {
    "id": "sync_012",
    "result": {
      "itm": "正义盟军 光明守望者 ★8 -仮",
      "itmk": "WC08",
      "itme": 101,
      "itms": "∞",
      "itmsk": "Z"
    },
    "star": 8,
    "requirements": []
  },
  {
    "id": "sync_013",
    "result": {
      "itm": "阿尔法大日 ★9",
      "itmk": "WC09",
      "itme": 220,
      "itms": 33,
      "itmsk": "ebj^001"
    },
    "star": 9,
    "requirements": []
  },
  {
    "id": "sync_014",
    "result": {
      "itm": "冰结界之龙 三叉龙 ★9",
      "itmk": "WC09",
      "itme": 135,
      "itms": 66,
      "itmsk": "r^001"
    },
    "star": 9,
    "requirements": []
  },
  {
    "id": "sync_015",
    "result": {
      "itm": "救世星龙 ★10-仮",
      "itmk": "WC10",
      "itme": 100,
      "itms": "∞",
      "itmsk": "cZ"
    },
    "star": 10,
    "requirements": [
      "救世龙 ★1",
      "星尘龙 ★8"
    ]
  },
  {
    "id": "sync_016",
    "result": {
      "itm": "救世魔龙 ★10-仮",
      "itmk": "WC10",
      "itme": 100,
      "itms": "∞",
      "itmsk": "cu"
    },
    "star": 10,
    "requirements": [
      "救世龙 ★1",
      "红莲魔龙 ★8"
    ]
  },
  {
    "id": "sync_017",
    "result": {
      "itm": "流星龙 ★10 -仮",
      "itmk": "WC10",
      "itme": 120,
      "itms": "∞",
      "itmsk": "c"
    },
    "star": 10,
    "requirements": []
  },
  {
    "id": "sync_018",
    "result": {
      "itm": "『真红莲超新星龙』 ★12 -仮",
      "itmk": "WC12",
      "itme": 150,
      "itms": "∞",
      "itmsk": "udZ"
    },
    "star": 12,
    "requirements": [
      "红莲魔龙 ★8",
      "t3"
    ]
  },
  {
    "id": "sync_019",
    "result": {
      "itm": "『流天类星龙』 ★12(OCG)-仮",
      "itmk": "WC12",
      "itme": 120,
      "itms": "∞",
      "itmsk": "crZ"
    },
    "star": 12,
    "requirements": [
      "st",
      "sm2"
    ]
  },
  {
    "id": "sync_020",
    "result": {
      "itm": "『流天类星龙』 ★12 -仮",
      "itmk": "WC12",
      "itme": 160,
      "itms": "∞",
      "itmsk": "crZ"
    },
    "star": 12,
    "requirements": [
      "st",
      "sm4"
    ]
  }
];
export const LEGACY_OVERLAY_RECIPES: readonly LegacyOverlayRecipe[] = [
  {
    "id": "overlay_001",
    "result": {
      "itm": "抒情歌鸲-合唱小琉璃 ☆1 -仮",
      "itmk": "WC",
      "itme": 80,
      "itms": 40,
      "itmsk": "w"
    },
    "star": 1,
    "materialCount": 2
  },
  {
    "id": "overlay_002",
    "result": {
      "itm": "发条机雷 发条雷 ☆3",
      "itmk": "WD",
      "itme": 75,
      "itms": 30,
      "itmsk": "dn^xyz3"
    },
    "star": 3,
    "materialCount": 2
  },
  {
    "id": "overlay_003",
    "result": {
      "itm": "彼岸的旅人 但丁 ☆3",
      "itmk": "WC",
      "itme": 30,
      "itms": "∞",
      "itmsk": "u^xyz3"
    },
    "star": 3,
    "materialCount": 2
  },
  {
    "id": "overlay_004",
    "result": {
      "itm": "星圣 欧米伽星云 ☆4",
      "itmk": "WC",
      "itme": 240,
      "itms": "∞",
      "itmsk": "aMi^xyz4"
    },
    "star": 4,
    "materialCount": 2
  },
  {
    "id": "overlay_005",
    "result": {
      "itm": "机甲忍者 刃心 ☆4",
      "itmk": "WC",
      "itme": 130,
      "itms": "∞",
      "itmsk": "cr^xyz4"
    },
    "star": 4,
    "materialCount": 2
  },
  {
    "id": "overlay_006",
    "result": {
      "itm": "No39.希望皇 霍普 ☆4",
      "itmk": "WC",
      "itme": 250,
      "itms": "∞",
      "itmsk": "eA^xyz4"
    },
    "star": 4,
    "materialCount": 2
  },
  {
    "id": "overlay_007",
    "result": {
      "itm": "英豪冠军 英弓王",
      "itmk": "WB",
      "itme": 210,
      "itms": "∞",
      "itmsk": "d^xyz4"
    },
    "star": 4,
    "materialCount": 2
  },
  {
    "id": "overlay_008",
    "result": {
      "itm": "CNo.39 希望皇 霍普雷 ☆4",
      "itmk": "WC",
      "itme": 250,
      "itms": "∞",
      "itmsk": "ned^xyz4"
    },
    "star": 4,
    "materialCount": 3
  },
  {
    "id": "overlay_009",
    "result": {
      "itm": "英豪冠军 草雉剑王",
      "itmk": "WK",
      "itme": 150,
      "itms": 200,
      "itmsk": "nc^xyz4"
    },
    "star": 4,
    "materialCount": 3
  },
  {
    "id": "overlay_010",
    "result": {
      "itm": "No91.雷闪龙 ☆4",
      "itmk": "WC",
      "itme": 360,
      "itms": "∞",
      "itmsk": "Aar^xyz4"
    },
    "star": 4,
    "materialCount": 5
  },
  {
    "id": "overlay_011",
    "result": {
      "itm": "暗叛逆超量龙 ☆4",
      "itmk": "WC",
      "itme": 250,
      "itms": "∞",
      "itmsk": "j^xyz4"
    },
    "star": 4,
    "materialCount": 2
  },
  {
    "id": "overlay_012",
    "result": {
      "itm": "始祖守护者 提拉斯 ☆5 -仮",
      "itmk": "WC",
      "itme": 200,
      "itms": "∞",
      "itmsk": ""
    },
    "star": 5,
    "materialCount": 2
  },
  {
    "id": "overlay_013",
    "result": {
      "itm": "电子龙·新星 ☆5",
      "itmk": "WC",
      "itme": 210,
      "itms": "∞",
      "itmsk": "eNc^xyz5"
    },
    "star": 5,
    "materialCount": 2
  },
  {
    "id": "overlay_014",
    "result": {
      "itm": "星圣神龙 托勒密星团M7 ☆6",
      "itmk": "DFS",
      "itme": 270,
      "itms": "∞",
      "itmsk": "HNn^xyz6"
    },
    "star": 6,
    "materialCount": 2
  },
  {
    "id": "overlay_015",
    "result": {
      "itm": "幻兽机 哥萨克龙 ☆7",
      "itmk": "WG",
      "itme": 260,
      "itms": 22,
      "itmsk": "Ad^xyz7"
    },
    "star": 7,
    "materialCount": 2
  },
  {
    "id": "overlay_016",
    "result": {
      "itm": "No.7 幸运条纹人 ☆7",
      "itmk": "WC",
      "itme": 177,
      "itms": "∞",
      "itmsk": "rc^xyz7"
    },
    "star": 7,
    "materialCount": 3
  },
  {
    "id": "overlay_017",
    "result": {
      "itm": "宵星之机神 丁吉尔苏 ☆8 -仮",
      "itmk": "WC",
      "itme": 260,
      "itms": "∞",
      "itmsk": ""
    },
    "star": 8,
    "materialCount": 2
  },
  {
    "id": "overlay_018",
    "result": {
      "itm": "幻子力空母 进取神船号 ☆9",
      "itmk": "WC",
      "itme": 290,
      "itms": "∞",
      "itmsk": "eay^xyz9"
    },
    "star": 9,
    "materialCount": 2
  },
  {
    "id": "overlay_019",
    "result": {
      "itm": "超次元机器人 银河破坏王 ☆10",
      "itmk": "WC",
      "itme": 800,
      "itms": "∞",
      "itmsk": "rdcm^xyz10"
    },
    "star": 10,
    "materialCount": 3
  },
  {
    "id": "overlay_020",
    "result": {
      "itm": "超重型炮塔列车 古斯塔夫最大炮 ☆10",
      "itmk": "WG",
      "itme": 600,
      "itms": "∞",
      "itmsk": "Nnrd^xyz10"
    },
    "star": 10,
    "materialCount": 2
  }
];
