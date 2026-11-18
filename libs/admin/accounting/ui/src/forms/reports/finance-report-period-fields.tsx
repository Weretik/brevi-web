import {
  financeReportKindHints,
  financeReportKindLabels,
  financeReportKinds,
  ledgerScopeLabels,
  ledgerScopes,
} from '@admin/accounting/model';
import { MenuItem, Stack, TextField } from '@mui/material';

import type { FinanceReportFilter, FinanceReportKind, LedgerScope } from '@admin/accounting/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** First row of «Звіти»: the kind of report, the period and the ledger; a new kind or ledger clears the category. */
export function FinanceReportPeriodFields({
  value,
  onChange,
}: {
  value: FinanceReportFilter;
  onChange: (next: FinanceReportFilter) => void;
}) {
  const set = <Key extends keyof FinanceReportFilter>(key: Key, next: FinanceReportFilter[Key]) =>
    onChange({ ...value, [key]: next });
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} sx={{ gap: 2 }}>
      <TextField
        select
        label="Звіт"
        value={value.kind}
        helperText={financeReportKindHints[value.kind]}
        onChange={(event) =>
          onChange({ ...value, kind: event.target.value as FinanceReportKind, categoryId: '' })
        }
        sx={{ flex: 2, minWidth: 0 }}
      >
        {financeReportKinds.map((kind) => (
          <MenuItem key={kind} value={kind}>
            {financeReportKindLabels[kind]}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Від"
        type="date"
        value={value.from}
        onChange={(event) => set('from', event.target.value)}
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { style: mono } }}
        sx={{ flex: 1, minWidth: 0 }}
      />
      <TextField
        label="До"
        type="date"
        value={value.to}
        onChange={(event) => set('to', event.target.value)}
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { style: mono } }}
        sx={{ flex: 1, minWidth: 0 }}
      />
      <TextField
        select
        label="Облік"
        value={value.scope}
        onChange={(event) =>
          onChange({ ...value, scope: event.target.value as LedgerScope | '', categoryId: '' })
        }
        sx={{ flex: 1, minWidth: 0 }}
      >
        {ledgerScopes.map((scope) => (
          <MenuItem key={scope} value={scope}>
            {ledgerScopeLabels[scope]}
          </MenuItem>
        ))}
        <MenuItem value="">Увесь облік</MenuItem>
      </TextField>
    </Stack>
  );
}
