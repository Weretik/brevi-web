import { MenuItem, Stack, TextField } from '@mui/material';

import type { FinanceJournalFilter } from '@admin/accounting/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** First row of the journal filters: the period and the account. */
export function FinanceJournalPeriodFields({
  value,
  accounts,
  onChange,
}: {
  value: FinanceJournalFilter;
  accounts: { id: string; name: string }[];
  onChange: (next: FinanceJournalFilter) => void;
}) {
  const set = <Key extends keyof FinanceJournalFilter>(key: Key, next: FinanceJournalFilter[Key]) =>
    onChange({ ...value, [key]: next });
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
      <TextField
        label="Від"
        type="date"
        value={value.from}
        onChange={(event) => set('from', event.target.value)}
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { style: mono } }}
        fullWidth
      />
      <TextField
        label="До"
        type="date"
        value={value.to}
        onChange={(event) => set('to', event.target.value)}
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { style: mono } }}
        fullWidth
      />
      <TextField
        select
        label="Рахунок"
        value={value.accountId}
        onChange={(event) => set('accountId', event.target.value)}
        fullWidth
      >
        <MenuItem value="">Усі рахунки</MenuItem>
        {accounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.name}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
