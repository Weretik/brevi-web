import { MenuItem, Stack, TextField } from '@mui/material';

import type { CustomConfiguration } from '@admin/clients/model';

export function CustomIdentityFields({
  value,
  disabled,
  errors,
  onChange,
}: {
  value: CustomConfiguration;
  disabled: boolean;
  errors: Record<string, string>;
  onChange: (value: CustomConfiguration) => void;
}) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Назва конфігурації"
        required
        value={value.name}
        disabled={disabled}
        error={!!errors['name']}
        helperText={errors['name']}
        onChange={(event) => onChange({ ...value, name: event.target.value })}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Тип виробу"
          required
          value={value.productType}
          disabled={disabled}
          error={!!errors['productType']}
          helperText={errors['productType']}
          onChange={(event) => onChange({ ...value, productType: event.target.value })}
        />
        <TextField
          select
          label="Сезон"
          value={value.season}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...value, season: event.target.value as 'summer' | 'winter' })
          }
        >
          <MenuItem value="summer">Літо</MenuItem>
          <MenuItem value="winter">Зима</MenuItem>
        </TextField>
      </Stack>
      {(['description', 'clientComment', 'internalNote'] as const).map((field) => (
        <TextField
          key={field}
          multiline
          minRows={2}
          label={
            {
              description: 'Опис для клієнта',
              clientComment: 'Коментар для клієнта',
              internalNote: 'Приватна нотатка',
            }[field]
          }
          value={value[field]}
          disabled={disabled}
          error={!!errors[field]}
          helperText={errors[field]}
          onChange={(event) => onChange({ ...value, [field]: event.target.value })}
        />
      ))}
    </Stack>
  );
}
