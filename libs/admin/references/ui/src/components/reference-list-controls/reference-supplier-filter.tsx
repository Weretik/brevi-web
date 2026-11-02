import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

import { ReferenceFilterChip } from './reference-filter-chip';

import type { ReferenceSupplierFilter, ReferenceSupplierOption } from '@admin/references/model';

interface Props {
  options: ReferenceSupplierOption[];
  value: ReferenceSupplierFilter;
  onChange: (value: ReferenceSupplierFilter) => void;
  /** Chip label; the same menu also filters by another name column, such as the operation group. */
  label?: string;
  allLabel?: string;
  emptyLabel?: string;
}

/**
 * Chip with a menu of the names present in the list (suppliers by default) and their counts;
 * selected = inverse chip.
 */
export function ReferenceSupplierFilter({
  options,
  value,
  onChange,
  label = 'Постачальник',
  allLabel = 'Усі постачальники',
  emptyLabel: noSupplierLabel = 'Без постачальника',
}: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const selectedLabel = value === null ? null : value || noSupplierLabel;

  function choose(next: ReferenceSupplierFilter) {
    onChange(next);
    setAnchor(null);
  }

  return (
    <>
      <ReferenceFilterChip
        label={selectedLabel ? `${label}: ${selectedLabel}` : label}
        selected={value !== null}
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
        <MenuItem selected={value === null} onClick={() => choose(null)}>
          <ListItemText>{allLabel}</ListItemText>
        </MenuItem>
        {options.map((option) => (
          <MenuItem
            key={option.value || '—'}
            selected={value === option.value}
            onClick={() => choose(option.value)}
          >
            <ListItemText>{option.value || noSupplierLabel}</ListItemText>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 2, fontFamily: 'var(--admin-font-mono)' }}
            >
              {option.count}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
