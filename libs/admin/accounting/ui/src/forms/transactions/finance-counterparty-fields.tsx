import { financeTransactionLimits } from '@admin/accounting/model';
import { FormControlLabel, Switch, TextField } from '@mui/material';

import { FinanceCounterpartyPicker } from '../counterparties/finance-counterparty-picker';

import type { FinanceCounterpartyPickerProps } from '../counterparties/finance-counterparty-picker';
import type {
  FinanceTransactionField,
  FinanceTransactionFieldErrors,
  FinanceTransactionFormValues,
} from '@admin/accounting/model';

export type FinanceCounterpartySearch = Omit<
  FinanceCounterpartyPickerProps,
  'value' | 'onChange' | 'error'
>;

interface Props {
  values: Pick<FinanceTransactionFormValues, 'counterparty' | 'oneoff' | 'oneoffName'>;
  errors: FinanceTransactionFieldErrors;
  search: FinanceCounterpartySearch;
  onChange: <Field extends FinanceTransactionField>(
    field: Field,
    value: FinanceTransactionFormValues[Field],
  ) => void;
}

/** Who an operation is with: a counterparty from the lists or a one-off name. */
export function FinanceCounterpartyFields({ values, errors, search, onChange }: Props) {
  return (
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
          helperText={errors.oneoffName ?? 'Його можна зробити постійним у «Контрагенти → Разові».'}
          slotProps={{ htmlInput: { maxLength: financeTransactionLimits.oneoffName } }}
          fullWidth
        />
      ) : (
        <FinanceCounterpartyPicker
          {...search}
          value={values.counterparty}
          error={errors.counterparty}
          onChange={(choice) => onChange('counterparty', choice)}
        />
      )}
    </>
  );
}
