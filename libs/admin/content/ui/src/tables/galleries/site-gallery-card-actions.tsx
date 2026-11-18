import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';

/** «Раніше», «Пізніше», «Редагувати» and «Прибрати з сайту» under a gallery picture. */
export function SiteGalleryCardActions({
  name,
  first,
  last,
  disabled,
  onMove,
  onEdit,
  onDelete,
}: {
  name: string;
  first: boolean;
  last: boolean;
  disabled: boolean;
  onMove: (by: -1 | 1) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Stack direction="row" sx={{ px: 1, pb: 1, gap: 0.5, alignItems: 'center' }}>
      <Tooltip title="Раніше">
        <span>
          <IconButton
            size="small"
            aria-label={`${name}: раніше`}
            disabled={disabled || first}
            onClick={() => onMove(-1)}
          >
            <ArrowBackOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Пізніше">
        <span>
          <IconButton
            size="small"
            aria-label={`${name}: пізніше`}
            disabled={disabled || last}
            onClick={() => onMove(1)}
          >
            <ArrowForwardOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Box sx={{ flex: 1 }} />
      <Tooltip title="Редагувати">
        <span>
          <IconButton
            size="small"
            aria-label={`Редагувати: ${name}`}
            disabled={disabled}
            onClick={onEdit}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Прибрати з сайту">
        <span>
          <IconButton
            size="small"
            aria-label={`Прибрати: ${name}`}
            disabled={disabled}
            onClick={onDelete}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
