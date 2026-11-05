import {
  formatLedgerDate,
  formatMinor,
  ledgerScopeLabels,
  movementSourceLabels,
} from '@admin/accounting/model';
import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';
import { Stack } from '@mui/material';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceTransfer } from '@admin/accounting/model';

/** Read-only view of a transfer in the side panel. */
export function FinanceTransferDetails({ transfer }: { transfer: FinanceTransfer }) {
  return (
    <Stack sx={{ gap: 2 }}>
      {transfer.status === 'Void' && (
        <span>
          <FinanceProblemPill label="Анульовано" />
        </span>
      )}
      <ReferenceFormSection title="Переказ">
        <ReferenceDetailsList
          items={[
            { label: 'Дата', value: formatLedgerDate(transfer.date), mono: true },
            { label: 'З рахунку', value: transfer.fromAccountName },
            { label: 'На рахунок', value: transfer.toAccountName },
            {
              label: 'Сума',
              value: formatMinor(transfer.amountMinor, transfer.currency),
              mono: true,
            },
            { label: 'Примітка', value: transfer.note },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Облік">
        <ReferenceDetailsList
          items={[
            { label: 'Область', value: ledgerScopeLabels[transfer.scope] },
            { label: 'Джерело', value: movementSourceLabels[transfer.source] },
            { label: 'Додав', value: transfer.createdBy },
          ]}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
