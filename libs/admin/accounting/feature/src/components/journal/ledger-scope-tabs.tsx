import { formatLedgerDate, ledgerScopeLabels, ledgerScopes } from '@admin/accounting/model';
import { Tab, Tabs } from '@mui/material';

import type { LedgerScope } from '@admin/accounting/model';

interface Props {
  scope: LedgerScope;
  cutoverDate: string;
  onChange: (scope: LedgerScope) => void;
}

/** «Поточний облік з 01.10.2026» / «Домашня бухгалтерія до 01.10.2026». */
export function LedgerScopeTabs({ scope, cutoverDate, onChange }: Props) {
  const cutover = formatLedgerDate(cutoverDate);
  return (
    <Tabs value={scope} onChange={(_, next: LedgerScope) => onChange(next)} sx={{ mb: 2 }}>
      {ledgerScopes.map((value) => (
        <Tab
          key={value}
          value={value}
          label={`${ledgerScopeLabels[value]} ${value === 'Current' ? 'з' : 'до'} ${cutover}`}
        />
      ))}
    </Tabs>
  );
}
