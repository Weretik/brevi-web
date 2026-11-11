import { ReferenceFormSection } from '@admin/references/ui';
import { Stack, TextField } from '@mui/material';

import { FabricOfferField, StockColorField } from './fabric-choice-fields';

import type {
  FabricOpeningErrors,
  FabricOpeningFormValues,
  FabricStockChoices,
} from '@admin/warehouse/model';

interface Props {
  values: FabricOpeningFormValues;
  errors: FabricOpeningErrors;
  choices: FabricStockChoices;
  disabled: boolean;
  onChange: (values: FabricOpeningFormValues) => void;
}

/** «Початковий залишок»: what already lies on the shelf, once per fabric and colour. */
export function FabricOpeningForm({ values, errors, choices, disabled, onChange }: Props) {
  const set = (patch: Partial<FabricOpeningFormValues>) => onChange({ ...values, ...patch });
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Тканина">
        <FabricOfferField
          choices={choices}
          value={values.fabricId}
          error={errors.fabricId}
          disabled={disabled}
          onChange={(fabricId) => set({ fabricId })}
        />
        <StockColorField
          colors={choices.colors}
          value={values.color}
          error={errors.color}
          disabled={disabled}
          onChange={(color) => set({ color })}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Залишок">
        <TextField
          label="Метри на полиці"
          required
          value={values.meters}
          error={Boolean(errors.meters)}
          helperText={errors.meters ?? 'Можна 0, до двох знаків після коми.'}
          disabled={disabled}
          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          onChange={(event) => set({ meters: event.target.value })}
        />
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
      </ReferenceFormSection>
    </Stack>
  );
}
