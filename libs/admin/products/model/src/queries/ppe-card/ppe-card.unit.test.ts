import { describe, expect, it } from 'vitest';

import { ppeBlockerReasons } from './ppe-blocker-reasons';
import {
  createPpeSupplierOfferFormValues,
  ppeSupplierOfferBody,
} from '../../forms/ppe-card/ppe-supplier-offer-form';
import { validatePpeSupplierOffer } from '../../validators/ppe-card/ppe-supplier-offer-validation';

import type { PpeSupplierOffer } from '../../entities/ppe-card/ppe-supplier-offer';

const offer: PpeSupplierOffer = {
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
  prices: { retail: 777.96, wholesale: 674.23, largeWholesale: 622.37 },
  blockers: [],
};

describe('PPE card', () => {
  it('turns the form into the save body with the current version', () => {
    const values = { ...createPpeSupplierOfferFormValues(offer), supplierPrice: '520,5' };
    expect(ppeSupplierOfferBody(values, offer)).toEqual({
      supplierId: 5,
      supplierSku: 'CARINA',
      supplierUrl: 'https://avcentr.com.ua/ua/kostyum-carina',
      supplierPrice: 520.5,
      allowManualPrice: false,
      ruleCode: 'Одяг ЗІЗ — АВ-Центр',
      unit: 'шт.',
      expectedOfferVersionId: offer.offerVersionId,
    });
  });

  it('needs a supplier, a web link and a price with at most 2 decimals', () => {
    const errors = validatePpeSupplierOffer({
      ...createPpeSupplierOfferFormValues(offer),
      supplierId: '',
      supplierUrl: 'avcentr.com.ua',
      supplierPrice: '1.005',
    });
    expect(Object.keys(errors).sort()).toEqual(['supplierId', 'supplierPrice', 'supplierUrl']);
  });

  it('shows each sheet reason once', () => {
    expect(ppeBlockerReasons(['MissingOffer', 'MissingSupplierCost', 'MissingRule', 'X'])).toEqual([
      'Немає ціни постачальника',
      'Не вибрано правило ціноутворення',
      'Ціну не розраховано',
    ]);
  });
});
