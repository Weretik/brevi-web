const formatter = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** «1 364,17» (the КП shows prices without a currency sign, they are in UAH); a missing price is «—». */
export function formatQuotePrice(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : formatter.format(value);
}

/** Reads a typed price («1 364,5» or «1364.50»); null when the text is not a price. */
export function parseQuotePrice(text: string): number | null {
  const normalized = text.replace(/\s/g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  return Number(normalized);
}

/** «1364,5» for an input; empty for null. */
export function priceInputText(value: number | null): string {
  return value === null ? '' : String(value).replace('.', ',');
}
