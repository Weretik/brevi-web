import {
  useGetFinanceAccountsQuery,
  useGetFinanceOverviewQuery,
} from '@admin/accounting/data-access';
import {
  financeOperationForms,
  financePeriodCaption,
  financePeriodChoices,
  formatFinanceCount,
  formatLedgerDate,
  previousDay,
} from '@admin/accounting/model';
import {
  FinanceAttentionStrip,
  FinanceBalancesTable,
  FinanceExpenseBars,
  FinanceOverviewSummary,
  FinancePeriodForm,
  FinanceSegmentedButtons,
} from '@admin/accounting/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Box, Button, Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import {
  financeAccountsPath,
  financeReviewPath,
  financeTransactionsPath,
} from '../../accounting.routes';
import { useAccountingSettings } from '../../hooks/accounts/use-accounting-settings';

import type { FinancePeriod, FinancePeriodKey, LedgerScope } from '@admin/accounting/model';

/** «Бухгалтерія → Огляд»: what needs attention, totals of a period, balances and top expenses. */
export function FinanceOverviewPage() {
  const { cutoverDate, today } = useAccountingSettings();
  const [scope, setScope] = useState<LedgerScope>('Current');
  const choices = useMemo(
    () => financePeriodChoices(scope, cutoverDate, today),
    [scope, cutoverDate, today],
  );
  const [key, setKey] = useState<FinancePeriodKey>('month');
  const [custom, setCustom] = useState<FinancePeriod | null>(null);
  const [draft, setDraft] = useState<FinancePeriod | null>(null);
  const choice = choices.find((item) => item.key === key) ?? choices[0];
  const period = key === 'custom' && custom ? custom : (choice ?? { from: today, to: today });
  const caption =
    key === 'custom' && custom ? financePeriodCaption(custom) : (choice?.caption ?? '');
  const typed = draft ?? period;

  const query = useGetFinanceOverviewQuery({ ...period, scope });
  const accountsQuery = useGetFinanceAccountsQuery();
  const accounts = useMemo(
    () => (accountsQuery.data ?? []).filter((account) => account.active),
    [accountsQuery.data],
  );
  const loading = query.isLoading || query.isFetching;
  const error = query.error
    ? adminApiErrorMessage(query.error, 'Не вдалося завантажити огляд.')
    : null;
  const overview = query.data;
  const archive = scope === 'LegacyArchive';

  function switchScope() {
    setScope(archive ? 'Current' : 'LegacyArchive');
    setKey(archive ? 'month' : 'all');
    setCustom(null);
    setDraft(null);
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Огляд"
        subtitle={
          archive
            ? `Домашня бухгалтерія до ${formatLedgerDate(previousDay(cutoverDate))}`
            : `Поточний облік з ${formatLedgerDate(cutoverDate)} · дані на ${formatLedgerDate(today)}`
        }
        actions={
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <FinanceSegmentedButtons
              label="Період"
              segments={[
                ...choices.map((item) => ({ value: item.key, label: item.label })),
                { value: 'custom' as const, label: 'Свій період…' },
              ]}
              value={key}
              onChange={(next: FinancePeriodKey) => {
                setKey(next);
                setDraft(null);
              }}
            />
            <Button variant="outlined" onClick={switchScope}>
              {archive ? 'Поточний облік' : 'Домашня бухгалтерія'}
            </Button>
          </Stack>
        }
      />
      <Stack sx={{ gap: 2 }}>
        {key === 'custom' && (
          <FinancePeriodForm value={typed} onChange={setDraft} onApply={setCustom} />
        )}
        <ReferenceListAlerts
          error={error}
          loading={loading}
          onRetry={() => void query.refetch()}
          actionMessage={null}
          onCloseActionMessage={() => undefined}
        />
        {overview && overview.needsReviewCount > 0 && !archive && (
          <FinanceAttentionStrip actionLabel="Перевірити" href={financeReviewPath}>
            <b>{formatFinanceCount(overview.needsReviewCount, financeOperationForms)}</b> чекають
            перевірки
            {reasons(overview.needsCategoryCount, overview.needsCounterpartyCount)}. У залишках вони
            вже враховані.
          </FinanceAttentionStrip>
        )}
        {overview && (
          <FinanceOverviewSummary
            currencies={overview.currencies}
            currentBooks={!archive}
            periodCaption={caption}
          />
        )}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.1fr) minmax(0, 1fr)' },
            alignItems: 'start',
          }}
        >
          <FinanceBalancesTable
            accounts={accounts}
            cutoverDate={cutoverDate}
            archive={archive}
            accountsPath={financeAccountsPath}
          />
          {overview && (
            <FinanceExpenseBars
              currencies={overview.currencies}
              periodCaption={caption}
              journalPath={
                archive ? `${financeTransactionsPath}?tab=archive` : financeTransactionsPath
              }
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
}

/** «: 2 без категорії, 1 з новим контрагентом» — only the reasons that are there. */
function reasons(withoutCategory: number, newCounterparty: number): string {
  const parts = [
    withoutCategory ? `${withoutCategory} без категорії` : '',
    newCounterparty ? `${newCounterparty} з новим контрагентом` : '',
  ].filter(Boolean);
  return parts.length ? `: ${parts.join(', ')}` : '';
}

export default FinanceOverviewPage;
