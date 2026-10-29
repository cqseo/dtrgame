import type { LegacyPlayerRecord } from "./player";
import { emptyLegacyItem, type LegacyItem } from "./item";

type LegacyInventorySlot = 1 | 2 | 3 | 4 | 5 | 6;
const field = (prefix: "itm" | "itmk" | "itme" | "itms" | "itmsk", slot: LegacyInventorySlot): keyof LegacyPlayerRecord => `${prefix}${slot}` as keyof LegacyPlayerRecord;

export function readLegacyPlayerInventory(player: LegacyPlayerRecord): LegacyItem[] {
  return Array.from({ length: 6 }, (_, offset) => {
    const slot = (offset + 1) as LegacyInventorySlot;
    const item = emptyLegacyItem();
    item.itm = String(player[field("itm", slot)] ?? "");
    item.itmk = String(player[field("itmk", slot)] ?? "");
    item.itme = Number(player[field("itme", slot)] ?? 0);
    item.itms = player[field("itms", slot)] ?? 0;
    item.itmsk = String(player[field("itmsk", slot)] ?? "");
    return item;
  });
}

export function writeLegacyPlayerInventory(player: LegacyPlayerRecord, inventory: readonly LegacyItem[]): void {
  for (let offset = 0; offset < 6; offset++) {
    const slot = (offset + 1) as LegacyInventorySlot;
    const item = inventory[offset] ?? emptyLegacyItem();
    player[field("itm", slot)] = item.itm;
    player[field("itmk", slot)] = item.itmk;
    player[field("itme", slot)] = item.itme;
    player[field("itms", slot)] = item.itms;
    player[field("itmsk", slot)] = item.itmsk;
  }
}

export function writeLegacyPendingItem(player: LegacyPlayerRecord, item: LegacyItem | undefined): void {
  const value = item ?? emptyLegacyItem();
  player.itm0 = value.itm;
  player.itmk0 = value.itmk;
  player.itme0 = value.itme;
  player.itms0 = value.itms;
  player.itmsk0 = value.itmsk;
}
