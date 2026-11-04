import { ReferenceFormSection } from '@admin/references/ui';
import { Autocomplete, Stack, TextField } from '@mui/material';

import type { SewingOperationFieldErrors, SewingOperationFormValues } from '@admin/products/model';
import type { GarmentPartOperation } from '@admin/references/model';

interface Props {
  values: SewingOperationFormValues;
  errors: SewingOperationFieldErrors;
  operations: readonly GarmentPartOperation[];
  readOnly: boolean;
  disabled: boolean;
  onChange: (values: SewingOperationFormValues) => void;
}

const minutes = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });
const label = (operation: GarmentPartOperation) =>
  [operation.code, operation.garmentPartName, operation.name].filter(Boolean).join(' · ');

/**
 * Fields of the «Операція» side panel of «Трудовитрати». Manual time is optional: empty means the
 * norm of the reference «Операції».
 */
export function SewingOperationForm({
  values,
  errors,
  operations,
  readOnly,
  disabled,
  onChange,
}: Props) {
  const options = operations.filter((item) => item.isActive || item.id === values.operationId);
  const selected = operations.find((item) => item.id === values.operationId) ?? null;
  const norm = selected
    ? selected.minutesPerProduct
      ? 'У довіднику немає норми: вкажіть час вручну.'
      : `Норма з довідника: ${minutes.format(selected.min)} хв.`
    : undefined;
  const input = { readOnly };
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Операція">
        <Autocomplete
          options={options}
          value={selected}
          getOptionLabel={label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_event, option) => onChange({ ...values, operationId: option?.id ?? null })}
          readOnly={readOnly}
          disabled={disabled}
          noOptionsText="Операцію не знайдено"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Операція"
              required
              error={Boolean(errors.operationId)}
              helperText={errors.operationId ?? norm ?? 'Пошук за назвою, деталлю або кодом OP.'}
            />
          )}
        />
        <TextField
          label="Кількість"
          value={values.quantity}
          onChange={(event) => onChange({ ...values, quantity: event.target.value })}
          required
          error={Boolean(errors.quantity)}
          helperText={errors.quantity ?? 'Скільки разів операція робиться на 1 виріб.'}
          disabled={disabled}
          slotProps={{ input, htmlInput: { inputMode: 'decimal' } }}
        />
        <TextField
          label="Ручний час, хв"
          value={values.manualMinutes}
          onChange={(event) => onChange({ ...values, manualMinutes: event.target.value })}
          error={Boolean(errors.manualMinutes)}
          helperText={errors.manualMinutes ?? 'Залиште порожнім, щоб узяти норму з довідника.'}
          disabled={disabled}
          slotProps={{ input, htmlInput: { inputMode: 'decimal' } }}
        />
        <TextField
          label="Коментар"
          value={values.comment}
          onChange={(event) => onChange({ ...values, comment: event.target.value })}
          error={Boolean(errors.comment)}
          helperText={errors.comment}
          disabled={disabled}
          multiline
          minRows={2}
          slotProps={{ input, htmlInput: { maxLength: 500 } }}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
