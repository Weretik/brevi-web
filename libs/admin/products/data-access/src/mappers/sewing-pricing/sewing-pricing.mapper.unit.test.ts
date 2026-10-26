import { describe, expect, it } from 'vitest';

import { mapPublishedSewingProducts } from './published-sewing-products.mapper';
import { mapSewingCalculation } from './sewing-calculation.mapper';
import { sewingCalculationFixture } from '../../test-fixtures/sewing-pricing/sewing-calculation.fixture';

describe('Sewing pricing response boundary', () => {
  it('maps the retained server breakdown without recalculating it', () => {
    const result = mapSewingCalculation(sewingCalculationFixture, {
      productId: 42,
      articleId: 501,
    });
    expect(result.fullCost).toBe(200);
    expect(result.prices?.wholesale).toBe(264);
    expect(result.costs.find((cost) => cost.kind === 'overhead')?.amount).toBe(61);
    expect(result.settingsRevision).toBe(1);
  });

  it('rejects nonfinite amounts, mismatched scope and inconsistent readiness', () => {
    const malformed = structuredClone(sewingCalculationFixture);
    malformed.snapshot.calculation.prices!.retail = Number.NaN;
    expect(() => mapSewingCalculation(malformed, { productId: 42, articleId: 501 })).toThrow();
    expect(() =>
      mapSewingCalculation(sewingCalculationFixture, { productId: 42, articleId: 999 }),
    ).toThrow();
    expect(() =>
      mapSewingCalculation(sewingCalculationFixture, {
        productId: 42,
        articleId: 501,
        requestId: 'different-request',
      }),
    ).toThrow();
    const blocked = structuredClone(sewingCalculationFixture);
    blocked.snapshot.calculation.isCalculated = false;
    expect(() => mapSewingCalculation(blocked, { productId: 42, articleId: 501 })).toThrow();
  });

  it('maps a blocked result without zero prices and rejects invalid batch membership', () => {
    const blocked = structuredClone(sewingCalculationFixture);
    blocked.snapshot.calculation = {
      isCalculated: false,
      breakdown: null,
      prices: null,
      blockers: [
        { code: 'UnreviewedOperation', inputKey: 'OperationLine:2', message: 'Review required.' },
      ],
    };
    expect(mapSewingCalculation(blocked, { productId: 42, articleId: 501 }).prices).toBeNull();
    expect(
      mapPublishedSewingProducts([{ productId: 42, articleCount: 2, articles: [] }], [42]),
    ).toHaveLength(1);
    expect(() =>
      mapPublishedSewingProducts([{ productId: 99, articleCount: 0, articles: [] }], [42]),
    ).toThrow();
    expect(() =>
      mapPublishedSewingProducts(
        [
          { productId: 42, articleCount: 0, articles: [] },
          { productId: 42, articleCount: 0, articles: [] },
        ],
        [42],
      ),
    ).toThrow();
  });
});
