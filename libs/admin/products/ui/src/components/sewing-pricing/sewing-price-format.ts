const currency = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });

export const sewingPriceFormat = (value: number) => currency.format(value);
