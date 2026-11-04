import { describe, expect, it } from 'vitest';

import {
  addCustomFabric,
  addCustomLine,
  customSewingDraft,
  customSewingErrors,
  customSewingItemDraft,
  customSewingPriceRequest,
  parseCustomQuantity,
} from './quote-custom-sewing-mapper';

import type { QuoteCustomSewingPrice } from '../entities/quote-custom-sewing';

const composed = () => {
  let draft = { ...customSewingDraft(), name: 'Фартух з логотипом' };
  draft = addCustomFabric(draft, { id: 5, name: 'Саржа' });
  draft = { ...draft, fabrics: draft.fabrics.map((x) => ({ ...x, meters: '1,25' })) };
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
    },
    {
      kind: 'Operation',
      referenceId: 155,
      name: 'Нестандартна операція',
      unit: 'хв',
      unitValue: null,
      isActive: true,
    },
  ],
  fabrics: [
    {
      fabricId: 5,
      meters: 1.25,
      name: 'Саржа',
      details: '65% поліестер',
      pricePerMeter: 200,
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
      fabrics: [{ fabricId: 5, meters: 1.25 }],
      lines: [
        { kind: 'Accessory', referenceId: 30, quantity: 1, manualMinutes: null },
        { kind: 'Operation', referenceId: 155, quantity: 1, manualMinutes: 12 },
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
      fabricId: 5,
      fabricMeters: 1.25,
      fabricInfo: '1,25 м на виріб',
    });
    expect(item.options[0].prices.retail.source).toBe(800);
    expect(item.lines.map((x) => x.name)).toEqual(['Ґудзик', 'Нестандартна операція']);

    const again = customSewingDraft(item);
    expect(again.fabrics[0].meters).toBe('1,25');
    expect(again.lines[1]).toMatchObject({ minutes: '12', needsMinutes: true });
  });
});
