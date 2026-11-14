import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { ProductionModelSummaryRow } from '@admin/production/model';

interface Props {
  rows: ProductionModelSummaryRow[];
  totalQuantity: number;
  onView: (row: ProductionModelSummaryRow) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' } as const;
const pieces = (value: number) => value.toLocaleString('uk-UA');

/** «Зведення за моделями»: ordered pieces of each model in every filtered order. */
export function ProductionModelSummaryTable({ rows, totalQuantity, onView }: Props) {
  if (rows.length === 0)
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        За цими фільтрами завдань немає.
      </Typography>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Зведення за моделями">
        <TableHead>
          <TableRow>
            <TableCell>Сезон</TableCell>
            <TableCell>Модель</TableCell>
            <TableCell>Категорія</TableCell>
            <TableCell align="right">Кількість виробів</TableCell>
            <TableCell align="right">Завдання</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.modelCode ?? row.modelName} hover>
              <TableCell>
                {row.season ?? (
                  <Typography component="span" variant="body2" color="text.secondary">
                    —
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {row.modelCode && (
                  <Typography component="span" variant="body2" sx={{ ...mono, mr: 1 }}>
                    {row.modelCode}
                  </Typography>
                )}
                {row.modelName}
              </TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell align="right" sx={mono}>
                {pieces(row.quantity)}
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  disabled={!row.modelCode}
                  aria-label={`Переглянути завдання: ${row.modelName}`}
                  onClick={() => onView(row)}
                >
                  Переглянути ({row.ordersCount})
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>
              <Typography variant="subtitle2">Усього виробів</Typography>
            </TableCell>
            <TableCell align="right" sx={{ ...mono, fontWeight: 600 }}>
              {pieces(totalQuantity)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
