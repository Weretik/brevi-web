import { describe, expect, it } from 'vitest';

import {
  mapFinanceCounterpartyChoices,
  mapFinanceCounterpartyPage,
} from './accounting-counterparty.mapper';

const counterparty = {
  id: 'f1',
  name: 'ФОП Іваненко',
  edrpou: '12345678',
  iban: '',
  bankName: '',
  aliases: ['Іваненко'],
  defaultCategoryId: null,
  defaultCategoryRootName: null,
  defaultSubcategoryName: null,
  autoApplyCategory: false,
  note: '',
  verified: false,
  active: true,
  mergedIntoId: null,
  operationCount: 3,
  currentTurnoverMinor: -19_200,
  version: 1,
  createdAt: '2026-11-05T08:00:00+00:00',
  updatedAt: '2026-11-05T08:00:00+00:00',
};

describe('counterparty mapper', () => {
  it('reads a page of one tab with the counts of every tab', () => {
    const page = mapFinanceCounterpartyPage({
      tab: 'Financial',
      financial: [counterparty],
      parties: [
        {
          kind: 'Supplier',
          id: '7',
          name: 'Тканини',
          taxId: '',
          active: true,
          operationCount: 0,
          currentTurnoverMinor: 0,
        },
      ],
      oneoffs: [],
      total: 1,
      page: 1,
      pageSize: 50,
      counts: { financial: 1, clients: 0, suppliers: 1, oneoffs: 0 },
    });
    expect(page.financial[0]).toMatchObject({ verified: false, aliases: ['Іваненко'] });
    expect(page.parties[0]?.kind).toBe('Supplier');
    expect(page.counts.suppliers).toBe(1);
  });

  it('rejects an unknown kind of a choice', () => {
    expect(() =>
      mapFinanceCounterpartyChoices([
        { kind: 'Bank', id: '1', name: 'X', hint: '', verified: true, defaultCategoryId: null },
      ]),
    ).toThrow(/вид/);
  });
});
