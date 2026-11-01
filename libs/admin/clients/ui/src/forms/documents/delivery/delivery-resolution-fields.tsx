import { MenuItem, Stack, TextField } from '@mui/material';

import type { DeliveryResolutionDraft, DeliveryResolutionErrors } from '@admin/clients/model';

export function DeliveryResolutionFields({
  value,
  errors,
  locked,
  onChange,
}: {
  value: DeliveryResolutionDraft;
  errors: DeliveryResolutionErrors;
  locked: boolean;
  onChange: (value: DeliveryResolutionDraft) => void;
}) {
  return (
    <Stack spacing={2}>
      <TextField
        select
        label="Перевірений результат"
        value={value.outcome}
        disabled={locked}
        error={!!errors.outcome}
        helperText={errors.outcome}
        onChange={(event) =>
          onChange({
            ...value,
            outcome: event.target.value as DeliveryResolutionDraft['outcome'],
          })
        }
      >
        <MenuItem value="" disabled>
          Оберіть результат
        </MenuItem>
        <MenuItem value="sent">Підтверджено надсилання</MenuItem>
        <MenuItem value="not_sent">Підтверджено ненадсилання</MenuItem>
      </TextField>
      <TextField
        label="Що перевірено"
        value={value.evidenceNote}
        multiline
        minRows={3}
        disabled={locked}
        error={!!errors.evidenceNote}
        helperText={
          errors.evidenceNote ?? 'Опишіть підставу висновку. Автор і час збережуться в історії.'
        }
        slotProps={{ htmlInput: { maxLength: 1000 } }}
        onChange={(event) => onChange({ ...value, evidenceNote: event.target.value })}
      />
    </Stack>
  );
}
