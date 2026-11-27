import { describe, expect, it } from 'vitest';

import {
  dueState,
  itemColorsText,
  orderModelsText,
  orderStageSpread,
  ordersWord,
  uniqueValues,
} from './production-order-row';

import type { ProductionOrderSummaryItem } from '../../entities/orders/production-order-list';

const item = (change: Partial<ProductionOrderSummaryItem>): ProductionOrderSummaryItem => ({
  modelCode: null,
  modelName: 'Куртка',
  quantity: 1,
  stage: 'New',
  fabricName: null,
  mainColor: 'Синій',
  additionalColors: [],
  applications: [],
  ...change,
});

describe('production order row', () => {
  it('marks only an overdue order or one due within three days', () => {
    const today = '2026-11-11';
    expect(dueState({ status: 'New', nearestDueDate: '2026-11-05' }, today)).toEqual({
      kind: 'overdue',
      days: 6,
    });
    expect(dueState({ status: 'New', nearestDueDate: '2026-11-13' }, today)).toEqual({
      kind: 'soon',
      days: 2,
    });
    expect(dueState({ status: 'New', nearestDueDate: '2026-11-11' }, today)).toEqual({
      kind: 'soon',
      days: 0,
    });
    expect(dueState({ status: 'New', nearestDueDate: '2026-11-20' }, today)).toBeNull();
    expect(dueState({ status: 'Closed', nearestDueDate: '2026-11-01' }, today)).toBeNull();
    expect(dueState({ status: 'New', nearestDueDate: null }, today)).toBeNull();
  });

  it('sums the same model and lists the models in card order', () => {
    expect(
      orderModelsText([
        item({ modelName: 'Куртка', quantity: 10, stage: 'Cutting' }),
        item({ modelName: 'Штани', quantity: 5, stage: 'Sewing' }),
        item({ modelName: 'Куртка', quantity: 5, stage: 'Cutting' }),
      ]),
    ).toBe('Куртка ×15 · Штани ×5');
  });

  it('puts the model of the chosen filter first', () => {
    const items = [
      item({ modelCode: 'MOD-1', modelName: 'Куртка', quantity: 10 }),
      item({ modelCode: 'MOD-2', modelName: 'Штани', quantity: 5 }),
    ];
    expect(orderModelsText(items, 'MOD-2')).toBe('Штани ×5 · Куртка ×10');
    expect(orderModelsText(items, 'MOD-9')).toBe('Куртка ×10 · Штани ×5');
    expect(orderModelsText(items)).toBe('Куртка ×10 · Штани ×5');
  });

  it('lists every fabric once and the colours of an item with its additional ones', () => {
    expect(uniqueValues(['Габардин', null, 'Габардин', 'Твіл'])).toEqual(['Габардин', 'Твіл']);
    expect(itemColorsText({ mainColor: 'Синій', additionalColors: ['Білий', 'Сірий'] })).toBe(
      'Синій + Білий + Сірий',
    );
  });

  it('counts items that went further than the slowest one', () => {
    expect(
      orderStageSpread('Cutting', [
        item({ modelName: 'Куртка', quantity: 10, stage: 'Cutting' }),
        item({ modelName: 'Штани', quantity: 5, stage: 'Sewing' }),
      ]),
    ).toEqual({ index: 3, total: 9, label: 'Крій', ahead: 1, itemsCount: 2 });
  });

  it('agrees the word with the number', () => {
    expect([1, 2, 5, 11, 21, 22, 25].map(ordersWord)).toEqual([
      'завдання',
      'завдання',
      'завдань',
      'завдань',
      'завдання',
      'завдання',
      'завдань',
    ]);
  });
});
