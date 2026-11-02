import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

import { ReferenceFilterChip } from './reference-filter-chip';

import type { ReferenceSupplierFilter, ReferenceSupplierOption } from '@admin/references/model';

interface Props {
  options: ReferenceSupplierOption[];
  value: ReferenceSupplierFilter;
  onChange: (value: ReferenceSupplierFilter) => void;
}

const noSupplierLabel = 'Без постачальника';

/** Supplier chip with a menu of suppliers present in the list; selected = inverse chip. */
export function ReferenceSupplierFilter({ options, value, onChange }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const selectedLabel = value === null ? null : value || noSupplierLabel;

  function choose(next: ReferenceSupplierFilter) {
    onChange(next);
    setAnchor(null);
  }

  return (
    <>
      <ReferenceFilterChip
        label={selectedLabel ? `Постачальник: ${selectedLabel}` : 'Постачальник'}
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
          <ListItemText>Усі постачальники</ListItemText>
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
