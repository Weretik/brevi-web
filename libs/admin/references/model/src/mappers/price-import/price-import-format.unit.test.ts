import { describe, expect, it } from 'vitest';

import {
  canRefreshPriceSource,
  formatDiscount,
  isPriceImportProblem,
  priceFileLabel,
  sortPriceImportRows,
} from './price-import-format';
import {
  parsePriceSourceDiscount,
  validatePriceSourceDiscount,
} from '../../validators/price-import/price-source-discount-validation';

import type { PriceImportRow } from '../../entities/price-import/price-source';

const row = (code: string, status: PriceImportRow['status']): PriceImportRow => ({
  productId: Number(code),
  code,
  name: code,
  status,
  oldPrice: null,
  newPrice: null,
  oldWholesale: null,
  newWholesale: null,
  oldRetail: null,
  newRetail: null,
  message: null,
});

describe('price import format', () => {
  it('offers «Оновити зараз» only for connected non-file sources', () => {
    expect(canRefreshPriceSource({ method: 'Website', automaticUpdateConnected: true })).toBe(true);
    expect(canRefreshPriceSource({ method: 'GoogleSheets', automaticUpdateConnected: true })).toBe(
      true,
    );
    expect(
      canRefreshPriceSource({ method: 'SupplierCabinet', automaticUpdateConnected: false }),
    ).toBe(false);
    expect(canRefreshPriceSource({ method: 'File', automaticUpdateConnected: true })).toBe(false);
  });

  it('puts changes and problems first', () => {
    const sorted = sortPriceImportRows([
      row('3', 'Unchanged'),
      row('2', 'ManualPrice'),
      row('10', 'NotInFile'),
      row('9', 'Changed'),
    ]);
    expect(sorted.map((x) => x.code)).toEqual(['9', '10', '2', '3']);
    expect(isPriceImportProblem(row('1', 'Invalid'))).toBe(true);
    expect(isPriceImportProblem(row('1', 'ManualPrice'))).toBe(false);
  });

  it('labels files and discounts', () => {
    expect(priceFileLabel('InsightYml', 3)).toBe('3 XML-файли Insight');
    expect(priceFileLabel('None', 0)).toBeNull();
    expect(formatDiscount(0)).toBe('без знижки');
    expect(formatDiscount(22.5)).toBe('22,5%');
  });

  it('accepts discounts from 0 to 90 with two decimals', () => {
    expect(validatePriceSourceDiscount('20')).toBeNull();
    expect(validatePriceSourceDiscount('5,25')).toBeNull();
    expect(validatePriceSourceDiscount('91')).not.toBeNull();
    expect(validatePriceSourceDiscount('-1')).not.toBeNull();
    expect(validatePriceSourceDiscount('1.555')).not.toBeNull();
    expect(parsePriceSourceDiscount('5,25')).toBe(5.25);
  });
});
