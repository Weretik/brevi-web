import { validateStaffPassword } from '@admin/users/model';
import { Alert, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import { StaffSidePanel } from './staff-side-panel';

import type { FormEvent } from 'react';

interface SetPasswordPanelProps {
  /** Email of the account; the dialog is open while it is set. */
  email: string | null;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (password: string) => Promise<boolean>;
}

export function SetPasswordPanel({
  email,
  error,
  onClose,
  onSubmit,
  submitting,
}: SetPasswordPanelProps) {
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();

  const handleClose = () => {
    setPassword('');
    setFieldError(undefined);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateStaffPassword(password);
    setFieldError(validationError);
    if (validationError) return;

    if (await onSubmit(password)) {
      handleClose();
    }
  };

  return (
    <StaffSidePanel
      description={`${email ?? ''}: після зміни пароля всі сесії цього користувача завершаться.`}
      onClose={handleClose}
      onSubmit={(event) => void handleSubmit(event)}
      open={email !== null}
      submitLabel="Зберегти"
      submitting={submitting}
      title="Новий пароль"
    >
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          autoComplete="new-password"
          error={Boolean(fieldError)}
          helperText={fieldError ?? 'Щонайменше 8 символів.'}
          label="Новий пароль"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </Stack>
    </StaffSidePanel>
  );
}
