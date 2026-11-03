import { sewingLabourLines } from '@admin/products/model';
import { useEffect, useMemo } from 'react';

import type { useSewingCompositionController } from '../sewing-composition/use-sewing-composition-controller';

type Controller = ReturnType<typeof useSewingCompositionController>;

/**
 * Ties the composition editor to the card: keeps the model code from «Редагувати» in the draft
 * (so saving the composition never restores an old code) and builds the labour rows.
 */
export function useSewingCardComposition(
  controller: Controller,
  code: string | null,
  codeKnown: boolean,
  seamstressPerMinute: number | null,
) {
  const { drafts, sewingLookups } = controller;
  const { setModelDraft, setModelBaseline } = drafts;

  useEffect(() => {
    if (!codeKnown) return;
    const withCode = <Draft extends { modelCode: string | null }>(current: Draft | null) =>
      current && current.modelCode !== code ? { ...current, modelCode: code } : current;
    setModelDraft(withCode);
    setModelBaseline(withCode);
  }, [code, codeKnown, setModelBaseline, setModelDraft]);

  const labour = useMemo(
    () =>
      sewingLabourLines(
        drafts.modelDraft?.operations ?? [],
        sewingLookups.operations,
        seamstressPerMinute,
      ),
    [seamstressPerMinute, drafts.modelDraft?.operations, sewingLookups.operations],
  );
  return { labour, labourMinutes: labour.reduce((sum, line) => sum + (line.minutes ?? 0), 0) };
}
