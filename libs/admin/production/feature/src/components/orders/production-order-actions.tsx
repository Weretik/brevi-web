import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import { Button } from '@mui/material';

import type { ProductionOrderPermissions } from '@admin/production/model';

interface Props {
  permissions: ProductionOrderPermissions;
  copying: boolean;
  statusBusy: boolean;
  onBack: () => void;
  onCopy: () => void;
  onClose: () => void;
  onCancel: () => void;
  onReopen: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

/** Buttons of the order header; each shows only when the person may use it. */
export function ProductionOrderActions({
  permissions,
  copying,
  statusBusy,
  onBack,
  onCopy,
  onClose,
  onCancel,
  onReopen,
  onDelete,
  onEdit,
}: Props) {
  return (
    <>
      <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack}>
        До списку
      </Button>
      <Button variant="outlined" startIcon={<PrintOutlinedIcon />} onClick={() => window.print()}>
        Друк
      </Button>
      {permissions.canCopy && (
        <Button
          variant="outlined"
          startIcon={<ContentCopyOutlinedIcon />}
          disabled={copying}
          onClick={onCopy}
        >
          Копіювати
        </Button>
      )}
      {permissions.canClose && (
        <Button
          variant="outlined"
          startIcon={<CheckCircleOutlinedIcon />}
          disabled={statusBusy}
          onClick={onClose}
        >
          Закрити
        </Button>
      )}
      {permissions.canCancel && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<BlockOutlinedIcon />}
          disabled={statusBusy}
          onClick={onCancel}
        >
          Скасувати
        </Button>
      )}
      {permissions.canReopen && (
        <Button
          variant="outlined"
          startIcon={<ReplayOutlinedIcon />}
          disabled={statusBusy}
          onClick={onReopen}
        >
          Повернути в роботу
        </Button>
      )}
      {permissions.canDelete && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlinedIcon />}
          onClick={onDelete}
        >
          Видалити
        </Button>
      )}
      {permissions.canEdit && (
        <Button variant="contained" startIcon={<EditOutlinedIcon />} onClick={onEdit}>
          Редагувати
        </Button>
      )}
    </>
  );
}
