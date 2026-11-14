import {
  useGetFinanceAccountsQuery,
  useGetFinanceOverviewQuery,
} from '@admin/accounting/data-access';
import {
  financeOperationForms,
  financeReviewReasons,
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
import { useMemo } from 'react';

import {
  financeAccountsPath,
  financeReviewPath,
  financeTransactionsPath,
} from '../../accounting.routes';
import { useAccountingSettings } from '../../hooks/accounts/use-accounting-settings';
import { useFinanceOverviewPeriod } from '../../hooks/overview/use-finance-overview-period';

/** «Бухгалтерія → Огляд»: what needs attention, totals of a period, balances and top expenses. */
export function FinanceOverviewPage() {
  const { cutoverDate, today } = useAccountingSettings();
  const view = useFinanceOverviewPeriod(cutoverDate, today);
  const { scope, archive, caption } = view;

  const query = useGetFinanceOverviewQuery({ ...view.period, scope });
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
                ...view.choices.map((item) => ({ value: item.key, label: item.label })),
                { value: 'custom' as const, label: 'Свій період…' },
              ]}
              value={view.key}
              onChange={view.choose}
            />
            <Button variant="outlined" onClick={view.switchScope}>
              {archive ? 'Поточний облік' : 'Домашня бухгалтерія'}
            </Button>
          </Stack>
        }
      />
      <Stack sx={{ gap: 2 }}>
        {view.key === 'custom' && (
          <FinancePeriodForm
            value={view.typed}
            onChange={view.setDraft}
            onApply={view.applyCustom}
          />
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
            {financeReviewReasons(overview.needsCategoryCount, overview.needsCounterpartyCount)}. У
            залишках вони вже враховані.
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

export default FinanceOverviewPage;
