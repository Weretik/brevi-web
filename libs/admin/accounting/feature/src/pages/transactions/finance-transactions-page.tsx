import { ledgerScopeOfTab, ledgerTabOfScope } from '@admin/accounting/model';
import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { FinanceTransactionsJournal } from '../../components/transactions/finance-transactions-journal';
import { useAccountingSettings } from '../../hooks/accounts/use-accounting-settings';

/** «Бухгалтерія → Операції»: incomes and expenses; «Домашня бухгалтерія» on `?tab=archive`. */
export function FinanceTransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scope = ledgerScopeOfTab(searchParams.get('tab'));
  const { cutoverDate, today } = useAccountingSettings();
  return (
    <Box sx={{ minWidth: 0 }}>
      <FinanceTransactionsJournal
        key={`${scope}-${cutoverDate}`}
        scope={scope}
        cutoverDate={cutoverDate}
        today={today}
        onScopeChange={(next) => setSearchParams(ledgerTabOfScope(next), { replace: true })}
      />
    </Box>
  );
}

export default FinanceTransactionsPage;
