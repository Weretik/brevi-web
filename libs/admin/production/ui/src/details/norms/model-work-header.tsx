import { fabricNormModelCaption } from '@admin/production/model';
import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';

import { compositionMono } from './composition-table-style';

import type { FabricNormRow } from '@admin/production/model';

interface Props {
  row: FabricNormRow;
  name: string;
  batchText: string;
  batchSize: number | null;
  onBatchChange: (value: string) => void;
  onEdit: (() => void) | null;
  onDelete: (() => void) | null;
}

/** The model's caption and name, the batch size field, and the norm actions. */
export function ModelWorkHeader({
  row,
  name,
  batchText,
  batchSize,
  onBatchChange,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={compositionMono}>
          {fabricNormModelCaption(row)}
          {row.modelName && !row.modelIsActive ? ' · вимкнена' : ''}
        </Typography>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <TextField
          label="Рахувати на"
          size="small"
          value={batchText}
          onChange={(event) => onBatchChange(event.target.value)}
          error={batchText.trim() !== '' && batchSize === null}
          sx={{ width: 140 }}
          slotProps={{
            htmlInput: { inputMode: 'numeric', 'aria-label': 'Рахувати на кількість виробів' },
            input: { endAdornment: <InputAdornment position="end">шт.</InputAdornment> },
          }}
        />
        {onDelete && (
          <Button variant="outlined" color="error" onClick={onDelete}>
            Видалити норму
          </Button>
        )}
        {onEdit && (
          <Button variant="contained" onClick={onEdit}>
            {row.norm ? 'Редагувати норму' : 'Задати норму'}
          </Button>
        )}
      </Box>
    </Box>
  );
}
