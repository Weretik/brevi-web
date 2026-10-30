import { introductionLayout } from './introduction-layout';

import type { IntroductionFormat } from './introduction-layout';
import type { IntroductionSlotView } from './introduction-slot-view';

/** UI-only result of a server check; no transport shape or product identity lives here. */
export interface IntroductionReviewState {
  readonly selectionToken: string;
  readonly approved: boolean;
  readonly blockers: readonly string[];
}

export function introductionLayoutMatches(
  format: IntroductionFormat,
  slots: readonly IntroductionSlotView[],
): boolean {
  const expected = introductionLayout(format);
  return (
    slots.length === expected.length &&
    expected.every((slot, index) => {
      const actual = slots[index]?.slot;
      return (
        actual?.key === slot.key &&
        actual.season === slot.season &&
        actual.position === slot.position &&
        actual.featured === slot.featured
      );
    })
  );
}

export function introductionReviewForSelection(
  review: IntroductionReviewState | null,
  selectionToken: string,
): IntroductionReviewState | null {
  return review?.selectionToken === selectionToken ? review : null;
}

export function introductionCanApply(
  format: IntroductionFormat,
  slots: readonly IntroductionSlotView[],
  selectionToken: string,
  review: IntroductionReviewState | null,
): boolean {
  const current = introductionReviewForSelection(review, selectionToken);
  return (
    !!selectionToken &&
    !!current?.approved &&
    current.blockers.length === 0 &&
    introductionLayoutMatches(format, slots) &&
    slots.every((slot) => slot.blockers.length === 0)
  );
}
