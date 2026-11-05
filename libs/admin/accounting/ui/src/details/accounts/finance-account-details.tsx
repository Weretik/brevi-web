import { financeAccountTypeLabels, formatLedgerDate, formatMinor } from '@admin/accounting/model';
import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';
import { Stack } from '@mui/material';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceAccount } from '@admin/accounting/model';
import type { ReactNode } from 'react';

interface Props {
  account: FinanceAccount;
  cutoverDate: string;
  /** Buttons of the cutover section: confirm, change or clear. */
  cutoverActions: ReactNode;
}

const timeFormat = new Intl.DateTimeFormat('uk-UA', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Europe/Kyiv',
});

export function FinanceAccountDetails({ account, cutoverDate, cutoverActions }: Props) {
  const confirmed = account.cutoverConfirmed && account.cutoverBalanceMinor !== null;
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Рахунок">
        <ReferenceDetailsList
          items={[
            { label: 'Назва', value: account.name },
            { label: 'Тип', value: financeAccountTypeLabels[account.type] },
            { label: 'IBAN', value: account.iban, mono: true },
            { label: 'Валюта', value: account.currency, mono: true },
            {
              label: 'Початковий залишок',
              value: `${formatMinor(account.openingMinor, account.currency)} на ${formatLedgerDate(account.openingDate)}`,
              mono: true,
            },
            { label: 'Примітка', value: account.note },
            ...(account.active ? [] : [{ label: 'Статус', value: 'В архіві' }]),
          ]}
        />
      </ReferenceFormSection>
      {account.balance && (
        <ReferenceFormSection title="Залишки">
          <ReferenceDetailsList
            items={[
              {
                label: 'Поточний облік',
                value:
                  account.balance.currentMinor === null
                    ? 'Невідомий, поки не підтверджено залишок на 01.10'
                    : formatMinor(account.balance.currentMinor, account.currency),
                mono: account.balance.currentMinor !== null,
              },
              {
                label: 'Домашня бухгалтерія',
                value: formatMinor(account.balance.legacyMinor, account.currency),
                mono: true,
              },
              {
                label: 'Усі записи разом',
                value: formatMinor(account.balance.totalMinor, account.currency),
                mono: true,
              },
            ]}
          />
        </ReferenceFormSection>
      )}
      <ReferenceFormSection title={`Залишок на ${formatLedgerDate(cutoverDate)}`}>
        {confirmed ? (
          <ReferenceDetailsList
            items={[
              {
                label: 'Сума',
                value: formatMinor(account.cutoverBalanceMinor ?? 0, account.currency),
                mono: true,
              },
              {
                label: 'Підтвердив',
                value: [
                  account.cutoverConfirmedBy,
                  account.cutoverConfirmedAt &&
                    timeFormat.format(new Date(account.cutoverConfirmedAt)),
                ]
                  .filter(Boolean)
                  .join(' · '),
              },
            ]}
          />
        ) : (
          <span>
            <FinanceProblemPill label="Не підтверджено" />
          </span>
        )}
        {cutoverActions}
      </ReferenceFormSection>
    </Stack>
  );
}
