import { describe, expect, it } from 'vitest';

import { templateSelections } from './template-selections';
import { emptyCustomConfiguration } from '../custom-sewing/custom-draft';

describe('reusable template selection projection', () => {
  it('excludes private notes, file IDs, historical costs and sale approval', () => {
    const selections = templateSelections({
      ...emptyCustomConfiguration(),
      name: 'Куртка',
      productType: 'Куртка',
      internalNote: 'private',
      delivery: 99,
      packaging: 45,
      applications: [
        {
          kind: 'print',
          location: 'Спина',
          artworkFileId: 'file',
          cost: 15,
          saleAmount: 30,
          saleApproved: true,
        },
      ],
    });
    expect(selections).not.toHaveProperty('internalNote');
    expect(selections).not.toHaveProperty('delivery');
    expect(selections).not.toHaveProperty('packaging');
    expect(selections.applications).toEqual([{ kind: 'print', location: 'Спина' }]);
  });
  it('retains separate material and operation rows without merging their norms', () => {
    const value = {
      ...emptyCustomConfiguration(),
      fabrics: [
        { referenceId: 1, quantity: 2, unit: 'Metre' },
        { referenceId: 1, quantity: 3, unit: 'Metre' },
      ],
    };
    expect(templateSelections(value).fabrics).toEqual(value.fabrics);
  });
});
