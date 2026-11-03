import { describe, expect, it } from 'vitest';

import { mapPpeSupplierOffer } from './ppe-supplier-offer.mapper';

const response = {
  productId: 3,
  unit: 'шт.',
  supplierId: 5,
  supplierName: 'АВ-Центр',
  supplierSku: 'CARINA',
  supplierUrl: 'https://avcentr.com.ua/ua/kostyum-carina',
  supplierPrice: 518.64,
  allowManualPrice: false,
  ruleCode: 'Одяг ЗІЗ — АВ-Центр',
  insightWholesale: null,
  insightRetail: null,
  offerVersionId: '8b0a4f43-7f0e-4c6a-9f1e-2a2f0c9d1e11',
  priceUpdatedAt: '2026-11-03T15:00:00Z',
  calculation: {
    prices: { retail: 777.96, wholesale: 674.23, largeWholesale: 622.37 },
    blockers: [],
    isCalculated: true,
  },
};

describe('mapPpeSupplierOffer', () => {
  it('maps the card with prices', () => {
    expect(mapPpeSupplierOffer(response, 3)).toMatchObject({
      supplierName: 'АВ-Центр',
      prices: { retail: 777.96, wholesale: 674.23, largeWholesale: 622.37 },
      blockers: [],
    });
  });

  it('keeps blocker codes and rejects another product or prices with blockers', () => {
    const blocked = {
      ...response,
      calculation: {
        prices: null,
        blockers: [{ code: 'MissingRule', inputKey: 'rule' }],
        isCalculated: false,
      },
    };
    expect(mapPpeSupplierOffer(blocked, 3).blockers).toEqual(['MissingRule']);
    expect(() => mapPpeSupplierOffer(response, 4)).toThrow();
    expect(() =>
      mapPpeSupplierOffer(
        { ...blocked, calculation: { ...blocked.calculation, isCalculated: true } },
        3,
      ),
    ).toThrow();
  });
});
