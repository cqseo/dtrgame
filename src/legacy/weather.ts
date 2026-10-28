export interface LegacyWeatherDefinition {
  id: number;
  nameHtml: string;
  itemFindOdds: number;
  meetCharacterOdds: number;
  activeOdds: number;
  attackModifier: number;
  defenseModifier: number;
  fog: boolean;
}

const names = ["晴天", "大晴", "多云", "小雨", "暴雨", "台风", "雷雨", "下雪", "起雾", "浓雾", '<span class="yellow b">瘴气</span>', '<span class="red b">龙卷风</span>', '<span class="cyan b">暴风雪</span>', '<span class="blue b">冰雹</span>', '<span class="linen b">离子暴</span>', '<span class="green b">辐射尘</span>', '<span class="purple b">臭氧洞</span>', '<span class="gold b">极光</span>', '<span class="ltazure b">冷气</span>', '<span class="ltcrimson b">暖气</span>'] as const;
const itemFind = [10, 20, 0, -2, -3, -10, -7, 5, -10, -20, 0, -7, -5, -30, -5, -20, 0, 20, 20, 20] as const;
const meetCharacter = [10, 20, 0, -2, -3, -10, -7, 5, -10, -20, 0, -7, -5, -30, -5, -20, 0, 20, 20, 20] as const;
const active = [10, 20, 0, -5, -10, -20, -15, 0, -7, -10, -10, -5, 0, -5, -20, -5, 0, 20, 20, 20] as const;
const attack = [10, 10, 0, -5, -10, -20, -15, 0, 0, 7, 20, -7, -20, -5, -10, -10, -10, 10, 0, 0] as const;
const defense = [10, 30, 0, 0, -3, -15, -10, 0, -20, -30, -50, -5, -20, -3, -20, 5, -30, 30, 0, 0] as const;
const fog = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0] as const;

export const LEGACY_WEATHER: readonly LegacyWeatherDefinition[] = names.map((nameHtml, id) => ({
  id,
  nameHtml,
  itemFindOdds: itemFind[id]!,
  meetCharacterOdds: meetCharacter[id]!,
  activeOdds: active[id]!,
  attackModifier: attack[id]!,
  defenseModifier: defense[id]!,
  fog: Boolean(fog[id])
}));

export const getLegacyWeather = (id: number): LegacyWeatherDefinition => LEGACY_WEATHER[id] ?? LEGACY_WEATHER[0]!;
export const legacyWeatherAttackMultiplier = (id: number): number => 1 + getLegacyWeather(id).attackModifier / 100;
export const legacyWeatherDefenseMultiplier = (id: number): number => 1 + getLegacyWeather(id).defenseModifier / 100;
export const legacyWeatherHitRateBonus = (id: number): number => id === 12 ? 20 : 0;
export const LEGACY_INITIAL_WEATHER_IDS = [0, 2, 3, 4, 7] as const;
