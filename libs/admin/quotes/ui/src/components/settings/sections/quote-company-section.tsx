import { Box } from '@mui/material';

import { QuoteSettingsField } from '../form/quote-settings-field';
import { QuoteSettingsGroup, QuoteSettingsGrid, errorsAt } from '../form/quote-settings-layout';

import type { QuoteImageFieldRender } from '../form/quote-settings-layout';
import type { QuoteCompanyDraft, QuoteSettingsErrors } from '@admin/quotes/model';

interface Props {
  company: QuoteCompanyDraft;
  saved: QuoteCompanyDraft;
  errors: QuoteSettingsErrors;
  imageField: QuoteImageFieldRender;
  onChange: (patch: Partial<QuoteCompanyDraft>) => void;
}

type Key = Exclude<keyof QuoteCompanyDraft, 'logoUrl'>;

const requisites: { key: Key; label: string; required?: boolean; wide?: boolean }[] = [
  { key: 'name', label: 'Повна назва підприємства', required: true, wide: true },
  { key: 'edrpou', label: 'ЄДРПОУ' },
  { key: 'taxId', label: 'ІПН' },
  { key: 'iban', label: 'IBAN', wide: true },
];

const contacts: { key: Key; label: string; wide?: boolean }[] = [
  { key: 'address', label: 'Адреса', wide: true },
  { key: 'phone', label: 'Телефон' },
  { key: 'email', label: 'Email' },
  { key: 'site', label: 'Сайт', wide: true },
];

/** «Компанія»: requisites and contacts of the PDF header and footer, and the logo. */
export function QuoteCompanySection({ company, saved, errors, imageField, onChange }: Props) {
  const at = errorsAt(errors, 'company');
  const field = ({ key, label, required, wide }: (typeof requisites)[number]) => (
    <QuoteSettingsField
      key={key}
      path={`company.${key}`}
      label={label}
      required={required}
      wide={wide}
      value={company[key]}
      saved={saved[key]}
      error={at(key)}
      onChange={(value) => onChange({ [key]: value })}
    />
  );
  return (
    <>
      <QuoteSettingsGroup title="Реквізити">
        <QuoteSettingsGrid>{requisites.map(field)}</QuoteSettingsGrid>
      </QuoteSettingsGroup>
      <QuoteSettingsGroup title="Контакти">
        <QuoteSettingsGrid>{contacts.map(field)}</QuoteSettingsGrid>
      </QuoteSettingsGroup>
      <QuoteSettingsGroup title="Логотип">
        <Box>
          {imageField({
            label: 'Логотип у КП',
            value: company.logoUrl,
            error: at('logoUrl'),
            onChange: (logoUrl) => onChange({ logoUrl }),
          })}
        </Box>
      </QuoteSettingsGroup>
    </>
  );
}
