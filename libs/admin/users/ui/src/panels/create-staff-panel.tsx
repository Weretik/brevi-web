import { staffRoleLabels, staffRoles, validateStaffAccountInput } from '@admin/users/model';
import { Alert, MenuItem, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import { StaffSidePanel } from './staff-side-panel';

import type {
  CreateStaffAccountInput,
  StaffAccountFieldErrors,
  StaffRole,
} from '@admin/users/model';
import type { FormEvent } from 'react';

const emptyInput: CreateStaffAccountInput = {
  email: '',
  fullName: '',
  role: 'Manager',
  password: '',
};

interface CreateStaffPanelProps {
  open: boolean;
  submitting: boolean;
  /** Server error to show above the form. */
  error: string | null;
  onClose: () => void;
  /** Resolves true when the account was created and the dialog may close. */
  onSubmit: (input: CreateStaffAccountInput) => Promise<boolean>;
}

export function CreateStaffPanel({
  error,
  onClose,
  onSubmit,
  open,
  submitting,
}: CreateStaffPanelProps) {
  const [input, setInput] = useState(emptyInput);
  const [fieldErrors, setFieldErrors] = useState<StaffAccountFieldErrors>({});

  const update = (change: Partial<CreateStaffAccountInput>) =>
    setInput((current) => ({ ...current, ...change }));

  const handleClose = () => {
    setInput(emptyInput);
    setFieldErrors({});
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateStaffAccountInput(input);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (await onSubmit(input)) {
      handleClose();
    }
  };

  return (
    <StaffSidePanel
      description="Співробітник входить до кабінету з цим email і паролем."
      onClose={handleClose}
      onSubmit={(event) => void handleSubmit(event)}
      open={open}
      submitLabel="Створити"
      submitting={submitting}
      title="Новий користувач"
    >
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          error={Boolean(fieldErrors.fullName)}
          helperText={fieldErrors.fullName}
          label="Імʼя"
          onChange={(event) => update({ fullName: event.target.value })}
          required
          value={input.fullName}
        />
        <TextField
          autoComplete="off"
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
          label="Email"
          onChange={(event) => update({ email: event.target.value })}
          required
          type="email"
          value={input.email}
        />
        <TextField
          label="Роль"
          onChange={(event) => update({ role: event.target.value as StaffRole })}
          select
          value={input.role}
        >
          {staffRoles.map((role) => (
            <MenuItem key={role} value={role}>
              {staffRoleLabels[role]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          autoComplete="new-password"
          error={Boolean(fieldErrors.password)}
          helperText={
            fieldErrors.password ?? 'Щонайменше 8 символів. Передайте пароль користувачу особисто.'
          }
          label="Пароль"
          onChange={(event) => update({ password: event.target.value })}
          required
          type="password"
          value={input.password}
        />
      </Stack>
    </StaffSidePanel>
  );
}
