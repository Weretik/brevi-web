import { ReferenceFormSection } from '@admin/references/ui';
import { formatMeters } from '@admin/warehouse/model';
import { Alert, Stack, TextField } from '@mui/material';

import type {
  FabricAdjustmentErrors,
  FabricAdjustmentFormValues,
  FabricStockPair,
} from '@admin/warehouse/model';

interface Props {
  values: FabricAdjustmentFormValues;
  errors: FabricAdjustmentErrors;
  pair: FabricStockPair;
  /** The change it will record; null until the total is a number. */
  delta: number | null;
  disabled: boolean;
  onChange: (values: FabricAdjustmentFormValues) => void;
}

/** «Уточнити»: the counted total of a fabric and colour, not the change, with a reason. */
export function FabricAdjustmentForm({ values, errors, pair, delta, disabled, onChange }: Props) {
  const set = (patch: Partial<FabricAdjustmentFormValues>) => onChange({ ...values, ...patch });
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title={`${pair.fabric.fabricCode} · ${pair.fabric.fabricName}`}>
        <TextField label="Колір" value={pair.color.color} disabled />
        <TextField label="На складі зараз" value={formatMeters(pair.color.meters)} disabled />
        <TextField
          label="Фактичний залишок, м"
          required
          value={values.targetMeters}
          error={Boolean(errors.targetMeters)}
          helperText={errors.targetMeters ?? 'Скільки є насправді, до двох знаків після коми.'}
          disabled={disabled}
          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          onChange={(event) => set({ targetMeters: event.target.value })}
        />
        {delta !== null && delta !== 0 && !errors.targetMeters && (
          <Alert severity="info">
            Буде записано уточнення {delta > 0 ? '+' : '−'}
            {formatMeters(Math.abs(delta))}.
          </Alert>
        )}
        <TextField
          label="Дата операції"
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
          value={values.reason}
          error={Boolean(errors.reason)}
          helperText={errors.reason ?? 'Від 3 до 500 символів, залишиться в історії.'}
          disabled={disabled}
          onChange={(event) => set({ reason: event.target.value })}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
