/** Generated legacy hook manifest fragment. Do not hand edit. */
export const LEGACY_HOOK_CHAINS_4 = {
  "get_trap_final_damage_change": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 152,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "tritm",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "damage",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill479",
      "order": 88,
      "source": "include/modules/extra/card/skills/skill479/main.php",
      "line": 68,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "tritm",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "damage",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "post_traphit_events": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 159,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "tritm",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "damage",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill251",
      "order": 166,
      "source": "include/modules/extra/club/skills/skill251/main.php",
      "line": 109,
      "parameters": [
        {
          "name": "pa",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "sdata",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "tritm",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "damage",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill743",
      "order": 306,
      "source": "include/modules/extra/card/skills/skill743/main.php",
      "line": 68,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "tritm",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "damage",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill744",
      "order": 307,
      "source": "include/modules/extra/card/skills/skill744/main.php",
      "line": 36,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "tritm",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "damage",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill487",
      "order": 366,
      "source": "include/modules/extra/card/skills/skill487/main.php",
      "line": 144,
      "parameters": [
        {
          "name": "pa",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "sdata",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "tritm",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "damage",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "ex_dmg_att",
      "order": 425,
      "source": "include/modules/extra/attr/ex_dmg_att/main.php",
      "line": 352,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "tritm",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "damage",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "trap_deal_damage": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 164,
      "parameters": []
    },
    {
      "module": "skill250",
      "order": 163,
      "source": "include/modules/extra/club/skills/skill250/main.php",
      "line": 28,
      "parameters": []
    },
    {
      "module": "ex_attr_trap",
      "order": 478,
      "source": "include/modules/extra/attr/ex_attr_trap/main.php",
      "line": 67,
      "parameters": []
    }
  ],
  "trap_hit": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 226,
      "parameters": []
    },
    {
      "module": "skill1003",
      "order": 449,
      "source": "include/modules/extra/club/skills/skill1003/main.php",
      "line": 203,
      "parameters": []
    },
    {
      "module": "skill346",
      "order": 581,
      "source": "include/modules/extra/achievement/skills/skill346/main.php",
      "line": 48,
      "parameters": []
    },
    {
      "module": "skill348",
      "order": 583,
      "source": "include/modules/extra/achievement/skills/skill348/main.php",
      "line": 81,
      "parameters": []
    }
  ],
  "trap_survive": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 271,
      "parameters": []
    },
    {
      "module": "skill707",
      "order": 695,
      "source": "include/modules/extra/card/skills/skill707/main.php",
      "line": 50,
      "parameters": []
    }
  ],
  "calculate_trap_reuse_rate": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 276,
      "parameters": []
    },
    {
      "module": "skill22",
      "order": 79,
      "source": "include/modules/extra/club/skills/skill22/main.php",
      "line": 26,
      "parameters": []
    },
    {
      "module": "skill212",
      "order": 149,
      "source": "include/modules/extra/club/skills/skill212/main.php",
      "line": 84,
      "parameters": []
    },
    {
      "module": "skill19",
      "order": 331,
      "source": "include/modules/extra/club/skills/skill19/main.php",
      "line": 29,
      "parameters": []
    },
    {
      "module": "skill707",
      "order": 695,
      "source": "include/modules/extra/card/skills/skill707/main.php",
      "line": 36,
      "parameters": []
    }
  ],
  "trap_miss_reused": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 285,
      "parameters": []
    },
    {
      "module": "ex_attr_trap",
      "order": 478,
      "source": "include/modules/extra/attr/ex_attr_trap/main.php",
      "line": 87,
      "parameters": []
    }
  ],
  "trap_miss_broken": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 294,
      "parameters": []
    },
    {
      "module": "ex_attr_trap",
      "order": 478,
      "source": "include/modules/extra/attr/ex_attr_trap/main.php",
      "line": 79,
      "parameters": []
    }
  ],
  "trap_miss": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 304,
      "parameters": []
    }
  ],
  "trap": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 324,
      "parameters": []
    },
    {
      "module": "miracletrap",
      "order": 540,
      "source": "include/modules/base/items/miracletrap/main.php",
      "line": 21,
      "parameters": []
    }
  ],
  "trapget": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 341,
      "parameters": [
        {
          "name": "mi",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_traplist": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 369,
      "parameters": []
    },
    {
      "module": "skill247",
      "order": 159,
      "source": "include/modules/extra/club/skills/skill247/main.php",
      "line": 83,
      "parameters": []
    }
  ],
  "trapcheck": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 376,
      "parameters": []
    },
    {
      "module": "skill744",
      "order": 307,
      "source": "include/modules/extra/card/skills/skill744/main.php",
      "line": 60,
      "parameters": []
    },
    {
      "module": "miracletrap",
      "order": 540,
      "source": "include/modules/base/items/miracletrap/main.php",
      "line": 7,
      "parameters": []
    }
  ],
  "get_trap_itme_limit": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 451,
      "parameters": [
        {
          "name": "theitem",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "trap_use": [
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 473,
      "parameters": [
        {
          "name": "theitem",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill19",
      "order": 331,
      "source": "include/modules/extra/club/skills/skill19/main.php",
      "line": 35,
      "parameters": [
        {
          "name": "theitem",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_itemmix_sync_filename": [
    {
      "module": "itemmix_sync",
      "order": 34,
      "source": "include/modules/base/itemmix/itemmix_sync/main.php",
      "line": 19,
      "parameters": []
    }
  ],
  "itemmix_prepare_sync": [
    {
      "module": "itemmix_sync",
      "order": 34,
      "source": "include/modules/base/itemmix/itemmix_sync/main.php",
      "line": 25,
      "parameters": []
    }
  ],
  "itemmix_star_culc_sync": [
    {
      "module": "itemmix_sync",
      "order": 34,
      "source": "include/modules/base/itemmix/itemmix_sync/main.php",
      "line": 38,
      "parameters": [
        {
          "name": "itmn",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "itemmix_get_star": [
    {
      "module": "itemmix_sync",
      "order": 34,
      "source": "include/modules/base/itemmix/itemmix_sync/main.php",
      "line": 50,
      "parameters": [
        {
          "name": "z",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "itemmix_sync_check": [
    {
      "module": "itemmix_sync",
      "order": 34,
      "source": "include/modules/base/itemmix/itemmix_sync/main.php",
      "line": 59,
      "parameters": [
        {
          "name": "mlist",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "uee_extra_get_hack_num": [
    {
      "module": "item_uee_extra",
      "order": 35,
      "source": "include/modules/extra/item_extra/item_uee_extra/main.php",
      "line": 28,
      "parameters": []
    },
    {
      "module": "instance10",
      "order": 726,
      "source": "include/modules/extra/instance/instance10_rogue/main.php",
      "line": 346,
      "parameters": []
    }
  ],
  "itemuse_uee_extra_reset": [
    {
      "module": "item_uee_extra",
      "order": 35,
      "source": "include/modules/extra/item_extra/item_uee_extra/main.php",
      "line": 96,
      "parameters": []
    }
  ],
  "itemuse_uee_extra": [
    {
      "module": "item_uee_extra",
      "order": 35,
      "source": "include/modules/extra/item_extra/item_uee_extra/main.php",
      "line": 114,
      "parameters": [
        {
          "name": "pos",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "findenemy": [
    {
      "module": "enemy",
      "order": 36,
      "source": "include/modules/base/enemy/main.php",
      "line": 9,
      "parameters": [
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill262",
      "order": 226,
      "source": "include/modules/extra/club/skills/skill262/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "wep_b",
      "order": 417,
      "source": "include/modules/base/weapon/wep_b/main.php",
      "line": 308,
      "parameters": [
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill568",
      "order": 435,
      "source": "include/modules/extra/card/skills/skill568/main.php",
      "line": 24,
      "parameters": [
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_battlecmd_filename": [
    {
      "module": "enemy",
      "order": 36,
      "source": "include/modules/base/enemy/main.php",
      "line": 28,
      "parameters": []
    },
    {
      "module": "tutorial",
      "order": 550,
      "source": "include/modules/extra/instance/instance7_tutorial/tutorial/main.php",
      "line": 679,
      "parameters": []
    }
  ],
  "calculate_active_obbs": [
    {
      "module": "enemy",
      "order": 36,
      "source": "include/modules/base/enemy/main.php",
      "line": 34,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill405",
      "order": 199,
      "source": "include/modules/extra/card/skills/skill405/main.php",
      "line": 53,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill560",
      "order": 248,
      "source": "include/modules/extra/card/skills/skill560/main.php",
      "line": 170,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "pose",
      "order": 362,
      "source": "include/modules/base/pose/main.php",
      "line": 102,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "weather",
      "order": 376,
      "source": "include/modules/base/weather/main.php",
      "line": 45,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "npc_action",
      "order": 398,
      "source": "include/modules/extra/npc_action/main.php",
      "line": 559,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "searchmemory",
      "order": 650,
      "source": "include/modules/extra/searchmemory/main.php",
      "line": 678,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill509",
      "order": 732,
      "source": "include/modules/extra/card/skills/skill509/main.php",
      "line": 49,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "calculate_active_obbs_multiplier": [
    {
      "module": "enemy",
      "order": 36,
      "source": "include/modules/base/enemy/main.php",
      "line": 45,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill211",
      "order": 148,
      "source": "include/modules/extra/club/skills/skill211/main.php",
      "line": 88,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill240",
      "order": 157,
      "source": "include/modules/extra/club/skills/skill240/main.php",
      "line": 36,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill84",
      "order": 238,
      "source": "include/modules/extra/club/skills/skill84/main.php",
      "line": 52,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill719",
      "order": 290,
      "source": "include/modules/extra/card/skills/skill719/main.php",
      "line": 76,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill95",
      "order": 296,
      "source": "include/modules/extra/club/skills/skill95/main.php",
      "line": 61,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill7",
      "order": 316,
      "source": "include/modules/extra/attr/skills/skill7/main.php",
      "line": 95,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill8",
      "order": 317,
      "source": "include/modules/extra/attr/skills/skill8/main.php",
      "line": 73,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill9",
      "order": 318,
      "source": "include/modules/extra/attr/skills/skill9/main.php",
      "line": 51,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill502",
      "order": 378,
      "source": "include/modules/extra/card/skills/skill502/main.php",
      "line": 50,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill42",
      "order": 382,
      "source": "include/modules/extra/club/skills/skill42/main.php",
      "line": 77,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill270",
      "order": 386,
      "source": "include/modules/extra/club/skills/skill270/main.php",
      "line": 73,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill961",
      "order": 410,
      "source": "include/modules/extra/instance/instance10_rogue/skill961/main.php",
      "line": 172,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill96",
      "order": 440,
      "source": "include/modules/extra/club/skills/skill96/main.php",
      "line": 68,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill248",
      "order": 472,
      "source": "include/modules/extra/club/skills/skill248/main.php",
      "line": 61,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill50",
      "order": 475,
      "source": "include/modules/extra/club/skills/skill50/main.php",
      "line": 56,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill108",
      "order": 529,
      "source": "include/modules/extra/club/skills/skill108/main.php",
      "line": 69,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill604",
      "order": 707,
      "source": "include/modules/extra/club/skills/skill604/main.php",
      "line": 49,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill903",
      "order": 710,
      "source": "include/modules/extra/instance/instance3_ascension/skill903/main.php",
      "line": 74,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill964",
      "order": 715,
      "source": "include/modules/extra/instance/instance10_rogue/skill964/main.php",
      "line": 267,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "calculate_active_obbs_change": [
    {
      "module": "enemy",
      "order": 36,
      "source": "include/modules/base/enemy/main.php",
      "line": 51,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active_r",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill602",
      "order": 647,
      "source": "include/modules/extra/club/skills/skill602/main.php",
      "line": 89,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active_r",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill603",
      "order": 648,
      "source": "include/modules/extra/club/skills/skill603/main.php",
      "line": 47,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active_r",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_final_active_obbs": [
    {
      "module": "enemy",
      "order": 36,
      "source": "include/modules/base/enemy/main.php",
      "line": 57,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "check_enemy_meet_active": [
    {
      "module": "enemy",
      "order": 36,
      "source": "include/modules/base/enemy/main.php",
      "line": 80,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill95",
      "order": 296,
      "source": "include/modules/extra/club/skills/skill95/main.php",
      "line": 31,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill803",
      "order": 510,
      "source": "include/modules/extra/card/skills/skill803/main.php",
      "line": 79,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill580",
      "order": 521,
      "source": "include/modules/extra/card/skills/skill580/main.php",
      "line": 119,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill246",
      "order": 534,
      "source": "include/modules/extra/club/skills/skill246/main.php",
      "line": 119,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill500",
      "order": 672,
      "source": "include/modules/extra/card/skills/skill500/main.php",
      "line": 132,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill575",
      "order": 698,
      "source": "include/modules/extra/card/skills/skill575/main.php",
      "line": 190,
      "parameters": [
        {
          "name": "ldata",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "battle_wrapper": [
    {
      "module": "enemy",
      "order": 36,
      "source": "include/modules/base/enemy/main.php",
      "line": 109,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle_wrapper.php",
      "line": 56,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "duel": [
    {
      "module": "gameflow_duel",
      "order": 37,
      "source": "include/modules/core/gameflow/gameflow_duel/main.php",
      "line": 7,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "keyitm",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "is_gamestate_duel": [
    {
      "module": "gameflow_duel",
      "order": 37,
      "source": "include/modules/core/gameflow/gameflow_duel/main.php",
      "line": 29,
      "parameters": [
        {
          "name": "disp",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "get_itemmix_overlay_filename": [
    {
      "module": "itemmix_overlay",
      "order": 38,
      "source": "include/modules/base/itemmix/itemmix_overlay/main.php",
      "line": 16,
      "parameters": []
    }
  ],
  "itemmix_prepare_overlay": [
    {
      "module": "itemmix_overlay",
      "order": 38,
      "source": "include/modules/base/itemmix/itemmix_overlay/main.php",
      "line": 22,
      "parameters": []
    }
  ],
  "itemmix_star_culc_overlay": [
    {
      "module": "itemmix_overlay",
      "order": 38,
      "source": "include/modules/base/itemmix/itemmix_overlay/main.php",
      "line": 35,
      "parameters": [
        {
          "name": "itmn",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "check_valid_overlay_material": [
    {
      "module": "itemmix_overlay",
      "order": 38,
      "source": "include/modules/base/itemmix/itemmix_overlay/main.php",
      "line": 50,
      "parameters": [
        {
          "name": "itm",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "itmsk",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "star",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "itemmix_overlay_check": [
    {
      "module": "itemmix_overlay",
      "order": 38,
      "source": "include/modules/base/itemmix/itemmix_overlay/main.php",
      "line": 61,
      "parameters": [
        {
          "name": "mlist",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "teammate_checkable": [
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/main.php",
      "line": 31,
      "parameters": []
    }
  ],
  "team_available": [
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/main.php",
      "line": 38,
      "parameters": []
    }
  ],
  "findteam": [
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/main.php",
      "line": 58,
      "parameters": [
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "gameflow_combo",
      "order": 42,
      "source": "include/modules/core/gameflow/gameflow_combo/main.php",
      "line": 144,
      "parameters": [
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "senditem_check": [
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/main.php",
      "line": 78,
      "parameters": [
        {
          "name": "edata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "gameflow_combo",
      "order": 42,
      "source": "include/modules/core/gameflow/gameflow_combo/main.php",
      "line": 130,
      "parameters": [
        {
          "name": "edata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "ex_cursed",
      "order": 430,
      "source": "include/modules/extra/attr/ex_cursed/main.php",
      "line": 72,
      "parameters": [
        {
          "name": "edata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill429",
      "order": 528,
      "source": "include/modules/extra/instance/gtype1/skill429/main.php",
      "line": 94,
      "parameters": [
        {
          "name": "edata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "tutorial",
      "order": 550,
      "source": "include/modules/extra/instance/instance7_tutorial/tutorial/main.php",
      "line": 772,
      "parameters": [
        {
          "name": "edata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "senditem_check_teammate": [
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/main.php",
      "line": 97,
      "parameters": [
        {
          "name": "edata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "gtype1",
      "order": 451,
      "source": "include/modules/extra/instance/gtype1/main/main.php",
      "line": 180,
      "parameters": [
        {
          "name": "edata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "instance11",
      "order": 630,
      "source": "include/modules/extra/instance/instance11_observe/main.php",
      "line": 479,
      "parameters": [
        {
          "name": "edata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "senditem": [
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/main.php",
      "line": 107,
      "parameters": []
    }
  ],
  "senditem_before_log_event": [
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/main.php",
      "line": 181,
      "parameters": [
        {
          "name": "itmn",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "sendflag",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill1006",
      "order": 680,
      "source": "include/modules/extra/club/skills/skill1006/main.php",
      "line": 257,
      "parameters": [
        {
          "name": "itmn",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "sendflag",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "edata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "check_team_button_exist": [
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/main.php",
      "line": 235,
      "parameters": []
    },
    {
      "module": "gameflow_combo",
      "order": 42,
      "source": "include/modules/core/gameflow/gameflow_combo/main.php",
      "line": 202,
      "parameters": []
    }
  ],
  "teamcheck": [
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/team.command.php",
      "line": 5,
      "parameters": []
    }
  ],
  "teammake": [
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/team.command.php",
      "line": 30,
      "parameters": [
        {
          "name": "tID",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "tPass",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "gameflow_combo",
      "order": 42,
      "source": "include/modules/core/gameflow/gameflow_combo/main.php",
      "line": 160,
      "parameters": [
        {
          "name": "tID",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "tPass",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "teamjoin": [
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/team.command.php",
      "line": 77,
      "parameters": [
        {
          "name": "tID",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "tPass",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "gameflow_combo",
      "order": 42,
      "source": "include/modules/core/gameflow/gameflow_combo/main.php",
      "line": 173,
      "parameters": [
        {
          "name": "tID",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "tPass",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "teamquit": [
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/team.command.php",
      "line": 130,
      "parameters": []
    },
    {
      "module": "gameflow_combo",
      "order": 42,
      "source": "include/modules/core/gameflow/gameflow_combo/main.php",
      "line": 188,
      "parameters": []
    },
    {
      "module": "skill961",
      "order": 410,
      "source": "include/modules/extra/instance/instance10_rogue/skill961/main.php",
      "line": 56,
      "parameters": []
    }
  ],
  "battlelog_parser": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/main.php",
      "line": 8,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "battlelogstr",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "check_can_counter": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle.php",
      "line": 24,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "weapon",
      "order": 46,
      "source": "include/modules/base/weapon/weapon/main.php",
      "line": 710,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill560",
      "order": 248,
      "source": "include/modules/extra/card/skills/skill560/main.php",
      "line": 156,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill715",
      "order": 280,
      "source": "include/modules/extra/card/skills/skill715/main.php",
      "line": 87,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill586",
      "order": 281,
      "source": "include/modules/extra/card/skills/skill586/main.php",
      "line": 170,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "pose",
      "order": 362,
      "source": "include/modules/base/pose/main.php",
      "line": 74,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "tactic",
      "order": 374,
      "source": "include/modules/base/tactic/main.php",
      "line": 16,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "weather",
      "order": 376,
      "source": "include/modules/base/weather/main.php",
      "line": 610,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill803",
      "order": 510,
      "source": "include/modules/extra/card/skills/skill803/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill602",
      "order": 647,
      "source": "include/modules/extra/club/skills/skill602/main.php",
      "line": 102,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill603",
      "order": 648,
      "source": "include/modules/extra/club/skills/skill603/main.php",
      "line": 60,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill500",
      "order": 672,
      "source": "include/modules/extra/card/skills/skill500/main.php",
      "line": 155,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill36",
      "order": 685,
      "source": "include/modules/extra/club/skills/skill36/main.php",
      "line": 87,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "attack_wrapper": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle.php",
      "line": 30,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 321,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "assault_end": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle.php",
      "line": 36,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "counter_assault": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle.php",
      "line": 41,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill41",
      "order": 186,
      "source": "include/modules/extra/club/skills/skill41/main.php",
      "line": 101,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "player_cannot_counter": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle.php",
      "line": 55,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill586",
      "order": 281,
      "source": "include/modules/extra/card/skills/skill586/main.php",
      "line": 177,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill803",
      "order": 510,
      "source": "include/modules/extra/card/skills/skill803/main.php",
      "line": 38,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill500",
      "order": 672,
      "source": "include/modules/extra/card/skills/skill500/main.php",
      "line": 164,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "cannot_counter": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle.php",
      "line": 68,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "npcchat",
      "order": 47,
      "source": "include/modules/base/npcchat/main.php",
      "line": 192,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "assault_prepare": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle.php",
      "line": 74,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "wound",
      "order": 58,
      "source": "include/modules/base/wound/main.php",
      "line": 154,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "armor",
      "order": 320,
      "source": "include/modules/base/armor/main.php",
      "line": 177,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill81",
      "order": 731,
      "source": "include/modules/extra/club/skills/skill81/main.php",
      "line": 207,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "counter_assault_wrapper": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle.php",
      "line": 82,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill21",
      "order": 62,
      "source": "include/modules/extra/club/skills/skill21/main.php",
      "line": 111,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill81",
      "order": 731,
      "source": "include/modules/extra/club/skills/skill81/main.php",
      "line": 219,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "assault": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle.php",
      "line": 102,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill264",
      "order": 228,
      "source": "include/modules/extra/club/skills/skill264/main.php",
      "line": 38,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "assault_finish": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle.php",
      "line": 118,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "wound",
      "order": 58,
      "source": "include/modules/base/wound/main.php",
      "line": 163,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill461",
      "order": 165,
      "source": "include/modules/extra/card/skills/skill461/main.php",
      "line": 35,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "armor",
      "order": 320,
      "source": "include/modules/base/armor/main.php",
      "line": 184,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill803",
      "order": 510,
      "source": "include/modules/extra/card/skills/skill803/main.php",
      "line": 70,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill602",
      "order": 647,
      "source": "include/modules/extra/club/skills/skill602/main.php",
      "line": 42,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "save_enemy_battlelog": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle_wrapper.php",
      "line": 10,
      "parameters": [
        {
          "name": "pl",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "send_battle_msg": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle_wrapper.php",
      "line": 23,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill704",
      "order": 271,
      "source": "include/modules/extra/card/skills/skill704/main.php",
      "line": 35,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "battle_prepare": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle_wrapper.php",
      "line": 34,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "npcchat",
      "order": 47,
      "source": "include/modules/base/npcchat/main.php",
      "line": 163,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill41",
      "order": 186,
      "source": "include/modules/extra/club/skills/skill41/main.php",
      "line": 64,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill703",
      "order": 272,
      "source": "include/modules/extra/card/skills/skill703/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill42",
      "order": 382,
      "source": "include/modules/extra/club/skills/skill42/main.php",
      "line": 126,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "battle_finish": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle_wrapper.php",
      "line": 43,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill452",
      "order": 92,
      "source": "include/modules/extra/card/skills/skill452/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill487",
      "order": 366,
      "source": "include/modules/extra/card/skills/skill487/main.php",
      "line": 130,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill723",
      "order": 370,
      "source": "include/modules/extra/card/skills/skill723/main.php",
      "line": 36,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill42",
      "order": 382,
      "source": "include/modules/extra/club/skills/skill42/main.php",
      "line": 143,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill481",
      "order": 668,
      "source": "include/modules/extra/card/skills/skill481/main.php",
      "line": 42,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "battle": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle_wrapper.php",
      "line": 48,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_battleresult_filename": [
    {
      "module": "battle",
      "order": 40,
      "source": "include/modules/base/battle/battle_wrapper.php",
      "line": 132,
      "parameters": []
    },
    {
      "module": "tutorial",
      "order": 550,
      "source": "include/modules/extra/instance/instance7_tutorial/tutorial/main.php",
      "line": 689,
      "parameters": []
    }
  ],
  "divining": [
    {
      "module": "item_misc",
      "order": 41,
      "source": "include/modules/base/items/item_misc/main.php",
      "line": 434,
      "parameters": []
    }
  ],
  "divining1": [
    {
      "module": "item_misc",
      "order": 41,
      "source": "include/modules/base/items/item_misc/main.php",
      "line": 463,
      "parameters": [
        {
          "name": "u",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "divining2": [
    {
      "module": "item_misc",
      "order": 41,
      "source": "include/modules/base/items/item_misc/main.php",
      "line": 480,
      "parameters": [
        {
          "name": "u",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "deathnote": [
    {
      "module": "item_misc",
      "order": 41,
      "source": "include/modules/base/items/item_misc/main.php",
      "line": 499,
      "parameters": [
        {
          "name": "itmd",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "dnname",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "dndeath",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "dngender",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "dnicon",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "deathnote_process": [
    {
      "module": "item_misc",
      "order": 41,
      "source": "include/modules/base/items/item_misc/main.php",
      "line": 538,
      "parameters": [
        {
          "name": "dnname",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "dndeath",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "dngender",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "dnicon",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "gtype1",
      "order": 451,
      "source": "include/modules/extra/instance/gtype1/main/main.php",
      "line": 344,
      "parameters": [
        {
          "name": "dnname",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "dndeath",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "dngender",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "dnicon",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "deathnote_process_core": [
    {
      "module": "item_misc",
      "order": 41,
      "source": "include/modules/base/items/item_misc/main.php",
      "line": 559,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "dndeath",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill1003",
      "order": 449,
      "source": "include/modules/extra/club/skills/skill1003/main.php",
      "line": 131,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "dndeath",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "checkcombo": [
    {
      "module": "gameflow_combo",
      "order": 42,
      "source": "include/modules/core/gameflow/gameflow_combo/main.php",
      "line": 27,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "instance0",
      "order": 45,
      "source": "include/modules/extra/instance/instance0/main.php",
      "line": 7,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "instance6",
      "order": 381,
      "source": "include/modules/extra/instance/instance6/main.php",
      "line": 17,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "gtype1",
      "order": 451,
      "source": "include/modules/extra/instance/gtype1/main/main.php",
      "line": 192,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "tutorial",
      "order": 550,
      "source": "include/modules/extra/instance/instance7_tutorial/tutorial/main.php",
      "line": 1035,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "instance3",
      "order": 615,
      "source": "include/modules/extra/instance/instance3_ascension/main.php",
      "line": 41,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "instance11",
      "order": 630,
      "source": "include/modules/extra/instance/instance11_observe/main.php",
      "line": 170,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "instance5",
      "order": 640,
      "source": "include/modules/extra/instance/instance5/main.php",
      "line": 25,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "instance10",
      "order": 726,
      "source": "include/modules/extra/instance/instance10_rogue/main.php",
      "line": 124,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "calculate_combonum": [
    {
      "module": "gameflow_combo",
      "order": 42,
      "source": "include/modules/core/gameflow/gameflow_combo/main.php",
      "line": 58,
      "parameters": [
        {
          "name": "reset",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "get_advteam_html": [
    {
      "module": "advteam",
      "order": 43,
      "source": "include/modules/extra/misc/advteam/main.php",
      "line": 7,
      "parameters": []
    }
  ],
  "get_final_dmg_base": [
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 6,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill466",
      "order": 221,
      "source": "include/modules/extra/card/skills/skill466/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill473",
      "order": 225,
      "source": "include/modules/extra/card/skills/skill473/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill263",
      "order": 227,
      "source": "include/modules/extra/club/skills/skill263/main.php",
      "line": 43,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill85",
      "order": 291,
      "source": "include/modules/extra/club/skills/skill85/main.php",
      "line": 103,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill273",
      "order": 312,
      "source": "include/modules/extra/club/skills/skill273/main.php",
      "line": 82,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill274",
      "order": 347,
      "source": "include/modules/extra/club/skills/skill274/main.php",
      "line": 139,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill30",
      "order": 420,
      "source": "include/modules/extra/club/skills/skill30/main.php",
      "line": 92,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill82",
      "order": 474,
      "source": "include/modules/extra/club/skills/skill82/main.php",
      "line": 84,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill75",
      "order": 493,
      "source": "include/modules/extra/club/skills/skill75/main.php",
      "line": 81,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill232",
      "order": 511,
      "source": "include/modules/extra/club/skills/skill232/main.php",
      "line": 97,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill38",
      "order": 686,
      "source": "include/modules/extra/club/skills/skill38/main.php",
      "line": 89,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_final_dmg_multiplier": [
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 14,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill477",
      "order": 87,
      "source": "include/modules/extra/card/skills/skill477/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill485",
      "order": 96,
      "source": "include/modules/extra/card/skills/skill485/main.php",
      "line": 32,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill520",
      "order": 103,
      "source": "include/modules/extra/card/skills/skill520/main.php",
      "line": 32,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill453",
      "order": 106,
      "source": "include/modules/extra/card/skills/skill453/main.php",
      "line": 42,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill456",
      "order": 108,
      "source": "include/modules/extra/card/skills/skill456/main.php",
      "line": 42,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill462",
      "order": 168,
      "source": "include/modules/extra/card/skills/skill462/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill83",
      "order": 182,
      "source": "include/modules/extra/club/skills/skill83/main.php",
      "line": 47,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill62",
      "order": 191,
      "source": "include/modules/extra/club/skills/skill62/main.php",
      "line": 62,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill63",
      "order": 192,
      "source": "include/modules/extra/club/skills/skill63/main.php",
      "line": 81,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill74",
      "order": 195,
      "source": "include/modules/extra/club/skills/skill74/main.php",
      "line": 80,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill405",
      "order": 199,
      "source": "include/modules/extra/card/skills/skill405/main.php",
      "line": 29,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill406",
      "order": 200,
      "source": "include/modules/extra/card/skills/skill406/main.php",
      "line": 40,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill408",
      "order": 207,
      "source": "include/modules/extra/card/skills/skill408/main.php",
      "line": 37,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill409",
      "order": 208,
      "source": "include/modules/extra/card/skills/skill409/main.php",
      "line": 29,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill416",
      "order": 211,
      "source": "include/modules/extra/card/skills/skill416/main.php",
      "line": 31,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill419",
      "order": 212,
      "source": "include/modules/extra/card/skills/skill419/main.php",
      "line": 32,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill438",
      "order": 215,
      "source": "include/modules/extra/card/skills/skill438/main.php",
      "line": 37,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill439",
      "order": 216,
      "source": "include/modules/extra/card/skills/skill439/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill449",
      "order": 218,
      "source": "include/modules/extra/card/skills/skill449/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill450",
      "order": 219,
      "source": "include/modules/extra/card/skills/skill450/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill470",
      "order": 223,
      "source": "include/modules/extra/card/skills/skill470/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill476",
      "order": 229,
      "source": "include/modules/extra/instance/gtype3/skill476/main.php",
      "line": 29,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill515",
      "order": 234,
      "source": "include/modules/extra/card/skills/skill515/main.php",
      "line": 35,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill590",
      "order": 265,
      "source": "include/modules/extra/card/skills/skill590/main.php",
      "line": 40,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill706",
      "order": 273,
      "source": "include/modules/extra/card/skills/skill706/main.php",
      "line": 52,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill902",
      "order": 282,
      "source": "include/modules/extra/instance/instance3_ascension/skill902/main.php",
      "line": 29,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill904",
      "order": 284,
      "source": "include/modules/extra/instance/instance3_ascension/skill904/main.php",
      "line": 39,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill719",
      "order": 290,
      "source": "include/modules/extra/card/skills/skill719/main.php",
      "line": 162,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill95",
      "order": 296,
      "source": "include/modules/extra/club/skills/skill95/main.php",
      "line": 39,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill223",
      "order": 324,
      "source": "include/modules/extra/club/skills/skill223/main.php",
      "line": 82,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill202",
      "order": 359,
      "source": "include/modules/extra/club/skills/skill202/main.php",
      "line": 135,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill749",
      "order": 402,
      "source": "include/modules/extra/card/skills/skill749/main.php",
      "line": 46,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill96",
      "order": 440,
      "source": "include/modules/extra/club/skills/skill96/main.php",
      "line": 34,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill444",
      "order": 467,
      "source": "include/modules/extra/card/skills/skill444/main.php",
      "line": 29,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill218",
      "order": 482,
      "source": "include/modules/extra/club/skills/skill218/main.php",
      "line": 84,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill210",
      "order": 495,
      "source": "include/modules/extra/club/skills/skill210/main.php",
      "line": 92,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill558",
      "order": 513,
      "source": "include/modules/extra/card/skills/skill558/main.php",
      "line": 46,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill727",
      "order": 519,
      "source": "include/modules/extra/card/skills/skill727/main.php",
      "line": 97,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill108",
      "order": 529,
      "source": "include/modules/extra/club/skills/skill108/main.php",
      "line": 88,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill208",
      "order": 546,
      "source": "include/modules/extra/club/skills/skill208/main.php",
      "line": 101,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill228",
      "order": 662,
      "source": "include/modules/extra/club/skills/skill228/main.php",
      "line": 94,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill964",
      "order": 715,
      "source": "include/modules/extra/instance/instance10_rogue/skill964/main.php",
      "line": 230,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill507",
      "order": 724,
      "source": "include/modules/extra/card/skills/skill507/main.php",
      "line": 109,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill748",
      "order": 727,
      "source": "include/modules/extra/card/skills/skill748/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "apply_total_damage_modifier_invincible": [
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 22,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill446",
      "order": 104,
      "source": "include/modules/extra/card/skills/skill446/main.php",
      "line": 50,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill455",
      "order": 107,
      "source": "include/modules/extra/card/skills/skill455/main.php",
      "line": 43,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill1002",
      "order": 111,
      "source": "include/modules/extra/instance/skill1002/main.php",
      "line": 57,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill499",
      "order": 112,
      "source": "include/modules/extra/card/skills/skill499/main.php",
      "line": 38,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill251",
      "order": 166,
      "source": "include/modules/extra/club/skills/skill251/main.php",
      "line": 45,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill423",
      "order": 213,
      "source": "include/modules/extra/card/skills/skill423/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill505",
      "order": 713,
      "source": "include/modules/extra/card/skills/skill505/main.php",
      "line": 106,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "apply_total_damage_modifier_special": [
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "apply_total_damage_modifier_special_set_sequence": [
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 44,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill479",
      "order": 88,
      "source": "include/modules/extra/card/skills/skill479/main.php",
      "line": 40,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill415",
      "order": 209,
      "source": "include/modules/extra/card/skills/skill415/main.php",
      "line": 31,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill412",
      "order": 210,
      "source": "include/modules/extra/card/skills/skill412/main.php",
      "line": 56,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill516",
      "order": 235,
      "source": "include/modules/extra/card/skills/skill516/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill244",
      "order": 634,
      "source": "include/modules/extra/club/skills/skill244/main.php",
      "line": 101,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "apply_total_damage_modifier_special_check": [
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 52,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "akey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill479",
      "order": 88,
      "source": "include/modules/extra/card/skills/skill479/main.php",
      "line": 50,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "akey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill415",
      "order": 209,
      "source": "include/modules/extra/card/skills/skill415/main.php",
      "line": 41,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "akey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill412",
      "order": 210,
      "source": "include/modules/extra/card/skills/skill412/main.php",
      "line": 66,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "akey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill516",
      "order": 235,
      "source": "include/modules/extra/card/skills/skill516/main.php",
      "line": 40,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "akey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill244",
      "order": 634,
      "source": "include/modules/extra/club/skills/skill244/main.php",
      "line": 111,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "akey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "apply_total_damage_modifier_special_core": [
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 59,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "akey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill479",
      "order": 88,
      "source": "include/modules/extra/card/skills/skill479/main.php",
      "line": 59,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "akey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill415",
      "order": 209,
      "source": "include/modules/extra/card/skills/skill415/main.php",
      "line": 50,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "akey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill412",
      "order": 210,
      "source": "include/modules/extra/card/skills/skill412/main.php",
      "line": 75,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "akey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill516",
      "order": 235,
      "source": "include/modules/extra/card/skills/skill516/main.php",
      "line": 49,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "akey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill244",
      "order": 634,
      "source": "include/modules/extra/club/skills/skill244/main.php",
      "line": 120,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "akey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "apply_total_damage_modifier_limit": [
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 66,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill494",
      "order": 179,
      "source": "include/modules/extra/instance/gtype1/skill494/main.php",
      "line": 66,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "ex_hp_def",
      "order": 427,
      "source": "include/modules/extra/attr/ex_hp_def/main.php",
      "line": 68,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "apply_total_damage_modifier_insurance": [
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 84,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill268",
      "order": 175,
      "source": "include/modules/extra/club/skills/skill268/main.php",
      "line": 31,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill471",
      "order": 224,
      "source": "include/modules/extra/card/skills/skill471/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "apply_total_damage_modifier_seckill": [
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 90,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "npcchat",
      "order": 47,
      "source": "include/modules/base/npcchat/main.php",
      "line": 221,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill447",
      "order": 105,
      "source": "include/modules/extra/card/skills/skill447/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill402",
      "order": 202,
      "source": "include/modules/extra/card/skills/skill402/main.php",
      "line": 41,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill541",
      "order": 397,
      "source": "include/modules/extra/card/skills/skill541/main.php",
      "line": 43,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "ex_seckill",
      "order": 429,
      "source": "include/modules/extra/attr/ex_seckill/main.php",
      "line": 26,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill206",
      "order": 539,
      "source": "include/modules/extra/club/skills/skill206/main.php",
      "line": 44,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill508",
      "order": 635,
      "source": "include/modules/extra/card/skills/skill508/main.php",
      "line": 29,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "apply_damage": [
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 95,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill251",
      "order": 166,
      "source": "include/modules/extra/club/skills/skill251/main.php",
      "line": 90,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill412",
      "order": 210,
      "source": "include/modules/extra/card/skills/skill412/main.php",
      "line": 105,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill469",
      "order": 222,
      "source": "include/modules/extra/card/skills/skill469/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill516",
      "order": 235,
      "source": "include/modules/extra/card/skills/skill516/main.php",
      "line": 66,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill365",
      "order": 643,
      "source": "include/modules/extra/activities/aprilfool2018/skill365/main.php",
      "line": 99,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill507",
      "order": 724,
      "source": "include/modules/extra/card/skills/skill507/main.php",
      "line": 47,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "player_damaged_enemy": [
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 102,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill268",
      "order": 175,
      "source": "include/modules/extra/club/skills/skill268/main.php",
      "line": 50,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "ex_hp_def",
      "order": 427,
      "source": "include/modules/extra/attr/ex_hp_def/main.php",
      "line": 75,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill1003",
      "order": 449,
      "source": "include/modules/extra/club/skills/skill1003/main.php",
      "line": 152,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "tutorial",
      "order": 550,
      "source": "include/modules/extra/instance/instance7_tutorial/tutorial/main.php",
      "line": 787,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill379",
      "order": 633,
      "source": "include/modules/extra/achievement/skills/skill379/main.php",
      "line": 78,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "player_attack_enemy": [
    {
      "module": "attack",
      "order": 44,
      "source": "include/modules/base/attack/attack_wrapper.php",
      "line": 181,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill560",
      "order": 248,
      "source": "include/modules/extra/card/skills/skill560/main.php",
      "line": 163,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pd",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "active",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ]
} as const;
