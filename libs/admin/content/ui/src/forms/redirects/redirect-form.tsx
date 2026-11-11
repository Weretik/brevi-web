import { redirectLimits } from '@admin/content/model';
import { Stack, TextField } from '@mui/material';

import type { RedirectErrors, RedirectFormValues } from '@admin/content/model';

interface Props {
  values: RedirectFormValues;
  errors: RedirectErrors;
  disabled: boolean;
  onChange: (values: RedirectFormValues) => void;
}

/** Old address, page of the new site and a note; full links may be pasted, the server keeps the path. */
export function RedirectForm({ values, errors, disabled, onChange }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <TextField
        label="Стара адреса"
        required
        value={values.fromPath}
        disabled={disabled}
        error={Boolean(errors.fromPath)}
        helperText={
          errors.fromPath ?? 'Наприклад /specodyag-litnij або повне посилання старого сайту.'
        }
        onChange={(event) => onChange({ ...values, fromPath: event.target.value })}
      />
      <TextField
        label="Нова сторінка"
        required
        value={values.toPath}
        disabled={disabled}
        error={Boolean(errors.toPath)}
        helperText={errors.toPath ?? 'Сторінка нового сайту, наприклад /uk/catalog/kostyumy.'}
        onChange={(event) => onChange({ ...values, toPath: event.target.value })}
      />
      <TextField
        label="Примітка"
        value={values.note}
        disabled={disabled}
        error={Boolean(errors.note)}
        helperText={errors.note ?? 'Для себе: що це була за сторінка.'}
        slotProps={{ htmlInput: { maxLength: redirectLimits.note } }}
        onChange={(event) => onChange({ ...values, note: event.target.value })}
      />
    </Stack>
  );
}
