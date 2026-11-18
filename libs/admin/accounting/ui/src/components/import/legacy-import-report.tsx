import { legacyImportKindLabels } from '@admin/accounting/model';
import {
  Alert,
  AlertTitle,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { LegacyImportBalancesTable } from './legacy-import-balances-table';
import { LegacyImportSection as Section, count, mono } from './legacy-import-section';
import { LegacyImportTotalsTable } from './legacy-import-totals-table';

import type { LegacyFinanceImportReport } from '@admin/accounting/model';

interface Props {
  report: LegacyFinanceImportReport;
}

/**
 * The report of «Перенесення архіву»: what stops the move, what to know, how many records of each kind, how clients and
 * suppliers are linked, totals and balances counted from the file. Only problems are marked.
 */
export function LegacyImportReport({ report }: Props) {
  const { parties } = report;
  const hidden = report.errorCount - report.errors.length;
  return (
    <Stack sx={{ gap: 2 }}>
      {report.errorCount > 0 && (
        <Alert severity="error">
          <AlertTitle>Перенесення неможливе: {count(report.errorCount)} помилок у файлі</AlertTitle>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {report.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </Box>
          {hidden > 0 && <Typography variant="body2">і ще {count(hidden)}</Typography>}
        </Alert>
      )}
      {report.warnings.length > 0 && (
        <Alert severity="warning">
          <AlertTitle>Зверніть увагу</AlertTitle>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {report.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </Box>
        </Alert>
      )}

      <Section id="legacy-import-counts" title="Що переноситься">
        <Table size="small" aria-labelledby="legacy-import-counts">
          <TableHead>
            <TableRow>
              <TableCell>Записи</TableCell>
              <TableCell align="right">У файлі</TableCell>
              <TableCell align="right">Додати</TableCell>
              <TableCell align="right">Уже перенесено</TableCell>
              <TableCell align="right">Не переносимо</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report.counts.map((row) => (
              <TableRow key={row.kind}>
                <TableCell>{legacyImportKindLabels[row.kind]}</TableCell>
                <TableCell align="right" sx={mono}>
                  {count(row.inFile)}
                </TableCell>
                <TableCell align="right" sx={{ ...mono, fontWeight: 600 }}>
                  {count(row.toAdd)}
                </TableCell>
                <TableCell align="right" sx={mono}>
                  {count(row.alreadyMoved)}
                </TableCell>
                <TableCell align="right" sx={mono}>
                  {count(row.skipped)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1.5 }}>
          Клієнти з операціями: {count(parties.clientsLinked)} знайдено в «Клієнтах»
          {parties.clientsAsFinancial > 0 &&
            `, ${count(parties.clientsAsFinancial)} стануть фінансовими контрагентами`}
          . Постачальники: {count(parties.suppliersLinked)} знайдено в «Постачальниках»
          {parties.suppliersAsFinancial > 0 &&
            `, ${count(parties.suppliersAsFinancial)} стануть фінансовими контрагентами`}
          . Без жодної операції ({count(parties.unused)}) не переносимо.
        </Typography>
      </Section>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1.2fr)' },
          alignItems: 'start',
        }}
      >
        <LegacyImportTotalsTable totals={report.totals} />

        <LegacyImportBalancesTable balances={report.balances} />
      </Box>
    </Stack>
  );
}
