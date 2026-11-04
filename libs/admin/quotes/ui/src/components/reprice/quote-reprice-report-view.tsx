import { formatQuotePrice, quoteTierLabels, quoteTiers } from '@admin/quotes/model';
import {
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { QuoteRepriceReport } from '@admin/quotes/model';

const mono = {
  fontFamily: 'var(--admin-font-mono)',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
};

/** What «Перерахувати за актуальними цінами» changes (old → new) and what the Catalog cannot price. */
export function QuoteRepriceReportView({ report }: { report: QuoteRepriceReport }) {
  if (report.changes.length === 0 && report.unavailable.length === 0)
    return <Alert severity="info">Ціни в каталозі не змінилися.</Alert>;
  return (
    <Box>
      {report.changes.length > 0 && (
        <Table size="small" aria-label="Зміни цін">
          <TableHead>
            <TableRow>
              <TableCell>Позиція</TableCell>
              {quoteTiers.map((tier) => (
                <TableCell key={tier} align="right">
                  {quoteTierLabels[tier]}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {report.changes.map((change) => (
              <TableRow key={change.optionId}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {change.itemName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {change.optionTitle}
                  </Typography>
                </TableCell>
                {quoteTiers.map((tier) => (
                  <TableCell key={tier} align="right" sx={mono}>
                    {formatQuotePrice(change.before[tier])} → {formatQuotePrice(change.after[tier])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {report.unavailable.map((problem) => (
        <Alert key={problem.optionId} severity="warning" sx={{ mt: 1 }}>
          {problem.itemName}, {problem.optionTitle}: {problem.reason} Стара ціна залишиться.
        </Alert>
      ))}
    </Box>
  );
}
