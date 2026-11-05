import {
  formatLedgerDate,
  formatSignedMinor,
  ledgerScopeLabels,
  movementSourceLabels,
  transactionTypeLabels,
  verificationProblemLabels,
} from '@admin/accounting/model';
import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';
import { Stack } from '@mui/material';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceTransaction } from '@admin/accounting/model';

/** Read-only view of an operation in the side panel. */
export function FinanceTransactionDetails({ transaction }: { transaction: FinanceTransaction }) {
  const problem = verificationProblemLabels[transaction.verification];
  return (
    <Stack sx={{ gap: 2 }}>
      {(transaction.status === 'Void' || problem) && (
        <Stack direction="row" sx={{ gap: 1 }}>
          {transaction.status === 'Void' && <FinanceProblemPill label="Анульовано" />}
          {problem && <FinanceProblemPill label={problem} />}
        </Stack>
      )}
      <ReferenceFormSection title="Операція">
        <ReferenceDetailsList
          items={[
            { label: 'Тип', value: transactionTypeLabels[transaction.type] },
            { label: 'Дата', value: formatLedgerDate(transaction.date), mono: true },
            { label: 'Рахунок', value: transaction.accountName },
            {
              label: 'Сума',
              value: formatSignedMinor(
                transaction.type,
                transaction.amountMinor,
                transaction.currency,
              ),
              mono: true,
            },
            { label: 'Категорія', value: transaction.categoryRootName ?? '' },
            { label: 'Підкатегорія', value: transaction.subcategoryName ?? '' },
            { label: 'Разовий контрагент', value: transaction.oneoffName },
            { label: 'Опис', value: transaction.description },
            { label: 'Примітка', value: transaction.comment },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Облік">
        <ReferenceDetailsList
          items={[
            { label: 'Область', value: ledgerScopeLabels[transaction.scope] },
            { label: 'Джерело', value: movementSourceLabels[transaction.source] },
            { label: 'Додав', value: transaction.createdBy },
          ]}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
