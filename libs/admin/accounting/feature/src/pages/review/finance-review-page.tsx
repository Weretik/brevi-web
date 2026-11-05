import { useGetFinanceTransactionsQuery } from '@admin/accounting/data-access';
import {
  financeJournalPageSize,
  financeOperationForms,
  formatFinanceCount,
} from '@admin/accounting/model';
import { FinanceSegmentedButtons } from '@admin/accounting/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { FinanceReviewCard } from '../../components/review/finance-review-card';
import { useFinanceChoices } from '../../hooks/journal/use-finance-choices';

import type { VerificationStatus } from '@admin/accounting/model';

type Reason = Exclude<VerificationStatus, 'Verified'> | 'All';

/**
 * «Бухгалтерія → Потребують перевірки»: active operations of the current books without a category
 * or with an unconfirmed finance counterparty, each reviewed right in the list. They still count
 * in balances.
 */
export function FinanceReviewPage() {
  const [page, setPage] = useState(1);
  const [reason, setReason] = useState<Reason>('All');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const choices = useFinanceChoices('Current');
  const query = useGetFinanceTransactionsQuery({
    scope: 'Current',
    needsReview: true,
    sort: 'Date',
    direction: 'Desc',
    page,
  });
  const rows = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / financeJournalPageSize));
  const count = (status: Reason) =>
    status === 'All' ? rows.length : rows.filter((row) => row.verification === status).length;
  const shown = reason === 'All' ? rows : rows.filter((row) => row.verification === reason);
  const loading = query.isLoading || query.isFetching;

  // The last card of a later page was reviewed: go back to the first page.
  useEffect(() => {
    if (query.data && !query.data.items.length && page > 1) setPage(1);
  }, [query.data, page]);
  const error = query.error
    ? adminApiErrorMessage(query.error, 'Не вдалося завантажити операції.')
    : null;

  return (
    <Box sx={{ minWidth: 0, maxWidth: 1040 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Потребують перевірки"
        subtitle={
          total
            ? `${formatFinanceCount(total, financeOperationForms)}. Розберіть кожну прямо тут; дата, рахунок і сума не змінюються. У залишках вони вже враховані`
            : 'Операції без категорії або з новим контрагентом'
        }
        actions={null}
      />
      <Stack sx={{ gap: 2 }}>
        <ReferenceListAlerts
          error={error}
          loading={loading}
          onRetry={() => void query.refetch()}
          actionMessage={actionMessage}
          onCloseActionMessage={() => setActionMessage(null)}
        />
        {rows.length > 0 && (
          <Box>
            <FinanceSegmentedButtons<Reason>
              label="Причина"
              value={reason}
              onChange={setReason}
              segments={[
                { value: 'All', label: `Усі ${count('All')}` },
                { value: 'NeedsCategory', label: `Без категорії ${count('NeedsCategory')}` },
                {
                  value: 'NeedsCounterpartyReview',
                  label: `Новий контрагент ${count('NeedsCounterpartyReview')}`,
                },
              ]}
            />
          </Box>
        )}
        {!loading && !error && !rows.length && (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography color="text.secondary">
              Перевіряти нічого. Нові операції зʼявляться тут.
            </Typography>
          </Paper>
        )}
        {shown.map((transaction) => (
          <FinanceReviewCard
            key={`${transaction.id}-${transaction.version}`}
            transaction={transaction}
            choices={choices}
            onSaved={setActionMessage}
          />
        ))}
        {pages > 1 && (
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
            <Typography variant="body2" color="text.secondary">
              Сторінка {page} з {pages}
            </Typography>
            <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Назад
            </Button>
            <Button disabled={page >= pages} onClick={() => setPage(page + 1)}>
              Далі
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default FinanceReviewPage;
