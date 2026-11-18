import { financeOperationForms, formatFinanceCount, formatMinor } from '@admin/accounting/model';
import { Paper, Stack, Typography } from '@mui/material';

import type { useBankStatement } from '../../hooks/statements/use-bank-statement';

type Totals = NonNullable<NonNullable<ReturnType<typeof useBankStatement>['details']>['totals']>;

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** What «Провести виписку» will add: operations, transfers, income and expense. */
export function BankStatementTotals({ totals }: { totals: Totals }) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ columnGap: 4, rowGap: 1 }}>
        <Typography variant="body2">
          Буде проведено: <b>{formatFinanceCount(totals.operations, financeOperationForms)}</b>
          {totals.transfers > 0 && (
            <>
              {' '}
              і <b>{totals.transfers} переказів</b>
            </>
          )}
        </Typography>
        <Typography variant="body2" sx={{ ...mono, color: 'success.main' }}>
          +{formatMinor(totals.incomeMinor)}
        </Typography>
        <Typography variant="body2" sx={{ ...mono, color: 'error.main' }}>
          −{formatMinor(totals.expenseMinor)}
        </Typography>
      </Stack>
    </Paper>
  );
}
