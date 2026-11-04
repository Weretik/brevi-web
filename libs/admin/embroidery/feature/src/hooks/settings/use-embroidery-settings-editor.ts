import {
  useGetEmbroiderySettingsQuery,
  useSaveEmbroiderySettingsMutation,
} from '@admin/embroidery/data-access';
import {
  embroideryDraftToContent,
  embroiderySettingsChangedSections,
  embroiderySettingsErrorCounts,
  embroiderySettingsToDraft,
  validateEmbroiderySettings,
} from '@admin/embroidery/model';
import { useEffect, useMemo, useRef, useState } from 'react';

import type {
  EmbroideryExpenseDraft,
  EmbroideryHoopDraft,
  EmbroiderySettingsDraft,
} from '@admin/embroidery/model';

const messageOf = (error: unknown, fallback: string) =>
  (error as { message?: string } | undefined)?.message ?? fallback;

type Row = { id: string };
const upsert = <T extends Row>(rows: readonly T[], row: T): T[] =>
  rows.some((item) => item.id === row.id)
    ? rows.map((item) => (item.id === row.id ? row : item))
    : [...rows, row];

/**
 * «Налаштування»: the draft next to the saved copy, saved whole. A 409 means someone saved first;
 * the page offers «Оновити». Fresh server data replaces the draft only while nothing is changed.
 */
export function useEmbroiderySettingsEditor() {
  const loaded = useGetEmbroiderySettingsQuery();
  const [saveSettings, saving] = useSaveEmbroiderySettingsMutation();
  const [saved, setSaved] = useState<EmbroiderySettingsDraft | null>(null);
  const [draft, setDraft] = useState<EmbroiderySettingsDraft | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [saveError, setSaveError] = useState<{ message: string; stale: boolean } | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const changed = useMemo(
    () => (saved && draft ? embroiderySettingsChangedSections(saved, draft) : []),
    [saved, draft],
  );
  const dirty = changed.length > 0;
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  const reset = (fresh: EmbroiderySettingsDraft) => {
    setSaved(fresh);
    setDraft(fresh);
  };

  useEffect(() => {
    if (loaded.data && !dirtyRef.current) reset(embroiderySettingsToDraft(loaded.data));
  }, [loaded.data]);

  const allErrors = useMemo(() => (draft ? validateEmbroiderySettings(draft) : {}), [draft]);
  const errors = showErrors ? allErrors : {};

  const edit = (change: (current: EmbroiderySettingsDraft) => EmbroiderySettingsDraft) => {
    setSavedNotice(false);
    setDraft((current) => (current ? change(current) : current));
  };

  return {
    settings: loaded.data ?? null,
    saved,
    draft,
    loading: loaded.isLoading,
    loadError: loaded.isError ? messageOf(loaded.error, 'Не вдалося відкрити налаштування.') : null,
    errors,
    /** Problems by section, shown after the first «Зберегти». */
    errorCounts: embroiderySettingsErrorCounts(errors),
    changed,
    dirty,
    saving: saving.isLoading,
    saveError,
    savedNotice,
    dismissSavedNotice: () => setSavedNotice(false),
    /** Returns false when the fields have problems, so the page can show where. */
    save: async (): Promise<boolean> => {
      if (!draft) return false;
      setShowErrors(true);
      setSaveError(null);
      if (Object.keys(allErrors).length > 0) return false;
      try {
        const next = await saveSettings({
          version: draft.version,
          settings: embroideryDraftToContent(draft),
        }).unwrap();
        reset(embroiderySettingsToDraft(next));
        setShowErrors(false);
        setSavedNotice(true);
        return true;
      } catch (error) {
        setSaveError({
          message: messageOf(error, 'Не вдалося зберегти налаштування.'),
          stale: (error as { status?: number }).status === 409,
        });
        return false;
      }
    },
    discard: () => {
      if (saved) setDraft(saved);
      setShowErrors(false);
    },
    reload: async () => {
      setSaveError(null);
      const fresh = await loaded.refetch();
      if (fresh.data) reset(embroiderySettingsToDraft(fresh.data));
    },
    retryLoad: () => void loaded.refetch(),
    changeRates: (patch: Partial<EmbroiderySettingsDraft['rates']>) =>
      edit((current) => ({ ...current, rates: { ...current.rates, ...patch } })),
    changeMarkup: (index: number, patch: Partial<EmbroiderySettingsDraft['markups'][number]>) =>
      edit((current) => ({
        ...current,
        markups: current.markups.map((markup, at) =>
          at === index ? { ...markup, ...patch } : markup,
        ),
      })),
    changeMaterials: (
      patch: Partial<
        Pick<EmbroiderySettingsDraft, 'stabilizer' | 'fabric' | 'fabricIncreasePercent'>
      >,
    ) => edit((current) => ({ ...current, ...patch })),
    putHoop: (hoop: EmbroideryHoopDraft) =>
      edit((current) => ({ ...current, hoops: upsert(current.hoops, hoop) })),
    removeHoop: (id: string) =>
      edit((current) => ({ ...current, hoops: current.hoops.filter((hoop) => hoop.id !== id) })),
    putExpense: (expense: EmbroideryExpenseDraft) =>
      edit((current) => ({ ...current, expenses: upsert(current.expenses, expense) })),
    removeExpense: (id: string) =>
      edit((current) => ({
        ...current,
        expenses: current.expenses.filter((expense) => expense.id !== id),
      })),
  };
}

export type EmbroiderySettingsEditor = ReturnType<typeof useEmbroiderySettingsEditor>;
