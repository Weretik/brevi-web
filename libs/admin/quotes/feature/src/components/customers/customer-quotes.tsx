import { useListQuotesQuery } from '@admin/quotes/data-access';
import { QuotesTable } from '@admin/quotes/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { GridPaginationModel } from '@mui/x-data-grid';

interface Props {
  customerPublicId: string;
  /** The card's period: КП created in it (Kyiv days). */
  from?: string;
  to?: string;
}

/**
 * Client card tab «КП» (CARD-001): this client's КП created in the period, newest change first,
 * 20 per page. A Manager sees only own КП, as in «КП». A row opens the editor.
 */
export function CustomerQuotes({ customerPublicId, from, to }: Props) {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });
  const list = useListQuotesQuery({
    search: '',
    responsibleUserId: null,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
    customerPublicId,
    from,
    to,
  });

  return (
    <Stack sx={{ gap: 1.5 }}>
      {list.isError && (
        <Alert
          severity="error"
          action={<Button onClick={() => void list.refetch()}>Повторити</Button>}
        >
          Не вдалося завантажити КП клієнта.
        </Alert>
      )}
      <QuotesTable
        rows={list.data?.items ?? []}
        rowCount={list.data?.total ?? 0}
        loading={list.isFetching}
        searching={false}
        withStatus
        emptyLabel={from || to ? 'За цей період КП немає' : 'У цього клієнта ще немає КП'}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        onOpen={(quote) => navigate(`/crm/quotes/${quote.id}`)}
      />
    </Stack>
  );
}
