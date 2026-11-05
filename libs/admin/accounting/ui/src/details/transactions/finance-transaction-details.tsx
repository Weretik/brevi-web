import {
  formatLedgerDate,
  formatSignedMinor,
  ledgerScopeLabels,
  movementSourceLabels,
  transactionCounterpartyLabel,
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
  const counterparty = transactionCounterpartyLabel(transaction);
  return (
    <Stack sx={{ gap: 2 }}>
      {(transaction.status === 'Void' || problem || counterparty.missing) && (
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
          {transaction.status === 'Void' && <FinanceProblemPill label="Анульовано" />}
          {problem && <FinanceProblemPill label={problem} />}
          {counterparty.missing && <FinanceProblemPill label="Контрагента немає в довіднику" />}
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
            {
              label: 'Контрагент',
              value: counterparty.caption
                ? `${counterparty.name} (${counterparty.caption.toLowerCase()})`
                : '',
            },
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
