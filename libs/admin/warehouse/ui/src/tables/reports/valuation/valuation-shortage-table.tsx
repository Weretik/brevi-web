import { formatMeters, formatMoney } from '@admin/warehouse/model';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { price } from './valuation-format';
import { reportMono } from '../../../components/reports/expandable-row';

import type { ValuationShortage } from '@admin/warehouse/model';

/** Negative balances: the shortage and its value, apart from the stock value. */
export function ValuationShortageTable({ rows }: { rows: readonly ValuationShortage[] }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Дефіцит">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell>Тканина</TableCell>
            <TableCell>Колір</TableCell>
            <TableCell align="right">Нестача</TableCell>
            <TableCell align="right">Ціна</TableCell>
            <TableCell align="right">Оцінка нестачі</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={`${row.fabricCode}|${row.color}`}>
              <TableCell>
                {row.fabricName}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="div"
                  sx={reportMono}
                >
                  {row.fabricCode}
                </Typography>
              </TableCell>
              <TableCell>{row.color}</TableCell>
              <TableCell align="right" sx={{ ...reportMono, color: 'error.main' }}>
                {formatMeters(row.meters)}
              </TableCell>
              <TableCell align="right" sx={reportMono}>
                {price(row.price)}
              </TableCell>
              <TableCell align="right" sx={reportMono}>
                {formatMoney(row.value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
