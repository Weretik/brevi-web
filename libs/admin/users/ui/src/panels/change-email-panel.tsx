import { validateStaffEmail } from '@admin/users/model';
import { Alert, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import { StaffSidePanel } from './staff-side-panel';

import type { FormEvent } from 'react';

export interface OwnEmailChange {
  email: string;
  currentPassword: string;
}

interface ChangeEmailPanelProps {
  open: boolean;
  currentEmail: string;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (change: OwnEmailChange) => Promise<boolean>;
}

/** New login email, confirmed with the current password. */
export function ChangeEmailPanel({
  currentEmail,
  error,
  onClose,
  onSubmit,
  open,
  submitting,
}: ChangeEmailPanelProps) {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; currentPassword?: string }>({});

  const reset = () => {
    setEmail('');
    setCurrentPassword('');
    setErrors({});
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = {
      email:
        validateStaffEmail(email) ??
        (email.trim().toLowerCase() === currentEmail.toLowerCase()
          ? 'Це ваш поточний email.'
          : undefined),
      currentPassword: currentPassword ? undefined : 'Вкажіть поточний пароль.',
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.currentPassword) return;

    if (await onSubmit({ email: email.trim(), currentPassword })) {
      reset();
      onClose();
    }
  };

  return (
    <StaffSidePanel
      description={`Зараз: ${currentEmail}. На інших пристроях потрібно буде увійти знову.`}
      onClose={() => {
        reset();
        onClose();
      }}
      onSubmit={(event) => void handleSubmit(event)}
      open={open}
      submitLabel="Змінити email"
      submitting={submitting}
      title="Новий email"
    >
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          autoComplete="email"
          error={Boolean(errors.email)}
          helperText={errors.email}
          label="Новий email"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
        />
        <TextField
          autoComplete="current-password"
          error={Boolean(errors.currentPassword)}
          helperText={errors.currentPassword ?? 'Для підтвердження, що це ви.'}
          label="Поточний пароль"
          onChange={(event) => setCurrentPassword(event.target.value)}
          type="password"
          value={currentPassword}
        />
      </Stack>
    </StaffSidePanel>
  );
}
