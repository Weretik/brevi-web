import { describe, expect, it } from 'vitest';

import { oneOffItemDraft } from './quote-draft-mapper';
import { quoteModelChanges } from './quote-model-changes';

import type { QuoteModelComposition } from '../entities/quote-custom-sewing';
import type { QuoteItemDraft, QuoteOptionDraft } from '../models/quote-draft';

const base: QuoteModelComposition = {
  productId: 77,
  fabrics: [
    { articleId: 1, fabricId: 10, name: 'Саржа', meters: 2.5, isActive: true },
    { articleId: 2, fabricId: 11, name: 'Грета', meters: 2.5, isActive: true },
  ],
  lines: [
    {
      kind: 'Accessory',
      referenceId: 5,
      costCode: null,
      name: 'Ґудзик',
      unit: 'шт',
      quantity: 6,
      manualMinutes: null,
    },
    {
      kind: 'Accessory',
      referenceId: 6,
      costCode: null,
      name: 'Блискавка',
      unit: 'шт',
      quantity: 1,
      manualMinutes: null,
    },
    {
      kind: 'Operation',
      referenceId: 9,
      costCode: null,
      name: 'Пошив кишені',
      unit: 'хв',
      quantity: 1,
      manualMinutes: null,
    },
  ],
};

const option = (fabricId: number, name: string, meters: number): QuoteOptionDraft => ({
  ...oneOffItemDraft().options[0]!,
  fabricId,
  fabrics: [{ fabricId, name, meters }],
});

const changed: QuoteItemDraft = {
  ...oneOffItemDraft(),
  kind: 'CustomSewing',
  productId: 77,
  options: [option(10, 'Саржа', 2.8), option(12, 'Оксфорд', 2.5)],
  lines: [
    {
      kind: 'Accessory',
      referenceId: 5,
      name: 'Ґудзик',
      unit: 'шт',
      quantity: 8,
      manualMinutes: null,
      costCode: null,
    },
    {
      kind: 'Accessory',
      referenceId: 7,
      name: 'Кнопка',
      unit: 'шт',
      quantity: 4,
      manualMinutes: null,
      costCode: null,
    },
    {
      kind: 'Operation',
      referenceId: 9,
      name: 'Пошив кишені',
      unit: 'хв',
      quantity: 1,
      manualMinutes: null,
      costCode: null,
    },
  ],
};

describe('quoteModelChanges', () => {
  it('lists what was added, removed and changed by part of the composition', () => {
    expect(quoteModelChanges(changed, base)).toEqual([
      {
        title: 'Варіанти тканини',
        changes: [
          { kind: 'changed', name: 'Саржа', detail: 'було 2,5 м → стало 2,8 м' },
          { kind: 'added', name: 'Оксфорд', detail: '2,5 м' },
          { kind: 'removed', name: 'Грета', detail: '2,5 м' },
        ],
      },
      {
        title: 'Фурнітура',
        changes: [
          { kind: 'changed', name: 'Ґудзик', detail: 'було 6 шт → стало 8 шт' },
          { kind: 'added', name: 'Кнопка', detail: '4 шт' },
          { kind: 'removed', name: 'Блискавка', detail: '1 шт' },
        ],
      },
    ]);
  });

  it('is empty when the composition is the Catalog one', () => {
    const same: QuoteItemDraft = {
      ...changed,
      options: [option(10, 'Саржа', 2.5), option(11, 'Грета', 2.5)],
      lines: base.lines.map((line) => ({ ...line, name: line.name ?? '' })),
    };
    expect(quoteModelChanges(same, base)).toEqual([]);
  });
});
