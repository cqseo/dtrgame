import { decodeLegacyAttributePayload, encodeLegacyAttributePayload, readLegacyAttribute, replaceLegacyAttribute } from "./attributes";
import { clearLegacyItem, isLegacyItemEmpty, legacyScalarTruthy, LEGACY_INFINITE_DURABILITY, type LegacyItem } from "./item";

export function getLegacyResidue(attributes: string): LegacyItem | null {
  const payload = readLegacyAttribute("^res", attributes);
  if (typeof payload !== "string" || !legacyScalarTruthy(payload)) return null;
  const decoded = decodeLegacyAttributePayload(payload);
  if (!legacyScalarTruthy(decoded)) return null;
  const [itm, itmk, itme, itms, itmsk] = decoded.split(",");
  if (itm === undefined || itmk === undefined || itme === undefined || itms === undefined || itmsk === undefined) return null;
  return { itm, itmk, itme: Number(itme), itms: itms === LEGACY_INFINITE_DURABILITY ? itms : Number(itms), itmsk };
}

export function setLegacyResidue(attributes: string, residue: LegacyItem | null): string {
  let result = attributes;
  if (readLegacyAttribute("^res", result)) result = replaceLegacyAttribute("^res", "", result);
  if (residue) result += `^res_${encodeLegacyAttributePayload([residue.itm, residue.itmk, residue.itme, residue.itms, residue.itmsk].join(","))}1`;
  return result;
}

/** Only normal recipes use represented names; sync/overlay inspect the actual item. */
export function getLegacyCraftRepresentation(item: LegacyItem): LegacyItem {
  const type = Number(readLegacyAttribute("^reptype", item.itmsk));
  return type === 2 || type === 3 ? getLegacyResidue(item.itmsk) ?? item : item;
}

const residueStack = /^(Y|B|C|X|TN|GB|H|P|V|M)/;
const reduceResidueUse = (item: LegacyItem): void => {
  item.itms = item.itms !== LEGACY_INFINITE_DURABILITY && residueStack.test(item.itmk) ? Number(item.itms) - 1 : 0;
};

export interface LegacyCraftResidueReduction {
  handled: boolean;
  logHtml: string;
  /** Persist these as map drops and add skill1006 beacons in the caller's transaction. */
  drops: LegacyItem[];
}

/** ex_residue/itemmix_reduce, including debug mode's disabled search memory. */
export function reduceLegacyCraftResidue(item: LegacyItem, gameType = 0): LegacyCraftResidueReduction {
  const unchanged: LegacyCraftResidueReduction = { handled: false, logHtml: "", drops: [] };
  if (isLegacyItemEmpty(item)) return { ...unchanged, handled: true };
  const representation = Number(readLegacyAttribute("^reptype", item.itmsk));
  const type = Number(readLegacyAttribute("^rtype", item.itmsk));
  if (![2, 3].includes(representation) && ![1, 2, 3].includes(type)) return unchanged;
  const residue = getLegacyResidue(item.itmsk);
  if (!residue) return unchanged;
  const done: LegacyCraftResidueReduction = { handled: true, logHtml: "", drops: [] };
  if (representation === 2 || representation === 3) {
    reduceResidueUse(residue);
    if (legacyScalarTruthy(residue.itms)) {
      if (type === 3) {
        done.logHtml = `<span class="red b">${item.itm}</span>变成了<span class="red b">${residue.itm}</span>。<br>`;
        Object.assign(item, residue);
      } else item.itmsk = setLegacyResidue(item.itmsk, residue);
    } else if (type === 4) {
      done.logHtml = `<span class="red b">${item.itm}</span>烟消云散了。<br>`;
      clearLegacyItem(item);
    } else {
      done.logHtml = `<span class="yellow b">${item.itm}</span>变得没有什么特别了。<br>`;
      for (const mark of ["^res", "^rtype", "^reptype"]) item.itmsk = replaceLegacyAttribute(mark, "", item.itmsk);
    }
    return done;
  }
  reduceResidueUse(item);
  if (Number(item.itms) <= 0) {
    done.logHtml = `<span class="red b">${item.itm}</span>用光了。<br>你获得了<span class="red b">${residue.itm}</span>。<br>`;
    Object.assign(item, residue);
  } else if (type === 1) {
    if (gameType !== 1) {
      done.logHtml = `<span class="red b">${residue.itm}</span>掉到了你的脚边。<br>`;
      done.drops.push(residue);
    } else {
      done.logHtml = `<span class="yellow b">“等你有空了再说吧。”</span>因为你整个包裹都没有空位，<span class="yellow b">${residue.itm}</span>叹息着离开了游戏。<br>`;
    }
  } else if (type === 3) {
    done.logHtml = `<span class="red b">${item.itm}</span>变成了<span class="red b">${residue.itm}</span>。<br>`;
    Object.assign(item, residue);
  }
  return done;
}
