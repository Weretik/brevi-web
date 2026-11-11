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

import type { ContentSpecGroupValues } from '@admin/content/model';

interface Props {
  label: string;
  groups: ContentSpecGroupValues[];
  disabled: boolean;
  error?: string;
  helperText: string;
  onChange: (groups: ContentSpecGroupValues[]) => void;
}

const emptyRow = { name: '', value: '' };

/**
 * Characteristics as groups («Куртка», «Брюки») with rows of two fields: the name and the value.
 * Groups and rows are added and removed with buttons.
 */
export function ContentSpecsEditor({
  label,
  groups,
  disabled,
  error,
  helperText,
  onChange,
}: Props) {
  const setGroup = (index: number, changes: Partial<ContentSpecGroupValues>) =>
    onChange(groups.map((group, at) => (at === index ? { ...group, ...changes } : group)));

  return (
    <Box role="group" aria-label={label}>
      <Typography variant="caption" color={error ? 'error' : 'text.secondary'}>
        {label}
      </Typography>
      <Stack sx={{ gap: 1.5, mt: 0.5 }}>
        {groups.map((group, index) => {
          const groupName = group.title.trim() || `група ${index + 1}`;
          const setRow = (at: number, changes: Partial<(typeof group.rows)[number]>) =>
            setGroup(index, {
              rows: group.rows.map((row, rowAt) => (rowAt === at ? { ...row, ...changes } : row)),
            });
          return (
            <Stack
              key={index}
              role="group"
              aria-label={`Характеристики: ${groupName}`}
              sx={{ gap: 1, p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}
            >
              <Stack direction="row" sx={{ gap: 1, alignItems: 'flex-start' }}>
                <TextField
                  label="Назва групи"
                  size="small"
                  value={group.title}
                  disabled={disabled}
                  placeholder="Куртка"
                  onChange={(event) => setGroup(index, { title: event.target.value })}
                  fullWidth
                />
                <IconButton
                  aria-label={`Видалити групу: ${groupName}`}
                  disabled={disabled}
                  onClick={() => onChange(groups.filter((_, at) => at !== index))}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
              {group.rows.map((row, at) => (
                <Stack key={at} direction="row" sx={{ gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    label="Назва"
                    size="small"
                    value={row.name}
                    disabled={disabled}
                    onChange={(event) => setRow(at, { name: event.target.value })}
                    slotProps={{ htmlInput: { 'aria-label': `Назва, рядок ${at + 1}` } }}
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    label="Значення"
                    size="small"
                    value={row.value}
                    disabled={disabled}
                    onChange={(event) => setRow(at, { value: event.target.value })}
                    slotProps={{ htmlInput: { 'aria-label': `Значення, рядок ${at + 1}` } }}
                    multiline
                    sx={{ flex: 3 }}
                  />
                  <IconButton
                    aria-label={`Видалити рядок ${at + 1}`}
                    disabled={disabled}
                    onClick={() =>
                      setGroup(index, { rows: group.rows.filter((_, rowAt) => rowAt !== at) })
                    }
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
                  onClick={() => setGroup(index, { rows: [...group.rows, emptyRow] })}
                >
                  Додати рядок
                </Button>
              </Box>
            </Stack>
          );
        })}
        <Box>
          <Button
            type="button"
            size="small"
            startIcon={<AddIcon />}
            disabled={disabled}
            onClick={() => onChange([...groups, { title: '', rows: [emptyRow] }])}
          >
            Додати групу
          </Button>
        </Box>
      </Stack>
      <FormHelperText error={Boolean(error)}>{error ?? helperText}</FormHelperText>
    </Box>
  );
}
