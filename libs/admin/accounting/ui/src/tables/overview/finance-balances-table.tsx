import { formatLedgerDate, formatMinor } from '@admin/accounting/model';
import {
  Button,
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
import { useState } from 'react';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceAccount } from '@admin/accounting/model';

interface Props {
  /** Active accounts only. */
  accounts: FinanceAccount[];
  cutoverDate: string;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** «Залишки рахунків»: account and current balance; details add the archive balance. */
export function FinanceBalancesTable({ accounts, cutoverDate }: Props) {
  const [details, setDetails] = useState(false);
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Stack
        direction="row"
        sx={{ px: 2, py: 1.5, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
      >
        <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 600 }}>
          Залишки рахунків
        </Typography>
        <Button size="small" onClick={() => setDetails((value) => !value)} aria-expanded={details}>
          {details ? 'Згорнути деталі' : 'Розгорнути деталі'}
        </Button>
      </Stack>
      <TableContainer>
        <Table size="small" aria-label="Залишки рахунків">
          <TableHead>
            <TableRow>
              <TableCell>Рахунок</TableCell>
              <TableCell align="right">Поточний залишок</TableCell>
              {details && <TableCell align="right">Домашня бухгалтерія</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => {
              const current = account.balance?.currentMinor ?? null;
              return (
                <TableRow key={account.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{account.name}</TableCell>
                  <TableCell align="right" sx={mono}>
                    {current === null ? (
                      <FinanceProblemPill
                        label={`Не підтверджено залишок на ${formatLedgerDate(cutoverDate)}`}
                      />
                    ) : (
                      formatMinor(current, account.currency)
                    )}
                  </TableCell>
                  {details && (
                    <TableCell align="right" sx={mono}>
                      {formatMinor(
                        account.balance?.legacyMinor ?? account.openingMinor,
                        account.currency,
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {!accounts.length && (
              <TableRow>
                <TableCell colSpan={details ? 3 : 2}>
                  <Typography variant="body2" color="text.secondary">
                    Активних рахунків немає.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
