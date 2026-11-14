import { formatMetersNumber, formatPerProduct, isPlanFactOverrun } from '@admin/warehouse/model';
import { TableCell } from '@mui/material';

import { PlanFactDeviation } from './plan-fact-deviation';
import { signed } from './plan-fact-format';
import { reportMono } from '../../../components/reports/expandable-row';

import type { PlanFactSummary } from '@admin/warehouse/model';

export function PlanFactSummaryCells({ summary }: { summary: PlanFactSummary }) {
  return (
    <>
      <TableCell align="right" sx={reportMono}>
        {summary.orders}
      </TableCell>
      <TableCell align="right" sx={reportMono}>
        {formatPerProduct(summary.planPerProduct)}
      </TableCell>
      <TableCell align="right" sx={reportMono}>
        {formatPerProduct(summary.factPerProduct)}
      </TableCell>
      <TableCell>
        <PlanFactDeviation summary={summary} />
      </TableCell>
      <TableCell
        align="right"
        sx={{ ...reportMono, color: isPlanFactOverrun(summary) ? 'error.main' : undefined }}
      >
        {summary.difference === null
          ? '—'
          : signed(summary.difference, (x) => formatMetersNumber(x ?? 0))}
      </TableCell>
    </>
  );
}
