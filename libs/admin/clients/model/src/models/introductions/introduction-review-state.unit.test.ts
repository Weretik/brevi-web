import { describe, expect, it } from 'vitest';

import { introductionLayout } from './introduction-layout';
import {
  introductionCanApply,
  introductionLayoutMatches,
  introductionReviewForSelection,
} from './introduction-review-state';

import type { IntroductionSlotView } from './introduction-slot-view';

const slots = (format: 'general' | 'summer' | 'winter'): IntroductionSlotView[] =>
  introductionLayout(format).map((slot) => ({
    slot,
    productLabel: null,
    fabricLabel: null,
    blockers: [],
  }));

describe('introduction review state', () => {
  it('accepts only the exact 4/8 season positions', () => {
    expect(introductionLayoutMatches('summer', slots('summer'))).toBe(true);
    expect(introductionLayoutMatches('general', slots('general'))).toBe(true);
    expect(introductionLayoutMatches('general', slots('summer'))).toBe(false);
    expect(introductionLayoutMatches('winter', slots('summer'))).toBe(false);
  });

  it('invalidates approval for an edited selection and any server blocker', () => {
    const review = { selectionToken: 'selection-1', approved: true, blockers: [] };
    expect(introductionCanApply('summer', slots('summer'), 'selection-1', review)).toBe(true);
    expect(introductionReviewForSelection(review, 'selection-2')).toBeNull();
    expect(introductionCanApply('summer', slots('summer'), 'selection-2', review)).toBe(false);
    expect(
      introductionCanApply('summer', slots('summer'), 'selection-1', {
        ...review,
        blockers: ['Невірний сезон'],
      }),
    ).toBe(false);
    const blockedSlots = slots('summer');
    blockedSlots[0] = { ...blockedSlots[0], blockers: ['Немає тканини'] };
    expect(introductionCanApply('summer', blockedSlots, 'selection-1', review)).toBe(false);
  });
});
