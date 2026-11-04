import { describe, expect, it } from 'vitest';

import { parseQuotePrice, priceInputText } from './quote-price-text';

describe('quote price text', () => {
  it('reads prices typed with a comma, a dot or spaces', () => {
    expect(parseQuotePrice('1 364,5')).toBe(1364.5);
    expect(parseQuotePrice('1364.50')).toBe(1364.5);
    expect(parseQuotePrice('12,345')).toBeNull();
    expect(parseQuotePrice('abc')).toBeNull();
  });

  it('writes an input text with a comma', () => {
    expect(priceInputText(1364.5)).toBe('1364,5');
    expect(priceInputText(null)).toBe('');
  });
});
