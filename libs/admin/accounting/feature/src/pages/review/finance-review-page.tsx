import { useGetFinanceTransactionsQuery } from '@admin/accounting/data-access';
import { financeJournalPageSize } from '@admin/accounting/model';
import { FinanceTransactionsGrid } from '@admin/accounting/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Box, Paper } from '@mui/material';
import { useState } from 'react';

import { FinanceReviewDrawer } from '../../components/review/finance-review-drawer';

import type { FinanceTransaction } from '@admin/accounting/model';
import type { GridSortModel } from '@mui/x-data-grid';

const sortKeys: Record<string, string> = { date: 'Date', amountMinor: 'Amount' };

/**
 * «Бухгалтерія → Потребують перевірки»: active operations of the current books without a category
 * or with an unconfirmed finance counterparty. They still count in balances.
 */
export function FinanceReviewPage() {
  const [page, setPage] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'date', sort: 'desc' }]);
  const [reviewing, setReviewing] = useState<FinanceTransaction | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const query = useGetFinanceTransactionsQuery({
    scope: 'Current',
    needsReview: true,
    sort: sortKeys[sortModel[0]?.field ?? 'date'] ?? 'Date',
    direction: sortModel[0]?.sort === 'asc' ? 'Asc' : 'Desc',
    page: page + 1,
  });
  const rows = query.data?.items ?? [];
  const loading = query.isLoading || query.isFetching;
  const error = query.error
    ? adminApiErrorMessage(query.error, 'Не вдалося завантажити операції.')
    : null;
  const open = (transaction: FinanceTransaction) => setReviewing(transaction);

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Потребують перевірки"
        subtitle="Операції без категорії або з непідтвердженим контрагентом. У залишках вони вже враховані"
        actions={null}
      />
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={() => void query.refetch()}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <FinanceTransactionsGrid
          ariaLabel="Потребують перевірки"
          emptyLabel="Усі операції перевірені"
          actionLabel="Перевірити"
          rows={rows}
          rowCount={query.data?.total ?? 0}
          loading={loading}
          searching={false}
          unavailable={Boolean(error)}
          paginationModel={{ page, pageSize: financeJournalPageSize }}
          onPaginationModelChange={(model) => setPage(model.page)}
          sortModel={sortModel}
          onSortModelChange={(model) => {
            setSortModel(model.length ? model : [{ field: 'date', sort: 'desc' }]);
            setPage(0);
          }}
          onView={open}
          onEdit={open}
          onVoid={(id) => {
            const transaction = rows.find((row) => row.id === id);
            if (transaction) open(transaction);
          }}
        />
      </Paper>
      {reviewing && (
        <FinanceReviewDrawer
          key={reviewing.id}
          transaction={reviewing}
          onClose={() => setReviewing(null)}
          onSaved={(message) => {
            setReviewing(null);
            setActionMessage(message);
          }}
        />
      )}
    </Box>
  );
}

export default FinanceReviewPage;
