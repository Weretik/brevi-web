import type { ModelComposition } from '../entities/model-composition';

const quantity = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 3 });

/** Every word of the search must be in the model code or name. */
export function filterModelCompositions(
  rows: readonly ModelComposition[],
  search: string,
): ModelComposition[] {
  const words = search.trim().toLocaleLowerCase('uk').split(/\s+/).filter(Boolean);
  if (words.length === 0) return [...rows];
  return rows.filter((row) => {
    const text = `${row.modelCode} ${row.modelName}`.toLocaleLowerCase('uk');
    return words.every((word) => text.includes(word));
  });
}

/** «1,9 м», «9 шт.». */
export const formatCompositionQuantity = (value: number, unit: string) =>
  `${quantity.format(value)} ${unit}`;

/** «FUR-021 Підкладка поліестерова», or the code alone when the reference is gone. */
export const compositionMaterialText = (line: { code: string | null; name: string | null }) =>
  [line.code, line.name].filter(Boolean).join(' ') || '—';
