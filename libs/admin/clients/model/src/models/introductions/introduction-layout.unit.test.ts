import { describe, expect, it } from 'vitest';

import { introductionLayout } from './introduction-layout';

describe('first-contact layout positions', () => {
  it('shows four positions for either single-season format', () => {
    for (const format of ['summer', 'winter'] as const) {
      const slots = introductionLayout(format);
      expect(slots).toHaveLength(4);
      expect(slots.map((slot) => slot.season)).toEqual(Array(4).fill(format));
      expect(slots.filter((slot) => slot.featured).map((slot) => slot.position)).toEqual([1]);
    }
  });

  it('shows two four-position seasons with one featured position each', () => {
    const slots = introductionLayout('general');
    expect(slots).toHaveLength(8);
    expect(slots.map((slot) => slot.key)).toEqual([
      'summer-1',
      'summer-2',
      'summer-3',
      'summer-4',
      'winter-1',
      'winter-2',
      'winter-3',
      'winter-4',
    ]);
    expect(slots.filter((slot) => slot.featured).map((slot) => slot.key)).toEqual([
      'summer-1',
      'winter-1',
    ]);
  });
});
