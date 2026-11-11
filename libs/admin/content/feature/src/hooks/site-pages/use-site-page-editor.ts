import { useSaveSitePageMutation } from '@admin/content/data-access';
import { sitePageFormOf, sitePageInputOf, validateSitePage } from '@admin/content/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { SitePage, SitePageErrors, SitePageFormValues } from '@admin/content/model';

/** The side panel of one page of «Сторінки сайту»: read view first, «Редагувати» opens the form. */
export function useSitePageEditor(page: SitePage, onDone: (text: string) => void) {
  const [values, setValues] = useState<SitePageFormValues | null>(null);
  const [errors, setErrors] = useState<SitePageErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [save, saving] = useSaveSitePageMutation();

  async function submit() {
    if (!values) return;
    const found = validateSitePage(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setMessage(null);
    try {
      await save(sitePageInputOf(page, values)).unwrap();
      onDone(`Тексти сторінки «${page.name}» збережено. Сайт покаже їх протягом кількох хвилин.`);
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти тексти сторінки.'));
    }
  }

  return {
    values,
    errors,
    message,
    saving: saving.isLoading,
    change: setValues,
    enableEditing: () => setValues(sitePageFormOf(page)),
    submit,
  };
}
