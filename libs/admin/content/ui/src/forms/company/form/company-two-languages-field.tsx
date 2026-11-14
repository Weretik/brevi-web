import { Box, TextField } from '@mui/material';

import { companyFormGrid } from './company-form-grid';

import type { CompanyText } from '@admin/content/model';

interface Props {
  label: string;
  value: CompanyText;
  error: string | undefined;
  disabled: boolean;
  onChange: (value: CompanyText) => void;
}

/** One text of the site in Ukrainian and Russian side by side. */
export function CompanyTwoLanguagesField({ label, value, error, disabled, onChange }: Props) {
  return (
    <Box sx={companyFormGrid}>
      <TextField
        label={`${label} (укр.)`}
        value={value.uk}
        disabled={disabled}
        error={Boolean(error)}
        helperText={error}
        onChange={(event) => onChange({ ...value, uk: event.target.value })}
      />
      <TextField
        label={`${label} (рос.)`}
        value={value.ru}
        disabled={disabled}
        error={Boolean(error)}
        onChange={(event) => onChange({ ...value, ru: event.target.value })}
      />
    </Box>
  );
}
