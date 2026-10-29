/** Generated legacy hook manifest fragment. Do not hand edit. */
export const LEGACY_HOOK_CHAINS_0 = {
  "get_var": [
    {
      "module": "input",
      "order": 0,
      "source": "include/modules/core/input/main.php",
      "line": 60,
      "parameters": [
        {
          "name": "varname",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "process_lock": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 8,
      "parameters": [
        {
          "name": "non_blocking",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "process_unlock": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 25,
      "parameters": []
    }
  ],
  "load_gameinfo": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 62,
      "parameters": []
    }
  ],
  "load_gameinfo_post_work_core": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 73,
      "parameters": []
    },
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 36,
      "parameters": []
    }
  ],
  "load_gameinfo_post_work_extra": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 85,
      "parameters": []
    },
    {
      "module": "noise",
      "order": 12,
      "source": "include/modules/base/noise/main.php",
      "line": 46,
      "parameters": []
    },
    {
      "module": "instance8",
      "order": 389,
      "source": "include/modules/extra/instance/instance8_proud/main.php",
      "line": 17,
      "parameters": []
    }
  ],
  "save_gameinfo": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 92,
      "parameters": [
        {
          "name": "ignore_room",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "gameinfo_audit": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 103,
      "parameters": []
    },
    {
      "module": "noise",
      "order": 12,
      "source": "include/modules/base/noise/main.php",
      "line": 56,
      "parameters": []
    }
  ],
  "save_gameinfo_prepare_work": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 120,
      "parameters": [
        {
          "name": "ginfo",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "ignore_room",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "noise",
      "order": 12,
      "source": "include/modules/base/noise/main.php",
      "line": 84,
      "parameters": [
        {
          "name": "ginfo",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "ignore_room",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "save_combatinfo": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 132,
      "parameters": []
    }
  ],
  "addnews": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 153,
      "parameters": [
        {
          "name": "t",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "n",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "a",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "b",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "c",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "d",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "e",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "tutorial",
      "order": 550,
      "source": "include/modules/extra/instance/instance7_tutorial/tutorial/main.php",
      "line": 989,
      "parameters": [
        {
          "name": "t",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "n",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "a",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "b",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "c",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "d",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "e",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "addchat": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 189,
      "parameters": [
        {
          "name": "ctype",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "msg",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "csender",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "creceiver",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "ctime",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "cpls",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "parse_chat": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 207,
      "parameters": [
        {
          "name": "chat",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "getchat": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 253,
      "parameters": [
        {
          "name": "last",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "team",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "chatpid",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "limit",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "systemputchat": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 277,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "type",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "msg",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "user_set_gamevars_list_init": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 315,
      "parameters": [
        {
          "name": "registered_gamevars",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "set_gametype",
      "order": 392,
      "source": "include/modules/extra/misc/set_gametype/main.php",
      "line": 17,
      "parameters": [
        {
          "name": "registered_gamevars",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "user_set_gamevars": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 321,
      "parameters": [
        {
          "name": "input_gamevars",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "user_set_gamevars_process": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 345,
      "parameters": [
        {
          "name": "gamevar_key",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "gamevar_val",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "valid_gamevars",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "set_gametype",
      "order": 392,
      "source": "include/modules/extra/misc/set_gametype/main.php",
      "line": 75,
      "parameters": [
        {
          "name": "gamevar_key",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "gamevar_val",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "valid_gamevars",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "user_display_gamevars_setting": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/global.php",
      "line": 353,
      "parameters": [
        {
          "name": "show",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "set_gametype",
      "order": 392,
      "source": "include/modules/extra/misc/set_gametype/main.php",
      "line": 48,
      "parameters": [
        {
          "name": "show",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "updategame": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 7,
      "parameters": []
    },
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 333,
      "parameters": []
    },
    {
      "module": "gameflow_base",
      "order": 4,
      "source": "include/modules/core/gameflow/gameflow_base/main.php",
      "line": 122,
      "parameters": []
    }
  ],
  "reset_game": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 12,
      "parameters": []
    },
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 47,
      "parameters": []
    },
    {
      "module": "gameflow_antiafk",
      "order": 6,
      "source": "include/modules/core/gameflow/gameflow_antiafk/main.php",
      "line": 7,
      "parameters": []
    },
    {
      "module": "noise",
      "order": 12,
      "source": "include/modules/base/noise/main.php",
      "line": 68,
      "parameters": []
    },
    {
      "module": "gameflow_combo",
      "order": 42,
      "source": "include/modules/core/gameflow/gameflow_combo/main.php",
      "line": 7,
      "parameters": []
    }
  ],
  "reset_gametype": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 71,
      "parameters": []
    },
    {
      "module": "set_gametype",
      "order": 392,
      "source": "include/modules/extra/misc/set_gametype/main.php",
      "line": 24,
      "parameters": []
    }
  ],
  "prepare_new_game": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 77,
      "parameters": []
    },
    {
      "module": "gtype1",
      "order": 451,
      "source": "include/modules/extra/instance/gtype1/main/main.php",
      "line": 52,
      "parameters": []
    }
  ],
  "rs_game": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 81,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 237,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 708,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "npc",
      "order": 16,
      "source": "include/modules/base/npc/main.php",
      "line": 115,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 322,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "itemshop",
      "order": 21,
      "source": "include/modules/base/itemshop/main.php",
      "line": 70,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "trap",
      "order": 33,
      "source": "include/modules/base/items/trap/main.php",
      "line": 13,
      "parameters": [
        {
          "name": "xmode",
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
      "line": 354,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "instance6",
      "order": 381,
      "source": "include/modules/extra/instance/instance6/main.php",
      "line": 34,
      "parameters": [
        {
          "name": "xmode",
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
      "line": 201,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "tutorial",
      "order": 550,
      "source": "include/modules/extra/instance/instance7_tutorial/tutorial/main.php",
      "line": 999,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "randrecipe",
      "order": 553,
      "source": "include/modules/extra/instance/instance10_rogue/randrecipe/main.php",
      "line": 12,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "instance3",
      "order": 615,
      "source": "include/modules/extra/instance/instance3_ascension/main.php",
      "line": 51,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "instance11",
      "order": 630,
      "source": "include/modules/extra/instance/instance11_observe/main.php",
      "line": 178,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "instance5",
      "order": 640,
      "source": "include/modules/extra/instance/instance5/main.php",
      "line": 36,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "instance10",
      "order": 726,
      "source": "include/modules/extra/instance/instance10_rogue/main.php",
      "line": 132,
      "parameters": [
        {
          "name": "xmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "rs_sttime": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 85,
      "parameters": []
    }
  ],
  "post_gameover_events": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 132,
      "parameters": []
    },
    {
      "module": "replay",
      "order": 9,
      "source": "include/modules/extra/misc/replay/main.php",
      "line": 72,
      "parameters": []
    },
    {
      "module": "elorating",
      "order": 18,
      "source": "include/modules/extra/misc/elorating/main.php",
      "line": 401,
      "parameters": []
    },
    {
      "module": "skill506",
      "order": 233,
      "source": "include/modules/extra/card/skills/skill506/main.php",
      "line": 67,
      "parameters": []
    },
    {
      "module": "item_slip",
      "order": 329,
      "source": "include/modules/extra/item_extra/item_slip/main.php",
      "line": 251,
      "parameters": []
    },
    {
      "module": "achievement_base",
      "order": 522,
      "source": "include/modules/extra/achievement/achievement_base/main.php",
      "line": 247,
      "parameters": []
    },
    {
      "module": "skill365",
      "order": 643,
      "source": "include/modules/extra/activities/aprilfool2018/skill365/main.php",
      "line": 153,
      "parameters": []
    }
  ],
  "post_winnercheck_events": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 137,
      "parameters": [
        {
          "name": "wn",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill330",
      "order": 70,
      "source": "include/modules/extra/activities/halloween2017/skill330/main.php",
      "line": 88,
      "parameters": [
        {
          "name": "wn",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill501",
      "order": 181,
      "source": "include/modules/extra/card/skills/skill501/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "wn",
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
      "line": 390,
      "parameters": [
        {
          "name": "winner",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "gameover": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 143,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "gmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "winname",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill305",
      "order": 66,
      "source": "include/modules/extra/achievement/skills/skill305/main.php",
      "line": 50,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "gmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "winname",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill306",
      "order": 67,
      "source": "include/modules/extra/achievement/skills/skill306/main.php",
      "line": 51,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "gmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "winname",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill331",
      "order": 330,
      "source": "include/modules/extra/activities/halloween2017/skill331/main.php",
      "line": 37,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "gmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "winname",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "instance3",
      "order": 615,
      "source": "include/modules/extra/instance/instance3_ascension/main.php",
      "line": 96,
      "parameters": [
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "gmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "winname",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "is_winner": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 379,
      "parameters": [
        {
          "name": "n",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "w",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_gameover_udata_update_fields": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 389,
      "parameters": []
    },
    {
      "module": "elorating",
      "order": 18,
      "source": "include/modules/extra/misc/elorating/main.php",
      "line": 391,
      "parameters": []
    }
  ],
  "routine": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 394,
      "parameters": []
    }
  ],
  "gameover_set_credits": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 406,
      "parameters": []
    },
    {
      "module": "item_uvo_extra",
      "order": 693,
      "source": "include/modules/extra/item_extra/item_uvo_extra/main.php",
      "line": 458,
      "parameters": []
    }
  ],
  "gameover_get_credit_up": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 430,
      "parameters": [
        {
          "name": "data",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "winner",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "winmode",
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
      "line": 103,
      "parameters": [
        {
          "name": "data",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "winner",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "winmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "gameover_check_money_got": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 467,
      "parameters": [
        {
          "name": "data",
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
      "line": 120,
      "parameters": [
        {
          "name": "data",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "gameover_get_gold_up": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/gamectl.php",
      "line": 473,
      "parameters": [
        {
          "name": "data",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "winner",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "winmode",
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
      "line": 93,
      "parameters": [
        {
          "name": "data",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "winner",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "winmode",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ]
} as const;
