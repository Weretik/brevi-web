import { MenuItem, TextField } from '@mui/material';

import type { MediaFolderOption } from '@admin/media/model';

interface Props {
  label: string;
  value: number | null;
  options: readonly MediaFolderOption[];
  /** Label of the empty choice: «Без папки» for photos, «Верхній рівень» for folders. */
  emptyLabel: string;
  error?: string | null;
  disabled?: boolean;
  onChange: (value: number | null) => void;
}

/** Folder choice as an indented list, so the tree stays readable inside a select. */
export function MediaFolderSelect({
  label,
  value,
  options,
  emptyLabel,
  error,
  disabled,
  onChange,
}: Props) {
  return (
    <TextField
      select
      fullWidth
      label={label}
      value={value === null ? '' : String(value)}
      disabled={disabled}
      error={Boolean(error)}
      helperText={error ?? undefined}
      onChange={(event) => onChange(event.target.value ? Number(event.target.value) : null)}
      slotProps={{
        select: {
          displayEmpty: true,
          renderValue: (selected) =>
            selected
              ? (options.find((option) => String(option.id) === selected)?.path ?? '')
              : emptyLabel,
        },
        inputLabel: { shrink: true },
      }}
    >
      <MenuItem value="">{emptyLabel}</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.id} value={String(option.id)} sx={{ pl: 2 + (option.depth - 1) * 2 }}>
          {option.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
