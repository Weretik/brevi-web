import { describe, expect, it } from 'vitest';

import {
  embroideryPriceText,
  formatEmbroideryMinutes,
  formatEmbroideryMoney,
} from './embroidery-format';

const space = (text: string) => text.replace(/\s/g, ' ');

describe('embroidery formatting', () => {
  it('writes money with two decimals and minutes as hours', () => {
    expect(space(formatEmbroideryMoney(4077))).toBe('4 077,00');
    expect(formatEmbroideryMinutes(90)).toBe('1 год 30 хв');
    expect(formatEmbroideryMinutes(45)).toBe('45 хв');
    expect(formatEmbroideryMinutes(120)).toBe('2 год');
  });

  it('copies one price as a sentence', () => {
    expect(space(embroideryPriceText({ name: 'Опт', unit: 81.54, total: 4077 }, 50))).toBe(
      'Вишивка, опт: 81,54 грн за 1 шт, 50 шт — 4 077,00 грн.',
    );
  });
});
