import { UserAvatar } from '@admin/shared/ui';
import { getStaffAccountPermissions, getStaffRoleTitle, hasDirector } from '@admin/users/model';
import {
  Alert,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { StaffAccountActionsMenu } from './staff-account-actions-menu';
import { StaffStatusPill } from '../components/staff/staff-status-pill';

import type { StaffAccountAction } from './staff-account-actions-menu';
import type { StaffAccount, StaffActor, StaffRoleOption } from '@admin/users/model';

interface StaffAccountsTableProps {
  accounts: readonly StaffAccount[];
  /** The signed-in staff member; decides which actions each row offers. */
  actor: StaffActor;
  error: boolean;
  loading: boolean;
  onAction: (account: StaffAccount, action: StaffAccountAction) => void;
  onRetry: () => void;
  /** Roles from «Права доступу»: titles for the column and choices for the menu. */
  roleOptions: readonly StaffRoleOption[];
}

export function StaffAccountsTable({
  accounts,
  actor,
  error,
  loading,
  onAction,
  onRetry,
  roleOptions,
}: StaffAccountsTableProps) {
  if (error) {
    return (
      <Alert action={<Button onClick={onRetry}>Повторити</Button>} severity="error">
        Не вдалося завантажити користувачів.
      </Alert>
    );
  }

  const directorExists = hasDirector(accounts);

  return (
    <TableContainer>
      <Table aria-busy={loading} aria-label="Користувачі кабінету">
        <TableHead>
          <TableRow>
            <TableCell>Імʼя</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Телефон</TableCell>
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
              <TableCell colSpan={6}>Користувачів ще немає.</TableCell>
            </TableRow>
          ) : null}
          {accounts.map((account) => {
            const isCurrentUser = account.id === actor.id;

            return (
              <TableRow hover key={account.id}>
                <TableCell>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <UserAvatar
                      avatarUrl={account.avatarUrl}
                      email={account.email}
                      name={account.fullName}
                    />
                    <span>
                      {account.fullName || '—'}
                      {isCurrentUser ? (
                        <Typography color="text.secondary" component="span" variant="body2">
                          {' '}
                          (ви)
                        </Typography>
                      ) : null}
                    </span>
                  </Stack>
                </TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{account.phoneNumber ?? '—'}</TableCell>
                <TableCell>{getStaffRoleTitle(account.role, roleOptions)}</TableCell>
                <TableCell>
                  <StaffStatusPill blocked={account.isBlocked} />
                </TableCell>
                <TableCell align="right">
                  <StaffAccountActionsMenu
                    account={account}
                    onAction={onAction}
                    permissions={getStaffAccountPermissions(
                      account,
                      actor,
                      directorExists,
                      roleOptions,
                    )}
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
