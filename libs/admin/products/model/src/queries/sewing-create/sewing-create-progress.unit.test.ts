import { describe, expect, it } from 'vitest';

import {
  canOpenSewingCreateStep,
  isSewingCreateReady,
  parseSewingCreateRoute,
  sewingCreateChecklist,
  sewingCreateDoneSteps,
  sewingCreateLabour,
} from './sewing-create-progress';

import type { SewingArticleSummaryRow } from '../../entities/sewing-card/sewing-article-summary';
import type { SewingOperationDraft } from '../../entities/sewing-composition/sewing-operation-draft';

function article(update: Partial<SewingArticleSummaryRow> = {}): SewingArticleSummaryRow {
  return {
    id: 1,
    saleSku: '602',
    active: true,
    sortOrder: 0,
    fabricId: null,
    fabricName: null,
    fabricPrice: null,
    fabricQuantity: null,
    calculated: true,
    blockers: [],
    costs: [],
    minutes: 50,
    minuteCost: 2,
    fullCost: 500,
    prices: { retail: 900, wholesale: 820, largeWholesale: 780 },
    published: null,
    ...update,
  };
}

const operation = (): SewingOperationDraft => ({
  clientId: 'a',
  operationId: 7,
  quantity: 1,
  manualMinutes: null,
  sortOrder: 0,
  comment: 'Комір',
});

const states = (checks: ReturnType<typeof sewingCreateChecklist>) =>
  Object.fromEntries(checks.map((check) => [check.key, check.state]));

describe('«Нова модель» steps', () => {
  it('reads the step from the address and opens steps 2–5 only with a draft', () => {
    expect(parseSewingCreateRoute(null, '4')).toEqual({ productId: null, step: 1 });
    expect(parseSewingCreateRoute('42', null)).toEqual({ productId: 42, step: 2 });
    expect(parseSewingCreateRoute('42', '5')).toEqual({ productId: 42, step: 5 });
    expect(parseSewingCreateRoute('42', '9')).toEqual({ productId: 42, step: 2 });
    expect(parseSewingCreateRoute('x', '3')).toEqual({ productId: null, step: 1 });
    expect(canOpenSewingCreateStep(3, false)).toBe(false);
    expect(canOpenSewingCreateStep(1, false)).toBe(true);
    expect(canOpenSewingCreateStep(3, true)).toBe(true);
  });

  it('lists what blocks the calculation from the article summary and the operations', () => {
    expect(states(sewingCreateChecklist({ articles: null, operations: null }))).toEqual({
      article: 'unknown',
      materials: 'unknown',
      composition: 'unknown',
      labour: 'unknown',
    });
    expect(states(sewingCreateChecklist({ articles: [], operations: [] }))).toEqual({
      article: 'blocking',
      materials: 'unknown',
      composition: 'unknown',
      labour: 'blocking',
    });
    const blocked = article({
      calculated: false,
      blockers: [
        { code: 'MissingFabric', inputKey: null },
        { code: 'MissingSettings', inputKey: null },
      ],
    });
    const checks = sewingCreateChecklist({ articles: [blocked], operations: null });
    expect(states(checks)).toEqual({
      article: 'ok',
      materials: 'blocking',
      composition: 'ok',
      labour: 'ok',
    });
    expect(checks.map((check) => check.label)).toEqual([
      'Немає тканини',
      'Тканину не вказано',
      'Неповна комплектація',
      'Немає трудовитрат',
    ]);
    expect(
      states(sewingCreateChecklist({ articles: [blocked], operations: [operation()] })).labour,
    ).toBe('ok');
  });

  it('marks done steps and readiness', () => {
    const ready = sewingCreateChecklist({ articles: [article()], operations: [operation()] });
    expect(sewingCreateDoneSteps({ hasDraft: false, checks: ready, active: false })).toEqual([]);
    expect(sewingCreateDoneSteps({ hasDraft: true, checks: ready, active: false })).toEqual([
      1, 2, 3, 4,
    ]);
    const noArticle = sewingCreateChecklist({ articles: [], operations: [] });
    expect(sewingCreateDoneSteps({ hasDraft: true, checks: noArticle, active: true })).toEqual([
      1, 5,
    ]);
    expect(isSewingCreateReady([article()])).toBe(true);
    expect(isSewingCreateReady([article(), article({ calculated: false })])).toBe(false);
    expect(isSewingCreateReady([])).toBe(false);
  });

  it('counts pieces per shift from minutes per product', () => {
    expect(sewingCreateLabour(54)).toEqual({ minutes: 54, piecesPerShift: 8 });
    expect(sewingCreateLabour(0)).toBeNull();
  });
});
