import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Box,
  Button,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { ContentFactValues } from '@admin/content/model';

interface Props {
  label: string;
  rows: ContentFactValues[];
  disabled: boolean;
  error?: string;
  helperText: string;
  onChange: (rows: ContentFactValues[]) => void;
}

/** Short facts next to the photo as rows of two fields: «Сезон» and «весна, літо, осінь». */
export function ContentFactsEditor({ label, rows, disabled, error, helperText, onChange }: Props) {
  const set = (index: number, changes: Partial<ContentFactValues>) =>
    onChange(rows.map((row, at) => (at === index ? { ...row, ...changes } : row)));

  return (
    <Box role="group" aria-label={label}>
      <Typography variant="caption" color={error ? 'error' : 'text.secondary'}>
        {label}
      </Typography>
      <Stack sx={{ gap: 1, mt: 0.5 }}>
        {rows.map((row, index) => (
          <Stack key={index} direction="row" sx={{ gap: 1, alignItems: 'flex-start' }}>
            <TextField
              label="Назва"
              size="small"
              value={row.label}
              disabled={disabled}
              onChange={(event) => set(index, { label: event.target.value })}
              slotProps={{ htmlInput: { 'aria-label': `${label}: назва, рядок ${index + 1}` } }}
              sx={{ flex: 2 }}
            />
            <TextField
              label="Текст"
              size="small"
              value={row.text}
              disabled={disabled}
              onChange={(event) => set(index, { text: event.target.value })}
              slotProps={{ htmlInput: { 'aria-label': `${label}: текст, рядок ${index + 1}` } }}
              multiline
              sx={{ flex: 3 }}
            />
            <IconButton
              aria-label={`Видалити рядок ${index + 1}`}
              disabled={disabled}
              onClick={() => onChange(rows.filter((_, at) => at !== index))}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        <Box>
          <Button
            type="button"
            size="small"
            startIcon={<AddIcon />}
            disabled={disabled}
            onClick={() => onChange([...rows, { label: '', text: '' }])}
          >
            Додати рядок
          </Button>
        </Box>
      </Stack>
      <FormHelperText error={Boolean(error)}>{error ?? helperText}</FormHelperText>
    </Box>
  );
}
