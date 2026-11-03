import { MEDIA_FOLDER_MAX_DEPTH } from '@admin/media/model';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import type { MediaFolderNode } from '@admin/media/model';

export type MediaFolderAction = 'add-child' | 'edit' | 'delete';

interface Props {
  node: MediaFolderNode;
  onAction: (action: MediaFolderAction, node: MediaFolderNode) => void;
}

export function MediaFolderMenu({ node, onAction }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const run = (action: MediaFolderAction) => {
    setAnchor(null);
    onAction(action, node);
  };
  return (
    <>
      <IconButton
        size="small"
        aria-label={`Дії з папкою «${node.folder.name}»`}
        aria-haspopup="menu"
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{ width: 40, height: 40 }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem disabled={node.depth >= MEDIA_FOLDER_MAX_DEPTH} onClick={() => run('add-child')}>
          Нова підпапка
        </MenuItem>
        <MenuItem onClick={() => run('edit')}>Перейменувати або перемістити</MenuItem>
        <MenuItem onClick={() => run('delete')} sx={{ color: 'error.main' }}>
          Видалити папку
        </MenuItem>
      </Menu>
    </>
  );
}
