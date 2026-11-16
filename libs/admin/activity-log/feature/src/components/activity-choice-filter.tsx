import { ReferenceFilterChip } from '@admin/references/ui';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { ListItemText, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

export interface ActivityChoice {
  value: string;
  label: string;
}

interface Props {
  label: string;
  allLabel: string;
  options: readonly ActivityChoice[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

/** A «Цех» chip with a menu of choices; the selected one shows in the chip, which turns inverse. */
export function ActivityChoiceFilter({ label, allLabel, options, value, onChange }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const selected = options.find((option) => option.value === value);

  function choose(next: string | undefined) {
    onChange(next);
    setAnchor(null);
  }

  return (
    <>
      <ReferenceFilterChip
        label={selected ? `${label}: ${selected.label}` : label}
        selected={selected !== undefined}
        ariaHasPopup
        icon={<ExpandMoreOutlinedIcon fontSize="small" />}
        onClick={(event) => setAnchor(event.currentTarget)}
      />
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { maxHeight: 360, minWidth: 240 } } }}
      >
        <MenuItem selected={value === undefined} onClick={() => choose(undefined)}>
          <ListItemText>{allLabel}</ListItemText>
        </MenuItem>
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === value}
            onClick={() => choose(option.value)}
          >
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
