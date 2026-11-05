import {
  categoryDirections,
  financeTransactionLimits,
  transactionTypeLabels,
} from '@admin/accounting/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';

import { FinanceCategoryFields } from './finance-category-fields';
import { FinanceCounterpartyFields } from './finance-counterparty-fields';

import type { FinanceNamedChoice } from './finance-category-fields';
import type { FinanceCounterpartySearch } from './finance-counterparty-fields';
import type {
  CategoryDirection,
  FinanceTransactionField,
  FinanceTransactionFieldErrors,
  FinanceTransactionFormValues,
} from '@admin/accounting/model';

interface Props {
  values: FinanceTransactionFormValues;
  errors: FinanceTransactionFieldErrors;
  /** Accounts the operation may use, with the currency in the name. */
  accounts: FinanceNamedChoice[];
  roots: FinanceNamedChoice[];
  children: FinanceNamedChoice[];
  counterpartySearch: FinanceCounterpartySearch;
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
  counterpartySearch,
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
        <FinanceCategoryFields
          rootId={values.rootId}
          subcategoryId={values.subcategoryId}
          roots={roots}
          children={children}
          error={errors.rootId}
          onRootChange={(id) => onChange('rootId', id)}
          onSubcategoryChange={(id) => onChange('subcategoryId', id)}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Контрагент">
        <FinanceCounterpartyFields
          values={values}
          errors={errors}
          search={counterpartySearch}
          onChange={onChange}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Подробиці">
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
