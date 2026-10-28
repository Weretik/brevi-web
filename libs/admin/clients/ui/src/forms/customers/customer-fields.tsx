import { Checkbox, FormControlLabel, MenuItem, Stack, TextField } from '@mui/material';

import type { CustomerDraft } from '@admin/clients/model';

export interface CustomerFieldsProps {
  draft: CustomerDraft;
  errors: Record<string, string>;
  disabled?: boolean;
  showActive?: boolean;
  onChange: (draft: CustomerDraft) => void;
}
export function CustomerFields({
  draft,
  errors,
  disabled,
  showActive = true,
  onChange,
}: CustomerFieldsProps) {
  return (
    <Stack spacing={2}>
      <TextField
        select
        label="Тип клієнта"
        value={draft.kind}
        disabled={disabled}
        onChange={(event) =>
          onChange({ ...draft, kind: event.target.value as CustomerDraft['kind'] })
        }
      >
        <MenuItem value="organization">Організація</MenuItem>
        <MenuItem value="person">Особа</MenuItem>
      </TextField>
      {(
        [
          ['displayName', 'Назва клієнта', 300],
          ['legalName', 'Юридична назва', 500],
          ['taxIdentity', 'ЄДРПОУ / ІПН', 80],
        ] as const
      ).map(([key, label, maxLength]) => (
        <TextField
          key={key}
          label={label}
          required={key === 'displayName'}
          value={draft[key]}
          disabled={disabled}
          error={!!errors[key]}
          helperText={errors[key]}
          slotProps={{ htmlInput: { maxLength } }}
          onChange={(event) => onChange({ ...draft, [key]: event.target.value })}
        />
      ))}
      {showActive && (
        <FormControlLabel
          label="Активний клієнт"
          control={
            <Checkbox
              checked={draft.active}
              disabled={disabled}
              onChange={(_, active) => onChange({ ...draft, active })}
            />
          }
        />
      )}
    </Stack>
  );
}
