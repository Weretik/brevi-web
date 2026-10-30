import { useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

interface Option {
  readonly id: number;
  readonly label: string;
  readonly description?: string;
}

/** Presentational search over options already scoped and resolved by the feature. */
export function IntroductionOptionPicker({
  open,
  title,
  options,
  loading,
  error,
  onClose,
  onSelect,
  search: controlledSearch,
  onSearchChange,
  page = 1,
  totalPages = 1,
  onPageChange,
}: {
  open: boolean;
  title: string;
  options: readonly Option[];
  loading: boolean;
  error?: string | null;
  onClose: () => void;
  onSelect: (id: number) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}) {
  const [search, setSearch] = useState('');
  const query = (controlledSearch ?? search).trim().toLocaleLowerCase('uk');
  const visible = onSearchChange
    ? options
    : options.filter((option) =>
        `${option.label} ${option.description ?? ''}`.toLocaleLowerCase('uk').includes(query),
      );
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Пошук у списку"
            value={controlledSearch ?? search}
            onChange={(event) =>
              onSearchChange ? onSearchChange(event.target.value) : setSearch(event.target.value)
            }
          />
          {error && <Alert severity="error">{error}</Alert>}
          {loading ? (
            <CircularProgress aria-label="Завантаження варіантів" size={24} />
          ) : error ? null : visible.length === 0 ? (
            <Typography color="text.secondary">
              Варіантів не знайдено. Змініть пошук або перевірте довідник.
            </Typography>
          ) : (
            <List aria-label={title} disablePadding>
              {visible.map((option) => (
                <ListItemButton key={option.id} onClick={() => onSelect(option.id)}>
                  <ListItemText primary={option.label} secondary={option.description} />
                </ListItemButton>
              ))}
            </List>
          )}
          {onPageChange && totalPages > 1 && (
            <Pagination
              aria-label="Сторінки варіантів"
              count={totalPages}
              page={page}
              disabled={loading}
              onChange={(_, value) => onPageChange(value)}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
      </DialogActions>
    </Dialog>
  );
}
