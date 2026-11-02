import { fabricTextLimits, suggestFabricProposalDescription } from '@admin/references/model';
import { Button, FormControlLabel, Stack, Switch, TextField } from '@mui/material';

import { ReferenceFormSection } from '../reference-editor/reference-form-section';
import { ReferenceSupplierSelect } from '../reference-editor/reference-supplier-select';

import type {
  FabricField,
  FabricFieldErrors,
  FabricFormValues,
  Supplier,
} from '@admin/references/model';

interface Props {
  creating: boolean;
  values: FabricFormValues;
  errors: FabricFieldErrors;
  suppliers: Supplier[];
  suppliersLoading: boolean;
  supplierError: string | null;
  onChange: (field: FabricField, value: string | boolean) => void;
  onRetrySuppliers: () => void;
}

type FabricTextField = Exclude<FabricField, 'isActive'>;

export function FabricForm({
  creating,
  values,
  errors,
  suppliers,
  suppliersLoading,
  supplierError,
  onChange,
  onRetrySuppliers,
}: Props) {
  const text = (field: FabricTextField, label: string, extra: { multiline?: boolean } = {}) => (
    <TextField
      label={label}
      value={values[field]}
      onChange={(event) => onChange(field, event.target.value)}
      error={Boolean(errors[field])}
      helperText={errors[field]}
      multiline={extra.multiline}
      minRows={extra.multiline ? 2 : undefined}
      slotProps={{
        htmlInput: {
          maxLength: fabricTextLimits[field as keyof typeof fabricTextLimits],
        },
      }}
      fullWidth
    />
  );
  const suggestion = suggestFabricProposalDescription(values);

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
            placeholder="FAB-087"
            value={values.code}
            onChange={(event) => onChange('code', event.target.value)}
            error={Boolean(errors.code)}
            helperText={errors.code ?? 'Код з таблиці калькулятора'}
            slotProps={{ htmlInput: { maxLength: fabricTextLimits.code } }}
            fullWidth
          />
        </Stack>
        {text('name', 'Назва (UA)')}
        {text('nameRu', 'Назва (RU)')}
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
          value={values.providerName}
          error={errors.providerName}
          suppliers={suppliers}
          loading={suppliersLoading}
          loadError={supplierError}
          onChange={(value) => onChange('providerName', value)}
          onRetry={onRetrySuppliers}
        />
        <TextField
          label="Ціна за 1 м, грн"
          type="number"
          value={values.price}
          onChange={(event) => onChange('price', event.target.value)}
          error={Boolean(errors.price)}
          helperText={errors.price ?? 'Дата ціни оновиться сама, коли ціна зміниться'}
          slotProps={{ htmlInput: { min: 0, max: 10000, step: '0.01' } }}
          fullWidth
        />
      </ReferenceFormSection>

      <ReferenceFormSection title="Характеристики">
        {text('composition', 'Склад (UA)')}
        {text('compositionRu', 'Склад (RU)')}
        {text('density', 'Щільність, г/м²')}
      </ReferenceFormSection>

      <ReferenceFormSection title="Для КП і нотатки">
        {text('proposalDescription', 'Короткий опис для КП', { multiline: true })}
        {suggestion && suggestion !== values.proposalDescription.trim() && (
          <Button
            type="button"
            size="small"
            sx={{ alignSelf: 'flex-start' }}
            onClick={() => onChange('proposalDescription', suggestion)}
          >
            Заповнити зі складу та щільності
          </Button>
        )}
        {text('comment', 'Коментар', { multiline: true })}
      </ReferenceFormSection>
    </Stack>
  );
}
