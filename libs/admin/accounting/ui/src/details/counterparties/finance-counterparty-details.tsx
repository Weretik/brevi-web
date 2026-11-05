import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';
import { Stack } from '@mui/material';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceCounterparty } from '@admin/accounting/model';

/** Read-only view of a finance counterparty in the side panel. */
export function FinanceCounterpartyDetails({
  counterparty,
}: {
  counterparty: FinanceCounterparty;
}) {
  const category = [counterparty.defaultCategoryRootName, counterparty.defaultSubcategoryName]
    .filter(Boolean)
    .join(' → ');
  return (
    <Stack sx={{ gap: 2 }}>
      {(!counterparty.verified || counterparty.mergedIntoId) && (
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
          {!counterparty.verified && <FinanceProblemPill label="Не підтверджено" />}
          {counterparty.mergedIntoId && <FinanceProblemPill label="Обʼєднано з іншим" />}
        </Stack>
      )}
      <ReferenceFormSection title="Контрагент">
        <ReferenceDetailsList
          items={[
            { label: 'Назва', value: counterparty.name },
            { label: 'ЄДРПОУ / ІПН', value: counterparty.edrpou, mono: true },
            { label: 'IBAN', value: counterparty.iban, mono: true },
            { label: 'Назва в банку', value: counterparty.bankName },
            { label: 'Інші назви', value: counterparty.aliases.join('\n') },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Облік">
        <ReferenceDetailsList
          items={[
            { label: 'Категорія за замовчуванням', value: category },
            {
              label: 'Автоматично для банку',
              value: counterparty.autoApplyCategory ? 'Так' : '',
            },
            { label: 'Операцій', value: String(counterparty.operationCount), mono: true },
            { label: 'Примітка', value: counterparty.note },
          ]}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
