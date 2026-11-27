import { useGetEmbroideryCalculationsQuery } from '@admin/embroidery/data-access';
import { EmbroiderySavedTable } from '@admin/embroidery/ui';
import { Alert, Button, LinearProgress, Paper, TablePagination, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  customerPublicId: string;
  /** The card's period: calculations saved in it (Kyiv days). */
  from?: string;
  to?: string;
}

const pageSize = 20;

/** Client card tab «Розрахунки вишивки» (CARD-001): saved calculations of this client, 20 per page. */
export function CustomerEmbroidery({ customerPublicId, from, to }: Props) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const list = useGetEmbroideryCalculationsQuery({
    search: '',
    page,
    pageSize,
    customerPublicId,
    from,
    to,
  });
  const rows = list.data?.items ?? [];

  if (list.isError)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => void list.refetch()}>Повторити</Button>}
      >
        Не вдалося завантажити розрахунки вишивки.
      </Alert>
    );
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      {list.isFetching && <LinearProgress aria-label="Завантаження розрахунків" />}
      {!list.isFetching && !rows.length ? (
        <Typography color="text.secondary" sx={{ p: 2 }}>
          {from || to
            ? 'За цей період розрахунків немає'
            : 'Розрахунків вишивки для клієнта ще немає'}
        </Typography>
      ) : (
        <EmbroiderySavedTable
          rows={rows}
          onOpen={(row) => navigate(`/crm/embroidery?tab=saved&calculation=${row.id}`)}
        />
      )}
      <TablePagination
        component="div"
        count={list.data?.total ?? 0}
        page={page - 1}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
        onPageChange={(_event, next) => setPage(next + 1)}
      />
    </Paper>
  );
}
