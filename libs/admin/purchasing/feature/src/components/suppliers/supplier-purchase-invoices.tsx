import { useGetPurchaseInvoicesQuery } from '@admin/purchasing/data-access';
import { SupplierPurchaseInvoicesTable } from '@admin/purchasing/ui';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  supplierId: number;
}

const pageSize = 25;
const registerPath = '/references/counterparties?tab=purchases';

/**
 * Supplier card tab «Рахунки на закупку»: invoices the accountant linked to this supplier, newest first.
 * A row opens the register on that invoice; it is read-only here.
 */
export function SupplierPurchaseInvoices({ supplierId }: Props) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const list = useGetPurchaseInvoicesQuery({
    page,
    pageSize,
    search: '',
    filter: 'All',
    supplierId,
  });

  if (list.isLoading)
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
        <CircularProgress aria-label="Завантажуємо рахунки постачальника" />
      </Box>
    );
  if (list.isError || !list.data)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => void list.refetch()}>Повторити</Button>}
      >
        Не вдалося завантажити рахунки постачальника.
      </Alert>
    );
  if (list.data.total === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        Рахунків цього постачальника ще немає. Їх прив’язують у «Рахунки на закупку» кнопкою
        «Постачальник і примітка».
      </Typography>
    );

  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Рахунків: {list.data.total}. Натисніть рядок, щоб відкрити рахунок у реєстрі.
      </Typography>
      <SupplierPurchaseInvoicesTable
        page={list.data}
        onPageChange={(next) => setPage(next + 1)}
        onOpen={(invoice) =>
          navigate(`${registerPath}&search=${encodeURIComponent(invoice.sourceUid)}`)
        }
      />
    </Stack>
  );
}
