import { describe, expect, it } from 'vitest';

import {
  countProductionOrderFilters,
  productionOrderFilterChipText,
  productionOrderFilterLabels,
} from './production-order-filters';
import { emptyProductionOrderFilters } from '../../entities/orders/production-order';

const options = {
  clients: [],
  models: [{ code: 'MOD-052', name: 'Куртка «Віол»' }],
  fabrics: [{ code: 'TK-1', name: 'TK-1' }],
  colors: [],
  seasons: [],
};

describe('countProductionOrderFilters', () => {
  it('counts the set fields and the manager', () => {
    expect(countProductionOrderFilters(emptyProductionOrderFilters, null)).toBe(0);
    expect(
      countProductionOrderFilters(
        { ...emptyProductionOrderFilters, client: 'Школа', season: 'Зима' },
        'Олена',
      ),
    ).toBe(3);
  });
});

describe('productionOrderFilterChipText', () => {
  it('shows dates as dd.mm.yyyy', () => {
    expect(productionOrderFilterChipText('from', '2026-11-14', options)).toBe(
      'Період від: 14.11.2026',
    );
  });

  it('adds the model name to its code, but not a name equal to the code', () => {
    expect(productionOrderFilterChipText('model', 'MOD-052', options)).toBe(
      'Модель: MOD-052 · Куртка «Віол»',
    );
    expect(productionOrderFilterChipText('fabric', 'TK-1', options)).toBe('Тканина: TK-1');
    expect(productionOrderFilterChipText('model', 'X', null)).toBe('Модель: X');
  });

  it('shows other fields as label and value', () => {
    expect(productionOrderFilterChipText('season', 'Зима', options)).toBe(
      `${productionOrderFilterLabels.season}: Зима`,
    );
  });
});
