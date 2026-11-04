const money = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const plain = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

/** «4 077,00»: sums and prices, always two decimals. */
export const formatEmbroideryMoney = (value: number): string => money.format(value);

/** «2,86», «18», «1 000»: quantities without trailing zeros. */
export const formatEmbroideryNumber = (value: number): string => plain.format(value);

/** «1 год 30 хв», «45 хв». */
export function formatEmbroideryMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes - hours * 60);
  if (hours === 0) return `${rest} хв`;
  return rest === 0 ? `${hours} год` : `${hours} год ${rest} хв`;
}

/** What «Копіювати ціну» puts on the clipboard for one price level. */
export function embroideryPriceText(
  price: { name: string; unit: number; total: number },
  quantity: number,
): string {
  return `Вишивка, ${price.name.toLowerCase()}: ${formatEmbroideryMoney(price.unit)} грн за 1 шт, ${formatEmbroideryNumber(quantity)} шт — ${formatEmbroideryMoney(price.total)} грн.`;
}

const dateTime = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Kyiv',
});

/** «04.11.2026, 21:52» in Kyiv time. */
export const formatEmbroideryDateTime = (iso: string): string => dateTime.format(new Date(iso));

/** The saved name, or «Без назви». */
export const embroiderySavedTitle = (name: string): string => name.trim() || 'Без назви';
