import { MenuItem, Stack, TextField } from '@mui/material';

import type { IssuerSettingsDraft } from '@admin/clients/model';

type Errors = Partial<Record<keyof IssuerSettingsDraft, string>>;

export function IssuerSettingsFields({
  value,
  errors,
  disabled,
  onChange,
}: {
  value: IssuerSettingsDraft;
  errors: Errors;
  disabled: boolean;
  onChange: (value: IssuerSettingsDraft) => void;
}) {
  const fields = [
    ['legalName', 'Юридична назва продавця', 200, true],
    ['edrpou', 'Код ЄДРПОУ продавця', 50, true],
    ['taxId', 'Податковий номер продавця', 50, true],
    ['iban', 'IBAN продавця', 80, true],
    ['address', 'Адреса продавця', 500, true],
    ['phone', 'Телефон продавця', 80, true],
    ['email', 'Email продавця', 200, true],
    ['site', 'Сайт продавця (HTTPS)', 500, true],
    ['bankName', 'Назва банку (необов’язково)', 200, false],
    ['mfo', 'МФО (необов’язково)', 20, false],
  ] as const;
  return (
    <Stack spacing={2}>
      {fields.map(([field, label, maxLength, required]) => (
        <TextField
          key={field}
          label={label}
          required={required}
          value={value[field]}
          disabled={disabled}
          error={!!errors[field]}
          helperText={errors[field]}
          slotProps={{ htmlInput: { maxLength } }}
          onChange={(event) => onChange({ ...value, [field]: event.target.value })}
        />
      ))}
      <TextField
        select
        label="Логотип у документі"
        value={value.logoAssetKey}
        disabled={disabled}
        error={!!errors.logoAssetKey}
        helperText={errors.logoAssetKey}
        onChange={(event) =>
          onChange({
            ...value,
            logoAssetKey: event.target.value as IssuerSettingsDraft['logoAssetKey'],
          })
        }
      >
        <MenuItem value="">Без логотипа</MenuItem>
        <MenuItem value="brevi-wordmark">Brevi</MenuItem>
      </TextField>
    </Stack>
  );
}
