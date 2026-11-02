import { garmentAccessoryUnits } from '@admin/references/model';
import { FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';

import { ReferenceFormSection } from '../reference-editor/reference-form-section';
import { ReferenceSupplierSelect } from '../reference-editor/reference-supplier-select';

import type {
  GarmentAccessoryField,
  GarmentAccessoryFieldErrors,
  GarmentAccessoryFormValues,
  Supplier,
} from '@admin/references/model';

interface Props {
  creating: boolean;
  values: GarmentAccessoryFormValues;
  errors: GarmentAccessoryFieldErrors;
  suppliers: Supplier[];
  suppliersLoading: boolean;
  supplierError: string | null;
  onChange: (field: GarmentAccessoryField, value: string | boolean) => void;
  onRetrySuppliers: () => void;
}

export function GarmentAccessoryForm({
  creating,
  values,
  errors,
  suppliers,
  suppliersLoading,
  supplierError,
  onChange,
  onRetrySuppliers,
}: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Основні дані">
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            label="ID"
            type="number"
            value={values.id}
            onChange={(event) => onChange('id', event.target.value)}
            disabled={!creating}
            error={Boolean(errors.id)}
            helperText={errors.id}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            sx={{ width: { sm: 120 } }}
          />
          <TextField
            label="Код"
            placeholder="FUR-044"
            value={values.code}
            onChange={(event) => onChange('code', event.target.value)}
            error={Boolean(errors.code)}
            helperText={errors.code ?? 'Код з таблиці калькулятора'}
            slotProps={{ htmlInput: { maxLength: 20 } }}
            fullWidth
          />
        </Stack>
        <TextField
          label="Назва"
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          error={Boolean(errors.name)}
          helperText={errors.name}
          autoFocus
          fullWidth
        />
        <FormControlLabel
          control={
            <Switch
              checked={values.isActive}
              onChange={(event) => onChange('isActive', event.target.checked)}
            />
          }
          label="Активна"
        />
      </ReferenceFormSection>

      <ReferenceFormSection title="Закупівля">
        <ReferenceSupplierSelect
          value={values.supplierName}
          error={errors.supplierName}
          suppliers={suppliers}
          loading={suppliersLoading}
          loadError={supplierError}
          onChange={(value) => onChange('supplierName', value)}
          onRetry={onRetrySuppliers}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            label="Ціна, грн"
            type="number"
            value={values.price}
            onChange={(event) => onChange('price', event.target.value)}
            error={Boolean(errors.price)}
            helperText={errors.price ?? 'Дата ціни оновиться сама'}
            slotProps={{ htmlInput: { min: 0, max: 10000, step: '0.01' } }}
            fullWidth
          />
          <TextField
            select
            label="Одиниця"
            value={values.unit}
            onChange={(event) => onChange('unit', event.target.value)}
            error={Boolean(errors.unit)}
            helperText={errors.unit}
            sx={{ minWidth: { sm: 160 } }}
          >
            {garmentAccessoryUnits.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </ReferenceFormSection>

      <ReferenceFormSection title="Нотатки">
        <TextField
          label="Коментар"
          value={values.comment}
          onChange={(event) => onChange('comment', event.target.value)}
          error={Boolean(errors.comment)}
          helperText={errors.comment}
          multiline
          minRows={2}
          slotProps={{ htmlInput: { maxLength: 1000 } }}
          fullWidth
        />
      </ReferenceFormSection>
    </Stack>
  );
}
