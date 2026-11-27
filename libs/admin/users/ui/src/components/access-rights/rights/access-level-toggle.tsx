import { accessLevelLabels } from '@admin/users/model';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import type { AccessLevel } from '@admin/users/model';

interface AccessLevelToggleProps {
  /** Levels this page or group offers, in order. */
  levels: readonly AccessLevel[];
  /** The current level; null when actions were picked one by one or the group is mixed. */
  value: AccessLevel | null;
  label: string;
  disabled: boolean;
  onChange: (level: AccessLevel) => void;
}

/** «Немає · Перегляд · Робота · Усе»: the rights of a page (or a whole group) in one click. */
export function AccessLevelToggle({
  disabled,
  label,
  levels,
  onChange,
  value,
}: AccessLevelToggleProps) {
  return (
    <ToggleButtonGroup
      aria-label={label}
      disabled={disabled}
      exclusive
      onChange={(_event, next: AccessLevel | null) => {
        if (next) onChange(next);
      }}
      size="small"
      sx={{
        flexShrink: 0,
        '& .MuiToggleButton-root': { px: 1.25, py: 0.25, textTransform: 'none' },
      }}
      value={value}
    >
      {levels.map((level) => (
        <ToggleButton key={level} value={level}>
          {accessLevelLabels[level]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
