import { describe, expect, it } from 'vitest';

import {
  addCustomFabric,
  addCustomLine,
  addCustomVariant,
  customSewingDraft,
  customSewingErrors,
  customSewingItemDraft,
  customSewingPriceRequest,
  parseCustomQuantity,
  recommendCustomVariant,
} from './quote-custom-sewing-mapper';
import { catalogItemDraft } from './quote-draft-mapper';

import type {
  QuoteCustomSewingPrice,
  QuoteModelComposition,
} from '../../entities/quote-custom-sewing';

const composed = () => {
  let draft = { ...customSewingDraft(), name: 'Фартух з логотипом' };
  draft = addCustomFabric(draft, draft.variants[0].key, { id: 5, name: 'Саржа' });
  draft = {
    ...draft,
    variants: draft.variants.map((v) => ({
      ...v,
      fabrics: v.fabrics.map((x) => ({ ...x, meters: '1,25' })),
    })),
  };
  draft = addCustomLine(draft, {
    kind: 'Accessory',
    referenceId: 30,
    name: 'Ґудзик',
    unit: 'шт.',
    needsMinutes: false,
  });
  return addCustomLine(draft, {
    kind: 'Operation',
    referenceId: 155,
    name: 'Нестандартна операція',
    unit: 'хв',
    needsMinutes: true,
  });
};

const price: QuoteCustomSewingPrice = {
  lines: [
    {
      kind: 'Accessory',
      referenceId: 30,
      name: 'Ґудзик',
      unit: 'шт.',
      unitValue: 2,
      isActive: true,
      costCode: null,
    },
    {
      kind: 'Operation',
      referenceId: 155,
      name: 'Нестандартна операція',
      unit: 'хв',
      unitValue: null,
      isActive: true,
      costCode: null,
    },
  ],
  variants: [
    {
      title: 'Саржа',
      fabrics: [
        { fabricId: 5, meters: 1.25, name: 'Саржа', details: '65% поліестер', pricePerMeter: 200 },
      ],
      minutes: 12,
      laborCost: 60,
      fullCost: 400,
      prices: { retail: 800, wholesale: 720, large: 600 },
      problems: [],
    },
  ],
};

describe('«Виріб з нуля» panel', () => {
  it('reads metres and quantities with a comma and up to four decimals', () => {
    expect(parseCustomQuantity('1,25')).toBe(1.25);
    expect(parseCustomQuantity('0.375')).toBe(0.375);
    expect(parseCustomQuantity('0')).toBeNull();
    expect(parseCustomQuantity('1,23456')).toBeNull();
  });

  it('waits for minutes of an operation without a norm before pricing', () => {
    const draft = composed();
    expect(customSewingPriceRequest(draft)).toBeNull();
    expect(customSewingErrors(draft)).toEqual(['Вкажіть хвилини операцій без норми.']);

    const filled = {
      ...draft,
      lines: draft.lines.map((x) => (x.needsMinutes ? { ...x, minutes: '12' } : x)),
    };
    expect(customSewingPriceRequest(filled)).toEqual({
      variants: [{ fabrics: [{ fabricId: 5, meters: 1.25 }] }],
      lines: [
        { kind: 'Accessory', referenceId: 30, quantity: 1, manualMinutes: null, costCode: null },
        { kind: 'Operation', referenceId: 155, quantity: 1, manualMinutes: 12, costCode: null },
      ],
    });
  });

  it('turns a priced composition into a КП item and back', () => {
    const draft = composed();
    const filled = {
      ...draft,
      lines: draft.lines.map((x) => (x.needsMinutes ? { ...x, minutes: '12' } : x)),
    };
    const request = customSewingPriceRequest(filled)!;

    const item = customSewingItemDraft(filled, request, price);

    expect(item.kind).toBe('CustomSewing');
    expect(item.options[0]).toMatchObject({
      title: 'Саржа',
      fabrics: [{ fabricId: 5, name: 'Саржа', meters: 1.25 }],
      fabricInfo: '1,25 м на виріб',
    });
    expect(item.options[0].prices.retail.source).toBe(800);
    expect(item.lines.map((x) => x.name)).toEqual(['Ґудзик', 'Нестандартна операція']);

    const again = customSewingDraft(item);
    expect(again.variants[0].fabrics[0].meters).toBe('1,25');
    expect(again.lines[1]).toMatchObject({ minutes: '12', needsMinutes: true });
  });

  it('starts «Змінити склад» from the Catalog composition and keeps the model', () => {
    const model = catalogItemDraft(
      {
        productId: 10,
        kind: 'Sewing',
        code: 'MOD-166',
        name: 'Костюм «Імпульс»',
        season: 'Літо',
        siteUrl: 'https://brevi.com.ua/impuls',
        photoUrl: 'https://cdn/impuls.jpg',
        description: 'Літній костюм',
        prices: null,
        problems: [],
        isActive: true,
        variants: [],
      } as never,
      [
        {
          articleId: 101,
          sku: 'SKU-101',
          title: 'Грета',
          fabricInfo: null,
          prices: null,
          problems: [],
        } as never,
      ],
    );
    const composition: QuoteModelComposition = {
      productId: 10,
      fabrics: [
        { articleId: 100, fabricId: 4, name: 'Саржа', meters: 1.4, isActive: true },
        { articleId: 101, fabricId: 5, name: 'Грета', meters: 1.5, isActive: true },
      ],
      lines: [
        {
          kind: 'Service',
          referenceId: 0,
          costCode: 'Вишивка',
          name: 'Вишивка',
          unit: 'послуга',
          quantity: 1,
          manualMinutes: null,
        },
        {
          kind: 'Operation',
          referenceId: 40,
          costCode: null,
          name: 'Пошив',
          unit: 'хв',
          quantity: 1,
          manualMinutes: null,
        },
      ],
    };

    const draft = customSewingDraft(model, composition);
    expect(draft.name).toBe('Костюм «Імпульс»');
    expect(draft.variants.map((v) => v.fabrics.map((x) => [x.fabricId, x.meters]))).toEqual([
      [[5, '1,5']],
    ]);
    const request = customSewingPriceRequest(draft)!;
    expect(request.lines[0]).toEqual({
      kind: 'Service',
      referenceId: 0,
      quantity: 1,
      manualMinutes: null,
      costCode: 'Вишивка',
    });

    const item = customSewingItemDraft(draft, request, price, model);
    expect(item).toMatchObject({
      key: model.key,
      id: null,
      kind: 'CustomSewing',
      productId: 10,
      code: 'MOD-166',
      subtitle: 'Швейна продукція · змінений склад моделі',
      photoUrl: 'https://cdn/impuls.jpg',
    });
    expect(item.options[0].id).toBeNull();
  });

  it('sums the fabrics of a variant and marks one variant as recommended', () => {
    let draft = composed();
    draft = {
      ...draft,
      lines: draft.lines.map((x) => (x.needsMinutes ? { ...x, minutes: '12' } : x)),
    };
    draft = addCustomVariant(draft);
    const second = draft.variants[1].key;
    draft = addCustomFabric(draft, second, { id: 5, name: 'Саржа' });
    draft = addCustomFabric(draft, second, { id: 6, name: 'Сітка' });
    draft = addCustomFabric(draft, second, { id: 6, name: 'Сітка' });
    expect(customSewingErrors(draft)).toEqual(['Вкажіть метраж кожної тканини.']);

    draft = {
      ...draft,
      variants: draft.variants.map((v) =>
        v.key === second
          ? { ...v, fabrics: v.fabrics.map((x, i) => ({ ...x, meters: i === 0 ? '1,25' : '0,3' })) }
          : v,
      ),
    };
    draft = recommendCustomVariant(draft, second);
    const request = customSewingPriceRequest(draft)!;
    expect(request.variants).toEqual([
      { fabrics: [{ fabricId: 5, meters: 1.25 }] },
      {
        fabrics: [
          { fabricId: 5, meters: 1.25 },
          { fabricId: 6, meters: 0.3 },
        ],
      },
    ]);

    const item = customSewingItemDraft(draft, request, {
      ...price,
      variants: [price.variants[0], { ...price.variants[0], title: 'Саржа + Сітка' }],
    });
    expect(item.options[1]).toMatchObject({
      title: 'Саржа + Сітка',
      isRecommended: true,
      fabricInfo: 'Саржа 1,25 м + Сітка 0,3 м на виріб',
    });
    expect(item.options[0].isRecommended).toBe(false);
  });

  it('does not allow two variants with the same fabrics', () => {
    let draft = composed();
    draft = addCustomVariant(draft);
    draft = addCustomFabric(draft, draft.variants[1].key, { id: 5, name: 'Саржа' });
    draft = {
      ...draft,
      variants: draft.variants.map((v) => ({
        ...v,
        fabrics: v.fabrics.map((x) => ({ ...x, meters: '1,25' })),
      })),
    };
    expect(customSewingErrors(draft)).toContain('Два варіанти мають однакові тканини й метраж.');
  });
});
