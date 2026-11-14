import { Stack } from '@mui/material';

import { CompanyContactFields } from './sections/company-contact-fields';
import { CompanyManagersFields } from './sections/company-managers-fields';
import { CompanyPaymentFields } from './sections/company-payment-fields';
import { CompanySocialFields } from './sections/company-social-fields';

import type { SiteCompanyErrors, SiteCompanyFormValues } from '@admin/content/model';

interface Props {
  values: SiteCompanyFormValues;
  errors: SiteCompanyErrors;
  disabled: boolean;
  onChange: (values: SiteCompanyFormValues) => void;
  /** Opens the «Фото» library for the photo of the manager at this place. */
  onPickPhoto: (index: number) => void;
  onAddManager: () => void;
}

/** The form of «Контакти та компанія»: phones may be typed in any form, the site shows them as 050 469 86 75. */
export function SiteCompanyForm({
  values,
  errors,
  disabled,
  onChange,
  onPickPhoto,
  onAddManager,
}: Props) {
  const section = {
    values,
    errors,
    disabled,
    set: <K extends keyof SiteCompanyFormValues>(key: K, value: SiteCompanyFormValues[K]) =>
      onChange({ ...values, [key]: value }),
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <CompanyContactFields {...section} />
      <CompanyManagersFields {...section} onPickPhoto={onPickPhoto} onAddManager={onAddManager} />
      <CompanyPaymentFields {...section} />
      <CompanySocialFields {...section} />
    </Stack>
  );
}
