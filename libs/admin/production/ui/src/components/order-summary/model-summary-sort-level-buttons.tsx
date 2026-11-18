import { moveModelSummarySortLevel } from '@admin/production/model';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, IconButton, Tooltip } from '@mui/material';

import type { ModelSummarySortLevel } from '@admin/production/model';

interface Props {
  levels: ModelSummarySortLevel[];
  index: number;
  /** The field of this level, for the button names. */
  label: string;
  onChange: (levels: ModelSummarySortLevel[]) => void;
}

/** «Вище», «Нижче» and «Прибрати» of one sort level. */
export function ModelSummarySortLevelButtons({ levels, index, label, onChange }: Props) {
  return (
    <Box>
      <Tooltip title="Вище">
        <span>
          <IconButton
            size="small"
            aria-label={`Підняти: ${label}`}
            disabled={index === 0}
            onClick={() => onChange(moveModelSummarySortLevel(levels, index, -1))}
          >
            <KeyboardArrowUpIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Нижче">
        <span>
          <IconButton
            size="small"
            aria-label={`Опустити: ${label}`}
            disabled={index === levels.length - 1}
            onClick={() => onChange(moveModelSummarySortLevel(levels, index, 1))}
          >
            <KeyboardArrowDownIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Прибрати">
        <IconButton
          size="small"
          aria-label={`Прибрати: ${label}`}
          onClick={() => onChange(levels.filter((_, i) => i !== index))}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
