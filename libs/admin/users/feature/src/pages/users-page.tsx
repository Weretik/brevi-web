import { useGetStaffAccountsQuery } from '@admin/users/data-access';
import {
  ConfirmActionDialog,
  CreateStaffPanel,
  SetPasswordPanel,
  StaffAccountsTable,
} from '@admin/users/ui';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Card, Snackbar, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useStaffAccountActions } from '../hooks/use-staff-account-actions';

interface UsersPageProps {
  currentUserId: number | null;
}

export default function UsersPage({ currentUserId }: UsersPageProps) {
  const accountsQuery = useGetStaffAccountsQuery();
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
            Адміністратори керують користувачами та бачать усі розділи. Менеджери працюють з
            довідниками, товарами та клієнтами.
          </Typography>
        </div>
        <Button onClick={actions.openCreate} startIcon={<AddIcon />} variant="contained">
          Додати користувача
        </Button>
      </Stack>
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <StaffAccountsTable
          accounts={accountsQuery.currentData ?? []}
          currentUserId={currentUserId}
          error={accountsQuery.isError}
          loading={accountsQuery.isFetching}
          onAction={actions.startAction}
          onRetry={() => void accountsQuery.refetch()}
        />
      </Card>
      <CreateStaffPanel
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
