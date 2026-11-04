import { formatMeters, parseStockMeters } from '@admin/production/model';
import { Stack, TextField, Typography } from '@mui/material';

import type { FabricCorrectionErrors, FabricCorrectionFormValues } from '@admin/production/model';

interface Props {
  values: FabricCorrectionFormValues;
  errors: FabricCorrectionErrors;
  /** The balance now. */
  meters: number;
  disabled: boolean;
  onChange: (values: FabricCorrectionFormValues) => void;
}

/** «Коригування»: what was counted on the shelf and why it differs. */
export function FabricCorrectionForm({ values, errors, meters, disabled, onChange }: Props) {
  const counted = parseStockMeters(values.countedMeters);
  const delta = counted === null ? null : Math.round((counted - meters) * 100) / 100;
  const set = (patch: Partial<FabricCorrectionFormValues>) => onChange({ ...values, ...patch });
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        На складі зараз {formatMeters(meters)}.
        {delta !== null && delta !== 0 && ` Зміна ${delta > 0 ? '+' : ''}${formatMeters(delta)}.`}
      </Typography>
      <TextField
        label="Пораховано, м"
        required
        value={values.countedMeters}
        error={Boolean(errors.countedMeters)}
        helperText={errors.countedMeters ?? 'Скільки метрів насправді на полиці.'}
        disabled={disabled}
        slotProps={{ htmlInput: { inputMode: 'decimal' } }}
        onChange={(event) => set({ countedMeters: event.target.value })}
      />
      <TextField
        label="Дата"
        type="date"
        required
        value={values.operationDate}
        error={Boolean(errors.operationDate)}
        helperText={errors.operationDate}
        disabled={disabled}
        slotProps={{ inputLabel: { shrink: true } }}
        onChange={(event) => set({ operationDate: event.target.value })}
      />
      <TextField
        label="Причина"
        required
        multiline
        minRows={2}
        value={values.note}
        error={Boolean(errors.note)}
        helperText={errors.note ?? 'Наприклад: перерахунок, брак, залишок після крою.'}
        disabled={disabled}
        onChange={(event) => set({ note: event.target.value })}
      />
    </Stack>
  );
}
