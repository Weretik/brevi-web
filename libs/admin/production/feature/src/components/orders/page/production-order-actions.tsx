import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import {
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';

import type { ProductionOrderPermissions } from '@admin/production/model';
import type { ReactNode } from 'react';

interface Props {
  permissions: ProductionOrderPermissions;
  copying: boolean;
  statusBusy: boolean;
  onBack: () => void;
  onHistory: () => void;
  onCopy: () => void;
  onClose: () => void;
  onCancel: () => void;
  onReopen: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

interface Action {
  label: string;
  icon: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  run: () => void;
}

/**
 * The order header: «До списку» (an icon), «Друк», «⋯» and the one main «Редагувати». «⋯» holds the rarer actions («Історія змін»,
 * «Копіювати», «Закрити», «Повернути в роботу») and, after a line, «Скасувати» and «Видалити»; each shows only
 * when the person may use it.
 */
export function ProductionOrderActions({
  permissions,
  copying,
  statusBusy,
  onBack,
  onHistory,
  onCopy,
  onClose,
  onCancel,
  onReopen,
  onDelete,
  onEdit,
}: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const common: Action[] = [
    { label: 'Історія змін', icon: <HistoryOutlinedIcon fontSize="small" />, run: onHistory },
  ];
  if (permissions.canCopy)
    common.push({
      label: 'Копіювати',
      icon: <ContentCopyOutlinedIcon fontSize="small" />,
      disabled: copying,
      run: onCopy,
    });
  if (permissions.canClose)
    common.push({
      label: 'Закрити',
      icon: <CheckCircleOutlinedIcon fontSize="small" />,
      disabled: statusBusy,
      run: onClose,
    });
  if (permissions.canReopen)
    common.push({
      label: 'Повернути в роботу',
      icon: <ReplayOutlinedIcon fontSize="small" />,
      disabled: statusBusy,
      run: onReopen,
    });
  const dangerous: Action[] = [];
  if (permissions.canCancel)
    dangerous.push({
      label: 'Скасувати',
      icon: <BlockOutlinedIcon fontSize="small" />,
      danger: true,
      disabled: statusBusy,
      run: onCancel,
    });
  if (permissions.canDelete)
    dangerous.push({
      label: 'Видалити',
      icon: <DeleteOutlinedIcon fontSize="small" />,
      danger: true,
      run: onDelete,
    });

  const item = (action: Action) => (
    <MenuItem
      key={action.label}
      disabled={action.disabled}
      sx={action.danger ? { color: 'error.main' } : undefined}
      onClick={() => {
        setAnchor(null);
        action.run();
      }}
    >
      <ListItemIcon sx={action.danger ? { color: 'error.main' } : undefined}>
        {action.icon}
      </ListItemIcon>
      <ListItemText>{action.label}</ListItemText>
    </MenuItem>
  );

  const iconSx = {
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
    bgcolor: 'background.paper',
  };
  return (
    <>
      <Tooltip title="До списку">
        <IconButton aria-label="До списку" onClick={onBack} sx={iconSx}>
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      <Button variant="outlined" startIcon={<PrintOutlinedIcon />} onClick={() => window.print()}>
        Друк
      </Button>
      <Tooltip title="Ще">
        <IconButton
          aria-label="Ще дії"
          aria-haspopup="menu"
          aria-expanded={anchor ? true : undefined}
          onClick={(event) => setAnchor(event.currentTarget)}
          sx={iconSx}
        >
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {common.map(item)}
        {dangerous.length > 0 && <Divider />}
        {dangerous.map(item)}
      </Menu>
      {permissions.canEdit && (
        <Button variant="contained" startIcon={<EditOutlinedIcon />} onClick={onEdit}>
          Редагувати
        </Button>
      )}
    </>
  );
}
