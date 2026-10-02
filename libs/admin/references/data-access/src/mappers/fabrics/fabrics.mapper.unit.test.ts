import { describe, expect, it } from 'vitest';

import { mapFabrics } from './fabrics.mapper';

describe('fabric response mapping', () => {
  it('accepts rows with the contracted supplier field', () => {
    expect(mapFabrics([{ id: 4, name: 'Льон', providerName: 'Атлас', price: 25 }])).toEqual([
      { id: 4, name: 'Льон', providerName: 'Атлас', price: 25 },
    ]);
  });

  it('rejects a damaged row before it reaches the grid', () => {
    expect(() => mapFabrics([{ id: 4, name: 'Льон', providerName: 'Атлас', price: '25' }])).toThrow(
      'Некоректний запис тканини.',
    );
  });
});
