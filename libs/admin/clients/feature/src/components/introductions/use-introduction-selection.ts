import {
  introductionCanApply,
  introductionLayoutMatches,
  introductionReviewForSelection,
} from '@admin/clients/model';
import { useRef, useState } from 'react';

import type {
  IntroductionFormat,
  IntroductionReviewState,
  IntroductionSlotView,
} from '@admin/clients/model';

/** Injected server result; the eventual API adapter owns its transport mapping. */
export interface IntroductionCheckResult {
  readonly approved: boolean;
  readonly blockers: readonly string[];
}

export interface IntroductionSelectionActions {
  readonly onCheck: (selectionToken: string) => Promise<IntroductionCheckResult>;
  readonly onApply: (selectionToken: string) => Promise<void>;
}

export function useIntroductionSelection({
  format,
  slots,
  selectionToken,
  disabled,
  onCheck,
  onApply,
}: IntroductionSelectionActions & {
  format: IntroductionFormat;
  slots: readonly IntroductionSlotView[];
  selectionToken: string;
  disabled: boolean;
}) {
  const [review, setReview] = useState<IntroductionReviewState | null>(null);
  const [checking, setChecking] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);
  const currentToken = useRef(selectionToken);
  if (currentToken.current !== selectionToken) {
    currentToken.current = selectionToken;
    generation.current += 1;
  }
  const currentReview = introductionReviewForSelection(review, selectionToken);
  const layoutValid = introductionLayoutMatches(format, slots);
  const canApply =
    !disabled &&
    !checking &&
    !applying &&
    introductionCanApply(format, slots, selectionToken, currentReview);

  const invalidate = () => {
    generation.current += 1;
    setReview(null);
    setError(null);
  };
  const check = async () => {
    if (disabled || checking || applying || !selectionToken || !layoutValid) return;
    const token = selectionToken;
    const attempt = generation.current;
    setChecking(true);
    setError(null);
    setReview(null);
    try {
      const result = await onCheck(token);
      if (attempt === generation.current && currentToken.current === token)
        setReview({ selectionToken: token, approved: result.approved, blockers: result.blockers });
    } catch (reason) {
      if (attempt === generation.current && currentToken.current === token)
        setError(
          reason instanceof Error ? reason.message : 'Не вдалося перевірити добірку на сервері.',
        );
    } finally {
      setChecking(false);
    }
  };
  const apply = async () => {
    if (!canApply) return;
    setApplying(true);
    setError(null);
    try {
      await onApply(selectionToken);
      setReview(null);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Не вдалося створити чернетку з добірки.',
      );
    } finally {
      setApplying(false);
    }
  };
  return {
    review: currentReview,
    layoutValid,
    canApply,
    checking,
    applying,
    error,
    invalidate,
    check,
    apply,
  } as const;
}
