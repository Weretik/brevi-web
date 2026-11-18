import { managerPhotoSrc } from '@admin/content/model';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { Avatar, Box, Button, IconButton, Stack, Tooltip } from '@mui/material';

import type { CompanyManagerFormValues } from '@admin/content/model';

/** Top row of a manager card: the photo with «Змінити» and «Прибрати», the order arrows and «Прибрати менеджера». */
export function CompanyManagerToolbar({
  manager,
  disabled,
  first,
  last,
  onPickPhoto,
  onClearPhoto,
  onMove,
  onRemove,
}: {
  manager: CompanyManagerFormValues;
  disabled: boolean;
  first: boolean;
  last: boolean;
  onPickPhoto: () => void;
  onClearPhoto: () => void;
  onMove: (by: number) => void;
  onRemove: () => void;
}) {
  return (
    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
      <Avatar src={managerPhotoSrc(manager.photoUrl)} sx={{ width: 48, height: 48 }}>
        {manager.name.uk.slice(0, 1)}
      </Avatar>
      <Button size="small" disabled={disabled} onClick={onPickPhoto}>
        {manager.photoUrl ? 'Змінити фото' : 'Обрати фото'}
      </Button>
      {manager.photoUrl && (
        <Button size="small" color="inherit" disabled={disabled} onClick={onClearPhoto}>
          Прибрати фото
        </Button>
      )}
      <Box sx={{ flex: 1 }} />
      <Tooltip title="Вище">
        <span>
          <IconButton
            size="small"
            aria-label="Вище"
            disabled={disabled || first}
            onClick={() => onMove(-1)}
          >
            <ArrowUpwardIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Нижче">
        <span>
          <IconButton
            size="small"
            aria-label="Нижче"
            disabled={disabled || last}
            onClick={() => onMove(1)}
          >
            <ArrowDownwardIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Прибрати менеджера">
        <IconButton
          size="small"
          aria-label="Прибрати менеджера"
          disabled={disabled}
          onClick={onRemove}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
