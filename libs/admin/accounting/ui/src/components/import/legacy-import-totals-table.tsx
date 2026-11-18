import {
  formatMinor,
  ledgerScopeLabels,
  legacyImportMovementLabels,
} from '@admin/accounting/model';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { LegacyImportSection as Section, count, mono } from './legacy-import-section';

import type { LegacyFinanceImportReport } from '@admin/accounting/model';

/** «Суми у файлі»: count and sum per ledger, movement and currency; voided ones apart. */
export function LegacyImportTotalsTable({
  totals,
}: {
  totals: LegacyFinanceImportReport['totals'];
}) {
  return (
    <Section id="legacy-import-totals" title="Суми у файлі">
      <Table size="small" aria-labelledby="legacy-import-totals">
        <TableHead>
          <TableRow>
            <TableCell>Облік</TableCell>
            <TableCell>Рух</TableCell>
            <TableCell align="right">Кількість</TableCell>
            <TableCell align="right">Сума</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {totals.map((row) => (
            <TableRow key={`${row.scope}-${row.movement}-${row.status}-${row.currency}`}>
              <TableCell>{ledgerScopeLabels[row.scope]}</TableCell>
              <TableCell>
                {legacyImportMovementLabels[row.movement]}
                {row.status === 'Void' && (
                  <Typography variant="caption" component="div" color="text.secondary">
                    анульовані
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right" sx={mono}>
                {count(row.count)}
              </TableCell>
              <TableCell align="right" sx={mono}>
                {formatMinor(row.amountMinor, row.currency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}
