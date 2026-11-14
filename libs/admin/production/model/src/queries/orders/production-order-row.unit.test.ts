import { describe, expect, it } from 'vitest';

import { dueState, orderModelsText, orderStageSpread, ordersWord } from './production-order-row';

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
        { modelName: 'Куртка', quantity: 10, stage: 'Cutting' },
        { modelName: 'Штани', quantity: 5, stage: 'Sewing' },
        { modelName: 'Куртка', quantity: 5, stage: 'Cutting' },
      ]),
    ).toBe('Куртка ×15 · Штани ×5');
  });

  it('counts items that went further than the slowest one', () => {
    expect(
      orderStageSpread('Cutting', [
        { modelName: 'Куртка', quantity: 10, stage: 'Cutting' },
        { modelName: 'Штани', quantity: 5, stage: 'Sewing' },
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
