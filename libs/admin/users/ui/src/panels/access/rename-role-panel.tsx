import { roleTitleMaxLength, validateRoleTitle } from '@admin/users/model';
import { Alert, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import { StaffSidePanel } from '../staff/staff-side-panel';

import type { FormEvent } from 'react';

interface RenameRolePanelProps {
  /** The current title; null keeps the panel closed. */
  currentTitle: string | null;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  /** Resolves true when the role was renamed and the panel may close. */
  onSubmit: (title: string) => Promise<boolean>;
}

/** «Перейменувати»: a new title for a role made on this page; its rights and people stay. */
export function RenameRolePanel({ currentTitle, ...props }: RenameRolePanelProps) {
  return currentTitle === null ? null : (
    <RenameRoleForm currentTitle={currentTitle} key={currentTitle} {...props} />
  );
}

function RenameRoleForm({
  currentTitle,
  error,
  onClose,
  onSubmit,
  submitting,
}: RenameRolePanelProps & { currentTitle: string }) {
  const [title, setTitle] = useState(currentTitle);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateRoleTitle(title);
    setFieldError(validation);
    if (validation) return;
    if (await onSubmit(title)) onClose();
  };

  return (
    <StaffSidePanel
      description="Права і користувачі ролі залишаться ті самі."
      onClose={onClose}
      onSubmit={(event) => void handleSubmit(event)}
      open
      submitLabel="Перейменувати"
      submitting={submitting}
      title={`Перейменувати «${currentTitle}»`}
    >
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          autoFocus
          error={Boolean(fieldError)}
          helperText={fieldError ?? `Від 1 до ${roleTitleMaxLength} символів.`}
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
