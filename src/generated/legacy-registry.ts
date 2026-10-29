/* Generated from the captured Baota ACFUN DTS baseline. Do not hand-edit. */
export const LEGACY_MODULES = [
  {
    "name": "input",
    "path": "core/input/",
    "enabled": true,
    "order": 0,
    "dependencies": [],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "sys",
    "path": "core/sys/",
    "enabled": true,
    "order": 1,
    "dependencies": [
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "global.php",
      "gamectl.php",
      "init.php",
      "news.php",
      "config/server.config.php",
      "config/resources.config.php",
      "config/game.config.php",
      "config/system.config.php",
      "config/gamemode.config.php",
      "config/version.config.php"
    ],
    "templates": []
  },
  {
    "name": "map",
    "path": "core/map/",
    "enabled": true,
    "order": 2,
    "dependencies": [
      "sys"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/map.config.php"
    ],
    "templates": [
      "profile_areainfo"
    ]
  },
  {
    "name": "bmp_util",
    "path": "extra/misc/bmp_util/",
    "enabled": true,
    "order": 3,
    "dependencies": [
      "sys"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "gameflow_base",
    "path": "core/gameflow/gameflow_base/",
    "enabled": true,
    "order": 4,
    "dependencies": [
      "sys",
      "map"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "player",
    "path": "core/player/",
    "enabled": true,
    "order": 5,
    "dependencies": [
      "sys",
      "map",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/player.config.php"
    ],
    "templates": []
  },
  {
    "name": "gameflow_antiafk",
    "path": "core/gameflow/gameflow_antiafk/",
    "enabled": true,
    "order": 6,
    "dependencies": [
      "sys",
      "map",
      "gameflow_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/gameflow_antiafk.config.php"
    ],
    "templates": []
  },
  {
    "name": "logger",
    "path": "base/logger/",
    "enabled": true,
    "order": 7,
    "dependencies": [
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skillbase",
    "path": "base/skillbase/",
    "enabled": true,
    "order": 8,
    "dependencies": [
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "replay",
    "path": "extra/misc/replay/",
    "enabled": true,
    "order": 9,
    "dependencies": [
      "sys",
      "player",
      "gameflow_base",
      "bmp_util"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "gnum_no_replay",
      "gnum_data"
    ]
  },
  {
    "name": "map_display",
    "path": "base/map_display/",
    "enabled": true,
    "order": 10,
    "dependencies": [
      "sys",
      "map",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/map_display.config.php"
    ],
    "templates": []
  },
  {
    "name": "explore",
    "path": "base/explore/",
    "enabled": true,
    "order": 11,
    "dependencies": [
      "sys",
      "input",
      "map",
      "logger",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/explore.config.php"
    ],
    "templates": [
      "explore"
    ]
  },
  {
    "name": "noise",
    "path": "base/noise/",
    "enabled": true,
    "order": 12,
    "dependencies": [
      "sys",
      "map",
      "player",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/noise.config.php"
    ],
    "templates": []
  },
  {
    "name": "lvlctl",
    "path": "base/lvlctl/",
    "enabled": true,
    "order": 13,
    "dependencies": [
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/lvlctl.config.php"
    ],
    "templates": []
  },
  {
    "name": "bufficons",
    "path": "extra/misc/bufficons/",
    "enabled": true,
    "order": 14,
    "dependencies": [
      "sys",
      "player",
      "skillbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "icon_style_1",
      "icon_style_2",
      "icon_style_3",
      "profile",
      "corner_text"
    ]
  },
  {
    "name": "skill4",
    "path": "base/skills/skill4/",
    "enabled": true,
    "order": 15,
    "dependencies": [
      "skillbase"
    ],
    "optionalDependencies": [
      "explore"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "npc",
    "path": "base/npc/",
    "enabled": true,
    "order": 16,
    "dependencies": [
      "sys",
      "map",
      "player",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/npc.data.config.php",
      "config/npc.resource.config.php"
    ],
    "templates": []
  },
  {
    "name": "itemmain",
    "path": "base/itemmain/",
    "enabled": true,
    "order": 17,
    "dependencies": [
      "sys",
      "map",
      "player",
      "logger",
      "input"
    ],
    "optionalDependencies": [
      "explore",
      "npc"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "itemuse.php",
      "itemcmd.php",
      "config/itemmain.config.php"
    ],
    "templates": [
      "itemmerge",
      "itemmove",
      "itemdrop",
      "itemmerge0",
      "itemdrop0",
      "itemfind",
      "itmcommand",
      "itmcommand_subpage",
      "profile_equipments",
      "profile_equipments_short",
      "profile_backpack",
      "profile_backpack_short"
    ]
  },
  {
    "name": "elorating",
    "path": "extra/misc/elorating/",
    "enabled": true,
    "order": 18,
    "dependencies": [
      "sys",
      "player",
      "gameflow_base"
    ],
    "optionalDependencies": [
      "itemmain"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/elorating.config.php"
    ],
    "templates": [
      "elorating"
    ]
  },
  {
    "name": "metman",
    "path": "base/metman/",
    "enabled": true,
    "order": 19,
    "dependencies": [
      "sys",
      "player",
      "explore",
      "itemmain",
      "logger",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/metman.config.php"
    ],
    "templates": [
      "meetman",
      "meetman_cmd",
      "ui_main",
      "my_profile",
      "enemy_profile"
    ]
  },
  {
    "name": "itemmix",
    "path": "base/itemmix/itemmix/",
    "enabled": true,
    "order": 20,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "itemmain",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/itemmix.config.php"
    ],
    "templates": [
      "itemmix",
      "itemmix_cmd",
      "itemmix_options",
      "itemmix_option_start",
      "itemmix_option_end"
    ]
  },
  {
    "name": "itemshop",
    "path": "base/itemshop/",
    "enabled": true,
    "order": 21,
    "dependencies": [
      "sys",
      "map",
      "player",
      "logger",
      "itemmain",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/shop.config.php"
    ],
    "templates": [
      "sp_shop",
      "shop",
      "itemshop_cmd"
    ]
  },
  {
    "name": "edible",
    "path": "base/items/edible/",
    "enabled": true,
    "order": 22,
    "dependencies": [
      "sys",
      "itemmain",
      "logger",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "boxes",
    "path": "base/items/boxes/",
    "enabled": true,
    "order": 23,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "scpdrink",
    "path": "base/items/scpdrink/",
    "enabled": true,
    "order": 24,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "item_ub",
    "path": "base/items/item_ub/",
    "enabled": true,
    "order": 25,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "item_uee",
    "path": "base/items/item_uee/",
    "enabled": true,
    "order": 26,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "apm",
    "path": "base/apm/",
    "enabled": true,
    "order": 27,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "map",
      "explore",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profile"
    ]
  },
  {
    "name": "item_addarea",
    "path": "extra/item_extra/item_addarea/",
    "enabled": true,
    "order": 28,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "map"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "radar",
    "path": "base/items/radar/",
    "enabled": true,
    "order": 29,
    "dependencies": [
      "sys",
      "map",
      "player",
      "npc",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "radar",
      "radarcmd"
    ]
  },
  {
    "name": "randnpc",
    "path": "extra/instance/instance10_rogue/randnpc/",
    "enabled": true,
    "order": 30,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "npc",
      "map"
    ],
    "optionalDependencies": [
      "itemmain"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/randnpc.config.php"
    ],
    "templates": []
  },
  {
    "name": "npc_pick_item",
    "path": "extra/misc/npc_pick_item/",
    "enabled": true,
    "order": 31,
    "dependencies": [
      "sys",
      "player",
      "npc",
      "map",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "corpse",
    "path": "base/corpse/",
    "enabled": true,
    "order": 32,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "metman",
      "input",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/corpse.config.php"
    ],
    "templates": [
      "corpse"
    ]
  },
  {
    "name": "trap",
    "path": "base/items/trap/",
    "enabled": true,
    "order": 33,
    "dependencies": [
      "sys",
      "map",
      "itemmain",
      "logger",
      "player",
      "lvlctl"
    ],
    "optionalDependencies": [
      "explore",
      "metman",
      "npc"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/trap.config.php"
    ],
    "templates": []
  },
  {
    "name": "itemmix_sync",
    "path": "base/itemmix/itemmix_sync/",
    "enabled": true,
    "order": 34,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "itemmain",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "item_uee_extra",
    "path": "extra/item_extra/item_uee_extra/",
    "enabled": true,
    "order": 35,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "logger",
      "item_uee"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "use_uee_cmd",
      "use_uee_extra"
    ]
  },
  {
    "name": "enemy",
    "path": "base/enemy/",
    "enabled": true,
    "order": 36,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "metman",
      "map",
      "corpse",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/enemy.config.php"
    ],
    "templates": [
      "battlecmd"
    ]
  },
  {
    "name": "gameflow_duel",
    "path": "core/gameflow/gameflow_duel/",
    "enabled": true,
    "order": 37,
    "dependencies": [
      "sys",
      "player",
      "gameflow_base"
    ],
    "optionalDependencies": [
      "corpse",
      "metman"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "itemmix_overlay",
    "path": "base/itemmix/itemmix_overlay/",
    "enabled": true,
    "order": 38,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "itemmain",
      "itemmix",
      "itemmix_sync"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "team",
    "path": "base/team/",
    "enabled": true,
    "order": 39,
    "dependencies": [
      "sys",
      "map",
      "logger",
      "player",
      "metman",
      "enemy",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "team.command.php",
      "config/team.config.php"
    ],
    "templates": [
      "findteam",
      "team",
      "team_command"
    ]
  },
  {
    "name": "battle",
    "path": "base/battle/",
    "enabled": true,
    "order": 40,
    "dependencies": [
      "sys",
      "logger",
      "player",
      "enemy",
      "metman",
      "corpse"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "battle.php",
      "battle_wrapper.php"
    ],
    "templates": [
      "battleresult"
    ]
  },
  {
    "name": "item_misc",
    "path": "base/items/item_misc/",
    "enabled": true,
    "order": 41,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "corpse",
      "gameflow_duel",
      "input"
    ],
    "optionalDependencies": [
      "noise"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "gameflow_combo",
    "path": "core/gameflow/gameflow_combo/",
    "enabled": true,
    "order": 42,
    "dependencies": [
      "sys",
      "player",
      "gameflow_base",
      "map"
    ],
    "optionalDependencies": [
      "corpse",
      "metman",
      "team",
      "trap"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/gameflow_combo.config.php"
    ],
    "templates": []
  },
  {
    "name": "advteam",
    "path": "extra/misc/advteam/",
    "enabled": true,
    "order": 43,
    "dependencies": [
      "sys",
      "map",
      "player",
      "team",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "team"
    ]
  },
  {
    "name": "attack",
    "path": "base/attack/",
    "enabled": true,
    "order": 44,
    "dependencies": [
      "sys",
      "map",
      "player",
      "battle"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "attack_wrapper.php",
      "attack.php",
      "attack_news.php"
    ],
    "templates": []
  },
  {
    "name": "instance0",
    "path": "extra/instance/instance0/",
    "enabled": true,
    "order": 45,
    "dependencies": [
      "sys",
      "player",
      "gameflow_combo",
      "map"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "weapon",
    "path": "base/weapon/weapon/",
    "enabled": true,
    "order": 46,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "itemmain",
      "battle",
      "attack",
      "lvlctl",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/weapon.config.php"
    ],
    "templates": [
      "att_method",
      "profile_wep",
      "profile_wep_short",
      "profile_wepskill"
    ]
  },
  {
    "name": "npcchat",
    "path": "base/npcchat/",
    "enabled": true,
    "order": 47,
    "dependencies": [
      "sys",
      "player",
      "battle",
      "attack",
      "logger",
      "npc"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/npcchat.config.php"
    ],
    "templates": []
  },
  {
    "name": "ex_vanish",
    "path": "extra/attr/ex_vanish/",
    "enabled": true,
    "order": 48,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "clubbase",
    "path": "extra/club/clubbase/",
    "enabled": true,
    "order": 49,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "enemy",
      "attack",
      "weapon",
      "npc"
    ],
    "optionalDependencies": [
      "battle"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/clubbase.config.php"
    ],
    "templates": [
      "club_profile",
      "skilldesc_start",
      "skilldesc_mid1",
      "skilldesc_mid2",
      "skilldesc_end",
      "skillpage",
      "profileskillpage",
      "skillpage_profile",
      "npcskillpage",
      "npcskill_button",
      "battlecmd_common"
    ]
  },
  {
    "name": "wep_n",
    "path": "base/weapon/wep_n/",
    "enabled": true,
    "order": 50,
    "dependencies": [
      "weapon",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "wep_p",
    "path": "base/weapon/wep_p/",
    "enabled": true,
    "order": 51,
    "dependencies": [
      "weapon",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "wep_k",
    "path": "base/weapon/wep_k/",
    "enabled": true,
    "order": 52,
    "dependencies": [
      "weapon",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "wep_c",
    "path": "base/weapon/wep_c/",
    "enabled": true,
    "order": 53,
    "dependencies": [
      "weapon",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "wep_d",
    "path": "base/weapon/wep_d/",
    "enabled": true,
    "order": 54,
    "dependencies": [
      "weapon",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "wep_f",
    "path": "base/weapon/wep_f/",
    "enabled": true,
    "order": 55,
    "dependencies": [
      "weapon",
      "logger",
      "itemmain"
    ],
    "optionalDependencies": [
      "noise"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "item_um",
    "path": "base/items/item_um/",
    "enabled": true,
    "order": 56,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "weapon",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "mapattr",
    "path": "base/mapattr/",
    "enabled": true,
    "order": 57,
    "dependencies": [
      "sys",
      "map",
      "player"
    ],
    "optionalDependencies": [
      "itemmain",
      "metman",
      "weapon",
      "trap"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/mapattr.config.php"
    ],
    "templates": []
  },
  {
    "name": "wound",
    "path": "base/wound/",
    "enabled": true,
    "order": 58,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "skillbase"
    ],
    "optionalDependencies": [
      "battle",
      "weapon",
      "metman"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/wound.config.php"
    ],
    "templates": [
      "wound_profile",
      "wound_profile_battle",
      "wound_picture"
    ]
  },
  {
    "name": "skill2",
    "path": "base/skills/skill2/",
    "enabled": true,
    "order": 59,
    "dependencies": [
      "skillbase"
    ],
    "optionalDependencies": [
      "weapon"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill3",
    "path": "base/skills/skill3/",
    "enabled": true,
    "order": 60,
    "dependencies": [
      "skillbase"
    ],
    "optionalDependencies": [
      "weapon",
      "explore"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "item_uv",
    "path": "base/items/item_uv/",
    "enabled": true,
    "order": 61,
    "dependencies": [
      "sys",
      "player",
      "weapon",
      "itemmain",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill21",
    "path": "extra/club/skills/skill21/",
    "enabled": true,
    "order": 62,
    "dependencies": [
      "sys",
      "player",
      "clubbase",
      "map",
      "lvlctl",
      "logger",
      "skillbase",
      "attack",
      "battle"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/evonpc.config.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill533",
    "path": "extra/card/skills/skill533/",
    "enabled": true,
    "order": 63,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill11",
    "path": "extra/club/skills/skill11/",
    "enabled": true,
    "order": 64,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill10",
    "path": "extra/club/skills/skill10/",
    "enabled": true,
    "order": 65,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill305",
    "path": "extra/achievement/skills/skill305/",
    "enabled": true,
    "order": 66,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill306",
    "path": "extra/achievement/skills/skill306/",
    "enabled": true,
    "order": 67,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill324",
    "path": "extra/achievement/skills/skill324/",
    "enabled": true,
    "order": 68,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill328",
    "path": "extra/activities/nationalday2017/skill328/",
    "enabled": true,
    "order": 69,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill330",
    "path": "extra/activities/halloween2017/skill330/",
    "enabled": true,
    "order": 70,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill411",
    "path": "extra/card/skills/skill411/",
    "enabled": true,
    "order": 71,
    "dependencies": [
      "skillbase",
      "clubbase",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill413",
    "path": "extra/card/skills/skill413/",
    "enabled": true,
    "order": 72,
    "dependencies": [
      "skillbase",
      "clubbase",
      "itemmix",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill308",
    "path": "extra/achievement/skills/skill308/",
    "enabled": true,
    "order": 73,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill309",
    "path": "extra/achievement/skills/skill309/",
    "enabled": true,
    "order": 74,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill317",
    "path": "extra/achievement/skills/skill317/",
    "enabled": true,
    "order": 75,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill319",
    "path": "extra/achievement/skills/skill319/",
    "enabled": true,
    "order": 76,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill320",
    "path": "extra/achievement/skills/skill320/",
    "enabled": true,
    "order": 77,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill431",
    "path": "extra/card/skills/skill431/",
    "enabled": true,
    "order": 78,
    "dependencies": [
      "skillbase",
      "clubbase",
      "itemmix",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill22",
    "path": "extra/club/skills/skill22/",
    "enabled": true,
    "order": 79,
    "dependencies": [
      "skillbase",
      "clubbase",
      "trap",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill316",
    "path": "extra/achievement/skills/skill316/",
    "enabled": true,
    "order": 80,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill321",
    "path": "extra/achievement/skills/skill321/",
    "enabled": true,
    "order": 81,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill310",
    "path": "extra/achievement/skills/skill310/",
    "enabled": true,
    "order": 82,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill311",
    "path": "extra/achievement/skills/skill311/",
    "enabled": true,
    "order": 83,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill312",
    "path": "extra/achievement/skills/skill312/",
    "enabled": true,
    "order": 84,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill314",
    "path": "extra/achievement/skills/skill314/",
    "enabled": true,
    "order": 85,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill443",
    "path": "extra/card/skills/skill443/",
    "enabled": true,
    "order": 86,
    "dependencies": [
      "skillbase",
      "clubbase",
      "corpse",
      "battle",
      "attack",
      "enemy",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill477",
    "path": "extra/card/skills/skill477/",
    "enabled": true,
    "order": 87,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill479",
    "path": "extra/card/skills/skill479/",
    "enabled": true,
    "order": 88,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack",
      "trap"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill327",
    "path": "extra/activities/nationalday2017/skill327/",
    "enabled": true,
    "order": 89,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill437",
    "path": "extra/card/skills/skill437/",
    "enabled": true,
    "order": 90,
    "dependencies": [
      "skillbase",
      "clubbase",
      "weapon",
      "lvlctl",
      "logger",
      "enemy"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill442",
    "path": "extra/card/skills/skill442/",
    "enabled": true,
    "order": 91,
    "dependencies": [
      "skillbase",
      "clubbase",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill452",
    "path": "extra/card/skills/skill452/",
    "enabled": true,
    "order": 92,
    "dependencies": [
      "skillbase",
      "clubbase",
      "map",
      "sys",
      "logger",
      "weapon",
      "attack",
      "battle"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill459",
    "path": "extra/card/skills/skill459/",
    "enabled": true,
    "order": 93,
    "dependencies": [
      "skillbase",
      "clubbase",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill1001",
    "path": "extra/instance/skill1001/",
    "enabled": true,
    "order": 94,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill204",
    "path": "extra/club/skills/skill204/",
    "enabled": true,
    "order": 95,
    "dependencies": [
      "skillbase",
      "clubbase",
      "corpse",
      "battle",
      "attack",
      "enemy",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill485",
    "path": "extra/card/skills/skill485/",
    "enabled": true,
    "order": 96,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill486",
    "path": "extra/card/skills/skill486/",
    "enabled": true,
    "order": 97,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill488",
    "path": "extra/card/skills/skill488/",
    "enabled": true,
    "order": 98,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill52",
    "path": "extra/club/skills/skill52/",
    "enabled": true,
    "order": 99,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill71",
    "path": "extra/club/skills/skill71/",
    "enabled": true,
    "order": 100,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "sys",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill414",
    "path": "extra/card/skills/skill414/",
    "enabled": true,
    "order": 101,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill519",
    "path": "extra/card/skills/skill519/",
    "enabled": true,
    "order": 102,
    "dependencies": [
      "clubbase",
      "skillbase",
      "map",
      "sys",
      "player",
      "logger",
      "attack",
      "trap",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill520",
    "path": "extra/card/skills/skill520/",
    "enabled": true,
    "order": 103,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill446",
    "path": "extra/card/skills/skill446/",
    "enabled": true,
    "order": 104,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill447",
    "path": "extra/card/skills/skill447/",
    "enabled": true,
    "order": 105,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "sys",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill453",
    "path": "extra/card/skills/skill453/",
    "enabled": true,
    "order": 106,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill455",
    "path": "extra/card/skills/skill455/",
    "enabled": true,
    "order": 107,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack",
      "bufficons",
      "trap"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill456",
    "path": "extra/card/skills/skill456/",
    "enabled": true,
    "order": 108,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill253",
    "path": "extra/club/skills/skill253/",
    "enabled": true,
    "order": 109,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill483",
    "path": "extra/card/skills/skill483/",
    "enabled": true,
    "order": 110,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill1002",
    "path": "extra/instance/skill1002/",
    "enabled": true,
    "order": 111,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack",
      "bufficons",
      "trap"
    ],
    "optionalDependencies": [
      "corpse"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill499",
    "path": "extra/card/skills/skill499/",
    "enabled": true,
    "order": 112,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack",
      "bufficons",
      "trap"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill69",
    "path": "extra/club/skills/skill69/",
    "enabled": true,
    "order": 113,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "itemshop"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill18",
    "path": "extra/club/skills/skill18/",
    "enabled": true,
    "order": 114,
    "dependencies": [
      "skillbase",
      "clubbase",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill15",
    "path": "extra/club/skills/skill15/",
    "enabled": true,
    "order": 115,
    "dependencies": [
      "skillbase",
      "clubbase",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill16",
    "path": "extra/club/skills/skill16/",
    "enabled": true,
    "order": 116,
    "dependencies": [
      "skillbase",
      "clubbase",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill17",
    "path": "extra/club/skills/skill17/",
    "enabled": true,
    "order": 117,
    "dependencies": [
      "skillbase",
      "clubbase",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill13",
    "path": "extra/club/skills/skill13/",
    "enabled": true,
    "order": 118,
    "dependencies": [
      "skillbase",
      "clubbase",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill14",
    "path": "extra/club/skills/skill14/",
    "enabled": true,
    "order": 119,
    "dependencies": [
      "skillbase",
      "clubbase",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill480",
    "path": "extra/card/skills/skill480/",
    "enabled": true,
    "order": 120,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "explore"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill1011",
    "path": "extra/gmskills/skill1011/",
    "enabled": true,
    "order": 121,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "map",
      "input",
      "logger",
      "itemmain",
      "itemmix"
    ],
    "optionalDependencies": [
      "itemmix_sync",
      "itemmix_overlay"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "profilecmd",
      "cons_page"
    ]
  },
  {
    "name": "skill1010",
    "path": "extra/gmskills/skill1010/",
    "enabled": true,
    "order": 122,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "input",
      "logger",
      "enemy"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "profilecmd",
      "mani_page"
    ]
  },
  {
    "name": "skill39",
    "path": "extra/club/skills/skill39/",
    "enabled": true,
    "order": 123,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill29",
    "path": "extra/club/skills/skill29/",
    "enabled": true,
    "order": 124,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill421",
    "path": "extra/card/skills/skill421/",
    "enabled": true,
    "order": 125,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "edible"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill40",
    "path": "extra/club/skills/skill40/",
    "enabled": true,
    "order": 126,
    "dependencies": [
      "skillbase",
      "clubbase",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "club1",
    "path": "extra/club/clubs/club1/",
    "enabled": true,
    "order": 127,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club2",
    "path": "extra/club/clubs/club2/",
    "enabled": true,
    "order": 128,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club3",
    "path": "extra/club/clubs/club3/",
    "enabled": true,
    "order": 129,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club4",
    "path": "extra/club/clubs/club4/",
    "enabled": true,
    "order": 130,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club5",
    "path": "extra/club/clubs/club5/",
    "enabled": true,
    "order": 131,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club9",
    "path": "extra/club/clubs/club9/",
    "enabled": true,
    "order": 132,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club10",
    "path": "extra/club/clubs/club10/",
    "enabled": true,
    "order": 133,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club99",
    "path": "extra/club/clubs/club99/",
    "enabled": true,
    "order": 134,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club17",
    "path": "extra/club/clubs/club17/",
    "enabled": true,
    "order": 135,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club20",
    "path": "extra/club/clubs/club20/",
    "enabled": true,
    "order": 136,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club13",
    "path": "extra/club/clubs/club13/",
    "enabled": true,
    "order": 137,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club14",
    "path": "extra/club/clubs/club14/",
    "enabled": true,
    "order": 138,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "sklearn_util",
    "path": "extra/club/sklearn_util/",
    "enabled": true,
    "order": 139,
    "dependencies": [
      "sys",
      "player",
      "clubbase",
      "skillbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "skilllearn_table",
      "skilllearn_desc"
    ]
  },
  {
    "name": "club6",
    "path": "extra/club/clubs/club6/",
    "enabled": true,
    "order": 140,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club8",
    "path": "extra/club/clubs/club8/",
    "enabled": true,
    "order": 141,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club7",
    "path": "extra/club/clubs/club7/",
    "enabled": true,
    "order": 142,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club11",
    "path": "extra/club/clubs/club11/",
    "enabled": true,
    "order": 143,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club19",
    "path": "extra/club/clubs/club19/",
    "enabled": true,
    "order": 144,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill58",
    "path": "extra/club/skills/skill58/",
    "enabled": true,
    "order": 145,
    "dependencies": [
      "clubbase",
      "skillbase",
      "map",
      "sys",
      "player",
      "logger",
      "attack",
      "trap"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "club24",
    "path": "extra/club/clubs/club24/",
    "enabled": true,
    "order": 146,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club18",
    "path": "extra/club/clubs/club18/",
    "enabled": true,
    "order": 147,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill211",
    "path": "extra/club/skills/skill211/",
    "enabled": true,
    "order": 148,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "metman",
      "enemy",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill212",
    "path": "extra/club/skills/skill212/",
    "enabled": true,
    "order": 149,
    "dependencies": [
      "clubbase",
      "skillbase",
      "player",
      "trap",
      "itemmain",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill214",
    "path": "extra/club/skills/skill214/",
    "enabled": true,
    "order": 150,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "input",
      "metman",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill234",
    "path": "extra/club/skills/skill234/",
    "enabled": true,
    "order": 151,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/skill234.config.php"
    ],
    "templates": [
      "profilecmd",
      "desc"
    ]
  },
  {
    "name": "skill235",
    "path": "extra/club/skills/skill235/",
    "enabled": true,
    "order": 152,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmain",
      "radar"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "desc"
    ]
  },
  {
    "name": "skill420",
    "path": "extra/card/skills/skill420/",
    "enabled": true,
    "order": 153,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "itemmain",
      "sys",
      "logger",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill424",
    "path": "extra/instance/gtype1/skill424/",
    "enabled": true,
    "order": 154,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "map",
      "player",
      "logger",
      "attack",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/skill424.config.php"
    ],
    "templates": [
      "profilecmd",
      "desc"
    ]
  },
  {
    "name": "skill428",
    "path": "extra/instance/gtype1/skill428/",
    "enabled": true,
    "order": 155,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "trap"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "club21",
    "path": "extra/club/clubs/club21/",
    "enabled": true,
    "order": 156,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill240",
    "path": "extra/club/skills/skill240/",
    "enabled": true,
    "order": 157,
    "dependencies": [
      "skillbase",
      "clubbase",
      "trap",
      "enemy"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill241",
    "path": "extra/club/skills/skill241/",
    "enabled": true,
    "order": 158,
    "dependencies": [
      "skillbase",
      "clubbase",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill247",
    "path": "extra/club/skills/skill247/",
    "enabled": true,
    "order": 159,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys",
      "logger",
      "trap",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill454",
    "path": "extra/card/skills/skill454/",
    "enabled": true,
    "order": 160,
    "dependencies": [
      "skillbase",
      "clubbase",
      "itemshop"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill457",
    "path": "extra/card/skills/skill457/",
    "enabled": true,
    "order": 161,
    "dependencies": [
      "skillbase",
      "clubbase",
      "trap"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill249",
    "path": "extra/club/skills/skill249/",
    "enabled": true,
    "order": 162,
    "dependencies": [
      "skillbase",
      "clubbase",
      "trap"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill250",
    "path": "extra/club/skills/skill250/",
    "enabled": true,
    "order": 163,
    "dependencies": [
      "skillbase",
      "clubbase",
      "trap"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill460",
    "path": "extra/card/skills/skill460/",
    "enabled": true,
    "order": 164,
    "dependencies": [
      "skillbase",
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill461",
    "path": "extra/card/skills/skill461/",
    "enabled": true,
    "order": 165,
    "dependencies": [
      "skillbase",
      "clubbase",
      "battle"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill251",
    "path": "extra/club/skills/skill251/",
    "enabled": true,
    "order": 166,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "bufficons",
      "attack",
      "logger",
      "trap"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill255",
    "path": "extra/club/skills/skill255/",
    "enabled": true,
    "order": 167,
    "dependencies": [
      "player",
      "clubbase",
      "skillbase",
      "explore",
      "trap"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill462",
    "path": "extra/card/skills/skill462/",
    "enabled": true,
    "order": 168,
    "dependencies": [
      "skillbase",
      "clubbase",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill257",
    "path": "extra/club/skills/skill257/",
    "enabled": true,
    "order": 169,
    "dependencies": [
      "skillbase",
      "clubbase",
      "trap"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill474",
    "path": "extra/card/skills/skill474/",
    "enabled": true,
    "order": 170,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "edible",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill484",
    "path": "extra/card/skills/skill484/",
    "enabled": true,
    "order": 171,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill491",
    "path": "extra/card/skills/skill491/",
    "enabled": true,
    "order": 172,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys",
      "attack",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "club97",
    "path": "extra/club/clubs/club97/",
    "enabled": true,
    "order": 173,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill267",
    "path": "extra/club/skills/skill267/",
    "enabled": true,
    "order": 174,
    "dependencies": [
      "clubbase",
      "skillbase",
      "player",
      "battle",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill268",
    "path": "extra/club/skills/skill268/",
    "enabled": true,
    "order": 175,
    "dependencies": [
      "clubbase",
      "skillbase",
      "sys",
      "player",
      "logger",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "club94",
    "path": "extra/club/clubs/club94/",
    "enabled": true,
    "order": 176,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club95",
    "path": "extra/club/clubs/club95/",
    "enabled": true,
    "order": 177,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "club96",
    "path": "extra/club/clubs/club96/",
    "enabled": true,
    "order": 178,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill494",
    "path": "extra/instance/gtype1/skill494/",
    "enabled": true,
    "order": 179,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill495",
    "path": "extra/instance/gtype1/skill495/",
    "enabled": true,
    "order": 180,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "corpse"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill501",
    "path": "extra/card/skills/skill501/",
    "enabled": true,
    "order": 181,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill83",
    "path": "extra/club/skills/skill83/",
    "enabled": true,
    "order": 182,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill256",
    "path": "extra/club/skills/skill256/",
    "enabled": true,
    "order": 183,
    "dependencies": [
      "skillbase",
      "clubbase",
      "lvlctl",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill433",
    "path": "extra/card/skills/skill433/",
    "enabled": true,
    "order": 184,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "attack",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill221",
    "path": "extra/club/skills/skill221/",
    "enabled": true,
    "order": 185,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "attack",
      "battle",
      "logger",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill41",
    "path": "extra/club/skills/skill41/",
    "enabled": true,
    "order": 186,
    "dependencies": [
      "skillbase",
      "clubbase",
      "battle",
      "attack",
      "logger",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill45",
    "path": "extra/club/skills/skill45/",
    "enabled": true,
    "order": 187,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill46",
    "path": "extra/club/skills/skill46/",
    "enabled": true,
    "order": 188,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill60",
    "path": "extra/club/skills/skill60/",
    "enabled": true,
    "order": 189,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "attack",
      "battle",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill61",
    "path": "extra/club/skills/skill61/",
    "enabled": true,
    "order": 190,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "attack",
      "battle",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill62",
    "path": "extra/club/skills/skill62/",
    "enabled": true,
    "order": 191,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill63",
    "path": "extra/club/skills/skill63/",
    "enabled": true,
    "order": 192,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "attack",
      "battle",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill64",
    "path": "extra/club/skills/skill64/",
    "enabled": true,
    "order": 193,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "attack",
      "battle",
      "logger",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill66",
    "path": "extra/club/skills/skill66/",
    "enabled": true,
    "order": 194,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill74",
    "path": "extra/club/skills/skill74/",
    "enabled": true,
    "order": 195,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "sys",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill213",
    "path": "extra/club/skills/skill213/",
    "enabled": true,
    "order": 196,
    "dependencies": [
      "skillbase",
      "clubbase",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill216",
    "path": "extra/club/skills/skill216/",
    "enabled": true,
    "order": 197,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys",
      "logger",
      "battle",
      "weapon",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill404",
    "path": "extra/card/skills/skill404/",
    "enabled": true,
    "order": 198,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill405",
    "path": "extra/card/skills/skill405/",
    "enabled": true,
    "order": 199,
    "dependencies": [
      "skillbase",
      "clubbase",
      "metman",
      "player",
      "weapon",
      "attack",
      "logger",
      "enemy"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill406",
    "path": "extra/card/skills/skill406/",
    "enabled": true,
    "order": 200,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill400",
    "path": "extra/card/skills/skill400/",
    "enabled": true,
    "order": 201,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill402",
    "path": "extra/card/skills/skill402/",
    "enabled": true,
    "order": 202,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill401",
    "path": "extra/card/skills/skill401/",
    "enabled": true,
    "order": 203,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill225",
    "path": "extra/club/skills/skill225/",
    "enabled": true,
    "order": 204,
    "dependencies": [
      "skillbase",
      "clubbase",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill226",
    "path": "extra/club/skills/skill226/",
    "enabled": true,
    "order": 205,
    "dependencies": [
      "skillbase",
      "clubbase",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill229",
    "path": "extra/club/skills/skill229/",
    "enabled": true,
    "order": 206,
    "dependencies": [
      "skillbase",
      "clubbase",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill408",
    "path": "extra/card/skills/skill408/",
    "enabled": true,
    "order": 207,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill409",
    "path": "extra/card/skills/skill409/",
    "enabled": true,
    "order": 208,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "trap",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill415",
    "path": "extra/card/skills/skill415/",
    "enabled": true,
    "order": 209,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill412",
    "path": "extra/card/skills/skill412/",
    "enabled": true,
    "order": 210,
    "dependencies": [
      "sys",
      "skillbase",
      "metman",
      "player",
      "weapon",
      "attack",
      "logger",
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill416",
    "path": "extra/card/skills/skill416/",
    "enabled": true,
    "order": 211,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill419",
    "path": "extra/card/skills/skill419/",
    "enabled": true,
    "order": 212,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill423",
    "path": "extra/card/skills/skill423/",
    "enabled": true,
    "order": 213,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill239",
    "path": "extra/club/skills/skill239/",
    "enabled": true,
    "order": 214,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill438",
    "path": "extra/card/skills/skill438/",
    "enabled": true,
    "order": 215,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill439",
    "path": "extra/card/skills/skill439/",
    "enabled": true,
    "order": 216,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill440",
    "path": "extra/card/skills/skill440/",
    "enabled": true,
    "order": 217,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill449",
    "path": "extra/card/skills/skill449/",
    "enabled": true,
    "order": 218,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill450",
    "path": "extra/card/skills/skill450/",
    "enabled": true,
    "order": 219,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill464",
    "path": "extra/card/skills/skill464/",
    "enabled": true,
    "order": 220,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "attack",
      "weapon",
      "itemmain",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill466",
    "path": "extra/card/skills/skill466/",
    "enabled": true,
    "order": 221,
    "dependencies": [
      "skillbase",
      "clubbase",
      "attack",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill469",
    "path": "extra/card/skills/skill469/",
    "enabled": true,
    "order": 222,
    "dependencies": [
      "sys",
      "skillbase",
      "player",
      "weapon",
      "logger",
      "clubbase",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill470",
    "path": "extra/card/skills/skill470/",
    "enabled": true,
    "order": 223,
    "dependencies": [
      "sys",
      "skillbase",
      "player",
      "weapon",
      "logger",
      "clubbase",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill471",
    "path": "extra/card/skills/skill471/",
    "enabled": true,
    "order": 224,
    "dependencies": [
      "sys",
      "skillbase",
      "player",
      "weapon",
      "logger",
      "clubbase",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill473",
    "path": "extra/card/skills/skill473/",
    "enabled": true,
    "order": 225,
    "dependencies": [
      "skillbase",
      "clubbase",
      "attack",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill262",
    "path": "extra/club/skills/skill262/",
    "enabled": true,
    "order": 226,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "itemmain",
      "sys",
      "logger",
      "enemy",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "sk262ui"
    ]
  },
  {
    "name": "skill263",
    "path": "extra/club/skills/skill263/",
    "enabled": true,
    "order": 227,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "attack",
      "itemmain",
      "sys",
      "logger",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill264",
    "path": "extra/club/skills/skill264/",
    "enabled": true,
    "order": 228,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "battle",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill476",
    "path": "extra/instance/gtype3/skill476/",
    "enabled": true,
    "order": 229,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill269",
    "path": "extra/club/skills/skill269/",
    "enabled": true,
    "order": 230,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill78",
    "path": "extra/club/skills/skill78/",
    "enabled": true,
    "order": 231,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill496",
    "path": "extra/card/skills/skill496/",
    "enabled": true,
    "order": 232,
    "dependencies": [
      "skillbase",
      "clubbase",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill506",
    "path": "extra/card/skills/skill506/",
    "enabled": true,
    "order": 233,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill515",
    "path": "extra/card/skills/skill515/",
    "enabled": true,
    "order": 234,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "battle",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill516",
    "path": "extra/card/skills/skill516/",
    "enabled": true,
    "order": 235,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "battle",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "club15",
    "path": "extra/club/clubs/club15/",
    "enabled": true,
    "order": 236,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill518",
    "path": "extra/card/skills/skill518/",
    "enabled": true,
    "order": 237,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack",
      "trap",
      "map"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill84",
    "path": "extra/club/skills/skill84/",
    "enabled": true,
    "order": 238,
    "dependencies": [
      "skillbase",
      "clubbase",
      "bufficons",
      "player",
      "sys",
      "enemy",
      "radar"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill527",
    "path": "extra/card/skills/skill527/",
    "enabled": true,
    "order": 239,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill528",
    "path": "extra/card/skills/skill528/",
    "enabled": true,
    "order": 240,
    "dependencies": [
      "skillbase",
      "clubbase",
      "logger",
      "weapon",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill529",
    "path": "extra/card/skills/skill529/",
    "enabled": true,
    "order": 241,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill531",
    "path": "extra/card/skills/skill531/",
    "enabled": true,
    "order": 242,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack",
      "battle",
      "itemmain",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill532",
    "path": "extra/card/skills/skill532/",
    "enabled": true,
    "order": 243,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill552",
    "path": "extra/card/skills/skill552/",
    "enabled": true,
    "order": 244,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "battle",
      "attack",
      "enemy",
      "logger",
      "input",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "desc"
    ]
  },
  {
    "name": "skill1012",
    "path": "extra/gmskills/skill1012/",
    "enabled": true,
    "order": 245,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "input",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "profilecmd",
      "sub_page"
    ]
  },
  {
    "name": "skill553",
    "path": "extra/card/skills/skill553/",
    "enabled": true,
    "order": 246,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "edible"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill555",
    "path": "extra/card/skills/skill555/",
    "enabled": true,
    "order": 247,
    "dependencies": [
      "sys",
      "logger",
      "player",
      "skillbase",
      "clubbase",
      "bufficons",
      "metman"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill560",
    "path": "extra/card/skills/skill560/",
    "enabled": true,
    "order": 248,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "battle",
      "attack",
      "logger",
      "enemy"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill534",
    "path": "extra/card/skills/skill534/",
    "enabled": true,
    "order": 249,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmain",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "castsk534",
      "desc"
    ]
  },
  {
    "name": "skill561",
    "path": "extra/card/skills/skill561/",
    "enabled": true,
    "order": 250,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "explore"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill556",
    "path": "extra/card/skills/skill556/",
    "enabled": true,
    "order": 251,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "attack",
      "explore",
      "map"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill275",
    "path": "extra/club/skills/skill275/",
    "enabled": true,
    "order": 252,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill276",
    "path": "extra/club/skills/skill276/",
    "enabled": true,
    "order": 253,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill536",
    "path": "extra/card/skills/skill536/",
    "enabled": true,
    "order": 254,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill565",
    "path": "extra/card/skills/skill565/",
    "enabled": true,
    "order": 255,
    "dependencies": [
      "clubbase",
      "skillbase",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill537",
    "path": "extra/card/skills/skill537/",
    "enabled": true,
    "order": 256,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill569",
    "path": "extra/card/skills/skill569/",
    "enabled": true,
    "order": 257,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "map",
      "player",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill571",
    "path": "extra/card/skills/skill571/",
    "enabled": true,
    "order": 258,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill572",
    "path": "extra/card/skills/skill572/",
    "enabled": true,
    "order": 259,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "map",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill577",
    "path": "extra/card/skills/skill577/",
    "enabled": true,
    "order": 260,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill581",
    "path": "extra/card/skills/skill581/",
    "enabled": true,
    "order": 261,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "itemmix",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill582",
    "path": "extra/card/skills/skill582/",
    "enabled": true,
    "order": 262,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "input",
      "metman",
      "explore"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill583",
    "path": "extra/card/skills/skill583/",
    "enabled": true,
    "order": 263,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill589",
    "path": "extra/card/skills/skill589/",
    "enabled": true,
    "order": 264,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "input",
      "map",
      "explore",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "desc"
    ]
  },
  {
    "name": "skill590",
    "path": "extra/card/skills/skill590/",
    "enabled": true,
    "order": 265,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill539",
    "path": "extra/card/skills/skill539/",
    "enabled": true,
    "order": 266,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill591",
    "path": "extra/card/skills/skill591/",
    "enabled": true,
    "order": 267,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill594",
    "path": "extra/card/skills/skill594/",
    "enabled": true,
    "order": 268,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill574",
    "path": "extra/card/skills/skill574/",
    "enabled": true,
    "order": 269,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "itemmain",
      "edible"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill702",
    "path": "extra/card/skills/skill702/",
    "enabled": true,
    "order": 270,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "metman"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill704",
    "path": "extra/card/skills/skill704/",
    "enabled": true,
    "order": 271,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "battle"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill703",
    "path": "extra/card/skills/skill703/",
    "enabled": true,
    "order": 272,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "battle",
      "noise"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill706",
    "path": "extra/card/skills/skill706/",
    "enabled": true,
    "order": 273,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "npc",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill708",
    "path": "extra/card/skills/skill708/",
    "enabled": true,
    "order": 274,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill301",
    "path": "extra/achievement/skills/skill301/",
    "enabled": true,
    "order": 275,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "item_misc"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill307",
    "path": "extra/achievement/skills/skill307/",
    "enabled": true,
    "order": 276,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "item_misc"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill318",
    "path": "extra/achievement/skills/skill318/",
    "enabled": true,
    "order": 277,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "item_misc"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill322",
    "path": "extra/achievement/skills/skill322/",
    "enabled": true,
    "order": 278,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "item_misc"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill323",
    "path": "extra/achievement/skills/skill323/",
    "enabled": true,
    "order": 279,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "item_misc"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill715",
    "path": "extra/card/skills/skill715/",
    "enabled": true,
    "order": 280,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmain",
      "attack",
      "battle"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill586",
    "path": "extra/card/skills/skill586/",
    "enabled": true,
    "order": 281,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "attack",
      "battle",
      "itemmain",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "castsk586",
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill902",
    "path": "extra/instance/instance3_ascension/skill902/",
    "enabled": true,
    "order": 282,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill907",
    "path": "extra/instance/instance3_ascension/skill907/",
    "enabled": true,
    "order": 283,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill904",
    "path": "extra/instance/instance3_ascension/skill904/",
    "enabled": true,
    "order": 284,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill801",
    "path": "extra/card/skills/skill801/",
    "enabled": true,
    "order": 285,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill802",
    "path": "extra/card/skills/skill802/",
    "enabled": true,
    "order": 286,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack",
      "corpse"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill716",
    "path": "extra/card/skills/skill716/",
    "enabled": true,
    "order": 287,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "input",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd"
    ]
  },
  {
    "name": "skill718",
    "path": "extra/card/skills/skill718/",
    "enabled": true,
    "order": 288,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill717",
    "path": "extra/card/skills/skill717/",
    "enabled": true,
    "order": 289,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "map",
      "explore",
      "itemmain",
      "itemshop",
      "metman",
      "corpse"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill719",
    "path": "extra/card/skills/skill719/",
    "enabled": true,
    "order": 290,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "weapon",
      "attack",
      "enemy",
      "itemmain",
      "metman"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill85",
    "path": "extra/club/skills/skill85/",
    "enabled": true,
    "order": 291,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "attack",
      "weapon",
      "logger",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill952",
    "path": "extra/instance/instance10_rogue/skill952/",
    "enabled": true,
    "order": 292,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmain",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "castsk952",
      "desc"
    ]
  },
  {
    "name": "skill951",
    "path": "extra/instance/instance10_rogue/skill951/",
    "enabled": true,
    "order": 293,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill724",
    "path": "extra/card/skills/skill724/",
    "enabled": true,
    "order": 294,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "map"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "club25",
    "path": "extra/club/clubs/club25/",
    "enabled": true,
    "order": 295,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill95",
    "path": "extra/club/skills/skill95/",
    "enabled": true,
    "order": 296,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "metman",
      "enemy",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "club26",
    "path": "extra/club/clubs/club26/",
    "enabled": true,
    "order": 297,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill725",
    "path": "extra/card/skills/skill725/",
    "enabled": true,
    "order": 298,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "corpse",
      "itemmain",
      "edible"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill804",
    "path": "extra/card/skills/skill804/",
    "enabled": true,
    "order": 299,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill728",
    "path": "extra/card/skills/skill728/",
    "enabled": true,
    "order": 300,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "castsk728"
    ]
  },
  {
    "name": "skill735",
    "path": "extra/card/skills/skill735/",
    "enabled": true,
    "order": 301,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill736",
    "path": "extra/card/skills/skill736/",
    "enabled": true,
    "order": 302,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "attack",
      "corpse"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill110",
    "path": "extra/club/skills/skill110/",
    "enabled": true,
    "order": 303,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "castsk110"
    ]
  },
  {
    "name": "club27",
    "path": "extra/club/clubs/club27/",
    "enabled": true,
    "order": 304,
    "dependencies": [
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill1013",
    "path": "extra/gmskills/skill1013/",
    "enabled": true,
    "order": 305,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "input",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "profilecmd",
      "sub_page"
    ]
  },
  {
    "name": "skill743",
    "path": "extra/card/skills/skill743/",
    "enabled": true,
    "order": 306,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "trap"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill744",
    "path": "extra/card/skills/skill744/",
    "enabled": true,
    "order": 307,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "trap"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill_temp",
    "path": "extra/skill_temp/",
    "enabled": true,
    "order": 308,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill606",
    "path": "extra/club/skills/skill606/",
    "enabled": true,
    "order": 309,
    "dependencies": [
      "skillbase",
      "clubbase",
      "bufficons",
      "player",
      "sys"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "wep_g",
    "path": "base/weapon/wep_g/",
    "enabled": true,
    "order": 310,
    "dependencies": [
      "weapon",
      "itemmain",
      "wep_p"
    ],
    "optionalDependencies": [
      "noise"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "wep_j",
    "path": "base/weapon/wep_j/",
    "enabled": true,
    "order": 311,
    "dependencies": [
      "weapon",
      "player",
      "itemmain",
      "wep_p",
      "attack"
    ],
    "optionalDependencies": [
      "noise",
      "clubbase"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill273",
    "path": "extra/club/skills/skill273/",
    "enabled": true,
    "order": 312,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "attack",
      "sys",
      "logger",
      "weapon",
      "wep_c"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill209",
    "path": "extra/club/skills/skill209/",
    "enabled": true,
    "order": 313,
    "dependencies": [
      "skillbase",
      "clubbase",
      "weapon",
      "logger",
      "wound"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill5",
    "path": "extra/attr/skills/skill5/",
    "enabled": true,
    "order": 314,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "skillbase",
      "wound"
    ],
    "optionalDependencies": [
      "explore"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill6",
    "path": "extra/attr/skills/skill6/",
    "enabled": true,
    "order": 315,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "skillbase",
      "wound"
    ],
    "optionalDependencies": [
      "explore",
      "weapon"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill7",
    "path": "extra/attr/skills/skill7/",
    "enabled": true,
    "order": 316,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "skillbase",
      "wound"
    ],
    "optionalDependencies": [
      "explore",
      "weapon",
      "enemy"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill8",
    "path": "extra/attr/skills/skill8/",
    "enabled": true,
    "order": 317,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "skillbase",
      "wound"
    ],
    "optionalDependencies": [
      "explore",
      "weapon",
      "enemy"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill9",
    "path": "extra/attr/skills/skill9/",
    "enabled": true,
    "order": 318,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "skillbase",
      "wound"
    ],
    "optionalDependencies": [
      "explore",
      "weapon",
      "enemy"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "poison",
    "path": "base/items/poison/",
    "enabled": true,
    "order": 319,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "edible",
      "input"
    ],
    "optionalDependencies": [
      "wound"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "poison"
    ]
  },
  {
    "name": "armor",
    "path": "base/armor/",
    "enabled": true,
    "order": 320,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger"
    ],
    "optionalDependencies": [
      "weapon",
      "wound"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/armor.config.php"
    ],
    "templates": [
      "profile_armor",
      "profile_armor_short"
    ]
  },
  {
    "name": "rest",
    "path": "base/rest/",
    "enabled": true,
    "order": 321,
    "dependencies": [
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [
      "wound"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/rest.config.php"
    ],
    "templates": [
      "rest_cmd"
    ]
  },
  {
    "name": "item_uc",
    "path": "base/items/item_uc/",
    "enabled": true,
    "order": 322,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "wound",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill12",
    "path": "extra/club/skills/skill12/",
    "enabled": true,
    "order": 323,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "wound",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "profilecmd"
    ]
  },
  {
    "name": "skill223",
    "path": "extra/club/skills/skill223/",
    "enabled": true,
    "order": 324,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "wound",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "event",
    "path": "base/event/",
    "enabled": true,
    "order": 325,
    "dependencies": [
      "sys",
      "player",
      "map",
      "logger",
      "wound",
      "gameflow_duel",
      "itemmain"
    ],
    "optionalDependencies": [
      "trap",
      "metman",
      "enemy",
      "corpse"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/event.config.php"
    ],
    "templates": []
  },
  {
    "name": "skill710",
    "path": "extra/card/skills/skill710/",
    "enabled": true,
    "order": 326,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "item_uv",
      "item_um"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill745",
    "path": "extra/card/skills/skill745/",
    "enabled": true,
    "order": 327,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "item_uv",
      "item_um"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "npcchat_bubble",
    "path": "extra/misc/npcchat_bubble/",
    "enabled": true,
    "order": 328,
    "dependencies": [
      "sys",
      "metman",
      "npcchat",
      "battle",
      "attack"
    ],
    "optionalDependencies": [
      "skill21"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "bubblepage"
    ]
  },
  {
    "name": "item_slip",
    "path": "extra/item_extra/item_slip/",
    "enabled": true,
    "order": 329,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "itemmix",
      "gameflow_duel"
    ],
    "optionalDependencies": [
      "skill21"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill331",
    "path": "extra/activities/halloween2017/skill331/",
    "enabled": true,
    "order": 330,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "skill330"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill19",
    "path": "extra/club/skills/skill19/",
    "enabled": true,
    "order": 331,
    "dependencies": [
      "skillbase",
      "clubbase",
      "trap",
      "player"
    ],
    "optionalDependencies": [
      "skill17"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill79",
    "path": "extra/club/skills/skill79/",
    "enabled": true,
    "order": 332,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [
      "skill39"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill31",
    "path": "extra/club/skills/skill31/",
    "enabled": true,
    "order": 333,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "edible"
    ],
    "optionalDependencies": [
      "skill29"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill242",
    "path": "extra/club/skills/skill242/",
    "enabled": true,
    "order": 334,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sklearn_util"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill53",
    "path": "extra/club/skills/skill53/",
    "enabled": true,
    "order": 335,
    "dependencies": [
      "clubbase",
      "skillbase",
      "player",
      "logger",
      "sklearn_util"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill55",
    "path": "extra/club/skills/skill55/",
    "enabled": true,
    "order": 336,
    "dependencies": [
      "clubbase",
      "skillbase",
      "player",
      "logger",
      "sklearn_util"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill72",
    "path": "extra/club/skills/skill72/",
    "enabled": true,
    "order": 337,
    "dependencies": [
      "clubbase",
      "skillbase",
      "player",
      "logger",
      "sklearn_util"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill227",
    "path": "extra/club/skills/skill227/",
    "enabled": true,
    "order": 338,
    "dependencies": [
      "clubbase",
      "skillbase",
      "player",
      "logger",
      "sklearn_util"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill472",
    "path": "extra/card/skills/skill472/",
    "enabled": true,
    "order": 339,
    "dependencies": [
      "clubbase",
      "skillbase",
      "player",
      "logger",
      "sklearn_util"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill564",
    "path": "extra/card/skills/skill564/",
    "enabled": true,
    "order": 340,
    "dependencies": [
      "clubbase",
      "skillbase",
      "player",
      "logger",
      "sklearn_util",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill475",
    "path": "extra/instance/gtype2/skill475/",
    "enabled": true,
    "order": 341,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmain",
      "corpse"
    ],
    "optionalDependencies": [
      "skill58"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "respawntimer",
      "corpseoption",
      "showwpt",
      "explanation"
    ]
  },
  {
    "name": "skill59",
    "path": "extra/club/skills/skill59/",
    "enabled": true,
    "order": 342,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "skill58"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill425",
    "path": "extra/instance/gtype1/skill425/",
    "enabled": true,
    "order": 343,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "skill424",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill427",
    "path": "extra/instance/gtype1/skill427/",
    "enabled": true,
    "order": 344,
    "dependencies": [
      "clubbase",
      "skillbase",
      "map",
      "sys",
      "player",
      "logger",
      "attack",
      "trap"
    ],
    "optionalDependencies": [
      "skill424"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill260",
    "path": "extra/club/skills/skill260/",
    "enabled": true,
    "order": 345,
    "dependencies": [
      "skillbase",
      "clubbase",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [
      "skill256"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill261",
    "path": "extra/club/skills/skill261/",
    "enabled": true,
    "order": 346,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "itemmain",
      "sys",
      "logger",
      "bufficons",
      "explore",
      "skill263"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill274",
    "path": "extra/club/skills/skill274/",
    "enabled": true,
    "order": 347,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "skill263"
    ],
    "optionalDependencies": [
      "wep_n"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill511",
    "path": "extra/card/skills/skill511/",
    "enabled": true,
    "order": 348,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack"
    ],
    "optionalDependencies": [
      "skill531"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill545",
    "path": "extra/card/skills/skill545/",
    "enabled": true,
    "order": 349,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player"
    ],
    "optionalDependencies": [
      "skill539"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill403",
    "path": "extra/card/skills/skill403/",
    "enabled": true,
    "order": 350,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "battle",
      "logger",
      "wep_g"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill203",
    "path": "extra/club/skills/skill203/",
    "enabled": true,
    "order": 351,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger"
    ],
    "optionalDependencies": [
      "wep_j"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "ammunition",
    "path": "base/items/ammunition/",
    "enabled": true,
    "order": 352,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "weapon"
    ],
    "optionalDependencies": [
      "wep_g",
      "wep_j"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill901",
    "path": "extra/instance/instance3_ascension/skill901/",
    "enabled": true,
    "order": 353,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "lvlctl",
      "itemshop",
      "weapon",
      "armor"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "armor_art",
    "path": "base/armor_art/",
    "enabled": true,
    "order": 354,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger"
    ],
    "optionalDependencies": [
      "armor"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/armor_art.config.php"
    ],
    "templates": [
      "profile_armor_art",
      "profile_armor_art_short"
    ]
  },
  {
    "name": "skill23",
    "path": "extra/club/skills/skill23/",
    "enabled": true,
    "order": 355,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmain",
      "input",
      "lvlctl"
    ],
    "optionalDependencies": [
      "weapon",
      "armor"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/skill23.config.php"
    ],
    "templates": [
      "desc",
      "profilecmd",
      "gemming"
    ]
  },
  {
    "name": "skill517",
    "path": "extra/card/skills/skill517/",
    "enabled": true,
    "order": 356,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "battle",
      "attack",
      "weapon",
      "wound",
      "armor"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill407",
    "path": "extra/card/skills/skill407/",
    "enabled": true,
    "order": 357,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger",
      "armor"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill32",
    "path": "extra/club/skills/skill32/",
    "enabled": true,
    "order": 358,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "armor",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill202",
    "path": "extra/club/skills/skill202/",
    "enabled": true,
    "order": 359,
    "dependencies": [
      "skillbase",
      "clubbase",
      "attack",
      "battle",
      "player",
      "armor",
      "wound",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill445",
    "path": "extra/card/skills/skill445/",
    "enabled": true,
    "order": 360,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger",
      "armor"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill557",
    "path": "extra/card/skills/skill557/",
    "enabled": true,
    "order": 361,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "armor"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "castsk557"
    ]
  },
  {
    "name": "pose",
    "path": "base/pose/",
    "enabled": true,
    "order": 362,
    "dependencies": [
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [
      "trap",
      "metman",
      "weapon",
      "battle",
      "itemmain",
      "enemy",
      "rest",
      "edible"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/pose.config.php"
    ],
    "templates": [
      "enemy_pose",
      "pose_profile",
      "pose_profile_cmd"
    ]
  },
  {
    "name": "skill1",
    "path": "base/skills/skill1/",
    "enabled": true,
    "order": 363,
    "dependencies": [
      "skillbase"
    ],
    "optionalDependencies": [
      "weapon",
      "rest"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill562",
    "path": "extra/card/skills/skill562/",
    "enabled": true,
    "order": 364,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "rest",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill600",
    "path": "extra/club/skills/skill600/",
    "enabled": true,
    "order": 365,
    "dependencies": [
      "skillbase",
      "clubbase",
      "bufficons",
      "player",
      "sys",
      "wound",
      "item_uc",
      "skill12"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill487",
    "path": "extra/card/skills/skill487/",
    "enabled": true,
    "order": 366,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys",
      "battle",
      "trap",
      "event",
      "edible",
      "itemmain"
    ],
    "optionalDependencies": [
      "poison"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill20",
    "path": "extra/club/skills/skill20/",
    "enabled": true,
    "order": 367,
    "dependencies": [
      "skillbase",
      "clubbase",
      "itemmix",
      "player"
    ],
    "optionalDependencies": [
      "skill17",
      "skill19"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill426",
    "path": "extra/instance/gtype1/skill426/",
    "enabled": true,
    "order": 368,
    "dependencies": [
      "clubbase",
      "skillbase",
      "player",
      "sys",
      "logger",
      "bufficons"
    ],
    "optionalDependencies": [
      "skill425"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill492",
    "path": "extra/card/skills/skill492/",
    "enabled": true,
    "order": 369,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys",
      "skill403",
      "map"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill723",
    "path": "extra/card/skills/skill723/",
    "enabled": true,
    "order": 370,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "weapon",
      "ammunition",
      "battle"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill24",
    "path": "extra/club/skills/skill24/",
    "enabled": true,
    "order": 371,
    "dependencies": [
      "skillbase",
      "clubbase",
      "lvlctl",
      "player"
    ],
    "optionalDependencies": [
      "skill23",
      "skill58"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill33",
    "path": "extra/club/skills/skill33/",
    "enabled": true,
    "order": 372,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "armor",
      "logger",
      "input"
    ],
    "optionalDependencies": [
      "skill32"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill579",
    "path": "extra/card/skills/skill579/",
    "enabled": true,
    "order": 373,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "rest",
      "pose"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "tactic",
    "path": "base/tactic/",
    "enabled": true,
    "order": 374,
    "dependencies": [
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [
      "metman",
      "battle",
      "weapon",
      "trap",
      "enemy",
      "pose"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/tactic.config.php"
    ],
    "templates": [
      "enemy_tactic",
      "tactic_profile",
      "tactic_profile_cmd"
    ]
  },
  {
    "name": "skill906",
    "path": "extra/instance/instance3_ascension/skill906/",
    "enabled": true,
    "order": 375,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "wound",
      "skill600",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "weather",
    "path": "base/weather/",
    "enabled": true,
    "order": 376,
    "dependencies": [
      "sys",
      "map",
      "itemmain",
      "player",
      "logger"
    ],
    "optionalDependencies": [
      "metman",
      "enemy",
      "explore",
      "weapon",
      "radar",
      "pose",
      "tactic",
      "attack"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/weather.config.php"
    ],
    "templates": [
      "profile_weather"
    ]
  },
  {
    "name": "npcinfo",
    "path": "extra/misc/npcinfo/",
    "enabled": true,
    "order": 377,
    "dependencies": [
      "sys",
      "player",
      "clubbase",
      "npc",
      "pose",
      "tactic",
      "map",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "npcinfo"
    ]
  },
  {
    "name": "skill502",
    "path": "extra/card/skills/skill502/",
    "enabled": true,
    "order": 378,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "apm",
      "weapon",
      "enemy"
    ],
    "optionalDependencies": [
      "pose",
      "tactic"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill599",
    "path": "extra/card/skills/skill599/",
    "enabled": true,
    "order": 379,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "input",
      "logger",
      "pose",
      "tactic",
      "rest"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "profilecmd"
    ]
  },
  {
    "name": "cardbase",
    "path": "extra/card/cardbase/",
    "enabled": true,
    "order": 380,
    "dependencies": [
      "sys",
      "player",
      "map",
      "attack",
      "itemmix",
      "metman",
      "weather"
    ],
    "optionalDependencies": [
      "skillbase"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/card.config.php"
    ],
    "templates": [
      "cardflip_back",
      "cardflip_result",
      "card_frame",
      "selectcard",
      "profile_cardname",
      "card_back_front_box",
      "pack_frame"
    ]
  },
  {
    "name": "instance6",
    "path": "extra/instance/instance6/",
    "enabled": true,
    "order": 381,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "gameflow_combo",
      "map",
      "weather",
      "npc",
      "itemshop"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/npc.data.config.php"
    ],
    "templates": []
  },
  {
    "name": "skill42",
    "path": "extra/club/skills/skill42/",
    "enabled": true,
    "order": 382,
    "dependencies": [
      "skillbase",
      "clubbase",
      "battle",
      "attack",
      "enemy",
      "logger",
      "weapon",
      "skill41"
    ],
    "optionalDependencies": [
      "weather"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "addnpc",
    "path": "base/addnpc/",
    "enabled": true,
    "order": 383,
    "dependencies": [
      "sys",
      "player",
      "map",
      "logger",
      "npc",
      "itemmain",
      "weather",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/addnpc.config.php"
    ],
    "templates": []
  },
  {
    "name": "skill245",
    "path": "extra/club/skills/skill245/",
    "enabled": true,
    "order": 384,
    "dependencies": [
      "skillbase",
      "clubbase",
      "weather",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill252",
    "path": "extra/club/skills/skill252/",
    "enabled": true,
    "order": 385,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "metman",
      "weather"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill270",
    "path": "extra/club/skills/skill270/",
    "enabled": true,
    "order": 386,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "weapon",
      "enemy"
    ],
    "optionalDependencies": [
      "weather",
      "pose",
      "tactic"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill588",
    "path": "extra/card/skills/skill588/",
    "enabled": true,
    "order": 387,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "input",
      "weather",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "desc"
    ]
  },
  {
    "name": "attrbase",
    "path": "extra/attr/attrbase/",
    "enabled": true,
    "order": 388,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "itemmix",
      "itemshop",
      "npc"
    ],
    "optionalDependencies": [
      "armor_art",
      "armor",
      "cardbase",
      "skill21",
      "event",
      "boxes"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "instance8",
    "path": "extra/instance/instance8_proud/",
    "enabled": true,
    "order": 389,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "itemshop",
      "trap",
      "npc",
      "skillbase",
      "cardbase",
      "clubbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/npc.data.config.php"
    ],
    "templates": []
  },
  {
    "name": "instance7",
    "path": "extra/instance/instance7_tutorial/",
    "enabled": true,
    "order": 390,
    "dependencies": [
      "sys",
      "player",
      "cardbase",
      "logger",
      "gameflow_combo",
      "map",
      "itemshop",
      "itemmain",
      "trap",
      "npc"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/npc.data.config.php"
    ],
    "templates": []
  },
  {
    "name": "kujibase",
    "path": "extra/card/kujibase/",
    "enabled": true,
    "order": 391,
    "dependencies": [
      "sys",
      "player",
      "cardbase",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/kuji.config.php"
    ],
    "templates": []
  },
  {
    "name": "set_gametype",
    "path": "extra/misc/set_gametype/",
    "enabled": true,
    "order": 392,
    "dependencies": [
      "sys",
      "cardbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "next_gametype"
    ]
  },
  {
    "name": "gtype6",
    "path": "extra/instance/gtype6_randomcard/",
    "enabled": true,
    "order": 393,
    "dependencies": [
      "sys",
      "player",
      "cardbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill67",
    "path": "extra/club/skills/skill67/",
    "enabled": true,
    "order": 394,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "lvlctl"
    ],
    "optionalDependencies": [
      "cardbase"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill584",
    "path": "extra/card/skills/skill584/",
    "enabled": true,
    "order": 395,
    "dependencies": [
      "skillbase",
      "clubbase",
      "cardbase",
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill592",
    "path": "extra/card/skills/skill592/",
    "enabled": true,
    "order": 396,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "cardbase",
      "attack",
      "logger",
      "skill_temp"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill541",
    "path": "extra/card/skills/skill541/",
    "enabled": true,
    "order": 397,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "attack",
      "sys",
      "logger",
      "cardbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "npc_action",
    "path": "extra/npc_action/",
    "enabled": true,
    "order": 398,
    "dependencies": [
      "sys",
      "player",
      "npc",
      "itemmain",
      "skillbase",
      "cardbase",
      "battle",
      "attack",
      "npcchat",
      "logger",
      "enemy",
      "explore",
      "metman"
    ],
    "optionalDependencies": [
      "skill21"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/npc_action.config.php"
    ],
    "templates": []
  },
  {
    "name": "skill720",
    "path": "extra/card/skills/skill720/",
    "enabled": true,
    "order": 399,
    "dependencies": [
      "skillbase",
      "clubbase",
      "cardbase",
      "sys",
      "player"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "get_qiegao_in_battle",
    "path": "extra/misc/get_qiegao_in_battle/",
    "enabled": true,
    "order": 400,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "cardbase",
      "npc",
      "battle",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill734",
    "path": "extra/card/skills/skill734/",
    "enabled": true,
    "order": 401,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "cardbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "castsk734",
      "playcard"
    ]
  },
  {
    "name": "skill749",
    "path": "extra/card/skills/skill749/",
    "enabled": true,
    "order": 402,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "cardbase",
      "attack",
      "logger",
      "skill_temp"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill43",
    "path": "extra/club/skills/skill43/",
    "enabled": true,
    "order": 403,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "skill41",
      "skill42",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "itemnumlist",
    "path": "extra/item_extra/itemnumlist/",
    "enabled": true,
    "order": 404,
    "dependencies": [
      "sys",
      "map",
      "npc",
      "itemmain",
      "itemshop",
      "itemmix",
      "itemmix_sync",
      "skill21",
      "addnpc"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill56",
    "path": "extra/club/skills/skill56/",
    "enabled": true,
    "order": 405,
    "dependencies": [
      "clubbase",
      "skillbase",
      "map",
      "sys",
      "player",
      "logger",
      "npc",
      "addnpc",
      "npcinfo",
      "metman"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/merc.config.php"
    ],
    "templates": [
      "desc",
      "profilecmd",
      "mercpanel"
    ]
  },
  {
    "name": "skill435",
    "path": "extra/card/skills/skill435/",
    "enabled": true,
    "order": 406,
    "dependencies": [
      "clubbase",
      "skillbase",
      "map",
      "sys",
      "player",
      "logger",
      "npc",
      "addnpc",
      "npcinfo",
      "metman"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/merc.config.php"
    ],
    "templates": [
      "desc",
      "profilecmd",
      "mercpanel"
    ]
  },
  {
    "name": "skill329",
    "path": "extra/activities/nationalday2017/skill329/",
    "enabled": true,
    "order": 407,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "addnpc"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill512",
    "path": "extra/card/skills/skill512/",
    "enabled": true,
    "order": 408,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "addnpc",
      "attack",
      "battle"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "addnpc_event",
    "path": "extra/misc/addnpc_event/",
    "enabled": true,
    "order": 409,
    "dependencies": [
      "sys",
      "player",
      "npc",
      "addnpc",
      "battle",
      "attack",
      "npcchat"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill961",
    "path": "extra/instance/instance10_rogue/skill961/",
    "enabled": true,
    "order": 410,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "attack",
      "weapon",
      "logger",
      "addnpc",
      "explore",
      "metman",
      "enemy",
      "team"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/vipnpc.config.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "supplycrate_event",
    "path": "extra/misc/supplycrate_event/",
    "enabled": true,
    "order": 411,
    "dependencies": [
      "sys",
      "player",
      "npc",
      "addnpc",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/crate.config.php"
    ],
    "templates": []
  },
  {
    "name": "skill593",
    "path": "extra/card/skills/skill593/",
    "enabled": true,
    "order": 412,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "itemmain",
      "logger",
      "bufficons",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill731",
    "path": "extra/card/skills/skill731/",
    "enabled": true,
    "order": 413,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "itemmain",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "profilecmd",
      "castsk731"
    ]
  },
  {
    "name": "item_randskills",
    "path": "extra/item_extra/item_randskills/",
    "enabled": true,
    "order": 414,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "itemmain",
      "attrbase",
      "logger",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "use_skcore"
    ]
  },
  {
    "name": "skill490",
    "path": "extra/card/skills/skill490/",
    "enabled": true,
    "order": 415,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys",
      "itemmain",
      "itemshop",
      "bufficons",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill430",
    "path": "extra/card/skills/skill430/",
    "enabled": true,
    "order": 416,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "itemmain",
      "sys",
      "logger",
      "bufficons",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "wep_b",
    "path": "base/weapon/wep_b/",
    "enabled": true,
    "order": 417,
    "dependencies": [
      "weapon",
      "itemmain",
      "wep_c",
      "enemy",
      "player"
    ],
    "optionalDependencies": [
      "attrbase"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_phy_def",
    "path": "extra/attr/ex_phy_def/",
    "enabled": true,
    "order": 418,
    "dependencies": [
      "itemmain",
      "logger",
      "attrbase",
      "skillbase",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "rage",
    "path": "extra/attr/rage/",
    "enabled": true,
    "order": 419,
    "dependencies": [
      "player",
      "weapon",
      "itemmain",
      "attack",
      "attrbase",
      "rest",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/rage.config.php"
    ],
    "templates": []
  },
  {
    "name": "skill30",
    "path": "extra/club/skills/skill30/",
    "enabled": true,
    "order": 420,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "attack",
      "attrbase",
      "weapon",
      "sys",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill441",
    "path": "extra/card/skills/skill441/",
    "enabled": true,
    "order": 421,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "attrbase",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill259",
    "path": "extra/club/skills/skill259/",
    "enabled": true,
    "order": 422,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "attrbase",
      "weapon",
      "sys",
      "attack",
      "itemmain",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "ex_rapid_attr",
    "path": "extra/attr/ex_rapid_attr/",
    "enabled": true,
    "order": 423,
    "dependencies": [
      "attrbase",
      "weapon",
      "itemmain",
      "logger"
    ],
    "optionalDependencies": [
      "wound"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_attr_silencer",
    "path": "extra/attr/ex_attr_silencer/",
    "enabled": true,
    "order": 424,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "attrbase",
      "logger"
    ],
    "optionalDependencies": [
      "wep_g",
      "wep_j"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_dmg_att",
    "path": "extra/attr/ex_dmg_att/",
    "enabled": true,
    "order": 425,
    "dependencies": [
      "sys",
      "itemmain",
      "logger",
      "skillbase",
      "attrbase",
      "weapon",
      "trap"
    ],
    "optionalDependencies": [
      "skill5",
      "skill6",
      "skill7",
      "skill8",
      "skill9",
      "noise"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/ex_dmg_att.config.php"
    ],
    "templates": []
  },
  {
    "name": "ex_attr_charge",
    "path": "extra/attr/ex_attr_charge/",
    "enabled": true,
    "order": 426,
    "dependencies": [
      "itemmain",
      "logger",
      "attrbase",
      "skillbase",
      "weapon"
    ],
    "optionalDependencies": [
      "armor"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_hp_def",
    "path": "extra/attr/ex_hp_def/",
    "enabled": true,
    "order": 427,
    "dependencies": [
      "logger",
      "attack",
      "attrbase",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_direct",
    "path": "extra/attr/ex_direct/",
    "enabled": true,
    "order": 428,
    "dependencies": [
      "itemmain",
      "logger",
      "attrbase",
      "weapon",
      "battle",
      "attack",
      "skillbase"
    ],
    "optionalDependencies": [
      "clubbase"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_seckill",
    "path": "extra/attr/ex_seckill/",
    "enabled": true,
    "order": 429,
    "dependencies": [
      "itemmain",
      "logger",
      "attrbase",
      "weapon",
      "battle",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_cursed",
    "path": "extra/attr/ex_cursed/",
    "enabled": true,
    "order": 430,
    "dependencies": [
      "itemmain",
      "logger",
      "attrbase",
      "weapon",
      "armor",
      "armor_art",
      "team"
    ],
    "optionalDependencies": [
      "skill23",
      "skill557"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_def_down",
    "path": "extra/attr/ex_def_down/",
    "enabled": true,
    "order": 431,
    "dependencies": [
      "itemmain",
      "logger",
      "attrbase",
      "weapon",
      "battle",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_armor_crack",
    "path": "extra/attr/ex_armor_crack/",
    "enabled": true,
    "order": 432,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "attrbase",
      "logger",
      "wound"
    ],
    "optionalDependencies": [
      "armor"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_attr_digit",
    "path": "extra/attr/ex_attr_digit/",
    "enabled": true,
    "order": 433,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_weapon_crack",
    "path": "extra/attr/ex_weapon_crack/",
    "enabled": true,
    "order": 434,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "attrbase",
      "logger",
      "weapon",
      "armor"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill568",
    "path": "extra/card/skills/skill568/",
    "enabled": true,
    "order": 435,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "metman",
      "weapon",
      "armor",
      "enemy",
      "attack",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill585",
    "path": "extra/card/skills/skill585/",
    "enabled": true,
    "order": 436,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill705",
    "path": "extra/card/skills/skill705/",
    "enabled": true,
    "order": 437,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "ex_uselog",
    "path": "extra/attr/ex_uselog/",
    "enabled": true,
    "order": 438,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "attrbase",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill89",
    "path": "extra/club/skills/skill89/",
    "enabled": true,
    "order": 439,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill96",
    "path": "extra/club/skills/skill96/",
    "enabled": true,
    "order": 440,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "bufficons",
      "attrbase",
      "enemy",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill102",
    "path": "extra/club/skills/skill102/",
    "enabled": true,
    "order": 441,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "weapon",
      "attack",
      "itemmain",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill103",
    "path": "extra/club/skills/skill103/",
    "enabled": true,
    "order": 442,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "weapon",
      "attack",
      "itemmain",
      "itemmix",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "profilecmd",
      "castsk103"
    ]
  },
  {
    "name": "skill104",
    "path": "extra/club/skills/skill104/",
    "enabled": true,
    "order": 443,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "attrbase",
      "skill23"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "profilecmd",
      "castsk104"
    ]
  },
  {
    "name": "skill732",
    "path": "extra/card/skills/skill732/",
    "enabled": true,
    "order": 444,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "itemmain",
      "attrbase",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill1000",
    "path": "extra/instance/instance7_tutorial/skill1000/",
    "enabled": true,
    "order": 445,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "instance7",
      "cardbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill711",
    "path": "extra/card/skills/skill711/",
    "enabled": true,
    "order": 446,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "metman"
    ],
    "optionalDependencies": [
      "npc_action"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill1007",
    "path": "extra/npc_action/skill1007/",
    "enabled": true,
    "order": 447,
    "dependencies": [
      "skillbase",
      "clubbase",
      "npc",
      "npc_action",
      "battle",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill418",
    "path": "extra/card/skills/skill418/",
    "enabled": true,
    "order": 448,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys",
      "get_qiegao_in_battle"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill1003",
    "path": "extra/club/skills/skill1003/",
    "enabled": true,
    "order": 449,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "trap"
    ],
    "optionalDependencies": [
      "cardbase",
      "item_misc",
      "get_qiegao_in_battle"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "randmix",
    "path": "extra/misc/randmix/",
    "enabled": true,
    "order": 450,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "itemmix",
      "itemnumlist",
      "item_slip"
    ],
    "optionalDependencies": [
      "itemmix_overlay",
      "itemmix_sync"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "gtype1",
    "path": "extra/instance/gtype1/main/",
    "enabled": true,
    "order": 451,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "cardbase",
      "metman",
      "gameflow_combo",
      "map",
      "weather",
      "lvlctl",
      "item_misc",
      "team",
      "npc",
      "event",
      "itemnumlist",
      "skill21",
      "corpse",
      "itemshop",
      "item_uee"
    ],
    "optionalDependencies": [
      "skill424"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/npc.data.config.php",
      "config/evonpc.config.php"
    ],
    "templates": [
      "showhacklevel"
    ]
  },
  {
    "name": "skill57",
    "path": "extra/club/skills/skill57/",
    "enabled": true,
    "order": 452,
    "dependencies": [
      "skill56",
      "clubbase",
      "skillbase",
      "map",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill436",
    "path": "extra/card/skills/skill436/",
    "enabled": true,
    "order": 453,
    "dependencies": [
      "skill435",
      "clubbase",
      "skillbase",
      "map",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill729",
    "path": "extra/card/skills/skill729/",
    "enabled": true,
    "order": 454,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "itemmain",
      "item_randskills"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill107",
    "path": "extra/club/skills/skill107/",
    "enabled": true,
    "order": 455,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "item_randskills"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "dualwep",
    "path": "base/weapon/dualwep/",
    "enabled": true,
    "order": 456,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "weapon",
      "wep_n",
      "wep_p",
      "wep_k",
      "wep_g",
      "wep_c",
      "wep_d",
      "wep_f",
      "wep_j",
      "wep_b"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/dualwep.config.php"
    ],
    "templates": [
      "sec_att_method",
      "dualwep_att_method_profile"
    ]
  },
  {
    "name": "wep_b_extra_reloading",
    "path": "extra/item_extra/wep_b_extra_reloading/",
    "enabled": true,
    "order": 457,
    "dependencies": [
      "weapon",
      "itemmain",
      "wep_c",
      "wep_b"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "reload_select"
    ]
  },
  {
    "name": "skill28",
    "path": "extra/club/skills/skill28/",
    "enabled": true,
    "order": 458,
    "dependencies": [
      "skillbase",
      "clubbase",
      "itemmain",
      "attrbase",
      "ex_phy_def"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill254",
    "path": "extra/club/skills/skill254/",
    "enabled": true,
    "order": 459,
    "dependencies": [
      "player",
      "skillbase",
      "ex_phy_def",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill535",
    "path": "extra/card/skills/skill535/",
    "enabled": true,
    "order": 460,
    "dependencies": [
      "skillbase",
      "clubbase",
      "logger",
      "rest"
    ],
    "optionalDependencies": [
      "rage"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill37",
    "path": "extra/club/skills/skill37/",
    "enabled": true,
    "order": 461,
    "dependencies": [
      "skillbase",
      "clubbase",
      "rage",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill73",
    "path": "extra/club/skills/skill73/",
    "enabled": true,
    "order": 462,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "sys",
      "logger",
      "attrbase",
      "rage"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill410",
    "path": "extra/card/skills/skill410/",
    "enabled": true,
    "order": 463,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "rage",
      "explore",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill570",
    "path": "extra/card/skills/skill570/",
    "enabled": true,
    "order": 464,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "rage"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "instance9",
    "path": "extra/instance/instance9_rush/",
    "enabled": true,
    "order": 465,
    "dependencies": [
      "sys",
      "player",
      "map",
      "itemmain",
      "rage",
      "itemshop",
      "skillbase",
      "cardbase"
    ],
    "optionalDependencies": [
      "trap",
      "npc",
      "gameflow_combo",
      "weapon",
      "event",
      "item_uee"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/npc.data.config.php"
    ],
    "templates": []
  },
  {
    "name": "skill258",
    "path": "extra/club/skills/skill258/",
    "enabled": true,
    "order": 466,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "logger",
      "ex_rapid_attr"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill444",
    "path": "extra/card/skills/skill444/",
    "enabled": true,
    "order": 467,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "ex_rapid_attr",
      "weapon",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill207",
    "path": "extra/club/skills/skill207/",
    "enabled": true,
    "order": 468,
    "dependencies": [
      "skillbase",
      "clubbase",
      "attack",
      "battle",
      "player",
      "weapon",
      "logger",
      "ex_rapid_attr"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill65",
    "path": "extra/club/skills/skill65/",
    "enabled": true,
    "order": 469,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "weapon",
      "wep_f",
      "ex_rapid_attr"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill49",
    "path": "extra/club/skills/skill49/",
    "enabled": true,
    "order": 470,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "ex_rapid_attr",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill201",
    "path": "extra/club/skills/skill201/",
    "enabled": true,
    "order": 471,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "battle",
      "armor",
      "logger",
      "ex_rapid_attr"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill248",
    "path": "extra/club/skills/skill248/",
    "enabled": true,
    "order": 472,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "battle",
      "armor",
      "logger",
      "ex_rapid_attr",
      "enemy",
      "metman"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "ex_rapid_def",
    "path": "extra/attr/ex_rapid_def/",
    "enabled": true,
    "order": 473,
    "dependencies": [
      "itemmain",
      "logger",
      "attrbase",
      "weapon",
      "ex_rapid_attr"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill82",
    "path": "extra/club/skills/skill82/",
    "enabled": true,
    "order": 474,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack"
    ],
    "optionalDependencies": [
      "wep_k",
      "ex_rapid_attr"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill50",
    "path": "extra/club/skills/skill50/",
    "enabled": true,
    "order": 475,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "weapon",
      "ex_rapid_attr",
      "enemy"
    ],
    "optionalDependencies": [
      "weather"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill741",
    "path": "extra/card/skills/skill741/",
    "enabled": true,
    "order": 476,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "ex_rapid_attr"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill578",
    "path": "extra/card/skills/skill578/",
    "enabled": true,
    "order": 477,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "ex_dmg_att",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "ex_attr_trap",
    "path": "extra/attr/ex_attr_trap/",
    "enabled": true,
    "order": 478,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "itemmain"
    ],
    "optionalDependencies": [
      "trap",
      "ex_dmg_att"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill422",
    "path": "extra/card/skills/skill422/",
    "enabled": true,
    "order": 479,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys",
      "attack",
      "weapon",
      "wep_j",
      "wep_g",
      "logger",
      "ex_dmg_att",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill230",
    "path": "extra/club/skills/skill230/",
    "enabled": true,
    "order": 480,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmain",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "desc"
    ]
  },
  {
    "name": "skill222",
    "path": "extra/club/skills/skill222/",
    "enabled": true,
    "order": 481,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "ex_dmg_att",
      "attrbase",
      "skill221"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill218",
    "path": "extra/club/skills/skill218/",
    "enabled": true,
    "order": 482,
    "dependencies": [
      "skillbase",
      "clubbase",
      "attack",
      "battle",
      "player",
      "wound",
      "ex_dmg_att",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill217",
    "path": "extra/club/skills/skill217/",
    "enabled": true,
    "order": 483,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill219",
    "path": "extra/club/skills/skill219/",
    "enabled": true,
    "order": 484,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmain",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "desc"
    ]
  },
  {
    "name": "ex_dmg_def",
    "path": "extra/attr/ex_dmg_def/",
    "enabled": true,
    "order": 485,
    "dependencies": [
      "itemmain",
      "logger",
      "skillbase",
      "attrbase",
      "weapon",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_dmg_nullify",
    "path": "extra/attr/ex_dmg_nullify/",
    "enabled": true,
    "order": 486,
    "dependencies": [
      "itemmain",
      "logger",
      "attrbase",
      "skillbase",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill25",
    "path": "extra/club/skills/skill25/",
    "enabled": true,
    "order": 487,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill44",
    "path": "extra/club/skills/skill44/",
    "enabled": true,
    "order": 488,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "weapon",
      "ex_dmg_att",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill47",
    "path": "extra/club/skills/skill47/",
    "enabled": true,
    "order": 489,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "itemmain",
      "ex_dmg_att",
      "attrbase",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill48",
    "path": "extra/club/skills/skill48/",
    "enabled": true,
    "order": 490,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "itemmain",
      "ex_dmg_att",
      "attrbase",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill54",
    "path": "extra/club/skills/skill54/",
    "enabled": true,
    "order": 491,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "weapon",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill205",
    "path": "extra/club/skills/skill205/",
    "enabled": true,
    "order": 492,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "ex_dmg_att",
      "attrbase",
      "armor",
      "wound"
    ],
    "optionalDependencies": [
      "wep_j"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill75",
    "path": "extra/club/skills/skill75/",
    "enabled": true,
    "order": 493,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack",
      "ex_dmg_att",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill76",
    "path": "extra/club/skills/skill76/",
    "enabled": true,
    "order": 494,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack",
      "ex_dmg_att",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill210",
    "path": "extra/club/skills/skill210/",
    "enabled": true,
    "order": 495,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack",
      "ex_dmg_att",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill238",
    "path": "extra/club/skills/skill238/",
    "enabled": true,
    "order": 496,
    "dependencies": [
      "skillbase",
      "clubbase",
      "ex_dmg_att",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill434",
    "path": "extra/card/skills/skill434/",
    "enabled": true,
    "order": 497,
    "dependencies": [
      "skillbase",
      "clubbase",
      "ex_dmg_att",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill448",
    "path": "extra/card/skills/skill448/",
    "enabled": true,
    "order": 498,
    "dependencies": [
      "skillbase",
      "clubbase",
      "ex_dmg_att",
      "logger",
      "weapon",
      "attack",
      "battle"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill463",
    "path": "extra/card/skills/skill463/",
    "enabled": true,
    "order": 499,
    "dependencies": [
      "skillbase",
      "clubbase",
      "attack",
      "weapon",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill465",
    "path": "extra/card/skills/skill465/",
    "enabled": true,
    "order": 500,
    "dependencies": [
      "skillbase",
      "clubbase",
      "attack",
      "weapon",
      "ex_dmg_att",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill478",
    "path": "extra/card/skills/skill478/",
    "enabled": true,
    "order": 501,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack",
      "weapon",
      "wound",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill521",
    "path": "extra/card/skills/skill521/",
    "enabled": true,
    "order": 502,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill522",
    "path": "extra/card/skills/skill522/",
    "enabled": true,
    "order": 503,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill523",
    "path": "extra/card/skills/skill523/",
    "enabled": true,
    "order": 504,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill524",
    "path": "extra/card/skills/skill524/",
    "enabled": true,
    "order": 505,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill525",
    "path": "extra/card/skills/skill525/",
    "enabled": true,
    "order": 506,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill526",
    "path": "extra/card/skills/skill526/",
    "enabled": true,
    "order": 507,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill90",
    "path": "extra/club/skills/skill90/",
    "enabled": true,
    "order": 508,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "attack",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill93",
    "path": "extra/club/skills/skill93/",
    "enabled": true,
    "order": 509,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "attrbase",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill803",
    "path": "extra/card/skills/skill803/",
    "enabled": true,
    "order": 510,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "enemy",
      "battle",
      "wound",
      "ex_dmg_att"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill232",
    "path": "extra/club/skills/skill232/",
    "enabled": true,
    "order": 511,
    "dependencies": [
      "clubbase",
      "skillbase",
      "player",
      "sys",
      "logger",
      "bufficons",
      "attack",
      "ex_hp_def"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill432",
    "path": "extra/card/skills/skill432/",
    "enabled": true,
    "order": 512,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "ex_hp_def",
      "rage"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill558",
    "path": "extra/card/skills/skill558/",
    "enabled": true,
    "order": 513,
    "dependencies": [
      "sys",
      "logger",
      "player",
      "skillbase",
      "clubbase",
      "attack",
      "ex_hp_def"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill513",
    "path": "extra/card/skills/skill513/",
    "enabled": true,
    "order": 514,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [
      "ex_direct",
      "skill46"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "item_uu",
    "path": "extra/item_extra/item_uu/",
    "enabled": true,
    "order": 515,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "trap"
    ],
    "optionalDependencies": [
      "ex_attr_digit"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "item_umb",
    "path": "extra/item_extra/item_umb/",
    "enabled": true,
    "order": 516,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "item_um",
      "clubbase",
      "ex_attr_digit",
      "skill_temp"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill726",
    "path": "extra/card/skills/skill726/",
    "enabled": true,
    "order": 517,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "skill103"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill105",
    "path": "extra/club/skills/skill105/",
    "enabled": true,
    "order": 518,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "attack",
      "skill104"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill727",
    "path": "extra/card/skills/skill727/",
    "enabled": true,
    "order": 519,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "attack",
      "skill104",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "item_recipe",
    "path": "extra/item_extra/item_recipe/",
    "enabled": true,
    "order": 520,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "input",
      "itemmix",
      "skill1003"
    ],
    "optionalDependencies": [
      "attrbase"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/recipe.config.php"
    ],
    "templates": [
      "recipe_profile",
      "choose_recipe",
      "use_recipe",
      "use_learned_recipe"
    ]
  },
  {
    "name": "skill580",
    "path": "extra/card/skills/skill580/",
    "enabled": true,
    "order": 521,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "metman",
      "enemy",
      "itemmain",
      "skill1003"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "achievement_base",
    "path": "extra/achievement/achievement_base/",
    "enabled": true,
    "order": 522,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "cardbase",
      "apm",
      "skill1003"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/achievement_base.config.php"
    ],
    "templates": [
      "common_desc"
    ]
  },
  {
    "name": "opening",
    "path": "base/opening/",
    "enabled": true,
    "order": 523,
    "dependencies": [
      "sys",
      "player"
    ],
    "optionalDependencies": [
      "corpse",
      "skill1003"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/opening.config.php"
    ],
    "templates": [
      "storyboard",
      "storyboard_container",
      "cmd_skip_op",
      "storyboard_gt0",
      "storyboard_gt1",
      "storyboard_gt13",
      "storyboard_gt18",
      "storyboard_gt19"
    ]
  },
  {
    "name": "ending",
    "path": "base/ending/",
    "enabled": true,
    "order": 524,
    "dependencies": [
      "sys",
      "map",
      "player",
      "itemmain"
    ],
    "optionalDependencies": [
      "set_gametype",
      "itemmix",
      "skill1003"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/ending.config.php"
    ],
    "templates": [
      "storyboard",
      "storyboard_container",
      "next_gametype",
      "storyboard_wm2",
      "storyboard_wm3",
      "storyboard_wm5",
      "storyboard_wm7",
      "storyboard_wm8"
    ]
  },
  {
    "name": "song",
    "path": "base/items/song/",
    "enabled": true,
    "order": 525,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "itemmain",
      "noise",
      "logger"
    ],
    "optionalDependencies": [
      "skill1003",
      "skill_temp"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/song.config.php"
    ],
    "templates": [
      "song_profile",
      "sing"
    ]
  },
  {
    "name": "extra_event",
    "path": "extra/misc/extra_event/",
    "enabled": true,
    "order": 526,
    "dependencies": [
      "sys",
      "player",
      "map",
      "enemy",
      "battle",
      "event",
      "skill1003"
    ],
    "optionalDependencies": [
      "item_randskill"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/extra_event.config.php"
    ],
    "templates": [
      "common_event_page"
    ]
  },
  {
    "name": "news_observe",
    "path": "extra/misc/news_observe/",
    "enabled": true,
    "order": 527,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "skill1003"
    ],
    "optionalDependencies": [
      "item_misc"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "observe_select"
    ]
  },
  {
    "name": "skill429",
    "path": "extra/instance/gtype1/skill429/",
    "enabled": true,
    "order": 528,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "trap",
      "team"
    ],
    "optionalDependencies": [
      "gtype1"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill108",
    "path": "extra/club/skills/skill108/",
    "enabled": true,
    "order": 529,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "lvlctl",
      "enemy",
      "attack",
      "skill107"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill109",
    "path": "extra/club/skills/skill109/",
    "enabled": true,
    "order": 530,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "item_randskills",
      "skill107",
      "skill_temp"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill111",
    "path": "extra/club/skills/skill111/",
    "enabled": true,
    "order": 531,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "rest",
      "skill107",
      "skill_temp"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "empowers",
    "path": "base/items/empowers/",
    "enabled": true,
    "order": 532,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "armor",
      "dualwep"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill70",
    "path": "extra/club/skills/skill70/",
    "enabled": true,
    "order": 533,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "lvlctl",
      "weapon"
    ],
    "optionalDependencies": [
      "dualwep"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill246",
    "path": "extra/club/skills/skill246/",
    "enabled": true,
    "order": 534,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "metman",
      "enemy",
      "sys",
      "logger",
      "attack",
      "bufficons",
      "weapon"
    ],
    "optionalDependencies": [
      "wep_j",
      "dualwep"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill598",
    "path": "extra/card/skills/skill598/",
    "enabled": true,
    "order": 535,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "itemmain",
      "itemmix_sync",
      "dualwep",
      "metman"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "ex_mhp_temp_up",
    "path": "extra/attr/ex_mhp_temp_up/",
    "enabled": true,
    "order": 536,
    "dependencies": [
      "itemmain",
      "logger",
      "attrbase",
      "edible"
    ],
    "optionalDependencies": [
      "skill28"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "instance_close_button",
    "path": "extra/instance/instance_close_button/",
    "enabled": true,
    "order": 537,
    "dependencies": [
      "sys",
      "player",
      "gameflow_combo"
    ],
    "optionalDependencies": [
      "instance8",
      "instance9"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "instance_close_button"
    ]
  },
  {
    "name": "skill514",
    "path": "extra/card/skills/skill514/",
    "enabled": true,
    "order": 538,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "weapon"
    ],
    "optionalDependencies": [
      "skill49",
      "skill223",
      "skill414",
      "ex_seckill"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill206",
    "path": "extra/club/skills/skill206/",
    "enabled": true,
    "order": 539,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "sys",
      "logger",
      "skill201",
      "skill202"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "miracletrap",
    "path": "base/items/miracletrap/",
    "enabled": true,
    "order": 540,
    "dependencies": [
      "sys",
      "player",
      "trap"
    ],
    "optionalDependencies": [
      "tactic",
      "ex_attr_trap"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill231",
    "path": "extra/club/skills/skill231/",
    "enabled": true,
    "order": 541,
    "dependencies": [
      "skillbase",
      "clubbase",
      "ex_dmg_att"
    ],
    "optionalDependencies": [
      "skill230"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill742",
    "path": "extra/card/skills/skill742/",
    "enabled": true,
    "order": 542,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "attack",
      "wound",
      "itemmain",
      "attrbase"
    ],
    "optionalDependencies": [
      "skill219",
      "skill230"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill220",
    "path": "extra/club/skills/skill220/",
    "enabled": true,
    "order": 543,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmain",
      "input",
      "poison"
    ],
    "optionalDependencies": [
      "skill219"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "poisoncheck",
      "desc"
    ]
  },
  {
    "name": "skill224",
    "path": "extra/club/skills/skill224/",
    "enabled": true,
    "order": 544,
    "dependencies": [
      "skillbase",
      "clubbase",
      "ex_dmg_att"
    ],
    "optionalDependencies": [
      "skill219"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill243",
    "path": "extra/club/skills/skill243/",
    "enabled": true,
    "order": 545,
    "dependencies": [
      "skillbase",
      "clubbase",
      "itemmain",
      "ex_dmg_def",
      "ex_phy_def",
      "ex_rapid_def"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill208",
    "path": "extra/club/skills/skill208/",
    "enabled": true,
    "order": 546,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack"
    ],
    "optionalDependencies": [
      "ex_dmg_def",
      "ex_phy_def",
      "ex_rapid_def"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill215",
    "path": "extra/club/skills/skill215/",
    "enabled": true,
    "order": 547,
    "dependencies": [
      "clubbase",
      "skillbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attrbase",
      "ex_dmg_att",
      "ex_dmg_def",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill271",
    "path": "extra/club/skills/skill271/",
    "enabled": true,
    "order": 548,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "weapon",
      "attrbase",
      "ex_phy_def",
      "ex_dmg_def",
      "ex_rapid_def"
    ],
    "optionalDependencies": [
      "itemmain"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill112",
    "path": "extra/club/skills/skill112/",
    "enabled": true,
    "order": 549,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "weapon",
      "attack",
      "ex_phy_def",
      "ex_dmg_def",
      "ex_rapid_def",
      "skill107",
      "skill_temp"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "tutorial",
    "path": "extra/instance/instance7_tutorial/tutorial/",
    "enabled": true,
    "order": 550,
    "dependencies": [
      "sys",
      "player",
      "map",
      "logger",
      "clubbase",
      "itemmain",
      "itemshop",
      "itemmix",
      "metman",
      "corpse",
      "enemy",
      "team",
      "addnpc",
      "explore",
      "skill1000",
      "battle",
      "weapon",
      "edible",
      "wound",
      "ex_dmg_def",
      "attack",
      "gameflow_combo",
      "pose",
      "tactic",
      "event"
    ],
    "optionalDependencies": [
      "weather",
      "instance7",
      "gameflow_duel"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/tutorial_1.config.php"
    ],
    "templates": [
      "tutorial",
      "tutorial_cmd",
      "tutorial_corpse"
    ]
  },
  {
    "name": "skill51",
    "path": "extra/club/skills/skill51/",
    "enabled": true,
    "order": 551,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "skill48",
      "logger",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill493",
    "path": "extra/card/skills/skill493/",
    "enabled": true,
    "order": 552,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "weapon",
      "rage",
      "lvlctl",
      "attack"
    ],
    "optionalDependencies": [
      "skill37",
      "skill76",
      "skill213",
      "skill225",
      "skill226",
      "skill260",
      "skill410",
      "skill423",
      "skill459"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "randrecipe",
    "path": "extra/instance/instance10_rogue/randrecipe/",
    "enabled": true,
    "order": 553,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "npc",
      "item_recipe"
    ],
    "optionalDependencies": [
      "itemmain"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/randrecipe.config.php"
    ],
    "templates": []
  },
  {
    "name": "skill100",
    "path": "extra/club/skills/skill100/",
    "enabled": true,
    "order": 554,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "itemmix",
      "item_recipe"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill101",
    "path": "extra/club/skills/skill101/",
    "enabled": true,
    "order": 555,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "itemmix",
      "item_recipe",
      "weapon",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill98",
    "path": "extra/club/skills/skill98/",
    "enabled": true,
    "order": 556,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "itemmix",
      "item_recipe",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill99",
    "path": "extra/club/skills/skill99/",
    "enabled": true,
    "order": 557,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "itemmain",
      "itemmix",
      "item_recipe"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill97",
    "path": "extra/club/skills/skill97/",
    "enabled": true,
    "order": 558,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "itemmix",
      "item_recipe",
      "weapon",
      "lvlctl"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill302",
    "path": "extra/achievement/skills/skill302/",
    "enabled": true,
    "order": 559,
    "dependencies": [
      "skillbase",
      "clubbase",
      "achievement_base",
      "sys",
      "player",
      "logger",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill303",
    "path": "extra/achievement/skills/skill303/",
    "enabled": true,
    "order": 560,
    "dependencies": [
      "skillbase",
      "clubbase",
      "achievement_base",
      "sys",
      "player",
      "logger",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill304",
    "path": "extra/achievement/skills/skill304/",
    "enabled": true,
    "order": 561,
    "dependencies": [
      "skillbase",
      "clubbase",
      "achievement_base",
      "sys",
      "player",
      "logger",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill325",
    "path": "extra/achievement/skills/skill325/",
    "enabled": true,
    "order": 562,
    "dependencies": [
      "skillbase",
      "clubbase",
      "achievement_base",
      "sys",
      "player",
      "map",
      "logger",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill326",
    "path": "extra/achievement/skills/skill326/",
    "enabled": true,
    "order": 563,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill315",
    "path": "extra/achievement/skills/skill315/",
    "enabled": true,
    "order": 564,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill313",
    "path": "extra/achievement/skills/skill313/",
    "enabled": true,
    "order": 565,
    "dependencies": [
      "skillbase",
      "map",
      "clubbase",
      "sys",
      "player",
      "logger",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill300",
    "path": "extra/achievement/skills/skill300/",
    "enabled": true,
    "order": 566,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "edible",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill332",
    "path": "extra/achievement/skills/skill332/",
    "enabled": true,
    "order": 567,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill333",
    "path": "extra/achievement/skills/skill333/",
    "enabled": true,
    "order": 568,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill334",
    "path": "extra/achievement/skills/skill334/",
    "enabled": true,
    "order": 569,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill335",
    "path": "extra/achievement/skills/skill335/",
    "enabled": true,
    "order": 570,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill336",
    "path": "extra/achievement/skills/skill336/",
    "enabled": true,
    "order": 571,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill337",
    "path": "extra/achievement/skills/skill337/",
    "enabled": true,
    "order": 572,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill338",
    "path": "extra/achievement/skills/skill338/",
    "enabled": true,
    "order": 573,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill339",
    "path": "extra/achievement/skills/skill339/",
    "enabled": true,
    "order": 574,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill340",
    "path": "extra/achievement/skills/skill340/",
    "enabled": true,
    "order": 575,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill341",
    "path": "extra/achievement/skills/skill341/",
    "enabled": true,
    "order": 576,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill342",
    "path": "extra/achievement/skills/skill342/",
    "enabled": true,
    "order": 577,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill343",
    "path": "extra/achievement/skills/skill343/",
    "enabled": true,
    "order": 578,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill344",
    "path": "extra/achievement/skills/skill344/",
    "enabled": true,
    "order": 579,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill345",
    "path": "extra/achievement/skills/skill345/",
    "enabled": true,
    "order": 580,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill346",
    "path": "extra/achievement/skills/skill346/",
    "enabled": true,
    "order": 581,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "trap",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill347",
    "path": "extra/achievement/skills/skill347/",
    "enabled": true,
    "order": 582,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill348",
    "path": "extra/achievement/skills/skill348/",
    "enabled": true,
    "order": 583,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "weapon",
      "trap",
      "achievement_base",
      "cardbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill349",
    "path": "extra/achievement/skills/skill349/",
    "enabled": true,
    "order": 584,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill350",
    "path": "extra/achievement/skills/skill350/",
    "enabled": true,
    "order": 585,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill353",
    "path": "extra/achievement/skills/skill353/",
    "enabled": true,
    "order": 586,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmix",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill354",
    "path": "extra/achievement/skills/skill354/",
    "enabled": true,
    "order": 587,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmix",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill355",
    "path": "extra/achievement/skills/skill355/",
    "enabled": true,
    "order": 588,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmix",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill356",
    "path": "extra/achievement/skills/skill356/",
    "enabled": true,
    "order": 589,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [
      "trap"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill357",
    "path": "extra/achievement/skills/skill357/",
    "enabled": true,
    "order": 590,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmix",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill358",
    "path": "extra/achievement/skills/skill358/",
    "enabled": true,
    "order": 591,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmix",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill359",
    "path": "extra/achievement/skills/skill359/",
    "enabled": true,
    "order": 592,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill360",
    "path": "extra/activities/lunany2018/skill360/",
    "enabled": true,
    "order": 593,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmix",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill364",
    "path": "extra/achievement/skills/skill364/",
    "enabled": true,
    "order": 594,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "activity_ranking",
    "path": "extra/activities/activity_ranking/",
    "enabled": true,
    "order": 595,
    "dependencies": [
      "achievement_base",
      "sys"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "aprilfool2018",
    "path": "extra/activities/aprilfool2018/main/",
    "enabled": true,
    "order": 596,
    "dependencies": [
      "achievement_base",
      "sys",
      "npc",
      "itemshop"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/specialnpc.config.php"
    ],
    "templates": []
  },
  {
    "name": "skill367",
    "path": "extra/achievement/skills/skill367/",
    "enabled": true,
    "order": 597,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "map",
      "player",
      "achievement_base",
      "skill234"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill368",
    "path": "extra/achievement/skills/skill368/",
    "enabled": true,
    "order": 598,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill369",
    "path": "extra/achievement/skills/skill369/",
    "enabled": true,
    "order": 599,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base"
    ],
    "optionalDependencies": [
      "skill539"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill370",
    "path": "extra/achievement/skills/skill370/",
    "enabled": true,
    "order": 600,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill530",
    "path": "extra/card/skills/skill530/",
    "enabled": true,
    "order": 601,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "achievement_base",
      "logger"
    ],
    "optionalDependencies": [
      "itemmain"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill372",
    "path": "extra/achievement/skills/skill372/",
    "enabled": true,
    "order": 602,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill373",
    "path": "extra/achievement/skills/skill373/",
    "enabled": true,
    "order": 603,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base",
      "itemmain",
      "itemmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill374",
    "path": "extra/achievement/skills/skill374/",
    "enabled": true,
    "order": 604,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "cardbase",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill377",
    "path": "extra/achievement/skills/skill377/",
    "enabled": true,
    "order": 605,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base",
      "cardbase",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill378",
    "path": "extra/achievement/skills/skill378/",
    "enabled": true,
    "order": 606,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base",
      "cardbase",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill380",
    "path": "extra/achievement/skills/skill380/",
    "enabled": true,
    "order": 607,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill375",
    "path": "extra/achievement/skills/skill375/",
    "enabled": true,
    "order": 608,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base",
      "wep_b",
      "wep_b_extra_reloading",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill382",
    "path": "extra/achievement/skills/skill382/",
    "enabled": true,
    "order": 609,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "weapon",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill351",
    "path": "extra/achievement/skills/skill351/",
    "enabled": true,
    "order": 610,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "gtype1",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill352",
    "path": "extra/achievement/skills/skill352/",
    "enabled": true,
    "order": 611,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "gtype1",
      "achievement_base"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill504",
    "path": "extra/card/skills/skill504/",
    "enabled": true,
    "order": 612,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [
      "opening"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "anime",
      "okotta"
    ]
  },
  {
    "name": "user_settings",
    "path": "extra/misc/user_settings/",
    "enabled": true,
    "order": 613,
    "dependencies": [
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [
      "opening",
      "itemmain"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill740",
    "path": "extra/card/skills/skill740/",
    "enabled": true,
    "order": 614,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "event"
    ],
    "optionalDependencies": [
      "opening"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "instance3",
    "path": "extra/instance/instance3_ascension/",
    "enabled": true,
    "order": 615,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "gameflow_combo",
      "map",
      "weather",
      "npc",
      "itemshop",
      "itemmain",
      "cardbase",
      "skillbase",
      "explore",
      "event",
      "metman",
      "npcchat"
    ],
    "optionalDependencies": [
      "item_misc",
      "ending"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/npc.data.config.php"
    ],
    "templates": []
  },
  {
    "name": "ex_alternative",
    "path": "extra/attr/ex_alternative/",
    "enabled": true,
    "order": 616,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "attrbase",
      "logger"
    ],
    "optionalDependencies": [
      "song",
      "armor",
      "armor_art",
      "weapon"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "use_alternative"
    ]
  },
  {
    "name": "skill182",
    "path": "extra/club/skills/skill182/",
    "enabled": true,
    "order": 617,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "bufficons",
      "song"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "cooldown",
    "path": "base/cooldown/",
    "enabled": true,
    "order": 618,
    "dependencies": [
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [
      "explore",
      "itemmain",
      "song"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/cooldown.config.php"
    ],
    "templates": []
  },
  {
    "name": "skill458",
    "path": "extra/card/skills/skill458/",
    "enabled": true,
    "order": 619,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmain",
      "poison",
      "edible",
      "input"
    ],
    "optionalDependencies": [
      "rage",
      "song"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "castsk458",
      "desc"
    ]
  },
  {
    "name": "skill498",
    "path": "extra/card/skills/skill498/",
    "enabled": true,
    "order": 620,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "song",
      "skill499"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "ex_attr_song",
    "path": "extra/attr/ex_attr_song/",
    "enabled": true,
    "order": 621,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "itemmain",
      "song",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill181",
    "path": "extra/club/skills/skill181/",
    "enabled": true,
    "order": 622,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "song",
      "lvlctl",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill376",
    "path": "extra/achievement/skills/skill376/",
    "enabled": true,
    "order": 623,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base",
      "song"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill381",
    "path": "extra/achievement/skills/skill381/",
    "enabled": true,
    "order": 624,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base",
      "song"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill88",
    "path": "extra/club/skills/skill88/",
    "enabled": true,
    "order": 625,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "song"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill91",
    "path": "extra/club/skills/skill91/",
    "enabled": true,
    "order": 626,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "song",
      "map"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill92",
    "path": "extra/club/skills/skill92/",
    "enabled": true,
    "order": 627,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "song"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill739",
    "path": "extra/card/skills/skill739/",
    "enabled": true,
    "order": 628,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "song"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill747",
    "path": "extra/card/skills/skill747/",
    "enabled": true,
    "order": 629,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "song",
      "metman"
    ],
    "optionalDependencies": [
      "noise"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "instance11",
    "path": "extra/instance/instance11_observe/",
    "enabled": true,
    "order": 630,
    "dependencies": [
      "sys",
      "player",
      "cardbase",
      "logger",
      "gameflow_combo",
      "map",
      "itemshop",
      "itemmain",
      "trap",
      "npc",
      "map_display",
      "item_misc",
      "armor",
      "news_observe",
      "enemy",
      "team"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/plsinfo.config.php",
      "config/npc.data.config.php",
      "config/shop.config.php"
    ],
    "templates": []
  },
  {
    "name": "wepchange",
    "path": "extra/attr/wepchange/",
    "enabled": true,
    "order": 631,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "itemmain",
      "input"
    ],
    "optionalDependencies": [
      "empowers"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "wepchange_profile"
    ]
  },
  {
    "name": "skill77",
    "path": "extra/club/skills/skill77/",
    "enabled": true,
    "order": 632,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "lvlctl",
      "skill70"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill379",
    "path": "extra/achievement/skills/skill379/",
    "enabled": true,
    "order": 633,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base",
      "cardbase",
      "attack",
      "skill598"
    ],
    "optionalDependencies": [
      "skill539"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill244",
    "path": "extra/club/skills/skill244/",
    "enabled": true,
    "order": 634,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack"
    ],
    "optionalDependencies": [
      "skill206"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill508",
    "path": "extra/card/skills/skill508/",
    "enabled": true,
    "order": 635,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [
      "ex_seckill",
      "skill206",
      "skill402",
      "skill447",
      "skill485"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill233",
    "path": "extra/club/skills/skill233/",
    "enabled": true,
    "order": 636,
    "dependencies": [
      "skillbase",
      "clubbase",
      "item_uee"
    ],
    "optionalDependencies": [
      "skill230",
      "skill231"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "smartmix",
    "path": "extra/misc/smartmix/",
    "enabled": true,
    "order": 637,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "itemmain",
      "itemmix"
    ],
    "optionalDependencies": [
      "itemmix_overlay",
      "itemmix_sync",
      "tutorial",
      "skill1003"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "itemmix",
      "mixhint_main"
    ]
  },
  {
    "name": "skill371",
    "path": "extra/achievement/skills/skill371/",
    "enabled": true,
    "order": 638,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base",
      "tutorial",
      "skill1000"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill363",
    "path": "extra/achievement/skills/skill363/",
    "enabled": true,
    "order": 639,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base",
      "skill326"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "instance5",
    "path": "extra/instance/instance5/",
    "enabled": true,
    "order": 640,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "gameflow_combo",
      "map",
      "itemmain",
      "itemshop",
      "weather",
      "npc"
    ],
    "optionalDependencies": [
      "skill313",
      "skill484",
      "clubbase"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/npc.data.config.php"
    ],
    "templates": []
  },
  {
    "name": "skill361",
    "path": "extra/activities/lunany2018/skill361/",
    "enabled": true,
    "order": 641,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base",
      "skill360"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill362",
    "path": "extra/activities/lunany2018/skill362/",
    "enabled": true,
    "order": 642,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base",
      "skill360",
      "cardbase",
      "get_qiegao_in_battle"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill365",
    "path": "extra/activities/aprilfool2018/skill365/",
    "enabled": true,
    "order": 643,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack",
      "achievement_base",
      "activity_ranking"
    ],
    "optionalDependencies": [
      "skill412",
      "skill469",
      "skill251"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "ranking"
    ]
  },
  {
    "name": "logistics",
    "path": "extra/misc/logistics/",
    "enabled": true,
    "order": 644,
    "dependencies": [
      "sys",
      "cardbase",
      "user_settings"
    ],
    "optionalDependencies": [
      "itemmain",
      "logger"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/logistics.config.php"
    ],
    "templates": [
      "use_gameitem_recorder"
    ]
  },
  {
    "name": "autopower",
    "path": "extra/misc/autopower/",
    "enabled": true,
    "order": 645,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "cooldown",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill601",
    "path": "extra/club/skills/skill601/",
    "enabled": true,
    "order": 646,
    "dependencies": [
      "skillbase",
      "clubbase",
      "bufficons",
      "player",
      "sys",
      "cooldown"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill602",
    "path": "extra/club/skills/skill602/",
    "enabled": true,
    "order": 647,
    "dependencies": [
      "skillbase",
      "clubbase",
      "bufficons",
      "player",
      "sys",
      "cooldown",
      "enemy",
      "weapon",
      "battle",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill603",
    "path": "extra/club/skills/skill603/",
    "enabled": true,
    "order": 648,
    "dependencies": [
      "skillbase",
      "clubbase",
      "bufficons",
      "player",
      "sys",
      "cooldown",
      "enemy",
      "weapon",
      "battle",
      "attack",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "item_uys",
    "path": "extra/item_extra/item_uys/",
    "enabled": true,
    "order": 649,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "cooldown",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "use_sewingkit"
    ]
  },
  {
    "name": "searchmemory",
    "path": "extra/searchmemory/",
    "enabled": true,
    "order": 650,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "explore",
      "itemmain",
      "metman",
      "enemy",
      "corpse",
      "cooldown"
    ],
    "optionalDependencies": [
      "tutorial",
      "gtype1",
      "item_misc",
      "skill245",
      "skill1003",
      "weather"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/searchmemory.config.php"
    ],
    "templates": [
      "smemorylist"
    ]
  },
  {
    "name": "skill738",
    "path": "extra/card/skills/skill738/",
    "enabled": true,
    "order": 651,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "explore",
      "cooldown"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill87",
    "path": "extra/club/skills/skill87/",
    "enabled": true,
    "order": 652,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "song",
      "lvlctl",
      "skill181"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill94",
    "path": "extra/club/skills/skill94/",
    "enabled": true,
    "order": 653,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "map",
      "song",
      "bufficons"
    ],
    "optionalDependencies": [
      "noise",
      "skill91"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "desc",
      "castsk94"
    ]
  },
  {
    "name": "skill68",
    "path": "extra/club/skills/skill68/",
    "enabled": true,
    "order": 654,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "itemshop"
    ],
    "optionalDependencies": [
      "instance11"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "instance_quit_button",
    "path": "extra/instance/instance_quit_button/",
    "enabled": true,
    "order": 655,
    "dependencies": [
      "sys",
      "player"
    ],
    "optionalDependencies": [
      "instance7",
      "instance11"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "instance_quit_button"
    ]
  },
  {
    "name": "skill497",
    "path": "extra/card/skills/skill497/",
    "enabled": true,
    "order": 656,
    "dependencies": [
      "skillbase",
      "clubbase",
      "skill244"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill503",
    "path": "extra/card/skills/skill503/",
    "enabled": true,
    "order": 657,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "map",
      "player",
      "logger",
      "item_uee"
    ],
    "optionalDependencies": [
      "skill233",
      "gtype1",
      "instance9"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "ueecmd"
    ]
  },
  {
    "name": "skill559",
    "path": "extra/card/skills/skill559/",
    "enabled": true,
    "order": 658,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "itemmix",
      "smartmix"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/skill559.config.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill544",
    "path": "extra/card/skills/skill544/",
    "enabled": true,
    "order": 659,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase"
    ],
    "optionalDependencies": [
      "skill247",
      "skill275",
      "skill484",
      "tutorial",
      "instance5",
      "instance8"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill366",
    "path": "extra/activities/aprilfool2018/skill366/",
    "enabled": true,
    "order": 660,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "achievement_base",
      "cardbase",
      "skill365",
      "attack"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill721",
    "path": "extra/card/skills/skill721/",
    "enabled": true,
    "order": 661,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "cooldown",
      "lvlctl",
      "itemmain",
      "rage",
      "autopower"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill228",
    "path": "extra/club/skills/skill228/",
    "enabled": true,
    "order": 662,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "sys",
      "logger",
      "skill602"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill236",
    "path": "extra/club/skills/skill236/",
    "enabled": true,
    "order": 663,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "skill602"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill237",
    "path": "extra/club/skills/skill237/",
    "enabled": true,
    "order": 664,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "logger",
      "skill601",
      "skill602"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill35",
    "path": "extra/club/skills/skill35/",
    "enabled": true,
    "order": 665,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger",
      "skill602"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill467",
    "path": "extra/card/skills/skill467/",
    "enabled": true,
    "order": 666,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger",
      "skill602"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill468",
    "path": "extra/card/skills/skill468/",
    "enabled": true,
    "order": 667,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "logger",
      "skill602"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill481",
    "path": "extra/card/skills/skill481/",
    "enabled": true,
    "order": 668,
    "dependencies": [
      "skillbase",
      "clubbase",
      "battle",
      "player",
      "weapon",
      "attack",
      "sys",
      "logger",
      "skill602"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill482",
    "path": "extra/card/skills/skill482/",
    "enabled": true,
    "order": 669,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "attack",
      "sys",
      "logger",
      "skill602"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill596",
    "path": "extra/card/skills/skill596/",
    "enabled": true,
    "order": 670,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "itemmain",
      "attrbase",
      "attack",
      "skill424",
      "skill602"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill595",
    "path": "extra/card/skills/skill595/",
    "enabled": true,
    "order": 671,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "weapon",
      "attack",
      "skill602"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill500",
    "path": "extra/card/skills/skill500/",
    "enabled": true,
    "order": 672,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "bufficons",
      "skill603",
      "trap",
      "weapon",
      "metman",
      "enemy",
      "attack",
      "battle"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "blessstone",
    "path": "extra/attr/blessstone/",
    "enabled": true,
    "order": 673,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "input"
    ],
    "optionalDependencies": [
      "empowers",
      "item_uys"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "use_blessstone"
    ]
  },
  {
    "name": "skill701",
    "path": "extra/card/skills/skill701/",
    "enabled": true,
    "order": 674,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "searchmemory"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "item_ext_armor",
    "path": "extra/item_extra/item_ext_armor/",
    "enabled": true,
    "order": 675,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "logger",
      "armor",
      "attrbase",
      "ex_attr_digit",
      "corpse",
      "npc"
    ],
    "optionalDependencies": [
      "searchmemory"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill567",
    "path": "extra/card/skills/skill567/",
    "enabled": true,
    "order": 676,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "itemmain",
      "poison",
      "edible",
      "attack",
      "searchmemory"
    ],
    "optionalDependencies": [
      "rage",
      "song"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill80",
    "path": "extra/club/skills/skill80/",
    "enabled": true,
    "order": 677,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger"
    ],
    "optionalDependencies": [
      "searchmemory"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill551",
    "path": "extra/card/skills/skill551/",
    "enabled": true,
    "order": 678,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "map",
      "searchmemory",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill554",
    "path": "extra/card/skills/skill554/",
    "enabled": true,
    "order": 679,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "searchmemory"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill1006",
    "path": "extra/club/skills/skill1006/",
    "enabled": true,
    "order": 680,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "searchmemory",
      "team"
    ],
    "optionalDependencies": [
      "cardbase"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "beaconlist"
    ]
  },
  {
    "name": "skill542",
    "path": "extra/card/skills/skill542/",
    "enabled": true,
    "order": 681,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "searchmemory"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill905",
    "path": "extra/instance/instance3_ascension/skill905/",
    "enabled": true,
    "order": 682,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "searchmemory"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill605",
    "path": "extra/club/skills/skill605/",
    "enabled": true,
    "order": 683,
    "dependencies": [
      "skillbase",
      "clubbase",
      "bufficons",
      "player",
      "sys",
      "logger",
      "searchmemory"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill563",
    "path": "extra/card/skills/skill563/",
    "enabled": true,
    "order": 684,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "skill559"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill36",
    "path": "extra/club/skills/skill36/",
    "enabled": true,
    "order": 685,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "weapon",
      "battle",
      "logger"
    ],
    "optionalDependencies": [
      "skill35"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill38",
    "path": "extra/club/skills/skill38/",
    "enabled": true,
    "order": 686,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "attack",
      "player",
      "weapon",
      "logger"
    ],
    "optionalDependencies": [
      "skill35"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill34",
    "path": "extra/club/skills/skill34/",
    "enabled": true,
    "order": 687,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "ex_phy_def",
      "ex_dmg_def",
      "itemmain",
      "attrbase",
      "logger",
      "input"
    ],
    "optionalDependencies": [
      "skill32",
      "skill35"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill538",
    "path": "extra/card/skills/skill538/",
    "enabled": true,
    "order": 688,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "skill424",
      "weapon"
    ],
    "optionalDependencies": [
      "skill467"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "ex_phy_nullify",
    "path": "extra/attr/ex_phy_nullify/",
    "enabled": true,
    "order": 689,
    "dependencies": [
      "itemmain",
      "logger",
      "attrbase",
      "skillbase",
      "weapon"
    ],
    "optionalDependencies": [
      "ex_phy_def",
      "ex_attr_charge",
      "empowers",
      "blessstone",
      "skill23",
      "item_uys"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_equipskill",
    "path": "extra/attr/ex_equipskill/",
    "enabled": true,
    "order": 690,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "attrbase",
      "logger",
      "clubbase",
      "skillbase",
      "skill_temp"
    ],
    "optionalDependencies": [
      "armor",
      "armor_art",
      "weapon",
      "wep_b_extra_reloading",
      "item_ext_armor"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_storage",
    "path": "extra/attr/ex_storage/",
    "enabled": true,
    "order": 691,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "attrbase",
      "logger"
    ],
    "optionalDependencies": [
      "wep_b_extra_reloading",
      "armor",
      "item_ext_armor",
      "ex_cursed"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "storage_profile",
      "open_storage"
    ]
  },
  {
    "name": "item_armor_empower",
    "path": "extra/item_extra/item_armor_empower/",
    "enabled": true,
    "order": 692,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "attrbase",
      "ex_mhp_temp_up",
      "logger",
      "armor",
      "input",
      "item_ext_armor"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "use_armor_empower"
    ]
  },
  {
    "name": "item_uvo_extra",
    "path": "extra/item_extra/item_uvo_extra/",
    "enabled": true,
    "order": 693,
    "dependencies": [
      "sys",
      "player",
      "cardbase",
      "skillbase",
      "clubbase",
      "logger",
      "item_uv",
      "attack",
      "searchmemory",
      "skill1006"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "uvo_extra_profile",
      "uvo_extra_use",
      "uvo_extra_mix"
    ]
  },
  {
    "name": "skill272",
    "path": "extra/club/skills/skill272/",
    "enabled": true,
    "order": 694,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attack",
      "ex_dmg_att",
      "bufficons",
      "searchmemory",
      "skill1006"
    ],
    "optionalDependencies": [
      "skill23"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "skill272_command"
    ]
  },
  {
    "name": "skill707",
    "path": "extra/card/skills/skill707/",
    "enabled": true,
    "order": 695,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "itemmain",
      "trap",
      "logger",
      "searchmemory",
      "skill1006"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "ex_residue",
    "path": "extra/attr/ex_residue/",
    "enabled": true,
    "order": 696,
    "dependencies": [
      "itemmain",
      "attrbase",
      "itemmix",
      "logger",
      "weapon",
      "armor"
    ],
    "optionalDependencies": [
      "searchmemory",
      "skill1006"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill576",
    "path": "extra/card/skills/skill576/",
    "enabled": true,
    "order": 697,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "item_recipe",
      "logger",
      "metman",
      "trap",
      "attack",
      "searchmemory",
      "skill1006"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill575",
    "path": "extra/card/skills/skill575/",
    "enabled": true,
    "order": 698,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "attack",
      "enemy",
      "rage",
      "logger",
      "itemmain",
      "item_recipe",
      "searchmemory",
      "skill1006"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill597",
    "path": "extra/card/skills/skill597/",
    "enabled": true,
    "order": 699,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "itemmain",
      "input",
      "corpse",
      "explore",
      "searchmemory",
      "skill1006",
      "metman"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "profilecmd",
      "castsk597"
    ]
  },
  {
    "name": "skill713",
    "path": "extra/card/skills/skill713/",
    "enabled": true,
    "order": 700,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "itemmain",
      "logger",
      "searchmemory",
      "skill1006"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill712",
    "path": "extra/card/skills/skill712/",
    "enabled": true,
    "order": 701,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "bufficons",
      "itemmain",
      "logger",
      "searchmemory",
      "skill1006"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill587",
    "path": "extra/card/skills/skill587/",
    "enabled": true,
    "order": 702,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "weapon",
      "attack",
      "skill586",
      "searchmemory",
      "skill1006"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill543",
    "path": "extra/card/skills/skill543/",
    "enabled": true,
    "order": 703,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "map",
      "itemmain",
      "npc",
      "skill1006"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill733",
    "path": "extra/card/skills/skill733/",
    "enabled": true,
    "order": 704,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "searchmemory",
      "skill1006"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "profilecmd",
      "castsk733"
    ]
  },
  {
    "name": "skill183",
    "path": "extra/club/skills/skill183/",
    "enabled": true,
    "order": 705,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "rest",
      "itemmain",
      "metman",
      "searchmemory",
      "skill1006"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill566",
    "path": "extra/card/skills/skill566/",
    "enabled": true,
    "order": 706,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "weapon",
      "skill34"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill604",
    "path": "extra/club/skills/skill604/",
    "enabled": true,
    "order": 707,
    "dependencies": [
      "skillbase",
      "clubbase",
      "bufficons",
      "player",
      "sys",
      "enemy",
      "weapon",
      "battle",
      "attack",
      "logger",
      "ex_dmg_def",
      "ex_hp_def",
      "ex_phy_def",
      "ex_phy_nullify",
      "ex_dmg_nullify"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_gender_attr",
    "path": "extra/attr/ex_gender_attr/",
    "enabled": true,
    "order": 708,
    "dependencies": [
      "sys",
      "itemmain",
      "logger",
      "skillbase",
      "attrbase",
      "weapon",
      "ex_phy_nullify"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "ex_attr_pierce",
    "path": "extra/attr/ex_attr_pierce/",
    "enabled": true,
    "order": 709,
    "dependencies": [
      "itemmain",
      "logger",
      "attrbase",
      "ex_dmg_att",
      "skillbase",
      "weapon",
      "ex_phy_def",
      "ex_dmg_def",
      "ex_phy_nullify",
      "ex_dmg_nullify",
      "ex_rapid_def"
    ],
    "optionalDependencies": [
      "armor",
      "ex_hp_def"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill903",
    "path": "extra/instance/instance3_ascension/skill903/",
    "enabled": true,
    "order": 710,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "trap",
      "metman",
      "itemmain",
      "ex_hp_def",
      "ex_phy_nullify",
      "ex_dmg_nullify",
      "enemy",
      "weapon"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill730",
    "path": "extra/card/skills/skill730/",
    "enabled": true,
    "order": 711,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "ex_storage"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill746",
    "path": "extra/card/skills/skill746/",
    "enabled": true,
    "order": 712,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "itemmain",
      "ex_storage"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "profilecmd",
      "castsk746"
    ]
  },
  {
    "name": "skill505",
    "path": "extra/card/skills/skill505/",
    "enabled": true,
    "order": 713,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "map",
      "logger",
      "armor",
      "weapon",
      "attack",
      "trap",
      "searchmemory",
      "itemmain"
    ],
    "optionalDependencies": [
      "item_uys",
      "skill23",
      "item_ext_armor",
      "item_armor_empower"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill960",
    "path": "extra/instance/instance10_rogue/skill960/",
    "enabled": true,
    "order": 714,
    "dependencies": [
      "skillbase",
      "clubbase",
      "cardbase",
      "sys",
      "player",
      "logger",
      "itemmain",
      "input",
      "attack",
      "npc",
      "itemmix"
    ],
    "optionalDependencies": [
      "skill952",
      "searchmemory",
      "skill1006",
      "item_uvo_extra"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/task.config.php"
    ],
    "templates": [
      "profilecmd",
      "castsk960",
      "desc"
    ]
  },
  {
    "name": "skill964",
    "path": "extra/instance/instance10_rogue/skill964/",
    "enabled": true,
    "order": 715,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "cardbase",
      "item_uvo_extra",
      "logger",
      "weapon",
      "attack",
      "ex_dmg_att",
      "enemy",
      "attrbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill106",
    "path": "extra/club/skills/skill106/",
    "enabled": true,
    "order": 716,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "skill272"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill709",
    "path": "extra/card/skills/skill709/",
    "enabled": true,
    "order": 717,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "itemmain",
      "attrbase",
      "weapon",
      "attack",
      "ex_residue",
      "searchmemory",
      "skill1006"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill722",
    "path": "extra/card/skills/skill722/",
    "enabled": true,
    "order": 718,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "ex_residue",
      "searchmemory"
    ],
    "optionalDependencies": [
      "noise"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill737",
    "path": "extra/card/skills/skill737/",
    "enabled": true,
    "order": 719,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "ex_residue"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "profilecmd",
      "castsk737"
    ]
  },
  {
    "name": "skill714",
    "path": "extra/card/skills/skill714/",
    "enabled": true,
    "order": 720,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "map",
      "attrbase",
      "ex_gender_attr"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "ex_purity",
    "path": "extra/attr/ex_purity/",
    "enabled": true,
    "order": 721,
    "dependencies": [
      "itemmain",
      "logger",
      "attrbase",
      "weapon",
      "battle",
      "attack",
      "ex_phy_def",
      "ex_rapid_def",
      "ex_attr_pierce"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "skill26",
    "path": "extra/club/skills/skill26/",
    "enabled": true,
    "order": 722,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "attrbase",
      "weapon",
      "sys",
      "ex_dmg_att",
      "attack",
      "ex_dmg_def",
      "ex_attr_pierce",
      "ex_dmg_nullify",
      "ex_rapid_attr",
      "itemmain",
      "logger"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill265",
    "path": "extra/club/skills/skill265/",
    "enabled": true,
    "order": 723,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "weapon",
      "sys",
      "logger",
      "attrbase",
      "ex_attr_pierce"
    ],
    "optionalDependencies": [
      "wep_j"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "skill507",
    "path": "extra/card/skills/skill507/",
    "enabled": true,
    "order": 724,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "battle",
      "attack",
      "weapon",
      "ex_attr_pierce",
      "attrbase",
      "metman",
      "npcchat"
    ],
    "optionalDependencies": [
      "enemy",
      "corpse",
      "team"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill113",
    "path": "extra/club/skills/skill113/",
    "enabled": true,
    "order": 725,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "ex_phy_def",
      "ex_dmg_def",
      "ex_hp_def",
      "ex_attr_pierce",
      "ex_phy_nullify",
      "ex_dmg_nullify"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "instance10",
    "path": "extra/instance/instance10_rogue/",
    "enabled": true,
    "order": 726,
    "dependencies": [
      "sys",
      "player",
      "itemmain",
      "itemshop",
      "trap",
      "gameflow_combo",
      "npc",
      "skillbase",
      "cardbase",
      "clubbase",
      "itemmix",
      "team",
      "map",
      "item_randskills",
      "skill960",
      "randnpc",
      "item_uee_extra"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/npc.data.config.php"
    ],
    "templates": []
  },
  {
    "name": "skill748",
    "path": "extra/card/skills/skill748/",
    "enabled": true,
    "order": 727,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "attack",
      "logger",
      "skill960"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill27",
    "path": "extra/club/skills/skill27/",
    "enabled": true,
    "order": 728,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "armor",
      "logger",
      "wound",
      "attrbase"
    ],
    "optionalDependencies": [
      "skill26"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill489",
    "path": "extra/card/skills/skill489/",
    "enabled": true,
    "order": 729,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "sys",
      "ex_dmg_att",
      "skill5",
      "skill6"
    ],
    "optionalDependencies": [
      "ex_dmg_def",
      "skill26",
      "skill461"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill266",
    "path": "extra/club/skills/skill266/",
    "enabled": true,
    "order": 730,
    "dependencies": [
      "skillbase",
      "clubbase",
      "player",
      "logger",
      "skill205",
      "skill265",
      "input"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill81",
    "path": "extra/club/skills/skill81/",
    "enabled": true,
    "order": 731,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "enemy",
      "battle",
      "attack",
      "attrbase"
    ],
    "optionalDependencies": [
      "skill50",
      "skill265",
      "skill207"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill509",
    "path": "extra/card/skills/skill509/",
    "enabled": true,
    "order": 732,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "weapon",
      "enemy",
      "metman"
    ],
    "optionalDependencies": [
      "skill507"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill510",
    "path": "extra/card/skills/skill510/",
    "enabled": true,
    "order": 733,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "weapon",
      "ex_dmg_def",
      "ex_hp_def",
      "ex_phy_def",
      "ex_attr_pierce",
      "ex_phy_nullify",
      "ex_dmg_nullify"
    ],
    "optionalDependencies": [
      "skill507",
      "skill243"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "skill962",
    "path": "extra/instance/instance10_rogue/skill962/",
    "enabled": true,
    "order": 734,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "logger",
      "instance10",
      "skill960",
      "bufficons"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "bubblebox",
    "path": "extra/misc/bubblebox/",
    "enabled": false,
    "order": 735,
    "dependencies": [],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "start",
      "end"
    ]
  },
  {
    "name": "skill86",
    "path": "extra/club/skills/skill86/",
    "enabled": false,
    "order": 736,
    "dependencies": [
      "sys",
      "player",
      "skillbase",
      "clubbase",
      "attack",
      "weapon",
      "logger",
      "skill56"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "desc",
      "battlecmd_desc"
    ]
  },
  {
    "name": "gtype2",
    "path": "extra/instance/gtype2/main/",
    "enabled": false,
    "order": 737,
    "dependencies": [
      "sys",
      "map",
      "player",
      "logger",
      "metman",
      "gameflow_combo",
      "map",
      "weather",
      "lvlctl",
      "skill475",
      "npc",
      "itemshop",
      "skill235"
    ],
    "optionalDependencies": [
      "scpdrink",
      "cardbase"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "gtype3",
    "path": "extra/instance/gtype3/main/",
    "enabled": false,
    "order": 738,
    "dependencies": [
      "sys",
      "map",
      "player",
      "logger",
      "metman",
      "gameflow_combo",
      "map",
      "weather",
      "lvlctl",
      "cardbase"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  },
  {
    "name": "gtype5",
    "path": "extra/instance/gtype5/main/",
    "enabled": false,
    "order": 739,
    "dependencies": [
      "sys",
      "player",
      "logger",
      "metman",
      "gameflow_combo",
      "map",
      "itemmain",
      "itemshop",
      "trap",
      "npc",
      "skill21"
    ],
    "optionalDependencies": [
      "skillbase"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/npc.data.config.php",
      "config/evonpc.config.php"
    ],
    "templates": []
  },
  {
    "name": "skill1005",
    "path": "extra/instance/gtype5/skill1005/",
    "enabled": false,
    "order": 740,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack",
      "itemmain"
    ],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/skill1005.config.php"
    ],
    "templates": [
      "profilecmd",
      "desc"
    ]
  },
  {
    "name": "skill1004",
    "path": "extra/instance/gtype5/skill1004/",
    "enabled": false,
    "order": 741,
    "dependencies": [
      "skillbase",
      "clubbase",
      "sys",
      "player",
      "logger",
      "attack"
    ],
    "optionalDependencies": [
      "skill497",
      "gtype5"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php",
      "config/skill1004.config.php"
    ],
    "templates": [
      "desc"
    ]
  },
  {
    "name": "glowbutton",
    "path": "extra/misc/glowbutton/",
    "enabled": false,
    "order": 742,
    "dependencies": [],
    "optionalDependencies": [],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": [
      "start",
      "end"
    ]
  },
  {
    "name": "halloween2017",
    "path": "extra/activities/halloween2017/main/",
    "enabled": false,
    "order": 743,
    "dependencies": [
      "sys",
      "player",
      "battle",
      "attack",
      "weapon"
    ],
    "optionalDependencies": [
      "pose",
      "tactic"
    ],
    "conflicts": [],
    "codeFiles": [
      "main.php"
    ],
    "templates": []
  }
] as const;

export const LEGACY_PLAYER_FIELDS = [
  {
    "name": "pid",
    "sqlType": "mediumint(8)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 0
  },
  {
    "name": "type",
    "sqlType": "tinyint(3)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 1
  },
  {
    "name": "name",
    "sqlType": "char(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 2
  },
  {
    "name": "pass",
    "sqlType": "char(32)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 3
  },
  {
    "name": "ip",
    "sqlType": "char(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 4
  },
  {
    "name": "motto",
    "sqlType": "char(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 5
  },
  {
    "name": "killmsg",
    "sqlType": "char(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 6
  },
  {
    "name": "lastword",
    "sqlType": "char(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 7
  },
  {
    "name": "winner_flag",
    "sqlType": "tinyint(1)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 8
  },
  {
    "name": "player_dead_flag",
    "sqlType": "tinyint(1)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 9
  },
  {
    "name": "corpse_clear_flag",
    "sqlType": "tinyint(1)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 10
  },
  {
    "name": "gd",
    "sqlType": "char(1)",
    "runtimeType": "string",
    "defaultValue": "m",
    "order": 11
  },
  {
    "name": "sNo",
    "sqlType": "smallint(5)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 12
  },
  {
    "name": "club",
    "sqlType": "tinyint(3)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 13
  },
  {
    "name": "validtime",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 14
  },
  {
    "name": "endtime",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 15
  },
  {
    "name": "cdsec",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 16
  },
  {
    "name": "cdmsec",
    "sqlType": "smallint(3)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 17
  },
  {
    "name": "cdtime",
    "sqlType": "mediumint(8)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 18
  },
  {
    "name": "action",
    "sqlType": "char(12)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 19
  },
  {
    "name": "a_actionnum",
    "sqlType": "mediumint(8)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 20
  },
  {
    "name": "v_actionnum",
    "sqlType": "smallint(5)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 21
  },
  {
    "name": "hp",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 22
  },
  {
    "name": "mhp",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 23
  },
  {
    "name": "sp",
    "sqlType": "mediumint(8)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 24
  },
  {
    "name": "msp",
    "sqlType": "mediumint(8)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 25
  },
  {
    "name": "ss",
    "sqlType": "smallint(5)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 26
  },
  {
    "name": "mss",
    "sqlType": "smallint(5)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 27
  },
  {
    "name": "att",
    "sqlType": "smallint(5)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 28
  },
  {
    "name": "def",
    "sqlType": "smallint(5)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 29
  },
  {
    "name": "pls",
    "sqlType": "tinyint(3)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 30
  },
  {
    "name": "lvl",
    "sqlType": "tinyint(3)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 31
  },
  {
    "name": "exp",
    "sqlType": "smallint(5)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 32
  },
  {
    "name": "money",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 33
  },
  {
    "name": "rp",
    "sqlType": "mediumint(8)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 34
  },
  {
    "name": "bid",
    "sqlType": "mediumint(8)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 35
  },
  {
    "name": "inf",
    "sqlType": "char(10)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 36
  },
  {
    "name": "rage",
    "sqlType": "tinyint(3)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 37
  },
  {
    "name": "pose",
    "sqlType": "tinyint(1)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 38
  },
  {
    "name": "tactic",
    "sqlType": "tinyint(1)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 39
  },
  {
    "name": "killnum",
    "sqlType": "smallint(5)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 40
  },
  {
    "name": "npckillnum",
    "sqlType": "smallint(5)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 41
  },
  {
    "name": "state",
    "sqlType": "tinyint(3)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 42
  },
  {
    "name": "skillpoint",
    "sqlType": "smallint(5)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 43
  },
  {
    "name": "flare",
    "sqlType": "tinyint(1)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 44
  },
  {
    "name": "wp",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 45
  },
  {
    "name": "wk",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 46
  },
  {
    "name": "wg",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 47
  },
  {
    "name": "wc",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 48
  },
  {
    "name": "wd",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 49
  },
  {
    "name": "wf",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 50
  },
  {
    "name": "icon",
    "sqlType": "varchar(255)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 51
  },
  {
    "name": "teamID",
    "sqlType": "char(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 52
  },
  {
    "name": "teamPass",
    "sqlType": "char(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 53
  },
  {
    "name": "card",
    "sqlType": "smallint(5)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 54
  },
  {
    "name": "cardname",
    "sqlType": "varchar(50)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 55
  },
  {
    "name": "wep",
    "sqlType": "varchar(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 56
  },
  {
    "name": "wepk",
    "sqlType": "varchar(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 57
  },
  {
    "name": "wepe",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 58
  },
  {
    "name": "weps",
    "sqlType": "varchar(10)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 59
  },
  {
    "name": "wepsk",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 60
  },
  {
    "name": "arb",
    "sqlType": "varchar(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 61
  },
  {
    "name": "arbk",
    "sqlType": "varchar(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 62
  },
  {
    "name": "arbe",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 63
  },
  {
    "name": "arbs",
    "sqlType": "varchar(10)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 64
  },
  {
    "name": "arbsk",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 65
  },
  {
    "name": "arh",
    "sqlType": "varchar(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 66
  },
  {
    "name": "arhk",
    "sqlType": "varchar(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 67
  },
  {
    "name": "arhe",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 68
  },
  {
    "name": "arhs",
    "sqlType": "varchar(10)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 69
  },
  {
    "name": "arhsk",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 70
  },
  {
    "name": "ara",
    "sqlType": "varchar(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 71
  },
  {
    "name": "arak",
    "sqlType": "varchar(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 72
  },
  {
    "name": "arae",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 73
  },
  {
    "name": "aras",
    "sqlType": "varchar(10)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 74
  },
  {
    "name": "arask",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 75
  },
  {
    "name": "arf",
    "sqlType": "varchar(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 76
  },
  {
    "name": "arfk",
    "sqlType": "varchar(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 77
  },
  {
    "name": "arfe",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 78
  },
  {
    "name": "arfs",
    "sqlType": "varchar(10)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 79
  },
  {
    "name": "arfsk",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 80
  },
  {
    "name": "art",
    "sqlType": "varchar(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 81
  },
  {
    "name": "artk",
    "sqlType": "varchar(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 82
  },
  {
    "name": "arte",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 83
  },
  {
    "name": "arts",
    "sqlType": "varchar(10)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 84
  },
  {
    "name": "artsk",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 85
  },
  {
    "name": "itm0",
    "sqlType": "varchar(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 86
  },
  {
    "name": "itmk0",
    "sqlType": "varchar(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 87
  },
  {
    "name": "itme0",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 88
  },
  {
    "name": "itms0",
    "sqlType": "varchar(10)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 89
  },
  {
    "name": "itmsk0",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 90
  },
  {
    "name": "itm1",
    "sqlType": "varchar(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 91
  },
  {
    "name": "itmk1",
    "sqlType": "varchar(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 92
  },
  {
    "name": "itme1",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 93
  },
  {
    "name": "itms1",
    "sqlType": "varchar(10)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 94
  },
  {
    "name": "itmsk1",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 95
  },
  {
    "name": "itm2",
    "sqlType": "varchar(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 96
  },
  {
    "name": "itmk2",
    "sqlType": "varchar(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 97
  },
  {
    "name": "itme2",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 98
  },
  {
    "name": "itms2",
    "sqlType": "varchar(10)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 99
  },
  {
    "name": "itmsk2",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 100
  },
  {
    "name": "itm3",
    "sqlType": "varchar(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 101
  },
  {
    "name": "itmk3",
    "sqlType": "varchar(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 102
  },
  {
    "name": "itme3",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 103
  },
  {
    "name": "itms3",
    "sqlType": "varchar(10)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 104
  },
  {
    "name": "itmsk3",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 105
  },
  {
    "name": "itm4",
    "sqlType": "varchar(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 106
  },
  {
    "name": "itmk4",
    "sqlType": "varchar(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 107
  },
  {
    "name": "itme4",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 108
  },
  {
    "name": "itms4",
    "sqlType": "varchar(10)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 109
  },
  {
    "name": "itmsk4",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 110
  },
  {
    "name": "itm5",
    "sqlType": "varchar(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 111
  },
  {
    "name": "itmk5",
    "sqlType": "varchar(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 112
  },
  {
    "name": "itme5",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 113
  },
  {
    "name": "itms5",
    "sqlType": "varchar(10)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 114
  },
  {
    "name": "itmsk5",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 115
  },
  {
    "name": "itm6",
    "sqlType": "varchar(30)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 116
  },
  {
    "name": "itmk6",
    "sqlType": "varchar(15)",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 117
  },
  {
    "name": "itme6",
    "sqlType": "int(10)",
    "runtimeType": "number",
    "defaultValue": 0,
    "order": 118
  },
  {
    "name": "itms6",
    "sqlType": "varchar(10)",
    "runtimeType": "string",
    "defaultValue": "0",
    "order": 119
  },
  {
    "name": "itmsk6",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 120
  },
  {
    "name": "searchmemory",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 121
  },
  {
    "name": "nskill",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 122
  },
  {
    "name": "nskillpara",
    "sqlType": "text",
    "runtimeType": "string",
    "defaultValue": "",
    "order": 123
  }
] as const;

export type LegacyModuleName = typeof LEGACY_MODULES[number]["name"];
export type LegacyPlayerFieldName = typeof LEGACY_PLAYER_FIELDS[number]["name"];

export const ENABLED_LEGACY_MODULES = LEGACY_MODULES.filter((entry) => entry.enabled);

export function getLegacyModule(name: LegacyModuleName) {
  return LEGACY_MODULES.find((entry) => entry.name === name)!;
}

export function createLegacyPlayerRecord(): Record<LegacyPlayerFieldName, string | number> {
  return Object.fromEntries(LEGACY_PLAYER_FIELDS.map((field) => [field.name, field.defaultValue])) as Record<LegacyPlayerFieldName, string | number>;
}
