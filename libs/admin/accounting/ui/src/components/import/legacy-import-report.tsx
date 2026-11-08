import {
  formatMinor,
  ledgerScopeLabels,
  legacyImportKindLabels,
  legacyImportMovementLabels,
} from '@admin/accounting/model';
import {
  Alert,
  AlertTitle,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { FinanceProblemPill } from '../status/finance-problem-pill';

import type { LegacyFinanceImportReport } from '@admin/accounting/model';
import type { ReactNode } from 'react';

interface Props {
  report: LegacyFinanceImportReport;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const count = (value: number) => value.toLocaleString('uk-UA');

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
              {report.totals.map((row) => (
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
              {report.balances.map((row) => (
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
      </Box>
    </Stack>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Paper component="section" variant="outlined" aria-labelledby={id} sx={{ overflow: 'hidden' }}>
      <Typography
        id={id}
        variant="h6"
        component="h2"
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
      >
        {title}
      </Typography>
      <TableContainer>{children}</TableContainer>
    </Paper>
  );
}
