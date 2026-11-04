import { useGetStaffAccountsQuery } from '@admin/users/data-access';
import { hasDirector } from '@admin/users/model';
import {
  ConfirmActionDialog,
  CreateStaffPanel,
  SetPasswordPanel,
  StaffAccountsTable,
  StaffDetailsPanel,
} from '@admin/users/ui';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Card, Snackbar, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useStaffAccountActions } from '../hooks/use-staff-account-actions';

import type { StaffActor } from '@admin/users/model';

interface UsersPageProps {
  actor: StaffActor;
}

export default function UsersPage({ actor }: UsersPageProps) {
  const accountsQuery = useGetStaffAccountsQuery();
  const accounts = accountsQuery.currentData ?? [];
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const actions = useStaffAccountActions(setSuccessMessage);

  return (
    <Stack component="section" spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ alignItems: { sm: 'flex-end' }, gap: 2, justifyContent: 'space-between' }}
      >
        <div>
          <Typography component="h1" variant="h4">
            Користувачі
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5 }} variant="body2">
            Директор і адміністратори керують користувачами та бачать усі розділи; директора змінює
            лише директор. Менеджери працюють з довідниками, товарами та клієнтами. Бухгалтер поки
            лише переглядає каталог.
          </Typography>
        </div>
        <Button onClick={actions.openCreate} startIcon={<AddIcon />} variant="contained">
          Створити
        </Button>
      </Stack>
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <StaffAccountsTable
          accounts={accounts}
          actor={actor}
          error={accountsQuery.isError}
          loading={accountsQuery.isFetching}
          onAction={actions.startAction}
          onRetry={() => void accountsQuery.refetch()}
        />
      </Card>
      <CreateStaffPanel
        directorExists={hasDirector(accounts)}
        error={actions.error}
        onClose={actions.closeDialogs}
        onSubmit={actions.submitCreate}
        open={actions.isCreateOpen}
        submitting={actions.creating}
      />
      <SetPasswordPanel
        email={actions.passwordTarget?.email ?? null}
        error={actions.error}
        onClose={actions.closeDialogs}
        onSubmit={actions.submitPassword}
        submitting={actions.settingPassword}
      />
      <StaffDetailsPanel
        account={actions.detailsTarget}
        error={actions.error}
        key={actions.detailsTarget?.id ?? 'closed'}
        onClose={actions.closeDialogs}
        onSubmit={actions.submitDetails}
        submitting={actions.updatingDetails}
      />
      <ConfirmActionDialog
        confirmLabel={actions.confirmation?.confirmLabel ?? ''}
        description={actions.confirmation?.description ?? ''}
        destructive={actions.confirmation?.destructive}
        error={actions.error}
        onCancel={actions.closeDialogs}
        onConfirm={() => void actions.confirm()}
        open={actions.confirmation !== null}
        submitting={actions.confirming}
        title={actions.confirmation?.title ?? ''}
      />
      <Snackbar
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        open={successMessage !== null}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
