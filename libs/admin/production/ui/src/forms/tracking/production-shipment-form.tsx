import { Stack, TextField } from '@mui/material';

import type {
  ProductionShipmentErrors,
  ProductionShipmentFormValues,
} from '@admin/production/model';

interface Props {
  values: ProductionShipmentFormValues;
  errors: ProductionShipmentErrors;
  remaining: number;
  disabled: boolean;
  onChange: (values: ProductionShipmentFormValues) => void;
}

export function ProductionShipmentForm({ values, errors, remaining, disabled, onChange }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <TextField
        label="Кількість, шт."
        required
        value={values.quantity}
        error={Boolean(errors.quantity)}
        helperText={errors.quantity ?? `Залишилось ${remaining} шт.`}
        disabled={disabled}
        slotProps={{ htmlInput: { inputMode: 'numeric' } }}
        onChange={(event) => onChange({ ...values, quantity: event.target.value })}
      />
      <TextField
        label="Дата відвантаження"
        type="date"
        required
        value={values.shippedOn}
        error={Boolean(errors.shippedOn)}
        helperText={errors.shippedOn}
        disabled={disabled}
        slotProps={{ inputLabel: { shrink: true } }}
        onChange={(event) => onChange({ ...values, shippedOn: event.target.value })}
      />
      <TextField
        label="Коментар"
        multiline
        minRows={2}
        value={values.comment}
        error={Boolean(errors.comment)}
        helperText={errors.comment}
        disabled={disabled}
        onChange={(event) => onChange({ ...values, comment: event.target.value })}
      />
    </Stack>
  );
}
