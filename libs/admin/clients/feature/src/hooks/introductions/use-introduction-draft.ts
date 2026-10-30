import { introductionLayout } from '@admin/clients/model';
import { useCallback, useState } from 'react';

import type { IntroductionFormat } from '@admin/clients/model';

export interface IntroductionDraftSlot {
  readonly key: string;
  readonly productId: number | null;
  readonly articleId: number | null;
  readonly productLabel: string | null;
  readonly fabricLabel: string | null;
}

export interface IntroductionDraftValues {
  readonly name: string;
  readonly format: IntroductionFormat;
  readonly emailTemplateVersionId: string;
}

export interface IntroductionDraftSource {
  readonly id: string;
  readonly versionId: string;
  readonly revision: number;
  readonly archived: boolean;
  readonly mappingVersionId: string;
}

const emptyValues: IntroductionDraftValues = {
  name: '',
  format: 'general',
  emailTemplateVersionId: '',
};

function emptySlots(format: IntroductionFormat): IntroductionDraftSlot[] {
  return introductionLayout(format).map((slot) => ({
    key: slot.key,
    productId: null,
    articleId: null,
    productLabel: null,
    fabricLabel: null,
  }));
}

/** Feature-local edit state. A saved selection is checked only after its current edits are saved. */
export function useIntroductionDraft() {
  const [values, setValues] = useState(emptyValues);
  const [slots, setSlots] = useState<readonly IntroductionDraftSlot[]>(() => emptySlots('general'));
  const [source, setSource] = useState<IntroductionDraftSource | null>(null);
  const [dirty, setDirty] = useState(false);
  const [generation, setGeneration] = useState(0);
  const touch = () => {
    setDirty(true);
    setGeneration((value) => value + 1);
  };
  const change = (next: IntroductionDraftValues) => {
    if (next.format !== values.format) {
      const required = emptySlots(next.format);
      setSlots(required.map((slot) => slots.find((current) => current.key === slot.key) ?? slot));
    }
    setValues(next);
    touch();
  };
  const selectProduct = (key: string, productId: number, label: string) => {
    setSlots((current) =>
      current.map((slot) =>
        slot.key === key
          ? { ...slot, productId, productLabel: label, articleId: null, fabricLabel: null }
          : slot,
      ),
    );
    touch();
  };
  const selectArticle = (key: string, articleId: number, label: string) => {
    setSlots((current) =>
      current.map((slot) => (slot.key === key ? { ...slot, articleId, fabricLabel: label } : slot)),
    );
    touch();
  };
  const load = (
    nextValues: IntroductionDraftValues,
    nextSlots: readonly IntroductionDraftSlot[],
    nextSource: IntroductionDraftSource,
  ) => {
    setValues(nextValues);
    setSlots(nextSlots);
    setSource(nextSource);
    setDirty(false);
    setGeneration((value) => value + 1);
  };
  const reset = useCallback(() => {
    setValues(emptyValues);
    setSlots(emptySlots('general'));
    setSource(null);
    setDirty(false);
    setGeneration((value) => value + 1);
  }, []);
  return {
    values,
    slots,
    source,
    dirty,
    change,
    selectProduct,
    selectArticle,
    load,
    reset,
    selectionToken: `${source?.id ?? 'new'}:${source?.versionId ?? ''}:${generation}`,
  };
}
