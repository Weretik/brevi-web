import { useGetQuoteSettingsQuery, useSaveQuoteSettingsMutation } from '@admin/quotes/data-access';
import {
  emptyLetterVariantDraft,
  quoteSettingsChangedSections,
  quoteSettingsErrorCounts,
  quoteSettingsErrors,
  quoteSettingsToDraft,
} from '@admin/quotes/model';
import { useEffect, useMemo, useRef, useState } from 'react';

import { quoteSettingsUnsaved, restoreUnsaved, withMailboxes } from './quote-settings-unsaved';

import type {
  QuoteAdvantageDraft,
  QuoteCompanyDraft,
  QuoteEmailTemplateDraft,
  QuoteIntroductionDraft,
  QuoteLetterVariantDraft,
  QuotePdfTextsDraft,
  QuoteSettingsDraft,
  QuoteStaffContactDraft,
} from '@admin/quotes/model';

const messageOf = (error: unknown, fallback: string) =>
  (error as { message?: string } | undefined)?.message ?? fallback;

/**
 * «Налаштування КП»: loads the settings (defaults until the first save), keeps the draft next to the saved
 * copy and saves it whole. A 409 means someone saved a newer version; the page offers «Оновити».
 * A new Gmail address does not touch what the person typed.
 */
export function useQuoteSettingsEditor() {
  const loaded = useGetQuoteSettingsQuery();
  const [saveSettings, saving] = useSaveQuoteSettingsMutation();
  const [saved, setSaved] = useState<QuoteSettingsDraft | null>(null);
  const [draft, setDraft] = useState<QuoteSettingsDraft | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [restored, setRestored] = useState(false);
  const [saveError, setSaveError] = useState<{ message: string; stale: boolean } | null>(null);
  const changedRef = useRef<boolean>(false);

  const changed = useMemo(
    () => (saved && draft ? quoteSettingsChangedSections(saved, draft) : []),
    [saved, draft],
  );
  const dirty = changed.length > 0;
  changedRef.current = dirty;

  const reset = (fresh: QuoteSettingsDraft) => {
    setSaved(fresh);
    setDraft(fresh);
  };

  useEffect(() => {
    if (!loaded.data) return;
    const fresh = quoteSettingsToDraft(loaded.data);
    if (changedRef.current) {
      // Gmail was connected or disconnected: only the addresses change.
      setSaved((current) => (current ? withMailboxes(current, fresh) : fresh));
      setDraft((current) => (current ? withMailboxes(current, fresh) : fresh));
      return;
    }
    const unsaved = quoteSettingsUnsaved.take(fresh.version);
    if (unsaved) {
      setSaved(fresh);
      setDraft(restoreUnsaved(unsaved, fresh));
      setRestored(true);
      return;
    }
    reset(fresh);
  }, [loaded.data]);

  const allErrors = useMemo(() => (draft ? quoteSettingsErrors(draft) : {}), [draft]);
  const errors = showErrors ? allErrors : {};

  const edit = (change: (current: QuoteSettingsDraft) => QuoteSettingsDraft) =>
    setDraft((current) => (current ? change(current) : current));

  /** Returns false when the fields have problems, so the page can show where. */
  const save = async (): Promise<boolean> => {
    if (!draft) return false;
    setShowErrors(true);
    setSaveError(null);
    if (Object.keys(allErrors).length > 0) return false;
    try {
      const next = await saveSettings(draft).unwrap();
      reset(quoteSettingsToDraft(next));
      setShowErrors(false);
      setRestored(false);
      return true;
    } catch (error) {
      setSaveError({
        message: messageOf(error, 'Не вдалося зберегти налаштування.'),
        stale: (error as { status?: number }).status === 409,
      });
      return false;
    }
  };

  return {
    settings: loaded.data ?? null,
    saved,
    draft,
    loading: loaded.isLoading,
    loadError: loaded.isError ? messageOf(loaded.error, 'Не вдалося відкрити налаштування.') : null,
    errors,
    /** Problems by section, shown after the first «Зберегти». */
    errorCounts: quoteSettingsErrorCounts(errors),
    changed,
    dirty,
    /** The changes came back after «Підключити Gmail». */
    restored,
    dismissRestored: () => setRestored(false),
    saving: saving.isLoading,
    saveError,
    save,
    discard: () => {
      if (saved) setDraft(saved);
      setShowErrors(false);
      setRestored(false);
    },
    /** Before leaving for Google: keeps the unsaved changes for the way back. */
    keepUnsaved: () => {
      if (draft && dirty) quoteSettingsUnsaved.keep(draft);
    },
    reload: async () => {
      setSaveError(null);
      const fresh = await loaded.refetch();
      if (fresh.data) reset(quoteSettingsToDraft(fresh.data));
    },
    changeCompany: (patch: Partial<QuoteCompanyDraft>) =>
      edit((current) => ({ ...current, company: { ...current.company, ...patch } })),
    changeEmail: (patch: Partial<QuoteEmailTemplateDraft>) =>
      edit((current) => ({ ...current, email: { ...current.email, ...patch } })),
    changePdf: (patch: Partial<QuotePdfTextsDraft>) =>
      edit((current) => ({ ...current, pdf: { ...current.pdf, ...patch } })),
    changeIntroduction: (patch: Partial<QuoteIntroductionDraft>) =>
      edit((current) => ({ ...current, introduction: { ...current.introduction, ...patch } })),
    changeAdvantage: (index: number, patch: Partial<QuoteAdvantageDraft>) =>
      edit((current) => ({
        ...current,
        introduction: {
          ...current.introduction,
          advantages: current.introduction.advantages.map((advantage, at) =>
            at === index ? { ...advantage, ...patch } : advantage,
          ),
        },
      })),
    moveAdvantage: (from: number, to: number) =>
      edit((current) => {
        const advantages = [...current.introduction.advantages];
        const [moved] = advantages.splice(from, 1);
        if (!moved) return current;
        advantages.splice(to, 0, moved);
        return { ...current, introduction: { ...current.introduction, advantages } };
      }),
    changeContact: (userId: number, patch: Partial<QuoteStaffContactDraft>) =>
      edit((current) => ({
        ...current,
        staffContacts: current.staffContacts.map((contact) =>
          contact.userId === userId ? { ...contact, ...patch } : contact,
        ),
      })),
    /** Adds an empty letter and returns its key, so the page can open it. */
    addLetter: (): string => {
      const letter = emptyLetterVariantDraft();
      edit((current) => ({ ...current, letterVariants: [...current.letterVariants, letter] }));
      return letter.key;
    },
    changeLetter: (key: string, patch: Partial<QuoteLetterVariantDraft>) =>
      edit((current) => ({
        ...current,
        letterVariants: current.letterVariants.map((variant) =>
          variant.key === key ? { ...variant, ...patch } : variant,
        ),
      })),
    removeLetter: (key: string) =>
      edit((current) => ({
        ...current,
        letterVariants: current.letterVariants.filter((variant) => variant.key !== key),
      })),
  };
}
