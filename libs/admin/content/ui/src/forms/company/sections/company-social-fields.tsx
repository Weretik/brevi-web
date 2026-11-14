import { TextField } from '@mui/material';

import { CompanyFormTitle } from '../company-form-title';

import type { CompanyFormSectionProps } from './company-form-section';

/** «Соцмережі»: full profile addresses; empty shows only the name on the site. */
export function CompanySocialFields({ values, errors, disabled, set }: CompanyFormSectionProps) {
  return (
    <>
      <CompanyFormTitle>Соцмережі</CompanyFormTitle>
      {(['instagram', 'youtube', 'facebook'] as const).map((key) => (
        <TextField
          key={key}
          label={{ instagram: 'Instagram', youtube: 'YouTube', facebook: 'Facebook' }[key]}
          value={values[key]}
          disabled={disabled}
          error={Boolean(errors[key])}
          helperText={
            errors[key] ?? 'Повна адреса профілю. Порожньо: на сайті лише назва без посилання.'
          }
          slotProps={{ htmlInput: { spellCheck: false } }}
          onChange={(event) => set(key, event.target.value)}
        />
      ))}
    </>
  );
}
