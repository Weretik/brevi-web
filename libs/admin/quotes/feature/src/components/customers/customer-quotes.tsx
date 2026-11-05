import { useListQuotesQuery } from '@admin/quotes/data-access';
import { QuotesTable } from '@admin/quotes/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { GridPaginationModel } from '@mui/x-data-grid';

interface Props {
  customerId: number;
}

/**
 * Client card tab «КП»: this client's КП, in work and archived together, newest change first.
 * A Manager sees only own КП, as in «КП». A row opens the editor.
 */
export function CustomerQuotes({ customerId }: Props) {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const list = useListQuotesQuery({
    archived: false,
    search: '',
    responsibleUserId: null,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
    customerId,
  });

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => navigate('/crm/quotes/new')}>
          Нова КП
        </Button>
      </Stack>
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
        emptyLabel="У цього клієнта ще немає КП"
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        onOpen={(quote) => navigate(`/crm/quotes/${quote.id}`)}
      />
    </Stack>
  );
}
