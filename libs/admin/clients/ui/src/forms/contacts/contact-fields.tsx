import { Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';

import { ContactChannelsFields } from './contact-channels-fields';

import type { ContactDraft } from '@admin/clients/model';

export interface ContactFieldsProps {
  draft: ContactDraft;
  disabled: boolean;
  errors: Record<string, string>;
  onChange: (draft: ContactDraft) => void;
}
export function ContactFields({ draft, disabled, errors, onChange }: ContactFieldsProps) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Ім’я контакту"
        required
        value={draft.name}
        disabled={disabled}
        error={!!errors['name']}
        helperText={errors['name']}
        onChange={(event) => onChange({ ...draft, name: event.target.value })}
      />
      <TextField
        label="Посада"
        value={draft.position}
        disabled={disabled}
        error={!!errors['position']}
        helperText={errors['position']}
        onChange={(event) => onChange({ ...draft, position: event.target.value })}
      />
      <FormControlLabel
        label="Активний контакт"
        control={
          <Checkbox
            checked={draft.active}
            disabled={disabled}
            onChange={(_, active) =>
              onChange({ ...draft, active, isPrimary: active && draft.isPrimary })
            }
          />
        }
      />
      <FormControlLabel
        label="Основний контакт"
        control={
          <Checkbox
            checked={draft.isPrimary}
            disabled={disabled || !draft.active}
            onChange={(_, isPrimary) => onChange({ ...draft, isPrimary })}
          />
        }
      />
      <ContactChannelsFields
        channels={draft.channels}
        disabled={disabled}
        errors={errors}
        onChange={(channels) => onChange({ ...draft, channels })}
      />
    </Stack>
  );
}
