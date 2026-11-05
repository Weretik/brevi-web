import { financeTransferNoteLimit } from '@admin/accounting/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { MenuItem, Stack, TextField } from '@mui/material';

import type {
  FinanceTransferField,
  FinanceTransferFieldErrors,
  FinanceTransferFormValues,
} from '@admin/accounting/model';

interface Choice {
  id: string;
  name: string;
}

interface Props {
  values: FinanceTransferFormValues;
  errors: FinanceTransferFieldErrors;
  accounts: Choice[];
  onChange: <Field extends FinanceTransferField>(
    field: Field,
    value: FinanceTransferFormValues[Field],
  ) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** Transfer form of the side panel: money between two own accounts of one currency. */
export function FinanceTransferForm({ values, errors, accounts, onChange }: Props) {
  const select = (field: 'fromAccountId' | 'toAccountId', label: string) => (
    <TextField
      select
      label={label}
      value={values[field]}
      onChange={(event) => onChange(field, event.target.value)}
      error={Boolean(errors[field])}
      helperText={errors[field]}
      fullWidth
    >
      {accounts.map((account) => (
        <MenuItem key={account.id} value={account.id}>
          {account.name}
        </MenuItem>
      ))}
    </TextField>
  );
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Переказ">
        {select('fromAccountId', 'З рахунку')}
        {select('toAccountId', 'На рахунок')}
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            label="Сума, грн"
            placeholder="1 000,00"
            value={values.amount}
            onChange={(event) => onChange('amount', event.target.value)}
            error={Boolean(errors.amount)}
            helperText={errors.amount}
            slotProps={{
              htmlInput: { inputMode: 'decimal', style: { ...mono, textAlign: 'right' } },
            }}
            fullWidth
          />
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
      </ReferenceFormSection>
      <TextField
        label="Примітка"
        value={values.note}
        onChange={(event) => onChange('note', event.target.value)}
        error={Boolean(errors.note)}
        helperText={errors.note}
        multiline
        minRows={2}
        slotProps={{ htmlInput: { maxLength: financeTransferNoteLimit } }}
        fullWidth
      />
    </Stack>
  );
}
