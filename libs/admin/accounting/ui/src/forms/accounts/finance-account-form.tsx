import {
  financeAccountLimits,
  financeAccountTypeLabels,
  financeAccountTypes,
} from '@admin/accounting/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { MenuItem, Stack, TextField } from '@mui/material';

import type {
  FinanceAccountField,
  FinanceAccountFieldErrors,
  FinanceAccountFormValues,
  FinanceAccountType,
} from '@admin/accounting/model';

interface Props {
  values: FinanceAccountFormValues;
  errors: FinanceAccountFieldErrors;
  onChange: <Field extends FinanceAccountField>(
    field: Field,
    value: FinanceAccountFormValues[Field],
  ) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

export function FinanceAccountForm({ values, errors, onChange }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Рахунок">
        <TextField
          label="Назва"
          placeholder="ПриватБанк ФОП"
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          error={Boolean(errors.name)}
          helperText={errors.name}
          slotProps={{ htmlInput: { maxLength: financeAccountLimits.name } }}
          fullWidth
        />
        <TextField
          select
          label="Тип"
          value={values.type}
          onChange={(event) => onChange('type', event.target.value as FinanceAccountType)}
          fullWidth
        >
          {financeAccountTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {financeAccountTypeLabels[type]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="IBAN"
          value={values.iban}
          onChange={(event) => onChange('iban', event.target.value)}
          error={Boolean(errors.iban)}
          helperText={errors.iban ?? 'Для каси й готівки залиште порожнім.'}
          slotProps={{ htmlInput: { maxLength: financeAccountLimits.iban * 2, style: mono } }}
          fullWidth
        />
        <TextField
          label="Валюта"
          value={values.currency}
          onChange={(event) => onChange('currency', event.target.value)}
          error={Boolean(errors.currency)}
          helperText={errors.currency}
          slotProps={{ htmlInput: { maxLength: 3, style: mono } }}
          fullWidth
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Початковий залишок">
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            label="Сума, грн"
            placeholder="62 546,40"
            value={values.opening}
            onChange={(event) => onChange('opening', event.target.value)}
            error={Boolean(errors.opening)}
            helperText={errors.opening}
            slotProps={{
              htmlInput: { inputMode: 'decimal', style: { ...mono, textAlign: 'right' } },
            }}
            fullWidth
          />
          <TextField
            label="На дату"
            type="date"
            value={values.openingDate}
            onChange={(event) => onChange('openingDate', event.target.value)}
            error={Boolean(errors.openingDate)}
            helperText={errors.openingDate}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { style: mono } }}
            fullWidth
          />
        </Stack>
      </ReferenceFormSection>
      <TextField
        label="Примітка"
        value={values.note}
        onChange={(event) => onChange('note', event.target.value)}
        error={Boolean(errors.note)}
        helperText={errors.note}
        multiline
        minRows={2}
        slotProps={{ htmlInput: { maxLength: financeAccountLimits.note } }}
        fullWidth
      />
    </Stack>
  );
}
