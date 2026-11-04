import { formatMeters, formatMoney } from '@admin/production/model';
import {
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

import type { FabricConsumption } from '@admin/production/model';

interface Props {
  consumption: FabricConsumption;
}

/** «Зведення витрати»: received, issued and corrected per fabric and colour over a period. */
export function FabricConsumptionTable({ consumption }: Props) {
  const seesValue = consumption.issuedValue !== null;
  if (consumption.rows.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        За цей період рухів немає.
      </Typography>
    );
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 520 }}>
      <Table stickyHeader size="small" aria-label="Зведення витрати">
        <TableHead>
          <TableRow>
            <TableCell>Тканина</TableCell>
            <TableCell>Колір</TableCell>
            <TableCell align="right">Прихід</TableCell>
            <TableCell align="right">Видано</TableCell>
            <TableCell align="right">Коригування</TableCell>
            {seesValue && <TableCell align="right">Видано, грн</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {consumption.rows.map((row) => (
            <TableRow key={row.stockId}>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {row.fabricName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.fabricCode}
                </Typography>
              </TableCell>
              <TableCell>{row.color}</TableCell>
              <TableCell align="right">{formatMeters(row.received)}</TableCell>
              <TableCell align="right">{formatMeters(row.issued)}</TableCell>
              <TableCell align="right">{formatMeters(row.corrected)}</TableCell>
              {seesValue && <TableCell align="right">{formatMoney(row.issuedValue)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Разом</TableCell>
            <TableCell align="right">{formatMeters(consumption.received)}</TableCell>
            <TableCell align="right">{formatMeters(consumption.issued)}</TableCell>
            <TableCell />
            {seesValue && (
              <TableCell align="right">{formatMoney(consumption.issuedValue)}</TableCell>
            )}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
