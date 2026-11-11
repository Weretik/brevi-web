import { describe, expect, it } from 'vitest';

import { mapFabricIssueItems, mapItemFabric } from './item-fabric.mapper';

const card = {
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
  plan: [
    {
      fabricCode: 'FAB-023',
      color: 'Темно-сірий',
      colorKey: 'темно-сірий',
      layer: 'Upper',
      planned: 30,
      covered: 12,
      issued: 12.5,
      reserved: 18,
      stockId: 1,
      stockMeters: 40,
      stockAvailable: 22,
      missing: 18,
    },
  ],
  issued: 13.5,
  issues: [
    {
      id: 4,
      issuedOn: '2026-11-11',
      note: null,
      createdByName: 'Олена',
      createdAt: '2026-11-11T08:00:00Z',
      isReversed: false,
      reversedAt: null,
      reversedByName: null,
      reverseReason: null,
      issuedQuantity: 4,
      comparison: [
        {
          planFabricCode: 'FAB-023',
          planColorKey: 'темно-сірий',
          color: 'Темно-сірий',
          plan: 12,
          actual: 12.5,
          difference: 0.5,
          perProduct: 3.125,
        },
      ],
      lines: [
        {
          id: 1,
          purpose: 'Additional',
          planFabricCode: null,
          planColorKey: null,
          plannedMeters: null,
          stockId: 2,
          fabricCode: 'FAB-005',
          fabricName: 'Оксфорд',
          color: 'Чорний',
          meters: 1,
          coveredMeters: 0,
          layer: 'Lining',
          note: 'кишені',
          isVoided: false,
        },
      ],
    },
  ],
  canIssue: true,
};

describe('item fabric mappers', () => {
  it('maps the card with the saved plan, plan and fact, and layers', () => {
    const result = mapItemFabric(card);
    expect(result.planVersion).toBe(1);
    expect(result.plan[0]).toMatchObject({ layer: 'Upper', missing: 18 });
    expect(result.issues[0]?.comparison[0]).toMatchObject({
      plan: 12,
      difference: 0.5,
      perProduct: 3.125,
    });
    expect(result.issues[0]?.lines[0]).toMatchObject({ layer: 'Lining', isVoided: false });
  });

  it('refuses an unknown layer', () => {
    expect(() => mapItemFabric({ ...card, plan: [{ ...card.plan[0], layer: 'Top' }] })).toThrow();
  });

  it('maps the items found for an issue', () => {
    expect(
      mapFabricIssueItems({
        items: [
          {
            orderId: 7,
            orderNumber: 10,
            clientName: 'Геофізика',
            itemId: 9,
            modelName: 'Куртка',
            fabricCode: null,
            fabricName: null,
            quantity: 3,
          },
        ],
        hasMore: false,
      }).items[0],
    ).toMatchObject({ orderNumber: 10, fabricCode: null });
  });
});
