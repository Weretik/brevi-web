import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton, Tooltip } from '@mui/material';

interface Props {
  name: string;
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

/** «Змінити» and «Видалити» buttons of one composition line; a click does not open the row. */
export function SewingLineActions({ name, disabled = false, onEdit, onDelete }: Props) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Tooltip title="Змінити">
        <span>
          <IconButton
            size="small"
            aria-label={`Змінити: ${name}`}
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Видалити">
        <span>
          <IconButton
            size="small"
            aria-label={`Видалити: ${name}`}
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
