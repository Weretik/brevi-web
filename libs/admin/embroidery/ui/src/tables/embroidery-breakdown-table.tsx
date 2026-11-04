import { formatEmbroideryMoney } from '@admin/embroidery/model';
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

import { embroideryCostBase } from '../components/calculation/embroidery-cost-text';

import type { EmbroideryCost } from '@admin/embroidery/model';

const number = {
  fontFamily: 'var(--admin-font-mono)',
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'right',
  whiteSpace: 'nowrap',
} as const;

/** «Розшифровка собівартості»: every cost row with its base, the batch sum and the sum per unit. */
export function EmbroideryBreakdownTable({ cost }: { cost: EmbroideryCost }) {
  return (
    <Paper variant="outlined" component="section" aria-label="Розшифровка собівартості">
      <Typography component="h2" variant="h6" sx={{ px: 2, pt: 2, pb: 1 }}>
        Розшифровка собівартості
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Стаття</TableCell>
              <TableCell>База</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>Партія, грн</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>1 шт, грн</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cost.rows.map((row, index) => (
              <TableRow key={`${row.kind}-${row.name}-${index}`}>
                <TableCell>{row.name}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{embroideryCostBase(row)}</TableCell>
                <TableCell sx={number}>{formatEmbroideryMoney(row.amount)}</TableCell>
                <TableCell sx={number}>{formatEmbroideryMoney(row.perUnit)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} sx={{ fontWeight: 700, color: 'text.primary' }}>
                Собівартість
              </TableCell>
              <TableCell sx={{ ...number, fontWeight: 700, color: 'text.primary' }}>
                {formatEmbroideryMoney(cost.total)}
              </TableCell>
              <TableCell sx={{ ...number, fontWeight: 700, color: 'text.primary' }}>
                {formatEmbroideryMoney(cost.perUnit)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
}
