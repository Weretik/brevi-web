import { describe, expect, it } from 'vitest';

import {
  mapProductionItemWork,
  mapSewingForecast,
  mapWorkImportResult,
} from './production-work.mapper';

const work = {
  id: 1,
  orderId: 2,
  orderNumber: 12,
  clientName: 'Геофізика',
  itemId: 3,
  modelName: 'Куртка',
  employeeId: 4,
  employeeName: 'Андреева',
  kind: 'Sewing',
  quantity: 2,
  workDate: '2026-11-04',
  overPlan: true,
  reason: 'Запас',
  comment: null,
  rate: 196.62,
  isVoided: false,
  voidedAt: null,
  voidedByName: null,
  voidReason: null,
  createdByName: 'Начальник',
  createdAt: '2026-11-04T10:00:00Z',
};

describe('production work mappers', () => {
  it('maps the item section and rejects an unknown kind', () => {
    const card = {
      orderId: 2,
      itemId: 3,
      orderNumber: 12,
      modelName: 'Куртка',
      quantity: 3,
      sewingRate: 196.62,
      sewn: 0,
      cut: 0,
      rows: [work],
      canRecord: false,
      cannotRecord: 'Завдання вже не «Нове»',
    };
    expect(mapProductionItemWork(card).rows[0]).toMatchObject({ overPlan: true, rate: 196.62 });
    expect(() =>
      mapProductionItemWork({ ...card, rows: [{ ...work, kind: 'Ironing' }] }),
    ).toThrow();
  });

  it('maps a forecast without settings for managers', () => {
    const forecast = mapSewingForecast({
      startDate: '2026-11-05',
      settings: null,
      problem: null,
      rows: [
        {
          orderId: 2,
          orderNumber: 12,
          clientName: 'Геофізика',
          managerName: 'Анастасія',
          remaining: 3,
          minutes: null,
          finishOn: null,
          status: 'Unknown',
          reason: 'MissingRate',
          dueDate: '2026-11-19',
          isLate: false,
        },
      ],
      canReorder: false,
      version: 0,
    });
    expect(forecast.settings).toBeNull();
    expect(forecast.rows[0]).toMatchObject({ reason: 'MissingRate', finishOn: null });
  });

  it('shows import lines by worker with the order', () => {
    const result = mapWorkImportResult({
      dryRun: true,
      created: 0,
      unchanged: 0,
      errors: 1,
      lines: [
        {
          legacyId: 'w1',
          orderNumber: null,
          position: 1,
          employeeName: 'Андреева',
          kind: 'Cutting',
          quantity: 5,
          action: 'error',
          error: 'Завдання не перенесено',
        },
      ],
    });
    expect(result.lines[0]).toMatchObject({
      key: 'Андреева',
      detail: 'Завдання не знайдено · позиція 1 · крій 5 шт.',
    });
  });
});
