import { useListTasksQuery } from '@admin/tasks/data-access';
import { TasksTable } from '@admin/tasks/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { GridPaginationModel } from '@mui/x-data-grid';

interface Props {
  customerPublicId: string;
  /** The card's period: tasks created in it (Kyiv days). */
  from?: string;
  to?: string;
}

/**
 * Client card tab «Завдання менеджерам» (CARD-001): open and done tasks about this client, 20 per page.
 * A Manager sees only own tasks, as on «Мої завдання». A row opens the task on the board.
 */
export function CustomerTasks({ customerPublicId, from, to }: Props) {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 20 });
  const list = useListTasksQuery({
    search: '',
    filter: 'All',
    assigneeUserId: null,
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
          Не вдалося завантажити завдання клієнта.
        </Alert>
      )}
      <TasksTable
        rows={list.data?.items ?? []}
        rowCount={list.data?.total ?? 0}
        loading={list.isFetching}
        narrowed={Boolean(from || to)}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        onOpen={(id) => navigate(`/crm/tasks?task=${id}`)}
      />
    </Stack>
  );
}
