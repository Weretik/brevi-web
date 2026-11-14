import { ledgerScopeOfTab, ledgerTabOfScope } from '@admin/accounting/model';
import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { FinanceTransfersJournal } from '../../components/transfers/finance-transfers-journal';
import { useAccountingSettings } from '../../hooks/accounts/use-accounting-settings';

/** «Бухгалтерія → Перекази» between own accounts; «Домашня бухгалтерія» on `?tab=archive`. */
export function FinanceTransfersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scope = ledgerScopeOfTab(searchParams.get('tab'));
  const { cutoverDate, today } = useAccountingSettings();
  return (
    <Box sx={{ minWidth: 0 }}>
      <FinanceTransfersJournal
        key={`${scope}-${cutoverDate}`}
        scope={scope}
        cutoverDate={cutoverDate}
        today={today}
        onScopeChange={(next) => setSearchParams(ledgerTabOfScope(next), { replace: true })}
      />
    </Box>
  );
}

export default FinanceTransfersPage;
