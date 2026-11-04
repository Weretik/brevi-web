import { validateStaffDetails } from '@admin/users/model';
import { Alert, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import { StaffSidePanel } from './staff-side-panel';

import type { StaffAccount, StaffDetailsFieldErrors, StaffDetailsInput } from '@admin/users/model';
import type { FormEvent } from 'react';

interface StaffDetailsPanelProps {
  /** The account being edited; the panel is open while it is set. Mount with `key={account.id}`. */
  account: StaffAccount | null;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (details: StaffDetailsInput) => Promise<boolean>;
}

const toInput = (account: StaffAccount | null): StaffDetailsInput => ({
  fullName: account?.fullName ?? '',
  email: account?.email ?? '',
  phoneNumber: account?.phoneNumber ?? '',
});

/** Name, login email and phone of someone's account, changed by an administrator or the director. */
export function StaffDetailsPanel({
  account,
  error,
  onClose,
  onSubmit,
  submitting,
}: StaffDetailsPanelProps) {
  const [input, setInput] = useState(() => toInput(account));
  const [fieldErrors, setFieldErrors] = useState<StaffDetailsFieldErrors>({});

  const update = (change: Partial<StaffDetailsInput>) =>
    setInput((current) => ({ ...current, ...change }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateStaffDetails(input);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (await onSubmit(input)) onClose();
  };

  return (
    <StaffSidePanel
      description="Якщо змінити email, користувач входитиме з новим, а його сесії завершаться."
      onClose={onClose}
      onSubmit={(event) => void handleSubmit(event)}
      open={account !== null}
      submitLabel="Зберегти"
      submitting={submitting}
      title="Дані користувача"
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
          label="Email (логін)"
          onChange={(event) => update({ email: event.target.value })}
          required
          type="email"
          value={input.email}
        />
        <TextField
          autoComplete="off"
          error={Boolean(fieldErrors.phoneNumber)}
          helperText={fieldErrors.phoneNumber ?? 'Необовʼязково, наприклад +380 50 123 45 67.'}
          label="Телефон"
          onChange={(event) => update({ phoneNumber: event.target.value })}
          type="tel"
          value={input.phoneNumber}
        />
      </Stack>
    </StaffSidePanel>
  );
}
