/**
 * Port of the area and zone helpers in the original's core/map module.
 *
 * These decide which zones exist, which have become forbidden as the map
 * shrinks, and where a player may still move — the spine of exploration.
 * They are small, but each one runs on PHP's own array behaviour, so the
 * port goes through PhpArray and the same library functions the original
 * calls rather than JavaScript arrays.
 *
 * Original functions read their inputs with get_var_in_module($name,
 * $module), which resolves to the global ___LOCAL_<MODULE>__VARS__<name>.
 * That indirection is modelled by ModuleVariables so a caller supplies the
 * same values the original would have had.
 *
 * Held to the original by test/legacy-map-area.parity.test.mjs.
 */
import { PHP_BUILTINS } from "./template/builtins";
import { PhpArray, toBool, toInt, toNumber, type PhpValue } from "./template/values";

/** Reads a module's variables the way get_var_in_module() does. */
export interface ModuleVariables {
  /** Returns null for an unset variable, as the original does. */
  get(module: string, name: string): PhpValue;
}

/**
 * Converts plain JavaScript values into PHP ones.
 *
 * Module variables arrive from JSON or from literals, where an array is a
 * JavaScript array and a keyed map is an object. The original sees both as
 * PHP arrays, and every helper below relies on that — count(), in_array()
 * and array_slice() all behave differently against a bare JavaScript value.
 */
export function toPhpValue(value: unknown): PhpValue {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean" || typeof value === "number" || typeof value === "string") return value;
  if (value instanceof PhpArray) return value;
  if (Array.isArray(value)) {
    const array = new PhpArray();
    for (const item of value) array.push(toPhpValue(item));
    return array;
  }
  if (typeof value === "object") {
    const array = new PhpArray();
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      array.set(key, toPhpValue(item));
    }
    return array;
  }
  return null;
}

/** Builds a ModuleVariables from a plain `{ "sys.arealist": [...] }` map. */
export function moduleVariables(values: Readonly<Record<string, unknown>>): ModuleVariables {
  const converted = new Map<string, PhpValue>();
  for (const [key, value] of Object.entries(values)) converted.set(key, toPhpValue(value));
  return {
    get(module, name) {
      return converted.get(`${module}.${name}`) ?? null;
    }
  };
}

const asArray = (value: PhpValue): PhpArray => (value instanceof PhpArray ? value : new PhpArray());

/** PHP's sizeof() over a value that may not be an array. */
const sizeOf = (value: PhpValue): number => toInt(PHP_BUILTINS.count?.([value]) ?? 0);

/** PHP's array_slice, which reindexes integer keys. */
function arraySlice(input: PhpArray, offset: number, length?: number): PhpArray {
  const values = input.values();
  const from = offset < 0 ? Math.max(values.length + offset, 0) : Math.min(offset, values.length);
  let to = values.length;
  if (length !== undefined) {
    to = length < 0 ? Math.max(values.length + length, from) : Math.min(from + length, values.length);
  }
  return PhpArray.from(values.slice(from, to));
}

/** `if($use_config) return sizeof(plsinfo); return sizeof(arealist);` */
export function getPlsnum(vars: ModuleVariables, useConfig: PhpValue = 0): number {
  if (toBool(useConfig)) return sizeOf(vars.get("map", "plsinfo"));
  return sizeOf(vars.get("sys", "arealist"));
}

/**
 * `if($use_config) return array_keys(plsinfo);` then the cached list, then
 * a sorted copy of sys.arealist. `sort()` orders in place by PHP's own
 * comparison and reindexes, which is why this does not simply read arealist.
 */
export function getAllPlsno(vars: ModuleVariables, useConfig: PhpValue = 0): PhpArray {
  if (toBool(useConfig)) {
    return PhpArray.from(asArray(vars.get("map", "plsinfo")).keys() as PhpValue[]);
  }
  const cached = vars.get("map", "all_plsno_cache");
  if (toBool(cached)) return asArray(cached);
  const sorted = asArray(vars.get("sys", "arealist")).clone();
  PHP_BUILTINS.sort?.([sorted]);
  return sorted;
}

/** `if(!in_array($plsno, $all)) $plsno = $all[0]; return $plsno;` */
export function checkPls(vars: ModuleVariables, plsno: PhpValue): PhpValue {
  const all = getAllPlsno(vars);
  if (!toBool(PHP_BUILTINS.in_array?.([plsno, all]) ?? false)) return all.get(0);
  return plsno;
}

/** `return in_array($plsno, get_all_plsno());` */
export function isPlsnoAvailable(vars: ModuleVariables, plsno: PhpValue): boolean {
  return toBool(PHP_BUILTINS.in_array?.([plsno, getAllPlsno(vars)]) ?? false);
}

/** `max(0, floor((sys.areanum - sizeof(map.area_on_start)) / map.areaadd))` */
export function getAreaWavenum(vars: ModuleVariables): number {
  const areanum = toNumber(vars.get("sys", "areanum"));
  const onStart = sizeOf(vars.get("map", "area_on_start"));
  const areaadd = toNumber(vars.get("map", "areaadd"));
  return Math.max(0, Math.floor((areanum - onStart) / areaadd));
}

/** `array_slice(sys.arealist, 0, sys.areanum + $wave * map.areaadd)` */
export function getCurrentArea(vars: ModuleVariables, wave: PhpValue = 0): PhpArray {
  const length = toNumber(vars.get("sys", "areanum")) + toNumber(wave) * toNumber(vars.get("map", "areaadd"));
  return arraySlice(asArray(vars.get("sys", "arealist")), 0, toInt(length));
}

/** `array_slice(sys.arealist, sys.areanum + $wave * map.areaadd)` */
export function getCurrentNotArea(vars: ModuleVariables, wave: PhpValue = 0): PhpArray {
  const offset = toNumber(vars.get("sys", "areanum")) + toNumber(wave) * toNumber(vars.get("map", "areaadd"));
  return arraySlice(asArray(vars.get("sys", "arealist")), toInt(offset));
}

/** `return in_array($pno, get_current_area($wave));` */
export function checkInForbiddenArea(vars: ModuleVariables, pno: PhpValue, wave: PhpValue = 0): boolean {
  return toBool(PHP_BUILTINS.in_array?.([pno, getCurrentArea(vars, wave)]) ?? false);
}

/** `is_plsno_available($pno) && (!check_in_forbidden_area($pno) || sys.hack)` */
export function checkCanEnter(vars: ModuleVariables, pno: PhpValue): boolean {
  if (!isPlsnoAvailable(vars, pno)) return false;
  return !checkInForbiddenArea(vars, pno) || toBool(vars.get("sys", "hack"));
}

/**
 * Room type 14 is the timed duel, which shrinks every five minutes
 * regardless of the configured interval; otherwise the interval is looked up
 * by game type and falls back to entry 0.
 */
export function getAreaInterval(vars: ModuleVariables): PhpValue {
  if (toInt(vars.get("sys", "groomtype")) === 14) return 5;
  const gametype = vars.get("sys", "gametype");
  const intervals = asArray(vars.get("map", "areainterval"));
  if (intervals.has(gametype)) return intervals.get(gametype);
  return intervals.get(0);
}

/** `$ret = get_current_not_area(); if(!empty($ret) && $flag) array_diff(..)` */
export function getSafePlslist(vars: ModuleVariables, noDangerousZone: PhpValue = true): PhpArray {
  const remaining = getCurrentNotArea(vars);
  if (!toBool(remaining) || !toBool(noDangerousZone)) return remaining;

  // array_diff keeps the original keys, unlike array_slice above.
  const dangerous = asArray(vars.get("map", "dangerous_zone")).values();
  const kept = new PhpArray();
  for (const [key, value] of remaining.pairs()) {
    const excluded = dangerous.some(zone => PHP_BUILTINS.strval?.([zone]) === PHP_BUILTINS.strval?.([value]));
    if (!excluded) kept.set(key, value);
  }
  return kept;
}

/** `array_slice($arealist, $areanum + ($wave - 1) * $areaadd, $areaadd)` */
export function getArealistNextadd(vars: ModuleVariables, wave: PhpValue = 1): PhpArray {
  const areanum = toNumber(vars.get("sys", "areanum"));
  const areaadd = toNumber(vars.get("map", "areaadd"));
  const offset = areanum + (toNumber(wave) - 1) * areaadd;
  return arraySlice(asArray(vars.get("sys", "arealist")), toInt(offset), toInt(areaadd));
}
