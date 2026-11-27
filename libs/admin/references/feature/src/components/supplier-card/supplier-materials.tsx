import {
  Alert,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export interface SupplierMaterialRow {
  readonly id: number;
  readonly code: string | null;
  readonly name: string;
  readonly price: number;
  /** «м», «шт»…: what the price is for. */
  readonly unit: string;
  readonly isActive: boolean;
}

interface Props {
  rows: readonly SupplierMaterialRow[];
  loading: boolean;
  failed: boolean;
  /** «Тканини» or «Фурнітура», for the empty line. */
  emptyLabel: string;
  onRetry: () => void;
}

const pageSize = 20;
const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const money = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** «Тканини» and «Фурнітура» of a supplier card: code, name and price, 20 per page. */
export function SupplierMaterials({ rows, loading, failed, emptyLabel, onRetry }: Props) {
  const [page, setPage] = useState(0);
  if (failed)
    return (
      <Alert severity="error" action={<Button onClick={onRetry}>Повторити</Button>}>
        Не вдалося завантажити матеріали постачальника.
      </Alert>
    );
  if (!loading && !rows.length)
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyLabel}
      </Typography>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Код</TableCell>
            <TableCell>Назва</TableCell>
            <TableCell sx={{ textAlign: 'right' }}>Ціна, грн</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(page * pageSize, (page + 1) * pageSize).map((row) => (
            <TableRow key={row.id} hover>
              <TableCell sx={mono}>{row.code ?? '—'}</TableCell>
              <TableCell>
                {row.name}
                {!row.isActive && (
                  <Typography component="span" variant="caption" color="text.secondary">
                    {' '}
                    · не використовується
                  </Typography>
                )}
              </TableCell>
              <TableCell sx={{ ...mono, textAlign: 'right', whiteSpace: 'nowrap' }}>
                {money.format(row.price)} / {row.unit}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
        onPageChange={(_event, next) => setPage(next)}
      />
    </TableContainer>
  );
}
