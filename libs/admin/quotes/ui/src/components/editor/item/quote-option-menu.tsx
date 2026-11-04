import { quoteTierLabels, quoteTiers } from '@admin/quotes/model';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import type { QuoteOptionDraft, QuoteTier } from '@admin/quotes/model';

interface Props {
  option: QuoteOptionDraft;
  /** Row name for screen readers, «Імпульс, Грета 210». */
  label: string;
  canRemove: boolean;
  onShownChange: (tier: QuoteTier, shown: boolean) => void;
  onRemove: () => void;
}

/** The menu of one price row: hide one of its prices, remove it. */
export function QuoteOptionMenu({ option, label, canRemove, onShownChange, onRemove }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const close = () => setAnchor(null);
  return (
    <>
      <IconButton
        size="small"
        aria-label={`Дії з рядком: ${label}`}
        aria-haspopup="menu"
        aria-expanded={anchor !== null}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        <MoreHorizOutlinedIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={anchor !== null} onClose={close}>
        {quoteTiers.map((tier) => {
          const shown = option.prices[tier].shown;
          return (
            <MenuItem
              key={tier}
              role="menuitemcheckbox"
              aria-checked={shown}
              onClick={() => {
                close();
                onShownChange(tier, !shown);
              }}
            >
              <ListItemIcon>
                {shown ? (
                  <CheckBoxOutlinedIcon fontSize="small" />
                ) : (
                  <CheckBoxOutlineBlankOutlinedIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText primary={`Показати в КП: ${quoteTierLabels[tier]}`} />
            </MenuItem>
          );
        })}
        {canRemove && <Divider />}
        {canRemove && (
          <MenuItem
            onClick={() => {
              close();
              onRemove();
            }}
          >
            Прибрати цей варіант
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
