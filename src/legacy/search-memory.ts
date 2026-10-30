/**
 * Port of the search-memory helpers in extra/searchmemory.
 *
 * Search memory is what a player has seen recently — items on the ground,
 * other players, corpses — and these decide what stays in it between turns.
 * Which entries survive differs by game type and, for corpses, by a
 * per-room option, so the checks read both.
 *
 * Held to the original by test/legacy-search-memory.parity.test.mjs.
 */
import { PHP_BUILTINS } from "./template/builtins";
import { PhpArray, toBool, type PhpValue } from "./template/values";
import { toPhpValue, type ModuleVariables } from "./map-area";

const asArray = (value: unknown): PhpArray => {
  const converted = toPhpValue(value);
  return converted instanceof PhpArray ? converted : new PhpArray();
};

/** isset(): present and not null. An empty string still counts as set. */
const isSet = (row: PhpArray, key: string): boolean => row.has(key) && row.get(key) !== null;

/**
 * The label for one remembered thing: an item's name, otherwise a player's
 * name, otherwise nothing. Checked with isset(), so an empty name is still
 * chosen over falling through to the next field.
 */
export function getMemoryName(memory: unknown): PhpValue {
  const row = asArray(memory);
  if (isSet(row, "itm")) return row.get("itm");
  if (isSet(row, "Pname")) return row.get("Pname");
  return "";
}

/** How long a remembered sighting stays before it can be replaced. */
export function getSearchmemoryColdtime(vars: ModuleVariables): PhpValue {
  return vars.get("searchmemory", "searchmemorycoldtime");
}

/** Whether this game type keeps other players in search memory. */
export function checkKeepEnemyInSearchmemory(vars: ModuleVariables): boolean {
  const allowed = vars.get("searchmemory", "gametype_keep_enemy_in_searchmemory");
  return Boolean(PHP_BUILTINS.in_array?.([vars.get("sys", "gametype"), allowed]));
}

/**
 * Whether corpses stay in search memory.
 *
 * True for the game types that always keep them, and also when the room's
 * own options turn it on — which is how the PvE and logging rooms enable it
 * without being listed.
 */
export function checkKeepCorpseInSearchmemory(vars: ModuleVariables): boolean {
  const allowed = vars.get("searchmemory", "gametype_keep_corpse_in_searchmemory");
  if (PHP_BUILTINS.in_array?.([vars.get("sys", "gametype"), allowed])) return true;

  const roomOptions = asArray(vars.get("sys", "roomvars")).get("current_game_option");
  return toBool(asArray(roomOptions).get("keep_corpse_in_searchmemory"));
}
