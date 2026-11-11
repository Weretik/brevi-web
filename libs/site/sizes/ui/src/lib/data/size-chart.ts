export type Gender = 'men' | 'women';

/** One clothing size row: the Russian size range printed on the label and the chest girth in centimetres. */
export type ClothingRow = { size: string; chest: readonly [number, number] };

/** One height group: the number printed on the label and its interval in centimetres. */
export type HeightRow = { group: string; height: readonly [number, number] };

/** One shoe row: the longest foot length in centimetres that fits the size. */
export type ShoeRow = { size: number; foot: number };

/** Size chart of the live `brevi.com.ua` page «Таблиця розмірів» (workwear in even sizes, groups by height). */
export const CLOTHING_ROWS: Record<Gender, readonly ClothingRow[]> = {
  men: [
    { size: '44–46', chest: [86, 94] },
    { size: '48–50', chest: [95, 102] },
    { size: '52–54', chest: [103, 110] },
    { size: '56–58', chest: [111, 118] },
    { size: '60–62', chest: [119, 126] },
  ],
  women: [
    { size: '44–46', chest: [86, 94] },
    { size: '48–50', chest: [95, 102] },
    { size: '52–54', chest: [103, 110] },
    { size: '56–58', chest: [111, 118] },
    { size: '60–62', chest: [119, 126] },
    { size: '64–66', chest: [127, 134] },
  ],
};

/** The live page prints «168–169» for women's group 5–6; the 12 cm step of the other groups gives 168–179. */
export const HEIGHT_ROWS: Record<Gender, readonly HeightRow[]> = {
  men: [
    { group: '1–2', height: [155, 167] },
    { group: '3–4', height: [168, 179] },
    { group: '5–6', height: [180, 191] },
  ],
  women: [
    { group: '1–2', height: [143, 155] },
    { group: '3–4', height: [156, 167] },
    { group: '5–6', height: [168, 179] },
  ],
};

export const SHOE_ROWS: readonly ShoeRow[] = Array.from({ length: 13 }, (_, index) => ({
  size: 34 + index,
  foot: 22.5 + index * 0.5,
}));

/** Chest girth between two printed ranges (for example 94.5) rounds up to the next size. */
export function findClothingSize(gender: Gender, chest: number): ClothingRow | null {
  const rows = CLOTHING_ROWS[gender];
  const value = Math.ceil(chest);
  return rows.find((row) => value >= row.chest[0] && value <= row.chest[1]) ?? null;
}

export function findHeightGroup(gender: Gender, height: number): HeightRow | null {
  const value = Math.round(height);
  return (
    HEIGHT_ROWS[gender].find((row) => value >= row.height[0] && value <= row.height[1]) ?? null
  );
}

/** The foot length is rounded up to the next half centimetre, as the live page advises. */
export function findShoeSize(foot: number): ShoeRow | null {
  const [first] = SHOE_ROWS;
  if (foot <= first.foot) return foot > 0 ? first : null;
  return SHOE_ROWS.find((row) => foot <= row.foot) ?? null;
}

/** Text of a range, «86–94». */
export function range([from, to]: readonly [number, number]): string {
  return `${from}–${to}`;
}

/** Foot length with a decimal comma, «22,5». */
export function formatFoot(foot: number): string {
  return String(foot).replace('.', ',');
}
