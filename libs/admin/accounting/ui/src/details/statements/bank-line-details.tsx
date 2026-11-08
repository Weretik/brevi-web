import { bankDuplicateLabels, formatLedgerDate, formatSignedMinor } from '@admin/accounting/model';
import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import type { BankStatementLine } from '@admin/accounting/model';

/** What the bank file says about a line, read-only, with the reason it needs attention. */
export function BankLineDetails({ line }: { line: BankStatementLine }) {
  const dash = (value: string | null) => value || '—';
  return (
    <Stack sx={{ gap: 2 }}>
      {line.error && <Alert severity="error">{line.error}</Alert>}
      {line.duplicate !== 'None' && (
        <Alert severity="warning">
          {bankDuplicateLabels[line.duplicate]}. {line.duplicateNote}
          {line.duplicate === 'Probable' &&
            ' Рядок не проводиться, поки ви не ввімкнете «Проводити».'}
        </Alert>
      )}
      {line.state === 'NeedsCategory' && (
        <Alert severity="info">Без категорії операція потрапить у «Потребують перевірки».</Alert>
      )}
      {line.state === 'NewCounterparty' && (
        <Alert severity="info">
          Контрагента не знайдено. Під час проведення буде створено нового фінансового контрагента,
          якого треба підтвердити. Або оберіть наявного.
        </Alert>
      )}
      {line.transferAccountName && (
        <Alert severity="info">
          Переказ між своїми рахунками: «{line.transferAccountName}». Категорії й контрагента не
          має.
        </Alert>
      )}
      <ReferenceFormSection title={`Рядок ${line.rowNumber} у файлі банку`}>
        <ReferenceDetailsList
          items={[
            {
              label: 'Дата',
              value: line.date
                ? [formatLedgerDate(line.date), line.time?.slice(0, 5)].filter(Boolean).join(' ')
                : '—',
              mono: true,
            },
            {
              label: 'Сума',
              value:
                line.type && line.amountMinor !== null
                  ? formatSignedMinor(line.type, line.amountMinor, line.currency ?? 'UAH')
                  : '—',
              mono: true,
            },
            { label: 'Контрагент у банку', value: dash(line.bankName) },
            { label: 'ЄДРПОУ', value: dash(line.edrpou), mono: true },
            { label: 'Рахунок', value: dash(line.iban), mono: true },
            { label: 'Призначення', value: dash(line.purpose) },
            { label: 'Документ', value: dash(line.document), mono: true },
          ]}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
