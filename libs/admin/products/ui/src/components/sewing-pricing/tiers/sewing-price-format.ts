const currency = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });

const wholeCurrency = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  maximumFractionDigits: 0,
});

/** Short form for summaries: whole hryvnias, so a range always fits one line. */
export const sewingWholePriceFormat = (value: number) => wholeCurrency.format(value);

export const sewingPriceFormat = (value: number) => currency.format(value);
