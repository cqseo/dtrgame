import { describe, expect, it } from "vitest";
import { callOriginal, hasOracle } from "./support/php-oracle.mjs";
import {
  checkCardInOwnlist,
  checkPackAvailble,
  getCardPackList,
  inCardPack,
  packFilter
} from "../src/legacy/card-pack";
import { moduleVariables } from "../src/legacy/map-area";

/**
 * Holds the card-pack rules in extra/card/cardbase to the original.
 *
 * The cases cover the three ways a pack can be withheld (always hidden, not
 * started yet, excluded from kuji) and the game-type-5 card grant, since
 * those are the branches the card screens actually hit.
 *
 * Run through `npm run test:php-parity`.
 */
const BOOTSTRAP = { bootstrap: "full" };

function seedGlobals(values) {
  const globals = {};
  for (const [key, value] of Object.entries(values)) {
    const [module, name] = key.split(".");
    globals[`___LOCAL_${module.toUpperCase()}__VARS__${name}`] = value;
  }
  return globals;
}

const NOW = 1762000000;

const PACK_LIST = ["normal", "event", "hidden", "stealth", "soon", "kujionly"];

const CARDBASE = {
  "sys.now": NOW,
  "cardbase.packlist": PACK_LIST,
  // "soon" opens in the future; "event" opened in the past; the "0" entry
  // checks that empty() lets a zero start time through.
  "cardbase.packstart": { soon: NOW + 86400, event: NOW - 86400, normal: 0 },
  "cardbase.pack_ignore_kuji": ["kujionly", "event"]
};

describe.skipIf(!hasOracle)("card pack rules against the original", () => {
  it("matches get_card_pack_list and in_card_pack", () => {
    const globals = seedGlobals(CARDBASE);
    const port = moduleVariables(CARDBASE);
    const names = ["normal", "hidden", "missing", "", 0, "0"];

    const calls = [{ fn: "\\cardbase\\get_card_pack_list", args: [], globals }];
    for (const name of names) {
      calls.push({ fn: "\\cardbase\\in_card_pack", args: [name], globals });
    }
    const results = callOriginal(calls, BOOTSTRAP);

    expect([...getCardPackList(port).values()]).toEqual(results[0].value);
    names.forEach((name, index) => {
      expect(inCardPack(port, name), `in_card_pack(${JSON.stringify(name)})`)
        .toBe(results[index + 1].value);
    });
  });

  it("matches check_card_in_ownlist across game types", () => {
    const owned = [7, 42, "99"];
    const cards = [0, "0", 7, "7", 42, 182, 183, 185, 186, 99, "99", 1];
    const differences = [];

    for (const gametype of [0, 1, 5, "5", 9]) {
      const vars = { "sys.gametype": gametype };
      const globals = seedGlobals(vars);
      const port = moduleVariables(vars);
      const expected = callOriginal(
        cards.map(card => ({
          fn: "\\cardbase\\check_card_in_ownlist",
          args: [card, owned],
          globals
        })),
        BOOTSTRAP
      );
      cards.forEach((card, index) => {
        const actual = checkCardInOwnlist(port, card, owned);
        if (actual !== expected[index].value) {
          differences.push(
            `gametype=${JSON.stringify(gametype)} card=${JSON.stringify(card)}: ${actual} != ${expected[index].value}`
          );
        }
      });
    }
    expect(differences).toEqual([]);
  });

  it("matches check_pack_availble and pack_filter with and without the kuji exclusion", () => {
    const globals = seedGlobals(CARDBASE);
    const port = moduleVariables(CARDBASE);
    const probes = [...PACK_LIST, "unknown", ""];
    const differences = [];

    for (const ignoreKuji of [0, 1]) {
      const expected = callOriginal(
        [
          ...probes.map(pack => ({
            fn: "\\cardbase\\check_pack_availble",
            args: [pack, ignoreKuji],
            globals
          })),
          { fn: "\\cardbase\\pack_filter", args: [PACK_LIST, ignoreKuji], globals }
        ],
        BOOTSTRAP
      );

      probes.forEach((pack, index) => {
        const actual = checkPackAvailble(port, pack, ignoreKuji);
        if (actual !== expected[index].value) {
          differences.push(`ignore_kuji=${ignoreKuji} ${JSON.stringify(pack)}: ${actual} != ${expected[index].value}`);
        }
      });

      const filtered = [...packFilter(port, PACK_LIST, ignoreKuji).values()];
      const expectedFiltered = expected[probes.length].value;
      if (JSON.stringify(filtered) !== JSON.stringify(expectedFiltered)) {
        differences.push(
          `ignore_kuji=${ignoreKuji} pack_filter ${JSON.stringify(filtered)} != ${JSON.stringify(expectedFiltered)}`
        );
      }
    }
    expect(differences).toEqual([]);
  });
});
