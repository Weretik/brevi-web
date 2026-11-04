import { useGetQuoteSettingsQuery, useSaveQuoteSettingsMutation } from '@admin/quotes/data-access';
import {
  emptyLetterVariantDraft,
  quoteSettingsErrors,
  quoteSettingsToDraft,
} from '@admin/quotes/model';
import { useEffect, useMemo, useState } from 'react';

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
 * «Налаштування КП»: loads the settings (defaults until the first save), keeps the draft and saves it whole.
 * A 409 means someone saved a newer version; the page offers «Оновити».
 */
export function useQuoteSettingsEditor() {
  const loaded = useGetQuoteSettingsQuery();
  const [saveSettings, saving] = useSaveQuoteSettingsMutation();
  const [draft, setDraft] = useState<QuoteSettingsDraft | null>(null);
  const [dirty, setDirty] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [saveError, setSaveError] = useState<{ message: string; stale: boolean } | null>(null);

  useEffect(() => {
    if (!loaded.data) return;
    setDraft(quoteSettingsToDraft(loaded.data));
    setDirty(false);
  }, [loaded.data]);

  const errors = useMemo(() => (draft ? quoteSettingsErrors(draft) : {}), [draft]);

  const edit = (change: (current: QuoteSettingsDraft) => QuoteSettingsDraft) => {
    setDraft((current) => (current ? change(current) : current));
    setDirty(true);
  };

  const save = async () => {
    if (!draft) return;
    setShowErrors(true);
    setSaveError(null);
    if (Object.keys(errors).length > 0) return;
    try {
      const next = await saveSettings(draft).unwrap();
      setDraft(quoteSettingsToDraft(next));
      setDirty(false);
      setShowErrors(false);
    } catch (error) {
      setSaveError({
        message: messageOf(error, 'Не вдалося зберегти налаштування.'),
        stale: (error as { status?: number }).status === 409,
      });
    }
  };

  return {
    settings: loaded.data ?? null,
    draft,
    loading: loaded.isLoading,
    loadError: loaded.isError ? messageOf(loaded.error, 'Не вдалося відкрити налаштування.') : null,
    errors: showErrors ? errors : {},
    dirty,
    saving: saving.isLoading,
    saveError,
    save,
    reload: async () => {
      setSaveError(null);
      const fresh = await loaded.refetch();
      if (fresh.data) {
        setDraft(quoteSettingsToDraft(fresh.data));
        setDirty(false);
      }
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
    changeContact: (userId: number, patch: Partial<QuoteStaffContactDraft>) =>
      edit((current) => ({
        ...current,
        staffContacts: current.staffContacts.map((contact) =>
          contact.userId === userId ? { ...contact, ...patch } : contact,
        ),
      })),
    addLetter: () =>
      edit((current) => ({
        ...current,
        letterVariants: [...current.letterVariants, emptyLetterVariantDraft()],
      })),
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
