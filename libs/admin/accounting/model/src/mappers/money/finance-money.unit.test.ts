import { describe, expect, it } from 'vitest';

import { formatLedgerDate, formatMinor, minorToInput, parseMoneyToMinor } from './finance-money';

describe('finance money', () => {
  it.each([
    ['62 546,40', 6_254_640],
    ['62 546.4', 6_254_640],
    ['100', 10_000],
    ['-1 200,05', -120_005],
    ['0,00', 0],
    ['15 грн', 1_500],
  ])('reads %s as %d kopecks', (text, minor) => {
    expect(parseMoneyToMinor(text)).toBe(minor);
  });

  it.each(['', 'abc', '1,234', '1.2.3', '999999999999999'])('rejects %s', (text) => {
    expect(parseMoneyToMinor(text)).toBeNull();
  });

  it('writes kopecks back for the form and for reading', () => {
    expect(minorToInput(6_254_640)).toBe('62546,40');
    expect(minorToInput(-5)).toBe('-0,05');
    expect(parseMoneyToMinor(minorToInput(-120_005))).toBe(-120_005);
    expect(formatMinor(6_254_640).replace(/\s/g, ' ')).toBe('62 546,40 ₴');
    expect(formatLedgerDate('2026-10-01')).toBe('01.10.2026');
  });
});
