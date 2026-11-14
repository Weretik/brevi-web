/** Colours of the КП PDF «Класика+» (the server draws it with the same ones). */
export const accent = '#FD9600';
export const accentText = '#9A5A00';
export const accentOnDark = '#FFB547';
export const graphite = '#262626';
export const line = '#E2DED8';
export const muted = '#555555';

export const tileBand = '#ECEBE8';
export const tileBody = '#F8F7F5';

/** The example model: two fabric variants, the second one recommended. */
export const fabrics = [
  {
    name: 'Тканина «Грета»',
    details: '65% ПЕ / 35% бавовна · 210 г/м²',
    tiles: [
      { label: 'Ціна за 1 шт.', value: '1 180 грн' },
      { label: 'до 40 шт.', value: '1 120 грн' },
      { label: 'від 41 шт.', value: '1 050 грн' },
    ],
    recommended: false,
  },
  {
    name: 'Тканина «Балтика»',
    details: '80% ПЕ / 20% бавовна · 240 г/м²',
    tiles: [
      { label: 'Ціна за 1 шт.', value: '1 290 грн' },
      { label: 'від 41 шт.', value: '1 160 грн' },
    ],
    recommended: true,
  },
];
