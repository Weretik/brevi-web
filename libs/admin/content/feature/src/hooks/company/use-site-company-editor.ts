import { useSaveSiteCompanyMutation } from '@admin/content/data-access';
import { siteCompanyFormOf, siteCompanyInputOf, validateSiteCompany } from '@admin/content/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { SiteCompany, SiteCompanyErrors, SiteCompanyFormValues } from '@admin/content/model';

/** The side panel of «Контакти та компанія»: opens as a form filled from the saved facts. */
export function useSiteCompanyEditor(company: SiteCompany, onDone: (text: string) => void) {
  const [values, setValues] = useState<SiteCompanyFormValues>(() => siteCompanyFormOf(company));
  const [errors, setErrors] = useState<SiteCompanyErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [save, saving] = useSaveSiteCompanyMutation();

  async function submit() {
    const found = validateSiteCompany(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setMessage('Виправте позначені поля.');
      return;
    }
    setMessage(null);
    try {
      await save(siteCompanyInputOf(company.revision, values)).unwrap();
      onDone('Контакти збережено. Сайт покаже їх протягом кількох хвилин.');
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти контакти.'));
    }
  }

  return { values, errors, message, saving: saving.isLoading, change: setValues, submit };
}
