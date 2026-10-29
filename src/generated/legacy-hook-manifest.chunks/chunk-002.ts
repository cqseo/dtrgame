/** Generated legacy hook manifest fragment. Do not hand edit. */
export const LEGACY_HOOK_CHAINS_2 = {
  "load_news": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/news.php",
      "line": 147,
      "parameters": [
        {
          "name": "start",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "range",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "noday",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "rprefix",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "parse_news_prepare": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/news.php",
      "line": 179,
      "parameters": [
        {
          "name": "nid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "news",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "hour",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "min",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "sec",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "a",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "b",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "c",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "d",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "e",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "getnews": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/news.php",
      "line": 192,
      "parameters": [
        {
          "name": "start",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "range",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "room_prefix",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "news_observe",
      "order": 527,
      "source": "include/modules/extra/misc/news_observe/main.php",
      "line": 137,
      "parameters": [
        {
          "name": "start",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "range",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "room_prefix",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "get_valid_disp_user_info": [
    {
      "module": "sys",
      "order": 1,
      "source": "include/modules/core/sys/news.php",
      "line": 212,
      "parameters": [
        {
          "name": "pdata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill533",
      "order": 63,
      "source": "include/modules/extra/card/skills/skill533/main.php",
      "line": 29,
      "parameters": [
        {
          "name": "pdata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_plsnum": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 15,
      "parameters": [
        {
          "name": "use_config",
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
      "line": 56,
      "parameters": [
        {
          "name": "use_config",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "get_all_plsno": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 24,
      "parameters": [
        {
          "name": "use_config",
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
      "line": 63,
      "parameters": [
        {
          "name": "use_config",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "check_pls": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 56,
      "parameters": [
        {
          "name": "plsno",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "para",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "is_plsno_available": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 67,
      "parameters": [
        {
          "name": "plsno",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_area_wavenum": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 74,
      "parameters": []
    },
    {
      "module": "instance10",
      "order": 726,
      "source": "include/modules/extra/instance/instance10_rogue/main.php",
      "line": 157,
      "parameters": []
    }
  ],
  "get_current_area": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 82,
      "parameters": [
        {
          "name": "wave",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "get_current_not_area": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 90,
      "parameters": [
        {
          "name": "wave",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "check_in_forbidden_area": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 99,
      "parameters": [
        {
          "name": "pno",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "wave",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "check_can_enter": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 106,
      "parameters": [
        {
          "name": "pno",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill724",
      "order": 294,
      "source": "include/modules/extra/card/skills/skill724/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pno",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "init_areatiming": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 112,
      "parameters": []
    },
    {
      "module": "tutorial",
      "order": 550,
      "source": "include/modules/extra/instance/instance7_tutorial/tutorial/main.php",
      "line": 1020,
      "parameters": []
    },
    {
      "module": "instance11",
      "order": 630,
      "source": "include/modules/extra/instance/instance11_observe/main.php",
      "line": 196,
      "parameters": []
    }
  ],
  "get_area_interval": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 132,
      "parameters": []
    }
  ],
  "get_safe_plslist": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 147,
      "parameters": [
        {
          "name": "no_dangerous_zone",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "type",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "npc",
      "order": 16,
      "source": "include/modules/base/npc/main.php",
      "line": 64,
      "parameters": [
        {
          "name": "no_dangerous_zone",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "type",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "get_arealist_nextadd": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 159,
      "parameters": [
        {
          "name": "wave",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "addarea_pc_process": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 166,
      "parameters": [
        {
          "name": "atime",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 547,
      "parameters": [
        {
          "name": "atime",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "check_addarea_gameover": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 172,
      "parameters": [
        {
          "name": "atime",
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
      "line": 47,
      "parameters": [
        {
          "name": "atime",
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
      "line": 223,
      "parameters": [
        {
          "name": "atime",
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
      "line": 73,
      "parameters": [
        {
          "name": "atime",
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
      "line": 61,
      "parameters": [
        {
          "name": "atime",
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
      "line": 165,
      "parameters": [
        {
          "name": "atime",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "add_once_area": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 191,
      "parameters": [
        {
          "name": "atime",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill589",
      "order": 264,
      "source": "include/modules/extra/card/skills/skill589/main.php",
      "line": 91,
      "parameters": [
        {
          "name": "atime",
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
      "line": 341,
      "parameters": [
        {
          "name": "atime",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill714",
      "order": 720,
      "source": "include/modules/extra/card/skills/skill714/main.php",
      "line": 53,
      "parameters": [
        {
          "name": "atime",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "post_addarea_process": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 213,
      "parameters": [
        {
          "name": "atime",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "areaaddlist",
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
      "line": 50,
      "parameters": [
        {
          "name": "atime",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "areaaddlist",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "areawarn": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 227,
      "parameters": []
    }
  ],
  "rs_areatime": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 258,
      "parameters": []
    },
    {
      "module": "instance9",
      "order": 465,
      "source": "include/modules/extra/instance/instance9_rush/main.php",
      "line": 143,
      "parameters": []
    },
    {
      "module": "instance3",
      "order": 615,
      "source": "include/modules/extra/instance/instance3_ascension/main.php",
      "line": 64,
      "parameters": []
    },
    {
      "module": "instance5",
      "order": 640,
      "source": "include/modules/extra/instance/instance5/main.php",
      "line": 49,
      "parameters": []
    },
    {
      "module": "instance10",
      "order": 726,
      "source": "include/modules/extra/instance/instance10_rogue/main.php",
      "line": 147,
      "parameters": []
    }
  ],
  "get_areanames_nextadd": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 289,
      "parameters": [
        {
          "name": "wave",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "forshort",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "get_next_areadata_html": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 302,
      "parameters": [
        {
          "name": "atime",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "check_game_stop_joining": [
    {
      "module": "map",
      "order": 2,
      "source": "include/modules/core/map/main.php",
      "line": 357,
      "parameters": []
    }
  ],
  "bmp_binwriteint": [
    {
      "module": "bmp_util",
      "order": 3,
      "source": "include/modules/extra/misc/bmp_util/main.php",
      "line": 7,
      "parameters": [
        {
          "name": "str",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pos",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "val",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "gen_bmp": [
    {
      "module": "bmp_util",
      "order": 3,
      "source": "include/modules/extra/misc/bmp_util/main.php",
      "line": 20,
      "parameters": [
        {
          "name": "content",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "width",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "height",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "gamestate_prepare_game": [
    {
      "module": "gameflow_base",
      "order": 4,
      "source": "include/modules/core/gameflow/gameflow_base/main.php",
      "line": 8,
      "parameters": []
    }
  ],
  "gamestate_start_game": [
    {
      "module": "gameflow_base",
      "order": 4,
      "source": "include/modules/core/gameflow/gameflow_base/main.php",
      "line": 22,
      "parameters": []
    }
  ],
  "gamestateupdate": [
    {
      "module": "gameflow_base",
      "order": 4,
      "source": "include/modules/core/gameflow/gameflow_base/main.php",
      "line": 33,
      "parameters": []
    },
    {
      "module": "gameflow_antiafk",
      "order": 6,
      "source": "include/modules/core/gameflow/gameflow_antiafk/main.php",
      "line": 44,
      "parameters": []
    },
    {
      "module": "gameflow_combo",
      "order": 42,
      "source": "include/modules/core/gameflow/gameflow_combo/main.php",
      "line": 79,
      "parameters": []
    }
  ],
  "is_gamestate_combo": [
    {
      "module": "gameflow_base",
      "order": 4,
      "source": "include/modules/core/gameflow/gameflow_base/main.php",
      "line": 52,
      "parameters": [
        {
          "name": "disp",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "gameflow_combo",
      "order": 42,
      "source": "include/modules/core/gameflow/gameflow_combo/main.php",
      "line": 21,
      "parameters": [
        {
          "name": "disp",
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
      "line": 1042,
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
  "checkendgame": [
    {
      "module": "gameflow_base",
      "order": 4,
      "source": "include/modules/core/gameflow/gameflow_base/main.php",
      "line": 57,
      "parameters": []
    }
  ],
  "update_valid_alivenum": [
    {
      "module": "gameflow_base",
      "order": 4,
      "source": "include/modules/core/gameflow/gameflow_base/main.php",
      "line": 100,
      "parameters": []
    }
  ],
  "check_valid_alivenum_single": [
    {
      "module": "gameflow_base",
      "order": 4,
      "source": "include/modules/core/gameflow/gameflow_base/main.php",
      "line": 114,
      "parameters": [
        {
          "name": "pdata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "create_player_lock": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 51,
      "parameters": [
        {
          "name": "pdid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "forced",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "release_player_lock": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 71,
      "parameters": [
        {
          "name": "pdid",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "release_player_lock_from_pool": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 83,
      "parameters": []
    }
  ],
  "fetch_playerdata": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 97,
      "parameters": [
        {
          "name": "Pname",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "Ptype",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "ignore_pool",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "ignore_lock",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "fetch_playerdata_by_pid": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 132,
      "parameters": [
        {
          "name": "pid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "ignore_pool",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "ignore_lock",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "fetch_original_playerdata_by_id": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 156,
      "parameters": [
        {
          "name": "pid",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "playerdata_construct_process": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 169,
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
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 191,
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
      "module": "searchmemory",
      "order": 650,
      "source": "include/modules/extra/searchmemory/main.php",
      "line": 58,
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
  "load_playerdata": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 183,
      "parameters": [
        {
          "name": "pdata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 183,
      "parameters": [
        {
          "name": "pdata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "lvlctl",
      "order": 13,
      "source": "include/modules/base/lvlctl/main.php",
      "line": 149,
      "parameters": [
        {
          "name": "pdata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "dualwep",
      "order": 456,
      "source": "include/modules/base/weapon/dualwep/main.php",
      "line": 17,
      "parameters": [
        {
          "name": "pdata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill493",
      "order": 552,
      "source": "include/modules/extra/card/skills/skill493/main.php",
      "line": 156,
      "parameters": [
        {
          "name": "pdata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "searchmemory",
      "order": 650,
      "source": "include/modules/extra/searchmemory/main.php",
      "line": 47,
      "parameters": [
        {
          "name": "pdata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "post_load_profile_event": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 197,
      "parameters": []
    },
    {
      "module": "skill529",
      "order": 241,
      "source": "include/modules/extra/card/skills/skill529/main.php",
      "line": 19,
      "parameters": []
    },
    {
      "module": "skill276",
      "order": 253,
      "source": "include/modules/extra/club/skills/skill276/main.php",
      "line": 30,
      "parameters": []
    },
    {
      "module": "skill536",
      "order": 254,
      "source": "include/modules/extra/card/skills/skill536/main.php",
      "line": 32,
      "parameters": []
    },
    {
      "module": "skill583",
      "order": 263,
      "source": "include/modules/extra/card/skills/skill583/main.php",
      "line": 37,
      "parameters": []
    },
    {
      "module": "skill544",
      "order": 659,
      "source": "include/modules/extra/card/skills/skill544/main.php",
      "line": 32,
      "parameters": []
    },
    {
      "module": "skill543",
      "order": 703,
      "source": "include/modules/extra/card/skills/skill543/main.php",
      "line": 23,
      "parameters": []
    }
  ],
  "get_alivenum_for_display": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 203,
      "parameters": []
    },
    {
      "module": "skill536",
      "order": 254,
      "source": "include/modules/extra/card/skills/skill536/main.php",
      "line": 50,
      "parameters": []
    },
    {
      "module": "skill583",
      "order": 263,
      "source": "include/modules/extra/card/skills/skill583/main.php",
      "line": 55,
      "parameters": []
    }
  ],
  "check_alive_player_displayable": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 212,
      "parameters": [
        {
          "name": "pdata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill536",
      "order": 254,
      "source": "include/modules/extra/card/skills/skill536/main.php",
      "line": 77,
      "parameters": [
        {
          "name": "pdata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_player_killmsg": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 218,
      "parameters": [
        {
          "name": "pdata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "npc",
      "order": 16,
      "source": "include/modules/base/npc/main.php",
      "line": 209,
      "parameters": [
        {
          "name": "pdata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "npcchat",
      "order": 47,
      "source": "include/modules/base/npcchat/main.php",
      "line": 209,
      "parameters": [
        {
          "name": "pdata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_player_lastword": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 224,
      "parameters": [
        {
          "name": "pdata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "npc",
      "order": 16,
      "source": "include/modules/base/npc/main.php",
      "line": 225,
      "parameters": [
        {
          "name": "pdata",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "create_dummy_playerdata": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 231,
      "parameters": []
    }
  ],
  "icon_parser_valid": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 247,
      "parameters": [
        {
          "name": "pdata",
          "byReference": true,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "cardbase",
      "order": 380,
      "source": "include/modules/extra/card/cardbase/main.php",
      "line": 1267,
      "parameters": [
        {
          "name": "pdata",
          "byReference": true,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "get_pc_icon_selecting_list": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 264,
      "parameters": []
    }
  ],
  "icon_parser_shell": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 314,
      "parameters": [
        {
          "name": "pdata",
          "byReference": true,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "icon_parser": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 336,
      "parameters": [
        {
          "name": "type",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "gd",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "icon",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "icon_parser_name_format": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 353,
      "parameters": [
        {
          "name": "type",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "gd",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "icon",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "icon_parser_file_check": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 369,
      "parameters": [
        {
          "name": "iconImg",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "iconImgB",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_icon_num_limit": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 417,
      "parameters": [
        {
          "name": "gd",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "get_icon_num_random": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 426,
      "parameters": [
        {
          "name": "gd",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "check_fog": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 439,
      "parameters": []
    },
    {
      "module": "weather",
      "order": 376,
      "source": "include/modules/base/weather/main.php",
      "line": 376,
      "parameters": []
    },
    {
      "module": "skill252",
      "order": 385,
      "source": "include/modules/extra/club/skills/skill252/main.php",
      "line": 51,
      "parameters": []
    }
  ],
  "init_playerdata": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 445,
      "parameters": []
    },
    {
      "module": "lvlctl",
      "order": 13,
      "source": "include/modules/base/lvlctl/main.php",
      "line": 157,
      "parameters": []
    },
    {
      "module": "skill528",
      "order": 240,
      "source": "include/modules/extra/card/skills/skill528/main.php",
      "line": 37,
      "parameters": []
    },
    {
      "module": "ending",
      "order": 524,
      "source": "include/modules/base/ending/main.php",
      "line": 50,
      "parameters": []
    },
    {
      "module": "searchmemory",
      "order": 650,
      "source": "include/modules/extra/searchmemory/main.php",
      "line": 37,
      "parameters": []
    }
  ],
  "parse_interface_gameinfo": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 467,
      "parameters": []
    },
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/itemcmd.php",
      "line": 20,
      "parameters": []
    },
    {
      "module": "skill606",
      "order": 309,
      "source": "include/modules/extra/club/skills/skill606/main.php",
      "line": 24,
      "parameters": []
    },
    {
      "module": "news_observe",
      "order": 527,
      "source": "include/modules/extra/misc/news_observe/main.php",
      "line": 63,
      "parameters": []
    },
    {
      "module": "user_settings",
      "order": 613,
      "source": "include/modules/extra/misc/user_settings/main.php",
      "line": 69,
      "parameters": []
    }
  ],
  "parse_interface_profile": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 484,
      "parameters": []
    },
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 311,
      "parameters": []
    },
    {
      "module": "skill571",
      "order": 258,
      "source": "include/modules/extra/card/skills/skill571/main.php",
      "line": 22,
      "parameters": []
    },
    {
      "module": "cardbase",
      "order": 380,
      "source": "include/modules/extra/card/cardbase/main.php",
      "line": 812,
      "parameters": []
    },
    {
      "module": "dualwep",
      "order": 456,
      "source": "include/modules/base/weapon/dualwep/main.php",
      "line": 32,
      "parameters": []
    }
  ],
  "addarea_pc_process_single": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 565,
      "parameters": [
        {
          "name": "sub",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "atime",
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
      "line": 191,
      "parameters": [
        {
          "name": "sub",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "atime",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "check_pc_avoid_killarea": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 591,
      "parameters": [
        {
          "name": "sub",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "atime",
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
      "line": 125,
      "parameters": [
        {
          "name": "sub",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "atime",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "post_pc_avoid_killarea": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 598,
      "parameters": [
        {
          "name": "sub",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "atime",
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
      "line": 132,
      "parameters": [
        {
          "name": "sub",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "atime",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "update_sdata": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 603,
      "parameters": []
    }
  ],
  "before_last_player_save_event": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 610,
      "parameters": []
    },
    {
      "module": "skill528",
      "order": 240,
      "source": "include/modules/extra/card/skills/skill528/main.php",
      "line": 64,
      "parameters": []
    }
  ],
  "player_format_with_db_structure": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 617,
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
  "player_diff_from_poll": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 630,
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
  "player_save": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 655,
      "parameters": [
        {
          "name": "data",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "in_proc",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 215,
      "parameters": [
        {
          "name": "data",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "in_proc",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "searchmemory",
      "order": 650,
      "source": "include/modules/extra/searchmemory/main.php",
      "line": 85,
      "parameters": [
        {
          "name": "data",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "in_proc",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "deathnews": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 729,
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
        }
      ]
    },
    {
      "module": "skill736",
      "order": 302,
      "source": "include/modules/extra/card/skills/skill736/main.php",
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
        }
      ]
    },
    {
      "module": "skill961",
      "order": 410,
      "source": "include/modules/extra/instance/instance10_rogue/skill961/main.php",
      "line": 239,
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
        }
      ]
    },
    {
      "module": "wep_b",
      "order": 417,
      "source": "include/modules/base/weapon/wep_b/main.php",
      "line": 418,
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
        }
      ]
    }
  ],
  "get_dinfo": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 741,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill1003",
      "order": 449,
      "source": "include/modules/extra/club/skills/skill1003/main.php",
      "line": 140,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "set_revive_sequence": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 752,
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
        }
      ]
    },
    {
      "module": "skill486",
      "order": 97,
      "source": "include/modules/extra/card/skills/skill486/main.php",
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
        }
      ]
    },
    {
      "module": "skill519",
      "order": 102,
      "source": "include/modules/extra/card/skills/skill519/main.php",
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
        }
      ]
    },
    {
      "module": "skill483",
      "order": 110,
      "source": "include/modules/extra/card/skills/skill483/main.php",
      "line": 79,
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
        }
      ]
    },
    {
      "module": "skill58",
      "order": 145,
      "source": "include/modules/extra/club/skills/skill58/main.php",
      "line": 33,
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
        }
      ]
    },
    {
      "module": "skill518",
      "order": 237,
      "source": "include/modules/extra/card/skills/skill518/main.php",
      "line": 65,
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
        }
      ]
    },
    {
      "module": "skill427",
      "order": 344,
      "source": "include/modules/extra/instance/gtype1/skill427/main.php",
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
        }
      ]
    },
    {
      "module": "weather",
      "order": 376,
      "source": "include/modules/base/weather/main.php",
      "line": 500,
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
        }
      ]
    },
    {
      "module": "skill538",
      "order": 688,
      "source": "include/modules/extra/card/skills/skill538/main.php",
      "line": 136,
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
        }
      ]
    }
  ],
  "revive_process": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 760,
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
        }
      ]
    }
  ],
  "revive_veto": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 782,
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
        }
      ]
    },
    {
      "module": "skill505",
      "order": 713,
      "source": "include/modules/extra/card/skills/skill505/main.php",
      "line": 173,
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
        }
      ]
    }
  ],
  "revive_check": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 789,
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill486",
      "order": 97,
      "source": "include/modules/extra/card/skills/skill486/main.php",
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill519",
      "order": 102,
      "source": "include/modules/extra/card/skills/skill519/main.php",
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill483",
      "order": 110,
      "source": "include/modules/extra/card/skills/skill483/main.php",
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill58",
      "order": 145,
      "source": "include/modules/extra/club/skills/skill58/main.php",
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill518",
      "order": 237,
      "source": "include/modules/extra/card/skills/skill518/main.php",
      "line": 76,
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill427",
      "order": 344,
      "source": "include/modules/extra/instance/gtype1/skill427/main.php",
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
          "name": "rkey",
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
      "line": 512,
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill538",
      "order": 688,
      "source": "include/modules/extra/card/skills/skill538/main.php",
      "line": 147,
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "pre_revive_events": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 796,
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "post_revive_events": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 803,
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill486",
      "order": 97,
      "source": "include/modules/extra/card/skills/skill486/main.php",
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill519",
      "order": 102,
      "source": "include/modules/extra/card/skills/skill519/main.php",
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill483",
      "order": 110,
      "source": "include/modules/extra/card/skills/skill483/main.php",
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill58",
      "order": 145,
      "source": "include/modules/extra/club/skills/skill58/main.php",
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill518",
      "order": 237,
      "source": "include/modules/extra/card/skills/skill518/main.php",
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill427",
      "order": 344,
      "source": "include/modules/extra/instance/gtype1/skill427/main.php",
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
          "name": "rkey",
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
      "line": 523,
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill369",
      "order": 599,
      "source": "include/modules/extra/achievement/skills/skill369/main.php",
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
          "name": "rkey",
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
      "line": 54,
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill538",
      "order": 688,
      "source": "include/modules/extra/card/skills/skill538/main.php",
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "revive_post_deathnews": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 810,
      "parameters": [
        {
          "name": "narr",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "revive_events": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 820,
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
          "name": "rkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "kill": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 840,
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
        }
      ]
    },
    {
      "module": "skill328",
      "order": 69,
      "source": "include/modules/extra/activities/nationalday2017/skill328/main.php",
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
        }
      ]
    },
    {
      "module": "skill519",
      "order": 102,
      "source": "include/modules/extra/card/skills/skill519/main.php",
      "line": 76,
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
        }
      ]
    },
    {
      "module": "skill455",
      "order": 107,
      "source": "include/modules/extra/card/skills/skill455/main.php",
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
        }
      ]
    },
    {
      "module": "skill253",
      "order": 109,
      "source": "include/modules/extra/club/skills/skill253/main.php",
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
        }
      ]
    },
    {
      "module": "skill1002",
      "order": 111,
      "source": "include/modules/extra/instance/skill1002/main.php",
      "line": 71,
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
        }
      ]
    },
    {
      "module": "skill58",
      "order": 145,
      "source": "include/modules/extra/club/skills/skill58/main.php",
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
        }
      ]
    },
    {
      "module": "skill428",
      "order": 155,
      "source": "include/modules/extra/instance/gtype1/skill428/main.php",
      "line": 86,
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
        }
      ]
    },
    {
      "module": "skill251",
      "order": 166,
      "source": "include/modules/extra/club/skills/skill251/main.php",
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
        }
      ]
    },
    {
      "module": "skill518",
      "order": 237,
      "source": "include/modules/extra/card/skills/skill518/main.php",
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
        }
      ]
    },
    {
      "module": "skill539",
      "order": 266,
      "source": "include/modules/extra/card/skills/skill539/main.php",
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
        }
      ]
    },
    {
      "module": "skill586",
      "order": 281,
      "source": "include/modules/extra/card/skills/skill586/main.php",
      "line": 421,
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
        }
      ]
    },
    {
      "module": "skill475",
      "order": 341,
      "source": "include/modules/extra/instance/gtype2/skill475/main.php",
      "line": 178,
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
        }
      ]
    },
    {
      "module": "skill427",
      "order": 344,
      "source": "include/modules/extra/instance/gtype1/skill427/main.php",
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
        }
      ]
    },
    {
      "module": "skill545",
      "order": 349,
      "source": "include/modules/extra/card/skills/skill545/main.php",
      "line": 63,
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
        }
      ]
    },
    {
      "module": "supplycrate_event",
      "order": 411,
      "source": "include/modules/extra/misc/supplycrate_event/main.php",
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
        }
      ]
    },
    {
      "module": "skill356",
      "order": 589,
      "source": "include/modules/extra/achievement/skills/skill356/main.php",
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
        }
      ]
    },
    {
      "module": "instance3",
      "order": 615,
      "source": "include/modules/extra/instance/instance3_ascension/main.php",
      "line": 295,
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
        }
      ]
    },
    {
      "module": "skill538",
      "order": 688,
      "source": "include/modules/extra/card/skills/skill538/main.php",
      "line": 173,
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
        }
      ]
    },
    {
      "module": "skill576",
      "order": 697,
      "source": "include/modules/extra/card/skills/skill576/main.php",
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
        }
      ]
    }
  ],
  "pre_act": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 874,
      "parameters": []
    },
    {
      "module": "logger",
      "order": 7,
      "source": "include/modules/base/logger/main.php",
      "line": 22,
      "parameters": []
    },
    {
      "module": "noise",
      "order": 12,
      "source": "include/modules/base/noise/main.php",
      "line": 14,
      "parameters": []
    },
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 601,
      "parameters": []
    },
    {
      "module": "skill539",
      "order": 266,
      "source": "include/modules/extra/card/skills/skill539/main.php",
      "line": 31,
      "parameters": []
    },
    {
      "module": "skill715",
      "order": 280,
      "source": "include/modules/extra/card/skills/skill715/main.php",
      "line": 48,
      "parameters": []
    },
    {
      "module": "skill475",
      "order": 341,
      "source": "include/modules/extra/instance/gtype2/skill475/main.php",
      "line": 70,
      "parameters": []
    },
    {
      "module": "skill545",
      "order": 349,
      "source": "include/modules/extra/card/skills/skill545/main.php",
      "line": 31,
      "parameters": []
    },
    {
      "module": "weather",
      "order": 376,
      "source": "include/modules/base/weather/main.php",
      "line": 296,
      "parameters": []
    },
    {
      "module": "skill599",
      "order": 379,
      "source": "include/modules/extra/card/skills/skill599/main.php",
      "line": 28,
      "parameters": []
    },
    {
      "module": "skill56",
      "order": 405,
      "source": "include/modules/extra/club/skills/skill56/main.php",
      "line": 113,
      "parameters": []
    },
    {
      "module": "skill435",
      "order": 406,
      "source": "include/modules/extra/card/skills/skill435/main.php",
      "line": 113,
      "parameters": []
    },
    {
      "module": "skill1003",
      "order": 449,
      "source": "include/modules/extra/club/skills/skill1003/main.php",
      "line": 59,
      "parameters": []
    },
    {
      "module": "extra_event",
      "order": 526,
      "source": "include/modules/extra/misc/extra_event/main.php",
      "line": 384,
      "parameters": []
    },
    {
      "module": "instance_close_button",
      "order": 537,
      "source": "include/modules/extra/instance/instance_close_button/main.php",
      "line": 50,
      "parameters": []
    },
    {
      "module": "skill602",
      "order": 647,
      "source": "include/modules/extra/club/skills/skill602/main.php",
      "line": 117,
      "parameters": []
    },
    {
      "module": "skill603",
      "order": 648,
      "source": "include/modules/extra/club/skills/skill603/main.php",
      "line": 68,
      "parameters": []
    },
    {
      "module": "instance_quit_button",
      "order": 655,
      "source": "include/modules/extra/instance/instance_quit_button/main.php",
      "line": 62,
      "parameters": []
    }
  ],
  "act": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 883,
      "parameters": []
    },
    {
      "module": "explore",
      "order": 11,
      "source": "include/modules/base/explore/main.php",
      "line": 136,
      "parameters": []
    },
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 615,
      "parameters": []
    },
    {
      "module": "itemmix",
      "order": 20,
      "source": "include/modules/base/itemmix/itemmix/main.php",
      "line": 233,
      "parameters": []
    },
    {
      "module": "itemshop",
      "order": 21,
      "source": "include/modules/base/itemshop/main.php",
      "line": 237,
      "parameters": []
    },
    {
      "module": "apm",
      "order": 27,
      "source": "include/modules/base/apm/main.php",
      "line": 86,
      "parameters": []
    },
    {
      "module": "corpse",
      "order": 32,
      "source": "include/modules/base/corpse/main.php",
      "line": 279,
      "parameters": []
    },
    {
      "module": "enemy",
      "order": 36,
      "source": "include/modules/base/enemy/main.php",
      "line": 125,
      "parameters": []
    },
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/main.php",
      "line": 197,
      "parameters": []
    },
    {
      "module": "item_misc",
      "order": 41,
      "source": "include/modules/base/items/item_misc/main.php",
      "line": 570,
      "parameters": []
    },
    {
      "module": "advteam",
      "order": 43,
      "source": "include/modules/extra/misc/advteam/main.php",
      "line": 22,
      "parameters": []
    },
    {
      "module": "clubbase",
      "order": 49,
      "source": "include/modules/extra/club/clubbase/main.php",
      "line": 141,
      "parameters": []
    },
    {
      "module": "wound",
      "order": 58,
      "source": "include/modules/base/wound/main.php",
      "line": 276,
      "parameters": []
    },
    {
      "module": "skill437",
      "order": 90,
      "source": "include/modules/extra/card/skills/skill437/main.php",
      "line": 28,
      "parameters": []
    },
    {
      "module": "skill1001",
      "order": 94,
      "source": "include/modules/extra/instance/skill1001/main.php",
      "line": 65,
      "parameters": []
    },
    {
      "module": "skill480",
      "order": 120,
      "source": "include/modules/extra/card/skills/skill480/main.php",
      "line": 77,
      "parameters": []
    },
    {
      "module": "skill1011",
      "order": 121,
      "source": "include/modules/extra/gmskills/skill1011/main.php",
      "line": 97,
      "parameters": []
    },
    {
      "module": "skill1010",
      "order": 122,
      "source": "include/modules/extra/gmskills/skill1010/main.php",
      "line": 90,
      "parameters": []
    },
    {
      "module": "skill234",
      "order": 151,
      "source": "include/modules/extra/club/skills/skill234/main.php",
      "line": 181,
      "parameters": []
    },
    {
      "module": "skill235",
      "order": 152,
      "source": "include/modules/extra/club/skills/skill235/main.php",
      "line": 48,
      "parameters": []
    },
    {
      "module": "skill424",
      "order": 154,
      "source": "include/modules/extra/instance/gtype1/skill424/main.php",
      "line": 284,
      "parameters": []
    },
    {
      "module": "skill518",
      "order": 237,
      "source": "include/modules/extra/card/skills/skill518/main.php",
      "line": 55,
      "parameters": []
    },
    {
      "module": "skill552",
      "order": 244,
      "source": "include/modules/extra/card/skills/skill552/main.php",
      "line": 32,
      "parameters": []
    },
    {
      "module": "skill1012",
      "order": 245,
      "source": "include/modules/extra/gmskills/skill1012/main.php",
      "line": 58,
      "parameters": []
    },
    {
      "module": "skill534",
      "order": 249,
      "source": "include/modules/extra/card/skills/skill534/main.php",
      "line": 237,
      "parameters": []
    },
    {
      "module": "skill589",
      "order": 264,
      "source": "include/modules/extra/card/skills/skill589/main.php",
      "line": 28,
      "parameters": []
    },
    {
      "module": "skill586",
      "order": 281,
      "source": "include/modules/extra/card/skills/skill586/main.php",
      "line": 441,
      "parameters": []
    },
    {
      "module": "skill716",
      "order": 287,
      "source": "include/modules/extra/card/skills/skill716/main.php",
      "line": 22,
      "parameters": []
    },
    {
      "module": "skill717",
      "order": 289,
      "source": "include/modules/extra/card/skills/skill717/main.php",
      "line": 130,
      "parameters": []
    },
    {
      "module": "skill952",
      "order": 292,
      "source": "include/modules/extra/instance/instance10_rogue/skill952/main.php",
      "line": 216,
      "parameters": []
    },
    {
      "module": "skill728",
      "order": 300,
      "source": "include/modules/extra/card/skills/skill728/main.php",
      "line": 76,
      "parameters": []
    },
    {
      "module": "skill110",
      "order": 303,
      "source": "include/modules/extra/club/skills/skill110/main.php",
      "line": 97,
      "parameters": []
    },
    {
      "module": "skill1013",
      "order": 305,
      "source": "include/modules/extra/gmskills/skill1013/main.php",
      "line": 64,
      "parameters": []
    },
    {
      "module": "skill_temp",
      "order": 308,
      "source": "include/modules/extra/skill_temp/main.php",
      "line": 210,
      "parameters": []
    },
    {
      "module": "poison",
      "order": 319,
      "source": "include/modules/base/items/poison/main.php",
      "line": 234,
      "parameters": []
    },
    {
      "module": "rest",
      "order": 321,
      "source": "include/modules/base/rest/main.php",
      "line": 104,
      "parameters": []
    },
    {
      "module": "skill12",
      "order": 323,
      "source": "include/modules/extra/club/skills/skill12/main.php",
      "line": 26,
      "parameters": []
    },
    {
      "module": "skill23",
      "order": 355,
      "source": "include/modules/extra/club/skills/skill23/main.php",
      "line": 259,
      "parameters": []
    },
    {
      "module": "pose",
      "order": 362,
      "source": "include/modules/base/pose/main.php",
      "line": 198,
      "parameters": []
    },
    {
      "module": "skill562",
      "order": 364,
      "source": "include/modules/extra/card/skills/skill562/main.php",
      "line": 25,
      "parameters": []
    },
    {
      "module": "skill487",
      "order": 366,
      "source": "include/modules/extra/card/skills/skill487/main.php",
      "line": 225,
      "parameters": []
    },
    {
      "module": "skill579",
      "order": 373,
      "source": "include/modules/extra/card/skills/skill579/main.php",
      "line": 28,
      "parameters": []
    },
    {
      "module": "tactic",
      "order": 374,
      "source": "include/modules/base/tactic/main.php",
      "line": 110,
      "parameters": []
    },
    {
      "module": "skill599",
      "order": 379,
      "source": "include/modules/extra/card/skills/skill599/main.php",
      "line": 44,
      "parameters": []
    },
    {
      "module": "skill588",
      "order": 387,
      "source": "include/modules/extra/card/skills/skill588/main.php",
      "line": 30,
      "parameters": []
    },
    {
      "module": "skill734",
      "order": 401,
      "source": "include/modules/extra/card/skills/skill734/main.php",
      "line": 369,
      "parameters": []
    },
    {
      "module": "skill56",
      "order": 405,
      "source": "include/modules/extra/club/skills/skill56/main.php",
      "line": 328,
      "parameters": []
    },
    {
      "module": "skill435",
      "order": 406,
      "source": "include/modules/extra/card/skills/skill435/main.php",
      "line": 325,
      "parameters": []
    },
    {
      "module": "skill731",
      "order": 413,
      "source": "include/modules/extra/card/skills/skill731/main.php",
      "line": 335,
      "parameters": []
    },
    {
      "module": "skill103",
      "order": 442,
      "source": "include/modules/extra/club/skills/skill103/main.php",
      "line": 97,
      "parameters": []
    },
    {
      "module": "skill104",
      "order": 443,
      "source": "include/modules/extra/club/skills/skill104/main.php",
      "line": 178,
      "parameters": []
    },
    {
      "module": "dualwep",
      "order": 456,
      "source": "include/modules/base/weapon/dualwep/main.php",
      "line": 185,
      "parameters": []
    },
    {
      "module": "skill230",
      "order": 480,
      "source": "include/modules/extra/club/skills/skill230/main.php",
      "line": 88,
      "parameters": []
    },
    {
      "module": "skill219",
      "order": 484,
      "source": "include/modules/extra/club/skills/skill219/main.php",
      "line": 88,
      "parameters": []
    },
    {
      "module": "item_recipe",
      "order": 520,
      "source": "include/modules/extra/item_extra/item_recipe/main.php",
      "line": 331,
      "parameters": []
    },
    {
      "module": "skill580",
      "order": 521,
      "source": "include/modules/extra/card/skills/skill580/main.php",
      "line": 88,
      "parameters": []
    },
    {
      "module": "opening",
      "order": 523,
      "source": "include/modules/base/opening/main.php",
      "line": 16,
      "parameters": []
    },
    {
      "module": "song",
      "order": 525,
      "source": "include/modules/base/items/song/main.php",
      "line": 662,
      "parameters": []
    },
    {
      "module": "extra_event",
      "order": 526,
      "source": "include/modules/extra/misc/extra_event/main.php",
      "line": 372,
      "parameters": []
    },
    {
      "module": "news_observe",
      "order": 527,
      "source": "include/modules/extra/misc/news_observe/main.php",
      "line": 122,
      "parameters": []
    },
    {
      "module": "ex_mhp_temp_up",
      "order": 536,
      "source": "include/modules/extra/attr/ex_mhp_temp_up/main.php",
      "line": 93,
      "parameters": []
    },
    {
      "module": "skill220",
      "order": 543,
      "source": "include/modules/extra/club/skills/skill220/main.php",
      "line": 113,
      "parameters": []
    },
    {
      "module": "tutorial",
      "order": 550,
      "source": "include/modules/extra/instance/instance7_tutorial/tutorial/main.php",
      "line": 347,
      "parameters": []
    },
    {
      "module": "skill313",
      "order": 565,
      "source": "include/modules/extra/achievement/skills/skill313/main.php",
      "line": 69,
      "parameters": []
    },
    {
      "module": "skill332",
      "order": 567,
      "source": "include/modules/extra/achievement/skills/skill332/main.php",
      "line": 53,
      "parameters": []
    },
    {
      "module": "skill333",
      "order": 568,
      "source": "include/modules/extra/achievement/skills/skill333/main.php",
      "line": 53,
      "parameters": []
    },
    {
      "module": "skill334",
      "order": 569,
      "source": "include/modules/extra/achievement/skills/skill334/main.php",
      "line": 53,
      "parameters": []
    },
    {
      "module": "skill335",
      "order": 570,
      "source": "include/modules/extra/achievement/skills/skill335/main.php",
      "line": 53,
      "parameters": []
    },
    {
      "module": "skill336",
      "order": 571,
      "source": "include/modules/extra/achievement/skills/skill336/main.php",
      "line": 53,
      "parameters": []
    },
    {
      "module": "skill337",
      "order": 572,
      "source": "include/modules/extra/achievement/skills/skill337/main.php",
      "line": 53,
      "parameters": []
    },
    {
      "module": "skill338",
      "order": 573,
      "source": "include/modules/extra/achievement/skills/skill338/main.php",
      "line": 48,
      "parameters": []
    },
    {
      "module": "skill530",
      "order": 601,
      "source": "include/modules/extra/card/skills/skill530/main.php",
      "line": 164,
      "parameters": []
    },
    {
      "module": "skill372",
      "order": 602,
      "source": "include/modules/extra/achievement/skills/skill372/main.php",
      "line": 53,
      "parameters": []
    },
    {
      "module": "skill504",
      "order": 612,
      "source": "include/modules/extra/card/skills/skill504/main.php",
      "line": 52,
      "parameters": []
    },
    {
      "module": "skill182",
      "order": 617,
      "source": "include/modules/extra/club/skills/skill182/main.php",
      "line": 201,
      "parameters": []
    },
    {
      "module": "skill458",
      "order": 619,
      "source": "include/modules/extra/card/skills/skill458/main.php",
      "line": 87,
      "parameters": []
    },
    {
      "module": "skill381",
      "order": 624,
      "source": "include/modules/extra/achievement/skills/skill381/main.php",
      "line": 53,
      "parameters": []
    },
    {
      "module": "skill747",
      "order": 629,
      "source": "include/modules/extra/card/skills/skill747/main.php",
      "line": 33,
      "parameters": []
    },
    {
      "module": "instance11",
      "order": 630,
      "source": "include/modules/extra/instance/instance11_observe/main.php",
      "line": 296,
      "parameters": []
    },
    {
      "module": "wepchange",
      "order": 631,
      "source": "include/modules/extra/attr/wepchange/main.php",
      "line": 51,
      "parameters": []
    },
    {
      "module": "smartmix",
      "order": 637,
      "source": "include/modules/extra/misc/smartmix/main.php",
      "line": 192,
      "parameters": []
    },
    {
      "module": "logistics",
      "order": 644,
      "source": "include/modules/extra/misc/logistics/main.php",
      "line": 523,
      "parameters": []
    },
    {
      "module": "item_uys",
      "order": 649,
      "source": "include/modules/extra/item_extra/item_uys/main.php",
      "line": 187,
      "parameters": []
    },
    {
      "module": "searchmemory",
      "order": 650,
      "source": "include/modules/extra/searchmemory/main.php",
      "line": 394,
      "parameters": []
    },
    {
      "module": "skill94",
      "order": 653,
      "source": "include/modules/extra/club/skills/skill94/main.php",
      "line": 83,
      "parameters": []
    },
    {
      "module": "blessstone",
      "order": 673,
      "source": "include/modules/extra/attr/blessstone/main.php",
      "line": 162,
      "parameters": []
    },
    {
      "module": "skill1006",
      "order": 680,
      "source": "include/modules/extra/club/skills/skill1006/main.php",
      "line": 241,
      "parameters": []
    },
    {
      "module": "ex_storage",
      "order": 691,
      "source": "include/modules/extra/attr/ex_storage/main.php",
      "line": 264,
      "parameters": []
    },
    {
      "module": "item_armor_empower",
      "order": 692,
      "source": "include/modules/extra/item_extra/item_armor_empower/main.php",
      "line": 196,
      "parameters": []
    },
    {
      "module": "item_uvo_extra",
      "order": 693,
      "source": "include/modules/extra/item_extra/item_uvo_extra/main.php",
      "line": 89,
      "parameters": []
    },
    {
      "module": "skill272",
      "order": 694,
      "source": "include/modules/extra/club/skills/skill272/main.php",
      "line": 290,
      "parameters": []
    },
    {
      "module": "skill597",
      "order": 699,
      "source": "include/modules/extra/card/skills/skill597/main.php",
      "line": 339,
      "parameters": []
    },
    {
      "module": "skill733",
      "order": 704,
      "source": "include/modules/extra/card/skills/skill733/main.php",
      "line": 200,
      "parameters": []
    },
    {
      "module": "skill746",
      "order": 712,
      "source": "include/modules/extra/card/skills/skill746/main.php",
      "line": 96,
      "parameters": []
    },
    {
      "module": "skill505",
      "order": 713,
      "source": "include/modules/extra/card/skills/skill505/main.php",
      "line": 182,
      "parameters": []
    },
    {
      "module": "skill960",
      "order": 714,
      "source": "include/modules/extra/instance/instance10_rogue/skill960/main.php",
      "line": 560,
      "parameters": []
    },
    {
      "module": "skill737",
      "order": 719,
      "source": "include/modules/extra/card/skills/skill737/main.php",
      "line": 80,
      "parameters": []
    },
    {
      "module": "skill962",
      "order": 734,
      "source": "include/modules/extra/instance/instance10_rogue/skill962/main.php",
      "line": 52,
      "parameters": []
    }
  ],
  "post_act": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 899,
      "parameters": []
    },
    {
      "module": "corpse",
      "order": 32,
      "source": "include/modules/base/corpse/main.php",
      "line": 268,
      "parameters": []
    },
    {
      "module": "enemy",
      "order": 36,
      "source": "include/modules/base/enemy/main.php",
      "line": 114,
      "parameters": []
    },
    {
      "module": "team",
      "order": 39,
      "source": "include/modules/base/team/main.php",
      "line": 186,
      "parameters": []
    },
    {
      "module": "skill901",
      "order": 353,
      "source": "include/modules/extra/instance/instance3_ascension/skill901/main.php",
      "line": 57,
      "parameters": []
    },
    {
      "module": "npc_action",
      "order": 398,
      "source": "include/modules/extra/npc_action/main.php",
      "line": 573,
      "parameters": []
    },
    {
      "module": "skill961",
      "order": 410,
      "source": "include/modules/extra/instance/instance10_rogue/skill961/main.php",
      "line": 141,
      "parameters": []
    },
    {
      "module": "skill1003",
      "order": 449,
      "source": "include/modules/extra/club/skills/skill1003/main.php",
      "line": 68,
      "parameters": []
    },
    {
      "module": "cooldown",
      "order": 618,
      "source": "include/modules/base/cooldown/main.php",
      "line": 115,
      "parameters": []
    },
    {
      "module": "instance11",
      "order": 630,
      "source": "include/modules/extra/instance/instance11_observe/main.php",
      "line": 274,
      "parameters": []
    },
    {
      "module": "skill701",
      "order": 674,
      "source": "include/modules/extra/card/skills/skill701/main.php",
      "line": 45,
      "parameters": []
    }
  ],
  "get_max_rage": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 909,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "rage",
      "order": 419,
      "source": "include/modules/extra/attr/rage/main.php",
      "line": 16,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill570",
      "order": 464,
      "source": "include/modules/extra/card/skills/skill570/main.php",
      "line": 22,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "prepare_response_content": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 914,
      "parameters": []
    },
    {
      "module": "opening",
      "order": 523,
      "source": "include/modules/base/opening/main.php",
      "line": 67,
      "parameters": []
    },
    {
      "module": "cooldown",
      "order": 618,
      "source": "include/modules/base/cooldown/main.php",
      "line": 153,
      "parameters": []
    }
  ],
  "prepare_initial_response_content": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 922,
      "parameters": []
    },
    {
      "module": "corpse",
      "order": 32,
      "source": "include/modules/base/corpse/main.php",
      "line": 101,
      "parameters": []
    },
    {
      "module": "opening",
      "order": 523,
      "source": "include/modules/base/opening/main.php",
      "line": 60,
      "parameters": []
    },
    {
      "module": "cooldown",
      "order": 618,
      "source": "include/modules/base/cooldown/main.php",
      "line": 175,
      "parameters": []
    }
  ],
  "post_enterbattlefield_events": [
    {
      "module": "player",
      "order": 5,
      "source": "include/modules/core/player/main.php",
      "line": 928,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 436,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill569",
      "order": 257,
      "source": "include/modules/extra/card/skills/skill569/main.php",
      "line": 22,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill577",
      "order": 260,
      "source": "include/modules/extra/card/skills/skill577/main.php",
      "line": 22,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill952",
      "order": 292,
      "source": "include/modules/extra/instance/instance10_rogue/skill952/main.php",
      "line": 31,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "cardbase",
      "order": 380,
      "source": "include/modules/extra/card/cardbase/main.php",
      "line": 886,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill584",
      "order": 395,
      "source": "include/modules/extra/card/skills/skill584/main.php",
      "line": 38,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill1003",
      "order": 449,
      "source": "include/modules/extra/club/skills/skill1003/main.php",
      "line": 220,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "achievement_base",
      "order": 522,
      "source": "include/modules/extra/achievement/achievement_base/main.php",
      "line": 51,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "instance3",
      "order": 615,
      "source": "include/modules/extra/instance/instance3_ascension/main.php",
      "line": 221,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "instance11",
      "order": 630,
      "source": "include/modules/extra/instance/instance11_observe/main.php",
      "line": 209,
      "parameters": [
        {
          "name": "pa",
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
      "line": 32,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill714",
      "order": 720,
      "source": "include/modules/extra/card/skills/skill714/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "instance10",
      "order": 726,
      "source": "include/modules/extra/instance/instance10_rogue/main.php",
      "line": 363,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "check_triggered_antiafk": [
    {
      "module": "gameflow_antiafk",
      "order": 6,
      "source": "include/modules/core/gameflow/gameflow_antiafk/main.php",
      "line": 21,
      "parameters": []
    }
  ],
  "get_antiafkertime": [
    {
      "module": "gameflow_antiafk",
      "order": 6,
      "source": "include/modules/core/gameflow/gameflow_antiafk/main.php",
      "line": 36,
      "parameters": []
    }
  ],
  "antiafk": [
    {
      "module": "gameflow_antiafk",
      "order": 6,
      "source": "include/modules/core/gameflow/gameflow_antiafk/main.php",
      "line": 55,
      "parameters": [
        {
          "name": "timelimit",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "logsave": [
    {
      "module": "logger",
      "order": 7,
      "source": "include/modules/base/logger/main.php",
      "line": 11,
      "parameters": [
        {
          "name": "pid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "time",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "log",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "type",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "log_linenum_counter": [
    {
      "module": "logger",
      "order": 7,
      "source": "include/modules/base/logger/main.php",
      "line": 44,
      "parameters": [
        {
          "name": "str",
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
  "check_skill_info": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 16,
      "parameters": [
        {
          "name": "skillno",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "str",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "skillbase_set_ppid": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 24,
      "parameters": []
    }
  ],
  "b64_conv_to_value": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 36,
      "parameters": [
        {
          "name": "c",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "value_conv_to_b64": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 47,
      "parameters": [
        {
          "name": "c",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "parse_skill_parameter_data": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 61,
      "parameters": [
        {
          "name": "nskparas",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "skillbase_load": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 81,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "dummy",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "skillbase_load_process": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 99,
      "parameters": [
        {
          "name": "ss",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "sps",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "skill_onload_event": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 115,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill4",
      "order": 15,
      "source": "include/modules/base/skills/skill4/main.php",
      "line": 17,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill2",
      "order": 59,
      "source": "include/modules/base/skills/skill2/main.php",
      "line": 17,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill3",
      "order": 60,
      "source": "include/modules/base/skills/skill3/main.php",
      "line": 17,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill5",
      "order": 314,
      "source": "include/modules/extra/attr/skills/skill5/main.php",
      "line": 26,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill6",
      "order": 315,
      "source": "include/modules/extra/attr/skills/skill6/main.php",
      "line": 26,
      "parameters": [
        {
          "name": "pa",
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
      "line": 26,
      "parameters": [
        {
          "name": "pa",
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
      "line": 26,
      "parameters": [
        {
          "name": "pa",
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
      "line": 26,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill475",
      "order": 341,
      "source": "include/modules/extra/instance/gtype2/skill475/main.php",
      "line": 82,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill1",
      "order": 363,
      "source": "include/modules/base/skills/skill1/main.php",
      "line": 17,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill57",
      "order": 452,
      "source": "include/modules/extra/club/skills/skill57/main.php",
      "line": 36,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill436",
      "order": 453,
      "source": "include/modules/extra/card/skills/skill436/main.php",
      "line": 36,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill182",
      "order": 617,
      "source": "include/modules/extra/club/skills/skill182/main.php",
      "line": 146,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "skillbase_save": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 124,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        },
        {
          "name": "in_proc",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "skillbase_save_process": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 156,
      "parameters": [
        {
          "name": "sa",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "spa",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "skill_onsave_event": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 178,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill4",
      "order": 15,
      "source": "include/modules/base/skills/skill4/main.php",
      "line": 24,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill2",
      "order": 59,
      "source": "include/modules/base/skills/skill2/main.php",
      "line": 24,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill3",
      "order": 60,
      "source": "include/modules/base/skills/skill3/main.php",
      "line": 24,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill5",
      "order": 314,
      "source": "include/modules/extra/attr/skills/skill5/main.php",
      "line": 33,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill6",
      "order": 315,
      "source": "include/modules/extra/attr/skills/skill6/main.php",
      "line": 33,
      "parameters": [
        {
          "name": "pa",
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
      "line": 33,
      "parameters": [
        {
          "name": "pa",
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
      "line": 33,
      "parameters": [
        {
          "name": "pa",
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
      "line": 33,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill1",
      "order": 363,
      "source": "include/modules/base/skills/skill1/main.php",
      "line": 24,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "skill_acquire": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 225,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "no_cover",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill461",
      "order": 165,
      "source": "include/modules/extra/card/skills/skill461/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "no_cover",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill803",
      "order": 510,
      "source": "include/modules/extra/card/skills/skill803/main.php",
      "line": 46,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "no_cover",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "skill_lost": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 260,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
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
  "skill_query": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 292,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
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
  "skill_enabled": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 306,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill513",
      "order": 514,
      "source": "include/modules/extra/card/skills/skill513/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "skill_enabled_core": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 313,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill433",
      "order": 184,
      "source": "include/modules/extra/card/skills/skill433/main.php",
      "line": 52,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
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
    },
    {
      "module": "skill46",
      "order": 188,
      "source": "include/modules/extra/club/skills/skill46/main.php",
      "line": 102,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
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
    },
    {
      "module": "skill440",
      "order": 217,
      "source": "include/modules/extra/card/skills/skill440/main.php",
      "line": 87,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
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
    },
    {
      "module": "ex_direct",
      "order": 428,
      "source": "include/modules/extra/attr/ex_direct/main.php",
      "line": 34,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
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
    },
    {
      "module": "skill575",
      "order": 698,
      "source": "include/modules/extra/card/skills/skill575/main.php",
      "line": 198,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
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
  "check_have_skill_info": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 321,
      "parameters": [
        {
          "name": "str",
          "byReference": false,
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
  "get_acquired_skill_array": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 343,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "skill_setvalue": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 362,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "skillkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "skillvalue",
          "byReference": false,
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
  "skill_getvalue": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 378,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "skillkey",
          "byReference": false,
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
  "skill_getvalue_direct": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 395,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "skillkey",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "paradata",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "skill_delvalue": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 403,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "skillkey",
          "byReference": false,
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
  "skill_check_unlocked": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 420,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
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
  "check_skill_available_process": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 472,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "check_skill_available": [
    {
      "module": "skillbase",
      "order": 8,
      "source": "include/modules/base/skillbase/main.php",
      "line": 486,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill_temp",
      "order": 308,
      "source": "include/modules/extra/skill_temp/main.php",
      "line": 27,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "ex_equipskill",
      "order": 690,
      "source": "include/modules/extra/attr/ex_equipskill/main.php",
      "line": 45,
      "parameters": [
        {
          "name": "skillid",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_html_color": [
    {
      "module": "replay",
      "order": 9,
      "source": "include/modules/extra/misc/replay/main.php",
      "line": 11,
      "parameters": [
        {
          "name": "r",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "g",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "b",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_ident_textcolor": [
    {
      "module": "replay",
      "order": 9,
      "source": "include/modules/extra/misc/replay/main.php",
      "line": 32,
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
  "replay_validify_record": [
    {
      "module": "replay",
      "order": 9,
      "source": "include/modules/extra/misc/replay/main.php",
      "line": 309,
      "parameters": [
        {
          "name": "str",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "replay_record_op": [
    {
      "module": "replay",
      "order": 9,
      "source": "include/modules/extra/misc/replay/main.php",
      "line": 330,
      "parameters": [
        {
          "name": "str",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_replay_by_gnum": [
    {
      "module": "replay",
      "order": 9,
      "source": "include/modules/extra/misc/replay/main.php",
      "line": 354,
      "parameters": [
        {
          "name": "gnum",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "wmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_replay_remote": [
    {
      "module": "replay",
      "order": 9,
      "source": "include/modules/extra/misc/replay/main.php",
      "line": 396,
      "parameters": [
        {
          "name": "repfilename",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_map_display_config": [
    {
      "module": "map_display",
      "order": 10,
      "source": "include/modules/base/map_display/main.php",
      "line": 8,
      "parameters": []
    }
  ],
  "map_display_y2coor": [
    {
      "module": "map_display",
      "order": 10,
      "source": "include/modules/base/map_display/main.php",
      "line": 24,
      "parameters": [
        {
          "name": "y",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "calculate_move_sp_cost": [
    {
      "module": "explore",
      "order": 11,
      "source": "include/modules/base/explore/main.php",
      "line": 7,
      "parameters": []
    },
    {
      "module": "skill4",
      "order": 15,
      "source": "include/modules/base/skills/skill4/main.php",
      "line": 31,
      "parameters": []
    },
    {
      "module": "skill255",
      "order": 167,
      "source": "include/modules/extra/club/skills/skill255/main.php",
      "line": 29,
      "parameters": []
    },
    {
      "module": "skill561",
      "order": 250,
      "source": "include/modules/extra/card/skills/skill561/main.php",
      "line": 38,
      "parameters": []
    },
    {
      "module": "skill7",
      "order": 316,
      "source": "include/modules/extra/attr/skills/skill7/main.php",
      "line": 40,
      "parameters": []
    },
    {
      "module": "skill8",
      "order": 317,
      "source": "include/modules/extra/attr/skills/skill8/main.php",
      "line": 40,
      "parameters": []
    },
    {
      "module": "skill738",
      "order": 651,
      "source": "include/modules/extra/card/skills/skill738/main.php",
      "line": 66,
      "parameters": []
    }
  ],
  "move_to_area": [
    {
      "module": "explore",
      "order": 11,
      "source": "include/modules/base/explore/main.php",
      "line": 17,
      "parameters": [
        {
          "name": "moveto",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill717",
      "order": 289,
      "source": "include/modules/extra/card/skills/skill717/main.php",
      "line": 29,
      "parameters": [
        {
          "name": "moveto",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill5",
      "order": 314,
      "source": "include/modules/extra/attr/skills/skill5/main.php",
      "line": 69,
      "parameters": [
        {
          "name": "moveto",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill6",
      "order": 315,
      "source": "include/modules/extra/attr/skills/skill6/main.php",
      "line": 68,
      "parameters": [
        {
          "name": "moveto",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill261",
      "order": 346,
      "source": "include/modules/extra/club/skills/skill261/main.php",
      "line": 88,
      "parameters": [
        {
          "name": "moveto",
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
      "line": 132,
      "parameters": [
        {
          "name": "moveto",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "searchmemory",
      "order": 650,
      "source": "include/modules/extra/searchmemory/main.php",
      "line": 692,
      "parameters": [
        {
          "name": "moveto",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill597",
      "order": 699,
      "source": "include/modules/extra/card/skills/skill597/main.php",
      "line": 87,
      "parameters": [
        {
          "name": "moveto",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "move": [
    {
      "module": "explore",
      "order": 11,
      "source": "include/modules/base/explore/main.php",
      "line": 27,
      "parameters": [
        {
          "name": "moveto",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill589",
      "order": 264,
      "source": "include/modules/extra/card/skills/skill589/main.php",
      "line": 66,
      "parameters": [
        {
          "name": "moveto",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill961",
      "order": 410,
      "source": "include/modules/extra/instance/instance10_rogue/skill961/main.php",
      "line": 69,
      "parameters": [
        {
          "name": "moveto",
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
      "line": 519,
      "parameters": [
        {
          "name": "moveto",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "cooldown",
      "order": 618,
      "source": "include/modules/base/cooldown/main.php",
      "line": 60,
      "parameters": [
        {
          "name": "moveto",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "calculate_search_sp_cost": [
    {
      "module": "explore",
      "order": 11,
      "source": "include/modules/base/explore/main.php",
      "line": 42,
      "parameters": []
    },
    {
      "module": "skill3",
      "order": 60,
      "source": "include/modules/base/skills/skill3/main.php",
      "line": 42,
      "parameters": []
    },
    {
      "module": "skill255",
      "order": 167,
      "source": "include/modules/extra/club/skills/skill255/main.php",
      "line": 41,
      "parameters": []
    },
    {
      "module": "skill561",
      "order": 250,
      "source": "include/modules/extra/card/skills/skill561/main.php",
      "line": 45,
      "parameters": []
    },
    {
      "module": "skill7",
      "order": 316,
      "source": "include/modules/extra/attr/skills/skill7/main.php",
      "line": 48,
      "parameters": []
    },
    {
      "module": "skill8",
      "order": 317,
      "source": "include/modules/extra/attr/skills/skill8/main.php",
      "line": 48,
      "parameters": []
    },
    {
      "module": "skill410",
      "order": 463,
      "source": "include/modules/extra/card/skills/skill410/main.php",
      "line": 37,
      "parameters": []
    },
    {
      "module": "skill738",
      "order": 651,
      "source": "include/modules/extra/card/skills/skill738/main.php",
      "line": 78,
      "parameters": []
    }
  ],
  "search_area": [
    {
      "module": "explore",
      "order": 11,
      "source": "include/modules/base/explore/main.php",
      "line": 53,
      "parameters": []
    },
    {
      "module": "skill5",
      "order": 314,
      "source": "include/modules/extra/attr/skills/skill5/main.php",
      "line": 56,
      "parameters": []
    },
    {
      "module": "skill6",
      "order": 315,
      "source": "include/modules/extra/attr/skills/skill6/main.php",
      "line": 55,
      "parameters": []
    },
    {
      "module": "weather",
      "order": 376,
      "source": "include/modules/base/weather/main.php",
      "line": 216,
      "parameters": []
    },
    {
      "module": "tutorial",
      "order": 550,
      "source": "include/modules/extra/instance/instance7_tutorial/tutorial/main.php",
      "line": 1076,
      "parameters": []
    },
    {
      "module": "instance3",
      "order": 615,
      "source": "include/modules/extra/instance/instance3_ascension/main.php",
      "line": 278,
      "parameters": []
    }
  ],
  "allow_move_check": [
    {
      "module": "explore",
      "order": 11,
      "source": "include/modules/base/explore/main.php",
      "line": 60,
      "parameters": [
        {
          "name": "moveto",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "allow_search_check": [
    {
      "module": "explore",
      "order": 11,
      "source": "include/modules/base/explore/main.php",
      "line": 88,
      "parameters": []
    }
  ],
  "search": [
    {
      "module": "explore",
      "order": 11,
      "source": "include/modules/base/explore/main.php",
      "line": 109,
      "parameters": []
    },
    {
      "module": "tutorial",
      "order": 550,
      "source": "include/modules/extra/instance/instance7_tutorial/tutorial/main.php",
      "line": 536,
      "parameters": []
    },
    {
      "module": "cooldown",
      "order": 618,
      "source": "include/modules/base/cooldown/main.php",
      "line": 74,
      "parameters": []
    }
  ],
  "discover": [
    {
      "module": "explore",
      "order": 11,
      "source": "include/modules/base/explore/main.php",
      "line": 128,
      "parameters": [
        {
          "name": "schmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 578,
      "parameters": [
        {
          "name": "schmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "metman",
      "order": 19,
      "source": "include/modules/base/metman/main.php",
      "line": 302,
      "parameters": [
        {
          "name": "schmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "apm",
      "order": 27,
      "source": "include/modules/base/apm/main.php",
      "line": 24,
      "parameters": [
        {
          "name": "schmode",
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
      "line": 399,
      "parameters": [
        {
          "name": "schmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill480",
      "order": 120,
      "source": "include/modules/extra/card/skills/skill480/main.php",
      "line": 70,
      "parameters": [
        {
          "name": "schmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill556",
      "order": 251,
      "source": "include/modules/extra/card/skills/skill556/main.php",
      "line": 111,
      "parameters": [
        {
          "name": "schmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill582",
      "order": 262,
      "source": "include/modules/extra/card/skills/skill582/main.php",
      "line": 59,
      "parameters": [
        {
          "name": "schmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "event",
      "order": 325,
      "source": "include/modules/base/event/main.php",
      "line": 14,
      "parameters": [
        {
          "name": "schmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill261",
      "order": 346,
      "source": "include/modules/extra/club/skills/skill261/main.php",
      "line": 77,
      "parameters": [
        {
          "name": "schmode",
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
      "line": 550,
      "parameters": [
        {
          "name": "schmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill597",
      "order": 699,
      "source": "include/modules/extra/card/skills/skill597/main.php",
      "line": 110,
      "parameters": [
        {
          "name": "schmode",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "addnoise": [
    {
      "module": "noise",
      "order": 12,
      "source": "include/modules/base/noise/main.php",
      "line": 33,
      "parameters": [
        {
          "name": "where",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "typ",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pid1",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "pid2",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill703",
      "order": 272,
      "source": "include/modules/extra/card/skills/skill703/main.php",
      "line": 41,
      "parameters": [
        {
          "name": "where",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "typ",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pid1",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "pid2",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "getexp": [
    {
      "module": "lvlctl",
      "order": 13,
      "source": "include/modules/base/lvlctl/main.php",
      "line": 9,
      "parameters": [
        {
          "name": "v",
          "byReference": false,
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
    },
    {
      "module": "skill108",
      "order": 529,
      "source": "include/modules/extra/club/skills/skill108/main.php",
      "line": 48,
      "parameters": [
        {
          "name": "v",
          "byReference": false,
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
  "calc_upexp": [
    {
      "module": "lvlctl",
      "order": 13,
      "source": "include/modules/base/lvlctl/main.php",
      "line": 29,
      "parameters": [
        {
          "name": "l",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "calc_uplv": [
    {
      "module": "lvlctl",
      "order": 13,
      "source": "include/modules/base/lvlctl/main.php",
      "line": 35,
      "parameters": [
        {
          "name": "exp",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "exp0",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "lvlup": [
    {
      "module": "lvlctl",
      "order": 13,
      "source": "include/modules/base/lvlctl/main.php",
      "line": 41,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill411",
      "order": 71,
      "source": "include/modules/extra/card/skills/skill411/main.php",
      "line": 20,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill18",
      "order": 114,
      "source": "include/modules/extra/club/skills/skill18/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill15",
      "order": 115,
      "source": "include/modules/extra/club/skills/skill15/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill16",
      "order": 116,
      "source": "include/modules/extra/club/skills/skill16/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill17",
      "order": 117,
      "source": "include/modules/extra/club/skills/skill17/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill13",
      "order": 118,
      "source": "include/modules/extra/club/skills/skill13/main.php",
      "line": 31,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill14",
      "order": 119,
      "source": "include/modules/extra/club/skills/skill14/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill39",
      "order": 123,
      "source": "include/modules/extra/club/skills/skill39/main.php",
      "line": 58,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill29",
      "order": 124,
      "source": "include/modules/extra/club/skills/skill29/main.php",
      "line": 55,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill241",
      "order": 158,
      "source": "include/modules/extra/club/skills/skill241/main.php",
      "line": 28,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill537",
      "order": 256,
      "source": "include/modules/extra/card/skills/skill537/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill564",
      "order": 340,
      "source": "include/modules/extra/card/skills/skill564/main.php",
      "line": 138,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill24",
      "order": 371,
      "source": "include/modules/extra/club/skills/skill24/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill67",
      "order": 394,
      "source": "include/modules/extra/club/skills/skill67/main.php",
      "line": 36,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "gtype1",
      "order": 451,
      "source": "include/modules/extra/instance/gtype1/main/main.php",
      "line": 306,
      "parameters": [
        {
          "name": "pa",
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
      "line": 29,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill70",
      "order": 533,
      "source": "include/modules/extra/club/skills/skill70/main.php",
      "line": 33,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill181",
      "order": 622,
      "source": "include/modules/extra/club/skills/skill181/main.php",
      "line": 37,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill87",
      "order": 652,
      "source": "include/modules/extra/club/skills/skill87/main.php",
      "line": 36,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "get_lvllimit": [
    {
      "module": "lvlctl",
      "order": 13,
      "source": "include/modules/base/lvlctl/main.php",
      "line": 63,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill901",
      "order": 353,
      "source": "include/modules/extra/instance/instance3_ascension/skill901/main.php",
      "line": 29,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "checklvlup": [
    {
      "module": "lvlctl",
      "order": 13,
      "source": "include/modules/base/lvlctl/main.php",
      "line": 71,
      "parameters": [
        {
          "name": "v",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "skill181",
      "order": 622,
      "source": "include/modules/extra/club/skills/skill181/main.php",
      "line": 49,
      "parameters": [
        {
          "name": "v",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "bufficon_show": [
    {
      "module": "bufficons",
      "order": 14,
      "source": "include/modules/extra/misc/bufficons/main.php",
      "line": 27,
      "parameters": [
        {
          "name": "src",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "para",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "bufficons_display": [
    {
      "module": "bufficons",
      "order": 14,
      "source": "include/modules/extra/misc/bufficons/main.php",
      "line": 57,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "bufficons_display_single": [
    {
      "module": "bufficons",
      "order": 14,
      "source": "include/modules/extra/misc/bufficons/main.php",
      "line": 71,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "config",
          "byReference": false,
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
    },
    {
      "module": "skill453",
      "order": 106,
      "source": "include/modules/extra/card/skills/skill453/main.php",
      "line": 104,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "config",
          "byReference": false,
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
    },
    {
      "module": "skill483",
      "order": 110,
      "source": "include/modules/extra/card/skills/skill483/main.php",
      "line": 137,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "config",
          "byReference": false,
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
    },
    {
      "module": "skill247",
      "order": 159,
      "source": "include/modules/extra/club/skills/skill247/main.php",
      "line": 74,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "config",
          "byReference": false,
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
    },
    {
      "module": "skill_temp",
      "order": 308,
      "source": "include/modules/extra/skill_temp/main.php",
      "line": 167,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "config",
          "byReference": false,
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
    },
    {
      "module": "skill182",
      "order": 617,
      "source": "include/modules/extra/club/skills/skill182/main.php",
      "line": 116,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "config",
          "byReference": false,
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
    },
    {
      "module": "skill500",
      "order": 672,
      "source": "include/modules/extra/card/skills/skill500/main.php",
      "line": 177,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "config",
          "byReference": false,
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
  "bufficons_set_timestamp": [
    {
      "module": "bufficons",
      "order": 14,
      "source": "include/modules/extra/misc/bufficons/main.php",
      "line": 151,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "end",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "cd",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "tp",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "msec",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "bufficons_check_buff_state": [
    {
      "module": "bufficons",
      "order": 14,
      "source": "include/modules/extra/misc/bufficons/main.php",
      "line": 187,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "msec",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill_temp",
      "order": 308,
      "source": "include/modules/extra/skill_temp/main.php",
      "line": 114,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "msec",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill182",
      "order": 617,
      "source": "include/modules/extra/club/skills/skill182/main.php",
      "line": 76,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "msec",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "bufficons_check_buff_state_shell": [
    {
      "module": "bufficons",
      "order": 14,
      "source": "include/modules/extra/misc/bufficons/main.php",
      "line": 231,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "msec",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill483",
      "order": 110,
      "source": "include/modules/extra/card/skills/skill483/main.php",
      "line": 60,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "msec",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill420",
      "order": 153,
      "source": "include/modules/extra/card/skills/skill420/main.php",
      "line": 65,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "msec",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill490",
      "order": 415,
      "source": "include/modules/extra/card/skills/skill490/main.php",
      "line": 62,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "msec",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill500",
      "order": 672,
      "source": "include/modules/extra/card/skills/skill500/main.php",
      "line": 76,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "msec",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "bufficons_activate_buff": [
    {
      "module": "bufficons",
      "order": 14,
      "source": "include/modules/extra/misc/bufficons/main.php",
      "line": 256,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "end",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "cd",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "tp",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "msec",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "bufficons_impose_buff": [
    {
      "module": "bufficons",
      "order": 14,
      "source": "include/modules/extra/misc/bufficons/main.php",
      "line": 276,
      "parameters": [
        {
          "name": "token",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "end",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "cd",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "tp",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "msec",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "acquire4": [
    {
      "module": "skill4",
      "order": 15,
      "source": "include/modules/base/skills/skill4/main.php",
      "line": 7,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "lost4": [
    {
      "module": "skill4",
      "order": 15,
      "source": "include/modules/base/skills/skill4/main.php",
      "line": 12,
      "parameters": [
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "check_initnpcadd": [
    {
      "module": "npc",
      "order": 16,
      "source": "include/modules/base/npc/main.php",
      "line": 19,
      "parameters": [
        {
          "name": "typ",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "init_npcdata": [
    {
      "module": "npc",
      "order": 16,
      "source": "include/modules/base/npc/main.php",
      "line": 26,
      "parameters": [
        {
          "name": "npc",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "plslist",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "clubbase",
      "order": 49,
      "source": "include/modules/extra/club/clubbase/main.php",
      "line": 191,
      "parameters": [
        {
          "name": "npc",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "plslist",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "attrbase",
      "order": 388,
      "source": "include/modules/extra/attr/attrbase/main.php",
      "line": 396,
      "parameters": [
        {
          "name": "npc",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "plslist",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "aprilfool2018",
      "order": 596,
      "source": "include/modules/extra/activities/aprilfool2018/main/main.php",
      "line": 25,
      "parameters": [
        {
          "name": "npc",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "plslist",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "item_ext_armor",
      "order": 675,
      "source": "include/modules/extra/item_extra/item_ext_armor/main.php",
      "line": 483,
      "parameters": [
        {
          "name": "npc",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "plslist",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "get_npclist": [
    {
      "module": "npc",
      "order": 16,
      "source": "include/modules/base/npc/main.php",
      "line": 184,
      "parameters": []
    },
    {
      "module": "instance6",
      "order": 381,
      "source": "include/modules/extra/instance/instance6/main.php",
      "line": 26,
      "parameters": []
    },
    {
      "module": "instance8",
      "order": 389,
      "source": "include/modules/extra/instance/instance8_proud/main.php",
      "line": 38,
      "parameters": []
    },
    {
      "module": "instance7",
      "order": 390,
      "source": "include/modules/extra/instance/instance7_tutorial/main.php",
      "line": 19,
      "parameters": []
    },
    {
      "module": "gtype1",
      "order": 451,
      "source": "include/modules/extra/instance/gtype1/main/main.php",
      "line": 126,
      "parameters": []
    },
    {
      "module": "instance9",
      "order": 465,
      "source": "include/modules/extra/instance/instance9_rush/main.php",
      "line": 48,
      "parameters": []
    },
    {
      "module": "aprilfool2018",
      "order": 596,
      "source": "include/modules/extra/activities/aprilfool2018/main/main.php",
      "line": 11,
      "parameters": []
    },
    {
      "module": "instance3",
      "order": 615,
      "source": "include/modules/extra/instance/instance3_ascension/main.php",
      "line": 27,
      "parameters": []
    },
    {
      "module": "instance11",
      "order": 630,
      "source": "include/modules/extra/instance/instance11_observe/main.php",
      "line": 83,
      "parameters": []
    },
    {
      "module": "instance5",
      "order": 640,
      "source": "include/modules/extra/instance/instance5/main.php",
      "line": 17,
      "parameters": []
    },
    {
      "module": "instance10",
      "order": 726,
      "source": "include/modules/extra/instance/instance10_rogue/main.php",
      "line": 65,
      "parameters": []
    }
  ],
  "check_mergable": [
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 15,
      "parameters": [
        {
          "name": "ik",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "parse_itmname_words_shell": [
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 24,
      "parameters": [
        {
          "name": "name_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "pa",
          "byReference": true,
          "variadic": false,
          "optional": true
        },
        {
          "name": "elli",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "width",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "end",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "parse_itmname_words": [
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 32,
      "parameters": [
        {
          "name": "name_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "elli",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "width",
          "byReference": false,
          "variadic": false,
          "optional": true
        },
        {
          "name": "end",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "parse_itmnum_words": [
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 49,
      "parameters": [
        {
          "name": "num_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "elli",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "parse_itmk_words": [
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 65,
      "parameters": [
        {
          "name": "k_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "reveal",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "poison",
      "order": 319,
      "source": "include/modules/base/items/poison/main.php",
      "line": 15,
      "parameters": [
        {
          "name": "k_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "reveal",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "skill220",
      "order": 543,
      "source": "include/modules/extra/club/skills/skill220/main.php",
      "line": 30,
      "parameters": [
        {
          "name": "k_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "reveal",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "parse_itmk_desc": [
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 89,
      "parameters": [
        {
          "name": "k_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "sk_value",
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
      "line": 13,
      "parameters": [
        {
          "name": "k_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "sk_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "ammunition",
      "order": 352,
      "source": "include/modules/base/items/ammunition/main.php",
      "line": 43,
      "parameters": [
        {
          "name": "k_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "sk_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ],
  "count_itmsk_num": [
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 95,
      "parameters": [
        {
          "name": "sk_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "ignore_invisible",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "attrbase",
      "order": 388,
      "source": "include/modules/extra/attr/attrbase/main.php",
      "line": 254,
      "parameters": [
        {
          "name": "sk_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "ignore_invisible",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "get_itmsk_array": [
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 117,
      "parameters": [
        {
          "name": "sk_value",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "not_ignore",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "check_in_itmsk": [
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 162,
      "parameters": [
        {
          "name": "mark",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "skarr",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "count",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "attrbase",
      "order": 388,
      "source": "include/modules/extra/attr/attrbase/main.php",
      "line": 113,
      "parameters": [
        {
          "name": "mark",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "skarr",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "count",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "replace_in_itmsk": [
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 182,
      "parameters": [
        {
          "name": "needle",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "replacement",
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
          "name": "dummy",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    },
    {
      "module": "attrbase",
      "order": 388,
      "source": "include/modules/extra/attr/attrbase/main.php",
      "line": 147,
      "parameters": [
        {
          "name": "needle",
          "byReference": false,
          "variadic": false,
          "optional": false
        },
        {
          "name": "replacement",
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
          "name": "strict",
          "byReference": false,
          "variadic": false,
          "optional": true
        }
      ]
    }
  ],
  "get_itmsk_words_single": [
    {
      "module": "itemmain",
      "order": 17,
      "source": "include/modules/base/itemmain/main.php",
      "line": 189,
      "parameters": [
        {
          "name": "str",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    },
    {
      "module": "attrbase",
      "order": 388,
      "source": "include/modules/extra/attr/attrbase/main.php",
      "line": 209,
      "parameters": [
        {
          "name": "str",
          "byReference": false,
          "variadic": false,
          "optional": false
        }
      ]
    }
  ]
} as const;
