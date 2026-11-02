import { Chip } from '@mui/material';

import type { MouseEvent, ReactElement } from 'react';

interface Props {
  label: string;
  count?: number;
  selected: boolean;
  icon?: ReactElement;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  ariaHasPopup?: boolean;
}

/** «Цех» filter chip: 32 px pill, count in the label, selected = inverse surface. */
export function ReferenceFilterChip({
  label,
  count,
  selected,
  icon,
  onClick,
  ariaHasPopup,
}: Props) {
  return (
    <Chip
      label={count === undefined ? label : `${label} ${count}`}
      color={selected ? 'secondary' : 'default'}
      variant={selected ? 'filled' : 'outlined'}
      aria-pressed={ariaHasPopup ? undefined : selected}
      aria-haspopup={ariaHasPopup ? 'menu' : undefined}
      icon={icon}
      onClick={onClick}
      sx={{
        height: 32,
        borderRadius: 999,
        fontWeight: 600,
        bgcolor: selected ? undefined : 'background.paper',
        '& .MuiChip-icon': { order: 1, ml: -0.5, mr: 0.75 },
      }}
    />
  );
}
