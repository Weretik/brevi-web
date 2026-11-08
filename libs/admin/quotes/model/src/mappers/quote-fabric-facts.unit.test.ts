import { describe, expect, it } from 'vitest';

import {
  quoteDraftFabricIds,
  quoteFabricFactsParts,
  quoteOptionFabrics,
  quoteSupplierFabrics,
} from './quote-fabric-facts';

import type { QuoteFabricFacts } from '../entities/quote-catalog';
import type { QuoteDraft, QuoteOptionDraft } from '../models/quote-draft';

const option = (patch: Partial<QuoteOptionDraft>): QuoteOptionDraft => ({
  key: 'o',
  id: null,
  articleId: null,
  fabricId: null,
  title: 'Грета',
  details: null,
  fabricInfo: null,
  isRecommended: false,
  prices: {
    retail: { source: 1, manual: '', shown: true },
    wholesale: { source: 1, manual: '', shown: true },
    large: { source: 1, manual: '', shown: true },
  },
  manualReason: '',
  manualBy: null,
  fabrics: [],
  ...patch,
});

describe('quote fabric facts (R-31)', () => {
  it('takes the Catalog fabric, the one other fabric or every fabric of a multi-fabric variant', () => {
    expect(quoteOptionFabrics(option({ fabricId: 5 }))).toEqual([{ fabricId: 5, label: null }]);
    expect(
      quoteOptionFabrics(option({ fabrics: [{ fabricId: 7, name: 'Ортон', meters: 1.6 }] })),
    ).toEqual([{ fabricId: 7, label: null }]);
    expect(
      quoteOptionFabrics(
        option({
          fabrics: [
            { fabricId: 7, name: 'Ортон', meters: 1.6 },
            { fabricId: 8, name: 'Сітка', meters: 0.25 },
          ],
        }),
      ),
    ).toEqual([
      { fabricId: 7, label: 'Ортон × 1,6 м' },
      { fabricId: 8, label: 'Сітка × 0,25 м' },
    ]);
    expect(quoteOptionFabrics(option({}))).toEqual([]);
  });

  it('collects each fabric of the КП once', () => {
    const draft = {
      items: [
        { options: [option({ fabricId: 9 }), option({ fabricId: 3 })] },
        { options: [option({ fabricId: 3 }), option({})] },
      ],
    } as unknown as QuoteDraft;

    expect(quoteDraftFabricIds(draft)).toEqual([3, 9]);
  });

  it('shows composition, density and price per metre, skipping what the fabric has not', () => {
    const facts = {
      fabricId: 1,
      name: 'Грета',
      composition: '53% бавовна, 47% поліестер',
      density: '220 г/м²',
      pricePerMeter: 133,
      supplierId: 4,
      supplierName: 'Спецтекстиль',
    };

    expect(quoteFabricFactsParts(facts)).toEqual([
      'Склад: 53% бавовна, 47% поліестер',
      'Щільність: 220 г/м²',
      '133 грн/м',
    ]);
    expect(
      quoteFabricFactsParts({ ...facts, composition: null, density: null, pricePerMeter: 98.5 }),
    ).toEqual(['98,5 грн/м']);
  });
});

describe('quoteSupplierFabrics', () => {
  const fabric = (
    id: number,
    name: string,
    supplierId: number | null,
    supplierName: string | null,
  ) =>
    ({
      fabricId: id,
      name,
      composition: null,
      density: null,
      pricePerMeter: 100 + id,
      supplierId,
      supplierName,
    }) satisfies QuoteFabricFacts;

  it('lists the КП fabrics of the same supplier, by name', () => {
    const all = new Map([
      [1, fabric(1, 'Саржа', 5, 'Поділля')],
      [2, fabric(2, 'Габардин', 5, 'Поділля')],
      [3, fabric(3, 'Ріп-стоп', 6, 'Схід')],
    ]);
    expect(quoteSupplierFabrics(all.get(1)!, all)).toEqual([
      { fabricId: 2, name: 'Габардин', pricePerMeter: '102 грн/м' },
      { fabricId: 1, name: 'Саржа', pricePerMeter: '101 грн/м' },
    ]);
  });

  it('matches by name when the supplier has no id', () => {
    const all = new Map([
      [1, fabric(1, 'Саржа', null, 'Поділля')],
      [2, fabric(2, 'Габардин', null, 'Інший')],
    ]);
    expect(quoteSupplierFabrics(all.get(1)!, all).map((x) => x.fabricId)).toEqual([1]);
  });
});
