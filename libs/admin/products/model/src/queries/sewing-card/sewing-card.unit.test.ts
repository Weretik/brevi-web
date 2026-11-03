import { describe, expect, it } from 'vitest';

import { sewingBlockerReasons, translateCompositionBlockers } from './sewing-blocker-reasons';
import { sewingCardTotals } from './sewing-card-totals';
import { sewingLabourLines } from './sewing-labour-lines';

import type { SewingArticleSummaryRow } from '../../entities/sewing-card/sewing-article-summary';

const tiers = { retail: 900, wholesale: 820, largeWholesale: 780 };

function row(update: Partial<SewingArticleSummaryRow>): SewingArticleSummaryRow {
  return {
    id: 1,
    saleSku: '602',
    active: true,
    sortOrder: 0,
    calculated: true,
    blockers: [],
    costs: [{ kind: 'seamstress', amount: 120 }],
    minutes: 54,
    minuteCost: 2,
    fullCost: 500,
    prices: tiers,
    published: { publishedAt: '2026-11-01T08:00:00Z', prices: tiers },
    ...update,
  };
}

describe('sewing card (CAT-007)', () => {
  it('names blockers with the sheet reasons once each', () => {
    expect(
      sewingBlockerReasons([
        { code: 'MissingOperations' },
        { code: 'MissingFabric' },
        { code: 'MissingFabric' },
        { code: 'Something' },
      ]),
    ).toEqual(['Немає трудовитрат', 'Немає тканини', 'Не розраховано']);
    expect(
      translateCompositionBlockers([
        'No effective fabric line is configured.',
        'No effective fabric line is configured.',
        'No operation lines are configured.',
      ]),
    ).toEqual(['Немає тканини.', 'Немає трудовитрат.']);
  });

  it('counts ready articles and price ranges', () => {
    const totals = sewingCardTotals([
      row({}),
      row({ id: 2, fullCost: 520, prices: { ...tiers, retail: 950 } }),
      row({
        id: 3,
        calculated: false,
        prices: null,
        fullCost: null,
        blockers: [{ code: 'MissingFabric', inputKey: null }],
      }),
    ]);

    expect(totals).toEqual({
      articles: 3,
      ready: 2,
      minutes: 54,
      fullCost: { min: 500, max: 520 },
      retail: { min: 900, max: 950 },
    });
  });

  it('takes manual time over the norm and spreads the seamstress pay by minutes', () => {
    const lines = sewingLabourLines(
      [
        {
          clientId: 'a',
          operationId: 7,
          quantity: 2,
          manualMinutes: null,
          sortOrder: 0,
          comment: 'Комір',
        },
        {
          clientId: 'b',
          operationId: 8,
          quantity: 1,
          manualMinutes: 9,
          sortOrder: 1,
          comment: '',
        },
      ],
      [
        { id: 7, name: 'Комір: Стійка', min: 7.3 },
        { id: 8, name: 'Застібка', min: 4 },
      ],
      2.2,
    );

    expect(lines.map((line) => [line.name, line.minutes, line.manual])).toEqual([
      ['Комір: Стійка', 14.6, false],
      ['Застібка', 9, true],
    ]);
    expect(lines[0].cost).toBeCloseTo(32.12);
    const unknown = {
      clientId: 'c',
      operationId: 9,
      quantity: 1,
      manualMinutes: null,
      sortOrder: 0,
      comment: '',
    };
    expect(sewingLabourLines([unknown], [], null)[0]).toMatchObject({
      name: 'Операція 9',
      minutes: null,
      cost: null,
    });
  });
});
