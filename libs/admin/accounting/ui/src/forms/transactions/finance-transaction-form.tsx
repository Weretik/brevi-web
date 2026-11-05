import {
  categoryDirections,
  financeTransactionLimits,
  transactionTypeLabels,
} from '@admin/accounting/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';

import type {
  CategoryDirection,
  FinanceTransactionField,
  FinanceTransactionFieldErrors,
  FinanceTransactionFormValues,
} from '@admin/accounting/model';

interface Choice {
  id: string;
  name: string;
}

interface Props {
  values: FinanceTransactionFormValues;
  errors: FinanceTransactionFieldErrors;
  /** Accounts the operation may use, with the currency in the name. */
  accounts: Choice[];
  roots: Choice[];
  children: Choice[];
  /** Only for a new operation: keep the form open for the next one. */
  addNext?: { checked: boolean; onChange: (checked: boolean) => void };
  onChange: <Field extends FinanceTransactionField>(
    field: Field,
    value: FinanceTransactionFormValues[Field],
  ) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** Income or expense form of the side panel. */
export function FinanceTransactionForm({
  values,
  errors,
  accounts,
  roots,
  children,
  addNext,
  onChange,
}: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Операція">
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            select
            label="Тип"
            value={values.type}
            onChange={(event) => onChange('type', event.target.value as CategoryDirection)}
            fullWidth
          >
            {categoryDirections.map((type) => (
              <MenuItem key={type} value={type}>
                {transactionTypeLabels[type]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Дата"
            type="date"
            value={values.date}
            onChange={(event) => onChange('date', event.target.value)}
            error={Boolean(errors.date)}
            helperText={errors.date}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { style: mono } }}
            fullWidth
          />
        </Stack>
        <TextField
          select
          label="Рахунок"
          value={values.accountId}
          onChange={(event) => onChange('accountId', event.target.value)}
          error={Boolean(errors.accountId)}
          helperText={errors.accountId}
          fullWidth
        >
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Сума, грн"
          placeholder="1 250,40"
          value={values.amount}
          onChange={(event) => onChange('amount', event.target.value)}
          error={Boolean(errors.amount)}
          helperText={errors.amount}
          slotProps={{
            htmlInput: { inputMode: 'decimal', style: { ...mono, textAlign: 'right' } },
          }}
          fullWidth
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Категорія">
        <TextField
          select
          label="Категорія"
          value={values.rootId}
          onChange={(event) => onChange('rootId', event.target.value)}
          error={Boolean(errors.rootId)}
          helperText={
            errors.rootId ?? (roots.length ? undefined : 'Спершу додайте категорію в «Категоріях».')
          }
          fullWidth
        >
          {roots.map((root) => (
            <MenuItem key={root.id} value={root.id}>
              {root.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Підкатегорія"
          value={values.subcategoryId}
          disabled={!children.length}
          onChange={(event) => onChange('subcategoryId', event.target.value)}
          fullWidth
        >
          <MenuItem value="">Без підкатегорії</MenuItem>
          {children.map((child) => (
            <MenuItem key={child.id} value={child.id}>
              {child.name}
            </MenuItem>
          ))}
        </TextField>
      </ReferenceFormSection>
      <ReferenceFormSection title="Подробиці">
        <TextField
          label="Разовий контрагент"
          value={values.oneoffName}
          onChange={(event) => onChange('oneoffName', event.target.value)}
          error={Boolean(errors.oneoffName)}
          helperText={
            errors.oneoffName ??
            'Назва лише для цієї операції; довідник контрагентів — на наступному етапі.'
          }
          slotProps={{ htmlInput: { maxLength: financeTransactionLimits.oneoffName } }}
          fullWidth
        />
        <TextField
          label="Опис"
          value={values.description}
          onChange={(event) => onChange('description', event.target.value)}
          error={Boolean(errors.description)}
          helperText={errors.description}
          slotProps={{ htmlInput: { maxLength: financeTransactionLimits.description } }}
          fullWidth
        />
        <TextField
          label="Примітка"
          value={values.comment}
          onChange={(event) => onChange('comment', event.target.value)}
          error={Boolean(errors.comment)}
          helperText={errors.comment}
          multiline
          minRows={2}
          slotProps={{ htmlInput: { maxLength: financeTransactionLimits.comment } }}
          fullWidth
        />
      </ReferenceFormSection>
      {addNext && (
        <FormControlLabel
          control={
            <Switch
              checked={addNext.checked}
              onChange={(event) => addNext.onChange(event.target.checked)}
            />
          }
          label="Після збереження додати наступну з тією ж датою, рахунком і категорією"
        />
      )}
    </Stack>
  );
}
