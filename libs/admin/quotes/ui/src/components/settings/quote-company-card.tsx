import { Box } from '@mui/material';

import {
  QuoteSettingsCard,
  QuoteSettingsField,
  QuoteSettingsGrid,
  errorsAt,
} from './quote-settings-fields';

import type { QuoteImageFieldRender } from './quote-settings-fields';
import type { QuoteCompanyDraft, QuoteSettingsErrors } from '@admin/quotes/model';

interface Props {
  company: QuoteCompanyDraft;
  errors: QuoteSettingsErrors;
  imageField: QuoteImageFieldRender;
  onChange: (patch: Partial<QuoteCompanyDraft>) => void;
}

/** «Реквізити та контакти Brevi»: the PDF header and footer. */
export function QuoteCompanyCard({ company, errors, imageField, onChange }: Props) {
  const at = errorsAt(errors, 'company');
  return (
    <QuoteSettingsCard
      title="Реквізити та контакти Brevi"
      description="Шапка і нижня частина PDF кожного КП."
    >
      <QuoteSettingsGrid columns={3}>
        <QuoteSettingsField
          required
          wide
          label="Повна назва підприємства"
          value={company.name}
          error={at('name')}
          onChange={(name) => onChange({ name })}
        />
        <QuoteSettingsField
          label="ЄДРПОУ"
          value={company.edrpou}
          error={at('edrpou')}
          onChange={(edrpou) => onChange({ edrpou })}
        />
        <QuoteSettingsField
          label="ІПН"
          value={company.taxId}
          error={at('taxId')}
          onChange={(taxId) => onChange({ taxId })}
        />
        <QuoteSettingsField
          label="IBAN"
          value={company.iban}
          error={at('iban')}
          onChange={(iban) => onChange({ iban })}
        />
        <QuoteSettingsField
          wide
          label="Адреса"
          value={company.address}
          error={at('address')}
          onChange={(address) => onChange({ address })}
        />
        <QuoteSettingsField
          label="Телефон"
          value={company.phone}
          error={at('phone')}
          onChange={(phone) => onChange({ phone })}
        />
        <QuoteSettingsField
          label="Email"
          value={company.email}
          error={at('email')}
          onChange={(email) => onChange({ email })}
        />
        <QuoteSettingsField
          label="Сайт"
          value={company.site}
          error={at('site')}
          onChange={(site) => onChange({ site })}
        />
      </QuoteSettingsGrid>
      <Box sx={{ mt: 1.5 }}>
        {imageField({
          label: 'Логотип у КП',
          value: company.logoUrl,
          error: at('logoUrl'),
          onChange: (logoUrl) => onChange({ logoUrl }),
        })}
      </Box>
    </QuoteSettingsCard>
  );
}
