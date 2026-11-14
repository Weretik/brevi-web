import {
  addModelSummarySortLevel,
  modelSummarySortFieldLabels,
  modelSummarySortFields,
  moveModelSummarySortLevel,
} from '@admin/production/model';
import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';

import type {
  ModelSummarySortDirection,
  ModelSummarySortField,
  ModelSummarySortLevel,
} from '@admin/production/model';

interface Props {
  levels: ModelSummarySortLevel[];
  onChange: (levels: ModelSummarySortLevel[]) => void;
}

/**
 * «Сортування за пріоритетом»: the summary is compared by the first field, then by the next one on a tie.
 * Each field is used once.
 */
export function ModelSummarySortEditor({ levels, onChange }: Props) {
  const replace = (index: number, level: ModelSummarySortLevel) =>
    onChange(levels.map((current, i) => (i === index ? level : current)));

  return (
    <Stack spacing={1} aria-label="Сортування за пріоритетом" role="group">
      {levels.map((level, index) => {
        const label = modelSummarySortFieldLabels[level.field];
        return (
          <Stack
            key={level.field}
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ width: 20, fontFamily: 'var(--admin-font-mono)' }}
            >
              {index + 1}.
            </Typography>
            <TextField
              select
              size="small"
              label={index === 0 ? 'Спершу за' : 'Потім за'}
              value={level.field}
              sx={{ minWidth: 200 }}
              onChange={(event) =>
                replace(index, { ...level, field: event.target.value as ModelSummarySortField })
              }
            >
              {modelSummarySortFields.map((field) => (
                <MenuItem
                  key={field}
                  value={field}
                  disabled={field !== level.field && levels.some((x) => x.field === field)}
                >
                  {modelSummarySortFieldLabels[field]}
                </MenuItem>
              ))}
            </TextField>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={level.direction}
              aria-label={`Напрям: ${label}`}
              onChange={(_event, direction: ModelSummarySortDirection | null) =>
                direction && replace(index, { ...level, direction })
              }
            >
              <ToggleButton value="asc" aria-label="За зростанням">
                <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                Зростання
              </ToggleButton>
              <ToggleButton value="desc" aria-label="За спаданням">
                <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                Спадання
              </ToggleButton>
            </ToggleButtonGroup>
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
          </Stack>
        );
      })}
      <Box>
        <Button
          size="small"
          startIcon={<AddIcon />}
          disabled={levels.length >= modelSummarySortFields.length}
          onClick={() => onChange(addModelSummarySortLevel(levels))}
        >
          Додати поле
        </Button>
      </Box>
    </Stack>
  );
}
