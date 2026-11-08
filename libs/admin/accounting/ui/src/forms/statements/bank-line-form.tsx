import { financeTransactionLimits } from '@admin/accounting/model';
import { FormControlLabel, Stack, Switch, TextField } from '@mui/material';

import { FinanceCounterpartyPicker } from '../counterparties/finance-counterparty-picker';
import { FinanceCategoryFields } from '../transactions/finance-category-fields';

import type { FinanceNamedChoice } from '../transactions/finance-category-fields';
import type { FinanceCounterpartySearch } from '../transactions/finance-counterparty-fields';
import type {
  BankLineField,
  BankLineFieldErrors,
  BankLineFormValues,
} from '@admin/accounting/model';

interface Props {
  values: BankLineFormValues;
  errors: BankLineFieldErrors;
  /** A transfer between own accounts has only the note and «Проводити». */
  transfer: boolean;
  /** An error or a record already in the books: «Проводити» stays off. */
  locked: boolean;
  roots: FinanceNamedChoice[];
  children: FinanceNamedChoice[];
  counterpartySearch: FinanceCounterpartySearch;
  onChange: <Field extends BankLineField>(field: Field, value: BankLineFormValues[Field]) => void;
}

/** The director's part of a statement line: who it is with, category, texts and «Проводити». */
export function BankLineForm({
  values,
  errors,
  transfer,
  locked,
  roots,
  children,
  counterpartySearch,
  onChange,
}: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={!values.excluded}
            disabled={locked}
            onChange={(event) => onChange('excluded', !event.target.checked)}
          />
        }
        label="Проводити цей рядок"
      />
      {!transfer && (
        <>
          <FormControlLabel
            control={
              <Switch
                checked={values.oneoff}
                onChange={(event) => onChange('oneoff', event.target.checked)}
              />
            }
            label="Разовий контрагент — лише назва для цієї операції"
          />
          {values.oneoff ? (
            <TextField
              label="Назва разового контрагента"
              value={values.oneoffName}
              onChange={(event) => onChange('oneoffName', event.target.value)}
              error={Boolean(errors.oneoffName)}
              helperText={errors.oneoffName}
              slotProps={{ htmlInput: { maxLength: financeTransactionLimits.oneoffName } }}
              fullWidth
            />
          ) : (
            <FinanceCounterpartyPicker
              {...counterpartySearch}
              value={values.counterparty}
              error={errors.counterparty}
              onChange={(choice) => onChange('counterparty', choice)}
            />
          )}
          <FinanceCategoryFields
            rootId={values.rootId}
            subcategoryId={values.subcategoryId}
            roots={roots}
            children={children}
            error={errors.rootId}
            optional
            onRootChange={(id) => onChange('rootId', id)}
            onSubcategoryChange={(id) => onChange('subcategoryId', id)}
          />
          <TextField
            label="Опис"
            value={values.description}
            onChange={(event) => onChange('description', event.target.value)}
            helperText="Призначення платежу з банку зберігається в операції окремо."
            slotProps={{ htmlInput: { maxLength: financeTransactionLimits.description } }}
            fullWidth
          />
        </>
      )}
      <TextField
        label="Примітка"
        value={values.comment}
        onChange={(event) => onChange('comment', event.target.value)}
        multiline
        minRows={2}
        slotProps={{ htmlInput: { maxLength: financeTransactionLimits.comment } }}
        fullWidth
      />
    </Stack>
  );
}
