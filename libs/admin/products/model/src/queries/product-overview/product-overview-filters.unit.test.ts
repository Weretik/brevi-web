import { describe, expect, it } from 'vitest';

import { orderSectionCounts } from './product-overview-filters';

describe('orderSectionCounts', () => {
  it('follows the section order, then unknown sections, then rows without a section', () => {
    expect(
      orderSectionCounts(
        [
          { sectionId: null, count: 2 },
          { sectionId: 9, count: 1 },
          { sectionId: 3, count: 4 },
          { sectionId: 1, count: 5 },
        ],
        [3, 1, 7],
      ),
    ).toEqual([
      { sectionId: 3, count: 4 },
      { sectionId: 1, count: 5 },
      { sectionId: 9, count: 1 },
      { sectionId: null, count: 2 },
    ]);
  });
});
