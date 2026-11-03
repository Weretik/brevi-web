/** Markups are fractions (0.45 = 45 %), as in «Параметри ціноутворення». */
export const ppeMarkupPercent = (value: number) =>
  `${(value * 100).toLocaleString('uk-UA', { maximumFractionDigits: 2 })} %`;
