import { useGetProductionOrdersQuery } from '@admin/production/data-access';
import { todayIso } from '@admin/production/model';
import { ProductionOrdersGrid } from '@admin/production/ui';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { GridPaginationModel } from '@mui/x-data-grid';

interface Props {
  customerId: number;
}

/**
 * Client card tab «Завдання в цех»: orders made from this client's КП, newest number first.
 * Old orders moved from «Цех» carry no client link and are not listed. A row opens the order.
 */
export function CustomerProductionOrders({ customerId }: Props) {
  const navigate = useNavigate();
  const [today] = useState(todayIso);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const list = useGetProductionOrdersQuery({
    search: '',
    status: null,
    manager: null,
    dueTo: null,
    stage: null,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
    customerId,
  });

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Typography variant="body2" color="text.secondary">
        Завдання, передані в цех із КП цього клієнта. Старі завдання з «Цеху» до клієнта не
        прив’язані й тут не показуються.
      </Typography>
      {list.isError && (
        <Alert
          severity="error"
          action={<Button onClick={() => void list.refetch()}>Повторити</Button>}
        >
          Не вдалося завантажити завдання в цех.
        </Alert>
      )}
      <ProductionOrdersGrid
        rows={list.data?.items ?? []}
        rowCount={list.data?.total ?? 0}
        loading={list.isFetching}
        searching={false}
        today={today}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        onOpen={(order) => navigate(`/production/orders/${order.id}`)}
      />
    </Stack>
  );
}
