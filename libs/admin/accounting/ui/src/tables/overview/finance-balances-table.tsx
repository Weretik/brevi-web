import { financeAccountTypeLabels, formatLedgerDate, formatMinor } from '@admin/accounting/model';
import {
  Link,
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

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceAccount } from '@admin/accounting/model';

interface Props {
  /** Active accounts only. */
  accounts: FinanceAccount[];
  cutoverDate: string;
  /** «Домашня бухгалтерія» shows the archive balance instead of the current one. */
  archive: boolean;
  /** «Рахунки і каси». */
  accountsPath: string;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** «Залишки рахунків»: each active account with its balance in the chosen area. */
export function FinanceBalancesTable({ accounts, cutoverDate, archive, accountsPath }: Props) {
  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby="finance-balances-title"
      sx={{ overflow: 'hidden' }}
    >
      <Stack
        direction="row"
        sx={{
          px: 2,
          py: 1.5,
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography id="finance-balances-title" variant="h6" component="h2">
          Залишки рахунків
        </Typography>
        <Link href={accountsPath} underline="hover" variant="subtitle2">
          Усі рахунки
        </Link>
      </Stack>
      <TableContainer>
        <Table size="small" aria-labelledby="finance-balances-title">
          <TableHead>
            <TableRow>
              <TableCell>Рахунок</TableCell>
              <TableCell align="right">
                {archive ? `Залишок на ${formatLedgerDate(cutoverDate)}` : 'Залишок'}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => {
              const balance = archive
                ? (account.balance?.legacyMinor ?? account.openingMinor)
                : (account.balance?.currentMinor ?? null);
              return (
                <TableRow key={account.id}>
                  <TableCell>
                    {account.name}
                    <Typography variant="caption" component="div" color="text.secondary">
                      {financeAccountTypeLabels[account.type]}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ ...mono, fontWeight: 600 }}>
                    {balance === null ? (
                      <FinanceProblemPill
                        label={`Не підтверджено залишок на ${formatLedgerDate(cutoverDate)}`}
                      />
                    ) : (
                      formatMinor(balance, account.currency)
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {!accounts.length && (
              <TableRow>
                <TableCell colSpan={2}>
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
