import { useListProductsQuery } from '@admin/products/data-access';
import {
  Alert,
  Button,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TablePagination,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const pageSize = 20;
const typeLabels = { Ppe: 'ЗІЗ', Sewing: 'Пошиття' } as const;

/** «Товари» of a supplier card (CARD-001): PPE and sewing products of this supplier, 20 per page. */
export function SupplierProducts({ supplierId }: { supplierId: number }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const list = useListProductsQuery({ page, pageSize, supplierId, sortBy: 'name' });
  const rows = list.data?.value ?? [];

  if (list.isError)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => void list.refetch()}>Повторити</Button>}
      >
        Не вдалося завантажити товари постачальника.
      </Alert>
    );
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      {list.isFetching && <LinearProgress aria-label="Завантаження товарів" />}
      {!list.isFetching && !rows.length && (
        <Typography color="text.secondary" sx={{ p: 2 }}>
          Товарів цього постачальника ще немає.
        </Typography>
      )}
      <List disablePadding>
        {rows.map((product) => (
          <ListItemButton
            key={product.id}
            divider
            onClick={() => navigate(`/references/products/${product.id}`)}
          >
            <ListItemText primary={product.name} secondary={typeLabels[product.type]} />
          </ListItemButton>
        ))}
      </List>
      <TablePagination
        component="div"
        count={list.data?.pagedInfo.totalRecords ?? 0}
        page={page - 1}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
        onPageChange={(_event, next) => setPage(next + 1)}
      />
    </Paper>
  );
}
