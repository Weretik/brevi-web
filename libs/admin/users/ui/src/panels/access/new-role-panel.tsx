import { roleTitleMaxLength, validateRoleTitle } from '@admin/users/model';
import { Alert, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import { StaffSidePanel } from '../staff/staff-side-panel';

import type { FormEvent } from 'react';

interface NewRolePanelProps {
  open: boolean;
  submitting: boolean;
  /** Server error to show above the form. */
  error: string | null;
  onClose: () => void;
  /** Resolves true when the role was created and the panel may close. */
  onSubmit: (title: string) => Promise<boolean>;
}

/** «Нова роль»: the role starts without rights; they are given on its tab. */
export function NewRolePanel({ error, onClose, onSubmit, open, submitting }: NewRolePanelProps) {
  const [title, setTitle] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleClose = () => {
    setTitle('');
    setFieldError(null);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateRoleTitle(title);
    setFieldError(validation);
    if (validation) return;

    if (await onSubmit(title)) handleClose();
  };

  return (
    <StaffSidePanel
      description="Нова роль спочатку нічого не бачить. Права позначте на її вкладці."
      onClose={handleClose}
      onSubmit={(event) => void handleSubmit(event)}
      open={open}
      submitLabel="Створити"
      submitting={submitting}
      title="Нова роль"
    >
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          autoFocus
          error={Boolean(fieldError)}
          helperText={fieldError ?? `Від 1 до ${roleTitleMaxLength} символів, наприклад «Логіст».`}
          label="Назва ролі"
          onChange={(event) => setTitle(event.target.value)}
          required
          slotProps={{ htmlInput: { maxLength: roleTitleMaxLength } }}
          value={title}
        />
      </Stack>
    </StaffSidePanel>
  );
}
