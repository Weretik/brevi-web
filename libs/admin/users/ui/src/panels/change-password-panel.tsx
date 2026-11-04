import { validateStaffPassword } from '@admin/users/model';
import { Alert, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import { StaffSidePanel } from './staff-side-panel';

import type { FormEvent } from 'react';

export interface OwnPasswordChange {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordPanelProps {
  open: boolean;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (change: OwnPasswordChange) => Promise<boolean>;
}

/** Own password change: the current one, then the new one twice. */
export function ChangePasswordPanel({
  error,
  onClose,
  onSubmit,
  open,
  submitting,
}: ChangePasswordPanelProps) {
  const [values, setValues] = useState({ currentPassword: '', newPassword: '', repeat: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof values, string>>>({});

  const reset = () => {
    setValues({ currentPassword: '', newPassword: '', repeat: '' });
    setErrors({});
  };

  const update = (change: Partial<typeof values>) =>
    setValues((current) => ({ ...current, ...change }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = {
      currentPassword: values.currentPassword ? undefined : 'Вкажіть поточний пароль.',
      newPassword: validateStaffPassword(values.newPassword),
      repeat: values.repeat === values.newPassword ? undefined : 'Паролі не збігаються.',
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    if (
      await onSubmit({ currentPassword: values.currentPassword, newPassword: values.newPassword })
    ) {
      reset();
      onClose();
    }
  };

  return (
    <StaffSidePanel
      description="На цьому пристрої ви залишитеся в системі, на інших — потрібно буде увійти знову."
      onClose={() => {
        reset();
        onClose();
      }}
      onSubmit={(event) => void handleSubmit(event)}
      open={open}
      submitLabel="Змінити пароль"
      submitting={submitting}
      title="Новий пароль"
    >
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          autoComplete="current-password"
          error={Boolean(errors.currentPassword)}
          helperText={errors.currentPassword}
          label="Поточний пароль"
          onChange={(event) => update({ currentPassword: event.target.value })}
          type="password"
          value={values.currentPassword}
        />
        <TextField
          autoComplete="new-password"
          error={Boolean(errors.newPassword)}
          helperText={errors.newPassword ?? 'Щонайменше 8 символів.'}
          label="Новий пароль"
          onChange={(event) => update({ newPassword: event.target.value })}
          type="password"
          value={values.newPassword}
        />
        <TextField
          autoComplete="new-password"
          error={Boolean(errors.repeat)}
          helperText={errors.repeat}
          label="Повторіть новий пароль"
          onChange={(event) => update({ repeat: event.target.value })}
          type="password"
          value={values.repeat}
        />
      </Stack>
    </StaffSidePanel>
  );
}
