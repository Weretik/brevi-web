import { staffRoleLabels } from '@admin/users/model';
import {
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { StaffAccountActionsMenu } from './staff-account-actions-menu';
import { StaffStatusPill } from '../status/staff-status-pill';

import type { StaffAccountAction } from './staff-account-actions-menu';
import type { StaffAccount } from '@admin/users/model';

interface StaffAccountsTableProps {
  accounts: readonly StaffAccount[];
  currentUserId: number | null;
  error: boolean;
  loading: boolean;
  onAction: (account: StaffAccount, action: StaffAccountAction) => void;
  onRetry: () => void;
}

export function StaffAccountsTable({
  accounts,
  currentUserId,
  error,
  loading,
  onAction,
  onRetry,
}: StaffAccountsTableProps) {
  if (error) {
    return (
      <Alert action={<Button onClick={onRetry}>Повторити</Button>} severity="error">
        Не вдалося завантажити користувачів.
      </Alert>
    );
  }

  return (
    <TableContainer>
      <Table aria-busy={loading} aria-label="Користувачі кабінету">
        <TableHead>
          <TableRow>
            <TableCell>Імʼя</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Роль</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell align="right">
              <Typography component="span" sx={{ clip: 'rect(0 0 0 0)', position: 'absolute' }}>
                Дії
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading && accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>Користувачів ще немає.</TableCell>
            </TableRow>
          ) : null}
          {accounts.map((account) => {
            const isCurrentUser = account.id === currentUserId;

            return (
              <TableRow hover key={account.id}>
                <TableCell>
                  {account.fullName || '—'}
                  {isCurrentUser ? (
                    <Typography color="text.secondary" component="span" variant="body2">
                      {' '}
                      (ви)
                    </Typography>
                  ) : null}
                </TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{staffRoleLabels[account.role]}</TableCell>
                <TableCell>
                  <StaffStatusPill blocked={account.isBlocked} />
                </TableCell>
                <TableCell align="right">
                  <StaffAccountActionsMenu
                    account={account}
                    isCurrentUser={isCurrentUser}
                    onAction={onAction}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
