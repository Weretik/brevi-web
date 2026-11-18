import { formatMinor } from '@admin/accounting/model';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { LegacyImportSection as Section, mono } from './legacy-import-section';
import { FinanceProblemPill } from '../status/finance-problem-pill';

import type { LegacyFinanceImportReport } from '@admin/accounting/model';

/** «Залишки після перенесення»: each account in the archive, at the cutover and now; only problems are marked. */
export function LegacyImportBalancesTable({
  balances,
}: {
  balances: LegacyFinanceImportReport['balances'];
}) {
  return (
    <Section id="legacy-import-balances" title="Залишки після перенесення">
      <Table size="small" aria-labelledby="legacy-import-balances">
        <TableHead>
          <TableRow>
            <TableCell>Рахунок</TableCell>
            <TableCell align="right">На 30.09</TableCell>
            <TableCell align="right">На 01.10</TableCell>
            <TableCell align="right">Зараз</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {balances.map((row) => (
            <TableRow key={row.accountId}>
              <TableCell>
                {row.name}
                {!row.active && (
                  <Typography variant="caption" component="div" color="text.secondary">
                    в архіві
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right" sx={mono}>
                {formatMinor(row.archiveMinor, row.currency)}
              </TableCell>
              <TableCell align="right" sx={mono}>
                {row.cutoverMinor === null ? (
                  row.active ? (
                    <FinanceProblemPill label="Не підтверджено" />
                  ) : (
                    '—'
                  )
                ) : (
                  formatMinor(row.cutoverMinor, row.currency)
                )}
                {row.differenceMinor !== null && (
                  <Box sx={{ mt: 0.5 }}>
                    <FinanceProblemPill
                      label={`Різниця ${formatMinor(row.differenceMinor, row.currency)}`}
                    />
                  </Box>
                )}
              </TableCell>
              <TableCell align="right" sx={mono}>
                {row.currentMinor === null ? '—' : formatMinor(row.currentMinor, row.currency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}
