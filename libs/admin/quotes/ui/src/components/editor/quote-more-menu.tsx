import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

interface Props {
  archived: boolean;
  /** Unsaved changes: copy and archive work with the saved КП only. */
  dirty: boolean;
  busy: boolean;
  onHistory: () => void;
  onCopy: () => void;
  onArchive: (archived: boolean) => void;
}

/** «Ще» of a saved КП: «Історія змін», «Копіювати», «В архів» or «Повернути з архіву». */
export function QuoteMoreMenu({ archived, dirty, busy, onHistory, onCopy, onArchive }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const pick = (action: () => void) => () => {
    setAnchor(null);
    action();
  };
  const saveFirst = dirty ? 'Спочатку збережіть зміни' : undefined;
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
        <MenuItem onClick={pick(onHistory)}>
          <ListItemIcon>
            <HistoryOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Історія змін" />
        </MenuItem>
        <MenuItem onClick={pick(onCopy)} disabled={dirty || busy}>
          <ListItemIcon>
            <ContentCopyOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Копіювати"
            secondary={saveFirst ?? 'Нове КП з тими ж товарами та цінами'}
          />
        </MenuItem>
        <MenuItem onClick={pick(() => onArchive(!archived))} disabled={dirty || busy}>
          <ListItemIcon>
            {archived ? (
              <UnarchiveOutlinedIcon fontSize="small" />
            ) : (
              <ArchiveOutlinedIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={archived ? 'Повернути з архіву' : 'В архів'}
            secondary={saveFirst}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
