import { useGetFabricMovementsQuery } from '@admin/warehouse/data-access';
import { defaultFabricMovementQuery } from '@admin/warehouse/model';
import { FabricMovementPager, FabricMovementsTable } from '@admin/warehouse/ui';
import { Alert, Button, LinearProgress, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  supplierId: number;
  /** The card's period: receipts by operation date. */
  from?: string;
  to?: string;
}

/**
 * «Прихід на склад» of a supplier card (CARD-001): fabric receipts of this supplier in the period, matched by
 * the supplier link or, for older receipts, by the typed name. A row opens it in «Рух тканини».
 */
export function SupplierReceipts({ supplierId, from, to }: Props) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const list = useGetFabricMovementsQuery({
    ...defaultFabricMovementQuery,
    kind: 'Receipt',
    page,
    supplierId,
    from: from ?? null,
    to: to ?? null,
  });

  if (list.isError)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => void list.refetch()}>Повторити</Button>}
      >
        Не вдалося завантажити приходи постачальника.
      </Alert>
    );
  return (
    <Stack>
      {list.isFetching && <LinearProgress aria-label="Завантаження приходів" />}
      <FabricMovementsTable
        rows={list.data?.rows ?? []}
        filtered={Boolean(from || to)}
        onOpen={(row) =>
          navigate(
            `/warehouse/movements?kind=Receipt&search=${encodeURIComponent(row.document ?? row.fabricCode)}`,
          )
        }
      />
      <FabricMovementPager
        page={page}
        hasMore={list.data?.hasMore ?? false}
        total={list.data?.total ?? 0}
        shown={list.data?.rows.length ?? 0}
        disabled={list.isFetching}
        onPage={setPage}
      />
    </Stack>
  );
}
