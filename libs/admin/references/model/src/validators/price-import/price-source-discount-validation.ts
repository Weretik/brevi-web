/** Discount off the supplier price: 0–90%, up to 2 decimals; null when valid. */
export function validatePriceSourceDiscount(value: string): string | null {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return 'Вкажіть число, до 2 знаків після коми.';
  const percent = Number(normalized);
  return percent > 90 ? 'Знижка — від 0 до 90%.' : null;
}

export const parsePriceSourceDiscount = (value: string): number =>
  Number(value.trim().replace(',', '.'));
