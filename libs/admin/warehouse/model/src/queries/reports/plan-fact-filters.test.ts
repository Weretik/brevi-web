import { describe, expect, it } from 'vitest';

import { filterPlanFact, planFactDeviation, planFactViewCounts } from './plan-fact-filters';

import type { PlanFactModel, PlanFactSummary } from '../../entities/reports/stock-reports';

const summary = (plan: number | null, fact: number): PlanFactSummary => ({
  orders: 1,
  products: 10,
  planPerProduct: plan,
  factPerProduct: fact,
  differencePerProduct: plan === null ? null : fact - plan,
  difference: plan === null ? null : (fact - plan) * 10,
  result: plan === null ? 'NeedsCheck' : fact > plan ? 'Overrun' : 'Economy',
  uncomparableItems: plan === null ? 1 : 0,
});

const model = (
  name: string,
  plan: number | null,
  fact: number,
  client = 'Геофізика',
): PlanFactModel => ({
  modelName: name,
  modelCode: null,
  summary: summary(plan, fact),
  items: [
    {
      orderId: 1,
      orderNumber: 12,
      clientName: client,
      itemId: 10,
      products: 10,
      plan: null,
      fact: 0,
      difference: null,
      result: 'OnPlan',
      reason: null,
      materials: [
        {
          layer: 'Upper',
          planFabricCode: 'FAB-023',
          planFabricName: 'Грета',
          planColor: 'Синій',
          plan: 1,
          fact: 1,
          difference: 0,
          used: ['Грета · Синій'],
        },
      ],
      issuedOn: '2026-11-04',
    },
  ],
});

const models = [
  model('Жилет', 0.62, 0.63),
  model('Куртка «Віол»', 1.32, 1.45, 'Нафтогаз'),
  model('Халат', null, 1.1),
  model('Костюм', 2.4, 2.37),
  model('Напівкомбінезон', 1.8, 1.91),
];

describe('plan and fact filters', () => {
  it('gives the deviation in per cent', () => {
    expect(planFactDeviation(summary(2, 2.2))).toBeCloseTo(10);
    expect(planFactDeviation(summary(null, 1))).toBeNull();
  });

  it('sorts by deviation, the ones that cannot be compared last', () => {
    expect(filterPlanFact(models, 'all', '').map((x) => x.modelName)).toEqual([
      'Куртка «Віол»',
      'Напівкомбінезон',
      'Жилет',
      'Костюм',
      'Халат',
    ]);
  });

  it('counts and filters the overspending above 5% and the uncomparable', () => {
    expect(planFactViewCounts(models)).toEqual({ all: 5, overrun: 2, uncomparable: 1 });
    expect(filterPlanFact(models, 'overrun', '').map((x) => x.modelName)).toEqual([
      'Куртка «Віол»',
      'Напівкомбінезон',
    ]);
    expect(filterPlanFact(models, 'uncomparable', '').map((x) => x.modelName)).toEqual(['Халат']);
  });

  it('finds by model, client, task or fabric', () => {
    expect(filterPlanFact(models, 'all', 'віол')).toHaveLength(1);
    expect(filterPlanFact(models, 'all', 'нафто').map((x) => x.modelName)).toEqual([
      'Куртка «Віол»',
    ]);
    expect(filterPlanFact(models, 'all', 'Ц-12')).toHaveLength(5);
    expect(filterPlanFact(models, 'all', 'грета')).toHaveLength(5);
    expect(filterPlanFact(models, 'all', 'немає')).toEqual([]);
  });
});
