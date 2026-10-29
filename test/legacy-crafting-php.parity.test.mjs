import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { LEGACY_RECIPES } from "../src/generated/legacy-recipes";
import { applyLegacyCraftResult, normalizeLegacyRecipeName, reduceLegacyCraftMaterial } from "../src/legacy/crafting";
import { getLegacyCraftOptions } from "../src/legacy/special-crafting";
import { validateLegacyCraftSlots, legacyMixMask } from "../src/legacy/crafting-action";
import { getLegacyCompoundAttribute, encodeLegacyAttributePayload, decodeLegacyAttributePayload, processLegacyAttributeConfig } from "../src/legacy/attributes";

const php = process.env.DTS_PHP_BIN;
const source = resolve(process.env.DTS_LEGACY_ROOT ?? "../legacy-dts");
const item = (itm, itmk = "X", itms = 1, itmsk = "") => ({ itm, itmk, itme: 1, itms, itmsk });
const canonicalItem = value => ({ ...value, itms: value.itms === "∞" ? "∞" : Number(value.itms) });
const optionView = ({ type, group, result }) => ({ type, group, result: canonicalItem(result) });
const oracle = cases => {
  try {
    const extensions = process.env.DTS_PHP_TOKENIZER ? ["-d", `extension=${process.env.DTS_PHP_TOKENIZER}`] : [];
    return JSON.parse(execFileSync(php, [...extensions, "scripts/php-crafting-reference.php"], {
      input: JSON.stringify({ root: source, cases }), encoding: "utf8", maxBuffer: 32 * 1024 * 1024,
      timeout: 30000
    }));
  } catch (error) { throw new Error(`PHP reference failed: ${error.stdout ?? ""}\n${error.stderr ?? ""}\n${error.message}`); }
};

// Run `npm run test:php-parity`; ordinary unit runs explicitly report these as skipped.
describe.skipIf(!php)("captured original PHP vs TypeScript crafting differential", () => {
  it("preserves all 465 evaluated PHP configuration arrays, including full encoded attributes", () => {
    const [expected] = oracle([{ action: "recipes" }]);
    expect(LEGACY_RECIPES.map(({ ingredients, group, result, tips }) => ({ ingredients, group, result: canonicalItem(result), tips }))).toEqual(expected);
  });

  it("matches normalization on every ingredient and PHP whitespace edge", () => {
    const names = [...new Set(LEGACY_RECIPES.flatMap(recipe => recipe.ingredients))];
    names.push("\0\t面包\v\n", "\u00a0面包\u00a0", "小黄的[+12]钉棍棒-改", "锋利的电气毒性棍棒");
    expect(names.map(normalizeLegacyRecipeName)).toEqual(oracle([{ action: "normalize", names }])[0]);
  });

  it("matches outcome order for all recipe ingredient lists and star/attribute combinations", () => {
    const cases = LEGACY_RECIPES.map(recipe => ({ action: "options", items: recipe.ingredients.map(name => item(name)) }));
    for (let star = 1; star <= 12; star++) {
      for (let count = 2; count <= 6; count++) {
        for (const attributes of ["", "s", "s^001", "s^002", "J", "sJ^001^002"]) {
          cases.push({ action: "options", items: Array.from({ length: count }, (_, i) => item(`素材${i}${i === 0 ? "-仮" : ""}`, `WC${star}`, i === 1 && count === 6 ? 0 : "∞", i === 0 ? attributes : "^001")) });
        }
      }
    }
    cases.push(
      { action: "options", items: [item("动力工具龙 ★7", "WC07", 1, "^002"), item("调整", "WC02", 1, "s")] },
      { action: "options", items: [item("救世龙 ★1", "WC01", 1, "s"), item("星尘龙 ★8", "WC08"), item("剩余", "WC01")] },
      { action: "options", items: [item("红莲魔龙 ★8", "WC08"), item("A", "WC02", 1, "s"), item("B", "WC01", 1, "s"), item("C", "WC01", 1, "s")] },
      { action: "options", items: [item("调整", "WC02", 1, "s^001"), item("A", "WC05", 1, "^001"), item("B", "WC05", 1, "^001")] },
      { action: "options", items: [item("调整", "WC04", 1, "s^001"), ...Array.from({length:4}, (_,i) => item(`同调${i}`, "WC02", 1, "^001"))] }
    );
    const expected = oracle(cases);
    cases.forEach((entry, index) => expect(getLegacyCraftOptions(entry.items).map(optionView), `case ${index}: ${JSON.stringify(entry.items)}`).toEqual(expected[index]));
  });

  it("matches material consumption for every category and durability boundary", () => {
    const kinds = ["Y","B","C","X","TN","GB","HH","PH9","VF","MV","R","WC","WK","WG","DB","EE","ER","ss"];
    const cases = kinds.flatMap(kind => [0, "0", 1, "1", 2, 99, "∞"].map(durability => ({ action: "reduce", items: [item("原始材料", kind, durability)] })));
    const expected = oracle(cases);
    cases.forEach((entry, index) => {
      const material = structuredClone(entry.items[0]);
      const logHtml = reduceLegacyCraftMaterial(material);
      expect({ item: material, logHtml }, `${entry.items[0].itmk}/${entry.items[0].itms}`).toEqual(expected[index]);
    });
  });

  it("matches mutation, result, proficiency and exact log for every match at clubs 0, 7, 16", () => {
    const cases = [];
    for (const recipe of LEGACY_RECIPES) {
      const items = recipe.ingredients.map((name, index) => item(name, index % 2 ? "WK" : "X", index % 3 ? 2 : "∞"));
      const options = getLegacyCraftOptions(items);
      options.forEach((option, selection) => { for (const club of [0, 7, 16]) cases.push({ action: "craft", items, selection, club }); });
    }
    for (const items of [
      [item("调整", "WC02", 1, "s"), item("素材", "WC02")],
      [item("A", "WC04"), item("B", "WC04")],
      [item("动力工具龙 ★7", "WC07", 1, "^002"), item("调整", "WC02", 1, "s")]
    ]) getLegacyCraftOptions(items).forEach((option, selection) => cases.push({ action: "craft", items, selection, club: 0 }));
    const expected = oracle(cases);
    cases.forEach((entry, index) => {
      const materials = structuredClone(entry.items);
      const option = getLegacyCraftOptions(materials)[entry.selection];
      const actual = applyLegacyCraftResult(materials, option.result, entry.club, option.type);
      expect({ materials, ...actual, result: canonicalItem(actual.result) }, `craft case ${index}`).toEqual(expected[index]);
    });
  });

  it("matches slot errors, validation order and masks", () => {
    const items = [item("材料1"), item("材料2"), item(""), item("材料4"), item("材料5"), item("材料6")];
    const cases = [[1,1],[],[1],[1,3],[1,2],[6,4,2],[1,2,4,5,6]].map(slots => ({ action: "validate", items, slots }));
    const expected = oracle(cases);
    cases.forEach((entry, index) => {
      const actual = validateLegacyCraftSlots(items, entry.slots);
      expect({ ...actual, mode: actual.ok ? "itemmain" : "itemmix", mixMask: legacyMixMask(entry.slots) }).toEqual(expected[index]);
    });
  });

  it("matches compound attribute encoding, nested payloads, decoding and literal numeric markers", () => {
    const values = LEGACY_RECIPES.map(recipe => recipe.result.itmsk).concat([
      "^res_<:comp_itmsk:>{杯子,WC,1,1,,}1^rtype2",
      "^res_<:comp_itmsk:>{甲,X,1,2,^res_<:comp_itmsk:>{乙,X,1,1,}1}1",
      "^res_<:comp_itmsk:>{杯子<:sepr:>WC<:sepr:>1<:sepr:>1<:sepr:>}1",
      "^res_<:comp_itmsk:>{}1",
      "^res_<:comp_itmsk:>{a}1^res_<:comp_itmsk:>{b}1"
    ]);
    expect(values.map(processLegacyAttributeConfig)).toEqual(oracle([{action:"attribute-config", values}])[0]);
    const plain = ["", "杯子,WC,1,1,,", "1/2+3=4", "嵌套,道具,^001", "abc", "ab", "a"];
    const encoded = oracle([{action:"attribute-encode", values:plain}])[0];
    expect(plain.map(encodeLegacyAttributePayload)).toEqual(encoded);
    expect(encoded.map(decodeLegacyAttributePayload)).toEqual(oracle([{action:"attribute-decode", values:encoded}])[0]);
    const marks = ["s", "^001", "^002", "^ac1", "^ac", "^res_abc1", "^rtype2", "^a1b2", "^", ""];
    expect(marks.map(value => { const parts = getLegacyCompoundAttribute(value); return parts ? [parts.head,parts.digits,parts.payload] : null; })).toEqual(oracle([{action:"attribute-parts",values:marks}])[0]);
  });
});
