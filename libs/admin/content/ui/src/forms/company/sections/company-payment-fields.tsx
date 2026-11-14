import { Box, TextField } from '@mui/material';

import { companyFormGrid } from '../company-form-grid';
import { CompanyFormTitle } from '../company-form-title';
import { CompanyTwoLanguagesField } from '../company-two-languages-field';

import type { CompanyFormSectionProps } from './company-form-section';

/** «Реквізити для оплати»: recipient, ЄДРПОУ, IBAN and bank. */
export function CompanyPaymentFields({ values, errors, disabled, set }: CompanyFormSectionProps) {
  return (
    <>
      <CompanyFormTitle>Реквізити для оплати</CompanyFormTitle>
      <CompanyTwoLanguagesField
        label="Отримувач"
        value={values.recipient}
        error={errors['recipient']}
        disabled={disabled}
        onChange={(value) => set('recipient', value)}
      />
      <Box sx={companyFormGrid}>
        <TextField
          label="ЄДРПОУ"
          value={values.edrpou}
          disabled={disabled}
          error={Boolean(errors['edrpou'])}
          helperText={errors['edrpou']}
          onChange={(event) => set('edrpou', event.target.value)}
        />
        <TextField
          label="IBAN"
          value={values.iban}
          disabled={disabled}
          error={Boolean(errors['iban'])}
          helperText={errors['iban']}
          slotProps={{ htmlInput: { spellCheck: false } }}
          onChange={(event) => set('iban', event.target.value)}
        />
      </Box>
      <CompanyTwoLanguagesField
        label="Банк"
        value={values.bank}
        error={errors['bank']}
        disabled={disabled}
        onChange={(value) => set('bank', value)}
      />
    </>
  );
}
