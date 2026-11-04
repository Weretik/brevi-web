import { useGetMyProfileQuery } from '@admin/users/data-access';
import { validateFullName, validatePhoneNumber } from '@admin/users/model';
import {
  ChangeEmailPanel,
  ChangePasswordPanel,
  ConfirmActionDialog,
  EditTextPanel,
  ProfileDetailsCard,
  ProfilePhotoCard,
} from '@admin/users/ui';
import { Alert, Box, Button, CircularProgress, Snackbar, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useProfileActions } from '../hooks/use-profile-actions';

interface ProfilePageProps {
  /** Re-reads the session so the header shows the change. */
  onProfileChanged: () => Promise<void>;
}

export default function ProfilePage({ onProfileChanged }: ProfilePageProps) {
  const profileQuery = useGetMyProfileQuery();
  const profile = profileQuery.currentData;
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const actions = useProfileActions(onProfileChanged, setSuccessMessage);

  if (profileQuery.isError) {
    return (
      <Alert
        action={<Button onClick={() => void profileQuery.refetch()}>Повторити</Button>}
        severity="error"
      >
        Не вдалося завантажити профіль.
      </Alert>
    );
  }

  if (!profile) {
    return (
      <Box aria-label="Завантаження профілю" role="status" sx={{ display: 'grid', py: 8 }}>
        <CircularProgress sx={{ justifySelf: 'center' }} />
      </Box>
    );
  }

  return (
    <Stack component="section" spacing={3}>
      <div>
        <Typography component="h1" variant="h4">
          Мій кабінет
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5 }} variant="body2">
          Ваші дані в Brevi Office. Фото та імʼя бачать інші користувачі.
        </Typography>
      </div>
      <Box
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '320px minmax(0, 1fr)' },
        }}
      >
        <ProfilePhotoCard
          error={actions.photoError}
          onFileSelected={actions.chooseAvatar}
          onRemove={actions.requestRemoveAvatar}
          profile={profile}
          uploading={actions.uploading}
        />
        <ProfileDetailsCard onEdit={actions.openPanel} profile={profile} />
      </Box>
      <EditTextPanel
        description="Імʼя видно в шапці та на сторінці «Користувачі»."
        error={actions.error}
        initialValue={profile.fullName}
        key={`name-${profile.fullName}`}
        label="Імʼя"
        onClose={actions.close}
        onSubmit={actions.submitName}
        open={actions.panel === 'name'}
        submitting={actions.submitting}
        title="Змінити імʼя"
        validate={validateFullName}
      />
      <EditTextPanel
        description="Робочий телефон для колег. Порожнє поле прибирає телефон."
        error={actions.error}
        hint="Наприклад +380 50 123 45 67."
        initialValue={profile.phoneNumber ?? ''}
        key={`phone-${profile.phoneNumber ?? ''}`}
        label="Телефон"
        onClose={actions.close}
        onSubmit={actions.submitPhone}
        open={actions.panel === 'phone'}
        submitting={actions.submitting}
        title="Змінити телефон"
        type="tel"
        validate={validatePhoneNumber}
      />
      <ChangeEmailPanel
        currentEmail={profile.email}
        error={actions.error}
        onClose={actions.close}
        onSubmit={actions.submitEmail}
        open={actions.panel === 'email'}
        submitting={actions.submitting}
      />
      <ChangePasswordPanel
        error={actions.error}
        onClose={actions.close}
        onSubmit={actions.submitPassword}
        open={actions.panel === 'password'}
        submitting={actions.submitting}
      />
      <ConfirmActionDialog
        confirmLabel="Видалити фото"
        description="Замість фото буде показано першу літеру імені."
        destructive
        error={actions.error}
        onCancel={actions.close}
        onConfirm={actions.confirmRemoveAvatar}
        open={actions.confirmRemove}
        submitting={actions.removing}
        title="Видалити фото?"
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
