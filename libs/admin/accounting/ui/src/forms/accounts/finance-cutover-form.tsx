import { formatLedgerDate } from '@admin/accounting/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { TextField, Typography } from '@mui/material';

import type { FinanceCutoverFormValues } from '@admin/accounting/model';

interface Props {
  accountName: string;
  cutoverDate: string;
  values: FinanceCutoverFormValues;
  error: string | null;
  onChange: (values: FinanceCutoverFormValues) => void;
}

/** «Залишок на 01.10»: the balance the current books start from, checked against the bank. */
export function FinanceCutoverForm({ accountName, cutoverDate, values, error, onChange }: Props) {
  return (
    <ReferenceFormSection title={`Залишок на ${formatLedgerDate(cutoverDate)}`}>
      <Typography variant="body2" color="text.secondary">
        Звірте з випискою «{accountName}» на початок дня. З цієї суми починається поточний облік.
      </Typography>
      <TextField
        label="Залишок, грн"
        placeholder="62 546,40"
        value={values.balance}
        onChange={(event) => onChange({ balance: event.target.value })}
        error={Boolean(error)}
        helperText={error}
        slotProps={{
          htmlInput: {
            inputMode: 'decimal',
            style: { fontFamily: 'var(--admin-font-mono)', textAlign: 'right' },
          },
        }}
        autoFocus
        fullWidth
      />
    </ReferenceFormSection>
  );
}
