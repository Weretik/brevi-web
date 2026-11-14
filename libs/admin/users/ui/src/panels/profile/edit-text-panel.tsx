import { Alert, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import { StaffSidePanel } from '../staff/staff-side-panel';

import type { FormEvent } from 'react';

interface EditTextPanelProps {
  open: boolean;
  title: string;
  description: string;
  label: string;
  /** Mount the panel with a `key` of this value so it starts from the saved text. */
  initialValue: string;
  hint?: string;
  type?: 'text' | 'tel';
  validate: (value: string) => string | undefined;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  /** Resolves true when saved and the panel may close. */
  onSubmit: (value: string) => Promise<boolean>;
}

/** A side panel with one text field, such as the name or the phone. */
export function EditTextPanel({
  description,
  error,
  hint,
  initialValue,
  label,
  onClose,
  onSubmit,
  open,
  submitting,
  title,
  type = 'text',
  validate,
}: EditTextPanelProps) {
  const [value, setValue] = useState(initialValue);
  const [fieldError, setFieldError] = useState<string | undefined>();

  const handleClose = () => {
    setValue(initialValue);
    setFieldError(undefined);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate(value);
    setFieldError(validationError);
    if (validationError) return;

    if (await onSubmit(value.trim())) {
      setFieldError(undefined);
      onClose();
    }
  };

  return (
    <StaffSidePanel
      description={description}
      onClose={handleClose}
      onSubmit={(event) => void handleSubmit(event)}
      open={open}
      submitLabel="Зберегти"
      submitting={submitting}
      title={title}
    >
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          autoComplete={type === 'tel' ? 'tel' : 'name'}
          error={Boolean(fieldError)}
          helperText={fieldError ?? hint}
          label={label}
          onChange={(event) => setValue(event.target.value)}
          type={type}
          value={value}
        />
      </Stack>
    </StaffSidePanel>
  );
}
