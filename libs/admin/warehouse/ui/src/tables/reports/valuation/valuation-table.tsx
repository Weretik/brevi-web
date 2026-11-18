import { formatMetersNumber, formatMoney } from '@admin/warehouse/model';
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

import { ValuationFabricRow } from './valuation-fabric-row';
import { reportMono } from '../../../components/reports/expandable-row';

import type { ValuationFabric, ValuationReport } from '@admin/warehouse/model';

export { FABRICS_REFERENCE_PATH } from './valuation-fabric-row';

interface Props {
  report: ValuationReport;
  fabrics: readonly ValuationFabric[];
  /** A chip hides everything. */
  filtered: boolean;
}

/**
 * «Вартість»: one row per fabric with its metres, price, value and share of the total, the most valuable first; a
 * fabric without a price is marked with a link to «Тканини». A row opens its colours.
 */
export function ValuationTable({ report, fabrics, filtered }: Props) {
  if (fabrics.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">
          {filtered
            ? 'За цим фільтром нічого немає.'
            : 'На складі немає тканини з додатним залишком.'}
        </Typography>
      </Paper>
    );
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ maxHeight: 'var(--admin-table-height)', overflow: 'auto' }}
    >
      <Table
        size="small"
        stickyHeader
        aria-label="Вартість тканин на складі"
        sx={{ minWidth: 760, '& td, & th': { px: 1.25 } }}
      >
        <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
          <TableRow>
            <TableCell sx={{ width: 40 }} />
            <TableCell>Тканина</TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              Залишок, м
            </TableCell>
            <TableCell align="right" sx={{ width: 130 }}>
              Ціна, грн/м
            </TableCell>
            <TableCell align="right" sx={{ width: 150 }}>
              Вартість
            </TableCell>
            <TableCell sx={{ width: 200 }}>Частка</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fabrics.map((fabric) => (
            <ValuationFabricRow key={fabric.fabricCode} fabric={fabric} total={report.value} />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell />
            <TableCell>{report.isPartial ? 'Разом (без тканин без ціни)' : 'Разом'}</TableCell>
            <TableCell align="right" sx={reportMono}>
              {formatMetersNumber(report.positiveMeters)}
            </TableCell>
            <TableCell />
            <TableCell align="right" sx={reportMono}>
              {formatMoney(report.value)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
