import { createLegacyPlayerRecord, type LegacyPlayerFieldName } from "../generated/legacy-registry";
import { LEGACY_STARTING_ITEMS, LEGACY_STARTING_WEAPONS } from "../generated/legacy-starting-items";
import { assertLegacyRandomResult, type LegacyRandom } from "./random";

export type LegacyPlayerRecord = Record<LegacyPlayerFieldName, string | number>;

export interface LegacyEntryInput {
  name: string;
  storedPass?: string;
  gender: "m" | "f";
  icon: string | number;
  serialNumber: number;
  now: number;
  random: LegacyRandom;
  areaWave: number;
}

/** Exact base player construction from include/valid.func.php before card/skill hooks. */
export function createLegacyEntrant(input: LegacyEntryInput): LegacyPlayerRecord {
  const player = createLegacyPlayerRecord();
  const randomStatOffset = assertLegacyRandomResult(input.random.int(0, 10), 0, 10);
  player.name = input.name;
  player.pass = input.storedPass ?? "";
  player.gd = input.gender;
  player.icon = input.icon;
  player.type = 0;
  player.endtime = input.now;
  player.validtime = input.now;
  player.sNo = input.serialNumber;
  player.hp = player.mhp = 400;
  player.sp = player.msp = 400;
  player.ss = player.mss = 0;
  player.att = 95 + randomStatOffset;
  player.def = 105 - randomStatOffset;
  player.pls = 0;
  player.killnum = player.npckillnum = 0;
  player.lvl = 0;
  player.exp = input.areaWave * 80;
  player.skillpoint = 0;
  player.money = 20;
  player.rage = 0;
  player.pose = 3;
  player.tactic = 2;
  player.club = 0;
  player.state = 0;
  player.wp = player.wk = player.wg = player.wc = player.wd = player.wf = 0;
  player.inf = player.teamID = player.teamPass = "";

  // Exact base equipment supplied by itemmain\init_enter_battlefield_items().
  player.arb = input.gender === "m" ? "男生校服" : "女生校服";
  player.arbk = "DB";
  player.arbe = 5;
  player.arbs = "15";
  player.itm1 = "面包";
  player.itmk1 = "HH";
  player.itme1 = 100;
  player.itms1 = "30";
  player.itm2 = "矿泉水";
  player.itmk2 = "HS";
  player.itme2 = 100;
  player.itms2 = "30";

  // Exact weighted random pools from itemmain/config/stwep.config.php and stitem.config.php.
  const weaponIndex = assertLegacyRandomResult(input.random.int(0, LEGACY_STARTING_WEAPONS.length - 1), 0, LEGACY_STARTING_WEAPONS.length - 1);
  const weapon = LEGACY_STARTING_WEAPONS[weaponIndex]!;
  player.wep = weapon.itm;
  player.wepk = weapon.itmk;
  player.wepe = weapon.itme;
  player.weps = String(weapon.itms);
  player.wepsk = weapon.itmsk;
  for (const slot of [3, 4] as const) {
    const itemIndex = assertLegacyRandomResult(input.random.int(0, LEGACY_STARTING_ITEMS.length - 1), 0, LEGACY_STARTING_ITEMS.length - 1);
    const item = LEGACY_STARTING_ITEMS[itemIndex]!;
    player[`itm${slot}`] = item.itm;
    player[`itmk${slot}`] = item.itmk;
    player[`itme${slot}`] = item.itme;
    player[`itms${slot}`] = String(item.itms);
    player[`itmsk${slot}`] = item.itmsk;
  }
  return player;
}
