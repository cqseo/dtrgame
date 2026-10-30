/**
 * Port of the card-pack availability rules in extra/card/cardbase.
 *
 * These decide which card packs a player can draw from and which cards
 * count as theirs, so they gate what the card screens offer.
 *
 * Held to the original by test/legacy-card-pack.parity.test.mjs.
 */
import { PHP_BUILTINS } from "./template/builtins";
import { PhpArray, toBool, toInt, toNumber, type PhpValue } from "./template/values";
import { toPhpValue, type ModuleVariables } from "./map-area";

const asArray = (value: unknown): PhpArray => {
  const converted = toPhpValue(value);
  return converted instanceof PhpArray ? converted : new PhpArray();
};

/** The configured list of card packs. */
export function getCardPackList(vars: ModuleVariables): PhpValue {
  return vars.get("cardbase", "packlist");
}

/** Whether a name is one of the configured packs. */
export function inCardPack(vars: ModuleVariables, packName: PhpValue): boolean {
  return Boolean(PHP_BUILTINS.in_array?.([packName, vars.get("cardbase", "packlist")]));
}

/**
 * Whether a card belongs to a player.
 *
 * Card 0 is the blank and always passes. Game type 5 additionally grants
 * cards 182 to 185 to everyone, which is how that mode hands out its own
 * set without writing it to each player.
 */
export function checkCardInOwnlist(
  vars: ModuleVariables,
  card: PhpValue,
  ownedCards: unknown
): boolean {
  if (toInt(card) === 0) return true;
  if (PHP_BUILTINS.in_array?.([card, asArray(ownedCards)])) return true;
  if (toNumber(vars.get("sys", "gametype")) === 5) {
    return Boolean(PHP_BUILTINS.in_array?.([card, PhpArray.from([182, 183, 184, 185])]));
  }
  return false;
}

/**
 * Whether a pack can be drawn from now.
 *
 * "hidden" and "stealth" are never offered. A pack with a start time is
 * unavailable until it arrives. With `ignoreKuji` set, packs on the
 * kuji-exclusion list are dropped as well — the flag selects that
 * exclusion rather than suppressing it.
 */
export function checkPackAvailble(
  vars: ModuleVariables,
  packName: PhpValue,
  ignoreKuji: PhpValue = 0
): boolean {
  if (PHP_BUILTINS.in_array?.([packName, PhpArray.from(["hidden", "stealth"])])) return false;

  const starts = asArray(vars.get("cardbase", "packstart"));
  const start = starts.get(packName);
  if (toBool(start) && toNumber(start) > toNumber(vars.get("sys", "now"))) return false;

  if (toBool(ignoreKuji)) {
    if (PHP_BUILTINS.in_array?.([packName, vars.get("cardbase", "pack_ignore_kuji")])) return false;
  }
  return true;
}

/** Keeps only the packs that can be drawn from, in their original order. */
export function packFilter(
  vars: ModuleVariables,
  packList: unknown,
  ignoreKuji: PhpValue = 0
): PhpArray {
  const kept = new PhpArray();
  for (const pack of asArray(packList).values()) {
    if (checkPackAvailble(vars, pack, ignoreKuji)) kept.push(pack);
  }
  return kept;
}
