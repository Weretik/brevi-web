import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';
import { Button, Tooltip } from '@mui/material';

interface Props {
  saved: boolean;
  dirty: boolean;
  /** An archived КП is read-only: no assigning or repricing. */
  archived: boolean;
  canAssign: boolean;
  canDelete: boolean;
  onAssign: () => void;
  onReprice: () => void;
  onDelete: () => void;
}

/** Header actions of «Товари та ціни»; adding products lives in the products block. */
export function QuoteEditorActions({
  saved,
  dirty,
  archived,
  canAssign,
  canDelete,
  onAssign,
  onReprice,
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
      {canAssign && saved && !archived && (
        <Button
          variant="outlined"
          startIcon={<ForwardToInboxOutlinedIcon />}
          onClick={onAssign}
          disabled={dirty}
        >
          Передати розрахунок
        </Button>
      )}
      {!archived && (
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
      )}
    </>
  );
}
