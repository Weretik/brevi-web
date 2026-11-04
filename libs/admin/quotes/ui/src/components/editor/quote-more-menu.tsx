import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import { Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import type { ReactNode } from 'react';

interface Props {
  archived: boolean;
  /** Unsaved changes: copy, archive, assign and reprice work with the saved КП only. */
  dirty: boolean;
  busy: boolean;
  /** Shown in the menu when the page has no own «Історія» button. */
  onHistory?: () => void;
  onCopy: () => void;
  onArchive: (archived: boolean) => void;
  /** Director and Admin: «Передати іншому менеджеру». */
  onAssign?: () => void;
  onReprice?: () => void;
  /** Only a draft can be deleted. */
  onDelete?: () => void;
}

/** «Ще» of a saved КП: every rare action in one menu, the destructive ones last. */
export function QuoteMoreMenu({
  archived,
  dirty,
  busy,
  onHistory,
  onCopy,
  onArchive,
  onAssign,
  onReprice,
  onDelete,
}: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const saveFirst = dirty ? 'Спочатку збережіть зміни' : undefined;
  const item = (
    label: string,
    icon: ReactNode,
    action: () => void,
    options: { secondary?: string; disabled?: boolean; danger?: boolean } = {},
  ) => (
    <MenuItem
      onClick={() => {
        setAnchor(null);
        action();
      }}
      disabled={options.disabled}
      sx={options.danger ? { color: 'error.main' } : undefined}
    >
      <ListItemIcon sx={options.danger ? { color: 'inherit' } : undefined}>{icon}</ListItemIcon>
      <ListItemText primary={label} secondary={options.secondary} />
    </MenuItem>
  );
  const locked = dirty || busy;
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<MoreHorizOutlinedIcon />}
        aria-haspopup="menu"
        aria-expanded={anchor !== null}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        Ще
      </Button>
      <Menu
        anchorEl={anchor}
        open={anchor !== null}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {onHistory && item('Історія змін', <HistoryOutlinedIcon fontSize="small" />, onHistory)}
        {item('Копіювати', <ContentCopyOutlinedIcon fontSize="small" />, onCopy, {
          secondary: saveFirst ?? 'Нове КП з тими ж товарами та цінами',
          disabled: locked,
        })}
        {onAssign &&
          !archived &&
          item(
            'Передати іншому менеджеру',
            <ForwardToInboxOutlinedIcon fontSize="small" />,
            onAssign,
            {
              secondary: saveFirst,
              disabled: locked,
            },
          )}
        {onReprice &&
          !archived &&
          item(
            'Перерахувати за новими цінами',
            <AutorenewOutlinedIcon fontSize="small" />,
            onReprice,
            {
              secondary: saveFirst,
              disabled: locked,
            },
          )}
        <Divider />
        {item(
          archived ? 'Повернути з архіву' : 'В архів',
          archived ? (
            <UnarchiveOutlinedIcon fontSize="small" />
          ) : (
            <ArchiveOutlinedIcon fontSize="small" />
          ),
          () => onArchive(!archived),
          { secondary: saveFirst, disabled: locked },
        )}
        {onDelete &&
          item('Видалити чернетку', <DeleteOutlineOutlinedIcon fontSize="small" />, onDelete, {
            danger: true,
            disabled: busy,
          })}
      </Menu>
    </>
  );
}
