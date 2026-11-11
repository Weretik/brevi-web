import { useSaveSiteSeoSettingsMutation } from '@admin/content/data-access';
import { seoSettingsFormOf, seoSettingsInputOf, validateSeoSettings } from '@admin/content/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { SeoSettings, SeoSettingsErrors, SeoSettingsFormValues } from '@admin/content/model';

/** The side panel of «Налаштування SEO сайту»: opens as a form filled from the saved settings. */
export function useSeoSettingsEditor(settings: SeoSettings, onDone: (text: string) => void) {
  const [values, setValues] = useState<SeoSettingsFormValues>(() => seoSettingsFormOf(settings));
  const [errors, setErrors] = useState<SeoSettingsErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [save, saving] = useSaveSiteSeoSettingsMutation();

  async function submit() {
    const found = validateSeoSettings(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setMessage(null);
    try {
      await save(seoSettingsInputOf(settings.revision, values)).unwrap();
      onDone('Налаштування SEO збережено. Сайт покаже їх протягом кількох хвилин.');
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти налаштування SEO.'));
    }
  }

  return { values, errors, message, saving: saving.isLoading, change: setValues, submit };
}
