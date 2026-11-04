import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';
import { Button, Tooltip } from '@mui/material';

interface Props {
  saved: boolean;
  dirty: boolean;
  canAssign: boolean;
  canDelete: boolean;
  onAssign: () => void;
  onReprice: () => void;
  onAddProduct: () => void;
  onAddOneOff: () => void;
  onDelete: () => void;
}

/** Header actions of «Товари та ціни»; «Додати товар» is the one orange action. */
export function QuoteEditorActions({
  saved,
  dirty,
  canAssign,
  canDelete,
  onAssign,
  onReprice,
  onAddProduct,
  onAddOneOff,
  onDelete,
}: Props) {
  const needsSave = !saved || dirty;
  return (
    <>
      {canDelete && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlineOutlinedIcon />}
          onClick={onDelete}
        >
          Видалити
        </Button>
      )}
      {canAssign && saved && (
        <Button
          variant="outlined"
          startIcon={<ForwardToInboxOutlinedIcon />}
          onClick={onAssign}
          disabled={dirty}
        >
          Передати розрахунок
        </Button>
      )}
      <Tooltip title={needsSave ? 'Спочатку збережіть КП.' : ''}>
        <span>
          <Button
            variant="outlined"
            startIcon={<AutorenewOutlinedIcon />}
            onClick={onReprice}
            disabled={needsSave}
          >
            Перерахувати за актуальними цінами
          </Button>
        </span>
      </Tooltip>
      <Button variant="outlined" startIcon={<AddOutlinedIcon />} onClick={onAddOneOff}>
        Додати разовий ЗІЗ
      </Button>
      <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={onAddProduct}>
        Додати товар
      </Button>
    </>
  );
}
