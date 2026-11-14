const quantity = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 3 });

/** «1,9 м», «9 шт.». */
export const formatCompositionQuantity = (value: number, unit: string) =>
  `${quantity.format(value)} ${unit}`;

/** «FUR-021 Підкладка поліестерова», or the code alone when the reference is gone. */
export const compositionMaterialText = (line: { code: string | null; name: string | null }) =>
  [line.code, line.name].filter(Boolean).join(' ') || '—';
