import { ReferenceFormSection } from '@admin/references/ui';
import { Autocomplete, Stack, TextField } from '@mui/material';

import { FabricOfferField, StockColorField } from './fabric-choice-fields';

import type {
  FabricReceiptErrors,
  FabricReceiptFormValues,
  FabricStockChoices,
} from '@admin/warehouse/model';

interface Props {
  values: FabricReceiptFormValues;
  errors: FabricReceiptErrors;
  choices: FabricStockChoices;
  disabled: boolean;
  onChange: (values: FabricReceiptFormValues) => void;
}

/** «Прихід» of the exact offer picked; the supplier is a name, not a required counterparty. */
export function FabricReceiptForm({ values, errors, choices, disabled, onChange }: Props) {
  const set = (patch: Partial<FabricReceiptFormValues>) => onChange({ ...values, ...patch });
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
      <ReferenceFormSection title="Прихід">
        <TextField
          label="Метри"
          required
          value={values.meters}
          error={Boolean(errors.meters)}
          helperText={errors.meters ?? 'До двох знаків після коми.'}
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
          helperText={errors.operationDate ?? 'День, коли тканина реально прийшла.'}
          disabled={disabled}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(event) => set({ operationDate: event.target.value })}
        />
        <Autocomplete
          freeSolo
          options={choices.suppliers}
          inputValue={values.supplierName}
          disabled={disabled}
          onInputChange={(_event, supplierName) => set({ supplierName })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Постачальник"
              error={Boolean(errors.supplierName)}
              helperText={errors.supplierName ?? 'Зі списку або впишіть назву.'}
            />
          )}
        />
        <TextField
          label="Документ"
          placeholder="Накладна № 123"
          value={values.document}
          error={Boolean(errors.document)}
          helperText={errors.document}
          disabled={disabled}
          onChange={(event) => set({ document: event.target.value })}
        />
        <TextField
          label="Коментар"
          multiline
          minRows={2}
          value={values.note}
          error={Boolean(errors.note)}
          helperText={errors.note}
          disabled={disabled}
          onChange={(event) => set({ note: event.target.value })}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
