import { describe, expect, it } from 'vitest';

import {
  comparisonPlan,
  createItemIssueValues,
  hasItemIssueErrors,
  issueLineFor,
  issueLinePair,
  issueLinePart,
  issueLinePurpose,
  itemIssueBody,
  itemIssuePreview,
  validateItemIssue,
} from './item-issue-form';

import type { FabricPlanPart, ItemFabric } from '../../entities/issues/item-fabric';
import type { FabricStockFabric } from '../../entities/stock/fabric-stock';

const fabrics: FabricStockFabric[] = [
  {
    fabricCode: 'FAB-023',
    codes: ['FAB-023', 'FAB-067'],
    fabricName: 'Грета',
    composition: null,
    density: null,
    supplier: null,
    meters: 15,
    booked: 0,
    free: 15,
    colors: [
      {
        color: 'Темно-сірий',
        colorKey: 'темно-сірий',
        meters: 10,
        version: 'v1',
        sources: [],
        booked: 0,
        free: 10,
        toOrder: 0,
        lastMovement: null,
        bookings: [],
      },
      {
        color: 'Сірий',
        colorKey: 'сірий',
        meters: 5,
        version: 'v2',
        sources: [],
        booked: 0,
        free: 5,
        toOrder: 0,
        lastMovement: null,
        bookings: [],
      },
    ],
  },
];

const part = (color: string, planned: number, missing = planned): FabricPlanPart => ({
  fabricCode: 'FAB-023',
  color,
  colorKey: color.toLowerCase(),
  layer: 'Upper',
  planned,
  covered: planned - missing,
  issued: 0,
  reserved: missing,
  stockId: 1,
  stockMeters: 10,
  stockAvailable: 3,
  missing,
});

const card: ItemFabric = {
  orderId: 7,
  itemId: 9,
  orderNumber: 10,
  clientName: 'Геофізика',
  modelName: 'Куртка «Віол»',
  orderVersion: 3,
  isOpen: true,
  fabricCode: 'FAB-023',
  fabricName: 'Грета',
  quantity: 10,
  hasNorm: true,
  planVersion: 1,
  planMissing: null,
  plan: [part('Темно-сірий', 30), part('Червоний', 3, 0)],
  issued: 0,
  issues: [],
  canIssue: true,
};

describe('item issue form', () => {
  it('counts the plan of a cut half up in hundredths (A16)', () => {
    expect(comparisonPlan(30, 4, 10)).toBe(12);
    expect(comparisonPlan(0.25, 1, 2)).toBe(0.13);
    expect(comparisonPlan(6.6, 1, 3)).toBe(2.2);
  });

  it('starts with a line per missing part on its planned pair, metres empty', () => {
    const values = createItemIssueValues(card, fabrics, '2026-11-11');
    expect(values.lines).toHaveLength(1);
    expect(values.lines[0]).toMatchObject({
      partKey: 'FAB-023|темно-сірий',
      fabricCode: 'FAB-023',
      colorKey: 'темно-сірий',
      meters: '',
    });
    expect(Object.keys(validateItemIssue(values, card, fabrics).line)).toHaveLength(1);
    expect(validateItemIssue(values, card, fabrics).issuedQuantity).toBeTruthy();
  });

  it('calls a line planned, replacement or additional as the server does', () => {
    const planned = card.plan[0] ?? null;
    const same = issueLinePair({ fabricCode: 'FAB-023', colorKey: 'темно-сірий' }, fabrics);
    const other = issueLinePair({ fabricCode: 'FAB-023', colorKey: 'сірий' }, fabrics);
    expect(issueLinePurpose(planned, same)).toBe('Planned');
    expect(issueLinePurpose(planned, other)).toBe('Replacement');
    expect(issueLinePurpose(null, same)).toBe('Additional');
  });

  it('compares two lines of one part with its plan once and shows pairs before and after', () => {
    const base = createItemIssueValues(card, fabrics, '2026-11-11');
    const first = { ...base.lines[0]!, meters: '7' };
    const second = { ...first, key: 'b', colorKey: 'сірий', meters: '5,5' };
    const extra = {
      ...issueLineFor(null, fabrics),
      fabricCode: 'FAB-023',
      colorKey: 'сірий',
      meters: '1',
      layer: 'Lining' as const,
    };
    const values = { ...base, issuedQuantity: '4', lines: [first, second, extra] };

    expect(hasItemIssueErrors(validateItemIssue(values, card, fabrics))).toBe(false);
    const preview = itemIssuePreview(values, card, fabrics);
    expect(preview.parts).toEqual([
      {
        key: 'FAB-023|темно-сірий',
        color: 'Темно-сірий',
        fabricCode: 'FAB-023',
        plan: 12,
        actual: 12.5,
        difference: 0.5,
      },
    ]);
    expect(preview.perProduct).toBe(3.375);
    expect(preview.pairs.map((x) => [x.color, x.before, x.after])).toEqual([
      ['Темно-сірий', 10, 3],
      ['Сірий', 5, -1.5],
    ]);
    const body = itemIssueBody(values, card, fabrics, 'op');
    expect(body).toMatchObject({
      operationId: 'op',
      orderVersion: 3,
      planVersion: 1,
      issuedQuantity: 4,
    });
    expect(body?.lines.map((x) => [x.color, x.expectedVersion, x.planColorKey, x.layer])).toEqual([
      ['Темно-сірий', 'v1', 'темно-сірий', null],
      ['Сірий', 'v2', 'темно-сірий', null],
      ['Сірий', 'v2', null, 'Lining'],
    ]);
    expect(issueLinePart(second, card)?.color).toBe('Темно-сірий');
  });

  it('refuses more products than the item has', () => {
    const values = { ...createItemIssueValues(card, fabrics, '2026-11-11'), issuedQuantity: '11' };
    expect(validateItemIssue(values, card, fabrics).issuedQuantity).toContain('від 1 до 10');
  });
});
